using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Runtime.InteropServices;

/**
 * Class to handle JSON coloring requests from javascript
 **/
public class ColoringJSON {
    public string element;
    public string color;
}

public class JavascriptAPI : MonoBehaviour {

    // Import js function
    [DllImport("__Internal")]
    private static extern void JS_ErrorOccurred(int code, string message);

    // Necessary scripts to call functions
    HighlightController highlighterScript;
    VisualizationController visualizationScript;
    ModelUploader uploaderScript;
    CameraController cameraControllerScript;

    // Instantiates necessary objects
    void Start() {
        highlighterScript = GameObject.Find("Highlighter").GetComponent<HighlightController>();
        visualizationScript = GameObject.Find("Visualization").GetComponent<VisualizationController>();
        uploaderScript = GameObject.Find("UploadController").GetComponent<ModelUploader>();
        cameraControllerScript = GameObject.Find("Main Camera").GetComponent<CameraController>();
    }

    // Update is called once per frame
    void Update() {
    }

    // Tries to find an object by its name and throws error to javascript otherwise
    private GameObject findObjectByName(string objectName) {
        GameObject gameObject = GameObject.Find(objectName);
        if (!gameObject) {
            JS_ErrorOccurred(404, "Could not find " + objectName);
        }
        return gameObject;

    }
    // Changes the color of a gameObject
    public void ChangeColorOfCurrentlyHighlighted(string hexColor) {
        GameObject gameObject = this.highlighterScript.currentlyHighlighted;
        if (!gameObject) {
            return;
        }
        this.visualizationScript.ChangeColor(gameObject, hexColor);
    }

    // Restores the original color of an object
    public void RestoreColor(string objectName) {
        GameObject gameObject = this.findObjectByName(objectName);
        if (!gameObject) {
            return;
        }
        this.visualizationScript.restoreColor(gameObject);
    }

    // Restores the original color of all objects
    public void RestoreAllColors() {
        this.visualizationScript.restoreColorsOfAllGameobjects();
    }

    // Highlights a gameobject by its name or no element, if "" is given as parameter
    public void HighlightObject(string objectName) {
        GameObject gameObject = null;
        if (objectName != "") {
            gameObject = this.findObjectByName(objectName);
            if (!gameObject) {
                return;
            }
        }
        highlighterScript.HighlightGameObject(gameObject);
    }

    // Uploads an .*obj model given by URL
    public void UploadURLObject(string url) {
        uploaderScript.UploadURLObject(url);
    }

    // Uploads an *.obj model given as a string)
    public void UploadStringObject(string fileContent) {
        uploaderScript.UploadFromString(fileContent);
    }

    // Changes the color as defined in the json that is given as string parameter
    // example JSON: {"element": "Cube", "color":"#FF0000"}
    public void ChangeColor(string coloringJSON) {
        ColoringJSON request = new ColoringJSON();
        JsonUtility.FromJsonOverwrite(coloringJSON, request);
        GameObject gameObject = this.findObjectByName(request.element);
        if (!gameObject) {
            return;
        }
        this.visualizationScript.ChangeColor(gameObject, request.color);
    }


    // Starts movement of camera in the direction that is given as string
    // possible strings: forwards, backwards, left, right
    public void startCameraMovement(string direction) {
        cameraControllerScript.startMoving(direction);
    }

    // Stops movement of camera in the direction that is given as string
    // possible strings: forwards, backwards, left, right
    public void stopCameraMovement(string direction) {
        cameraControllerScript.stopMoving(direction);
    }
}
