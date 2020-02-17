import React, { Component } from 'react'
import { MDBCard, MDBCardBody } from 'mdbreact'
import ElementTypePicker from './ElementTypePicker'
import ButtonSettings from './ButtonSettings/ButtonSettings'
import DisplaySettings from './DisplaySettings/DisplaySettings'
import { AppContext } from '../Application/AppContext'
import LightSettings from './LightSettings/LightSettings'
import { ContextUtils } from '../../Utils/ContextUtils'
import ElementInformationHeader from './ElementInformationHeader'

export default class ElementInformationWindowHandler extends Component {

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
        this.onKeyPressed = this.onKeyPressed.bind(this)    // Method needs to be binded here, otherwise the listener can't be removed
        document.addEventListener("keydown", this.onKeyPressed, false)
    }

    /**
     * Stop listening to keydown events on unmounting(catching ESC)
     */
    componentWillUnmount() {
        document.removeEventListener("keydown", this.onKeyPressed, false)
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
        </>
    }

    render() {
        if (!this.context.applicationState.selectedElement || this.context.applicationState.selectedElement === "") {
            return null
        }
        return <>
            <div className="window-upper-right">
                <MDBCard>
                    <div className="primary-color-dark text-white">
                        <MDBCardBody className="pb-1">
                            <ElementInformationHeader
                                title={this.context.applicationState.selectedElement}
                                onClose={() => this.context.setSelectedElement("")} />
                        </MDBCardBody>
                    </div>
                    <MDBCardBody>
                        {this.elementTypeSettings()}
                    </MDBCardBody>
                </MDBCard>
            </div>
        </>
    }
}
