import { ApplicationState, APPLICATION_STATE_DEFAULT } from './application-state.interface'
import { InteractionElement } from './interaction-element.interface'
import { State } from './state.interface'
import { Transition } from './transition.interface'
import { UnityWrapper } from '../Utils/UnityWrapper'
import { VisualizationElement } from './visualization-element.interface'

/**
* Interface for the AppContext
*/
export interface AppContext {
    applicationState: ApplicationState,
    interactionElements: InteractionElement[],
    states: State[],
    transitions: Transition[],
    unityWrapper?: UnityWrapper,
    visualizationElements: VisualizationElement[],
}
