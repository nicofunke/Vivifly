using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Runtime.InteropServices;
using System.Linq;

public class OutlineController : MonoBehaviour {

    /// <summary>
    /// Maps GameObjects with their correspondend outline component
    /// </summary>
    private Dictionary<GameObject, cakeslice.Outline> outlineComponents = new Dictionary<GameObject, cakeslice.Outline>();

    /// <summary>
    /// Outlines a gameobject
    /// </summary>
    /// <param name="objectToOutline">GameObject that should be outlined</param>
    /// <param name="colorName">red, deep-orange, light-green or cyan</param>
    public void setOutline(GameObject objectToOutline, string colorName) {
        int colorCode = this.ColorNameToCode(colorName);

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

    /// <summary>
    /// Removes the outline of an gameObject
    /// </summary>
    /// <param name="outlinedObject">Outlined GameObject</param>
    public void RemoveOutline(GameObject outlinedObject) {
        if (!outlineComponents.ContainsKey(outlinedObject)) {
            // Error: Object is not outlined
            return;
        }
        Destroy(outlineComponents[outlinedObject]);
        outlineComponents.Remove(outlinedObject);
    }

    /// <summary>
    /// Removes outlines of all gameObjects
    /// </summary>
    public void RemoveAllOutlines() {
        GameObject[] keyObjects = outlineComponents.Keys.ToArray();
        foreach (GameObject keyObject in keyObjects) {
            this.RemoveOutline(keyObject);
        }
    }

    /// <summary>
    /// returns the matching color number of the outline colors for a given color name or -1 if the color does not exist
    /// </summary>
    /// <param name="colorName">red, deep-orange, light-green or cyan</param>
    /// <returns></returns>
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
