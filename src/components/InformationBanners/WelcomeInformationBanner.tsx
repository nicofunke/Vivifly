import React from 'react'
import { MDBCardTitle, MDBCardText } from 'mdbreact'
import InformationBanner from './InformationBanner'

/**
 * Information banner that is displayed after starting the app
 */
export default class WelcomeInformationBanner extends React.Component {
    render() {
        return <>
            <InformationBanner>
                <div className="row align-items-center">
                    <div className="col-3">
                        <h1 className="display-4">
                            <span role="img" aria-label="Hello">👋</span>
                        </h1>
                    </div>
                    <div className="col-9">
                        <MDBCardTitle>Welcome!</MDBCardTitle>
                        <MDBCardText>Start by clicking on an element you want to add an effect to</MDBCardText>
                    </div>
                </div>
            </InformationBanner>
        </>
    }
}
