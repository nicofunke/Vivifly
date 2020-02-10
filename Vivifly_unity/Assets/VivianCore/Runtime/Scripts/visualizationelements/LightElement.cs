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

namespace de.ugoe.cs.vivian.core
{
    /**
     * This class represents a light for visualizing values
     */
    public class LightElement : VisualizationElement<LightSpec, float>
    {
        /** the material component used for visualization */
        private Material Material;
        
        /** the light component used for visualization */
        private Light Light;

        /**
         * Called to initialize the visualization element with the specification and the represented game object
         */
        public new void Initialize(LightSpec spec, GameObject representedObject)
        {
            Debug.Log("WASABI - INI");
            base.Initialize(spec, representedObject);
            Debug.Log("WASABI - 2");
            MeshFilter meshFilter = representedObject.GetComponent<MeshFilter>();
            Debug.Log("WASABI - 3");
            if (meshFilter != null)
            {
                Debug.Log("WASABI - 4");
                MeshFilter meshFilterCopy = (MeshFilter)this.gameObject.AddComponent(meshFilter.GetType());
                Debug.Log("WASABI - 5");
                Utils.CopyComponentValues(meshFilterCopy, meshFilter);
            }
            Debug.Log("WASABI - 6");
            MeshRenderer meshRenderer = representedObject.GetComponent<MeshRenderer>();

            if (meshRenderer != null)
            {
                Debug.Log("WASABI - 7");
                MeshRenderer meshRendererCopy = (MeshRenderer)this.gameObject.AddComponent(meshRenderer.GetType());
                Debug.Log("WASABI - 8");
                Utils.CopyComponentValues(meshRendererCopy, meshRenderer);
                Debug.Log("WASABI - 9");

                this.Material = new Material(Shader.Find("UI/Default"));
                Debug.Log("WASABI - 10");
                //this.Material.SetColor("_Color", Color.clear);
                this.Material.color = new Color(this.Spec.EmissionColor.r, this.Spec.EmissionColor.g, this.Spec.EmissionColor.b, 0);
                Debug.Log("WASABI - 11");

                meshRendererCopy.material = this.Material;
                Debug.Log("WASABI - 12");
            }
            Debug.Log("WASABI - 13");
            this.Light = representedObject.GetComponent<Light>();
            Debug.Log("WASABI - INI END");
        }

        /**
         * Called to visualize a bool value
         */
        public override void Visualize(bool value)
        {
            if (value)
            {
                if (this.Material != null)
                {
                    this.Material.color = new Color(this.Spec.EmissionColor.r, this.Spec.EmissionColor.g, this.Spec.EmissionColor.b, 1);
                }
                
                if (this.Light != null)
                {
                    this.Light.enabled = true;
                }
            }
            else
            {
                if (this.Material != null)
                {
                    this.Material.color = new Color(this.Spec.EmissionColor.r, this.Spec.EmissionColor.g, this.Spec.EmissionColor.b, 0);
                }
                
                if (this.Light != null)
                {
                    this.Light.enabled = false;
                }
            }
        }

        /**
         * Called to visualize a float value
         */
        public override void Visualize(float value)
        {
            if (value > 0.0)
            {
                if (this.Material != null)
                {
                    this.Material.color = new Color(this.Spec.EmissionColor.r, this.Spec.EmissionColor.g, this.Spec.EmissionColor.b, value);
                }
                
                if (this.Light != null)
                {
                    this.Light.enabled = true;
                }
            }
            else
            {
                if (this.Material != null)
                {
                    this.Material.color = new Color(this.Spec.EmissionColor.r, this.Spec.EmissionColor.g, this.Spec.EmissionColor.b, 0);
                }
                
                if (this.Light != null)
                {
                    this.Light.enabled = false;
                }
            }
        }
    }
}
