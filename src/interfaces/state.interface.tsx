import { VisualizationCondition } from './visualization-condition.interface';

/**
 * Class for modelling states in the Vivian state machine format
 */
export interface State {
    Name: string,
    id: number,             // This parameter is only used during runtime and will be removed on export
    isStart?: true,         // This parameter is only used during runtime and will be removed on export
    Conditions?: VisualizationCondition[]
}