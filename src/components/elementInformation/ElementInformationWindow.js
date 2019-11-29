import React from 'react'
import { MDBCard, MDBCardBody, MDBCardTitle } from 'mdbreact'
import ElementTypePicker from './ElementTypePicker'

class ElementInformation extends React.Component {

    render() {
        if( !this.props.element.name || this.props.element.name === "") {
            return (null)
        }
        return (
            <div className="window-upper-right">
                <MDBCard>
                    <MDBCardBody>
                        <MDBCardTitle>{this.props.element.name}</MDBCardTitle>
                        <ElementTypePicker/>
                    </MDBCardBody>
                </MDBCard>
            </div>
        )
    }
}

export default ElementInformation