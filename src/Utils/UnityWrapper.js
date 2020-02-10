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
        this.unityContent.on("objectClicked", (clickString) => {
            const clickObject = JSON.parse(clickString)
            onClick(clickObject.element, clickObject.planeX, clickObject.planeY, clickObject.planeZ)
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
            "StartCameraMovement",
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
            "StopCameraMovement",
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
            "SetOutline",
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
        const requestParam = { element: elementName, red: red, blue: blue, green: green, alpha: alpha }
        this.unityContent.send(
            "JavascriptApi",
            "SetLightColor",
            JSON.stringify(requestParam)
        )
    }

    /**
     * Removes all light effects from the current visualization
     */
    removeAllLightEffects() {
        this.unityContent.send(
            "JavascriptApi",
            "RemoveAllLights",
            undefined
        )
    }

    /**
     * Removes the light effect of a certain element
     */
    removeLightEffect(elementName) {
        this.unityContent.send(
            "JavascriptApi",
            "RemoveLight",
            elementName
        )
    }

    /**
     * Activates a hover effect for the planes of an element 
     */
    activatePlaneHoverEffect(elementName) {
        this.unityContent.send(
            "JavascriptApi",
            "activatePlaneHoverEffect",
            elementName
        )
    }

    /**
     * Deactivates plane hover effects
     */
    deActivatePlaneHoverEffect() {
        this.unityContent.send(
            "JavascriptApi",
            "deactivatePlaneHoverEffect",
            ""
        )
    }

    addScreenEffect(elementName, image, planeX, planeY, planeZ, resolutionX, resolutionY) {
        // TODO: Screen effect
    }
}