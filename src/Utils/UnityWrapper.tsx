import { UnityContent } from "react-unity-webgl"
import { Direction } from "../types/direction.type"
import { OutlineColor } from '../types/outline-color.type';
import { VisualizationElement } from '../interfaces/visualization-element.interface';
import { Vector3 } from '../interfaces/vector3.interface';

// Types for the constructor params
type onClickFunction = (clickedElement: string, clickedPlane: Vector3) => void
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
            const clickedPlane: Vector3 = { x: clickObject.planeX, y: clickObject.planeY, z: clickObject.planeZ }
            onClick(clickObject.element, clickedPlane)
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
    insertFileModel(file: File) {
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
    startCameraMovement(direction: Direction) {
        this.unityContent.send(
            "JavascriptApi",
            "StartCameraMovement",
            direction
        )
    }


    /**
     * Stops camera movement inside WebGL
     */
    stopCameraMovement(direction: Direction) {
        this.unityContent.send(
            "JavascriptApi",
            "StopCameraMovement",
            direction
        )
    }

    /**
     * Outlines an element inside WebGL
     */
    outlineElement(elementName: string, colorName: OutlineColor) {
        this.unityContent.send(
            "JavascriptApi",
            "SetOutline",
            JSON.stringify({ element: elementName, color: colorName })
        )
    }

    /**
     * Removes outline of an element 
     */
    removeOutline(elementName: string) {
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
    setLightEffect(elementName: string, red: number, green: number, blue: number, alpha: number) {
        this.unityContent.send(
            "JavascriptApi",
            "SetLightColor",
            JSON.stringify({ element: elementName, red: red, blue: blue, green: green, alpha: alpha })
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
    removeLightEffect(elementName: string) {
        this.unityContent.send(
            "JavascriptApi",
            "RemoveLight",
            elementName
        )
    }

    /**
     * Removes all currently active visual effects
     */
    removeAllVisualEffects() {
        this.unityContent.send(
            "JavascriptApi",
            "RemoveAllVisualEffects",
            ""
        )
    }

    /**
     * Activates a hover effect for the planes of an element 
     */
    activatePlaneHoverEffect(elementName: string) {
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

    /**
     * Adds a screen effect to an element
     * @param visualizationElement  Definition of the screen element
     * @param imageFile             File that should be displayed
     */
    addScreenEffect(visualizationElement: VisualizationElement, imageFile: File) {
        var reader: FileReader = new FileReader()
        reader.onload = (event) => {
            if (!!event.target && event.target.result && typeof event.target.result === 'string') {
                const params = {
                    element: visualizationElement.Name,
                    imageBase64: event.target?.result?.split(',')[1],       // cut off data type
                    // TODO: 2 use correct resolution values
                    planeX: visualizationElement.Plane?.x,
                    planeY: visualizationElement.Plane?.y,
                    planeZ: visualizationElement.Plane?.z
                }
                this.unityContent.send(
                    "JavascriptApi",
                    "DisplayImage",
                    JSON.stringify(params)
                )
            }
        }
        reader.readAsDataURL(imageFile)
    }

    /**
     * Removes the screen effect of an element
     * @param element   Name of the elemen
     */
    removeScreenEffect(element: string) {
        this.unityContent.send(
            "JavascriptApi",
            "RemoveScreenEffect",
            element
        )
    }
}