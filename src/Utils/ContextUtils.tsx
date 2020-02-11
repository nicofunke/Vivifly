import { ElementType } from '../types/element-type.type';
import { ContextState } from '../interfaces/context-state.interface';
import { Color } from '../interfaces/color.interface';
import { Transition } from '../interfaces/transition.interface';

/**
 * Utils class with static helper function to work with the application state(context)
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
        if(!emissionSituation.Values){
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
}
