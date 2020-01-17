import React from 'react'
import Unity, { UnityContent } from "react-unity-webgl"
import LoadingOverlay from './LoadingOverlay'
import UploadModelOverlay from './UploadModelOverlay'
import { AppContext } from '../Application/AppContext'

// TODO: Send keystrokes(arrows) to unity
export default class UnityScreen extends React.Component {

    state = {
        isUploading: false,
        isModelUploaded: true, // TODO: move to context
        highlightedElement: ""
    }

    constructor() {
        super()
        this.unityContent = new UnityContent(
            "Build/WebGL.json",
            "Build/UnityLoader.js"
        )
        this.initializeUnityMethods()
    }

    /**
     * Initializes the handlers for method calls that come from unity WebGL
     */
    initializeUnityMethods() {
        this.unityContent.on("objectClicked", name => {
            this.objectClicked(name)
        })
        // TODO: Error Handling
        this.unityContent.on("catchUnityError", (code, messageString) => {
            console.log("ERROR" + code + ": " + messageString)
        })
        this.unityContent.on("progress", progress => {
            this.context.setUnityLoadingProgress(progress)
        })
    }

    /**
     * Method that gets called if an element is clicked inside unity WebGL
     * Sets it as the currently selected element
     */
    objectClicked(clickedElement) {
        if (clickedElement === this.context.applicationState.selectedElement) {
            clickedElement = ""
        }
        this.context.setSelectedElement(clickedElement)
    }

    /**
     * This method is currently not used because it would require to upload the 3d-model beforehand
     * (it could be used later on, if the user wants to open 3D-models by URL)
     */
    insertURLObject(objPath) {
        this.unityContent.send(
            "JavascriptApi",
            "UploadURLObject",
            objPath
        )
    }

    /**
     * Inserting an 3D-model from file. This method is currently used, because it does not require to store the 3D model on the server
     * (Upload via URL is currently also implemented and works)
     * TODO: Move fetch outside this method
     */
    insertFileModel(file) {
        this.setState({ isUploading: true })
        var reader = new FileReader()
        reader.onload = (event) => {
            this.unityContent.send(
                "JavascriptApi",
                "UploadStringObject",
                event.target.result
            )
            this.setState({ isUploading: false, isModelUploaded: true })
        }
        reader.readAsText(file)
    }

    /**
     * Highlights a new object in the unity scene if the context has changed
     */
    componentDidUpdate() {
        if (this.state.highlightedElement !== this.context.applicationState.selectedElement) {
            // If exists remove outline from previous outlined object
            if (!!this.state.highlightedElement && this.state.highlightedElement !== "") {
                this.removeOutline(this.state.highlightedElement)
            }
            // Outline newly selected element if an element is selected
            if (!!this.context.applicationState.selectedElement && this.context.applicationState.selectedElement !== "") {
                this.outlineElement(this.context.applicationState.selectedElement, "red")
            }
            this.setState({highlightedElement: this.context.applicationState.selectedElement})
        }
    }

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
                this.startCameraMovement("left")
                break
            case 38:
                this.startCameraMovement("forwards")
                break
            case 39:
                this.startCameraMovement("right")
                break
            case 40:
                this.startCameraMovement("backwards")
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
                this.stopCameraMovement("left")
                break
            case 38:
                this.stopCameraMovement("forwards")
                break
            case 39:
                this.stopCameraMovement("right")
                break
            case 40:
                this.stopCameraMovement("backwards")
                break
            default:
                return
        }
    }

    /**
     * Starts moving the camera inside WebGL
     * possible directions: forwards, backwards, left, right
     */
    startCameraMovement(direction) {
        this.unityContent.send(
            "JavascriptApi",
            "startCameraMovement",
            direction
        )
    }

    /**
     * Stops camera movement inside WebGL
     * possible directions: forwards, backwards, left, right
     */
    stopCameraMovement(direction) {
        this.unityContent.send(
            "JavascriptApi",
            "stopCameraMovement",
            direction
        )
    }

    /**
     * Outlines an element inside WebGL
     * possible color strings: red, deep-orange, light-green, cyan 
     */
    outlineElement(elementName, colorName) {
        const requestParam = { element: elementName, color: colorName }
        this.unityContent.send(
            "JavascriptApi",
            "setOutline",
            JSON.stringify(requestParam)
        )
    }

    /**
     * Removes outline of an element 
     */
    removeOutline(elementName) {
        this.unityContent.send(
            "JavascriptApi",
            "RemoveOutline",
            elementName
        )
    }

    render() {
        return <>
            {this.state.isModelUploaded || <UploadModelOverlay insertFileModel={this.insertFileModel.bind(this)} />}
            {this.state.isUploading && <LoadingOverlay message="Uploading model" />}
            <div className="position-absolute h-100 w-100 overflow-hidden">
                <div className="position-relative h-100 w-100">
                    <Unity style={{ minHeight: "100vh", minWidth: "100vw" }} unityContent={this.unityContent} />
                </div>
            </div>
        </>
    }
}

UnityScreen.contextType = AppContext
