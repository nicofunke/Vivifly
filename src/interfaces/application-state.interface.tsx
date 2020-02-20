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
    showFirstSituationInformation: boolean,     // If the information for the first created situation should be visible
    showNewElementTypeModal: boolean,               // If the modal to add a new type to an element should be visible
    showSituationNamingModal: boolean,          // If the modal to choose a name for the situation should be visible
    showTimeBasedTransitionModal: boolean,      // If the modal to create a time based transition should be visible
    modelWasUploaded: boolean,                  // If a model was already uploaded
    planeSelectionElementName: string | null,   // Current element for plane selection for screens ( or null if plane selection is not active )
    clickedPlane: Vector3 | undefined,          // Stores the normal vector of the plane of the selected element the user clicked on on
    lastSituationID: number,                    // Stores the last visited situation in order to go back to this situation if the current one gets removed 
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
    showFirstSituationInformation: false,
    showNewElementTypeModal: false,
    showSituationNamingModal: false,
    showTimeBasedTransitionModal: false,
    modelWasUploaded: true,
    planeSelectionElementName: null,
    clickedPlane: undefined,
    lastSituationID: 0,
}