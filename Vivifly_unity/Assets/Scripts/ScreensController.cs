using de.ugoe.cs.vivian.core;
using System;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

public class ScreensController : MonoBehaviour {

    // Maps the name of gameObjects with their correspondend screen GameObject if exist
    private Dictionary<string, GameObject> screenObjects = new Dictionary<string, GameObject>();

    /**
     * Displays an image given in base64 on a certain plane of a gameobject
     **/
    public void displayImage(string gameObjectName, string base64Image, Vector3 plane) {
        // Convert base64 string to Texture2D 
        byte[] byteBase64 = Convert.FromBase64String(base64Image);
        Texture2D imageTexture = new Texture2D(1, 1);
        imageTexture.LoadImage(byteBase64);

        // Call method with Texture2D
        displayImage(gameObjectName, imageTexture, plane);
    }

    /**
     * Displays an image given as Texture2D on a certain plane of a gameobject
     **/
    public void displayImage(string gameObjectName, Texture2D imageTexture, Vector3 plane) {
        // If exists remove previous screen effects
        if (screenObjects.ContainsKey(gameObjectName)) {
            this.RemoveScreenEffect(gameObjectName);
        }

        // Create new screen effect
        Vector2 resolution = new Vector2(1, 10);
        ScreenSpec elementSpec = new ScreenSpec(gameObjectName, plane, resolution, false);
        GameObject screenObject = VirtualPrototype.CreateVisualizationElement(elementSpec, null);
        screenObject.GetComponent<ScreenElement>().Visualize(imageTexture);

        // Store screen effect in mapping
        this.screenObjects.Add(gameObjectName, screenObject);

    }

    /**
     * Removes the screen effect of a certain GameObject
     * **/
    public void RemoveScreenEffect(string gameObjectName) {
        // stop if no screen effect exists
        if (!screenObjects.ContainsKey(gameObjectName)) {
            return;
        }

        // Remove screen effect
        Destroy(screenObjects[gameObjectName]);

        // Remove from mapping
        screenObjects.Remove(gameObjectName);
    }

    /**
     * Removes all current screen effects 
     **/
    public void RemoveAllScreenEffects() {
        string[] keyObjects = screenObjects.Keys.ToArray();
        foreach (string gameObjectName in keyObjects) {
            this.RemoveScreenEffect(gameObjectName);
        }
    }
}