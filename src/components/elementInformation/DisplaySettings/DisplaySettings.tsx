import React from 'react'
import { MDBIcon } from 'mdbreact'
import { ContextUtils } from '../../../Utils/ContextUtils'
import { VisualizationElement } from '../../../interfaces/visualization-element.interface';
import { Vector2 } from '../../../interfaces/vector2.interface'
import { ELEMENT_TYPE_SCREEN } from '../../../types/element-type.type'
import DisplayStandardSettings from './DisplayStandardSettings'
import DisplaySettingsPlaneSelection from './DisplaySettingsPlaneSelection'
import { Vector3 } from '../../../interfaces/vector3.interface'
import { Actions } from '../../../interfaces/actions.interface'
import { State } from '../../../interfaces/state.interface';

type PropsType = {
    visualizationElements: VisualizationElement[],
    element: string,
    clickedPlane?: Vector3,
    actions: Actions,
    currentSituationID: number,
    states: State[],
    planeSelectionElementName?: string
}

// TODO: (UX) Rename display to screen everywhere

/**
 * Settings for the display effect of an element
 */
export default class DisplaySettings extends React.Component<PropsType> {

    /**
     * Checks if the plane for the display iss already set and sets it if necessary
     */
    componentDidMount() {
        const visualizationElement = this.props.visualizationElements.find(
            (visualizationElement: VisualizationElement) => visualizationElement.Name === this.props.element
        )
        if ((!visualizationElement || !visualizationElement.Plane) && !!this.props.clickedPlane) {
            this.props.actions.setScreenPlane(this.props.element, this.props.clickedPlane)
        }
    }

    /**
     * Handles newly selected files. Stores the file and sets the screen resolution if no resolution was set yet
     * @param image New image file
     */
    handleNewImage(image: File | undefined) {
        // Store file
        this.props.actions.setScreenImage(
            this.props.element,
            this.props.currentSituationID,
            image)

        // Store resolution if no resolution was set yet
        const visualizationElement = this.props.visualizationElements.find(
            (visualizationElement: VisualizationElement) => visualizationElement.Name === this.props.element
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
                this.props.actions.setScreenResolution(this.props.element, resolution)
            }
            if (!!reader.result && typeof reader.result === 'string') {
                img.src = reader.result
            }
        }
        reader.readAsDataURL(imageFile)
    }

    render() {
        const currentImage = ContextUtils.getScreenImage(this.props.element, this.props.currentSituationID, this.props.states)
        return <>
            <div className="row">
                <div className="col-1 p-0 d-flex justify-content-center align-items-center">
                    <MDBIcon icon="tv" size="lg" className="cyan-text" />
                </div>
                <div className="col-11">
                    {
                        this.props.planeSelectionElementName === this.props.element ?
                            <DisplaySettingsPlaneSelection
                                stopPlaneSelectionMode={() =>
                                    this.props.actions.setPlaneSelectionMode(this.props.element, false)} />
                            :
                            <DisplayStandardSettings
                                setImage={this.handleNewImage.bind(this)}
                                removeElementType={() =>
                                    this.props.actions.removeElementType(this.props.element, ELEMENT_TYPE_SCREEN)}
                                currentImage={currentImage}
                                startPlaneSelection={() =>
                                    this.props.actions.setPlaneSelectionMode(this.props.element, true)}
                            />
                    }
                </div>
            </div>
        </>
    }
}