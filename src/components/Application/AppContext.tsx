import React from 'react'
import { AppContextType } from '../../interfaces/app-context-type.interface';
import { APPLICATION_STATE_DEFAULT } from '../../interfaces/application-state.interface';
import { Vector3 } from '../../interfaces/vector3.interface';
import { Vector2 } from '../../interfaces/vector2.interface';
import { Color } from '../../interfaces/color.interface';
/**
 * This file provides the necessary variables to handle a context provided by AppProvider
 * see https://www.freecodecamp.org/news/react-context-in-5-minutes/
 */

/**
 * Default context value with empty methods
 */
export const APP_CONTEXT_DEFAULT: AppContextType = {
    // Context variables
    applicationState: APPLICATION_STATE_DEFAULT,
    interactionElements: [],
    states: [],
    transitions: [],
    visualizationElements: [],

    // Methods
    addElementType: (element: string, type: string) => { },
    createNewSituation: (newSituationName: string) => { },
    removeElementType: (element: string, type: string) => { },
    renameSituation: (situationID: number, newSituationName: string) => { },
    showNewSituationInformationWindow: () => {},
    setCurrentSituation: (currentSituationID: number) => { },
    setLightColor: (element: string, color: Color) => { },
    setLightEmission: (element: string, emissionSituationID: number, emissionStrength: number) => { },
    setScreenImage: (element: string, situationID: number, imageFile: File) => { },
    setScreenPlane: (planeSelectionElement: string, plane: Vector3) => { },
    setScreenResolution: (element: string, resolution: Vector2) => { },
    setSelectedElement: (selectedElement: string, clickedPlane: Vector3) => { },
    setTransition: (sourceSituationID: number, destinationSituationID: number, button: string) => { },
    setUnityLoadingProgress: (progress: number) => { },
    startPlaneSelection: (element: string) => { }
}

/**
 * Export the context variable
 */
export const AppContext: React.Context<AppContextType> = React.createContext(APP_CONTEXT_DEFAULT)


