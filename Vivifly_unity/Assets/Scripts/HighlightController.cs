using System.Collections;
using System.Collections.Generic;
using UnityEngine;


public class HighlightController : MonoBehaviour {

    public GameObject currentlyHighlighted = null;

    // Highlights the given gameobject or no gameObject if null is given
    public void HighlightGameObject(GameObject gameObject) {
        
        // Remove outline from currently selected object
        if (currentlyHighlighted != null) {
            Destroy(currentlyHighlighted.GetComponent<cakeslice.Outline>());
            currentlyHighlighted = null;
        }

        // Highlight new object
        if ( gameObject != null ) {
            currentlyHighlighted = gameObject;
            gameObject.AddComponent<cakeslice.Outline>();
            return;
        }
    }
}
