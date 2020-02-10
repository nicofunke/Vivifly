import React from 'react'
import { MDBBtn, MDBCardText, MDBBtnGroup, MDBIcon } from 'mdbreact'
import { AppContext } from '../Application/AppContext'

export default class ElementTypePicker extends React.Component {

    render() {
        return <>
            <MDBCardText>
                What kind of element is this?
            </MDBCardText>
            <MDBBtnGroup>
                <MDBBtn color="light-green" onClick={() => this.context.addElementType(this.context.applicationState.selectedElement, "Button")} >
                    <div className="mb-2"><MDBIcon icon="fingerprint" size="lg" /></div>
                    <div>Button</div>
                </MDBBtn>
                <MDBBtn color="deep-orange" onClick={() => this.context.addElementType(this.context.applicationState.selectedElement, "Light")}>
                    <div className="mb-2"><MDBIcon icon="lightbulb" size="lg" /></div>
                    <div>Light</div>
                </MDBBtn>
                <MDBBtn color="cyan" onClick={() => this.context.addElementType(this.context.applicationState.selectedElement, "Screen")}>
                    <div className="mb-2"><MDBIcon icon="tv" size="lg" /></div>
                    <div>Display</div>
                </MDBBtn>
            </MDBBtnGroup>
        </>
    }
}

ElementTypePicker.contextType = AppContext