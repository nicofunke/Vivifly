import React from 'react'
import { AppContextType } from '../../interfaces/app-context-type.interface';
import { APPLICATION_STATE_DEFAULT } from '../../interfaces/application-state.interface';
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
    addButtonTransition: (sourceSituationID: number, destinationSituationID: number, button: string) => { },
    addElementType: (element: string, type: string) => { },
    changeButtonTransitionDestination: (sourceSituationID: number, button: string, newDestinationSituationID: number) => { },
    createNewSituation: (newSituationName: string) => { },
    removeElementType: (element: string, type: string) => { },
    renameSituation: (situationID: number, newSituationName: string) => { },
    setCurrentSituation: (currentSituationID: number) => { },
    setLightColor: (element: string, red: number, green: number, blue: number) => { },
    setLightEmission: (element: string, emissionSituationID: number, emissionStrength: number) => { },
    setSelectedElement: (selectedElement: string) => { },
    setUnityLoadingProgress: (progress: number) => { },
    startPlaneSelection: (element: string) => { }
}

/**
 * Export the context variable
 */
export const AppContext: React.Context<AppContextType> = React.createContext(APP_CONTEXT_DEFAULT)


