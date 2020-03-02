import { Vector3 } from './vector3.interface';
import { InformationBannerType, INFORMATION_BANNER_START } from '../types/information-banner.type';

/**
 * Interface for the application state during a session
 */
export interface ApplicationState {
    currentSituationID: number,
    currentInformationBanner: InformationBannerType, //  Stores which information banner is currently active
    selectedElement: string,
    unityLoadingProgress: number,                   // from 0.0 to 1.0
    nextSituationID: number,                        // in order to give new situations a unique ID
    isCurrentlyUploading: boolean,                  // If the application currently uploads a model
    showNewElementTypeModal: boolean,               // If the modal to add a new type to an element should be visible
    newSituationID?: number,                        // ID of the newly generated situation which still misses a name
    showTimeBasedTransitionModal: boolean,          // If the modal to create a time based transition should be visible
    modelWasUploaded: boolean,                      // If a model was already uploaded
    planeSelectionElementName?: string,             // Current element for plane selection for screens ( or null if plane selection is not active )
    clickedPlane?: Vector3,                         // Stores the normal vector of the plane of the selected element the user clicked on on
    lastSituationID: number,                        // Stores the last visited situation in order to go back to this situation if the current one gets removed 
    isDemoMode: boolean,                            // If the application is currently in "demo-mode" to test the current model 
    demoTimeout?: number                               // Stores the current timeout while in demo mode
}

/**
 * Default applicationState after starting the app
 */
export const APPLICATION_STATE_DEFAULT: ApplicationState = {
    currentSituationID: 0,
    currentInformationBanner: INFORMATION_BANNER_START,
    selectedElement: "",
    unityLoadingProgress: 0.0,
    nextSituationID: 1,
    isCurrentlyUploading: false,
    showNewElementTypeModal: false,
    showTimeBasedTransitionModal: false,
    modelWasUploaded: true,
    lastSituationID: 0,
    isDemoMode: false
}