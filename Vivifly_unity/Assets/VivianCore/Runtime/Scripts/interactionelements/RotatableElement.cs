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
     * This class represents a rotatable element. It registers the start of a rotation, the actual rotation,
     * and the end of a rotation.
     */
    public class RotatableElement : PositionableElement<RotatableSpec>
    {
        /** stores the parent space axis around which the rotatable rotates */
        private AxisSpec parentLocalRotationAxis;

        /** stores the current rotation angle of the rotatable */
        private float currentAngle;

        /** during a rotation, stores the rotation vector of the last frame */
        private Vector3 rotationVectorOfLastFrame;

        /** stores the intended angle of the rotatable which may exceed the boundaries */
        private float intendedAngle;


        /**
         * initializes the member variables and sets the knob to the initial value given by the specification
         */
        internal new void Initialize(RotatableSpec spec, GameObject representedObject)
        {
            base.Value = 0f;

            parentLocalRotationAxis = new AxisSpec
                (representedObject.transform.localPosition + spec.RotationAxis.Origin, spec.RotationAxis.Direction);

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
                        throw new ArgumentException("setting the attribute VALUE to a rotatable element requires " +
                                                    "a value of type float but was " + value + " when setting it for the rotatable element " +
                                                    base.Spec.Name);
                    }

                    //Debug.Log(value);
                    RotateToValue((float)value);
                    break;

                case InteractionElementSpec.Attribute.FIXED:
                    base.SetAttribute(attribute, value); break;

                default:
                    throw new ArgumentException("the rotatable element " + base.Spec.Name + " cannot handle an attribute of type " +
                                                attribute + "with the value " + value + " of type " + value.GetType() + ". Allowed are: " +
                                                InteractionElementSpec.Attribute.VALUE + " of type float, " +
                                                InteractionElementSpec.Attribute.FIXED + " of type bool");
            }
        }

        /**
         * handles the beginning of a rotation change
         */
        public override void TriggerInteractionStarts(Pose pose)
        {
            Debug.Log("trigger rotation start " + base.Value);
            rotationVectorOfLastFrame = Vector3.zero;
            intendedAngle = currentAngle;

            base.RaiseInteractionElementEvent(base.Spec, EventSpec.KNOB_DRAG_START,
                                              new KeyValuePair<EventParameterSpec, float>(EventParameterSpec.SELECTED_VALUE, (float) base.Value));
        }

        /**
         * handles the roation of the rotatable. The ray defined by the pose is considered to show the user intended rotation of the rotatable.
         * The rotatable follows the ray. If the ray leaves the rotatable, the rotatable still follows it measuring only the roation angle.
         */
        public override void TriggerInteractionContinues(Pose pose)
        {
            if (!this.IsFixed)
            {
                // we first determine a plane in which the knob is supposed to rotate. This is given by the rotation axis.
                AxisSpec effectiveRotationAxis = GetRotationAxisInWorldSpace();
                Plane interactionPlane = new Plane(effectiveRotationAxis.Direction, effectiveRotationAxis.Origin);

                // then we check, where the ray hits the plane
                Ray ray = new Ray(pose.position, pose.forward);
                interactionPlane.Raycast(ray, out float distance);
                Vector3 hitPoint = ray.GetPoint(distance);

                // Then we determine the intended rotation vector.
                Vector3 anticipatedRotation = hitPoint - effectiveRotationAxis.Origin;

                if (rotationVectorOfLastFrame != Vector3.zero)
                {
                    // determine the angle between the last and the new vector pointed at by the user. It
                    // represents the intended change
                    float angularChange = Vector3.SignedAngle(rotationVectorOfLastFrame, anticipatedRotation, effectiveRotationAxis.Direction);
                    this.intendedAngle += angularChange;

                    RotateToAngle(this.intendedAngle);
                }

                rotationVectorOfLastFrame = anticipatedRotation;
            }

            base.RaiseInteractionElementEvent(base.Spec, EventSpec.KNOB_DRAG,
                                              new KeyValuePair<EventParameterSpec, float>(EventParameterSpec.SELECTED_VALUE, (float)base.Value));
        }

        /**
         * handles the end of a rotation change
         */
        public override void TriggerInteractionEnds(Pose pose)
        {
            Debug.Log("trigger rotation end " + base.Value);
            rotationVectorOfLastFrame = Vector3.zero;

            // call this to ensure matching the position resolution
            this.RotateToValue((float)base.Value);

            base.RaiseInteractionElementEvent(base.Spec, EventSpec.KNOB_DRAG_END,
                                              new KeyValuePair<EventParameterSpec, float>(EventParameterSpec.SELECTED_VALUE, (float)base.Value));
        }

        /**
         * convenience method to set the knob to a defined value
         */
        private void RotateToValue(float value)
        {
            float effectiveValue = value;

            if (base.Spec.PositionResolution < int.MaxValue)
            {
                effectiveValue = (float)Math.Round(value * (base.Spec.PositionResolution - 1), 0) / (base.Spec.PositionResolution - 1);
                //Debug.Log("adapt value to resolution " + effectiveValue);
            }

            float rotationAngle = base.Spec.MinRotation + ((base.Spec.MaxRotation - base.Spec.MinRotation) * effectiveValue);
            RotateToAngle(rotationAngle);
        }

        /**
         * convenience method to set the knob to a defined angle
         */
        private void RotateToAngle(float rotationAngle)
        {
            // we apply the rotation angle on the rotatable. We consider the max and min value correctly by not applying smaller
            // or larger rotations
            if (rotationAngle < base.Spec.MinRotation)
            {
                rotationAngle = base.Spec.MinRotation;
            }
            else if (rotationAngle > base.Spec.MaxRotation)
            {
                rotationAngle = base.Spec.MaxRotation;
            }

            if (Math.Abs(rotationAngle - this.currentAngle) > 1)
            {
                AxisSpec effectiveRotationAxis = GetRotationAxisInWorldSpace();
                base.RepresentedObject.transform.RotateAround(effectiveRotationAxis.Origin, effectiveRotationAxis.Direction, rotationAngle - this.currentAngle);

                this.currentAngle = rotationAngle;
                base.Value = (rotationAngle - base.Spec.MinRotation) / (base.Spec.MaxRotation - base.Spec.MinRotation);
            }
        }

        /**
         * convenience method to get the rotation axis in world space
         */
        private AxisSpec GetRotationAxisInWorldSpace()
        {
            return new AxisSpec
                (base.RepresentedObject.transform.parent.TransformPoint(parentLocalRotationAxis.Origin),
                 base.RepresentedObject.transform.parent.TransformVector(parentLocalRotationAxis.Direction));
        }
    }
}
