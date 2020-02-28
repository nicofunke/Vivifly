using UnityEngine;
using System.Runtime.InteropServices;
using System;


/**
 * Class to send clicks as JSON to Javascript
 **/
public class MouseClickJSON {
    public string element;
    public float planeX;
    public float planeY;
    public float planeZ;
}

/// <summary>
/// Mouse listener which notifies Javascript if left mouse button is clicked
/// and applies the plane hover effect if activated
/// </summary>
public class MouseController : MonoBehaviour {

    // Import js functions
    [DllImport("__Internal")]
    private static extern void JS_ObjectClicked( string mouseClickJSON);

    /// <summary>
    /// Current gameObject with plane hover effect
    /// </summary>
    private string planeHoverEffectObjectName = null;

    /// <summary>
    /// Texture2D for hover effect
    /// </summary>
    public Texture2D hoverTexture;


    void Start() {
        // Stop Capturing keyboard
        WebGLInput.captureAllKeyboardInput = false;
    }

    /// <summary>
    /// Checks for clicks and hover effect
    /// </summary>
    void Update() {
        CheckForClicks();
        CheckPlaneHoverEffect();
    }

    /// <summary>
    /// Checks if the left mouse button was clicked and notifies Javascript
    /// </summary>
    public void CheckForClicks() {
        if (Input.GetMouseButtonDown(0)) {
            RaycastHit hit;
            Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
            string clickedObjectName = null;

            // Check if clicked on an object
            Vector3 clickedPlane = new Vector3(0, 0, 0);
            if (Physics.Raycast(ray, out hit)) {
                if (hit.transform) {

                    GameObject clickedObject = hit.transform.gameObject;
                    clickedObjectName = clickedObject.name;
                    // Get clicked plane and round by 
                    clickedPlane = GetPlaneVector(hit);

                }
            }

            // Store click information in JSON string 
            MouseClickJSON clickJSONObject = new MouseClickJSON();
            clickJSONObject.element = clickedObjectName;
            clickJSONObject.planeX = clickedPlane.x;
            clickJSONObject.planeY = clickedPlane.y;
            clickJSONObject.planeZ = clickedPlane.z;
            string clickJSONString = JsonUtility.ToJson(clickJSONObject);
            
            // Send feedback to Javascript
            JS_ObjectClicked(clickJSONString);
        }
    }

    /// <summary>
    ///  If the plane hover effect is activated this method checks if the mous is currently above a plane of the hover gameobject
    /// and hightlights the plane
    /// </summary>
    public void CheckPlaneHoverEffect() {
        if (planeHoverEffectObjectName != null) {
            // Remove existing hover effect
            GameObject viviflyCore = GameObject.Find("ViviflyCore");
            ScreensController screensController = viviflyCore.GetComponent<ScreensController>();
            screensController.RemoveScreenEffect(planeHoverEffectObjectName);
            // Add new hover effect
            RaycastHit hit;
            Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
            if (Physics.Raycast(ray, out hit)) {
                if (hit.transform && hit.transform.gameObject.name == planeHoverEffectObjectName) {
                    Vector3 hoveredPlane = GetPlaneVector(hit);
                    screensController.displayImage(planeHoverEffectObjectName, hoverTexture, hoveredPlane);

                }
            }

        }
    }

    /// <summary>
    /// Activates the plane hover effect for the given gameObject
    /// </summary>
    /// <param name="gameObjectName">Name of the GameObject whose planes should by highlighted on hover</param>
    public void StartPlaneHoverEffect(string gameObjectName) {
        planeHoverEffectObjectName = gameObjectName;
    }

    /// <summary>
    /// Stops the current plane hover effect
    /// </summary>
    public void StopPlaneHoverEffect() {
        GameObject viviflyCore = GameObject.Find("ViviflyCore");
        ScreensController screensController = viviflyCore.GetComponent<ScreensController>();
        screensController.RemoveScreenEffect(planeHoverEffectObjectName);
        planeHoverEffectObjectName = null;
    }


    /// <summary>
    /// Returns the plane normal vector of a plane that is hit by a RaycastHit 
    /// </summary>
    /// <param name="hit">RaycastHit that hits the plane of a gameObject</param>
    /// <returns>Normal vector of the hit plane</returns>
    private Vector3 GetPlaneVector(RaycastHit hit) {
        Vector3 vector = hit.transform.InverseTransformDirection(hit.normal);
        return new Vector3((float)Math.Round(vector.x, 2), (float)Math.Round(vector.y, 2), (float)Math.Round(vector.z, 2));
    }
}
