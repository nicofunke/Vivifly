mergeInto(LibraryManager.library, {

  JS_ObjectClicked: function (itemName, planeX, planeY, planeZ) {
    var nameString = Pointer_stringify(itemName);
    ReactUnityWebGL.objectClicked(nameString, planeX, planeY, planeZ);
  },
  JS_ErrorOccurred: function (code, message) {
    var messageString = Pointer_stringify(message);
    ReactUnityWebGL.catchUnityError(code, messageString);
  }

});