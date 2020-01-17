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

# Interface notes

- colors for each element type
- states -> Situations