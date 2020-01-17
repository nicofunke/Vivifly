using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Runtime.InteropServices;
using System.Linq;

public class OutlineController : MonoBehaviour {

    // Import js function
    [DllImport("__Internal")]
    private static extern void JS_ErrorOccurred(int code, string message);

    // Maps GameObjects with their correspondend outline component
    private Dictionary<GameObject, cakeslice.Outline> outlineComponents = new Dictionary<GameObject, cakeslice.Outline>();

    // Outlines a gameobject
    // possible color strings: red, deep-orange, light-green, cyan
    public void setOutline(GameObject objectToOutline, string colorName) {
        int colorCode = this.ColorNameToCode(colorName);
        if (colorCode < 0) {
            // Wrong color string
            JS_ErrorOccurred(404, "Could not find color " + colorName);
            return;
        }
        if (outlineComponents.ContainsKey(objectToOutline)) {
            // Object is already outlined -> Just change color
            outlineComponents[objectToOutline].color = colorCode;
        }
        else {
            // create new outline component
            cakeslice.Outline outlineComponent = objectToOutline.AddComponent<cakeslice.Outline>();
            outlineComponent.color = colorCode;
            outlineComponents.Add(objectToOutline, outlineComponent);
        }
    }

    // Removes the outline of an gameObject
    public void RemoveOutline(GameObject outlinedObject) {
        if (!outlineComponents.ContainsKey(outlinedObject)) {
            // Error: Object is not outlined
            return;
        }
        Destroy(outlineComponents[outlinedObject]);
        outlineComponents.Remove(outlinedObject);
    }

    // Removes outlines of all gameObjects
    public void RemoveAllOutlines() {
        GameObject[] keyObjects = outlineComponents.Keys.ToArray();
        foreach (GameObject keyObject in keyObjects) {
            this.RemoveOutline(keyObject);
        }
    }

    // returns the matching color number of the outline colors for a given color name
    // returns -1 if the color name was not found
    // possible color strings: red, deep-orange, light-green, cyan
    private int ColorNameToCode(string colorName) {
        switch (colorName) {
            case "red":
                return 0;
            case "light-green":
                return 1;
            case "deep-orange":
                return 2;
            case "cyan":
                return 3;
            default:
                return -1;
        }
    }
}
