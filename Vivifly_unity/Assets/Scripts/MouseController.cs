using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Runtime.InteropServices;


// Simple click listener
public class MouseController : MonoBehaviour {

    // Import js function
    [DllImport("__Internal")]
    private static extern void JS_ObjectClicked(string itemName);

    void Start() {
        WebGLInput.captureAllKeyboardInput = false;
    }

    // Calls Javascript function if left mouse button is pressed
    void Update() {
        // Check for left mouse button
        if (Input.GetMouseButtonDown(0)) {
            RaycastHit hit;
            Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
            string clickedObjectName = null;

            // Check if clicked on an object
            if (Physics.Raycast(ray, out hit, 100.0f)) {
                if (hit.transform) {
                    clickedObjectName = hit.transform.gameObject.name;
                }
            }

            // Send feedback to javascript
            Debug.Log(clickedObjectName);
            JS_ObjectClicked(clickedObjectName);
        }
    }
}
