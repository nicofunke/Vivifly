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
     * This class represents a slider. It registers the start of a drag, the actual drag, and the end of a drag
     */
    public class SliderElement : PositionableElement<SliderSpec>
    {
        /** the minimal position of the slider in parent coordinates */
        private Vector3 parentLocalMinPos;

        /** the maximum position of the slider in parent coordinates */
        private Vector3 parentLocalMaxPos;

        /** the vector representing the sliders moving area (max - min position) */
        private Vector3 parentLocalSliderDirection;

        /**
         * initializes the member variables and sets the slider to the initial value given by the specification
         */
        internal new void Initialize(SliderSpec spec, GameObject representedObject)
        {
            base.Value = 0f;

            parentLocalMinPos = representedObject.transform.localPosition + spec.MinPosition;
            parentLocalMaxPos = representedObject.transform.localPosition + spec.MaxPosition;

            parentLocalSliderDirection = parentLocalMaxPos - parentLocalMinPos;

            base.Initialize(spec, representedObject);
        }

        /**
         * called to apply a certain attribute
         */
        internal override void SetAttribute(InteractionElementSpec.Attribute attribute, object value)
        {
            switch (attribute)
            {
                case InteractionElementSpec.Attribute.VALUE:
                    if (!(value is float))
                    {
                        throw new ArgumentException("setting the attribute VALUE to a slider element requires " +
                                                    "a value of type float but was " + value + " when setting it for the slider element " +
                                                    base.Spec.Name);
                    }

                    SetSliderToValue((float)value);
                    break;

                case InteractionElementSpec.Attribute.FIXED:
                    base.SetAttribute(attribute, value); break;

                default:
                    throw new ArgumentException("the slider element " + base.Spec.Name + " cannot handle an attribute of type " +
                                                attribute + "with the value " + value + " of type " + value.GetType() + ". Allowed are: " +
                                                InteractionElementSpec.Attribute.VALUE + " of type float, " +
                                                InteractionElementSpec.Attribute.FIXED + " of type bool");
            }
        }

        /**
         * handles the beginning of a drag
         */
        public override void TriggerInteractionStarts(Pose pose)
        {
            Debug.Log("trigger drag begin " + base.Value);
            base.RaiseInteractionElementEvent(base.Spec, EventSpec.SLIDER_DRAG_START,
                                              new KeyValuePair<EventParameterSpec, float>(EventParameterSpec.SELECTED_VALUE, (float)base.Value));
        }

        /**
         * handles the drag of the slider. The ray defined by the pose is considered to show the user intended position of the slider.
         * As the users are not perfect, this position is projected on the slider vector.
         */
        public override void TriggerInteractionContinues(Pose pose)
        {
            if (!this.IsFixed)
            {
                // we first determine a plane in which the ray as well as the slider reside.
                Vector3 worldSliderDirection = base.RepresentedObject.transform.parent.TransformVector(parentLocalSliderDirection);
                Vector3 planeNormalOfSliderAndRay = Vector3.Cross(worldSliderDirection, pose.forward);

                if (planeNormalOfSliderAndRay == Vector3.zero)
                {
                    // the slider direction and the ray point into the very same direction. We cannot handle this and
                    // just return. But in this case, the user also cannot correctly modify the slider.
                    return;
                }

                // now we determine a plane that contains the slider and whose normal shows into the direction of the ray
                Vector3 interactionPlaneNormalOfSlider = Vector3.Cross(worldSliderDirection, planeNormalOfSliderAndRay);
                Vector3 worldMinPos = base.RepresentedObject.transform.parent.TransformPoint(parentLocalMinPos);
                Plane verticalSliderPlane = new Plane(interactionPlaneNormalOfSlider, worldMinPos);

                // then we check, where the ray hits this plane
                Ray ray = new Ray(pose.position, pose.forward);
                verticalSliderPlane.Raycast(ray, out float distance);
                Vector3 hitPoint = ray.GetPoint(distance);

                // The hit point must be projected onto the slider direction. Hence, we first determine the distance of the hit point
                // to the slider start and then project this distance vector onto the slider direction
                Vector3 delta = hitPoint - worldMinPos;
                Vector3 sliderValueVector = Vector3.Project(delta, worldSliderDirection);

                // finally, we apply the selected slider value
                SetSliderToValueVector(sliderValueVector);

                //Debug.Log("slider value " + sliderValue);
            }

            base.RaiseInteractionElementEvent(base.Spec, EventSpec.SLIDER_DRAG,
                                              new KeyValuePair<EventParameterSpec, float>(EventParameterSpec.SELECTED_VALUE, (float)base.Value));
        }

        /**
         * handles the end of a drag
         */
        public override void TriggerInteractionEnds(Pose pose)
        {
            Debug.Log("trigger drag end " + base.Value);

            // call this to ensure matching the position resolution
            this.SetSliderToValue((float)base.Value);

            base.RaiseInteractionElementEvent(base.Spec, EventSpec.SLIDER_DRAG_END,
                                              new KeyValuePair<EventParameterSpec, float>(EventParameterSpec.SELECTED_VALUE, (float)base.Value));
        }

        /**
         * convenience method to set a slider to the given value
         */
        private void SetSliderToValue(float value)
        {
            float effectiveValue = value;

            if (base.Spec.PositionResolution < int.MaxValue)
            {
                effectiveValue = (float)Math.Round(value * (base.Spec.PositionResolution - 1), 0) / (base.Spec.PositionResolution - 1);
                //Debug.Log("adapt value to resolution " + effectiveValue);
            }

            Vector3 worldSliderDirection = base.RepresentedObject.transform.parent.TransformVector(parentLocalSliderDirection);
            Vector3 valueVector = worldSliderDirection * effectiveValue;
            SetSliderToValueVector(valueVector);
        }

        /**
         * convenience method to set a slider to the value represented by the value vector.
         * The value vector is considered to start at the minimum position of the slider and to
         * point into the slider direction. If the vector is smaller or larger then the minimum
         * and maximum position of the slider, the slider is set to the respective boundary value.
         */
        private void SetSliderToValueVector(Vector3 valueVector)
        {
            // we apply the value vector on the slider. We consider the borders correctly by not applying negative
            // vectors or vectors being longer than the slider but fixing the slider on its max points.
            Vector3 worldSliderDirection = base.RepresentedObject.transform.parent.TransformVector(parentLocalSliderDirection);
            if (Vector3.Dot(valueVector, worldSliderDirection) < 0)
            {
                valueVector = Vector3.zero;
            }
            else if (valueVector.magnitude > worldSliderDirection.magnitude)
            {
                valueVector = worldSliderDirection;
            }

            Vector3 worldMinPos = base.RepresentedObject.transform.parent.TransformPoint(parentLocalMinPos);
            Vector3 finalPosition = worldMinPos + valueVector;
            base.RepresentedObject.transform.position = finalPosition;

            base.Value = valueVector.magnitude / worldSliderDirection.magnitude;
        }

        /**
         * convenience method to draw a plane
         */
        /*private void DrawPlane(Plane plane, Vector3 position, Color color)
        {

            Vector3 v3;

            if (plane.normal.normalized != Vector3.forward)
                v3 = Vector3.Cross(plane.normal, Vector3.forward).normalized * plane.normal.magnitude;
            else
                v3 = Vector3.Cross(plane.normal, Vector3.up).normalized * plane.normal.magnitude;

            var corner0 = position + v3;
            var corner2 = position - v3;
            var q = Quaternion.AngleAxis(90.0f, plane.normal);
            v3 = q * v3;
            var corner1 = position + v3;
            var corner3 = position - v3;

            Debug.DrawLine(corner0, corner2, color);
            Debug.DrawLine(corner1, corner3, color);
            Debug.DrawLine(corner0, corner1, color);
            Debug.DrawLine(corner1, corner2, color);
            Debug.DrawLine(corner2, corner3, color);
            Debug.DrawLine(corner3, corner0, color);
            Debug.DrawRay(position, plane.normal, Color.red);
        }*/
    }
}
