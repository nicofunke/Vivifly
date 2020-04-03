import { VisualizationType } from "../types/visualization-type.type";

/**
 * Interface for visualization effects during states in the Vivian Framework
 */
export interface VisualizationCondition {
    Type: VisualizationType,
    VisualizationElement: string,

    // float visualization specific parameters ( for lights )
    Value?: number,

    // Screen specific parameters
    FileName?: string               // This parameter is optional since it will be generated on export
    File?: File                     // This parameter will be used instead of FileName during runtime
}