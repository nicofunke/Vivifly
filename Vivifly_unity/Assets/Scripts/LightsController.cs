using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Runtime.InteropServices;
using System.Linq;

using de.ugoe.cs.vivian.core;
public class LightsController : MonoBehaviour {

    // Import js function
    [DllImport("__Internal")]
    private static extern void JS_ErrorOccurred(int code, string message);

    // Maps GameObjects of light with their correspondend light overlay
    private Dictionary<GameObject, GameObject> lightObjects = new Dictionary<GameObject, GameObject>();


    // Start is called before the first frame update
    void Start() {
    }

    // Update is called once per frame
    void Update() {
    }

    // Adds a light effect to an gameObject by creating an overlay light object
    public void ChangeColor(GameObject originalObject, float red, float green, float blue, float alpha) {

        // Get light overlay object or create new one
        GameObject lightGameObject;
        if (!lightObjects.ContainsKey(originalObject)) {
            lightGameObject = this.AddLightEffect(originalObject, red, green, blue);
        }
        else {
            lightGameObject = lightObjects[originalObject];
        }
        lightGameObject.GetComponent<MeshRenderer>().material.color = new Color(red, green, blue, alpha);
    }

    // Creates an overlaying GameObject for light effects
    // Returns the overlay object
    public GameObject AddLightEffect(GameObject originalObject, float red, float green, float blue) {

        // There is already an overlay element -> stop
        if (lightObjects.ContainsKey(originalObject)) {
            return null;
        }

        // Create an overlay object for the light
        GameObject lightGameObject = new GameObject("VisualizationObject" + originalObject.name);
        lightGameObject.transform.SetPositionAndRotation(originalObject.transform.position, originalObject.transform.rotation);

        // Copy Meshfilter
        MeshFilter originalObjectMeshFilter = originalObject.GetComponent<MeshFilter>();
        if (originalObjectMeshFilter != null) {
            MeshFilter lightMeshFilter = (MeshFilter)lightGameObject.AddComponent(originalObjectMeshFilter.GetType());
            Utils.CopyComponentValues(lightMeshFilter, originalObjectMeshFilter);
        }

        // Get Meshrenderer
        MeshRenderer originalObjectMeshRenderer = originalObject.GetComponent<MeshRenderer>();
        if (originalObjectMeshRenderer == null) {
            // No Meshrenderer found => Stop 
            return null;
        }

        // Copy Meshrenderer
        MeshRenderer lightMeshRenderer = (MeshRenderer)lightGameObject.AddComponent(originalObjectMeshRenderer.GetType());
        Utils.CopyComponentValues(lightMeshRenderer, originalObjectMeshRenderer);

        // Add transparent material
        Material lightMaterial = new Material(Shader.Find("UI/Default"));
        lightMaterial.color = new Color(red, green, blue, (float)0.0);
        lightMeshRenderer.material = lightMaterial;

        // Add to lightElements mapping and return
        lightObjects.Add(originalObject, lightGameObject);
        return lightGameObject;
    }

    // Removes the light effect overlay of a gameobject
    public void RemoveLightEffect(GameObject originalObject) {
        // There is no overlay element -> stop
        if (!lightObjects.ContainsKey(originalObject)) {
            return;
        }
        GameObject lightGameObject = lightObjects[originalObject];
        lightObjects.Remove(originalObject);
        Destroy(lightGameObject);
    }

    // Removes all light overlay gameobjects
    public void RemoveAllLightEffects() {
        GameObject[] keyObjects = lightObjects.Keys.ToArray();
        foreach (GameObject keyObject in keyObjects) {
            this.RemoveLightEffect(keyObject);
        }
    }
}
