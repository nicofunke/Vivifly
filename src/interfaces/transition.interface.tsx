/**
 * Interface for modelling transitions as in the Vivian Framework format
 */
export interface Transition {
    // Runtime variables
    SourceStateID?: number,             // The IDs are used during runtime and get removed during export
    DestinationStateID?: number,
    
    // Export variables
    SourceState?: string,               // Source and Destination state will be null until export
    DestinationState?: string,
    
    // Interaction variables
    InteractionElement?: string,
    Event?: number,

    // time-based variables
    Timeout?: number
}
