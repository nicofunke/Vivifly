# Develop notes

- Unity WebGL only for feedback, without any logic 
  - React handles the logical part, with its 
- see architecture sketches
- Using light function from Vivian
- Integrating WebGL in React with library
- Uploading model by converting file to string
  - Asset from assetstore
  - Using file from local file system does not work
  - using a file from link would require to upload the file beforehand
  - sendMessage to unity does not support other types than primitive datatypes (no sending file directly) 
- Problem with lights/highlights:
  - Communication from React to WebGL only allows primitive datatypes
  - It is necessary to send element name and color at least
  - Solution: Send JSON string and parse it in unity
- Highlighting: Asset
- Appprovicder(state) -> UnityWrapper
- Access Lighteffect and Displayeffect of vivian framework
- Screen plane calculation (split raycast)

# Interface notes

- colors for each element type
- states -> Situations

# Changes on Vivian Framework
- ScreenElement Rotate and movement exchanged and rotation inverted
- Visualize method public
- VirtualPrototype.CreateVisualizationElement made public and static
- ScreenElement Visualize extended with Texture2D params
- Screenspec constructor public
- LightSpec constructor public

# Fragen
- ist das ganze public machen in Ordnung?
- ScreenElement Fixes richtig?
- Ändert Resolution nichts?
- Plane gibt allgemeinen Winkel der Plane an, passt sich nicht an Plane des Objects an?
  - Sollte man nur Einheitsvektoren verwenden?


Mögliche Dateiformate: 
stl, fbx (auch in Vivian enthalten), stp (von CAD Software)

Resolution anhand bild