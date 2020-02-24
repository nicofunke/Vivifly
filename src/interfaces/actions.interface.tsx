import { Vector3 } from './vector3.interface'
import { Vector2 } from './vector2.interface'
import { Color } from './color.interface'
import { ElementType } from '../types/element-type.type'

/**
 * Interface that holds all actions for the current appcontext
 */
export interface Actions {
    addElementType: (element: string, type: ElementType) => void,
    createNewSituation: (newSituationName: string) => number,
    removeElementType: (element: string, type: string) => void,
    removeSituation: (situationID: number) => void,
    removeTimeBasedTransition: (sourceSituationID: number) => void,
    renameSituation: (situationID: number, newSituationName: string) => void,
    showFirstSituationInformationWindow: () => void,
    setCurrentSituation: (currentSituationID: number) => void,
    setLightColor: (element: string, color: Color) => void,
    setNewElementTypeModalVisibility: (isVisible: boolean) => void,
    setScreenImage: (element: string, situationID: number, imageFile: File | undefined) => void,
    setScreenPlane: (planeSelectionElement: string, plane: Vector3) => void,
    setScreenResolution: (element: string, resolution: Vector2) => void,
    setLightEmission: (element: string, emissionSituationID: number, emissionStrength: number) => void,
    setSelectedElement: (selectedElement: string, clickedPlane: Vector3 | undefined) => void,
    setRenamingModalSituation: (situationID: number | undefined) => void,
    setTimeBasedTransition: (sourceSituationID: number, destinationSituationID: number, timeout: number) => void,
    setTimeBasedTransitionModalVisibility: (isVisible: boolean) => void,
    setButtonTransition: (sourceSituationID: number, destinationSituationID: number | undefined, button: string) => void,
    setUnityLoadingProgress: (progress: number) => void,
    setPlaneSelectionMode: (element: string, active: boolean) => void
}

/**
 * Default (empty) action values
 */
export const ACTIONS_EMPTY: Actions = {
    addElementType: (element: string, type: ElementType) => { },
    createNewSituation: (newSituationName: string) => -1,
    removeElementType: (element: string, type: string) => { },
    removeSituation: (situationID: number) => { },
    removeTimeBasedTransition: (sourceSituationID: number) => { },
    renameSituation: (situationID: number, newSituationName: string) => { },
    showFirstSituationInformationWindow: () => { },
    setCurrentSituation: (currentSituationID: number) => { },
    setLightColor: (element: string, color: Color) => { },
    setLightEmission: (element: string, emissionSituationID: number, emissionStrength: number) => { },
    setNewElementTypeModalVisibility: (isVisible: boolean) => { },
    setScreenImage: (element: string, situationID: number, imageFile: File | undefined) => { },
    setScreenPlane: (planeSelectionElement: string, plane: Vector3) => { },
    setScreenResolution: (element: string, resolution: Vector2) => { },
    setSelectedElement: (selectedElement: string, clickedPlane: Vector3 | undefined) => { },
    setRenamingModalSituation: (situationID: number | undefined) => { },
    setTimeBasedTransition: (sourceSituationID: number, destinationSituationID: number, timeout: number) => { },
    setTimeBasedTransitionModalVisibility: (isVisible: boolean) => { },
    setButtonTransition: (sourceSituationID: number, destinationSituationID: number | undefined, button: string) => { },
    setUnityLoadingProgress: (progress: number) => { },
    setPlaneSelectionMode: (element: string | undefined, active: boolean) => { }
}