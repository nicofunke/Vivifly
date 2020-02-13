import React from 'react'
import { MDBCard, MDBCardBody } from 'mdbreact';

/**
 * Container class for information windows at the top center of the screen
 */
export default class InformationWindow extends React.Component {
    render() {
        return <>
            <div className="window-top-center popup-overlay">
                <MDBCard>
                    <MDBCardBody>
                        {this.props.children}
                    </MDBCardBody>
                </MDBCard>
            </div>
        </>
    }
}