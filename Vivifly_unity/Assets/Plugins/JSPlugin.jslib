mergeInto(LibraryManager.library, {

  JS_ObjectClicked: function (mouseClickJSON) {
    var jsonString = Pointer_stringify(mouseClickJSON);
    ReactUnityWebGL.objectClicked(jsonString);
  }
});