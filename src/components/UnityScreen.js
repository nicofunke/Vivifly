import React from 'react'
import Unity, { UnityContent } from "react-unity-webgl"

class UnityScreen extends React.Component {

    constructor() {
        super()

        this.unityContent = new UnityContent(
            "UnityProject/WebGL-react.json",
            "UnityProject/UnityLoader.js"
        )
        this.state = {
            selectedItemName: undefined
        };
        this.initializeUnityEventListeners()
        this.triggerButton1 = this.triggerButton1.bind(this)
        this.setSelectedItem = this.setSelectedItem.bind(this)
    }

    initializeUnityEventListeners() {
        this.unityContent.on("setSelectedItem", name => {
            this.setSelectedItem(name)
        });
    }

    setSelectedItem(newItemName) {
        this.setState(prevState => {
            return {
                ...prevState,
                selectedItemName: newItemName
            }
        })
    }

    triggerButton1() {
        this.unityContent.send(
            "Highlighter",
            "HighlightObjectByName",
            "Button1"
        )
    }

    render() {
        return (
            <div style={{ width: 500, height: 500 }}>
                <Unity unityContent={this.unityContent} />
                {/* <input type="text" placholder="Test input..." /> */}
                <button onClick={this.triggerButton1}>Trigger Button1</button>
                <div>Currently selected: {this.state.selectedItemName || 'None'} </div>
            </div>
        )
    }
}

export default UnityScreen