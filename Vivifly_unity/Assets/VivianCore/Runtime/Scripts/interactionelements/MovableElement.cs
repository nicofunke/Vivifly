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
using UnityEngine;

namespace de.ugoe.cs.vivian.core
{

    /**
     * This class represents a movable object. In can be freely moved in space but has an initial and a final position
     */
    public class MovableElement : PositionableElement<MovableSpec>
    {
        /** the initial position of the object in world coordinates */
        private Vector3 worldInitialPos;

        /** the intended position of the object in world coordinates */
        private Vector3 worldIntendedPos;

        /** the initial rotation of the object */
        private Quaternion initialRotation;

        /** the interaction triangle representing the interaction start */
        private InteractionTriangle interactionStartTriangle;

        /**
         * initializes the member variables and sets the slider to the initial value given by the specification
         */
        internal new void Initialize(MovableSpec spec, GameObject representedObject)
        {
            Vector3 position = representedObject.transform.position;
            initialRotation = representedObject.transform.rotation;

            base.Initialize(spec, representedObject);

            worldInitialPos = position;

            worldIntendedPos = position +
                representedObject.transform.parent.TransformVector(spec.IntendedPosition);
        }

        /**
         * called to apply a certain attribute
         */
        internal override void SetAttribute(InteractionElementSpec.Attribute attribute, object value)
        {
            switch (attribute)
            {
                case InteractionElementSpec.Attribute.POSITION:
                    if (!(value is Vector3))
                    {
                        throw new ArgumentException("setting the attribute POSITION to a movable element requires " +
                                                    "a value of type Vector3 but was " + value + " when setting it for the movable element " +
                                                    base.Spec.Name);
                    }

                    base.RepresentedObject.transform.localPosition = (Vector3)value;
                    break;

                case InteractionElementSpec.Attribute.FIXED:
                    base.SetAttribute(attribute, value); break;


                default:
                    throw new ArgumentException("the slider element " + base.Spec.Name + " cannot handle an attribute of type " +
                                                attribute + "with the value " + value + " of type " + value.GetType() + ". Allowed are: " +
                                                InteractionElementSpec.Attribute.VALUE + " of type float, " +
                                                InteractionElementSpec.Attribute.FIXED + " of type bool, " +
                                                InteractionElementSpec.Attribute.POSITION + " of type vector3");
            }
        }

        /**
         * This is called when the object starts to move
         */
        public override void TriggerInteractionStarts(Pose pose)
        {
            Debug.Log("trigger moving starts");

            // store some information about when and how the interaction started
            this.interactionStartTriangle = new InteractionTriangle(pose, base.RepresentedObject.transform);

            base.RaiseInteractionElementEvent(base.Spec, EventSpec.OBJECT_MOVE_START);
        }

        /**
         * This is called between the beginning of the move and the end
         */
        public override void TriggerInteractionContinues(Pose pose)
        {
            //Debug.Log("trigger moving");

            this.UpdateObject(pose);

            base.RaiseInteractionElementEvent(base.Spec, EventSpec.OBJECT_MOVE);
        }

        /**
         * This is called when the object shall finish moving
         */
        public override void TriggerInteractionEnds(Pose pose)
        {

            Debug.Log("trigger moving ends");

            this.UpdateObject(pose);

            base.RaiseInteractionElementEvent(base.Spec, EventSpec.OBJECT_MOVE_END);
        }

        /**
         * This is called during the interaction to update the objects position and rotation
         */
        private void UpdateObject(Pose pose)
        {
            if (!this.IsFixed)
            {
                // first determine the new objects position
                this.interactionStartTriangle.AdaptObjectTransformToPose(pose, base.RepresentedObject.transform);
            }
        }

        /**
         * convenience class to maintain the interaction triangle
         */
        private class InteractionTriangle
        {
            /** */
            private Quaternion initialInteractionRotation;

            /** */
            private Vector3 initialPoseRelativeObjectPosition;

            /** */
            private Quaternion initialObjectRotation;

            /**
             * 
             */
            internal InteractionTriangle(Pose interactionPose, Transform objectTransform)
            {
                this.Initialize(interactionPose, objectTransform);
            }

            /**
             * 
             */
            internal void AdaptObjectTransformToPose(Pose newInteractionPose, Transform objectTransform)
            {
                //Debug.DrawLine(newInteractionPose.position, newInteractionPose.position + newInteractionPose.forward, Color.cyan);
                //Debug.DrawLine(newInteractionPose.position, newInteractionPose.position + newInteractionPose.up, Color.blue);

                // get the rotation between the new pose and the initial pose
                Quaternion rotation = Quaternion.LookRotation(newInteractionPose.forward, newInteractionPose.up) *
                    Quaternion.Inverse(initialInteractionRotation);

                // determine, based on the rotation, where the object must now be located
                Vector3 newRelativeObjectPosition = rotation * initialPoseRelativeObjectPosition;

                //Debug.DrawLine(newInteractionPose.position, newInteractionPose.position + initialPoseRelativeObjectPosition, Color.magenta);
                //Debug.DrawLine(newInteractionPose.position, newInteractionPose.position + newRelativeObjectPosition, Color.red);
                objectTransform.position = newInteractionPose.position + newRelativeObjectPosition;

                // set the rotation of the object to its initial rotation plus the rotation change
                objectTransform.rotation = rotation * this.initialObjectRotation;
            }

            /**
             * 
             */
            internal void Initialize(Pose interactionPose, Transform objectTransform)
            {
                this.initialInteractionRotation = Quaternion.LookRotation(interactionPose.forward, interactionPose.up);
                this.initialPoseRelativeObjectPosition = objectTransform.position - interactionPose.position;
                this.initialObjectRotation = objectTransform.rotation;
            }
        }
    }
}
