/**
 * Utils class with static helper function to work with the application state(context)
 */
export class ContextUtils {

    /**
     * Returns an array with the types (Button, Light, ...) of the given element
     */
    static getElementTypes(element, context) {
        let elementTypes = []
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
     */
    static getLightEmissionColor(element, context) {
        const visualizationElement = context.visualizationElements.find(visualizationElement => visualizationElement.Name === element)
        if (!visualizationElement) {
            // Element is no light -> Stop
            return null
        }
        return visualizationElement.EmissionColor
    }
}
