
using UnityEngine;
using System.Runtime.InteropServices;
using System.IO;

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

    // Import js function
    [DllImport("__Internal")]
    private static extern void JS_ErrorOccurred(int code, string message);

    // Necessary scripts to call functions
    OutlineController outlineController;
    LightsController lightsController;
    ModelUploader modelUploader;
    CameraController cameraController;
    ScreensController screensController;
    MouseController mouseController;

    public Texture2D image;

    // Instantiates necessary objects
    void Start() {
        // initialize controller object
        GameObject viviflyCore = GameObject.Find("ViviflyCore");
        outlineController = viviflyCore.GetComponent<OutlineController>();
        lightsController = viviflyCore.GetComponent<LightsController>();
        modelUploader = viviflyCore.GetComponent<ModelUploader>();
        screensController = viviflyCore.GetComponent<ScreensController>();
        cameraController = GameObject.Find("Main Camera").GetComponent<CameraController>();
        mouseController = viviflyCore.GetComponent<MouseController>();

        // DEBUG ====================
        //string objString = File.ReadAllText("C:\\Users\\Nico\\Desktop\\object.txt");
        //this.UploadStringObject(objString);
        // this.UploadURLObject("https://user.informatik.uni-goettingen.de/~nico.funke/CoffeeMakerCord_OBJ.obj");

        //this.activatePlaneHoverEffect("Cubey");
        //this.deactivatePlaneHoverEffect();
        /*string filepathBase64 = "C:\\Users\\Nico\\Desktop\\imageBase64.txt";
        string stringBase64 = File.ReadAllText(filepathBase64);
        string screenJSON1 = "{\"element\": \"Cube1\", \"imageBase64\": \"" + stringBase64 + "\", \"planeX\": 0.0, \"planeY\": 0.0, \"planeZ\": 1.0 }";
        string screenJSON2 = "{\"element\": \"Cube2\", \"imageBase64\": \"" + stringBase64 + "\", \"planeX\": 0.0, \"planeY\": 1.0, \"planeZ\": 0.0 }";
        string screenJSON3 = "{\"element\": \"Cube3\", \"imageBase64\": \"" + stringBase64 + "\", \"planeX\": 1.0, \"planeY\": 0.0, \"planeZ\": 0.0 }";
        string screenJSON4 = "{\"element\": \"Cube4\", \"imageBase64\": \"" + stringBase64 + "\", \"planeX\": 0.0, \"planeY\": 0.0, \"planeZ\": -1.0 }";
        string screenJSON5 = "{\"element\": \"Cube5\", \"imageBase64\": \"" + stringBase64 + "\", \"planeX\": 0.0, \"planeY\": -1.0, \"planeZ\": 0.0 }";
        string screenJSON6 = "{\"element\": \"Cube6\", \"imageBase64\": \"" + stringBase64 + "\", \"planeX\": -1.0, \"planeY\": 0.0, \"planeZ\": 0.0 }";
        this.DisplayImage(screenJSON1);
        this.DisplayImage(screenJSON2);
        this.DisplayImage(screenJSON3);
        this.DisplayImage(screenJSON4);
        this.DisplayImage(screenJSON5);
        this.DisplayImage(screenJSON6);*/
    }

    // Tries to find an object by its name and throws error to javascript otherwise
    private GameObject FindObjectByName(string objectName) {
        GameObject gameObject = GameObject.Find(objectName);
        if (!gameObject) {
            JS_ErrorOccurred(404, "Could not find gameObject " + objectName);
        }
        return gameObject;

    }

    // =========== OUTLINE METHODS ============================================

    // outlines a gameobject
    // Example JSON parameter: {"element": "Cube", "color": "red"}
    // possible color strings: red, deep-orange, light-green, cyan
    public void SetOutline(string outlineJSON) {
        OutlineJSON request = new OutlineJSON();
        JsonUtility.FromJsonOverwrite(outlineJSON, request);
        GameObject objectToOutline = this.FindObjectByName(request.element);
        if (!objectToOutline) {
            // Element does not exist: do nothing
            return;
        }
        this.outlineController.setOutline(objectToOutline, request.color);
    }

    // Removes the outline effect of an object
    public void RemoveOutline(string objectName) {
        GameObject outlinedObject = this.FindObjectByName(objectName);
        if (!outlinedObject) {
            // Element does not exist: do nothing
            return;
        }
        this.outlineController.RemoveOutline(outlinedObject);
    }

    // Removes all outline effects of all elements
    public void RemoveAllOutlines() {
        this.outlineController.RemoveAllOutlines();
    }


    // =========== UPLOAD METHODS ============================================

    // Uploads an .*obj model given by URL
    public void UploadURLObject(string url) {
        modelUploader.UploadURLObject(url);
    }

    // Uploads an *.obj model given as a string)
    public void UploadStringObject(string fileContent) {
        modelUploader.UploadFromString(fileContent);
    }

    // =========== LIGHT METHODS ============================================

    // Changes the color as defined in the json that is given as string parameter
    // example JSON: {element: "Cube3", red: 0.2, green: 1.0, blue: 0.15, alpha: 0.7 }
    public void SetLightColor(string coloringJSON) {
        ColoringJSON request = new ColoringJSON();
        JsonUtility.FromJsonOverwrite(coloringJSON, request);
        this.lightsController.ChangeColor(request.element, request.red, request.green, request.blue, request.alpha);
    }

    // Removes the light effect of an object
    public void RemoveLight(string objectName) {
        this.lightsController.RemoveLightEffect(objectName);
    }

    // Removes all light effects of all elements
    public void RemoveAllLights() {
        this.lightsController.RemoveAllLightEffects();
    }

    // =========== SCREEN METHODS =====================================================
    // Displays an image on a plane of a gameobject
    public void DisplayImage(string screenJSON) {
        ScreenJSON request = new ScreenJSON();
        JsonUtility.FromJsonOverwrite(screenJSON, request);
        Vector3 planeVector = new Vector3(request.planeX, request.planeY, request.planeZ);
        this.screensController.displayImage(request.element, request.imageBase64, planeVector);
    }

    // Removes the screen effect of a certain gameobject
    public void RemoveScreenEffect(string gameObjectName) {
        this.screensController.RemoveScreenEffect(gameObjectName);
    }

    // Removes all screen effects
    public void RemoveAllScreenEffects() {
        this.screensController.RemoveAllScreenEffects();
    }

    // Activates the hover effect for the planes of a gameObject
    public void activatePlaneHoverEffect(string gameObjectName) {
        this.mouseController.StartPlaneHoverEffect(gameObjectName);
    }

    // Deactivates the hover effect for planes
    public void deactivatePlaneHoverEffect() {
        this.mouseController.StopPlaneHoverEffect();
    }

    // =========== CAMERA MOVEMENT METHODS ============================================

    // Starts movement of camera in the direction that is given as string
    // possible strings: forwards, backwards, left, right
    public void StartCameraMovement(string direction) {
        cameraController.startMoving(direction);
    }

    // Stops movement of camera in the direction that is given as string
    // possible strings: forwards, backwards, left, right
    public void StopCameraMovement(string direction) {
        cameraController.stopMoving(direction);
    }

    // =========== OVERALL METHODS ============================================

    // Removes all visual effects such as lights, screens and outlines
    public void RemoveAllVisualEffects() {
        this.RemoveAllScreenEffects();
        this.RemoveAllOutlines();
        this.RemoveAllLights();
    }

}

