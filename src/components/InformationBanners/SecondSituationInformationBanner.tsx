import React from 'react'
import { MDBCardTitle, MDBCardText, MDBIcon } from 'mdbreact'
import InformationBanner from './InformationBanner'

/**
 * Information banner that gets displayed after creating the second new situation
 */
export default class SecondSituationInformationBanner extends React.Component {
    render() {
        return <>
            <InformationBanner>
                <div className="row align-items-center">
                    <div className="col-3">
                        <h1 className="display-4">
                            <span role="img" aria-label="Yeah!">🥳</span>
                        </h1>
                    </div>
                    <div className="col-9">
                        <MDBCardTitle>Your model gets better and better!</MDBCardTitle>
                        <MDBCardText>
                            Did you know you can also add time-based changes by clicking on
                            <MDBIcon icon="ellipsis-v" className="mx-1" />
                            ?
                        </MDBCardText>
                    </div>
                </div>
            </InformationBanner>
        </>
    }
}