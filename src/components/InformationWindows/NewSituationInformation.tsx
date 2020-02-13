import React from 'react'
import { MDBCardTitle, MDBCardText } from 'mdbreact'
import InformationWindow from './InformationWindow'

export default class NewSituationInformation extends React.Component {
    render() {
        return <>
            <InformationWindow>
                <div className="row align-items-center">
                    <div className="col-3">
                        <h1 className="display-4">
                            <span role="img" aria-label="Congratulations">🎉</span>
                        </h1>
                    </div>
                    <div className="col-9">
                        <MDBCardTitle>You created a new Situation!</MDBCardTitle>
                        <MDBCardText>
                            You can now change the appearance of this situation by
                            clicking on an element and choosing effects like light or display
                        </MDBCardText>
                    </div>
                </div>
            </InformationWindow>
        </>
    }
}