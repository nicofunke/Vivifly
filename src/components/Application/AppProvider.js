import React from 'react'
import { AppContext } from './AppContext'
import { UnityWrapper } from '../../Utils/UnityWrapper'
import { ContextUtils } from '../../Utils/ContextUtils'

/**
 * Provides the context AppContext for the whole application
 */
// TODO: Think about conditional rerendering to speed up everything
export default class AppProvider extends React.Component {

    static nexSituationID = 1

    /**
     * Default state
     */
    state = {
        interactionElements: [],
        states: [{ Name: "Start", id: 0 }],
        transitions: [],
        visualizationElements: [],
        applicationState: {
            currentSituationID: 0,
            selectedElement: "",
            unityLoadingProgress: 0.0,              // from 0.0 to 1.0
            hasAlreadySelectedAnElement: false,     // if the user has already clicked on an element
            nextSituationID: 1,                     // in order to give new situations a unique ID
            isCurrentlyUploading: false,            // Boolean if the application currently uploads a model
            modelWasUploaded: true,                // Boolean if a model was already uploaded
        },
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
     */
    unityObjectClicked(clickedElement) {
        if (clickedElement === this.state.applicationState.selectedElement) {
            clickedElement = ""
        }
        this.setSelectedElement(clickedElement)
    }

    /**
     * Updates the value of the unity loading progression. 
     * progress === 1.0 => Unity loaded completely and is ready for interaction 
     */
    setUnityLoadingProgress(progress) {
        this.setState(state => { return { ...state, applicationState: { ...state.applicationState, unityLoadingProgress: progress } } })
    }

    /**
     * Gets called when uploading a 3D model started
     */
    uploadingStarted() {
        this.setState(state => { return { ...state, applicationState: { ...state.applicationState, isCurrentlyUploading: true } } })
    }

    /**
     * Gets called if the 3D has been uploaded successfully
     */
    uploadingFinished() {
        this.setState(state => { return { ...state, applicationState: { ...state.applicationState, isCurrentlyUploading: false, modelWasUploaded: true } } })
    }

    //============== Session specific methods =========================
    /**
     * Changes the currently selected situation
    */
    setCurrentSituation(currentSituationID) {
        // Change state
        this.setState(state => {
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
                    if(!!color){
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
     */
    setSelectedElement(selectedElement) {
        const previousSelectedElement = this.state.applicationState.selectedElement
        if (previousSelectedElement !== "") {
            this.state.unityWrapper.removeOutline(previousSelectedElement)
        }
        if (selectedElement !== "") {
            this.state.unityWrapper.outlineElement(selectedElement, "red")
        }
        this.setState(state => { return { ...state, applicationState: { ...state.applicationState, selectedElement: selectedElement, hasAlreadySelectedAnElement: true } } })
    }

    // =============== SITUATION/STATE METHODS ========================
    /**
     * Creates a new situation and returns the ID of the new situation
     * Aborts and returns false if the name is already taken
     */
    createNewSituation(newSituationName) {
        if (this.state.states.find(state => state.Name === newSituationName)) {
            // State does already exist
            return
        }
        const newID = this.state.applicationState.nextSituationID
        const nextID = newID + 1
        this.setState(state => {
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
     */
    renameSituation(situationID, newSituationName) {
        this.setState(state => {
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
     */
    addButtonTransition(sourceSituationID, destinationSituationID, button) {
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
        this.setState(state => {
            return { ...state, transitions: [...state.transitions, newTransition] }
        })
    }

    /**
     * Changes the destination of a specific button transition
     */
    changeButtonTransitionDestination(sourceSituationID, button, newDestinationSituationID) {
        this.setState(state => {
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
     * Adds a type(function) to an element
     * Currently implemented types: Button, Light & Display
     */
    addElementType(element, type) {
        switch (type) {
            case "Button":
                if (!!this.state.interactionElements.find(interactionElement => interactionElement.Name === element)) {
                    // Element is already an interactionElement
                    return
                }
                const newInteractionElement = { Name: element, Type: "Button" }
                this.setState(state => { return { ...state, interactionElements: [...state.interactionElements, newInteractionElement] } })
                break
            case "Display":
                // TODO: Set type display
                break
            case "Light":
                if (!!this.state.visualizationElements.find(visualizationElement => visualizationElement.Name === element)) {
                    // Element is already a visualizationElement
                    return
                }
                const newVisualizationElement = { Type: "Light", Name: element, EmissionColor: { r: 1, g: 0, b: 0, a: 1 } }
                this.setState(state => { return { ...state, visualizationElements: [...state.visualizationElements, newVisualizationElement] } })
                break
            default:
                return
        }
    }

    /**
     * Removes a type/function from an element
     * Currently implemented types: Button, Light & Display
     */
    removeElementType(element, type) {
        switch (type) {
            case "Button":
                // TODO: Remove Transitions
                this.setState(state => {
                    return {
                        ...state,
                        interactionElements: state.interactionElements.filter(interactionElement => interactionElement.Name !== element)
                    }
                })
                break
            case "Display":
                // TODO: Remove type display
                break
            case "Light":
                // TODO: Remove visualizations in states
                // TODO: Remove visualization inside WebGL
                this.setState(state => {
                    return {
                        ...state,
                        visualizationElements: state.visualizationElements.filter(visualizationElement => visualizationElement.Name !== element)
                    }
                })
                break
            default:
                return
        }
    }

    //================= LIGHT METHODS =============================

    /**
     * Changes the main color of a light element
     */
    setLightColor(element, red, green, blue) {
        if (!this.state.visualizationElements.find(visualizationElement => visualizationElement.Name === element)) {
            // Element is no light -> Stop
            return
        }
        this.setState(state => {
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
        this.state.unityWrapper.setLightEffect(element, red, green, blue, emissionStrength)
    }

    /**
     * Changes the emission strength of a light in a certain situation
     */
    setLightEmission(element, emissionSituationID, emissionStrength) {
        if (!this.state.visualizationElements.find(visualizationElement => visualizationElement.Name === element)) {
            // Element is no light -> Stop
            return
        }
        const newStates = this.state.states.map(situation => {
            if (situation.id !== emissionSituationID) {
                return situation
            }
            let emissionChanged = false
            let newValues = []
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
                const newVisualizationValue = { Type: "FloatValueVisualization", Value: emissionStrength, VisualizationElement: element }
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
            setUnityLoadingProgress: this.setUnityLoadingProgress.bind(this)

        }}>
            {this.props.children}
        </AppContext.Provider>

    }
}
