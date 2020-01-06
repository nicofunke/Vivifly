mergeInto(LibraryManager.library, {

  JS_ObjectClicked: function (itemName) {
    var nameString = Pointer_stringify(itemName);
    ReactUnityWebGL.objectClicked(nameString);
  },
  JS_ErrorOccurred: function (code, message) {
    var messageString = Pointer_stringify(message);
    ReactUnityWebGL.catchUnityError(code, messageString);
  }

});