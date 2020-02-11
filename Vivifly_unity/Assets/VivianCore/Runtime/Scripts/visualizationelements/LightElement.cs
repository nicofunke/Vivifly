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
            base.Initialize(spec, representedObject);
            MeshFilter meshFilter = representedObject.GetComponent<MeshFilter>();
            if (meshFilter != null)
            {
                MeshFilter meshFilterCopy = (MeshFilter)this.gameObject.AddComponent(meshFilter.GetType());
                Utils.CopyComponentValues(meshFilterCopy, meshFilter);
            }
            MeshRenderer meshRenderer = representedObject.GetComponent<MeshRenderer>();

            if (meshRenderer != null)
            {
                MeshRenderer meshRendererCopy = (MeshRenderer)this.gameObject.AddComponent(meshRenderer.GetType());
                Utils.CopyComponentValues(meshRendererCopy, meshRenderer);

                this.Material = new Material(Shader.Find("UI/Default"));
                //this.Material.SetColor("_Color", Color.clear);
                this.Material.color = new Color(this.Spec.EmissionColor.r, this.Spec.EmissionColor.g, this.Spec.EmissionColor.b, 0);
                meshRendererCopy.material = this.Material;
            }
            this.Light = representedObject.GetComponent<Light>();
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
