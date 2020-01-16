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
using System.Globalization;
using System.Reflection;
using UnityEngine;

namespace de.ugoe.cs.vivian.core
{
    public class VivianFramework : MonoBehaviour
    {
    }

    public class Utils
    {
        /**
         * convenience to get all interaction elements instantiated by the framework
         */
        public static InteractionElement[] GetInteractionElements(VirtualPrototype Prototype)
        {
            return Prototype.GetComponentsInChildren<InteractionElement>();
        }

        /**
         * convenience method to copy component values
         */
        public static T CopyComponentValues<T>(T comp, T other) where T : Component
        {
            Type type = comp.GetType();

            if (type != other.GetType())
            {
                return null; // type mis-match
            }

            BindingFlags flags = BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance | BindingFlags.Default | BindingFlags.DeclaredOnly;
            PropertyInfo[] pinfos = type.GetProperties(flags);

            foreach (var pinfo in pinfos)
            {
                if (pinfo.CanWrite)
                {
                    try
                    {
                        pinfo.SetValue(comp, pinfo.GetValue(other, null), null);
                    }
                    catch { } // In case of NotImplementedException being thrown. For some reason specifying that exception didn't seem to catch it, so I didn't catch anything specific.
                }
            }

            FieldInfo[] finfos = type.GetFields(flags);
            foreach (var finfo in finfos)
            {
                finfo.SetValue(comp, finfo.GetValue(other));
            }

            return comp as T;
        }

        /**
         * 
         */
        public static Vector3 ParseVector3(string sVector)
        {
            CultureInfo ci = (CultureInfo)CultureInfo.CurrentCulture.Clone();
            ci.NumberFormat.CurrencyDecimalSeparator = ".";

            // Remove the parentheses
            if (sVector.StartsWith("(") && sVector.EndsWith(")"))
            {
                sVector = sVector.Substring(1, sVector.Length - 2);
            }

            // split the items
            string[] sArray = sVector.Split(',');

            // store as a Vector3
            Vector3 result = new Vector3(
                float.Parse(sArray[0], NumberStyles.Any, ci),
                float.Parse(sArray[1], NumberStyles.Any, ci),
                float.Parse(sArray[2], NumberStyles.Any, ci));

            return result;
        }


        /**
         * 
         */
        public static object ParseValue(string valueStr)
        {
            if (valueStr == null)
            {
                return null;
            }

            // try parsing a float
            try
            {
                CultureInfo ci = (CultureInfo)CultureInfo.CurrentCulture.Clone();
                ci.NumberFormat.CurrencyDecimalSeparator = ".";

                return float.Parse(valueStr, NumberStyles.Any, ci);
            }
            catch (Exception)
            {
                // it wasn't a float. Ignore this attempt and try something else
            }

            // try parsing a Vector3
            try
            {
                return ParseVector3(valueStr);
            }
            catch (Exception)
            {
                // it wasn't a float. Ignore this attempt and try something else
            }

            // try parsing a bool
            if ("true" == valueStr.ToLower())
            {
                return true;
            }
            else if ("false" == valueStr.ToLower())
            {
                return false;
            }

            // seems to be a normal string
            return valueStr;
        }
    }
}
