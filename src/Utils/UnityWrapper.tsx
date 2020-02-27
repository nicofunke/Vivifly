import { UnityContent } from "react-unity-webgl"
import { Direction } from "../types/direction.type"
import { OutlineColor, OUTLINE_COLOR_RED } from '../types/outline-color.type';
import { VisualizationElement } from '../interfaces/visualization-element.interface'
import { Vector3 } from '../interfaces/vector3.interface'
import { Window } from '../interfaces/window.interface';
import { AppContext } from '../interfaces/app-context.interface';
import { VISUALIZATION_TYPE_FLOAT, VISUALIZATION_TYPE_SCREEN } from '../types/visualization-type.type';
import { ContextUtils } from './ContextUtils';
import { ELEMENT_TYPE_SCREEN } from '../types/element-type.type';

/**
 * declaring global window variables to store uploaded models
 */
declare var window: Window

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
        this.unityContent.on("progress", (progress: number) => {
            onProgress(progress)
        })
        this.unityContent.on("catchUnityError", (progress: number) => { })
        this.uploadingStarted = uploadingStarted
        this.uploadingFinished = uploadingFinished
    }

    /**
     * Removes all visualization from the current WebGL and displays a certain context
     * @param context       Context that should be displayed
     * @param situationID   Situation that should be visualized (default: current situation)
     */
    updateVisualization(context: AppContext, situationID: number | undefined = undefined) {
        this.removeAllVisualEffects()
        situationID = situationID !== undefined ? situationID : context.applicationState.currentSituationID
        const situation = context.states.find(situation => situation.id === situationID)
        if (!!situation && !!situation.Values) {
            for (const value of situation.Values) {
                if (value.Type === VISUALIZATION_TYPE_FLOAT) {
                    // Add light effects
                    const color = ContextUtils.getLightEmissionColor(value.VisualizationElement, context.visualizationElements)
                    if (!!color) {
                        this.setLightEffect(value.VisualizationElement, color.r, color.g, color.b, value.Value || 0.0)
                    }
                } else if (value.Type === VISUALIZATION_TYPE_SCREEN) {
                    // Add screen effects
                    const visualizationElement = context.visualizationElements.find(
                        (visualizationElement: VisualizationElement) => (
                            visualizationElement.Name === value.VisualizationElement && visualizationElement.Type === ELEMENT_TYPE_SCREEN
                        )
                    )
                    if (!!visualizationElement && !!value.File) {
                        this.addScreenEffect(visualizationElement, value.File)
                    }
                }
            }
        }
        // Restore outline of selected element
        this.outlineElement(context.applicationState.selectedElement, OUTLINE_COLOR_RED)
    }

    /**
     * Uploads a 3D model into the scene
     * @param file 3D Model file
     */
    uploadModel(file: File) {
        this.uploadingStarted()
        var reader = new FileReader();
        reader.onload = (event) => {
            if (!event.target) {
                return
            }
            var arrayBuffer = event.target.result
            if (!arrayBuffer || typeof (arrayBuffer) === "string") {
                return
            }
            var array = new Uint8Array(arrayBuffer)
            window.triLibFiles = [{
                name: file.name,
                data: array
            }]
            this.unityContent.send("JavascriptApi", "StartTriLibUpload", "")
            this.uploadingFinished()
        }
        reader.readAsArrayBuffer(file)
        window.triLibFiles = []
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