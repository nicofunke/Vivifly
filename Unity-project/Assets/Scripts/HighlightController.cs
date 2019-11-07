using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Runtime.InteropServices;


public class HighlightController : MonoBehaviour {

    // To call js function
    [DllImport("__Internal")]
    private static extern void JS_SetSelectItem(string itemName);

    GameObject currentlyHighlighted = null;
    Color originalColor;

    // Highlights the given gameobject
    public void HighlightGameObject(GameObject gameObject) {
        // Restore currently selected object
        if (currentlyHighlighted != null) {
            currentlyHighlighted.GetComponent<Renderer>().material.SetColor("_Color", originalColor);
        }

        // Check if object is a new object
        if (currentlyHighlighted == gameObject) {
            currentlyHighlighted = null;
            JS_SetSelectItem(null);
            return;
        }

        // Highlight new object
        var renderer = gameObject.GetComponent<Renderer>();
        currentlyHighlighted = gameObject;
        originalColor = renderer.material.GetColor("_Color");
        renderer.material.SetColor("_Color", Color.red);
        JS_SetSelectItem(gameObject.name);
    }

    // Finds a gameobject by its name and highlights it
    public void HighlightObjectByName(string objectName) {
        GameObject gameObject = GameObject.Find(objectName);
        if (!gameObject) {
            print("Could not find " + objectName);
            return;
        }
        HighlightGameObject(gameObject);
    }

    // Highlights a button 
    public void HighlighButton(int buttonNumber) {
        HighlightObjectByName("Button" + buttonNumber);
    }




}
