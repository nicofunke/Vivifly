import React from 'react'
import Unity, { UnityContent } from "react-unity-webgl"

class UnityScreen extends React.Component {

    constructor() {
        super()

        this.unityContent = new UnityContent(
            "Build/WebGL.json",
            "Build/UnityLoader.js"
        )
        this.bindMethods()
        this.unityContent.on("objectClicked", name => {
            this.objectClicked(name)
        });
    }

    bindMethods() {
        this.restoreColor = this.restoreColor.bind(this)
        this.changeColor = this.changeColor.bind(this)
        this.objectClicked = this.objectClicked.bind(this)
    }

    objectClicked(clickedElement) {
        if (clickedElement === this.props.selectedElementName) {
            clickedElement = ""
        }
        this.props.setSelectedElement(clickedElement)
    }

    componentDidUpdate(prevProps) {
        this.highLightItem(this.props.selectedElementName)
    }

    highLightItem(itemName) {
        this.unityContent.send(
            "JavascriptApi",
            "HighlightObject",
            itemName
        )
    }

    changeColor(hexColor) {
        this.unityContent.send(
            "JavascriptApi",
            "ChangeColorOfCurrentlyHighlighted",
            hexColor
        )
    }

    restoreColor() {
        this.unityContent.send(
            "JavascriptApi",
            "RestoreColor",
            this.state.selectedItemName
        )
    }

    render() {
        return (
            <div className="position-absolute h-100 w-100 overflow-hidden">
                <div className="position-relative h-100 w-100">
                    <Unity style={{ minHeight: "100vh", minWidth: "100vw" }} unityContent={this.unityContent} />
                </div>
            </div>

        )
    }
}

export default UnityScreen