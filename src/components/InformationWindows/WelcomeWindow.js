import React from 'react'
import { MDBCard, MDBCardBody, MDBCardTitle } from 'mdbreact'

export default class WelcomeWindow extends React.Component {
    render() {
        if (!this.props.applicationState || this.props.applicationState.hasAlreadySelectedAnElement) {
            return null
        }
        return <>
            <div className="window-top-center popup-overlay">
                <MDBCard>
                    <MDBCardBody>
                        <div className="row align-items-center">
                            <div className="col-3">
                                <h1 className="display-4">
                                    <span role="img" aria-label="party">🎉</span>
                                </h1>
                            </div>
                            <div className="col-9">
                                <MDBCardTitle className="col-10">Welcome!</MDBCardTitle>
                                <p>Start by clicking on an element you want to add an effect to</p>
                            </div>
                        </div>
                    </MDBCardBody>
                </MDBCard>
            </div>
        </>
    }
}