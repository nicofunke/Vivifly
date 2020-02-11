import { InterActionElement } from './interaction-element.interface'
import { State } from './state.interface';
import { Transition } from './transition.interface';
import { UnityWrapper } from '../Utils/UnityWrapper';
import { ApplicationState } from './application-state.interface';
import { VisualizationElement } from './visualization-element.interface';

/**
 * Interface to store all context variables such as the Vivian state machine and all current application variables
 */
export interface ContextState {
        interactionElements: InterActionElement[],
        states: State[],
        transitions: Transition[],
        visualizationElements: VisualizationElement[],
        applicationState: ApplicationState,
        unityWrapper?: UnityWrapper
}