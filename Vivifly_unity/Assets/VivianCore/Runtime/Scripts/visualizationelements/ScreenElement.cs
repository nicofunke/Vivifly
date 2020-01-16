// Copyright 2019 Patrick Harms
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Video;

namespace de.ugoe.cs.vivian.core
{
    /**
     * This class represents a screen for visualizing content
     */
    public class ScreenElement : VisualizationElement<ScreenSpec, string>
    {
        /** the image component used for visualization */
        private RawImage Image;

        /** the asset bundle to use for loading screen content */
        private AssetBundle AssetBundle;

        /** the content of the currently shown file */
        private Texture2D ImageContent = null;

        /** the video player component used for visualization */
        private VideoPlayer VideoPlayer;

        /** the content of the currently shown file */
        private VideoClip VideoContent;


        /**
         * Called to initialize the visualization element with the specification and the represented game object
         */
        internal new void Initialize(ScreenSpec spec, GameObject representedObject)
        {
            throw new System.NotSupportedException("you need to call the other initialize method for this component");
        }

        /**
         * Called to initialize the visualization element with the specification and the represented game object
         */
        internal void Initialize(ScreenSpec spec, GameObject representedObject, AssetBundle assetBundle)
        {
            base.Initialize(spec, representedObject);

            this.AssetBundle = assetBundle;

            // add a canvas to draw the screen content onto.
            Canvas canvas = this.gameObject.AddComponent<Canvas>();
            canvas.renderMode = RenderMode.WorldSpace;

            // scale the canvas to that it fits the object size
            Mesh mesh = base.RepresentedObject.GetComponent<MeshFilter>().mesh;
            RectTransform transform = this.gameObject.GetComponent<RectTransform>();

            Vector3 effectiveSize = Vector3.Scale(mesh.bounds.size, base.RepresentedObject.transform.lossyScale);

            transform.localScale = new Vector3(mesh.bounds.size.x / spec.Resolution.x,
                                               mesh.bounds.size.y / spec.Resolution.y,
                                               mesh.bounds.size.z);

            // set the resolution of the canvas to the provided one
            transform.sizeDelta = spec.Resolution;

            // compensate for the usually wrong orientation of the canvas (away from camera)
            transform.rotation = base.RepresentedObject.transform.rotation * Quaternion.LookRotation(-spec.Plane);

            // move the canvas so that it is minimally above the screen
            transform.Translate((Vector3.Scale(-spec.Plane.normalized, effectiveSize) / 2) + (0.0005f * -spec.Plane.normalized));

            // add an image object to draw image contents
            GameObject imageObject = new GameObject("ScreenContent" + spec.Name);
            imageObject.transform.parent = this.gameObject.transform;

            this.Image = imageObject.AddComponent<RawImage>();
            transform = imageObject.GetComponent<RectTransform>();
            transform.sizeDelta = spec.Resolution;
            transform.localPosition = Vector3.zero;
            transform.localScale = new Vector3(1, 1, 1);
            transform.rotation = new Quaternion();

            if (spec.IsVideo)
            {
                RenderTextureDescriptor descriptor = new RenderTextureDescriptor();
                descriptor.dimension = UnityEngine.Rendering.TextureDimension.Tex2D;
                descriptor.width = 256;
                descriptor.height = 256;
                descriptor.volumeDepth = 1;
                descriptor.msaaSamples = 1;
                descriptor.colorFormat = RenderTextureFormat.ARGB32;
                descriptor.depthBufferBits = 24;
                //descriptor.useDynamicScale = false;
                descriptor.autoGenerateMips = true;

                RenderTexture renderTexture = new RenderTexture(descriptor);
                renderTexture.filterMode = FilterMode.Bilinear;
                renderTexture.useMipMap = false;
                renderTexture.wrapMode = TextureWrapMode.Clamp;

                this.Image.texture = renderTexture;

                this.VideoPlayer = imageObject.AddComponent<VideoPlayer>();
                // render the video to the render texture given to the raw image
                this.VideoPlayer.targetTexture = (RenderTexture)this.Image.texture;
                // Match the ratio to the screen's
                this.VideoPlayer.aspectRatio = VideoAspectRatio.Stretch;
            }

            this.HideContent();
        }

        /**
         * Called to visualize any value
         */
        internal override void Visualize(object value)
        {
            if (value is bool)
            {
                this.Visualize((bool)value);
            }
            else if (value is float)
            {
                this.Visualize((float)value);
            }
            else if (value is string)
            {
                this.Visualize((string)value);
            }
            else
            {
                throw new System.NotSupportedException("cannot visualize values of type " + value.GetType());
            }
        }

        /**
         * Called to visualize a bool value
         */
        internal override void Visualize(bool value)
        {
            if (value)
            {
                ShowContent();
            }
            else
            {
                HideContent();
            }
        }

        /**
         * Called to visualize a float value
         */
        internal override void Visualize(float value)
        {
            if (value > 0.0)
            {
                ShowContent();
            }
            else
            {
                HideContent();
            }
        }

        /**
         * Called to visualize a string value, which is supposed to be screen content
         */
        internal void Visualize(string value)
        {
            if (!base.Spec.IsVideo)
            {
                this.ImageContent = this.AssetBundle.LoadAsset<Texture2D>(value);
            }
            else
            {
                if (!value.Contains("://"))
                {
                    this.VideoContent = this.AssetBundle.LoadAsset<VideoClip>(value);
                    this.VideoPlayer.clip = this.VideoContent;
                }
                else
                {
                    this.VideoPlayer.url = value;
                }
            }

            ShowContent();
        }

        /**
         * convenience method to actually show the image content
         */
        private void ShowContent()
        {
            if (!base.Spec.IsVideo)
            {
                this.Image.texture = this.ImageContent;
            }
            else
            {
                this.VideoPlayer.Play();
            }

            this.Image.color = Color.white;
        }

        /**
         * convenience method to actually hide the image content
         */
        private void HideContent()
        {
            if (!base.Spec.IsVideo)
            {
                this.Image.texture = null;
            }
            else
            {
                this.VideoPlayer.Stop();
            }

            this.Image.color = Color.clear;
        }
    }
}
