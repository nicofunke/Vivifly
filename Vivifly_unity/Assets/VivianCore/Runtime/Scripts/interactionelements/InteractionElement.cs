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

using System;
using System.Collections.Generic;
using UnityEngine;

namespace de.ugoe.cs.vivian.core
{
    /**
     * This class represents a generic interaction element having a specification and a reference to the effective
     * game object it represents
     */
    public abstract class InteractionElement : MonoBehaviour
    {
        /** the specification of the interaction element */
        internal InteractionElementSpec Spec { get; set; }

        /** the current value of this interaction element */
        internal virtual object Value { get; set; }

        /** the represented game object */
        public GameObject RepresentedObject { get; internal set; }

        /** the events that can be fired by interaction elements */
        public event EventHandler<InteractionElementEvent> InteractionElementEvent;

        /**
         * Called to initialize the interaction element with the specification and the represented game object
         */
        internal void Initialize(InteractionElementSpec spec, GameObject representedObject)
        {
            this.Spec = spec;
            this.RepresentedObject = representedObject;

            this.SetInitialAttributes();

            Collider originalCollider = representedObject.GetComponent<Collider>();

            if (originalCollider != null)
            {
                Collider collider = (Collider)this.gameObject.AddComponent(originalCollider.GetType());
                Utils.CopyComponentValues(originalCollider, collider);

                //increase the collider size minimally to be the first one triggered
                this.transform.localScale = this.transform.localScale + new Vector3(0.0005f, 0.0005f, 0.0005f);
                collider.isTrigger = true;
            }
            else
            {
                MeshFilter[] meshFilters = representedObject.GetComponentsInChildren<MeshFilter>();

                foreach (MeshFilter meshFilter in meshFilters)
                {
                    // check whether the mesh is a child and if this child already is an InteractionElement
                    // if so, skip the creation of a corresponding collider
                    if (meshFilter.gameObject != representedObject)
                    {
                        InteractionElement[] interactionElements = meshFilter.GetComponentsInChildren<InteractionElement>();
                        if ((interactionElements != null) && (interactionElements.Length > 0))
                        {
                            continue;
                        }
                    }

                    // the object requires a collider --> calculate one
                    Mesh mesh = meshFilter.sharedMesh;

                    if (mesh == null)
                    {
                        mesh = meshFilter.mesh;
                    }

                    if (mesh != null)
                    {
                        //Debug.Log(meshFilter.name);

                        Collider collider = this.gameObject.AddComponent<BoxCollider>();

                        Vector3[] boundPoints = {
                            mesh.bounds.min,
                            mesh.bounds.max,
                            new Vector3(mesh.bounds.min.x, mesh.bounds.min.y, mesh.bounds.max.z),
                            new Vector3(mesh.bounds.min.x, mesh.bounds.max.y, mesh.bounds.min.z),
                            new Vector3(mesh.bounds.max.x, mesh.bounds.min.y, mesh.bounds.min.z),
                            new Vector3(mesh.bounds.min.x, mesh.bounds.max.y, mesh.bounds.max.z),
                            new Vector3(mesh.bounds.max.x, mesh.bounds.min.y, mesh.bounds.max.z),
                            new Vector3(mesh.bounds.max.x, mesh.bounds.max.y, mesh.bounds.min.z)
                        };

                        for (int i = 0; i < boundPoints.Length; i++)
                        {
                            //Debug.DrawLine(Vector3.zero, boundPoints[i], Color.green);
                            boundPoints[i] = meshFilter.transform.TransformPoint(boundPoints[i]);
                            //Debug.DrawLine(Vector3.zero, boundPoints[i], Color.red);
                        }

                        for (int i = 0; i < boundPoints.Length; i++)
                        {
                            boundPoints[i] = transform.InverseTransformPoint(boundPoints[i]);
                            //Debug.DrawLine(transform.position, transform.position + transform.rotation * boundPoints[i], Color.blue);
                        }

                        /*for (int i = 1; i < boundPoints.Length; i++)
                        {
                            for (int j = 0; j < boundPoints.Length; j++)
                            {
                                Debug.DrawLine(boundPoints[j], boundPoints[i], Color.cyan);
                            }
                        }*/

                        Bounds bounds = GeometryUtility.CalculateBounds(boundPoints, Matrix4x4.identity);

                        //Debug.DrawLine(Vector3.zero, bounds.center, Color.yellow);

                        // increase the collider size minimally to compensate for rounding issues.
                        ((BoxCollider)collider).size = 1.001f * bounds.size;
                        ((BoxCollider)collider).center = bounds.center;

                        collider.isTrigger = true;
                    }
                }
            }

            // ensure that the generated colliders do not interfere with rigid bodies
        }

        /**
         * This is called when the interaction with this element starts
         */
        public abstract void TriggerInteractionStarts(Pose pose);

        /**
         * This is called when the interaction with this element continues
         */
        public abstract void TriggerInteractionContinues(Pose pose);

        /**
         * This is called when the interaction with this element ends
         */
        public abstract void TriggerInteractionEnds(Pose pose);

        /**
         * 
         */
        protected virtual void RaiseInteractionElementEvent(InteractionElementSpec interactionElementSpec,
                                                            EventSpec eventSpec,
                                                            params KeyValuePair<EventParameterSpec, float>[] parameterValues)
        {
            InteractionElementEvent?.Invoke(this, new InteractionElementEvent(interactionElementSpec, eventSpec, parameterValues));
        }

        /**
         * called to apply a certain attribute
         */
        internal virtual void SetAttribute(InteractionElementSpec.Attribute attribute, object value)
        {
            switch (attribute)
            {
                case InteractionElementSpec.Attribute.VALUE: this.Value = value; break;
            }
        }

        /**
         * called to set the default attribute values
         */
        internal void SetInitialAttributes()
        {
            if (this.Spec.InitialAttributeValues != null)
            {
                foreach (InteractionElementSpec.AttributeValue defaultValue in this.Spec.InitialAttributeValues)
                {
                    this.SetAttribute(defaultValue.Attribute, defaultValue.Value);
                }
            }
        }
    }

    /**
     * 
     */
    public abstract class InteractionElement<T> : InteractionElement where T : InteractionElementSpec
    {
        /** the specification of the interaction element */
        internal new T Spec
        {
            get { return (T)base.Spec; }
            set { base.Spec = value; }
        }

        /**
         * Called to initialize the interaction element with the specification and the represented game object
         */
        internal void Initialize(T spec, GameObject representedObject)
        {
            base.Initialize(spec, representedObject);
        }

        /*void OnDrawGizmosSelected()
        {
            MeshFilter[] meshFilters = base.RepresentedObject.GetComponentsInChildren<MeshFilter>();

            foreach (MeshFilter meshFilter in meshFilters)
            {
                if (meshFilter.mesh != null)
                {
                    Debug.Log(meshFilter.name + "  " + meshFilter.mesh.bounds.min + "  " + meshFilter.mesh.bounds.max);
                    Debug.Log(meshFilter.name + "  " + meshFilter.transform.TransformPoint(meshFilter.mesh.bounds.min) + "  " +
                              meshFilter.transform.TransformPoint(meshFilter.mesh.bounds.max));
                    Debug.Log(meshFilter.name + "  " + transform.TransformPoint(meshFilter.mesh.bounds.min) + "  " +
                              transform.TransformPoint(meshFilter.mesh.bounds.max));
                    Bounds bounds =
                        GeometryUtility.CalculateBounds(new Vector3[] { meshFilter.transform.TransformPoint(meshFilter.mesh.bounds.min),
                                                                        meshFilter.transform.TransformPoint(meshFilter.mesh.bounds.max) },
                                                        transform.localToWorldMatrix);

                    Gizmos.color = new Color(1, 1, 1, 0.25f);
                    Gizmos.DrawCube(transform.position, bounds.size);
                    Gizmos.DrawWireCube(transform.position, bounds.size);
                }

                break;
            }

            Renderer[] renderers = base.RepresentedObject.GetComponentsInChildren<Renderer>();

            foreach (Renderer renderer in renderers)
            {
                if (renderer.bounds != null)
                {
                    Bounds bounds =
                        GeometryUtility.CalculateBounds(new Vector3[] { renderer.bounds.min, renderer.bounds.max },
                                                        transform.localToWorldMatrix);

                    Gizmos.color = new Color(20, 20, 20, 0.25f);
                    Gizmos.DrawCube(transform.position, bounds.size);
                    Gizmos.DrawWireCube(transform.position, bounds.size);
                }
            }
        }*/
    }

    /**
     * 
     */
    public abstract class PositionableElement : InteractionElement
    {
        /** the specification of the positionable element */
        internal new PositionableElementSpec Spec
        {
            get { return (PositionableElementSpec)base.Spec; }
            set { base.Spec = value; }
        }

        /** stores if the object is currently fixed or not */
        public bool IsFixed { get; internal set; } = false;

        /**
         * Called to initialize the positionable element with the specification and the represented game object
         */
        internal void Initialize(PositionableElementSpec spec, GameObject representedObject)
        {
            base.Initialize(spec, representedObject);
        }

        /**
         * called to apply a certain attribute
         */
        internal override void SetAttribute(InteractionElementSpec.Attribute attribute, object value)
        {
            switch (attribute)
            {
                case InteractionElementSpec.Attribute.FIXED:
                    if (!(value is bool))
                    {
                        throw new ArgumentException("setting the attribute FIXED to a positionable element requires " +
                                                    "a value of type bool but was " + value + " when setting it for the interaction element " +
                                                    base.Spec.Name);
                    }

                    this.IsFixed = (bool) value; break;

                default: base.SetAttribute(attribute, value); break;
            }
        }

    }

    /**
     * 
     */
    public abstract class PositionableElement<T> : PositionableElement where T : PositionableElementSpec
    {
        /** the specification of the positionable element */
        internal new T Spec
        {
            get { return (T)base.Spec; }
            set { base.Spec = value; }
        }

        /**
         * Called to initialize the positionable element with the specification and the represented game object
         */
        internal void Initialize(T spec, GameObject representedObject)
        {
            base.Initialize(spec, representedObject);
        }
    }

    /**
     * 
     */
    public class InteractionElementEvent : EventArgs
    {
        public InteractionElementSpec InteractionElementSpec { get; }

        public EventSpec EventSpec { get; }

        public KeyValuePair<EventParameterSpec, float>[] ParameterValues { get; }

        public InteractionElementEvent(InteractionElementSpec interactionElementSpec,
                                       EventSpec eventSpec,
                                       params KeyValuePair<EventParameterSpec, float>[] parameterValues)
        {
            this.InteractionElementSpec = interactionElementSpec;
            this.EventSpec = eventSpec;
            this.ParameterValues = parameterValues;
        }
    }
}
