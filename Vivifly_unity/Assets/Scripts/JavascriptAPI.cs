
using UnityEngine;
using System.Runtime.InteropServices;
using System.IO;
using TriLib;

/**
 * Class to handle JSON coloring requests from Javascript
 **/
public class ColoringJSON {
    public string element;
    public float red;
    public float green;
    public float blue;
    public float alpha;
}

/**
 * Class to handle JSON outline requests from Javascript
 **/
public class OutlineJSON {
    public string element;
    public string color;
}

/**
 * Class to handle JSON screen requests from Javascript
 **/
public class ScreenJSON {
    public string element;
    public string imageBase64;
    public float planeX;
    public float planeY;
    public float planeZ;
}


public class JavascriptAPI : MonoBehaviour {

    // Necessary scripts to call functions
    OutlineController outlineController;
    LightsController lightsController;
    ModelUploader modelUploader;
    CameraController cameraController;
    ScreensController screensController;
    MouseController mouseController;

    public Texture2D image;

    /// <summary>
    /// Instantiates necessary controller objects
    /// </summary>
    void Start() {
        // initialize controller object
        GameObject viviflyCore = GameObject.Find("ViviflyCore");
        outlineController = viviflyCore.GetComponent<OutlineController>();
        lightsController = viviflyCore.GetComponent<LightsController>();
        modelUploader = viviflyCore.GetComponent<ModelUploader>();
        screensController = viviflyCore.GetComponent<ScreensController>();
        cameraController = GameObject.Find("Main Camera").GetComponent<CameraController>();
        mouseController = viviflyCore.GetComponent<MouseController>();
    }

    // =========== OUTLINE METHODS ============================================

    /// <summary>
    /// Outlines a gameobject
    /// Example JSON parameter: {"element": "Cube", "color": "red"}
    /// possible color strings: red, deep-orange, light-green, cyan
    /// </summary>
    /// <param name="outlineJSON"></param>
    public void SetOutline(string outlineJSON) {
        OutlineJSON request = new OutlineJSON();
        JsonUtility.FromJsonOverwrite(outlineJSON, request);
        GameObject objectToOutline = GameObject.Find(request.element);
        if (!objectToOutline) {
            // Element does not exist: do nothing
            return;
        }
        this.outlineController.setOutline(objectToOutline, request.color);
    }

    /// <summary>
    ///  Removes the outline effect of an object
    /// </summary>
    /// <param name="objectName">Name of the gameObject</param>
    public void RemoveOutline(string objectName) {
        GameObject outlinedObject = GameObject.Find(objectName);
        if (!outlinedObject) {
            // Element does not exist: do nothing
            return;
        }
        this.outlineController.RemoveOutline(outlinedObject);
    }

    /// <summary>
    /// Removes all outline effects of all elements
    /// </summary>
    public void RemoveAllOutlines() {
        this.outlineController.RemoveAllOutlines();
    }


    // =========== UPLOAD METHODS ============================================

    /// <summary>
    /// Calls the method to load the model that is stored inside js window into unity scene
    /// </summary>
    public void StartTriLibUpload() {
        modelUploader.StartTriLibUpload();
    }

    // =========== LIGHT METHODS ============================================


    /// <summary>
    /// Changes the color as defined in the json that is given as string parameter
    /// example JSON: {element: "Cube3", red: 0.2, green: 1.0, blue: 0.15, alpha: 0.7 }
    /// </summary>
    public void SetLightColor(string coloringJSON) {
        ColoringJSON request = new ColoringJSON();
        JsonUtility.FromJsonOverwrite(coloringJSON, request);
        this.lightsController.ChangeColor(request.element, request.red, request.green, request.blue, request.alpha);
    }

    /// <summary>
    /// Removes the light effect of an object
    /// </summary>
    /// <param name="objectName">Name of the gameObject</param>
    public void RemoveLight(string objectName) {
        this.lightsController.RemoveLightEffect(objectName);
    }

    /// <summary>
    /// Removes all light effects of all elements
    /// </summary>
    public void RemoveAllLights() {
        this.lightsController.RemoveAllLightEffects();
    }

    // =========== SCREEN METHODS =====================================================
    /// <summary>
    /// Displays an image on a plane of a gameobject
    /// </summary>
    /// <param name="screenJSON">JSON string containing screen information(see ScreenJSON Class)</param>
    public void DisplayImage(string screenJSON) {
        ScreenJSON request = new ScreenJSON();
        JsonUtility.FromJsonOverwrite(screenJSON, request);
        Vector3 planeVector = new Vector3(request.planeX, request.planeY, request.planeZ);
        this.screensController.displayImage(request.element, request.imageBase64, planeVector);
    }

    /// <summary>
    /// Removes the screen effect of a certain gameobject
    /// </summary>
    /// <param name="gameObjectName">Name of the gameObject</param>
    public void RemoveScreenEffect(string gameObjectName) {
        this.screensController.RemoveScreenEffect(gameObjectName);
    }

    /// <summary>
    /// Removes all screen effects
    /// </summary>
    public void RemoveAllScreenEffects() {
        this.screensController.RemoveAllScreenEffects();
    }

    /// <summary>
    /// Activates the hover effect for the planes of a gameObject
    /// </summary>
    /// <param name="gameObjectName">Name of the gameObject</param>
    public void activatePlaneHoverEffect(string gameObjectName) {
        this.mouseController.StartPlaneHoverEffect(gameObjectName);
    }

    /// <summary>
    /// Deactivates the hover effect for planes
    /// </summary>
    public void deactivatePlaneHoverEffect() {
        this.mouseController.StopPlaneHoverEffect();
    }

    // =========== CAMERA MOVEMENT METHODS ============================================

    /// <summary>
    /// Starts movement of camera in the direction that is given as string
    /// </summary>
    /// <param name="direction">forwards, backwards, left or right</param>
    public void StartCameraMovement(string direction) {
        cameraController.startMoving(direction);
    }

    /// <summary>
    /// Stops movement of camera in the direction that is given as string
    /// </summary>
    /// <param name="direction">forwards, backwards, left or right</param>
    public void StopCameraMovement(string direction) {
        cameraController.stopMoving(direction);
    }

    // =========== OVERALL METHODS ============================================

    /// <summary>
    /// Removes all visual effects such as lights, screens and outlines
    /// </summary>
    public void RemoveAllVisualEffects() {
        this.RemoveAllScreenEffects();
        this.RemoveAllOutlines();
        this.RemoveAllLights();
    }

}

