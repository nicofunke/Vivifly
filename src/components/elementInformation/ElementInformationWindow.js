import React, { Component } from 'react'
import { MDBCard, MDBCardBody, MDBCardTitle, MDBIcon } from 'mdbreact'
import ElementTypePicker from './ElementTypePicker'
import ElementButtonSettings from './ElementButtonSettings'
import ElementDisplaySettings from './ElementDisplaySettings'
import ElementLightSettings from './ElementLightSettings'

export default class ElementInformationWindow extends Component {
    render() {
        if (!this.props.element.name || this.props.element.name === "") {
            return (null)
        }
        return (<>
            <div className="window-upper-right">
                <MDBCard>
                    <MDBCardBody>
                        <div className="d-flex justify-content-end"><span onClick={() => this.props.setSelectedElement("")} className="cursor-pointer"><MDBIcon icon="times" /></span></div>
                        <MDBCardTitle>{this.props.element.name}</MDBCardTitle>
                        <ElementSettings element={this.props.element} setSelectedElement={this.props.setSelectedElement} setElementType={this.props.setElementType}/>
                    </MDBCardBody>
                </MDBCard>
            </div>
        </>
        )
    }
}

function ElementSettings(props) {
    if (!props.element.type) {
        return <ElementTypePicker element={props.element} setElementType={props.setElementType}/>
    }
    switch (props.element.type) {
        case "button":
            return <ElementButtonSettings />
        case "display":
            return <ElementDisplaySettings />
        case "light":
            return <ElementLightSettings />
        default:
            return <>ERROR</>
    }
}
