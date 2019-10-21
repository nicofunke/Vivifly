import React from 'react'
import Unity, { UnityContent } from "react-unity-webgl"
// import { MDBBtn } from "mdbreact";
import { MDBCard, MDBCardBody, MDBCardText, MDBCardHeader, MDBBtn } from "mdbreact";


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
            <MDBCard>
                <MDBCardHeader color="special-color">3D-View</MDBCardHeader>
                <MDBCardBody className="p-0">
                    <MDBCardText>
                        <Unity unityContent={this.unityContent} />
                        <MDBBtn color="primary" onClick={this.triggerButton1}>Trigger Button1</MDBBtn>
                        <div>Currently selected: {this.state.selectedItemName || 'None'} </div>
                    </MDBCardText>
                </MDBCardBody>
            </MDBCard>

        )
    }
}

export default UnityScreen