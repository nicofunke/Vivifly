import { Vector3 } from './vector3.interface';

/**
 * Interface for the application state during a session
 */
export interface ApplicationState {
    currentSituationID: number,
    selectedElement: string,
    unityLoadingProgress: number,               // from 0.0 to 1.0
    hasAlreadySelectedAnElement: boolean,       // if the user has already clicked on an element in this situation
    nextSituationID: number,                    // in order to give new situations a unique ID
    isCurrentlyUploading: boolean,              // If the application currently uploads a model
    showFirstSituationWindow: boolean,          // If the information for the first created situation should be visible
    showSituationNamingWindow: boolean,         // If the window to choose a name for the situation shoul be visible
    modelWasUploaded: boolean,                  // If a model was already uploaded
    planeSelectionElementName: string | null,   // Current element for plane selection for screens ( or null if plane selection is not active )
    clickedPlane: Vector3 | undefined,          // Stores the normal vector of the plane of the selected element the user clicked on on
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
    showFirstSituationWindow: false,
    showSituationNamingWindow: false,
    modelWasUploaded: true,
    planeSelectionElementName: null,
    clickedPlane: undefined
}