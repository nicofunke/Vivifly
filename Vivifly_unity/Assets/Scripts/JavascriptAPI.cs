using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Runtime.InteropServices;

/**
 * Class to handle JSON coloring requests from javascript
 **/
public class ColoringJSON {
    public string element;
    public float red;
    public float green;
    public float blue;
    public float alpha;
}

public class JavascriptAPI : MonoBehaviour {

    // Import js function
    [DllImport("__Internal")]
    private static extern void JS_ErrorOccurred(int code, string message);

    // Necessary scripts to call functions
    OutlineController outlineController;
    LightsController lightsController;
    ModelUploader modelUploader;
    CameraController cameraController;

    // Instantiates necessary objects
    void Start() {
        GameObject viviflyCore = GameObject.Find("ViviflyCore");
        outlineController = viviflyCore.GetComponent<OutlineController>();
        lightsController = viviflyCore.GetComponent<LightsController>();
        modelUploader = viviflyCore.GetComponent<ModelUploader>();
        cameraController = GameObject.Find("Main Camera").GetComponent<CameraController>();
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

    // Highlights a gameobject by its name or no element, if "" is given as parameter
    public void HighlightObject(string objectName) {
        GameObject gameObject = null;
        if (objectName != "") {
            gameObject = this.findObjectByName(objectName);
            if (!gameObject) {
                return;
            }
        }
        outlineController.HighlightGameObject(gameObject);
    }

    // Uploads an .*obj model given by URL
    public void UploadURLObject(string url) {
        modelUploader.UploadURLObject(url);
    }

    // Uploads an *.obj model given as a string)
    public void UploadStringObject(string fileContent) {
        modelUploader.UploadFromString(fileContent);
    }

    // Changes the color as defined in the json that is given as string parameter
    // example JSON: {element: "Cube3", red: 0.2, green: 1.0, blue: 0.15, alpha: 0.7 }
    public void ChangeColor(string coloringJSON) {

        ColoringJSON request = new ColoringJSON();
        JsonUtility.FromJsonOverwrite(coloringJSON, request);
        GameObject gameObject = this.findObjectByName(request.element);
        if (!gameObject) {
            // Element does not exist: do nothing
            return;
        }
        this.lightsController.ChangeColor(gameObject, request.red, request.green, request.blue, request.alpha);
    }

    // Removes the light effect of an object
    public void RemoveLight(string objectName) {
        GameObject gameObject = this.findObjectByName(objectName);
        if (!gameObject) {
            // Element does not exist: do nothing
            return;
        }
        this.lightsController.RemoveLightEffect(gameObject);
    }

    // Removes all light effects of all elements
    public void RemoveAllLights() {
        this.lightsController.RemoveAllLightEffects();
    }


    // Starts movement of camera in the direction that is given as string
    // possible strings: forwards, backwards, left, right
    public void startCameraMovement(string direction) {
        cameraController.startMoving(direction);
    }

    // Stops movement of camera in the direction that is given as string
    // possible strings: forwards, backwards, left, right
    public void stopCameraMovement(string direction) {
        cameraController.stopMoving(direction);
    }
}
