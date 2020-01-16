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
using System.Collections.Generic;
using System;
using System.Collections;

namespace de.ugoe.cs.vivian.core
{
    /**
     * 
     */
    public class StateMachine
    {
        /** the events that can be fired by interaction elements */
        public event EventHandler<StateChangeEvent> StateChangeEvent;

        private readonly TransitionSpec[] Transitions;

        private StateSpec CurrentState = null;

        private MonoBehaviour TimeoutHandler;

        private int NextTimeoutId = 0;

        private List<int> TimeoutIds = new List<int>();

        private Dictionary<string, InteractionElement> InteractionElements = new Dictionary<string, InteractionElement>();

        private Dictionary<string, Visualization> Visualizations = new Dictionary<string, Visualization>();

        /**
         * 
         */
        internal StateMachine(TransitionSpec[] transitions, MonoBehaviour timeoutHandler)
        {
            this.Transitions = transitions;
            this.TimeoutHandler = timeoutHandler;
        }

        /**
         * 
         */
        internal void Start(StateSpec initialState)
        {
            this.CurrentState = initialState;
            GetInteractionElements();
            GetVisualizationElements();
            ApplyVisualizations(true);
        }

        /**
         * 
         */
        private void GetInteractionElements()
        {
            InteractionElement[] interactionElements = GameObject.FindObjectsOfType<InteractionElement>();

            foreach (InteractionElement interactionElement in interactionElements)
            {
                this.InteractionElements.Add(interactionElement.Spec.Name, interactionElement);
            }
        }

        /**
         * 
         */
        private void GetVisualizationElements()
        {
            Visualization[] visualizations = GameObject.FindObjectsOfType<Visualization>();

            // there may not be any transitions, hence check at least the current state for visualizations
            GetVisualizationElementsFromState(this.CurrentState, visualizations);

            foreach (TransitionSpec transition in this.Transitions)
            {
                GetVisualizationElementsFromState(transition.SourceState, visualizations);
                GetVisualizationElementsFromState(transition.DestinationState, visualizations);
            }
        }

        /**
         * 
         */
        private void GetVisualizationElementsFromState(StateSpec state, Visualization[] visualizations)
        {
            foreach (IConditionSpec conditionSpec in state.Conditions)
            {
                if ((conditionSpec is IVisualizationSpec) &&
                    (!this.Visualizations.ContainsKey(((IVisualizationSpec)conditionSpec).VisualizationSpec.Name)))
                {
                    string name = ((IVisualizationSpec)conditionSpec).VisualizationSpec.Name;

                    foreach (Visualization candidate in visualizations)
                    {
                        if (candidate.Spec.Name == name)
                        {
                            this.Visualizations.Add(name, candidate);
                            break;
                        }
                    }

                    if (!this.Visualizations.ContainsKey(name))
                    {
                        throw new ArgumentException("the defined visualization specification " + name +
                                                    " does not have its instantiated counterpart");
                    }
                }
            }
        }

        /**
         * 
         */
        internal void HandleInteractionEvent(object source, InteractionElementEvent interactionEvent)
        {
            bool wasStateChange = false;

            foreach (TransitionSpec transition in Transitions)
            {
                if ((transition.SourceState == CurrentState) &&
                    (transition.InteractionElement == interactionEvent.InteractionElementSpec) &&
                    (transition.Event == interactionEvent.EventSpec))
                {
                    bool guardsMatch = true;

                    if (transition.Guards != null)
                    {
                        foreach (GuardSpec guard in transition.Guards)
                        {
                            if (guard is EventGuardSpec eventGuard)
                            {
                                bool parameterFound = false;

                                foreach (KeyValuePair<EventParameterSpec, float> value in interactionEvent.ParameterValues)
                                {
                                    if (value.Key == eventGuard.EventParameter)
                                    {
                                        parameterFound = true;

                                        if (!eventGuard.Matches(value.Value))
                                        {
                                            guardsMatch = false;
                                            break;
                                        }
                                    }
                                }

                                if (!parameterFound)
                                {
                                    throw new ArgumentException("A guard for a transition from state " + transition.SourceState.Name +
                                                                " to state " + transition.DestinationState.Name + 
                                                                " checks for the event parameter " + eventGuard.EventParameter +
                                                                " on an interaction event of type " + transition.Event +
                                                                " that does not provide this parameter");
                                }
                            }
                            else if (guard is InteractionElementGuardSpec interactionElementGuard)
                            {
                                if (!this.InteractionElements.TryGetValue(interactionElementGuard.InteractionElement.Name,
                                                                          out InteractionElement element))
                                {
                                    throw new ArgumentException("the interaction element " + interactionElementGuard.InteractionElement.Name +
                                                                " specified in an interaction element guard does not exist");
                                }

                                switch(interactionElementGuard.Attribute)
                                {
                                    case InteractionElementSpec.Attribute.VALUE:
                                        if (!interactionElementGuard.Matches(element.Value))
                                        {
                                            guardsMatch = false;
                                        }
                                        break;
                                    case InteractionElementSpec.Attribute.POSITION:
                                        if (!interactionElementGuard.Matches(element.RepresentedObject.transform.localPosition))
                                        {
                                            guardsMatch = false;
                                        }
                                        break;

                                    default:
                                        throw new ArgumentException("The interaction element attribute " + interactionElementGuard.Attribute +
                                                                    " of a guard for a transition from state " + transition.SourceState.Name +
                                                                    " to state " + transition.DestinationState.Name +
                                                                    " is not supported.");
                                }

                                if (!guardsMatch)
                                {
                                    break;
                                }

                            }
                            else
                            {
                                throw new ArgumentException("unknown type of guard spec " + guard);
                            }
                        }
                    }

                    if (guardsMatch)
                    {
                        Debug.Log("handled " + interactionEvent.EventSpec + " on " + interactionEvent.InteractionElementSpec +
                                  " --> transitioning to " + transition.DestinationState.Name);
                        this.CurrentState = transition.DestinationState;
                        SetupTimeouts();

                        RaiseStateChangeEvent(this.CurrentState.Name);
                        wasStateChange = true;

                        break;
                    }
                }
            }

            ApplyVisualizations(wasStateChange);
            ApplyInteractionElementConditions(wasStateChange);
        }

        /**
         * 
         */
        private void ApplyVisualizations(bool wasStateChange)
        {
            foreach (IConditionSpec conditionSpec in CurrentState.Conditions)
            {
                if (!(conditionSpec is IVisualizationSpec))
                {
                    continue;
                }

                IVisualizationSpec visualizationSpec = (IVisualizationSpec)conditionSpec;

                if (this.Visualizations.TryGetValue(visualizationSpec.VisualizationSpec.Name,
                                                    out Visualization visualization))
                {
                    if (visualizationSpec is FloatValueVisualizationSpec)
                    {
                        // handle float value visualization, but only if the state changed. Calls to these
                        // methods without state change will not cause an update for the values.
                        if (wasStateChange)
                        {
                            visualization.Visualize(((FloatValueVisualizationSpec)visualizationSpec).Value);
                        }
                    }
                    else if (visualizationSpec is ValueOfInteractionElementVisualizationSpec)
                    {
                        // handle value of interaction element visualization. The need to be forwarded always,
                        // independent of state changes
                        string name = ((ValueOfInteractionElementVisualizationSpec)visualizationSpec).InteractionElementSpec.Name;

                        if (InteractionElements.TryGetValue(name, out InteractionElement interactionElement))
                        {
                            visualization.Visualize(interactionElement.Value);
                        }
                        else
                        {
                            throw new ArgumentException("the visualization spec references the interaction element " +
                                                        name + " for which its counterpart does not exist");
                        }
                    }
                    else if (visualizationSpec is ScreenContentVisualizationSpec)
                    {
                        // handle screen content visualization, but only if the state changed. Calls to these
                        // methods without state change will not cause an update for the values.
                        if (wasStateChange)
                        {
                            visualization.Visualize(((ScreenContentVisualizationSpec)visualizationSpec).FileName);
                        }
                    }
                    else
                    {
                        throw new NotSupportedException("cannot handle visualization specs of type " + visualizationSpec.GetType());
                    }
                }
                else
                {
                    throw new ArgumentException("the visualization spec references the visualization element " +
                                                visualizationSpec.VisualizationSpec.Name +
                                                " for which its counterpart does not exist");

                }
            }
        }

        /**
         * 
         */
        private void ApplyInteractionElementConditions(bool wasStateChange)
        {
            List<InteractionElement> appliedConditions = new List<InteractionElement>();

            foreach (IConditionSpec conditionSpec in CurrentState.Conditions)
            {
                if (!(conditionSpec is InteractionElementConditionSpec interactionElementConditionSpec))
                {
                    continue;
                }

                if (this.InteractionElements.TryGetValue(interactionElementConditionSpec.InteractionElementSpec.Name,
                                                         out InteractionElement interactionElement))
                {
                    interactionElement.SetAttribute(interactionElementConditionSpec.Attribute, interactionElementConditionSpec.Value);
                    appliedConditions.Add(interactionElement);
                }
                else
                {
                    throw new ArgumentException("the interaction element condition spec references the interaction element " +
                                                interactionElementConditionSpec.InteractionElementSpec.Name +
                                                " for which its counterpart does not exist");

                }
            }
        }

        /**
         * 
         */
        private void SetupTimeouts()
        {
            this.TimeoutIds.Clear();

            foreach (TransitionSpec transition in Transitions)
            {
                if ((transition.Timeout != null) && (transition.SourceState == CurrentState))
                {
                    this.TimeoutIds.Add(this.NextTimeoutId);
                    this.TimeoutHandler.StartCoroutine(HandleTimeout(this.NextTimeoutId++, transition));
                }
            }
        }

        /**
         * 
         */
        private IEnumerator HandleTimeout(int timeoutId, TransitionSpec transition)
        {
            yield return new WaitForSeconds(transition.Timeout.Timeout / 1000);

            if ((transition.SourceState == CurrentState) &&
                (this.TimeoutIds.Contains(timeoutId)))
            {
                CurrentState = transition.DestinationState;
                SetupTimeouts();
                ApplyVisualizations(true);
                ApplyInteractionElementConditions(true);
            }
        }

        /**
         * 
         */
        protected virtual void RaiseStateChangeEvent(string stateName)
        {
            this.StateChangeEvent?.Invoke(this, new StateChangeEvent(stateName));
        }
    }

    public class StateChangeEvent : EventArgs
    {
        public string StateName { get; }

        public StateChangeEvent(string stateName)
        {
            this.StateName = stateName;
        }
    }
}
