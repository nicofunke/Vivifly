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
using System.Globalization;
using UnityEngine;

namespace de.ugoe.cs.vivian.core
{
    /**
     * 
     */
    public abstract class InteractionElementSpec
    {
        public enum Attribute
        {
            VALUE = 0,
            POSITION = 1,
            ENABLED = 2,
            FIXED = 3
        }

        public class AttributeValue
        {
            public Attribute Attribute { get; }

            public object Value { get; }

            public AttributeValue(Attribute attribute, object value)
            {
                this.Attribute = attribute;
                this.Value = value;
            }
        }

        public string Name { get; }

        public AttributeValue[] InitialAttributeValues { get; internal set; }

        internal InteractionElementSpec(string name, params AttributeValue[] initialAttributeValues)
        {
            this.Name = name;
            this.InitialAttributeValues = initialAttributeValues;
        }
    }

    /**
     * 
     */
    public class ButtonSpec : InteractionElementSpec
    {
        internal ButtonSpec(string name) : base(name, new AttributeValue(Attribute.VALUE, false))
        {
            // do nothing
        }
    }

    /**
     * 
     */
    public class ToggleButtonSpec : InteractionElementSpec
    {
        internal ToggleButtonSpec(string name, params AttributeValue[] initialAttributeValues)
            : base(name, initialAttributeValues)
        {
            // do nothing
        }

    }

    /**
     * 
     */
    public class TouchAreaSpec : InteractionElementSpec
    {
        public Vector3 Plane { get; }

        public Vector2 Resolution { get; }

        internal TouchAreaSpec(string name, Vector3 plane, Vector2 resolution) : base(name)
        {
            this.Plane = plane;
            this.Resolution = resolution;
        }

    }

    /**
     * 
     */
    public abstract class PositionableElementSpec : InteractionElementSpec
    {
        public int PositionResolution { get; } = int.MaxValue;

        internal PositionableElementSpec(string name,
                                         int positionResolution,
                                         params AttributeValue[] initialAttributeValues)
            : base(name, initialAttributeValues)
        {
            this.PositionResolution = positionResolution;

            if (this.PositionResolution < 2)
            {
                throw new ArgumentException("the position resolution of the interaction element " + name +
                                            " is " + this.PositionResolution +
                                            " but only values between 2 and max int inclusive are allowed.");
            }
        }
    }

    /**
     * 
     */
    public class RotatableSpec : PositionableElementSpec
    {
        public float MinRotation { get; }

        public float MaxRotation { get; }

        public AxisSpec RotationAxis { get; }

        internal RotatableSpec(string name,
                               float minRotation,
                               float maxRotation,
                               AxisSpec rotationAxis,
                               int rotationResolution = int.MaxValue,
                               params AttributeValue[] initialAttributeValues)
            : base(name, rotationResolution, initialAttributeValues)
        {
            this.MinRotation = minRotation;
            this.MaxRotation = maxRotation;
            this.RotationAxis = rotationAxis;
        }

    }

    /**
     * 
     */
    public class SliderSpec : PositionableElementSpec
    {
        public Vector3 MinPosition { get; }

        public Vector3 MaxPosition { get; }

        internal SliderSpec(string name,
                            Vector3 minPosition,
                            Vector3 maxPosition,
                            int positionResolution = int.MaxValue,
                            params AttributeValue[] initialAttributeValues)
            : base(name, positionResolution, initialAttributeValues)
        {
            this.MinPosition = minPosition;
            this.MaxPosition = maxPosition;
        }

    }

    /**
     * 
     */
    public class MovableSpec : PositionableElementSpec
    {
        public Vector3 IntendedPosition { get; }

        internal MovableSpec(string name, Vector3 intendedPosition,
                             params AttributeValue[] initialAttributeValues)
            : base(name, int.MaxValue, initialAttributeValues)
        {
            this.IntendedPosition = intendedPosition;
        }

    }

    /**
     * 
     */
    [System.Serializable]
    public struct AxisSpec
    {
        public Vector3 Origin;

        public Vector3 Direction;

        internal AxisSpec(Vector3 origin, Vector3 direction)
        {
            this.Origin = origin;
            this.Direction = direction;
        }
    }

    /**
     * 
     */
    [System.Serializable]
    public class InteractionElementSpecJSONWrapper
    {
        public string Type;

        public string Name;

        public AttributeValueJSONWrapper[] InitialAttributeValues;

        public float MinRotation;

        public float MaxRotation;

        public AxisSpec RotationAxis;

        public Vector3 MinPosition;

        public Vector3 MaxPosition;

        public int PositionResolution = int.MaxValue;

        public Vector3 Plane;

        public Vector2 Resolution;

        public Vector3 IntendedPosition;


        public InteractionElementSpecJSONWrapper(InteractionElementSpec interactionElementSpec)
        {
            this.Name = interactionElementSpec.Name;
            this.InitialAttributeValues = new AttributeValueJSONWrapper[interactionElementSpec.InitialAttributeValues.Length];

            for (int i = 0; i < interactionElementSpec.InitialAttributeValues.Length; i++)
            {
                this.InitialAttributeValues[i] = new AttributeValueJSONWrapper(interactionElementSpec.InitialAttributeValues[i]);
            }

            if (interactionElementSpec is ButtonSpec)
            {
                this.Type = "Button";
            }
            else if (interactionElementSpec is ToggleButtonSpec)
            {
                this.Type = "ToggleButton";
            }
            else if (interactionElementSpec is TouchAreaSpec)
            {
                this.Type = "TouchArea";
                this.Plane = ((TouchAreaSpec)interactionElementSpec).Plane;
                this.Resolution = ((TouchAreaSpec)interactionElementSpec).Resolution;
            }
            else if (interactionElementSpec is RotatableSpec)
            {
                this.Type = "Rotatable";
                this.MinRotation = ((RotatableSpec)interactionElementSpec).MinRotation;
                this.MaxRotation = ((RotatableSpec)interactionElementSpec).MaxRotation;
                this.RotationAxis = ((RotatableSpec)interactionElementSpec).RotationAxis;
                this.PositionResolution = ((RotatableSpec)interactionElementSpec).PositionResolution;
            }
            else if (interactionElementSpec is SliderSpec)
            {
                this.Type = "Slider";
                this.MinPosition = ((SliderSpec)interactionElementSpec).MinPosition;
                this.MaxPosition = ((SliderSpec)interactionElementSpec).MaxPosition;
                this.PositionResolution = ((SliderSpec)interactionElementSpec).PositionResolution;
            }
            else if (interactionElementSpec is MovableSpec)
            {
                this.Type = "Movable";
                this.IntendedPosition = ((MovableSpec)interactionElementSpec).IntendedPosition;
            }
        }

        public InteractionElementSpec GetSpec()
        {
            CultureInfo ci = (CultureInfo)CultureInfo.CurrentCulture.Clone();
            ci.NumberFormat.CurrencyDecimalSeparator = ".";

            InteractionElementSpec.AttributeValue[] defaultAttributeValues = null;

            if (this.InitialAttributeValues != null)
            {
                defaultAttributeValues = new InteractionElementSpec.AttributeValue[this.InitialAttributeValues.Length];

                for (int i = 0; i < this.InitialAttributeValues.Length; i++)
                {
                    defaultAttributeValues[i] = this.InitialAttributeValues[i].GetSpec();
                }
            }


            if (this.Type == "Button")
            {
                return new ButtonSpec(this.Name);
            }
            else if (this.Type == "ToggleButton")
            {
                return new ToggleButtonSpec(this.Name, defaultAttributeValues);
            }
            else if (this.Type == "TouchArea")
            {
                return new TouchAreaSpec(this.Name, this.Plane, this.Resolution);
            }
            else if (this.Type == "Rotatable")
            {
                if (this.PositionResolution == 0)
                {
                    this.PositionResolution = int.MaxValue;
                }

                return new RotatableSpec(this.Name, this.MinRotation, this.MaxRotation, this.RotationAxis,
                                         this.PositionResolution, defaultAttributeValues);
            }
            else if (this.Type == "Slider")
            {
                if (this.PositionResolution == 0)
                {
                    this.PositionResolution = int.MaxValue;
                }

                return new SliderSpec(this.Name, this.MinPosition, this.MaxPosition,
                                      this.PositionResolution, defaultAttributeValues);
            }
            else if (this.Type == "Movable")
            {
                return new MovableSpec(this.Name, this.IntendedPosition, defaultAttributeValues);
            }
            else
            {
                throw new System.ArgumentException("unknown interaction element type " + this.Type);
            }
        }
    }

    /**
     * 
     */
    [System.Serializable]
    public class AttributeValueJSONWrapper
    {
        public string Attribute;

        public string Value;

        public AttributeValueJSONWrapper(InteractionElementSpec.AttributeValue attributeValue)
        {
            this.Attribute = attributeValue.Attribute.ToString();
            this.Value = attributeValue.Value.ToString();
        }

        public InteractionElementSpec.AttributeValue GetSpec()
        {
            return new InteractionElementSpec.AttributeValue
                ((InteractionElementSpec.Attribute)Enum.Parse(typeof(InteractionElementSpec.Attribute), this.Attribute),
                 Utils.ParseValue(this.Value));

         }
    }

    /**
     * 
     */
    [System.Serializable]
    public class InteractionElementSpecArrayJSONWrapper
    {
        public InteractionElementSpecJSONWrapper[] Elements;

        public InteractionElementSpecArrayJSONWrapper(InteractionElementSpec[] elements)
        {
            this.Elements = new InteractionElementSpecJSONWrapper[elements.Length];

            for (int i = 0; i < elements.Length; i++)
            {
                this.Elements[i] = new InteractionElementSpecJSONWrapper(elements[i]);
            }
        }

        public InteractionElementSpec[] GetSpecsArray()
        {
            InteractionElementSpec[] result = new InteractionElementSpec[this.Elements.Length];

            for (int i = 0; i < this.Elements.Length; i++)
            {
                result[i] = this.Elements[i].GetSpec();
            }

            return result;
        }
    }
}
