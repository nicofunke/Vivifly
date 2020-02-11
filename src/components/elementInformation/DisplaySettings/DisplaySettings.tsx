import React, { Component } from 'react'
import { AppContext, APP_CONTEXT_DEFAULT } from '../../Application/AppContext';
import { MDBIcon } from 'mdbreact'
import { VisualizationElement } from '../../../interfaces/visualization-element.interface';
import { ContextUtils } from '../../../Utils/ContextUtils';
import DisplayImageUploader from './DisplayImageUploader';

export default class DisplaySettings extends Component {

    // Import AppContext
    static contextType = AppContext
    context = APP_CONTEXT_DEFAULT

    state = {
        wrongFileTypeSubmitted: false
    }

    /**
     * Checks if the normal vector for the screen plane is set and activates the plane selection mode if it is not set yet
     
    componentDidMount() {
        const visualizationElement = this.context.visualizationElements.find(
            (visualizationElement: VisualizationElement) => visualizationElement.Name === this.context.applicationState.selectedElement
        )
        if (!!visualizationElement && !visualizationElement.Plane
            && this.context.applicationState.planeSelectionElementName !== this.context.applicationState.selectedElement) {

            this.context.startPlaneSelection(this.context.applicationState.selectedElement)
        }
    }*/

    /**
     * 
     */
    setCurrentImage(file: File): void {
        // Stop if file is no image
        if (file.type.split('/')[0] !== 'image') {
            this.setState({ wrongFileTypeSubmitted: true })
            return
        }

        // Store file
        this.context.setScreenImage(
            this.context.applicationState.selectedElement,
            this.context.applicationState.currentSituationID,
            file)

       /* var reader: FileReader = new FileReader()
        reader.onload = (event) => {
            console.log(event.target?.result)
            var img = new Image()
            img.onload = () => {
                console.log(img.height + " x " + img.width)
            }
            if (!!reader.result && typeof reader.result === 'string') {
                img.src = reader.result
            }
        }
        console.log(file.type)
        reader.readAsDataURL(file)
        console.log(file.name) */
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
            {
                !!currentImage ? <div>Current image: { currentImage.name } </div> : <DisplayImageUploader uploadImage={this.setCurrentImage.bind(this)} />
            }
        </>
    }
}