mergeInto(LibraryManager.library, {

  JS_SetSelectItem: function (itemName) {
    var nameString = Pointer_stringify(itemName);
    ReactUnityWebGL.setSelectedItem(nameString);
  },

  JS_Test: function () {
    console.log("Test function called!");
  }

});