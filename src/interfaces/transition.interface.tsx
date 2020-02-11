/**
 * Interface for modelling transitions as in the Vivian Framework format
 */
export interface Transition {
    SourceStateID?: number,             // The IDs are used during runtime and get removed during export
    DestinationStateID?: number,
    InteractionElement: string,
    Event: number,
    SourceState?: string,               // Source and Destination state will be null until export
    DestinationState?: string
}