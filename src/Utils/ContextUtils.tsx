import { ElementType, ELEMENT_TYPE_SCREEN, ELEMENT_TYPE_LIGHT, ELEMENT_TYPE_BUTTON } from '../types/element-type.type';
import { ContextState } from '../interfaces/context-state.interface';
import { Color } from '../interfaces/color.interface';
import { Transition } from '../interfaces/transition.interface';
import { State } from '../interfaces/state.interface';
import { VisualizationValue } from '../interfaces/visualization-value.interface';
import { VISUALIZATION_TYPE_SCREEN } from '../types/visualization-type.type';
import { VisualizationElement } from '../interfaces/visualization-element.interface';
import { InterActionElement } from '../interfaces/interaction-element.interface';

/**
 * Utils class with static helper functions to work with the application state(context)
 */
export class ContextUtils {

    /**
     * Returns an array with the types (Button, Light, ...) of the given element
     *
     * @param element       Name of the element
     * @param context       Current context
     */
    static getElementTypes(element: string, context: ContextState): ElementType[] {
        let elementTypes: ElementType[] = []
        for (const interactionElement of context.interactionElements) {
            if (interactionElement.Name === element) {
                elementTypes.push(interactionElement.Type)
            }
        }
        for (const visualizationElement of context.visualizationElements) {
            if (visualizationElement.Name === element) {
                elementTypes.push(visualizationElement.Type)
            }
        }
        return elementTypes
    }

    /**
     * Returns the color of a light element or null if element is no light 
     *
     * @param element   Name of the element
     * @param context   Current context
     */
    static getLightEmissionColor(element: string, context: ContextState): Color | undefined {
        const visualizationElement = context.visualizationElements.find(visualizationElement => visualizationElement.Name === element)
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
     * @param situationID       id of the situation
     * @param context           Current context
     */
    static getLightEmissionStrength(element: string, situationID: number, context: ContextState): number | undefined {
        const emissionSituation = context.states.find(state => state.id === situationID)
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
     * @param interactionElement    Name of the elemen that triggers the transition
     * @param situationId           Id of the source state
     * @param context               Current context
     */
    static getTransition(interactionElement: string, situationId: number, context: ContextState): Transition | undefined {
        return context.transitions.find(transition =>
            (transition.SourceStateID === situationId && transition.InteractionElement === interactionElement))
    }

    /**
     * Returns the image file that is currently displayed on a certain screen in a certain situation
     * 
     * @param element       Name of the screen element
     * @param situationId   ID of the situation
     * @param context       Current context
     */
    static getScreenImage(element: string, situationId: number, context: ContextState): File | undefined {
        const state = context.states.find(
            (state: State) => state.id === situationId
        )
        if(!state || !state.Values){
            return undefined
        }
        const visualization = state.Values.find(
            (visualization: VisualizationValue) => ( visualization.VisualizationElement === element && visualization.Type === VISUALIZATION_TYPE_SCREEN)
        )
        if(!visualization || !visualization.File){
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
        if(type === ELEMENT_TYPE_SCREEN || type === ELEMENT_TYPE_LIGHT){
            return !! context.visualizationElements.find(
                (visualizationElement: VisualizationElement) => (
                    visualizationElement.Name === element && visualizationElement.Type === type
                )
            )
        }
        // Interaction elements
        if(type === ELEMENT_TYPE_BUTTON){
            return !! context.interactionElements.find(
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
     * @param context       Current context
     */
    static isProperSituationName(name: string, context: ContextState): boolean{
        const isDuplicate = context.states.filter(state => state.Name === name).length > 1
        return !!name && name !== "" && !isDuplicate
    }
}
