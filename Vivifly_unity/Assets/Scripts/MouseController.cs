using UnityEngine;
using System.Runtime.InteropServices;

/// <summary>
/// Mouse listener which notifies Javascript if left mouse button is clicked
/// and applies the plane hover effect if activated
/// </summary>
public class MouseController : MonoBehaviour {

    // Import js functions
    [DllImport("__Internal")]
    private static extern void JS_ObjectClicked(string itemName, float planeX, float planeY, float planeZ);

    [DllImport("__Internal")]
    private static extern void JS_ErrorOccurred(int code, string message);

    // Current gameObject with plane hover effect
    private string planeHoverEffectObjectName = null;

    // Texture2D for hover effect
    public Texture2D hoverTexture;


    void Start() {
        // Stop Capturing keyboard
        WebGLInput.captureAllKeyboardInput = false;
    }

    // Check for clicks and hover effect
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
                    clickedPlane = hit.transform.InverseTransformDirection(hit.normal);
                }
            }

            // Send feedback to javascript
            JS_ObjectClicked(clickedObjectName, clickedPlane.x, clickedPlane.y, clickedPlane.y);
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
                    Vector3 hoveredPlane = hit.transform.InverseTransformDirection(hit.normal);
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



    //========================================================================================================
    // ----- METHODS BELOW THIS POINT ARE CURRENTLY NOT USED, SINCE THEY CAN BE REPLACED BY USING 'hit.normal'

    /// <summary>
    /// Returns the plane normal vector of a plane that is hit by a RaycastHit 
    /// </summary>
    /// <param name="hit">RaycastHit that hits the plane of a gameObject</param>
    /// <returns></returns>
    private Vector3 GetPlaneVector(RaycastHit hit) {

        Vector3[] collisionPoints = getThreeCollisionPoints(hit);

        // Convert collision points to local points inside gameobject
        collisionPoints[0] = hit.transform.InverseTransformPoint(collisionPoints[0]);
        collisionPoints[1] = hit.transform.InverseTransformPoint(collisionPoints[1]);
        collisionPoints[2] = hit.transform.InverseTransformPoint(collisionPoints[2]);

        // calculate plane with normal vector
        Vector3 planeVector1 = (collisionPoints[2] - collisionPoints[0]).normalized;
        Vector3 planeVector2 = (collisionPoints[1] - collisionPoints[0]).normalized;
        Vector3 planeNormalVector = Vector3.Cross(planeVector1, planeVector2).normalized;

        // Round vector in order to remove precision bugs 
        planeNormalVector = new Vector3((float)System.Math.Round(planeNormalVector.x, 2), (float)System.Math.Round(planeNormalVector.y, 2), (float)System.Math.Round(planeNormalVector.z, 2));

        // Check if normal vector needs to be inversed
        Plane surface = new Plane(planeNormalVector, collisionPoints[0]);
        if (surface.GetSide(new Vector3(0, 0, 0))) {
            planeNormalVector = -planeNormalVector;
        }
        return planeNormalVector;
    }

    /// <summary>
    ///      Splits the given Raycast closely to the collision in order to get more collisions 
    /// </summary>
    private Vector3[] getThreeCollisionPoints(RaycastHit hit) {
        GameObject clickedObject = hit.transform.gameObject;
        Vector3[] collisionPoints = new Vector3[3];
        collisionPoints[0] = hit.point;
        Vector3 cameraPosition = Camera.main.transform.position;
        Vector3 vectorFromCameraToCollision = collisionPoints[0] - cameraPosition;

        // Split the ray before it collides with the gameobject in order to get more points to calculate the plane
        float distortionStrength = 0.01f;
        float splitPointDistance = 0.01f;
        Vector3 splitPoint = collisionPoints[0] - splitPointDistance * vectorFromCameraToCollision.normalized;

        // Generate new rays from split point and try to find two more collisions 
        int collisions = 1;
        int maxIterations = 1000;   // To prevent infinte loops if no other collissions could be detected
        while (collisions < 3 && maxIterations > 0) {
            RaycastHit splitHit;
            Vector3 distortionVector = new Vector3(Random.Range(-distortionStrength, distortionStrength),
            Random.Range(-distortionStrength, distortionStrength), Random.Range(-distortionStrength, distortionStrength)).normalized;
            Ray splitRay = new Ray(splitPoint, vectorFromCameraToCollision.normalized + distortionVector);
            if (Physics.Raycast(splitRay, out splitHit)) {
                if (splitHit.transform && splitHit.transform.gameObject == clickedObject) {
                    collisionPoints[collisions] = splitHit.point;
                    collisions++;
                }
            }
            maxIterations--;
        }
        if (collisions < 3) {
            JS_ErrorOccurred(400, "Could not detect a surface");
            return null;
        }
        return collisionPoints;
    }
}
