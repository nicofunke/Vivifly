import React, { Component } from 'react'
import { MDBCard, MDBCardBody, MDBCardTitle, MDBIcon, MDBCloseIcon } from 'mdbreact'
import ElementTypePicker from './ElementTypePicker'
import ButtonSettings from './ButtonSettings/ButtonSettings'
import DisplaySettings from './DisplaySettings/DisplaySettings'
import { AppContext } from '../Application/AppContext'
import LightSettings from './LightSettings/LightSettings'
import { ContextUtils } from '../../Utils/ContextUtils'

export default class ElementInformationWindow extends Component {

    static contextType = AppContext


    /**
     * Listener for the escape key, to close window if escape is pressed
     */
    onKeyPressed(event) {
        if (event.keyCode === 27) {
            this.context.setSelectedElement("")
        }
    }

    /**
     * Start listening to keydown events after mounting(catching ESC)
     */
    componentDidMount() {
        document.addEventListener("keydown", this.onKeyPressed.bind(this), false)
    }

    /**
     * Stop listening to keydown events on unmounting(catching ESC)
     */
    componentWillUnmount() {
        document.removeEventListener("keydown", this.onKeyPressed.bind(this), false)
    }

    render() {
        if (!this.context.applicationState.selectedElement || this.context.applicationState.selectedElement === "") {
            return null
        }
        return <>
            <div className="window-upper-right">
                <MDBCard>
                    <MDBCardBody>
                        <div className="row align-items-start">
                            <MDBCardTitle className="col-10">{this.context.applicationState.selectedElement}</MDBCardTitle>
                            <MDBCloseIcon className="col-2" onClick={() => this.context.setSelectedElement("")} />
                        </div>
                        {this.elementTypeSettings()}
                    </MDBCardBody>
                </MDBCard>
            </div>
        </>
    }

    /**
     * Returns the correspondent settings for the current element as JSX
     */
    elementTypeSettings() {
        const elementTypes = ContextUtils.getElementTypes(this.context.applicationState.selectedElement, this.context)
        if (!elementTypes || elementTypes.length === 0) {
            return <ElementTypePicker />
        }
        let output = []
        if (elementTypes.find(type => type === "Button")) {
            output.push(<ButtonSettings key="ButtonSettings" className="mt-2" />)
        }
        if (elementTypes.find(type => type === "Screen")) {
            output.push(<DisplaySettings key="DisplaySettings" className="mt-2" />)
        }
        if (elementTypes.find(type => type === "Light")) {
            output.push(<LightSettings key="LightSettings" className="mt-2" />)
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
}
