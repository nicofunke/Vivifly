import React from 'react'
import { MDBIcon } from 'mdbreact'
import ReactTooltip from 'react-tooltip'
import DisplayImageUploader from './DisplayImageUploader'

// Type for props
type PropsType = {
    startPlaneSelection: () => void,
    removeElementType: () => void,
    setImage: (image: File | undefined) => void,
    currentImage: File | undefined
}

/**
 * Standard settings that get displayed for screen elements.
 * Allows to upload images, move screen plane or remove screen effect.
 */
export default class DisplayStandardSettings extends React.Component<PropsType> {

    state = { screenActivated: false }

    /**
     * Sets the screen activation toggle to true if an image exists on mounting
     */
    componentDidMount() {
        if (!!this.props.currentImage) {
            this.setState({ screenActivated: true })
        }
    }

    /**
     * Gets called if the toggle button is changed. Activates the screen or deactivates it and deletes the current image
     * @param event Change event of the toggle button
     */
    toggleChanged(event: any) {
        const value = event.target.checked
        if (!value) {
            this.props.setImage(undefined)
        }
        this.setState({ screenActivated: value })
    }

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

                <div className="custom-control custom-switch my-2">
                    <input
                        type="checkbox"
                        className="custom-control-input"
                        checked={this.state.screenActivated}
                        onChange={(this.toggleChanged.bind(this))}
                        id="displayToggle"
                        readOnly
                    />
                    <label className="custom-control-label" htmlFor="displayToggle">
                        Activate display in the current situation
                    </label>
                </div>
                {this.state.screenActivated &&
                    <div className="mt-2">
                        <DisplayImageUploader
                            handleNewImage={this.props.setImage}
                            currentImage={this.props.currentImage} />
                    </div>
                }
            </div>
        </>
    }
}