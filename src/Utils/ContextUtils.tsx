import { ElementType, ELEMENT_TYPE_SCREEN, ELEMENT_TYPE_LIGHT, ELEMENT_TYPE_BUTTON } from '../types/element-type.type'
import { ContextState } from '../interfaces/context-state.interface'
import { Color } from '../interfaces/color.interface'
import { Transition } from '../interfaces/transition.interface';
import { State } from '../interfaces/state.interface';
import { VisualizationValue } from '../interfaces/visualization-value.interface'
import { VISUALIZATION_TYPE_SCREEN } from '../types/visualization-type.type'
import { VisualizationElement } from '../interfaces/visualization-element.interface';
import { InterActionElement } from '../interfaces/interaction-element.interface';

// TODO: Rename interAction to interaction 

/**
 * Utils class with static helper functions to work with the application state(context)
 */
export class ContextUtils {

    /**
     * Returns an array with the types (Button, Light, ...) of the given element
     * @param element                   Name of the element
     * @param interActionElements       Current interActionElements
     * @param visualizationElements     Current visualizationElements
     */
    static getElementTypes(element: string,
        interActionElements: InterActionElement[], visualizationElements: VisualizationElement[]): ElementType[] {

        let elementTypes: ElementType[] = []
        for (const interactionElement of interActionElements) {
            if (interactionElement.Name === element) {
                elementTypes.push(interactionElement.Type)
            }
        }
        for (const visualizationElement of visualizationElements) {
            if (visualizationElement.Name === element) {
                elementTypes.push(visualizationElement.Type)
            }
        }
        return elementTypes
    }

    /**
     * Returns the color of a light element or null if element is no light 
     *
     * @param element                   Name of the element
     * @param visualizationElements     Currently existing visualizationElements
     */
    static getLightEmissionColor(element: string, visualizationElements: VisualizationElement[]): Color | undefined {
        const visualizationElement = visualizationElements.find(visualizationElement => visualizationElement.Name === element)
        if (!visualizationElement) {
            // Element is no light -> Stop
            return undefined
        }
        return visualizationElement.EmissionColor
    }

    /**
     * Returns the emission strength of an element in a certain situation
     * 
     * @param element           Name of the element
     * @param situationID       ID of the situation
     * @param states            Currently existing states
     */
    static getLightEmissionStrength(element: string, situationID: number, states: State[]): number | undefined {
        const emissionSituation = states.find(state => state.id === situationID)
        if (!emissionSituation) {
            // situation does not exist -> Stop
            return undefined
        }
        if (!emissionSituation.Values) {
            return 0.0
        }
        const visualizationValue = emissionSituation.Values.find(value => value.VisualizationElement === element && value.Type === "FloatValueVisualization")
        // Return 0.0 if element has no visualization currently
        return !!visualizationValue ? visualizationValue.Value : 0.0
    }

    /**
     * Returns the transition of a certain interactionElement in a certain situation
     * 
     * @param interactionElement    Name of the element that triggers the transition
     * @param situationId           Id of the source state
     * @param transition            Currently existing transitions
     */
    static getButtonTransition(interactionElement: string, situationID: number, transitions: Transition[]): Transition | undefined {
        return transitions.find(transition =>
            (transition.SourceStateID === situationID && transition.InteractionElement === interactionElement))
    }

    /**
     * Returns the time-based transition of a certain source situation
     * @param situationID   ID of the source situation
     * @param transitions   Currently existing transitions
     */
    static getTimeBasedTransition(situationID: number, transitions: Transition[]): Transition | undefined {
        return transitions.find(transition =>
            (!!transition.Timeout && transition.SourceStateID === situationID))
    }

    /**
     * Returns the image file that is currently displayed on a certain screen in a certain situation
     * 
     * @param element       Name of the screen element
     * @param situationId   ID of the situation
     * @param states        Currently existing states
     */
    static getScreenImage(element: string, situationId: number, states: State[]): File | undefined {
        const state = states.find(
            (state: State) => state.id === situationId
        )
        if (!state || !state.Values) {
            return undefined
        }
        const visualization = state.Values.find(
            (visualization: VisualizationValue) => (visualization.VisualizationElement === element && visualization.Type === VISUALIZATION_TYPE_SCREEN)
        )
        if (!visualization || !visualization.File) {
            return undefined
        }
        return visualization.File
    }

    /**
     * Returns whether an element is an element of a certain type
     * 
     * @param element   Name of the element   
     * @param type      Type to check for
     * @param context   Current Context
     */
    static elementHasType(element: string, type: ElementType, context: ContextState): boolean {
        // Visualization elements
        if (type === ELEMENT_TYPE_SCREEN || type === ELEMENT_TYPE_LIGHT) {
            return !!context.visualizationElements.find(
                (visualizationElement: VisualizationElement) => (
                    visualizationElement.Name === element && visualizationElement.Type === type
                )
            )
        }
        // Interaction elements
        if (type === ELEMENT_TYPE_BUTTON) {
            return !!context.interactionElements.find(
                (interActionElement: InterActionElement) => (
                    interActionElement.Name === element && interActionElement.Type === type
                )
            )
        }
        // Unknown type 
        return false
    }

    /**
     * Checks if a situation name is currently valid (is no duplicate)
     * @param name          Situation name to check
     * @param states         Currently existing states
     */
    static isProperSituationName(name: string, states: State[]): boolean {
        const isDuplicate = states.filter(state => state.Name === name).length > 1
        return !!name && name !== "" && !isDuplicate
    }
}
