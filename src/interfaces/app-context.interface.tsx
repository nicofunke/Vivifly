import { ApplicationState, APPLICATION_STATE_DEFAULT } from './application-state.interface'
import { InterActionElement } from './interaction-element.interface'
import { State } from './state.interface'
import { Transition } from './transition.interface'
import { UnityWrapper } from '../Utils/UnityWrapper'
import { VisualizationElement } from './visualization-element.interface'

/**
* Interface for the AppContext
*/
export interface AppContext {
    applicationState: ApplicationState,
    interactionElements: InterActionElement[],
    states: State[],
    transitions: Transition[],
    unityWrapper?: UnityWrapper,
    visualizationElements: VisualizationElement[],
}

/**
 * Default value for the AppContext
 */
export const APP_CONTEXT_DEFAULT: AppContext = {
    // Context variables
    applicationState: APPLICATION_STATE_DEFAULT,
    interactionElements: [],
    states: [],
    transitions: [],
    visualizationElements: []
}