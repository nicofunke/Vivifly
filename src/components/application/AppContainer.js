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
            elements: []
        }
        this.bindMethods()
    }

    bindMethods() {
        this.setSelectedElement = this.setSelectedElement.bind(this)
        this.setCurrentSituation = this.setCurrentSituation.bind(this)
    }

    setCurrentSituation(situationName) {
        this.setState({ currentSituationName: situationName })
    }

    setSelectedElement(elementName) {
        this.setState({ selectedElementName: elementName })
    }

    getSelectedElement() {
        const selectedElement = this.state.elements.find( element => element.name === this.state.selectedElementName)
        if(! selectedElement){
            return { name: this.state.selectedElementName}
        }
        return selectedElement
    }


    render() {
        const selectedElement = this.getSelectedElement()
        return (
            <ApplicationView
                setSituation={this.setCurrentSituation}
                setCurrentElement={this.setCurrentElement}
                setSelectedElement={this.setSelectedElement}
                model={this.state} 
                selectedElement={selectedElement}/>
        )
    }
}

export default AppContainer