using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Runtime.InteropServices;

public class VisualizationController : MonoBehaviour {

    // Import js function
    [DllImport("__Internal")]
    private static extern void JS_ErrorOccurred(int code, string message);

    // Map to store the original colors of the elements
    private Dictionary<GameObject, Color> originalColors = new Dictionary<GameObject, Color>();


    // Start is called before the first frame update
    void Start() {
    }

    // Update is called once per frame
    void Update() {
    }

    // Restores the original color of all gameobjects
    public void restoreColorsOfAllGameobjects() {
        foreach (var pair in originalColors) {
            GameObject currentObject = pair.Key;
            Color originalColor = pair.Value;
            currentObject.GetComponent<Renderer>().material.color = originalColor;
        }
        originalColors = new Dictionary<GameObject, Color>();
    }

    // Restores the original color of a gameobject
    public void restoreColor(GameObject gameObject) {
        if(!originalColors.ContainsKey(gameObject)) {
            return;
            // JS_ErrorOccurred(404, "Could not find original color of  " + gameObject.name);
            // return;
        }
        gameObject.GetComponent<Renderer>().material.color = originalColors[gameObject];
        originalColors.Remove(gameObject);
    }

    // Changes the color of an object
    public void ChangeColor(GameObject gameObject, string hexColor) {

        // Parse hex color to color object
        Color color;
        if (!ColorUtility.TryParseHtmlString(hexColor, out color)) {
            JS_ErrorOccurred(400, "Could not parse hex color: " + hexColor);
            return;
        }

        // Save original color
        Renderer renderer = gameObject.GetComponent<Renderer>();
        if(!originalColors.ContainsKey(gameObject)) {
            originalColors.Add(gameObject, renderer.material.color);
        }

        // Change color
        renderer.material.color = color;
    }
}
