import React from 'react'
import { MDBBtn, MDBCardText,MDBBtnGroup } from 'mdbreact'

class ElementTypePicker extends React.Component {

    render() {
        return (
            <>
                <MDBCardText>
                    What kind of element is this?
            </MDBCardText>
                <MDBBtnGroup>
                    <MDBBtn color="info" >Button</MDBBtn>
                    <MDBBtn color="secondary">Light</MDBBtn>
                    <MDBBtn >Display</MDBBtn>
                </MDBBtnGroup>
            </>
        )
    }
}

export default ElementTypePicker