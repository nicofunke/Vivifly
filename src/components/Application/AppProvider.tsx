import React from 'react'
import { AppContext } from './AppContext'
import { UnityWrapper } from '../../Utils/UnityWrapper'
import { ContextUtils } from '../../Utils/ContextUtils';
import { ContextState } from '../../interfaces/context-state.interface'
import { VisualizationValue } from '../../interfaces/visualization-value.interface'
import { Vector3 } from '../../interfaces/vector3.interface'
import { APPLICATION_STATE_DEFAULT } from '../../interfaces/application-state.interface'
import { ELEMENT_TYPE_SCREEN, ELEMENT_TYPE_LIGHT } from '../../types/element-type.type'
import { VISUALIZATION_TYPE_FLOAT, VISUALIZATION_TYPE_SCREEN } from '../../types/visualization-type.type'
import { State } from '../../interfaces/state.interface'
import { VisualizationElement } from '../../interfaces/visualization-element.interface'
import { OUTLINE_COLOR_RED } from '../../types/outline-color.type'
import { Vector2 } from '../../interfaces/vector2.interface'
import { Color } from '../../interfaces/color.interface'

/**
 * Provides the context AppContext for the whole application
 */
export default class AppProvider extends React.Component {

    /**
     * Default state
     */
    state: ContextState = {
        interactionElements: [],
        states: [{ Name: "Start", id: 0 }],
        transitions: [],
        visualizationElements: [],
        applicationState: APPLICATION_STATE_DEFAULT,
        unityWrapper: new UnityWrapper(             // Current UnityWrapper object
            this.unityObjectClicked.bind(this),
            this.setUnityLoadingProgress.bind(this),
            this.uploadingStarted.bind(this),
            this.uploadingFinished.bind(this))
    }

    // ============== WebGL/Unity methods ===========================
    /**
     * Method that gets called if an element is clicked inside unity WebGL
     * Sets it as the currently selected element
     *
     * @param clickedElement    name of the clicked element
     * @param planeX            x value of the normal vector of the plane that was clicked on
     * @param planeY            y value of the normal vector of the plane that was clicked on
     * @param planeZ            z value of the normal vector of the plane that was clicked on
     */
    unityObjectClicked(clickedElement: string, clickedPlane: Vector3): void {
        const planeSelectionElement = this.state.applicationState.planeSelectionElementName
        if (!!planeSelectionElement) {
            // Plane selection active -> deactivate
            this.endPlaneSelection()
            if (clickedElement === planeSelectionElement) {
                // Plane was chosen -> store normal vector and return (in order to not change the selected element)
                this.setScreenPlane(planeSelectionElement, clickedPlane)
                return
            }
        }
        // Change selected element
        if (clickedElement === this.state.applicationState.selectedElement) {
            clickedElement = ""
        }
        this.setSelectedElement(clickedElement, clickedPlane)
    }

    /**
     * Updates the value of the unity loading progression. 
     * 
     * @param progress      value from 0-1
     */
    setUnityLoadingProgress(progress: number) {
        this.setState((state: ContextState) => { return { ...state, applicationState: { ...state.applicationState, unityLoadingProgress: progress } } })
    }

    /**
     * Gets called when uploading a 3D model started
     */
    uploadingStarted() {
        this.setState((state: ContextState) => { return { ...state, applicationState: { ...state.applicationState, isCurrentlyUploading: true } } })
    }

    /**
     * Gets called if the 3D has been uploaded successfully
     */
    uploadingFinished() {
        this.setState((state: ContextState) => { return { ...state, applicationState: { ...state.applicationState, isCurrentlyUploading: false, modelWasUploaded: true } } })
    }

    //============== Session specific methods =========================
    /**
    * Changes the currently selected situation
    *
    * @param currentSituationID     id of the situation that should be selected
    */
    setCurrentSituation(currentSituationID: number) {
        // Change state
        this.setState((state: ContextState) => {
            return {
                ...state, applicationState: {
                    ...state.applicationState,
                    currentSituationID: (!!state.states.find(situation => situation.id === currentSituationID)) ?
                        currentSituationID : state.states[0].id,    // If situation does not exist just go to the first situation in the list
                    showFirstSituationWindow: false,
                    lastSituationID: state.applicationState.currentSituationID
                }
            }
        })
        // Change visualization
        this.state.unityWrapper?.removeAllVisualEffects()
        const newSituation = this.state.states.find(situation => situation.id === currentSituationID)
        if (!!newSituation && !!newSituation.Values) {
            for (const value of newSituation.Values) {
                if (value.Type === VISUALIZATION_TYPE_FLOAT) {
                    // Add light effects
                    const color = ContextUtils.getLightEmissionColor(value.VisualizationElement, this.state)
                    if (!!color) {
                        this.state.unityWrapper?.setLightEffect(value.VisualizationElement, color.r, color.g, color.b, value.Value || 0.0)
                    }
                } else if (value.Type === VISUALIZATION_TYPE_SCREEN) {
                    // Add screen effects
                    const visualizationElement = this.state.visualizationElements.find(
                        (visualizationElement: VisualizationElement) => (
                            visualizationElement.Name === value.VisualizationElement && visualizationElement.Type === ELEMENT_TYPE_SCREEN
                        )
                    )
                    if (!!visualizationElement && !!value.File) {
                        this.state.unityWrapper?.addScreenEffect(visualizationElement, value.File)
                    }
                }
            }
        }
        // Restore outline of selected element
        this.state.unityWrapper?.outlineElement(this.state.applicationState.selectedElement, OUTLINE_COLOR_RED)
    }

    /**
     * Changes the currently selected element and highlights it in unity
     *
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
        // Change state
        this.setState((state: ContextState) => {
            return {
                ...state,
                applicationState: {
                    ...state.applicationState,
                    selectedElement: selectedElement,
                    hasAlreadySelectedAnElement: true,
                    showFirstSituationWindow: false,
                    clickedPlane: selectedElement === "" ? undefined : clickedPlane
                }
            }
        })
    }


    /**
     * Opens the information window for a new situation
     */
    showFirstSituationInformationWindow() {
        this.setState((state: ContextState) => {
            return {
                ...state,
                applicationState: {
                    ...state.applicationState,
                    showFirstSituationWindow: true
                }
            }
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
        this.setState((state: ContextState) => {
            return {
                ...state,
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
        this.setState((state: ContextState) => {
            return {
                ...state, states: state.states.map(situation => {
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
        // If the situation is the current one change the situation to the last one
        if (this.state.applicationState.currentSituationID === situationID) {
            this.setCurrentSituation(this.state.applicationState.lastSituationID)
        }
        // Remove situation from list of states and all transition that contain this situation
        this.setState((state: ContextState) => {
            return {
                ...state,
                states: state.states.filter(situation => situation.id !== situationID),    // Remove from states list
                transitions: state.transitions.filter(transition =>                         // Remove from transitions
                    (transition.DestinationStateID !== situationID && transition.SourceStateID !== situationID))
            }
        })
    }


    /**
     * Hides/Displays the situation naming popup
     * @param isVisible If the popup should be visible
     */
    setSituationNamingModalVisibility(isVisible: boolean) {
        this.setState((state: ContextState) => {
            return {
                ...state,
                applicationState: {
                    ...state.applicationState,
                    showSituationNamingWindow: isVisible
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
    setButtonTransition(sourceSituationID: number, destinationSituationID: number, button: string) {
        if (!ContextUtils.getButtonTransition(button, sourceSituationID, this.state)) {
            // Add new transition
            const newTransition = {
                SourceStateID: sourceSituationID,
                InteractionElement: button,
                event: 0,
                DestinationStateID: destinationSituationID
            }
            this.setState((state: ContextState) => {
                return { ...state, transitions: [...state.transitions, newTransition] }
            })
        } else {
            // Change existing transition
            this.setState((state: ContextState) => {
                return {
                    ...state,
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
        if (!ContextUtils.getTimeBasedTransition(sourceSituationID, this.state)) {
            // Add new transition
            const newTransition = {
                SourceStateID: sourceSituationID,
                Timeout: timeout,
                DestinationStateID: destinationSituationID
            }
            this.setState((state: ContextState) => {
                return { ...state, transitions: [...state.transitions, newTransition] }
            })
        } else {
            // Change existing transition
            this.setState((state: ContextState) => {
                return {
                    ...state,
                    transitions: state.transitions.map(transition =>
                        (transition.SourceStateID === sourceSituationID && !!transition.Timeout) ?
                            { ...transition, DestinationStateID: destinationSituationID, Timeout: timeout } : transition
                    )
                }
            })
        }
    }

    /**
     * Changes if the options window for time based transitions should be visible
     * @param isVisible If the window should be displayed or not
     */
    setTimeBasedTransitionModalVisibility(isVisible: boolean) {
        this.setState((state: ContextState) => {
            return {
                ...state,
                applicationState: {
                    ...state.applicationState,
                    showTimeBasedTransitionWindow: isVisible
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
    addElementType(element: string, type: string) {
        switch (type) {
            case "Button":
                const newInteractionElement = { Name: element, Type: "Button" }
                this.setState((state: ContextState) => { return { ...state, interactionElements: [...state.interactionElements, newInteractionElement] } })
                break
            case "Screen":
                const newScreenElement = { Type: "Screen", Name: element, Plane: null }
                this.setState((state: ContextState) => { return { ...state, visualizationElements: [...state.visualizationElements, newScreenElement] } })
                break
            case "Light":
                const newLightElement = { Type: "Light", Name: element, EmissionColor: { r: 1, g: 0, b: 0, a: 0.5 } }
                this.setState((state: ContextState) => { return { ...state, visualizationElements: [...state.visualizationElements, newLightElement] } })
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
                // Remove element from interactionElements and remove all transitions that include the button
                this.setState((state: ContextState) => {
                    return {
                        ...state,
                        interactionElements: state.interactionElements.filter(interactionElement => interactionElement.Name !== element),
                        transitions: state.transitions.filter(transition => (transition.InteractionElement !== element))
                    }
                })
                break
            case "Screen":
                // Remove from all situations and from visualizationElements list
                const newSituations = this.state.states.map(situation => {
                    if (!situation.Values) {
                        return situation
                    }
                    return { ...situation, Values: situation.Values.filter(value => value.VisualizationElement !== element || value.Type !== "ScreenContentVisualization") }
                })
                this.setState((state: ContextState) => {
                    return {
                        ...state,
                        states: newSituations,
                        visualizationElements: state.visualizationElements.filter(visualizationElement => visualizationElement.Name !== element || visualizationElement.Type !== "Screen")
                    }
                })
                // Remove screen effects from current WebGL visualization
                this.state.unityWrapper?.removeScreenEffect(element)
                break
            case "Light":
                // Remove from all situations and from visualizationElements list
                const newStates = this.state.states.map(situation => {
                    if (!situation.Values) {
                        return situation
                    }
                    return { ...situation, Values: situation.Values.filter(value => value.VisualizationElement !== element || value.Type !== "FloatValueVisualization") }
                })
                this.setState((state: ContextState) => {
                    return {
                        ...state,
                        states: newStates,
                        visualizationElements: state.visualizationElements.filter(visualizationElement => visualizationElement.Name !== element || visualizationElement.Type !== "Light")
                    }
                })
                // Remove light effects from current WebGL visualization
                this.state.unityWrapper?.removeLightEffect(element)
                break
            default:
                return
        }
    }

    //================= LIGHT METHODS =============================

    /**
     * Changes the main color of a light element
     *
     * @param element   name of the light element
     * @param color     new color
     */
    setLightColor(element: string, color: Color) {
        // Check if element is a light
        if (!ContextUtils.elementHasType(element, ELEMENT_TYPE_LIGHT, this.state)) {
            return
        }
        this.setState((state: ContextState) => {
            return {
                ...state,
                visualizationElements: state.visualizationElements.map(visualizationElement => {
                    return visualizationElement.Name === element ?
                        { ...visualizationElement, EmissionColor: color }
                        : visualizationElement
                })
            }
        })

        // Change color inside the current WebGL visualization if necessary
        const emissionStrength = ContextUtils.getLightEmissionStrength(element, this.state.applicationState.currentSituationID, this.state)
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
        if (!this.state.visualizationElements.find(visualizationElement => visualizationElement.Name === element)) {
            // Element is no light -> Stop
            return
        }
        const newStates = this.state.states.map(situation => {
            if (situation.id !== emissionSituationID) {
                return situation
            }
            let emissionChanged = false
            let newValues: VisualizationValue[] = []
            if (!!situation.Values) {
                newValues = situation.Values.map(visualizationValue => {
                    if (visualizationValue.VisualizationElement !== element || visualizationValue.Type !== "FloatValueVisualization") {
                        return visualizationValue
                    }
                    // Visualization exists -> Change emission
                    emissionChanged = true
                    return { ...visualizationValue, Value: emissionStrength }
                })
            }
            if (!emissionChanged) {
                // emission does not exist yet -> Create a new entry
                const newVisualizationValue: VisualizationValue = { Type: "FloatValueVisualization", Value: emissionStrength, VisualizationElement: element }
                newValues = [...newValues, newVisualizationValue]
            }
            return { ...situation, Values: newValues }
        })
        this.setState({ states: newStates })

        // Change emission inside the current WebGL visualization if necessary
        if (emissionSituationID === this.state.applicationState.currentSituationID) {
            const color = ContextUtils.getLightEmissionColor(element, this.state)
            if (!!color) {
                this.state.unityWrapper?.setLightEffect(element, color.r, color.g, color.b, emissionStrength)
            }
        }
    }

    // ================= SCREEN METHODS =====================
    /**
     * Activates the plane selection mode to choose a display plane for a screen element
     * @param {string} element Name of the screen element to choose the display plane for
     */
    startPlaneSelection(element: string) {
        // Store the selection element in the current state
        this.setState((state: ContextState) => {
            return { ...state, applicationState: { ...state.applicationState, planeSelectionElementName: element } }
        })
        // Activate hover effect
        this.state.unityWrapper?.activatePlaneHoverEffect(element)
    }

    /**
     * Deactivates the plane selection mode
     */
    endPlaneSelection() {
        this.setState((state: ContextState) => {
            return { ...state, applicationState: { ...state.applicationState, planeSelectionElementName: null } }
        })
        this.state.unityWrapper?.deActivatePlaneHoverEffect()
    }

    /**
     * Sets the plane normal vector for a screen element
     * @param  screenElement        screen element name
     * @param  plane               new plane normal vector value
     */
    setScreenPlane(planeSelectionElement: string, plane: Vector3) {
        this.setState((state: ContextState) => {
            return {
                ...state, visualizationElements: state.visualizationElements.map(visualizationElement => {
                    if (visualizationElement.Name === planeSelectionElement && visualizationElement.Type === "Screen") {
                        return { ...visualizationElement, Plane: plane }
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
        this.setState((state: ContextState) => {
            return {
                ...state, visualizationElements: state.visualizationElements.map(visualizationElement => {
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
    setScreenImage(element: string, situationID: number, imageFile: File) {
        // Check if element is a screen element
        if (!ContextUtils.elementHasType(element, ELEMENT_TYPE_SCREEN, this.state)) {
            return
        }

        // Change state
        this.setState((state: ContextState) => {
            return {
                ...state, states: state.states.map(
                    (situation: State) => {
                        if (situation.id === situationID) {
                            let valueChanged = false
                            let newVisualizationValues = situation.Values?.map((visualizationValue: VisualizationValue) => {

                                // If there is already a screen visualization just change it ...
                                if (visualizationValue.VisualizationElement === element && visualizationValue.Type === VISUALIZATION_TYPE_SCREEN) {
                                    valueChanged = true
                                    return { ...visualizationValue, File: imageFile }
                                }
                                return visualizationValue
                            })

                            // ... otherwise add a new screen visualization
                            if (!valueChanged) {
                                const newVisualizationValue: VisualizationValue = { Type: VISUALIZATION_TYPE_SCREEN, File: imageFile, VisualizationElement: element }
                                newVisualizationValues = !!newVisualizationValues ? [...newVisualizationValues, newVisualizationValue] : [newVisualizationValue]
                            }
                            return { ...situation, Values: newVisualizationValues }
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
                this.state.unityWrapper?.addScreenEffect(visualizationElement, imageFile)
            }
        }
    }


    //================= RENDER =============================
    // TODO: Bundle methods to 'Actions'
    render() {
        return <AppContext.Provider value={{
            applicationState: this.state.applicationState,
            interactionElements: this.state.interactionElements,
            states: this.state.states,
            transitions: this.state.transitions,
            unityWrapper: this.state.unityWrapper,
            visualizationElements: this.state.visualizationElements,

            setButtonTransition: this.setButtonTransition.bind(this),
            addElementType: this.addElementType.bind(this),
            createNewSituation: this.createNewSituation.bind(this),
            removeElementType: this.removeElementType.bind(this),
            removeSituation: this.removeSituation.bind(this),
            renameSituation: this.renameSituation.bind(this),
            showFirstSituationInformationWindow: this.showFirstSituationInformationWindow.bind(this),
            setCurrentSituation: this.setCurrentSituation.bind(this),
            setLightColor: this.setLightColor.bind(this),
            setLightEmission: this.setLightEmission.bind(this),
            setScreenImage: this.setScreenImage.bind(this),
            setScreenPlane: this.setScreenPlane.bind(this),
            setScreenResolution: this.setScreenResolution.bind(this),
            setSelectedElement: this.setSelectedElement.bind(this),
            setSituationNamingModalVisibility: this.setSituationNamingModalVisibility.bind(this),
            setTimeBasedTransition: this.setTimeBasedTransition.bind(this),
            setTimeBasedTransitionModalVisibility: this.setTimeBasedTransitionModalVisibility.bind(this),
            setUnityLoadingProgress: this.setUnityLoadingProgress.bind(this),
            startPlaneSelection: this.startPlaneSelection.bind(this)

        }}>
            {this.props.children}
        </AppContext.Provider>

    }
}
