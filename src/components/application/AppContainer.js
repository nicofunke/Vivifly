import React from 'react'
import ApplicationView from './ApplicationView'


class AppContainer extends React.Component {

    constructor() {
        super()
        this.state = {
            situations: [
                { name: "Start" },
                { name: "Heating" },
                { name: "Ready" }
            ],
            currentSituationName: "Start",
            selectedElementName: "",
            elements: [ { name: "example", type: "button"}]
        }
    }

    setCurrentSituation(situationName) {
        this.setState({ currentSituationName: situationName })
    }

    setSelectedElement(elementName) {
        this.setState({ selectedElementName: elementName })
    }

    getSelectedElement() {
        const selectedElement = this.state.elements.find(element => element.name === this.state.selectedElementName)
        if (!selectedElement) {
            return { name: this.state.selectedElementName }
        }
        return selectedElement
    }

    setElementType(elementName, type) {
        let inListContained = false
        let newElementList = this.state.elements.map(element => {
            if (element.name === elementName) {
                inListContained = true
                return { ...element, type: element.type + " " + type }
            }
            return element
        })
        if(!inListContained){
            newElementList.push({ name: elementName, type: type})
        }
        this.setState({ elements: newElementList})
    }

    render() {
        const selectedElement = this.getSelectedElement()
        console.log(this.state)
        return (
            <ApplicationView
                setSituation={this.setCurrentSituation.bind(this)}
                setSelectedElement={this.setSelectedElement.bind(this)}
                model={this.state}
                selectedElement={selectedElement} 
                setElementType={this.setElementType.bind(this)}/>
        )
    }
}

export default AppContainer