using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Runtime.InteropServices;

public class JavascriptAPI : MonoBehaviour {

    // Import js function
    [DllImport("__Internal")]
    private static extern void JS_ErrorOccurred(int code, string message);

    // Necessary scripts to call functions
    HighlightController highlighterScript;
    VisualizationController visualizationScript;
    ModelUploader uploaderScript;        

    // Instantiates necessary objects
    void Start() {
        highlighterScript = GameObject.Find("Highlighter").GetComponent<HighlightController>();
        visualizationScript = GameObject.Find("Visualization").GetComponent<VisualizationController>();
        uploaderScript = GameObject.Find("UploadController").GetComponent<ModelUploader>();
        this.UploadURLObject("https://user.informatik.uni-goettingen.de/~nico.funke/CoffeeMakerCord_OBJ.obj");
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
        if(!gameObject) {
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

    // Does not work at the moment
    public void UploadLocalObject(string objPath) {
        uploaderScript.UploadLocalObject(objPath);
    }

    // Uploads an .*obj model given by URL
    public void UploadURLObject(string url) {
        uploaderScript.UploadURLObject(url);
    }

    // Uploads an *.obj model given as a string)
    public void UploadStringObject(string fileContent) {
        uploaderScript.UploadFromString(fileContent);
    }


    // JSON string for coloring: {"name":"myName\"--\\Object123%$- {}Object","color":"red"}
}
