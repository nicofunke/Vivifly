import React from 'react'
import { MDBIcon } from 'mdbreact'
import ReactTooltip from 'react-tooltip'
import DisplayImageUploader from './DisplayImageUploader'

// Type for props
type PropsType = {
    startPlaneSelection: () => void,
    removeElementType: () => void,
    handleNewImage: (image: File) => void,
    currentImage: File | undefined
}

// TODO: 1 Remove current image button

/**
 * Standard settings that get displayed for screen elements.
 * Allows to upload images, move screen plane or remove screen effect.
 */
export default class DisplayStandardSettings extends React.Component<PropsType> {

    render() {
        return <>
            <div className="mb-1" >
                <div className="d-inline">Display</div>
                <div className="d-inline-block float-right">
                    <MDBIcon icon="arrows-alt"
                        className="mx-2 hover-icon"
                        onClick={this.props.startPlaneSelection}
                        data-tip="Change screen position"
                        data-for="element-display-actions"
                    />
                    <MDBIcon far icon="trash-alt"
                        className="mx-2 hover-icon"
                        data-tip="Remove display effect"
                        data-for="element-display-actions"
                        onClick={this.props.removeElementType}
                    />
                    <ReactTooltip place="bottom" effect="solid" id="element-display-actions" />
                </div>
            </div>
            <div className="card-text">
                <div>A display can show different images on its surface, dependent on the situation</div>
                <div className="mt-2">
                    <DisplayImageUploader
                        handleNewImage={this.props.handleNewImage}
                        currentImage={this.props.currentImage} />
                </div>
            </div>
        </>
    }
}