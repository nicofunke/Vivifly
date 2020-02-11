
/**
 * Interface for the application state during a session
 */
export interface ApplicationState {
    currentSituationID: number,
    selectedElement: string,
    unityLoadingProgress: number,               // from 0.0 to 1.0
    hasAlreadySelectedAnElement: boolean,       // if the user has already clicked on an element
    nextSituationID: number,                    // in order to give new situations a unique ID
    isCurrentlyUploading: boolean,              // If the application currently uploads a model
    modelWasUploaded: boolean,                  // If a model was already uploaded
    planeSelectionElementName: string | null,          // Current element for plane selection for screens ( or null if plane selection is not active )
}

/**
 * Default applicationState after starting the app
 */
export const APPLICATION_STATE_DEFAULT: ApplicationState = {
    currentSituationID: 0,
    selectedElement: "",
    unityLoadingProgress: 0.0,
    hasAlreadySelectedAnElement: false,
    nextSituationID: 1,
    isCurrentlyUploading: false,
    modelWasUploaded: true,
    planeSelectionElementName: null
}