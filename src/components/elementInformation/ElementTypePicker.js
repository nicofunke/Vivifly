import React from 'react'
import { MDBBtn, MDBCardText,MDBBtnGroup, MDBIcon } from 'mdbreact'

class ElementTypePicker extends React.Component {

    render() {
        return (
            <>
                <MDBCardText>
                    What kind of element is this?
            </MDBCardText>
                <MDBBtnGroup>
                    <MDBBtn color="info" onClick={() => this.props.setElementType(this.props.element.name, "button")}><MDBIcon icon="fingerprint" />Button</MDBBtn>
                    <MDBBtn color="secondary" onClick={() => this.props.setElementType(this.props.element.name, "light")}><MDBIcon icon="lightbulb" />Light</MDBBtn>
                    <MDBBtn onClick={() => this.props.setElementType(this.props.element.name, "display")}><MDBIcon icon="tv" />Display</MDBBtn>
                </MDBBtnGroup>
            </>
        )
    }
}

export default ElementTypePicker