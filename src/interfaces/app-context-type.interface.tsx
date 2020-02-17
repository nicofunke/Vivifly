import { ApplicationState } from './application-state.interface';
import { InterActionElement } from './interaction-element.interface';
import { State } from './state.interface';
import { Transition } from './transition.interface';
import { UnityWrapper } from '../Utils/UnityWrapper';
import { VisualizationElement } from './visualization-element.interface';
import { Vector3 } from './vector3.interface';
import { Vector2 } from './vector2.interface';
import { Color } from './color.interface';

/**
* Interface to type the AppContext
*/
export interface AppContextType {

    // Context variables
    applicationState: ApplicationState,
    interactionElements: InterActionElement[],
    states: State[],
    transitions: Transition[],
    unityWrapper?: UnityWrapper,
    visualizationElements: VisualizationElement[],

    // Methods
    addElementType: (element: string, type: string) => void,
    createNewSituation: (newSituationName: string) => void,
    removeElementType: (element: string, type: string) => void,
    removeSituation: (situationID: number) => void,
    renameSituation: (situationID: number, newSituationName: string) => void,
    showFirstSituationInformationWindow: () => void,
    setCurrentSituation: (currentSituationID: number) => void,
    setLightColor: (element: string, color: Color) => void,
    setScreenImage: (element: string, situationID: number, imageFile: File) => void,
    setScreenPlane: (planeSelectionElement: string, plane: Vector3) => void,
    setScreenResolution: (element: string, resolution: Vector2) => void,
    setLightEmission: (element: string, emissionSituationID: number, emissionStrength: number) => void,
    setSelectedElement: (selectedElement: string, clickedPlane: Vector3 | undefined) => void,
    setSituationNamingModalVisibility: (isVisible: boolean) => void,
    setTimeBasedTransitionWindowVisibility: (isVisible: boolean) => void,
    setTransition: (sourceSituationID: number, destinationSituationID: number, button: string) => void,
    setUnityLoadingProgress: (progress: number) => void,
    startPlaneSelection: (element: string) => void
}