import React, { Component } from 'react'
import { MDBCard, MDBCardBody, MDBCardTitle } from 'mdbreact'
import ElementTypePicker from './ElementTypePicker'

export default class ElementInformation extends Component {
    render() {
        if (!this.props.element.name || this.props.element.name === "") {
            return (null)
        }
        return (
            <div className="window-upper-right">
                <MDBCard>
                    <MDBCardBody>
                        <MDBCardTitle>{this.props.element.name}</MDBCardTitle>
                        <ElementSettings element={this.props.element} />
                    </MDBCardBody>
                </MDBCard>
            </div>
        )
    }
}

function ElementSettings(props) {
    const element = props.element
    if (!element.type) {
        return <ElementTypePicker />
    }
    switch (element.type) {
        case "button":
            return <>Is button</>
        case "display":
            return <>Is display</>
        case "light":
            return <>Is light</>
        default:
            return <>ERROR</>
    }
}
