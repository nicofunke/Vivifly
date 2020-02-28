using UnityEngine;
using System.Runtime.InteropServices;
using TriLib;
using System;

public class ModelUploader : MonoBehaviour {

    // Import TriLib js functions
    [DllImport("__Internal")]
    private static extern IntPtr TriLibGetBrowserFileName(int index);
    [DllImport("__Internal")]
    private static extern IntPtr TriLibGetBrowserFileData(int index);
    [DllImport("__Internal")]
    private static extern void TriLibFreeMemory(IntPtr pointer);
    [DllImport("__Internal")]
    private static extern int TriLibGetBrowserFileLength(int index);


    /// <summary>
    /// Adds a MeshCollider to all child GameObject
    /// in order to make all parts of the uploaded object clickable
    /// (Should be called everytime after adding an a model)
    /// </summary>
    void AddColliderToChildren() {
        Transform[] children;
        children = this.GetComponentsInChildren<Transform>();
        foreach (Transform child in children) {
            child.gameObject.AddComponent<MeshCollider>();
        }
    }

    /// <summary>
    /// Gets the file data from js window and loads the model into the scene
    /// </summary>
    public void StartTriLibUpload() {
        using (var assetLoader = new AssetLoader()) {
            var assetLoaderOptions = AssetLoaderOptions.CreateInstance();
            // Scale down model, since trilib loads it way too big
            assetLoaderOptions.Scale = 0.09f;
            assetLoaderOptions.UseOriginalPositionRotationAndScale = true;
            var data = this.GetBrowserFileData(0);
            var name = this.GetBrowserFileName(0);
            var myGameObject = assetLoader.LoadFromMemory(data, name, assetLoaderOptions, this.gameObject);
            this.AddColliderToChildren();
        }
    }

    // ============== TriLib methods =============
    /// <summary>
    /// Gets the registered browser file name by index.
    /// </summary>
    /// <param name="index">Browser file index.</param>
    /// <returns>Browser file name.</returns>
    public string GetBrowserFileName(int index) {
        var pointer = TriLibGetBrowserFileName(index);
        var fileName = Marshal.PtrToStringAuto(pointer);
        TriLibFreeMemory(pointer);
        return fileName;
    }

    /// <summary>
    /// Gets the registered browser file byte data by index.
    /// </summary>
    /// <param name="index">Browser file index.</param>
    /// <returns>Browser file byte data.</returns>
    public byte[] GetBrowserFileData(int index) {
        var pointer = TriLibGetBrowserFileData(index);
        if (pointer == IntPtr.Zero) {
            return null;
        }
        var length = TriLibGetBrowserFileLength(index);
        var data = new byte[length];
        Marshal.Copy(pointer, data, 0, length);
        TriLibFreeMemory(pointer);
        return data;
    }
}
