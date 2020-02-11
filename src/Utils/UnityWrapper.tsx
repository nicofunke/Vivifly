import { UnityContent } from "react-unity-webgl"
import { Direction } from "../types/direction.type"
import { OutlineColor } from '../types/outline-color.type';

// Types for the constructor params
type onClickFunction = (clickedElement: string, planeX: number, planeY: number, planeZ: number) => void
type onProgressFunction = (progress: number) => void

export class UnityWrapper {

    unityContent: UnityContent  // UnityContent object
    uploadingStarted: () => void     // Method that gets called when starting to upload a model
    uploadingFinished: () => void      // Method that gets called when uploading a model finished

    /**
     * Constructor initializes the unityContent and its methods
     */
    constructor(onClick: onClickFunction, onProgress: onProgressFunction, uploadingStarted: () => void, uploadingFinished: () => void) {
        this.unityContent = new UnityContent(
            "Build/WebGL.json",
            "Build/UnityLoader.js"
        )
        this.unityContent.on("objectClicked", (clickString: string) => {
            const clickObject = JSON.parse(clickString)
            onClick(clickObject.element, clickObject.planeX, clickObject.planeY, clickObject.planeZ)
        })
        this.unityContent.on("catchUnityError", (code: number, messageString: string) => {
            console.log("ERROR" + code + ": " + messageString)
        })
        this.unityContent.on("progress", (progress: number) => {
            onProgress(progress)
        })
        this.uploadingStarted = uploadingStarted
        this.uploadingFinished = uploadingFinished
    }

    /**
     * Inserting an 3D-model from file. This method is currently used, because it does not require to store the 3D model on the server
     */
    insertFileModel(file: File): void {
        this.uploadingStarted()
        var reader: FileReader = new FileReader()
        reader.onload = (event) => {
            this.unityContent.send(
                "JavascriptApi",
                "UploadStringObject",
                !!event.target ? event.target.result : ""
            )
            this.uploadingFinished()
        }
        reader.readAsText(file)
    }

    /**
     * Starts moving the camera inside WebGL
     */
    startCameraMovement(direction: Direction): void {
        this.unityContent.send(
            "JavascriptApi",
            "StartCameraMovement",
            direction
        )
    }


    /**
     * Stops camera movement inside WebGL
     */
    stopCameraMovement(direction: Direction): void {
        this.unityContent.send(
            "JavascriptApi",
            "StopCameraMovement",
            direction
        )
    }

    /**
     * Outlines an element inside WebGL
     */
    outlineElement(elementName: string, colorName: OutlineColor): void {
        this.unityContent.send(
            "JavascriptApi",
            "SetOutline",
            JSON.stringify({ element: elementName, color: colorName })
        )
    }

    /**
     * Removes outline of an element 
     */
    removeOutline(elementName: string): void {
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
    setLightEffect(elementName: string, red: number, green: number, blue: number, alpha: number): void {
        this.unityContent.send(
            "JavascriptApi",
            "SetLightColor",
            JSON.stringify({ element: elementName, red: red, blue: blue, green: green, alpha: alpha })
        )
    }

    /**
     * Removes all light effects from the current visualization
     */
    removeAllLightEffects(): void {
        this.unityContent.send(
            "JavascriptApi",
            "RemoveAllLights",
            undefined
        )
    }

    /**
     * Removes the light effect of a certain element
     */
    removeLightEffect(elementName: string): void {
        this.unityContent.send(
            "JavascriptApi",
            "RemoveLight",
            elementName
        )
    }

    /**
     * Activates a hover effect for the planes of an element 
     */
    activatePlaneHoverEffect(elementName: string): void {
        this.unityContent.send(
            "JavascriptApi",
            "activatePlaneHoverEffect",
            elementName
        )
    }

    /**
     * Deactivates plane hover effects
     */
    deActivatePlaneHoverEffect(): void {
        this.unityContent.send(
            "JavascriptApi",
            "deactivatePlaneHoverEffect",
            ""
        )
    }

    /**addScreenEffect(elementName, image, planeX, planeY, planeZ, resolutionX, resolutionY) {
        // TODO: Screen effect
    }**/
}