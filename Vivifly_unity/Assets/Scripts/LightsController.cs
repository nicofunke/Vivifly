using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Runtime.InteropServices;
using System.Linq;

using de.ugoe.cs.vivian.core;
public class LightsController : MonoBehaviour {

    /// <summary>
    /// Maps the name of gameObjects with their correspondend light GameObject if exist
    /// </summary>
    private Dictionary<string, GameObject> lightObjects = new Dictionary<string, GameObject>();

    /// <summary>
    /// Adds a light effect to an gameObject 
    /// </summary>
    /// <param name="gameObjectName">Name of the gameObject</param>
    /// <param name="red"> Red value from 0-1</param>
    /// <param name="green">Green value from 0-1</param>
    /// <param name="blue">Blue value from 0-1</param>
    /// <param name="alpha">Alpha value</param>
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

    /// <summary>
    /// Removes the light effect of a gameobject
    /// </summary>
    /// <param name="gameObjectName">Name of the gameObject</param>
    public void RemoveLightEffect(string gameObjectName) {
        // There is no overlay element -> stop
        if (!lightObjects.ContainsKey(gameObjectName)) {
            return;
        }
        GameObject lightGameObject = lightObjects[gameObjectName];
        lightObjects.Remove(gameObjectName);
        Destroy(lightGameObject);
    }

    /// <summary>
    /// Removes all light gameobjects
    /// </summary>
    public void RemoveAllLightEffects() {
        string[] keyObjects = lightObjects.Keys.ToArray();
        foreach (string gameObjectName in keyObjects) {
            this.RemoveLightEffect(gameObjectName);
        }
    }
}
