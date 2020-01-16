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

using System.Collections.Generic;
using UnityEngine;

namespace de.ugoe.cs.vivian.core
{
    /**
     * This class represents a touch area.
     */
    public class TouchElement : InteractionElement<TouchAreaSpec>
    {
        /** the plane of the touch screen */
        private Plane Plane;

        /** the top left point of the touch screen */
        private Vector3 TopLeftPoint;

        /** the x-Axis of the touch screen */
        private Vector3 XAxis;

        /** the y-Axis of the touch screen */
        private Vector3 YAxis;

        /**
         * Called to initialize the visualization element with the specification and the represented game object
         */
        internal new void Initialize(TouchAreaSpec spec, GameObject representedObject)
        {
            base.Initialize(spec, representedObject);

            Mesh mesh = base.RepresentedObject.GetComponent<MeshFilter>().mesh;

            Quaternion representedObjectRotation = this.RepresentedObject.transform.rotation;
            Vector3 effectiveSize = Vector3.Scale(mesh.bounds.size, base.RepresentedObject.transform.lossyScale);
            Vector3 effectiveExtent = effectiveSize / 2;
            Vector3 effectivePlaneNormal = representedObjectRotation * this.Spec.Plane;
            Vector3 planeOffset = representedObjectRotation * Vector3.Scale(this.Spec.Plane.normalized, effectiveSize) / 2;
            Vector3 planeCenter = this.RepresentedObject.transform.position + planeOffset;

            this.Plane = new Plane(effectivePlaneNormal, planeCenter);

            this.TopLeftPoint = planeCenter + representedObjectRotation * new Vector3(effectiveExtent.x, effectiveExtent.y, 0);
            //this.BottomRightPoint = planeCenter - representedObjectRotation * new Vector3(effectiveExtent.x, effectiveExtent.y, 0);

            Vector3 topRightPoint = planeCenter + representedObjectRotation * new Vector3(-effectiveExtent.x, effectiveExtent.y, 0);
            Vector3 bottomLeftPoint = planeCenter + representedObjectRotation * new Vector3(effectiveExtent.x, -effectiveExtent.y, 0);
            this.XAxis = topRightPoint - this.TopLeftPoint;
            this.YAxis = bottomLeftPoint - this.TopLeftPoint;
        }

        /**
         * This is called when the touch area is touched
         */
        public override void TriggerInteractionStarts(Pose pose)
        {
            Debug.Log("trigger touch begin");

            Vector2 coordinates = GetTouchscreenCoordinates(pose);

            base.RaiseInteractionElementEvent(base.Spec, EventSpec.TOUCH_START,
                                              new KeyValuePair<EventParameterSpec, float>(EventParameterSpec.TOUCH_X_COORDINATE, coordinates.x),
                                              new KeyValuePair<EventParameterSpec, float>(EventParameterSpec.TOUCH_Y_COORDINATE, coordinates.y));
        }

        /**
         * handles the slide on the touch area. The ray defined by the pose is considered to show the user intended position of the slide.
         */
        public override void TriggerInteractionContinues(Pose pose)
        {
            //Debug.Log("trigger touch slide");

            Vector2 coordinates = GetTouchscreenCoordinates(pose);
            //Debug.Log(coordinates);

            base.RaiseInteractionElementEvent(base.Spec, EventSpec.TOUCH_SLIDE,
                                              new KeyValuePair<EventParameterSpec, float>(EventParameterSpec.TOUCH_X_COORDINATE, coordinates.x),
                                              new KeyValuePair<EventParameterSpec, float>(EventParameterSpec.TOUCH_Y_COORDINATE, coordinates.y));
        }

        /**
         * This is called when the touch area is not touched anymore
         */
        public override void TriggerInteractionEnds(Pose pose)
        {
            Debug.Log("trigger touch end");

            Vector2 coordinates = GetTouchscreenCoordinates(pose);

            base.RaiseInteractionElementEvent(base.Spec, EventSpec.TOUCH_END,
                                              new KeyValuePair<EventParameterSpec, float>(EventParameterSpec.TOUCH_X_COORDINATE, coordinates.x),
                                              new KeyValuePair<EventParameterSpec, float>(EventParameterSpec.TOUCH_Y_COORDINATE, coordinates.y));
        }


        /**
         * convenience method to get the location of the hit of the ray defined by the pose
         */
        private Vector2 GetTouchscreenCoordinates(Pose pose)
        {
            Vector3 planeHit = GetPlaneHit(pose);

            if (planeHit == Vector3.negativeInfinity)
            {
                return Vector2.negativeInfinity;
            }

            Vector3 touchscreenHit = planeHit - this.TopLeftPoint;

            float xAxisRatio = Vector3.Project(touchscreenHit, this.XAxis).magnitude / this.XAxis.magnitude;
            float yAxisRatio = Vector3.Project(touchscreenHit, this.YAxis).magnitude / this.YAxis.magnitude;

            return new Vector2(xAxisRatio * this.Spec.Resolution.x, yAxisRatio * this.Spec.Resolution.y);
        }

        /**
         * convenience method to get the location of the hit of the ray defined by the pose
         */
        private Vector3 GetPlaneHit(Pose pose)
        {
            Collider collider = this.GetComponent<Collider>();
            Ray destination = new Ray(pose.position, pose.forward);

            if (collider.Raycast(destination, out RaycastHit hitInfo, 100))
            {
                // the collider is hit by the ray, let us project this point onto the plane
                Vector3 planeHit = this.Plane.ClosestPointOnPlane(hitInfo.point);

                // if this plane hit is not too far from the collider hit (not more than 1mm in world space),
                // we consider the hit on the right side of the collider, i.e. in the plane
                if ((planeHit / 100) == (hitInfo.point / 100))
                {
                    /*Debug.DrawLine(Vector3.zero, planeHit, Color.green);
                    Debug.DrawLine(this.RepresentedObject.transform.position, hitInfo.point, Color.blue);*/

                    return planeHit;
                }
            }

            return Vector3.negativeInfinity;
        }
    }
}
