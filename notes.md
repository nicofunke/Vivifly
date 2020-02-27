# Develop notes

- Unity WebGL only for feedback, without any logic 
  - React handles the logical part, with its 
- see architecture sketches
- In order to click elements every child gets meshcollider
- Using light function from Vivian
- Integrating WebGL in React with library
- Uploading model by converting file to string
  - Asset from assetstore
  - Using file from local file system does not work
  - using a file from link would require to upload the file beforehand
  - sendMessage to unity does not support other types than primitive datatypes (no sending file directly) 
  - Replaced by TriLib with window vairables
- Problem with lights/highlights:
  - Communication from React to WebGL only allows primitive datatypes 
  - It is necessary to send element name and color at least
  - Solution: Send JSON string and parse it in unity
- Highlighting: Asset
- Appprovicder(state) -> UnityWrapper
- Access Lighteffect and Displayeffect of vivian framework
- Typescript

# Interface notes

- colors for each element type
- states -> Situations
- timeout -> time-based change
- screen -> display

# Changes on Vivian Framework
- ScreenElement Rotate and movement exchanged and rotation inverted
- Visualize method public
- VirtualPrototype.CreateVisualizationElement made public and static
- ScreenElement Visualize extended with Texture2D params
- Screenspec constructor public
- LightSpec constructor public
- Light colors situation specific are not yet supported


# Export steps
- situationID -> Name
- start situation
- 
-------
- in Tests sollten alle Funktionalitäten geprüft werden
