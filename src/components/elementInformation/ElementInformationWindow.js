import React, { Component } from 'react'
import { MDBCard, MDBCardBody, MDBCardTitle, MDBIcon } from 'mdbreact'
import ElementTypePicker from './ElementTypePicker'
import ElementButtonSettings from './ElementButtonSettings'
import ElementDisplaySettings from './ElementDisplaySettings'
import ElementLightSettings from './ElementLightSettings'

// TODO: Replace close button by real close icon
export default class ElementInformationWindow extends Component {

    /**
     * Returns an array with the types (Button, Light, ...) of the given element
     */
    getElementTypes(element) {
        let elementTypes = []
        for (const interactionElement of this.props.interactionElements) {
            if (interactionElement.Name === element) {
                elementTypes.push(interactionElement.Type)
            }
        }
        for (const visualizationElement of this.props.visualizationElements) {
            if (visualizationElement.Name === element) {
                elementTypes.push(visualizationElement.Type)
            }
        }
        return elementTypes
    }

    render() {
        if (!this.props.applicationState.selectedElement || this.props.applicationState.selectedElement === "") {
            return null
        }
        console.log(this.props.interactionElements)
        return <>
            <div className="window-upper-right">
                <MDBCard>
                    <MDBCardBody>
                        <div className="d-flex justify-content-end"><span onClick={() => this.props.setSelectedElement("")} className="cursor-pointer"><MDBIcon icon="times" /></span></div>
                        <MDBCardTitle>{this.props.applicationState.selectedElement}</MDBCardTitle>
                        <ElementSettings
                            element={this.props.applicationState.selectedElement}
                            elementTypes={this.getElementTypes(this.props.applicationState.selectedElement)}
                            setSelectedElement={this.props.setSelectedElement}
                            addElementType={this.props.addElementType} />
                    </MDBCardBody>
                </MDBCard>
            </div>
        </>
    }
}

function ElementSettings(props) {
    if (!props.elementTypes || props.elementTypes.length === 0) {
        return <ElementTypePicker element={props.element} addElementType={props.addElementType} />
    }
    let output = []
    if (props.elementTypes.find(type => type === "Button")) {
        output.push(<ElementButtonSettings />)
    }
    if (props.elementTypes.find(type => type === "Display")) {
        output.push(<ElementDisplaySettings />)
    }
    if (props.elementTypes.find(type => type === "Light")) {
        output.push(<ElementLightSettings />)
    }
    return <>
        {output}
    </>
}
