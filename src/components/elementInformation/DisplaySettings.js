import React, { Component } from 'react'
import { AppContext } from '../Application/AppContext'
import { MDBIcon } from 'mdbreact'

export default class DisplaySettings extends Component {

    static contextType = AppContext

    /**
     * Checks if the normal vector for the screen plane is set and activates the plane selection mode if it is not set yet
     */
    componentDidMount() {
        const visualizationElement = this.context.visualizationElements.find(visualizationElement => visualizationElement.Name === this.context.applicationState.selectedElement)
        if (!visualizationElement.Plane && this.context.applicationState.planeSelectionElementName !== this.context.applicationState.selectedElement) {
            this.context.startPlaneSelection(this.context.applicationState.selectedElement)
        }
    }

    render() {
        const visualizationElement = this.context.visualizationElements.find(visualizationElement => visualizationElement.Name === this.context.applicationState.selectedElement)
        return <>
            <button type="button"
                className="btn btn-link btn-sm p-0 text-default"
                onClick={() => this.context.removeElementType(this.context.applicationState.selectedElement, "Screen")}>
                <MDBIcon icon="angle-left" /> This is no display
            </button>
            <h5 className="cyan-text"><MDBIcon icon="tv" className="mr-1" /> Display </h5>
            {!!visualizationElement.Plane ? <div>Gibts schon!</div> : <div>Please place the screen by clicking on the middle of the plane where the screen should appear</div>}
            Display Settings
        </>
    }
}