import React from 'react'
import Unity, { UnityContent } from "react-unity-webgl"
import LoadingOverlay from './LoadingOverlay'
import UploadModelOverlay from './UploadModelOverlay'

// TODO: Send keystrokes(arrows) to unity
class UnityScreen extends React.Component {

    state = { isUploading: false, isModelUploaded: true }

    constructor() {
        super()

        this.unityContent = new UnityContent(
            "Build/WebGL.json",
            "Build/UnityLoader.js"
        )
        this.unityContent.on("objectClicked", name => {
            this.objectClicked(name)
        })
        // TODO: Error Handling
        this.unityContent.on("catchUnityError", (code, messageString) => {
            console.log("ERROR" + code + ": " + messageString)
        })
        this.unityContent.on("loaded", () => {
            // TODO: Show upload button after loading unity
        })
        this.unityContent.on("progress", progress => {
            this.props.setUnityLoadingProgress(progress)
        })

        // TODO: color with JSON 
        // const testObject = {name: "myName\"--\\Object123%$- {}Object", color: "red"}
        // const stringObject = JSON.stringify(testObject)
        // console.log(stringObject)
    }

    objectClicked(clickedElement) {
        if (clickedElement === this.props.applicationState.selectedElement) {
            clickedElement = ""
        }
        this.props.setSelectedElement(clickedElement)
    }

    /**
     * Changes the currently highlighted element if necessary, dependent on the props
     */
    componentDidUpdate(prevProps) {
        if (prevProps.applicationState.selectedElement !== this.props.applicationState.selectedElement) {
            this.highLightItem(this.props.applicationState.selectedElement)
        }
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
        reader.onload =  (event) => {
            this.unityContent.send(
                "JavascriptApi",
                "UploadStringObject",
                event.target.result
            )
            this.setState({ isUploading: false, isModelUploaded: true })
        }
        reader.readAsText(file)
    }

    highLightItem(itemName) {
        this.unityContent.send(
            "JavascriptApi",
            "HighlightObject",
            itemName
        )
    }

    changeColor(hexColor) {
        this.unityContent.send(
            "JavascriptApi",
            "ChangeColorOfCurrentlyHighlighted",
            hexColor
        )
    }

    restoreColor(element) {
        this.unityContent.send(
            "JavascriptApi",
            "RestoreColor",
            element
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

export default UnityScreen