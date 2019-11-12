import React from 'react'
import Unity, { UnityContent } from "react-unity-webgl"
import ElementInformation from '../ElementInformation';

class UnityScreen extends React.Component {

    constructor() {
        super()

        this.unityContent = new UnityContent(
            "Build/WebGL.json",
            "Build/UnityLoader.js"
        )
        this.state = {
            selectedItemName: undefined
        };
        this.initializeUnityEventListeners()

    }

    initializeUnityEventListeners() {
        this.unityContent.on("objectClicked", name => {
            this.objectClicked(name)
        });
        this.objectClicked = this.objectClicked.bind(this)
    }

    objectClicked(newItemName) {
        if (newItemName === this.state.selectedItemName) {
            newItemName = ""
        }
        this.highLightItem(newItemName)
        this.setState(prevState => {
            return {
                ...prevState,
                selectedItemName: newItemName
            }
        })
    }

    highLightItem(itemName) {
        this.unityContent.send(
            "JavascriptApi",
            "HighlightObject",
            itemName
        )
    }

    informationBox() {
        if (!!this.state.selectedItemName) {
            return (
                <ElementInformation elementName={this.state.selectedItemName} />
            )
        }
    }

    render() {
        return (
            <div className="position-absolute h-100 w-100 overflow-hidden">
                <div className="position-relative h-100 w-100">
                    <Unity style={{ minHeight: "100vh", minWidth: "100vw" }} unityContent={this.unityContent} />
                    {this.informationBox()}
                </div>
            </div>

        )
    }
}

export default UnityScreen