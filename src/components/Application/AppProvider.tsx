import React from 'react'
import { AppContext } from './AppContext'
import { UnityWrapper } from '../../Utils/UnityWrapper'
import { ContextUtils } from '../../Utils/ContextUtils'
import { ContextState } from '../../interfaces/context-state.interface';
import { VisualizationValue } from '../../interfaces/visualization-value.interface';
import { Vector3 } from '../../interfaces/vector3.interface';
import { APPLICATION_STATE_DEFAULT } from '../../interfaces/application-state.interface';

/**
 * Provides the context AppContext for the whole application
 */
// TODO: Think about conditional rerendering to speed up everything
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
    unityObjectClicked(clickedElement: string, planeX: number, planeY: number, planeZ: number): void {
        const planeSelectionElement = this.state.applicationState.planeSelectionElementName
        if (!!planeSelectionElement) {
            // Plane selection active -> deactivate
            this.endPlaneSelection()
            if (clickedElement === planeSelectionElement) {
                // Plane was chosen -> store normal vector and return (in order to not change the selected element)
                // TODO: Would be a good point to get also resolution from unity?
                const plane = { x: planeX, y: planeY, z: planeZ }
                this.setScreenPlane(planeSelectionElement, plane)
                return
            }
            // if clicked on another element change the currently selected element
        }
        // Change selected element
        if (clickedElement === this.state.applicationState.selectedElement) {
            clickedElement = ""
        }
        this.setSelectedElement(clickedElement)
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
                    currentSituationID: currentSituationID
                }
            }
        })
        // Change visualization
        this.state.unityWrapper.removeAllLightEffects()
        const newSituation = this.state.states.find(situation => situation.id === currentSituationID)
        if (!!newSituation && !!newSituation.Values) {
            for (const value of newSituation.Values) {
                if (value.Type === "FloatValueVisualization") {
                    // Light effect
                    const color = ContextUtils.getLightEmissionColor(value.VisualizationElement, this.state)
                    if (!!color) {
                        this.state.unityWrapper.setLightEffect(value.VisualizationElement, color.r, color.g, color.b, value.Value)
                    }
                } else if (value.Type === "ScreenContentVisualization") {
                    // TODO: Screen visualization
                }
            }
        }
    }

    /**
     * Changes the currently selected element and highlights it in unity
     *
     * @param selectedElement   name of the element that should be selected
     */
    setSelectedElement(selectedElement: string) {
        const previousSelectedElement = this.state.applicationState.selectedElement
        if (previousSelectedElement !== "") {
            this.state.unityWrapper.removeOutline(previousSelectedElement)
        }
        if (selectedElement !== "") {
            this.state.unityWrapper.outlineElement(selectedElement, "red")
        }
        this.setState((state: ContextState) => { return { ...state, applicationState: { ...state.applicationState, selectedElement: selectedElement, hasAlreadySelectedAnElement: true } } })
    }

    // =============== SITUATION/STATE METHODS ========================
    /**
     * Creates a new situation and returns the ID of the new situation
     * Aborts and returns false if the name is already taken
     *
     * @param newSituationName  name of the new situation
     */
    createNewSituation(newSituationName: string) {
        if (this.state.states.find(state => state.Name === newSituationName)) {
            // State does already exist
            return
        }
        const newID = this.state.applicationState.nextSituationID
        const nextID = newID + 1
        this.setState((state: ContextState) => {
            return {
                ...state,
                states: [...state.states, { Name: newSituationName, id: newID }],
                applicationState: { ...state.applicationState, nextSituationID: nextID }
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

    // =============== TRANSITION METHODS ================================
    /**
     * Adds a new transition from one situation to another, that is triggered by pressing a button
     *
     * @param sourceSituationID
     * @param destinationSituationID 
     * @param button                    name of the button that leads to the transition
     */
    addButtonTransition(sourceSituationID: number, destinationSituationID: number, button: string) {
        if (this.state.transitions.find(transition =>
            (transition.SourceStateID === sourceSituationID && transition.InteractionElement === button))) {
            // There is already a transition
            return
        }
        const newTransition = {
            SourceStateID: sourceSituationID,
            InteractionElement: button,
            event: 0,
            DestinationStateID: destinationSituationID
        }
        this.setState((state: ContextState) => {
            return { ...state, transitions: [...state.transitions, newTransition] }
        })
    }

    /**
     * Changes the destination of a specific button transition
     *
     * @param sourceSituationID             id of the source situation
     * @param button                        name of the button that leads to the transition
     * @param newDestinationSituationID     id of the destination situation
     */
    changeButtonTransitionDestination(sourceSituationID: number, button: string, newDestinationSituationID: number) {
        this.setState((state: ContextState) => {
            return {
                ...state,
                transitions: state.transitions.map(transition =>
                    (transition.SourceStateID === sourceSituationID && transition.InteractionElement === button) ?
                        { ...transition, DestinationStateID: newDestinationSituationID } : transition
                )
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
                const newScreenElement = { Type: "Screen", Name: element, Plane: null, Resolution: { x: 150, y: 150 } }
                // TODO: calculate resolution from picture/plane?
                this.setState((state: ContextState) => { return { ...state, visualizationElements: [...state.visualizationElements, newScreenElement] } })
                break
            case "Light":
                const newLightElement = { Type: "Light", Name: element, EmissionColor: { r: 1, g: 0, b: 0, a: 1 } }
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
                // Remove light effects from current WebGL visualization
                this.state.unityWrapper.removeLightEffect(element)
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
                this.state.unityWrapper.removeLightEffect(element)
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
     * @param red       from 0-1
     * @param green     from 0-1
     * @param blue      from 0-1
     */
    setLightColor(element: string, red: number, green: number, blue: number) {
        if (!this.state.visualizationElements.find(visualizationElement => visualizationElement.Name === element)) {
            // Element is no light -> Stop
            return
        }
        this.setState((state: ContextState) => {
            return {
                ...state,
                visualizationElements: state.visualizationElements.map(visualizationElement => {
                    return visualizationElement.Name === element ?
                        { ...visualizationElement, EmissionColor: { r: red, g: green, b: blue, a: 1.0 } }
                        : visualizationElement
                })
            }
        })

        // Change color inside the current WebGL visualization if necessary
        const emissionStrength = ContextUtils.getLightEmissionStrength(element, this.state.applicationState.currentSituationID, this.state)
        if (!emissionStrength) {
            return
        }
        this.state.unityWrapper.setLightEffect(element, red, green, blue, emissionStrength)
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
                this.state.unityWrapper.setLightEffect(element, color.r, color.g, color.b, emissionStrength)
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
        this.state.unityWrapper.activatePlaneHoverEffect(element)
    }

    /**
     * Deactivates the plane selection mode
     */
    endPlaneSelection() {
        this.setState((state: ContextState) => {
            return { ...state, applicationState: { ...state.applicationState, planeSelectionElementName: null } }
        })
        this.state.unityWrapper.deActivatePlaneHoverEffect()
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


    //================= RENDER =============================

    render() {
        return <AppContext.Provider value={{
            applicationState: this.state.applicationState,
            interactionElements: this.state.interactionElements,
            states: this.state.states,
            transitions: this.state.transitions,
            unityWrapper: this.state.unityWrapper,
            visualizationElements: this.state.visualizationElements,
            addButtonTransition: this.addButtonTransition.bind(this),
            addElementType: this.addElementType.bind(this),
            changeButtonTransitionDestination: this.changeButtonTransitionDestination.bind(this),
            createNewSituation: this.createNewSituation.bind(this),
            removeElementType: this.removeElementType.bind(this),
            renameSituation: this.renameSituation.bind(this),
            setCurrentSituation: this.setCurrentSituation.bind(this),
            setLightColor: this.setLightColor.bind(this),
            setLightEmission: this.setLightEmission.bind(this),
            setSelectedElement: this.setSelectedElement.bind(this),
            setUnityLoadingProgress: this.setUnityLoadingProgress.bind(this),
            startPlaneSelection: this.startPlaneSelection.bind(this)

        }}>
            {this.props.children}
        </AppContext.Provider>

    }
}
