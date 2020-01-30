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
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;

namespace de.ugoe.cs.vivian.core
{
    public class VirtualPrototype : MonoBehaviour
    {
        // Reference to the bundle url that contains the prototype.
        public string BundleURL;

        // name of the prototype prefab to load.
        public string PrototypePrefabName;

        // flag indicating if the prototype was loaded completely
        public bool Loaded { get; private set; } = false;

        // the state machine of the prototype
        public StateMachine StateMachine { get; private set; }

        // Reference to the actual virtual prototype
        private GameObject PrototypeInstance;

        // This script will simply instantiate the Prefab when the game starts.
        void Start()
        {
            StartCoroutine(InstantiatePrototype(this.BundleURL, this.PrototypePrefabName));
        }

        /**
         * 
         */
        IEnumerator InstantiatePrototype(string url, string prefabName)
        {
            //string url = "file:///" + Application.dataPath + "/AssetBundles/" + assetBundleName;
            string effectiveUrl = url;

            if (!effectiveUrl.Contains("://"))
            {
                // we denote a file on the disk. Check, whether it is an absolute or relative path
                if (effectiveUrl.StartsWith("/"))
                {
                    // its an absolute path. Add only file://
                    effectiveUrl = "file://" + effectiveUrl;
                }
                else
                {
                    // its a relative path. Add the protocol as well as location of the project
                    effectiveUrl = "file:///" + Application.dataPath + "/" + effectiveUrl;
                }
            }

            Debug.Log(effectiveUrl);

            UnityWebRequest request = UnityWebRequestAssetBundle.GetAssetBundle(effectiveUrl, 0);
            yield return request.SendWebRequest();
            AssetBundle bundle = DownloadHandlerAssetBundle.GetContent(request);

            if (bundle == null)
            {
                throw new ArgumentException("cannot retrieve an asset bundle from the provided URL: " + effectiveUrl);
            }

            GameObject virtualPrototypePrefab = bundle.LoadAsset<GameObject>(prefabName);

            if (virtualPrototypePrefab == null)
            {
                throw new ArgumentException("cannot retrieve a virtual prototype prefab name " + prefabName + " from URL: " + effectiveUrl);
            }

            // Instantiate at position (0, 0, 0) and zero rotation.
            this.PrototypeInstance = Instantiate(virtualPrototypePrefab, new Vector3(0, 0, 0), Quaternion.identity);
            //this.PrototypeInstance = Instantiate(virtualPrototypePrefab, new Vector3(0, 0, 0), Quaternion.Euler(new Vector3(-5, -45, 10)));
            this.PrototypeInstance.transform.SetParent(this.transform, false);

            yield return null;

            // load all elements of the prototype
            InteractionElementSpec[] interactionElementSpecs =
                this.GetFromJSON<InteractionElementSpecArrayJSONWrapper>(bundle, "InteractionElements.json").GetSpecsArray();

            VisualizationElementSpec[] visualizationElementSpecs =
                this.GetFromJSON<VisualizationElementSpecArrayJSONWrapper>(bundle, "VisualizationElements.json").GetSpecsArray();

            VisualizationArraySpec[] visualizationArraySpecs =
                this.GetFromJSON<VisualizationArraySpecArrayJSONWrapper>(bundle, "VisualizationArrays.json").GetSpecsArray(visualizationElementSpecs);

            VisualizationSpec[] allVisualizationElements =
                new VisualizationSpec[visualizationElementSpecs.Length + visualizationArraySpecs.Length];

            visualizationElementSpecs.CopyTo(allVisualizationElements, 0);
            visualizationArraySpecs.CopyTo(allVisualizationElements, visualizationElementSpecs.Length);

            yield return null;

            // load the state machine
            StateSpec[] states =
                this.GetFromJSON<StateSpecArrayJSONWrapper>(bundle, "States.json").GetSpecsArray(interactionElementSpecs, allVisualizationElements);

            TransitionSpec[] transitionSpecs =
                this.GetFromJSON<TransitionSpecArrayJSONWrapper>(bundle, "Transitions.json").GetSpecsArray(states, interactionElementSpecs);

            yield return null;

            // finally, create the state machine, register all prototype elements and start the state machine
            this.StateMachine = new StateMachine(transitionSpecs, this);

            CreateVisualizationElements(visualizationElementSpecs, bundle);
            CreateVisualizationArrays(visualizationArraySpecs);
            CreateInteractionElements(interactionElementSpecs);

            this.StateMachine.Start(states[0]);
            //prototypeInstance.SetActive(false);

            this.Loaded = true;
        }

        /*
         * 
         */
        private T GetFromJSON<T>(AssetBundle bundle, string fileName)
        {
            TextAsset textAsset = bundle.LoadAsset<TextAsset>(fileName);
            if (textAsset == null)
            {
                throw new ArgumentException("no " + fileName + " found in prototype bundle");
            }

            return JsonUtility.FromJson<T>(textAsset.text);
        }

        /*
         * 
         */
        private void CreateInteractionElements(InteractionElementSpec[] elementSpecs)
        {
            // we first need to order the interaction elements so that we create them starting with the deepest nodes
            // and finishing with the highest parent nodes
            List<KeyValuePair<int, InteractionElementSpec>> sortedElements = new List<KeyValuePair<int, InteractionElementSpec>>();

            foreach (InteractionElementSpec elementSpec in elementSpecs)
            {
                GameObject element = GameObject.Find(elementSpec.Name);

                if (element == null)
                {
                    throw new ArgumentException("could not find object with name " + elementSpec.Name);
                }

                int depth = 1;
                Transform transform = element.transform;

                while (transform.parent != null)
                {
                    depth++;
                    transform = transform.parent;
                }

                bool added = false;

                for (int i = 0; i < sortedElements.Count; i++)
                {
                    if (depth > sortedElements[i].Key)
                    {
                        sortedElements.Insert(i, new KeyValuePair<int, InteractionElementSpec>(depth, elementSpec));
                        added = true;
                        break;
                    }
                }

                if (!added)
                {
                    sortedElements.Add(new KeyValuePair<int, InteractionElementSpec>(depth, elementSpec));
                }
            }

            foreach (KeyValuePair<int, InteractionElementSpec> element in sortedElements)
            {
                GameObject interactionElement = CreateInteractionElement(element.Value);

                if (interactionElement == null)
                {
                    throw new ArgumentException("could not find object with name " + element.Value.Name);
                }
            }


        }

        /*
         * 
         */
        private GameObject CreateInteractionElement(InteractionElementSpec elementSpec)
        {
            GameObject effectiveElement = GameObject.Find(elementSpec.Name);

            if (effectiveElement != null)
            {
                GameObject interactionElementGo = new GameObject("ColliderObject" + elementSpec.Name);

                interactionElementGo.transform.SetParent(effectiveElement.transform, false);

                InteractionElement interactionElement;

                if (elementSpec is ToggleButtonSpec)
                {
                    interactionElement = interactionElementGo.AddComponent<ToggleButtonElement>();
                    ((ToggleButtonElement)interactionElement).Initialize((ToggleButtonSpec)elementSpec, effectiveElement);
                }
                else if (elementSpec is ButtonSpec)
                {
                    interactionElement = interactionElementGo.AddComponent<ButtonElement>();
                    ((ButtonElement)interactionElement).Initialize((ButtonSpec)elementSpec, effectiveElement);
                }
                else if (elementSpec is SliderSpec)
                {
                    interactionElement = interactionElementGo.AddComponent<SliderElement>();
                    ((SliderElement)interactionElement).Initialize((SliderSpec)elementSpec, effectiveElement);
                }
                else if (elementSpec is RotatableSpec)
                {
                    interactionElement = interactionElementGo.AddComponent<RotatableElement>();
                    ((RotatableElement)interactionElement).Initialize((RotatableSpec)elementSpec, effectiveElement);
                }
                else if (elementSpec is TouchAreaSpec)
                {
                    interactionElement = interactionElementGo.AddComponent<TouchElement>();
                    ((TouchElement)interactionElement).Initialize((TouchAreaSpec)elementSpec, effectiveElement);
                }
                else if (elementSpec is MovableSpec)
                {
                    interactionElement = interactionElementGo.AddComponent<MovableElement>();
                    ((MovableElement)interactionElement).Initialize((MovableSpec)elementSpec, effectiveElement);
                }
                else
                {
                    throw new NotSupportedException("interaction element spec of type " + elementSpec.GetType() + " not supported");
                }

                // register the state machine to handle events
                interactionElement.InteractionElementEvent += this.StateMachine.HandleInteractionEvent;

                return interactionElementGo;
            }

            return null;
        }

        /*
         * 
         */
        private void CreateVisualizationElements(VisualizationElementSpec[] elementSpecs, AssetBundle assetBundle)
        {
            foreach (VisualizationElementSpec elementSpec in elementSpecs)
            {
                GameObject visualizationElement = CreateVisualizationElement(elementSpec, assetBundle);

                if (visualizationElement == null)
                {
                    throw new ArgumentException("could not find object with name " + elementSpec.Name);
                }
             }
        }

        /*
         * 
         */
        public static GameObject CreateVisualizationElement(VisualizationElementSpec elementSpec, AssetBundle assetBundle)
        {
            GameObject effectiveElement = GameObject.Find(elementSpec.Name);

            if (effectiveElement != null)
            {
                GameObject visualizationElement = new GameObject("VisualizationObject" + elementSpec.Name);

                visualizationElement.transform.SetParent(effectiveElement.transform, false);

                if (elementSpec is LightSpec)
                {
                    visualizationElement.AddComponent<LightElement>().Initialize((LightSpec)elementSpec, effectiveElement);
                }
                else if (elementSpec is ScreenSpec)
                {
                    visualizationElement.AddComponent<ScreenElement>().Initialize((ScreenSpec)elementSpec, effectiveElement, assetBundle);
                }
                else if (elementSpec is ParticleSpec)
                {
                    visualizationElement.AddComponent<ParticleElement>().Initialize((ParticleSpec)elementSpec, effectiveElement);
                }
                else if (elementSpec is AnimationSpec)
                {
                    visualizationElement.AddComponent<AnimationElement>().Initialize((AnimationSpec)elementSpec, effectiveElement);
                }
                else
                {
                    throw new NotSupportedException("visualization spec of type " + elementSpec.GetType() + " not supported");
                }

                return visualizationElement;
            }

            return null;
        }

        /*
         * 
         */
        private void CreateVisualizationArrays(VisualizationArraySpec[] arraySpecs)
        {
            GameObject visualizationArrays = new GameObject("VisualizationArrays");
            visualizationArrays.transform.parent = this.transform;

            foreach (VisualizationArraySpec arraySpec in arraySpecs)
            {
                GameObject visualizationArray = new GameObject("VisualizationArray" + arraySpec.Name);

                if (arraySpec is LightArraySpec)
                {
                    visualizationArray.AddComponent<LightArrayElement>().Initialize((LightArraySpec)arraySpec);
                }
                else
                {
                    throw new NotSupportedException("cannot handle visualization arrays of type " + arraySpec.GetType());
                }

                visualizationArray.transform.SetParent(visualizationArrays.transform, false);
            }

        }

        /*
         * 
         */
        /*private InteractionElementSpec GetElement(string name, InteractionElementSpec[] elementSpecs)
        {
            foreach (InteractionElementSpec candidate in elementSpecs)
            {
                if (candidate.Name == name)
                {
                    return candidate;
                }
            }

            return null;
        }*/

        /*
         * 
         */
        public void SetPrototypeActive(bool active)
        {
            PrototypeInstance.SetActive(active);
        }

        /*
         * 
         */
        public void SetPrototypePosition(Vector3 position)
        {
            PrototypeInstance.transform.position = position;
        }

        /*
         * 
         */
        public void SetPrototypeRotation(Quaternion rotation)
        {
            PrototypeInstance.transform.rotation = rotation;
        }

    }

    /*InteractionElementSpec[] interactionElementSpecs = new InteractionElementSpec[]
    {
        new ToggleButtonSpec("Button1"),
        new ToggleButtonSpec("Button2", true),
        new ButtonSpec("Button3"),
        new ButtonSpec("Button4"),
        new SliderSpec("HorizontalSlider", new Vector3(0.075f, 0.0f, 0.0f), new Vector3(-0.075f, 0.0f, 0.0f), 1.0f),
        new SliderSpec("VerticalSlider", new Vector3(0.0f, 0.0f, 0.0f), new Vector3(0.0f, 0.125f, 0.0f), 0.1f),
        new SliderSpec("DiagonalSlider", new Vector3(0.14f, 0.0f, 0.0f), new Vector3(0.0f, 0.0f, 0.0f), 0.9f),
        new KnobSpec("RotatingKnob1", -90, 90, Vector3.up, 0.1f),
        new KnobSpec("RotatingKnob2", -150, 180, Vector3.up, 0.5f),
        new KnobSpec("RotatingKnob3", -720, 200, Vector3.up, 1.0f),
        new TouchAreaSpec("Touchscreen", Vector3.forward, new Vector2(960, 900))
    };*/

    /*VisualizationElementSpec[] visualizationElementSpecs = new VisualizationElementSpec[]
    {
        new LightSpec("Light0", Color.green),
        new LightSpec("Light1", Color.green),
        new LightSpec("Light2", Color.green),
        new LightSpec("Light3", Color.green),
        new LightSpec("Light4", Color.green),
        new LightSpec("Light5", Color.green),
        new LightSpec("Light6", Color.yellow),
        new LightSpec("Light7", Color.yellow),
        new LightSpec("Light8", Color.yellow),
        new LightSpec("Light9", Color.red),
        new LightSpec("Light10", Color.red),
        new ScreenSpec("Touchscreen", Vector3.forward, new Vector2(960, 900)),
    };*/

    /*VisualizationArraySpec[] visualizationArraySpecs = new VisualizationArraySpec[]
    {
        new LightArraySpec ("LightArray",
                            (LightSpec)visualizationElementSpecs[1],
                            (LightSpec)visualizationElementSpecs[2],
                            (LightSpec)visualizationElementSpecs[3],
                            (LightSpec)visualizationElementSpecs[4],
                            (LightSpec)visualizationElementSpecs[5],
                            (LightSpec)visualizationElementSpecs[6],
                            (LightSpec)visualizationElementSpecs[7],
                            (LightSpec)visualizationElementSpecs[8],
                            (LightSpec)visualizationElementSpecs[9],
                            (LightSpec)visualizationElementSpecs[10])
    };*/

    /*StateSpec[] states = new StateSpec[]
    {
        new StateSpec("valueTransmissionState",
                      new FloatValueVisualizationSpec(visualizationElementSpecs[0], 0.0f),
                      new ValueOfInteractionElementVisualizationSpec(visualizationElementSpecs[1], interactionElementSpecs[1]),
                      new ValueOfInteractionElementVisualizationSpec(visualizationElementSpecs[2], interactionElementSpecs[2]),
                      new ValueOfInteractionElementVisualizationSpec(visualizationElementSpecs[3], interactionElementSpecs[3]),
                      new ValueOfInteractionElementVisualizationSpec(visualizationElementSpecs[4], interactionElementSpecs[4]),
                      new ValueOfInteractionElementVisualizationSpec(visualizationElementSpecs[5], interactionElementSpecs[5]),
                      new ValueOfInteractionElementVisualizationSpec(visualizationElementSpecs[6], interactionElementSpecs[6]),
                      new ValueOfInteractionElementVisualizationSpec(visualizationElementSpecs[7], interactionElementSpecs[7]),
                      new ValueOfInteractionElementVisualizationSpec(visualizationElementSpecs[8], interactionElementSpecs[8]),
                      new ValueOfInteractionElementVisualizationSpec(visualizationElementSpecs[9], interactionElementSpecs[9]),
                      new ValueOfInteractionElementVisualizationSpec(visualizationElementSpecs[10], interactionElementSpecs[9])),

        new StateSpec("fixedValueState",
                      new FloatValueVisualizationSpec(visualizationElementSpecs[0], 0.5f),
                      new FloatValueVisualizationSpec(visualizationElementSpecs[1], 0.0f),
                      new FloatValueVisualizationSpec(visualizationElementSpecs[2], 0.1f),
                      new FloatValueVisualizationSpec(visualizationElementSpecs[3], 0.2f),
                      new FloatValueVisualizationSpec(visualizationElementSpecs[4], 0.3f),
                      new FloatValueVisualizationSpec(visualizationElementSpecs[5], 0.4f),
                      new FloatValueVisualizationSpec(visualizationElementSpecs[6], 0.5f),
                      new FloatValueVisualizationSpec(visualizationElementSpecs[7], 0.6f),
                      new FloatValueVisualizationSpec(visualizationElementSpecs[8], 0.7f),
                      new FloatValueVisualizationSpec(visualizationElementSpecs[9], 0.8f),
                      new FloatValueVisualizationSpec(visualizationElementSpecs[10], 0.9f)),

        new StateSpec("lightArrayState",
                      new FloatValueVisualizationSpec(visualizationElementSpecs[0], 1.0f),
                      new ValueOfInteractionElementVisualizationSpec(visualizationArraySpecs[0], interactionElementSpecs[4])),

        new StateSpec("projlst_empty.state",
                      new ScreenContentVisualizationSpec((ScreenSpec) visualizationElementSpecs[11], "projlst_empty.png")),

        new StateSpec("new_project.state",
                      new ScreenContentVisualizationSpec((ScreenSpec) visualizationElementSpecs[11], "new_project.png")),

        new StateSpec("projlst.state",
                      new ScreenContentVisualizationSpec((ScreenSpec) visualizationElementSpecs[11], "projlst.png")),

        new StateSpec("projdtls_no_analysis.state",
                      new ScreenContentVisualizationSpec((ScreenSpec) visualizationElementSpecs[11], "projdtls_no_analysis.png")),

        new StateSpec("new_analysis.state",
                      new ScreenContentVisualizationSpec((ScreenSpec) visualizationElementSpecs[11], "new_analysis.png")),

        new StateSpec("projdtls_analysis.state",
                      new ScreenContentVisualizationSpec((ScreenSpec) visualizationElementSpecs[11], "projdtls_analysis.png")),

        new StateSpec("projdtls.state",
                      new ScreenContentVisualizationSpec((ScreenSpec) visualizationElementSpecs[11], "projdtls.png")),

        new StateSpec("tskdtls.state",
                      new ScreenContentVisualizationSpec((ScreenSpec) visualizationElementSpecs[11], "tskdtls.png")),

        new StateSpec("dfctdtls.state",
                      new ScreenContentVisualizationSpec((ScreenSpec) visualizationElementSpecs[11], "dfctdtls.png")),
    };*/

    /*TransitionSpec[] transitionSpecs = new TransitionSpec[]
    {
        // transitions caused by button 1
        new TransitionSpec(states[0], interactionElementSpecs[0], EventSpec.BUTTON_PRESS, states[1]),
        new TransitionSpec(states[1], interactionElementSpecs[0], EventSpec.BUTTON_PRESS, states[2]),
        new TransitionSpec(states[2], interactionElementSpecs[0], EventSpec.BUTTON_PRESS, states[0]),

        // transitions caused by button 2 --> to touch screen mode
        new TransitionSpec(states[0], interactionElementSpecs[1], EventSpec.BUTTON_PRESS, states[3]),
        new TransitionSpec(states[1], interactionElementSpecs[1], EventSpec.BUTTON_PRESS, states[3]),
        new TransitionSpec(states[2], interactionElementSpecs[1], EventSpec.BUTTON_PRESS, states[3]),

        // transitions caused by button 2 --> away from touch screen mode
        new TransitionSpec(states[3], interactionElementSpecs[1], EventSpec.BUTTON_PRESS, states[0]),
        new TransitionSpec(states[4], interactionElementSpecs[1], EventSpec.BUTTON_PRESS, states[0]),
        new TransitionSpec(states[5], interactionElementSpecs[1], EventSpec.BUTTON_PRESS, states[0]),
        new TransitionSpec(states[6], interactionElementSpecs[1], EventSpec.BUTTON_PRESS, states[0]),
        new TransitionSpec(states[7], interactionElementSpecs[1], EventSpec.BUTTON_PRESS, states[0]),
        new TransitionSpec(states[8], interactionElementSpecs[1], EventSpec.BUTTON_PRESS, states[0]),
        new TransitionSpec(states[9], interactionElementSpecs[1], EventSpec.BUTTON_PRESS, states[0]),
        new TransitionSpec(states[10], interactionElementSpecs[1], EventSpec.BUTTON_PRESS, states[0]),
        new TransitionSpec(states[11], interactionElementSpecs[1], EventSpec.BUTTON_PRESS, states[0]),

        // transitions in empty project list screen of touch screen mode
        new TransitionSpec(states[3], interactionElementSpecs[10], EventSpec.TOUCH_END, states[4],
                           new GuardSpec(ParameterSpec.TOUCH_X_COORDINATE, OperandSpec.LARGER, 29),
                           new GuardSpec(ParameterSpec.TOUCH_Y_COORDINATE, OperandSpec.LARGER, 240),
                           new GuardSpec(ParameterSpec.TOUCH_X_COORDINATE, OperandSpec.SMALLER, 222),
                           new GuardSpec(ParameterSpec.TOUCH_Y_COORDINATE, OperandSpec.SMALLER, 282)),

        // transitions in new project screen of touch screen mode
        new TransitionSpec(states[4], interactionElementSpecs[10], EventSpec.TOUCH_END, states[3],
                           new GuardSpec(ParameterSpec.TOUCH_X_COORDINATE, OperandSpec.LARGER, 395),
                           new GuardSpec(ParameterSpec.TOUCH_Y_COORDINATE, OperandSpec.LARGER, 567),
                           new GuardSpec(ParameterSpec.TOUCH_X_COORDINATE, OperandSpec.SMALLER, 468),
                           new GuardSpec(ParameterSpec.TOUCH_Y_COORDINATE, OperandSpec.SMALLER, 593)),
        new TransitionSpec(states[4], interactionElementSpecs[10], EventSpec.TOUCH_END, states[5],
                           new GuardSpec(ParameterSpec.TOUCH_X_COORDINATE, OperandSpec.LARGER, 477),
                           new GuardSpec(ParameterSpec.TOUCH_Y_COORDINATE, OperandSpec.LARGER, 567),
                           new GuardSpec(ParameterSpec.TOUCH_X_COORDINATE, OperandSpec.SMALLER, 660),
                           new GuardSpec(ParameterSpec.TOUCH_Y_COORDINATE, OperandSpec.SMALLER, 593)),

        // transitions in project list screen of touch screen mode
        new TransitionSpec(states[5], interactionElementSpecs[10], EventSpec.TOUCH_END, states[4],
                           new GuardSpec(ParameterSpec.TOUCH_X_COORDINATE, OperandSpec.LARGER, 28),
                           new GuardSpec(ParameterSpec.TOUCH_Y_COORDINATE, OperandSpec.LARGER, 340),
                           new GuardSpec(ParameterSpec.TOUCH_X_COORDINATE, OperandSpec.SMALLER, 220),
                           new GuardSpec(ParameterSpec.TOUCH_Y_COORDINATE, OperandSpec.SMALLER, 380)),
        new TransitionSpec(states[5], interactionElementSpecs[10], EventSpec.TOUCH_END, states[6],
                           new GuardSpec(ParameterSpec.TOUCH_X_COORDINATE, OperandSpec.LARGER, 790),
                           new GuardSpec(ParameterSpec.TOUCH_Y_COORDINATE, OperandSpec.LARGER, 280),
                           new GuardSpec(ParameterSpec.TOUCH_X_COORDINATE, OperandSpec.SMALLER, 880),
                           new GuardSpec(ParameterSpec.TOUCH_Y_COORDINATE, OperandSpec.SMALLER, 306)),

        // transitions in project details no analysis screen of touch screen mode
        new TransitionSpec(states[6], interactionElementSpecs[10], EventSpec.TOUCH_END, states[5],
                           new GuardSpec(ParameterSpec.TOUCH_X_COORDINATE, OperandSpec.LARGER, 11),
                           new GuardSpec(ParameterSpec.TOUCH_Y_COORDINATE, OperandSpec.LARGER, 151),
                           new GuardSpec(ParameterSpec.TOUCH_X_COORDINATE, OperandSpec.SMALLER, 100),
                           new GuardSpec(ParameterSpec.TOUCH_Y_COORDINATE, OperandSpec.SMALLER, 179)),
        new TransitionSpec(states[6], interactionElementSpecs[10], EventSpec.TOUCH_END, states[7],
                           new GuardSpec(ParameterSpec.TOUCH_X_COORDINATE, OperandSpec.LARGER, 49),
                           new GuardSpec(ParameterSpec.TOUCH_Y_COORDINATE, OperandSpec.LARGER, 339),
                           new GuardSpec(ParameterSpec.TOUCH_X_COORDINATE, OperandSpec.SMALLER, 240),
                           new GuardSpec(ParameterSpec.TOUCH_Y_COORDINATE, OperandSpec.SMALLER, 380)),

        // transitions in new analysis screen of touch screen mode
        new TransitionSpec(states[7], interactionElementSpecs[10], EventSpec.TOUCH_END, states[6],
                           new GuardSpec(ParameterSpec.TOUCH_X_COORDINATE, OperandSpec.LARGER, 395),
                           new GuardSpec(ParameterSpec.TOUCH_Y_COORDINATE, OperandSpec.LARGER, 567),
                           new GuardSpec(ParameterSpec.TOUCH_X_COORDINATE, OperandSpec.SMALLER, 468),
                           new GuardSpec(ParameterSpec.TOUCH_Y_COORDINATE, OperandSpec.SMALLER, 593)),
        new TransitionSpec(states[7], interactionElementSpecs[10], EventSpec.TOUCH_END, states[8],
                           new GuardSpec(ParameterSpec.TOUCH_X_COORDINATE, OperandSpec.LARGER, 477),
                           new GuardSpec(ParameterSpec.TOUCH_Y_COORDINATE, OperandSpec.LARGER, 567),
                           new GuardSpec(ParameterSpec.TOUCH_X_COORDINATE, OperandSpec.SMALLER, 660),
                           new GuardSpec(ParameterSpec.TOUCH_Y_COORDINATE, OperandSpec.SMALLER, 593)),

        // transitions in running analysis screen of touch screen mode
        new TransitionSpec(states[8], interactionElementSpecs[10], EventSpec.TOUCH_END, states[5],
                           new GuardSpec(ParameterSpec.TOUCH_X_COORDINATE, OperandSpec.LARGER, 11),
                           new GuardSpec(ParameterSpec.TOUCH_Y_COORDINATE, OperandSpec.LARGER, 151),
                           new GuardSpec(ParameterSpec.TOUCH_X_COORDINATE, OperandSpec.SMALLER, 100),
                           new GuardSpec(ParameterSpec.TOUCH_Y_COORDINATE, OperandSpec.SMALLER, 179)),
        new TransitionSpec(states[8], interactionElementSpecs[10], EventSpec.TOUCH_END, states[7],
                           new GuardSpec(ParameterSpec.TOUCH_X_COORDINATE, OperandSpec.LARGER, 49),
                           new GuardSpec(ParameterSpec.TOUCH_Y_COORDINATE, OperandSpec.LARGER, 567),
                           new GuardSpec(ParameterSpec.TOUCH_X_COORDINATE, OperandSpec.SMALLER, 240),
                           new GuardSpec(ParameterSpec.TOUCH_Y_COORDINATE, OperandSpec.SMALLER, 609)),
        new TransitionSpec(states[8], new TimeoutSpec(3000), states[9]),

        // transitions in finished analysis screen of touch screen mode
        new TransitionSpec(states[9], interactionElementSpecs[10], EventSpec.TOUCH_END, states[5],
                           new GuardSpec(ParameterSpec.TOUCH_X_COORDINATE, OperandSpec.LARGER, 11),
                           new GuardSpec(ParameterSpec.TOUCH_Y_COORDINATE, OperandSpec.LARGER, 151),
                           new GuardSpec(ParameterSpec.TOUCH_X_COORDINATE, OperandSpec.SMALLER, 100),
                           new GuardSpec(ParameterSpec.TOUCH_Y_COORDINATE, OperandSpec.SMALLER, 179)),
    };*/
}
