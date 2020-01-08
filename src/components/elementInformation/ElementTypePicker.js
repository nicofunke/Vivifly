import React from 'react'
import { MDBBtn, MDBCardText, MDBBtnGroup, MDBIcon } from 'mdbreact'

class ElementTypePicker extends React.Component {

    render() {
        return <>
            <MDBCardText>
                What kind of element is this?
            </MDBCardText>
            <MDBBtnGroup>
                <MDBBtn color="light-green" onClick={() => this.props.addElementType(this.props.element, "Button")} >
                    <div className="mb-2"><MDBIcon icon="fingerprint" size="lg" /></div>
                    <div>Button</div>
                </MDBBtn>
                <MDBBtn color="deep-orange" onClick={() => this.props.addElementType(this.props.element, "Light")}>
                    <div className="mb-2"><MDBIcon icon="lightbulb" size="lg" /></div>
                    <div>Light</div>
                </MDBBtn>
                <MDBBtn color="cyan" onClick={() => this.props.setElementType(this.props.element, "Display")}>
                    <div className="mb-2"><MDBIcon icon="tv" size="lg" /></div>
                    <div>Display</div>
                </MDBBtn>
            </MDBBtnGroup>
        </>
    }
}

export default ElementTypePicker