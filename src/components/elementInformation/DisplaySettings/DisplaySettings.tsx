import React, { Component } from 'react'
import { AppContext, APP_CONTEXT_DEFAULT } from '../../Application/AppContext'
import { MDBIcon } from 'mdbreact'
import { ContextUtils } from '../../../Utils/ContextUtils'
import DisplayImageUploader from './DisplayImageUploader'
import { VisualizationElement } from '../../../interfaces/visualization-element.interface'
import { Vector2 } from '../../../interfaces/vector2.interface';

export default class DisplaySettings extends Component {

    // Import AppContext
    static contextType = AppContext
    context = APP_CONTEXT_DEFAULT

    state = {
        wrongFileTypeSubmitted: false
    }

    /**
     * Checks if the plane for the display iss already set and sets it if necessary
     */
    componentDidMount() {
        const visualizationElement = this.context.visualizationElements.find(
            (visualizationElement: VisualizationElement) => visualizationElement.Name === this.context.applicationState.selectedElement
        )
        if ((!visualizationElement || !visualizationElement.Plane) && !!this.context.applicationState.clickedPlane) {
            this.context.setScreenPlane(this.context.applicationState.selectedElement, this.context.applicationState.clickedPlane)
        }
    }

    /**
     * Handles newly selected files. Stores the file and sets the screen resolution if no resolution was set yet
     * @param event Event from the file input
     */
    handleNewImage(event: React.ChangeEvent<HTMLInputElement>): void {
        // Stop if no files chosen
        if (!event.target.files) {
            return
        }
        const file = event.target.files[0]
        // Check if file is image
        if (file.type.split('/')[0] !== 'image') {
            this.setState({ wrongFileTypeSubmitted: true })
            return
        }

        // Store file
        this.context.setScreenImage(
            this.context.applicationState.selectedElement,
            this.context.applicationState.currentSituationID,
            file)

        // Store resolution if no resolution was set yet
        const visualizationElement = this.context.visualizationElements.find(
            (visualizationElement: VisualizationElement) => visualizationElement.Name === this.context.applicationState.selectedElement
        )
        if (!visualizationElement || !visualizationElement.Resolution) {
            var reader: FileReader = new FileReader()
            reader.onload = (event) => {
                var img = new Image()
                img.onload = () => {
                    const resolution: Vector2 = { x: img.width, y: img.height }
                    this.context.setScreenResolution(this.context.applicationState.selectedElement, resolution)
                }
                if (!!reader.result && typeof reader.result === 'string') {
                    img.src = reader.result
                }
            }
            reader.readAsDataURL(file)
        }
    }


    render() {
        /**const visualizationElement = this.context.visualizationElements.find(
            (visualizationElement: VisualizationElement) => visualizationElement.Name === this.context.applicationState.selectedElement
        )**/
        const currentImage = ContextUtils.getScreenImage(this.context.applicationState.selectedElement, this.context.applicationState.currentSituationID, this.context)
        return <>
            <button type="button"
                className="btn btn-link btn-sm p-0 text-default"
                onClick={() => this.context.removeElementType(this.context.applicationState.selectedElement, "Screen")}>
                <MDBIcon icon="angle-left" /> This is no display
            </button>
            <h5 className="cyan-text"><MDBIcon icon="tv" className="mr-1" /> Display </h5>
            <DisplayImageUploader handleNewImage={this.handleNewImage.bind(this)} currentImage={currentImage} />
        </>
    }
}