using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

// Free cam taken from https://gist.github.com/ashleydavis/f025c03a9221bc840a2b

/// <summary>
/// A simple free camera to be added to a Unity game object.
/// 
/// Keys:
///	wasd / arrows	- movement
///	q/e 			- up/down (local space)
///	r/f 			- up/down (world space)
///	pageup/pagedown	- up/down (world space)
///	hold shift		- enable fast movement mode
///	right mouse  	- enable free look
///	mouse			- free look / rotation
///     
/// </summary>
public class CameraController : MonoBehaviour {
    /// <summary>
    /// Normal speed of camera movement.
    /// </summary>
    public float movementSpeed = 10f;

    /// <summary>
    /// Speed of camera movement when shift is held down,
    /// </summary>
    public float fastMovementSpeed = 100f;

    /// <summary>
    /// Sensitivity for free look.
    /// </summary>
    public float freeLookSensitivity = 3f;

    /// <summary>
    /// Amount to zoom the camera when using the mouse wheel.
    /// </summary>
    public float zoomSensitivity = 10f;

    /// <summary>
    /// Amount to zoom the camera when using the mouse wheel (fast mode).
    /// </summary>
    public float fastZoomSensitivity = 50f;

    /// <summary>
    /// Set to true when free looking (on right mouse button).
    /// </summary>
    private bool looking = false;

    // Varibales to start and stop movement
    private bool moveForwards = false;
    private bool moveBackwards = false;
    private bool moveLeft = false;
    private bool moveRight = false;

    // Listens to keyboards and mouse events and calls necessary camera movement functions
    void Update() {
        var fastMode = Input.GetKey(KeyCode.LeftShift) || Input.GetKey(KeyCode.RightShift);
        var movementSpeed = fastMode ? this.fastMovementSpeed : this.movementSpeed;

        // Key down events
        if (Input.GetKeyDown(KeyCode.A) || Input.GetKeyDown(KeyCode.LeftArrow)) {
            this.startMoving("left");
        }

        if (Input.GetKeyDown(KeyCode.D) || Input.GetKeyDown(KeyCode.RightArrow)) {
            this.startMoving("right");
        }

        if (Input.GetKeyDown(KeyCode.W) || Input.GetKeyDown(KeyCode.UpArrow)) {
            this.startMoving("forwards");
        }

        if (Input.GetKeyDown(KeyCode.S) || Input.GetKeyDown(KeyCode.DownArrow)) {
            this.startMoving("backwards");
        }

        // Key up events
        if (Input.GetKeyUp(KeyCode.A) || Input.GetKeyUp(KeyCode.LeftArrow)) {
            this.stopMoving("left");
        }

        if (Input.GetKeyUp(KeyCode.D) || Input.GetKeyUp(KeyCode.RightArrow)) {
            this.stopMoving("right");
        }

        if (Input.GetKeyUp(KeyCode.W) || Input.GetKeyUp(KeyCode.UpArrow)) {
            this.stopMoving("forwards");
        }

        if (Input.GetKeyUp(KeyCode.S) || Input.GetKeyUp(KeyCode.DownArrow)) {
            this.stopMoving("backwards");
        }

        // Camera Movement
        if (moveLeft) {
            transform.position = transform.position + (-transform.right * movementSpeed * Time.deltaTime);
        }

        if (moveRight) {
            transform.position = transform.position + (transform.right * movementSpeed * Time.deltaTime);
        }

        if (moveForwards) {
            transform.position = transform.position + (transform.forward * movementSpeed * Time.deltaTime);
        }

        if (moveBackwards) {
            transform.position = transform.position + (-transform.forward * movementSpeed * Time.deltaTime);
        }

        // Mouse events
        if (looking) {
            float newRotationX = transform.localEulerAngles.y + Input.GetAxis("Mouse X") * freeLookSensitivity;
            float newRotationY = transform.localEulerAngles.x - Input.GetAxis("Mouse Y") * freeLookSensitivity;
            transform.localEulerAngles = new Vector3(newRotationY, newRotationX, 0f);
        }

        float axis = Input.GetAxis("Mouse ScrollWheel");
        if (axis != 0) {
            var zoomSensitivity = fastMode ? this.fastZoomSensitivity : this.zoomSensitivity;
            transform.position = transform.position + transform.forward * axis * zoomSensitivity;
        }

        if (Input.GetKeyDown(KeyCode.Mouse1)) {
            StartLooking();
        }
        else if (Input.GetKeyUp(KeyCode.Mouse1)) {
            StopLooking();
        }
    }

    // Start moving camera in the direction that is given as string
    // possible strings: forwards, backwards, left, right
    public void startMoving(string direction) {
        switch (direction) {
            case "forwards":
                moveForwards = true;
                transform.position = transform.position + (transform.forward * movementSpeed * Time.deltaTime);
                break;
            case "backwards":
                moveBackwards = true;
                transform.position = transform.position + (-transform.forward * movementSpeed * Time.deltaTime);
                break;
            case "left":
                moveLeft = true;
                transform.position = transform.position + (-transform.right * movementSpeed * Time.deltaTime);
                break;
            case "right":
                moveRight = true;
                transform.position = transform.position + (transform.right * movementSpeed * Time.deltaTime);
                break;
            default:
                return;
        }
    }

    // Stop movement of camera in the direction that is given as string
    // possible strings: forwards, backwards, left, right
    public void stopMoving(string direction) {
        switch (direction) {
            case "forwards":
                moveForwards = false;
                break;
            case "backwards":
                moveBackwards = false;
                break;
            case "left":
                moveLeft = false;
                break;
            case "right":
                moveRight = false;
                break;
            default:
                return;
        }
    }

    // Stops movement and looking
    void OnDisable() {
        StopLooking();
        StopAllMovement();
    }


    // Enable free looking.
    public void StartLooking() {
        looking = true;
        //Cursor.visible = false;
        //Cursor.lockState = CursorLockMode.Locked;
    }

    // Disable free looking.
    public void StopLooking() {
        looking = false;
        //Cursor.visible = true;
        //Cursor.lockState = CursorLockMode.None;
    }

    // Stop looking and all movements of the camera
    public void StopAllMovement() {
        StopLooking();
        moveRight = false;
        moveLeft = false;
        moveForwards = false;
        moveBackwards = false;
    }
}