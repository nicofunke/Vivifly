import React from 'react'
import Unity from "react-unity-webgl"
import LoadingOverlay from './LoadingOverlay'
import UploadModelOverlay from './UploadModelOverlay'
import { AppContext } from '../Application/AppContext'

// TODO: Remove arrow key support
export default class UnityScreen extends React.Component {

    static contextType = AppContext

    /**
     * Start listening to keydown/keyup events after mounting(catching arrow keys)
     */
    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyDown.bind(this), false)
        document.addEventListener("keydown", this.handleKeyDown.bind(this), false)
    }

    /**
     * Stop listening to keydown/keyup events on unmounting(catching arrow keys)
     */
    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyUp.bind(this), false)
        document.removeEventListener("keyup", this.handleKeyUp.bind(this), false)
    }

    /**
     * Method that gets called if a key is pressed down and moves the camera if it's an arrow key
     */
    handleKeyDown(event) {
        switch (event.keyCode) {
            case 37:
                this.context.unityWrapper.startCameraMovement("left")
                break
            case 38:
                this.context.unityWrapper.startCameraMovement("forwards")
                break
            case 39:
                this.context.unityWrapper.startCameraMovement("right")
                break
            case 40:
                this.context.unityWrapper.startCameraMovement("backwards")
                break
            default:
                return
        }
    }

    /**
     * Method that gets called if a key is released and stops camera movement the camera if it's an arrow key
     */
    handleKeyUp(event) {
        switch (event.keyCode) {
            case 37:
                this.context.unityWrapper.stopCameraMovement("left")
                break
            case 38:
                this.context.unityWrapper.stopCameraMovement("forwards")
                break
            case 39:
                this.context.unityWrapper.stopCameraMovement("right")
                break
            case 40:
                this.context.unityWrapper.stopCameraMovement("backwards")
                break
            default:
                return
        }
    }

    render() {
        if( !this.context.unityWrapper){
            return null
        }
        return <>
            {this.context.applicationState.modelWasUploaded || <UploadModelOverlay unityWrapper={this.context.unityWrapper} />}
            {this.context.applicationState.isCurrentlyUploading && <LoadingOverlay message="Uploading model" />}
            <div className="position-absolute h-100 w-100 overflow-hidden">
                <div className="position-relative h-100 w-100">
                    <Unity style={{ minHeight: "100vh", minWidth: "100vw" }} unityContent={this.context.unityWrapper.unityContent} />
                </div>
            </div>
        </>
    }
}
