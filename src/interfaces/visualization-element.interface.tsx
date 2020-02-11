import { Vector3 } from './vector3.interface';
import { Vector2 } from './vector2.interface';
import { Color } from './color.interface';
import { ElementType } from '../types/element-type.type';

/**
 * Visualization element definition as it is used in Vivian Framework
 */
export interface VisualizationElement {
    Type: ElementType,
    Name: string,

    // Light specific values
    EmissionColor: Color,

    // Screen specific values
    Plane?: Vector3,
    Resolution?: Vector2
}