import React from 'react'
import { UnityWrapper } from '../../Utils/UnityWrapper'
import { ContextUtils } from '../../Utils/ContextUtils'
import { VisualizationCondition } from '../../interfaces/visualization-condition.interface'
import { Vector3 } from '../../interfaces/vector3.interface'
import { APPLICATION_STATE_DEFAULT } from '../../interfaces/application-state.interface'
import { ELEMENT_TYPE_SCREEN, ELEMENT_TYPE_LIGHT, ElementType, ELEMENT_TYPE_BUTTON } from '../../types/element-type.type'
import { VISUALIZATION_TYPE_SCREEN, VISUALIZATION_TYPE_FLOAT } from '../../types/visualization-type.type';
import { State } from '../../interfaces/state.interface';
import { VisualizationElement } from '../../interfaces/visualization-element.interface'
import { OUTLINE_COLOR_RED } from '../../types/outline-color.type'
import { Vector2 } from '../../interfaces/vector2.interface'
import { Color } from '../../interfaces/color.interface'
import { InteractionElement } from '../../interfaces/interaction-element.interface'
import { AppContext } from '../../interfaces/app-context.interface'
import { Actions } from '../../interfaces/actions.interface'
import ViewContainer from './ViewContainer'
import { InformationBannerUtils } from '../../Utils/InformationBannerUtils'
import { Transition } from '../../interfaces/transition.interface';

/**
 * Provides AppContext and Actions
 */
export default class AppProvider extends React.Component<{}, AppContext> {

    /**
     * Default state
     */
    state: AppContext = {
        interactionElements: [],
        states: [{ Name: "Start", id: 0, isStart: true }],
        transitions: [],
        visualizationElements: [],
        applicationState: APPLICATION_STATE_DEFAULT,
        unityWrapper: new UnityWrapper(             // Current UnityWrapper object
            this.unityObjectClicked.bind(this),
            this.setUnityLoadingProgress.bind(this),
            this.uploadingStarted.bind(this),
            this.uploadingFinished.bind(this))
    }

    /**
     * Bind all methods to an Actions object
     */
    actions: Actions = {
        setButtonTransition: this.setButtonTransition.bind(this),
        addElementType: this.addElementType.bind(this),
        createNewSituation: this.createNewSituation.bind(this),
        hideInformationBanner: this.hideInformationBanner.bind(this),
        removeElementType: this.removeElementType.bind(this),
        removeSituation: this.removeSituation.bind(this),
        removeTimeBasedTransition: this.removeTimeBasedTransition.bind(this),
        renameSituation: this.renameSituation.bind(this),
        showNextInformationBanner: this.showNextInformationBanner.bind(this),
        setCurrentSituation: this.setCurrentSituation.bind(this),
        setDemoMode: this.setDemoMode.bind(this),
        setLightColor: this.setLightColor.bind(this),
        setLightEmission: this.setLightEmission.bind(this),
        setNewElementTypeModalVisibility: this.setNewElementTypeModalVisibility.bind(this),
        setScreenImage: this.setScreenImage.bind(this),
        setScreenPlane: this.setScreenPlane.bind(this),
        setScreenResolution: this.setScreenResolution.bind(this),
        setSelectedElement: this.setSelectedElement.bind(this),
        setStartSituation: this.setStartSituation.bind(this),
        setRenamingModalSituation: this.setRenamingModalSituation.bind(this),
        setTimeBasedTransition: this.setTimeBasedTransition.bind(this),
        setTimeBasedTransitionModalVisibility: this.setTimeBasedTransitionModalVisibility.bind(this),
        setUnityLoadingProgress: this.setUnityLoadingProgress.bind(this),
        setPlaneSelectionMode: this.setPlaneSelectionMode.bind(this)
    }


    // ============== WebGL/Unity methods ===========================
    /**
     * Method that gets called if an element is clicked inside unity WebGL
     * @param clickedElement    name of the clicked element
     * @param planeX            x value of the normal vector of the plane that was clicked on
     * @param planeY            y value of the normal vector of the plane that was clicked on
     * @param planeZ            z value of the normal vector of the plane that was clicked on
     */
    unityObjectClicked(clickedElement: string, clickedPlane: Vector3): void {
        const planeSelectionElement = this.state.applicationState.planeSelectionElementName
        // If demo mode
        if (this.state.applicationState.isDemoMode) {
            const transition =
                ContextUtils.getButtonTransition(clickedElement, this.state.applicationState.currentSituationID, this.state.transitions)
            if (!!transition && transition.DestinationStateID !== undefined) {
                this.setCurrentSituation(transition.DestinationStateID)
            }
            return
        }
        // If Plane selection mode 
        if (!!planeSelectionElement) {
            if (clickedElement === planeSelectionElement) {
                // Plane was chosen 
                this.setPlaneSelectionMode(planeSelectionElement, false, false)
                this.setScreenPlane(planeSelectionElement, clickedPlane)
                return
            }
            // No plane chosen 
            this.setPlaneSelectionMode(planeSelectionElement, false)
        }
        // Change selected element
        if (clickedElement === this.state.applicationState.selectedElement) {
            clickedElement = ""
        }
        this.setSelectedElement(clickedElement, clickedPlane)
    }

    /**
     * Updates the value of the unity loading progression. 
     * @param progress      value from 0-1
     */
    setUnityLoadingProgress(progress: number) {
        this.setState((state: AppContext) => { return { applicationState: { ...state.applicationState, unityLoadingProgress: progress } } })
    }

    /**
     * Gets called when uploading a 3D model started
     */
    uploadingStarted() {
        this.setState((state: AppContext) => { return { applicationState: { ...state.applicationState, isCurrentlyUploading: true } } })
    }

    /**
     * Gets called if the 3D has been uploaded successfully
     */
    uploadingFinished() {
        this.setState((state: AppContext) => { return { applicationState: { ...state.applicationState, isCurrentlyUploading: false, modelWasUploaded: true } } })
    }

    //============== Session specific methods =========================
    /**
    * Changes the currently selected situation
    * @param currentSituationID     id of the situation that should be selected
    */
    setCurrentSituation(currentSituationID: number) {
        // Stop if this situation is already currently displayed
        if (currentSituationID === this.state.applicationState.currentSituationID) {
            return
        }
        // Hide information banner
        this.hideInformationBanner()

        this.setState((state: AppContext) => {
            // If situation does not exist just go to the first situation in the list (May happen when a situation is removed ) 
            currentSituationID = (!!state.states.find(situation => situation.id === currentSituationID)) ?
                currentSituationID : state.states[0].id

            // TODO: This is a really dirty hack :( Activating timeout transition if demo mode is active
            // In a further version the whole demo mode should be done with Vivian Framework inside Unity
            clearTimeout(state.applicationState.demoTimeout)
            let demoTimeout = undefined
            if (state.applicationState.isDemoMode) {
                const transition = ContextUtils.getTimeBasedTransition(currentSituationID, this.state.transitions)
                if (!!transition) {
                    demoTimeout = setTimeout(() => {
                        if (this.state.applicationState.isDemoMode && transition.DestinationStateID !== undefined) {
                            this.setCurrentSituation(transition.DestinationStateID)
                        }
                    }, transition.Timeout)
                }
            }

            // Change Visualization
            state.unityWrapper?.updateVisualization(state, currentSituationID)
            // Change state
            return {
                applicationState: {
                    ...state.applicationState,
                    currentSituationID: currentSituationID,
                    lastSituationID: state.applicationState.currentSituationID,
                    demoTimeout: demoTimeout
                }
            }
        })
        // Stop plane selection mode if currently active
        const planeSelectionElement = this.state.applicationState.planeSelectionElementName
        if (!!planeSelectionElement) {
            this.setPlaneSelectionMode(planeSelectionElement, false)
        }
    }

    /**
     * Changes the currently selected element and highlights it in unity
     * @param selectedElement   name of the element that should be selected
     */
    setSelectedElement(selectedElement: string, clickedPlane: Vector3 | undefined) {
        const previousSelectedElement = this.state.applicationState.selectedElement
        // Remove old outline
        if (previousSelectedElement !== "") {
            this.state.unityWrapper?.removeOutline(previousSelectedElement)
        }
        // Add new outline
        if (selectedElement !== "") {
            this.state.unityWrapper?.outlineElement(selectedElement, OUTLINE_COLOR_RED)
        }
        // Hide information banner
        this.hideInformationBanner()

        // Change state
        this.setState((state: AppContext) => {
            return {
                applicationState: {
                    ...state.applicationState,
                    selectedElement: selectedElement,
                    clickedPlane: selectedElement === "" ? undefined : clickedPlane
                }
            }
        })
    }


    /**
     * Opens the next information banner
     */
    showNextInformationBanner() {
        this.setState((state: AppContext) => {
            return {
                applicationState: {
                    ...state.applicationState,
                    currentInformationBanner: InformationBannerUtils.nextInformationBanner(state.applicationState.currentInformationBanner)
                }
            }
        })
    }

    /**
     * Hides the current information banner
     */
    hideInformationBanner() {
        this.setState((state: AppContext) => {
            return {
                applicationState: {
                    ...state.applicationState,
                    currentInformationBanner: InformationBannerUtils.hideInformationBanner(state.applicationState.currentInformationBanner)
                }
            }
        })
    }

    /**
     * Changes if the "demo mode" to test the model is active
     * @param active If the demo mode should be active 
     */
    setDemoMode(active: boolean) {
        this.setState(state => {
            // TODO: This is a really dirty hack :( Activating timeout transition if demo mode
            // In a further version the whole demo mode should be done with Vivian Framework inside Unity
            clearTimeout(state.applicationState.demoTimeout)
            let demoTimeout = undefined
            if (active) {
                const transition = ContextUtils.getTimeBasedTransition(this.state.applicationState.currentSituationID, this.state.transitions)
                if (!!transition) {
                    demoTimeout = setTimeout(() => {
                        if (this.state.applicationState.isDemoMode && transition.DestinationStateID !== undefined) {
                            this.setCurrentSituation(transition.DestinationStateID)
                        }
                    }, transition.Timeout)
                }
            }
            const newState: AppContext = {
                ...state,
                applicationState: {
                    ...state.applicationState,
                    isDemoMode: active,
                    demoTimeout: demoTimeout
                }
            }
            state.unityWrapper?.updateVisualization(newState)
            return newState
        })
    }

    // =============== SITUATION/STATE METHODS ========================
    /**
     * Creates a new situation and returns the ID of the new situation.
     * Aborts if the name is already taken. Opens the naming popup if "" is given
     *
     * @param newSituationName  name of the new situation
     */
    createNewSituation(newSituationName: string): number {
        if (this.state.states.find(state => state.Name === newSituationName)) {
            // State does already exist
            return -1
        }
        const newID = this.state.applicationState.nextSituationID
        const nextID = newID + 1
        this.setState((state: AppContext) => {
            return {
                states: [...state.states, { Name: newSituationName, id: newID }],
                applicationState: {
                    ...state.applicationState,
                    nextSituationID: nextID
                }
            }
        })
        return newID
    }

    /**
     * Renames a specific situation, given by id
     *
     * @param situationID           unique id of the situation
     * @param newSituationName      new siutation name
     */
    renameSituation(situationID: number, newSituationName: string) {
        this.setState((state: AppContext) => {
            return {
                states: state.states.map(situation => {
                    if (situationID === situation.id) {
                        return { ...situation, Name: newSituationName }
                    }
                    return situation
                })
            }
        })
    }

    /**
     * Removes a situation and all its transitions
     * @param situationID Id of the situation that should be removed
     */
    removeSituation(situationID: number) {
        // Stop if it's the only situation
        if (this.state.states.length <= 1) {
            return
        }
        // Remove situation from list of states and all transition that contain this situation
        this.setState((state: AppContext) => {
            const isStarting = state.states.find(situation => situation.id === situationID && situation.isStart)
            const newStates = state.states.filter(situation => situation.id !== situationID)
            if (isStarting) { // set new starting situation if starting situation is removed
                newStates[0].isStart = true
            }
            return {
                states: newStates,
                transitions: state.transitions.filter(transition =>                         // Remove from transitions
                    (transition.DestinationStateID !== situationID && transition.SourceStateID !== situationID))
            }
        })
        // If the situation is the current one change the situation to the last one
        if (this.state.applicationState.currentSituationID === situationID) {
            this.setCurrentSituation(this.state.applicationState.lastSituationID)
        }
    }

    /**
     * Sets the start situation
     * @param situationID New start situation ID
     */
    setStartSituation(situationID: number) {
        this.setState(state => {
            return {
                states: state.states.map(situation => {
                    if (situation.id === situationID) {
                        return { ...situation, isStart: true }
                    } else {
                        return { ...situation, isStart: undefined }
                    }
                })
            }
        })
    }

    /**
     * Sets/Unsets the situation which can be renamed with the new situation modal
     * @param situationID If the popup should be visible
     */
    setRenamingModalSituation(situationID: number | undefined) {
        this.setState((state: AppContext) => {
            return {
                applicationState: {
                    ...state.applicationState,
                    newSituationID: situationID
                }
            }
        })
    }

    // =============== TRANSITION METHODS ================================

    /**
     * Sets the transition, triggered by a button
     * @param sourceSituationID         Source situation ID
     * @param destinationSituationID    Destination situation ID
     * @param button                    Name of the Button that triggers the transition
     */
    setButtonTransition(sourceSituationID: number, destinationSituationID: number | undefined, button: string) {
        if (!ContextUtils.getButtonTransition(button, sourceSituationID, this.state.transitions)) {
            // Add new transition
            const newTransition: Transition = {
                SourceStateID: sourceSituationID,
                InteractionElement: button,
                Event: "BUTTON_PRESS",
                DestinationStateID: destinationSituationID
            }
            this.setState((state: AppContext) => {
                return { ...state, transitions: [...state.transitions, newTransition] }
            })
        } else {
            // Change existing transition
            this.setState((state: AppContext) => {
                return {
                    transitions: state.transitions.map(transition =>
                        (transition.SourceStateID === sourceSituationID && transition.InteractionElement === button) ?
                            { ...transition, DestinationStateID: destinationSituationID } : transition
                    )
                }
            })
        }
    }

    /**
     * Sets the transition triggered by a timeout (time-based transition)
     * @param sourceSituationID         ID of the source situation
     * @param destinationSituationID    ID of the destination situation
     * @param timeout                   Timeout in ms
     */
    setTimeBasedTransition(sourceSituationID: number, destinationSituationID: number, timeout: number) {
        if (!ContextUtils.getTimeBasedTransition(sourceSituationID, this.state.transitions)) {
            // Add new transition
            const newTransition = {
                SourceStateID: sourceSituationID,
                Timeout: timeout,
                DestinationStateID: destinationSituationID
            }
            this.setState((state: AppContext) => {
                return { transitions: [...state.transitions, newTransition] }
            })
        } else {
            // Change existing transition
            this.setState((state: AppContext) => {
                return {
                    transitions: state.transitions.map(transition =>
                        (transition.SourceStateID === sourceSituationID && !!transition.Timeout) ?
                            { ...transition, DestinationStateID: destinationSituationID, Timeout: timeout } : transition
                    )
                }
            })
        }
    }

    /**
     * Removes a time-based transition
     * @param sourceSituationID source situation of the time-based transition
     */
    removeTimeBasedTransition(sourceSituationID: number) {
        this.setState(state => {
            return {
                transitions: state.transitions.filter(transition => transition.SourceStateID !== sourceSituationID || !transition.Timeout)
            }
        })
    }

    /**
     * Changes if the options window for time based transitions should be visible
     * @param isVisible If the window should be displayed or not
     */
    setTimeBasedTransitionModalVisibility(isVisible: boolean) {
        this.setState((state: AppContext) => {
            return {
                applicationState: {
                    ...state.applicationState,
                    showTimeBasedTransitionModal: isVisible
                }
            }
        })
    }

    // ================== ELEMENT-TYPE METHODS =================================
    /**
     * Adds a type(functionality) to an element
     *
     * @param element   name of the element
     * @param type      type that should be added
     */
    addElementType(element: string, type: ElementType) {
        switch (type) {
            case ELEMENT_TYPE_BUTTON:
                const newInteractionElement: InteractionElement = { Name: element, Type: type }
                this.setState((state: AppContext) => { return { interactionElements: [...state.interactionElements, newInteractionElement] } })
                break
            case ELEMENT_TYPE_SCREEN:
                const newScreenElement: VisualizationElement = { Type: type, Name: element, Plane: undefined }
                this.setState((state: AppContext) => { return { visualizationElements: [...state.visualizationElements, newScreenElement] } })
                break
            case ELEMENT_TYPE_LIGHT:
                const newLightElement: VisualizationElement = { Type: type, Name: element, EmissionColor: { r: 1, g: 0, b: 0, a: 0.5 } }
                this.setState((state: AppContext) => { return { visualizationElements: [...state.visualizationElements, newLightElement] } })
                break
            default:
                return
        }
    }

    /**
     * Removes a type/function from an element
     * Currently implemented types: Button, Light & Display
     *
     * @param element   name of the element
     * @param type      type that should be removed
     */
    removeElementType(element: string, type: string) {
        switch (type) {
            case "Button":
                this.removeTypeButton(element)
                break
            case "Screen":
                this.removeTypeScreen(element)
                break
            case "Light":
                this.removeTypeLight(element)
                break
            default:
                return
        }
    }

    /**
     * Removes the light functionalities of an element
     * @param element Name of the element
     */
    removeTypeLight(element: string) {
        // Remove from all situations and from visualizationElements list
        const newStates = this.state.states.map(situation => {
            if (!situation.Conditions) {
                return situation
            }
            return { ...situation, Conditions: situation.Conditions.filter(condition => condition.VisualizationElement !== element || condition.Type !== "FloatValueVisualization") }
        })
        this.setState((state: AppContext) => {
            return {
                states: newStates,
                visualizationElements: state.visualizationElements.filter(visualizationElement =>
                    visualizationElement.Name !== element || visualizationElement.Type !== ELEMENT_TYPE_LIGHT)
            }
        })
        // Remove light effects from current WebGL visualization
        this.state.unityWrapper?.removeLightEffect(element)
    }

    /**
     * Removes the screen functionalities of a element
     * @param element Name of the element
     */
    removeTypeScreen(element: string) {
        // Remove from all situations and from visualizationElements list
        const newSituations = this.state.states.map(situation => {
            if (!situation.Conditions) {
                return situation
            }
            return { ...situation, Conditions: situation.Conditions.filter(condition => condition.VisualizationElement !== element || condition.Type !== "ScreenContentVisualization") }
        })
        this.setState((state: AppContext) => {
            return {
                states: newSituations,
                visualizationElements: state.visualizationElements.filter(visualizationElement =>
                    visualizationElement.Name !== element || visualizationElement.Type !== ELEMENT_TYPE_SCREEN)
            }
        })
        // Remove screen effects from current WebGL visualization
        this.state.unityWrapper?.removeScreenEffect(element)
    }

    /**
     * Removes the button functionalities of a element
     * @param element Name of the element
     */
    removeTypeButton(element: string) {
        // Remove element from interactionElements and remove all transitions that include the button
        this.setState((state: AppContext) => {
            return {
                interactionElements: state.interactionElements.filter(interactionElement =>
                    interactionElement.Name !== element || interactionElement.Type !== ELEMENT_TYPE_BUTTON),
                transitions: state.transitions.filter(transition => (transition.InteractionElement !== element))
            }
        })
    }

    /**
     * Changes if the modal to choose a new element type is visible
     * @param isVisible If the modal should be currently visible
     */
    setNewElementTypeModalVisibility(isVisible: boolean) {
        this.setState((state: AppContext) => {
            return {
                applicationState: {
                    ...state.applicationState,
                    showNewElementTypeModal: isVisible
                }
            }
        })
    }

    //================= LIGHT METHODS =============================

    /**
     * Changes the main color of a light element
     * @param element   name of the light element
     * @param color     new color
     */
    setLightColor(element: string, color: Color) {
        // Check if element is a light
        if (!ContextUtils.elementHasType(element, ELEMENT_TYPE_LIGHT, this.state)) {
            return
        }
        this.setState((state: AppContext) => {
            return {
                visualizationElements: state.visualizationElements.map(visualizationElement => {
                    return visualizationElement.Name === element && visualizationElement.Type === ELEMENT_TYPE_LIGHT ?
                        { ...visualizationElement, EmissionColor: color }
                        : visualizationElement
                })
            }
        })

        // Change color inside the current WebGL visualization if necessary
        const emissionStrength = ContextUtils.getLightEmissionStrength(element, this.state.applicationState.currentSituationID, this.state.states)
        if (!emissionStrength) {
            return
        }
        this.state.unityWrapper?.setLightEffect(element, color.r, color.g, color.b, emissionStrength)
    }

    /**
     * Changes the emission strength of a light in a certain situation
     * 
     * @param element               name of the light element
     * @param emissionSituationID   id of the situation in which the emission should change
     * @param emissionStrength      new emission strength
     */
    setLightEmission(element: string, emissionSituationID: number, emissionStrength: number) {
        if (!this.state.visualizationElements.find(visualizationElement =>
            (visualizationElement.Name === element && visualizationElement.Type === ELEMENT_TYPE_LIGHT))) {
            // Element is no light -> Stop
            return
        }
        const newStates = this.state.states.map(situation => {
            if (situation.id !== emissionSituationID ) {
                return situation
            }
            let emissionChanged = false
            let newConditions: VisualizationCondition[] = []
            if (!!situation.Conditions) {
                newConditions = situation.Conditions.map(condition => {
                    if (condition.VisualizationElement !== element || condition.Type !== VISUALIZATION_TYPE_FLOAT) {
                        return condition
                    }
                    // Visualization exists -> Change emission
                    emissionChanged = true
                    return { ...condition, Value: emissionStrength }
                })
            }
            if (!emissionChanged) {
                // emission does not exist yet -> Create a new entry
                const newCondition: VisualizationCondition = { Type: VISUALIZATION_TYPE_FLOAT, Value: emissionStrength, VisualizationElement: element }
                newConditions = [...newConditions, newCondition]
            }
            return { ...situation, Conditions: newConditions }
        })
        this.setState({ states: newStates })

        // Change emission inside the current WebGL visualization if necessary
        if (emissionSituationID === this.state.applicationState.currentSituationID) {
            const color = ContextUtils.getLightEmissionColor(element, this.state.visualizationElements)
            if (!!color) {
                this.state.unityWrapper?.setLightEffect(element, color.r, color.g, color.b, emissionStrength)
            }
        }
    }

    // ================= SCREEN METHODS =====================
    /**
     * Activates or deactivates the plane selection mode to choose a display plane for a screen element
     * @param element Name of the screen element to choose the display plane for
     * @param active If the mode should be activated or not
     * @param updateWebGL If the WebGL should be updated during the method ( default: true)
     */
    setPlaneSelectionMode(element: string, active: boolean, updateWebGL = true) {
        // Change state
        this.setState((state: AppContext) => {
            return { applicationState: { ...state.applicationState, planeSelectionElementName: active ? element : undefined } }
        })
        if (active && !!element) {
            // Activate hover effect
            this.state.unityWrapper?.activatePlaneHoverEffect(element)
        } else {
            // Deactivate hover effect and update WebGL
            this.state.unityWrapper?.deActivatePlaneHoverEffect()
            const visualizationElement = this.state.visualizationElements.find(visualizationElement =>
                (visualizationElement.Name === element && visualizationElement.Type === ELEMENT_TYPE_SCREEN))
            const image = ContextUtils.getScreenImage(element, this.state.applicationState.currentSituationID, this.state.states)
            if (updateWebGL && !!visualizationElement && !!image) {
                this.state.unityWrapper?.addScreenEffect(visualizationElement, image)
            }

        }

    }

    /**
     * Sets the plane normal vector for a screen element
     * @param  screenElement        screen element name
     * @param  plane               new plane normal vector value
     */
    setScreenPlane(planeSelectionElement: string, plane: Vector3) {
        // Change state
        this.setState((state: AppContext) => {
            return {
                visualizationElements: state.visualizationElements.map(visualizationElement => {
                    if (visualizationElement.Name === planeSelectionElement && visualizationElement.Type === "Screen") {
                        const newVisualizationElement = { ...visualizationElement, Plane: plane }
                        // Update WebGL
                        const image = ContextUtils.getScreenImage(planeSelectionElement, this.state.applicationState.currentSituationID, this.state.states)
                        if (!!image) {
                            this.state.unityWrapper?.addScreenEffect(newVisualizationElement, image)
                        }
                        return newVisualizationElement
                    }
                    return visualizationElement
                })
            }
        })
    }

    /**
     * Sets the resolution for a screen element
     * @param element       Screen element name
     * @param resolution    New resolution
     */
    setScreenResolution(element: string, resolution: Vector2) {
        this.setState((state: AppContext) => {
            return {
                visualizationElements: state.visualizationElements.map(visualizationElement => {
                    if (visualizationElement.Name === element && visualizationElement.Type === "Screen") {
                        return { ...visualizationElement, Resolution: resolution }
                    }
                    return visualizationElement
                })
            }
        })
    }

    /**
     * Sets the visualized image for a certain screen in a certain situation 
     * @param element           Name of the screen element
     * @param situationID       Id of the situation
     * @param imageFile         Image file that should be displayed
     */
    setScreenImage(element: string, situationID: number, imageFile: File | undefined) {
        // Check if element is a screen element
        if (!ContextUtils.elementHasType(element, ELEMENT_TYPE_SCREEN, this.state)) {
            return
        }

        // Change state
        this.setState((state: AppContext) => {
            return {
                states: state.states.map(
                    (situation: State) => {
                        if (situation.id === situationID) {
                            let valueChanged = false
                            let newConditions = situation.Conditions?.map((condition: VisualizationCondition) => {

                                // If there is already a screen visualization just change it ...
                                if (condition.VisualizationElement === element && condition.Type === VISUALIZATION_TYPE_SCREEN) {
                                    valueChanged = true
                                    return { ...condition, File: imageFile }
                                }
                                return condition
                            })

                            // ... otherwise add a new screen visualization
                            if (!valueChanged) {
                                const newCondition: VisualizationCondition = { Type: VISUALIZATION_TYPE_SCREEN, File: imageFile, VisualizationElement: element }
                                newConditions = !!newConditions ? [...newConditions, newCondition] : [newCondition]
                            }
                            return { ...situation, Conditions: newConditions }
                        }
                        return situation
                    }
                )
            }
        })

        // Update WebGL if necessary
        if (this.state.applicationState.currentSituationID === situationID) {
            const visualizationElement = this.state.visualizationElements.find(
                (visualizationElement: VisualizationElement) => visualizationElement.Name === element && visualizationElement.Type === ELEMENT_TYPE_SCREEN
            )
            if (!!visualizationElement) {
                if (!!imageFile) {
                    this.state.unityWrapper?.addScreenEffect(visualizationElement, imageFile)
                } else {
                    this.state.unityWrapper?.removeScreenEffect(visualizationElement.Name)
                }
            }
        }
    }

    //================= RENDER =============================
    render() {
        return <ViewContainer actions={this.actions} appContext={this.state} />
    }
}
