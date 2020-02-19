import React, { Component } from 'react'
import { AppContext, APP_CONTEXT_DEFAULT } from '../../Application/AppContext'
import { MDBIcon } from 'mdbreact'
import { ContextUtils } from '../../../Utils/ContextUtils'
import DisplayImageUploader from './DisplayImageUploader'
import { VisualizationElement } from '../../../interfaces/visualization-element.interface'
import { Vector2 } from '../../../interfaces/vector2.interface'
import ReactTooltip from 'react-tooltip'
import { ELEMENT_TYPE_SCREEN } from '../../../types/element-type.type'

// TODO: Move screen
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
        if (file.type.split('/')[0] !== 'image' || file.size > 2000000) {
            this.setState({ wrongFileTypeSubmitted: true })
            return
        }
        this.setState({ wrongFileTypeSubmitted: false })

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
            this.saveResolution(file)
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
        const currentImage = ContextUtils.getScreenImage(this.context.applicationState.selectedElement, this.context.applicationState.currentSituationID, this.context)
        return <>
            <div className="row">
                <div className="col-1 p-0 d-flex justify-content-center align-items-center">
                    <MDBIcon icon="tv" size="lg" className="cyan-text" />
                </div>
                <div className="col-11">
                    <div className="mb-1" >
                        <div className="d-inline">Display</div>
                        <div className="d-inline-block float-right">
                            <MDBIcon icon="arrows-alt"
                                className="mx-2 hover-icon"
                                data-tip="Change screen position"
                                data-for="element-display-actions"
                            />
                            <MDBIcon far icon="trash-alt"
                                className="mx-2 hover-icon"
                                data-tip="Remove display effect"
                                data-for="element-display-actions"
                                onClick={() => this.context.removeElementType(this.context.applicationState.selectedElement, ELEMENT_TYPE_SCREEN)}
                            />
                            <ReactTooltip place="bottom" effect="solid" id="element-display-actions" />
                        </div>
                    </div>
                    <div className="card-text">
                        <div>A display can show different images on its surface, dependent on the situation</div>
                        <div className="mt-2">
                            <DisplayImageUploader 
                            handleNewImage={this.handleNewImage.bind(this)} 
                            currentImage={currentImage}
                            wrongFileTypeSubmitted={this.state.wrongFileTypeSubmitted} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    }
}