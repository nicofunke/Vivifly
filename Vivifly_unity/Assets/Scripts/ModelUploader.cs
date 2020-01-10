using System.Collections;
using System.Collections.Generic;
using Dummiesman;
using System.IO;
using System.Text;
using UnityEngine;
using System.Runtime.InteropServices;
using UnityEngine.Networking;


public class ModelUploader : MonoBehaviour {

    // Import js function
    [DllImport("__Internal")]
    private static extern void JS_ErrorOccurred(int code, string message);

    // Start is called before the first frame update
    void Start() {
        // DEBUG: Upload CoffeeMachine on start
        // this.UploadURLObject("https://user.informatik.uni-goettingen.de/~nico.funke/CoffeeMakerCord_OBJ.obj");
    }

    // Adds a MeshCollider to all child GameObject
    // in order to make all parts of the uploaded object clickable
    // (Should be called everytime after adding an a model
    void AddColliderToChildren() {
        Transform[] children;
        children = this.GetComponentsInChildren<Transform>();
        foreach (Transform child in children) {
            child.gameObject.AddComponent<MeshCollider>();
        }
    }

    // Uploads an object from the local file system and appends it as a child to the current object
    // Calls AddColliderToChildren afterwards
    // (Does not work as WebGL)
    public void UploadLocalObject(string path) {

        string objPath = path;
        string error = string.Empty;
        GameObject loadedObject;
        if (!File.Exists(objPath)) {
            JS_ErrorOccurred(404, "File does not exist: " + path);
        }
        else {
            loadedObject = new OBJLoader().Load(objPath);
            loadedObject.transform.SetParent(this.transform);
            this.AddColliderToChildren();
        }
    }

    // Uploads an object from URL and appends it as a child to the current object
    // Calls AddColliderToChildren afterwards
    // (Is currently not used by frontend because it would require storing models on the server)
    public void UploadURLObject(string url) {
        StartCoroutine(GetText(url));
    }

    // Coroutine for loading a model by URL
    // (Gets called by UploadURLObject)
    // FROM https://answers.unity.com/questions/1432968/unitywebrequest-response-to-stream.html
    IEnumerator GetText(string url) {
        using (UnityWebRequest www = UnityWebRequest.Get(url)) {
            yield return www.SendWebRequest();
            if (www.isNetworkError || www.isHttpError) {
                Debug.Log(www.error);
            }
            else {
                byte[] results = www.downloadHandler.data;
                using (var textStream = new MemoryStream(results)) {
                    var loadedObject = new OBJLoader().Load(textStream);
                    loadedObject.transform.SetParent(this.transform);
                    this.AddColliderToChildren();
                }
            }
        }
    }

    // Uploads an object that is given as a string and appends it as a child to the current object
    // Calls AddColliderToChildren afterwards
    // (Currently used method by frontend because it does not require stroing additional files on the server)
    public void UploadFromString(string fileContent) {
        byte[] byteArray = Encoding.ASCII.GetBytes(fileContent);
        MemoryStream stream = new MemoryStream(byteArray);
        var loadedObject = new OBJLoader().Load(stream);
        loadedObject.transform.SetParent(this.transform);
        this.AddColliderToChildren();
    }

    // Update is called once per frame
    void Update() {

    }
}
