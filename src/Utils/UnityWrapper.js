import { UnityContent } from "react-unity-webgl"

export class UnityWrapper {

    unityContent = null         // UnityContent object
    uploadingStarted = null     // Method that gets called when starting to upload a model
    uploadingFinished = null    // Method that gets called when uploading a model finished

    /**
     * Constructor initializes the unityContent and its methods
     */
    constructor(onClick, onProgress, uploadingStarted, uploadingFinished) {
        this.unityContent = new UnityContent(
            "Build/WebGL.json",
            "Build/UnityLoader.js"
        )
        this.unityContent.on("objectClicked", name => {
            onClick(name)
        })
        this.unityContent.on("catchUnityError", (code, messageString) => {
            console.log("ERROR" + code + ": " + messageString)
        })
        this.unityContent.on("progress", progress => {
            onProgress(progress)
        })
        this.uploadingStarted = uploadingStarted
        this.uploadingFinished = uploadingFinished
    }

    /**
     * Inserting an 3D-model from file. This method is currently used, because it does not require to store the 3D model on the server
     * (Upload via URL is currently also implemented and works)
     */
    insertFileModel(file) {
        this.uploadingStarted()
        var reader = new FileReader()
        reader.onload = (event) => {
            this.unityContent.send(
                "JavascriptApi",
                "UploadStringObject",
                event.target.result
            )
            this.uploadingFinished()
        }
        reader.readAsText(file)
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

    /**
     * Changes the light effect of an element
     * colors and alpha are from 0 to 1
     */
    setLightEffect(elementName, red, green, blue, alpha) {
        const requestParam = { element: elementName, red: red, blue: blue, green: green, alpha: alpha}
        this.unityContent.send(
            "JavascriptApi",
            "SetLightColor",
            JSON.stringify(requestParam)
        )
    }
}