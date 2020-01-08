import React, { Component } from 'react'
import { MDBCard, MDBCardBody, MDBCardTitle } from 'mdbreact'
import ElementTypePicker from './ElementTypePicker'
import ElementButtonSettings from './ElementButtonSettings'
import ElementDisplaySettings from './ElementDisplaySettings'
import ElementLightSettings from './ElementLightSettings'
import { MDBCloseIcon } from "mdbreact"
import { MDBIcon } from "mdbreact"

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

    /**
     * Listener for the escape key, to close window if escape is pressed
     */
    onKeyPressed(event) {
        if (event.keyCode === 27) {
            this.props.setSelectedElement("")
        }
    }

    /**
     * Start listening to keydown events after mounting
     */
    componentDidMount() {
        document.addEventListener("keydown", this.onKeyPressed.bind(this), false)
    }

    /**
     * Stop listening to keydown events on unmounting
     */
    componentWillUnmount() {
        document.removeEventListener("keydown", this.onKeyPressed.bind(this), false)
    }

    /**
     * Returns the correspondent settings for the current element as JSX
     */
    elementTypeSettings() {
        const elementTypes = this.getElementTypes(this.props.applicationState.selectedElement)
        if (!elementTypes || elementTypes.length === 0) {
            return <ElementTypePicker element={this.props.applicationState.selectedElement} addElementType={this.props.addElementType} />
        }
        let output = []
        if (elementTypes.find(type => type === "Button")) {
            output.push(<ElementButtonSettings key="ButtonSettings" className="mt-2"
                removeElementType={this.props.removeElementType}
                element={this.props.applicationState.selectedElement} />)
        }
        if (elementTypes.find(type => type === "Display")) {
            output.push(<ElementDisplaySettings key="DisplaySettings" className="mt-2" />)
        }
        if (elementTypes.find(type => type === "Light")) {
            output.push(<ElementLightSettings key="LightSettings" className="mt-2" />)
        }
        return <>
            {output}
            <div className="d-flex justify-content-end">
                <button type="button" className="btn btn-link btn-sm p-0 text-default">
                    <MDBIcon icon="plus" /> Add another function to this element
                    </button>
            </div>
        </>
    }

    render() {
        if (!this.props.applicationState.selectedElement || this.props.applicationState.selectedElement === "") {
            return null
        }
        return <>
            <div className="window-upper-right">
                <MDBCard>
                    <MDBCardBody>
                        <div className="row align-items-start">
                            <MDBCardTitle className="col-10">{this.props.applicationState.selectedElement}</MDBCardTitle>
                            <MDBCloseIcon className="col-2" onClick={() => this.props.setSelectedElement("")} />
                        </div>
                        {this.elementTypeSettings()}
                    </MDBCardBody>
                </MDBCard>
            </div>
        </>
    }
}
