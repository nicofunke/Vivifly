mergeInto(LibraryManager.library, {

  JS_ObjectClicked: function (mouseClickJSON) {
    var jsonString = Pointer_stringify(mouseClickJSON);
    ReactUnityWebGL.objectClicked(jsonString);
  },
  JS_ErrorOccurred: function (code, message) {
    var messageString = Pointer_stringify(message);
    ReactUnityWebGL.catchUnityError(code, messageString);
  }

});