import React from 'react'
import { AppContext } from './AppContext'

/**
 * Provides the context AppContext for the whole application
 */
// TODO: THink about conditional rerendering
export default class AppProvider extends React.Component {

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
            hasAlreadySelectedAnElement: false     // if the user has already clicked on an element
        }
    }

    //============== Session specific methods

    /**
     * Updates the value of the unity loading progression. 
     * progress === 1.0 => Unity loaded completely and is ready for interaction 
     */
    setUnityLoadingProgress(progress) {
        this.setState(state => { return { ...state, applicationState: { ...state.applicationState, unityLoadingProgress: progress } } })
    }

    /**
     * Changes the currently selected situation
    */
    setCurrentSituation(currentSituationID) {
        this.setState(state => {
            return {
                ...state, applicationState: {
                    ...state.applicationState,
                    currentSituationID: currentSituationID
                }
            }
        })
    }

    setSelectedElement(selectedElement) {
        this.setState(state => { return { ...state, applicationState: { ...state.applicationState, selectedElement: selectedElement, hasAlreadySelectedAnElement: true } } })
    }

    // =============== SITUATION/STATE METHODS ========================
    // TODO: SituationID static
    /**
     * Creates a new situation and returns the ID of the new situation
     * Aborts and returns false if the name is already taken
     */
    createNewSituation(newSituationName) {
        if (this.state.states.find(state => state.Name === newSituationName)) {
            // State does already exist
            return
        }
        const newID = this.state.states.length
        this.setState(state => {
            return { ...state, states: [...state.states, { Name: newSituationName, id: newID }] }
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

    // ================== ELEMENT METHODS =================================
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
                // TODO: Set type light
                break
            default:
                return
        }
    }

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
                // TODO: Remove type light
                break
            default:
                return
        }
    }

    //================= RENDER =============================

    render() {
        return <AppContext.Provider value={{
            applicationState: this.state.applicationState,
            interactionElements: this.state.interactionElements,
            states: this.state.states,
            transitions: this.state.transitions,
            visualizationElements: this.state.visualizationElements,
            addButtonTransition: this.addButtonTransition.bind(this),
            addElementType: this.addElementType.bind(this),
            changeButtonTransitionDestination: this.changeButtonTransitionDestination.bind(this),
            createNewSituation: this.createNewSituation.bind(this),
            removeElementType: this.removeElementType.bind(this),
            renameSituation: this.renameSituation.bind(this),
            setCurrentSituation: this.setCurrentSituation.bind(this),
            setSelectedElement: this.setSelectedElement.bind(this),
            setUnityLoadingProgress: this.setUnityLoadingProgress.bind(this)

        }}>
            {this.props.children}
        </AppContext.Provider>

    }
}
