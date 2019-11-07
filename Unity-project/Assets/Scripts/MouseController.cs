using System.Collections;
using System.Collections.Generic;
using UnityEngine;

// Simple click listener
public class MouseController : MonoBehaviour {

    private HighlightController highlighter;

    // Initializes the highlighter
    void Start() {
        highlighter = FindObjectOfType<HighlightController>();
        WebGLInput.captureAllKeyboardInput = false;
    }

    // Checks if the left mouse button is clicked and highlights the clicked object
    void Update() {
        if (Input.GetMouseButtonDown(0)) {
            RaycastHit hit;
            Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
            Debug.Log("Raycast fire!");
            if (Physics.Raycast(ray, out hit, 100.0f)) {
                Debug.Log("Hit something!");
                if (hit.transform) {
                    highlighter.HighlightGameObject(hit.transform.gameObject);
                }
            } else {
                Debug.Log("Found nothing");
            }
        }
    }
}
