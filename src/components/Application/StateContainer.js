import React from 'react'
import ViewContainer from './ViewContainer'

/**
 * This container class holds all state information, like the states, elements and transitions
 */
export default class StateContainer extends React.Component {

    state = {
        interactionElements: [],
        states: [ {Name: "Start"},{Name: "Heating"}, {Name: "Ready"}],
        transitions: [],
        visualizationElements: [],
        applicationState: {
            currentSituation: "Start",
            selectedElement: "",
            unityLoadingProgress: 0.0
        }
    }

    setUnityLoadingProgress(progress) {
        this.setState(state => { return { ...state, applicationState: { ...state.applicationState, unityLoadingProgress: progress } } })
    }

    setCurrentSituation(newSituation) {
        if (!this.state.states.find(state => state.Name === newSituation)) {
            // State does not exist
            return
        }
        this.setState(state => { return { ...state, applicationState: { ...state.applicationState, currentSituation: newSituation } } })
    }

    setSelectedElement(selectedElement) {
        this.setState(state => { return { ...state, applicationState: { ...state.applicationState, selectedElement: selectedElement } } })
    }

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

    render() {
        return (
            <ViewContainer
                setSituation={this.setCurrentSituation.bind(this)}
                setSelectedElement={this.setSelectedElement.bind(this)}
                setUnityLoadingProgress={this.setUnityLoadingProgress.bind(this)}
                interactionElements={this.state.interactionElements}
                states={this.state.states}
                transitions={this.state.transitions}
                visualizationElements={this.state.visualizationElements}
                applicationState={this.state.applicationState}
                addElementType={this.addElementType.bind(this)} />
        )
    }
}
