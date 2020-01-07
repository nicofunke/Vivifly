import React from 'react'
import Unity, { UnityContent } from "react-unity-webgl"
import LoadingOverlay from './LoadingOverlay'

class UnityScreen extends React.Component {

    state = { isUploading: false, debugUpload: false }

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
        if (!this.state.debugUpload) {
            this.insertStringObject("http://localhost:3000/CoffeeMaker.obj")
            this.setState({debugUpload: true})
            // this.uploadURLObject("http://localhost:3000/Polaroid.obj")
            // this.updloadLocalObject("C:\\Users\\Nico\\Documents\\Masterarbeit\\3D_Models\\CoffeeMakerCord_OBJ.obj")
        }
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
     * Inserting an 3D-model from string is currently used, because it does not require to store the 3D model on the server
     * (Upload via URL is currently also implemented and works)
     * TODO: Move fetch outside this method
     */
    insertStringObject(url) {
        // TODO: Loading screen while inserting object
        this.setState({ isUploading: true })
        fetch(url)
            .then((response) => {
                return response.text()
            }).then(response => {
                this.unityContent.send(
                    "JavascriptApi",
                    "UploadStringObject",
                    response
                )
                this.setState({ isUploading: false })
            })

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