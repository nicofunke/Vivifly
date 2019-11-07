using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ModelUploader : MonoBehaviour {
    public GameObject UploadContainer;

    // Start is called before the first frame update
    void Start() {
        this.AddColliderToChildren();
    }

    // Adds a MeshCollider to all child GameObject
    // in order to make all parts of the uploaded object clickable
    void AddColliderToChildren() {
        Transform[] children;
        children = this.UploadContainer.GetComponentsInChildren<Transform>();
        foreach (Transform child in children) {
            child.gameObject.AddComponent<MeshCollider>();
        }
    }

    // Update is called once per frame
    void Update() {

    }
}
