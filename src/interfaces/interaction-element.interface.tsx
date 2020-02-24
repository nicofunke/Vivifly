import { ElementType } from "../types/element-type.type";

/**
 * Class for modelling interaction elements in the Vivian state machine format
 */
export interface InteractionElement {
    Name: string,
    Type: ElementType
}