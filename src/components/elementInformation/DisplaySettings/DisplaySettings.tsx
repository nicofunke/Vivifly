import React, { Component } from 'react'
import { AppContext, APP_CONTEXT_DEFAULT } from '../../Application/AppContext'
import { MDBIcon } from 'mdbreact'
import { ContextUtils } from '../../../Utils/ContextUtils'
import { VisualizationElement } from '../../../interfaces/visualization-element.interface'
import { Vector2 } from '../../../interfaces/vector2.interface'
import { ELEMENT_TYPE_SCREEN } from '../../../types/element-type.type'
import DisplayStandardSettings from './DisplayStandardSettings'
import DisplaySettingsPlaneSelection from './DisplaySettingsPlaneSelection'

// TODO: 2 Rename display to screen everywhere
/**
 * Settings for the display effect of an element
 */
export default class DisplaySettings extends Component {

    // Import AppContext
    static contextType = AppContext
    context = APP_CONTEXT_DEFAULT

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
     * @param image New image file
     */
    handleNewImage(image: File | undefined) {
        // Store file
        this.context.setScreenImage(
            this.context.applicationState.selectedElement,
            this.context.applicationState.currentSituationID,
            image)

        // Store resolution if no resolution was set yet
        const visualizationElement = this.context.visualizationElements.find(
            (visualizationElement: VisualizationElement) => visualizationElement.Name === this.context.applicationState.selectedElement
        )
        if (!!image && (!visualizationElement || !visualizationElement.Resolution)) {
            this.saveResolution(image)
        }
    }

    /**
     * Reads the resolution from a file and sets it as the resolution of the current display
     * @param imageFile File to get the resolution from
     */
    saveResolution(imageFile: File) {
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
        reader.readAsDataURL(imageFile)
    }

    render() {
        const element = this.context.applicationState.selectedElement
        const currentImage = ContextUtils.getScreenImage(element, this.context.applicationState.currentSituationID, this.context)
        return <>
            <div className="row">
                <div className="col-1 p-0 d-flex justify-content-center align-items-center">
                    <MDBIcon icon="tv" size="lg" className="cyan-text" />
                </div>
                <div className="col-11">
                    {
                        this.context.applicationState.planeSelectionElementName === element ?
                            <DisplaySettingsPlaneSelection
                                stopPlaneSelectionMode={() => this.context.setPlaneSelectionMode(element, false)} />
                            :
                            <DisplayStandardSettings
                                setImage={this.handleNewImage.bind(this)}
                                removeElementType={() => this.context.removeElementType(element, ELEMENT_TYPE_SCREEN)}
                                currentImage={currentImage}
                                startPlaneSelection={() => this.context.setPlaneSelectionMode(element, true)}
                            />
                    }
                </div>
            </div>
        </>
    }
}