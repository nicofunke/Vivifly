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

    // Maps the name of gameObjects with their correspondend light GameObject if exist
    private Dictionary<string, GameObject> lightObjects = new Dictionary<string, GameObject>();

    // Adds a light effect to an gameObject 
    public void ChangeColor(string gameObjectName, float red, float green, float blue, float alpha) {
        GameObject lightGameObject;
        Color emissionColor = new Color(red, green, blue);
        VisualizationElementSpec visualizationSpec = new LightSpec(gameObjectName, emissionColor);

        // If exists remove previous light effect
        if (lightObjects.ContainsKey(gameObjectName)) {
            this.RemoveLightEffect(gameObjectName);
        }

        // Add new light effect gameObject
        lightGameObject = VirtualPrototype.CreateVisualizationElement(visualizationSpec, null); // Here is a bug?!
        lightGameObject.GetComponent<LightElement>().Visualize(alpha);

        // Store light effect in mapping
        this.lightObjects.Add(gameObjectName, lightGameObject);
    }

    // Removes the light effect of a gameobject
    public void RemoveLightEffect(string gameObjectName) {
        // There is no overlay element -> stop
        if (!lightObjects.ContainsKey(gameObjectName)) {
            return;
        }
        GameObject lightGameObject = lightObjects[gameObjectName];
        lightObjects.Remove(gameObjectName);
        Destroy(lightGameObject);
    }

    // Removes all light gameobjects
    public void RemoveAllLightEffects() {
        string[] keyObjects = lightObjects.Keys.ToArray();
        foreach (string gameObjectName in keyObjects) {
            this.RemoveLightEffect(gameObjectName);
        }
    }
}
