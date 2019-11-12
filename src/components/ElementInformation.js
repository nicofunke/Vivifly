import React from 'react'
import { MDBCard, MDBCardBody, MDBCardText, MDBCardTitle, MDBBtn } from 'mdbreact'

class ElementInformation extends React.Component {

    render() {
        return (
            <div style={{ position: "absolute", top: 20, right: 20, maxWidth: "30vw" }}>
                <MDBCard>
                    <MDBCardBody>
                        <MDBCardTitle>{ this.props.elementName }</MDBCardTitle>
                        <MDBCardText>
                            Some quick example text to build on the card title and make
                            up the bulk of the card&apos;s content.
                        </MDBCardText>
                        <MDBBtn href="#">Do something</MDBBtn>
                    </MDBCardBody>
                </MDBCard>
            </div>
        )
    }
}

export default ElementInformation