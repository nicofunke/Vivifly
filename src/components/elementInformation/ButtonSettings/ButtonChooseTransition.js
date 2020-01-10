import React from 'react'
import { MDBIcon, MDBBtn } from 'mdbreact'

// TODO: Somewhere here it should be possible to choose new situation
export default function ButtonChooseTransition(props) {
    return <>
        <p>Pushing a button leads to a new situation, e.g. lights turned on or off.</p>
        <p>Where should this button lead to?</p>
        <div className="row">
            <div className="col-6 px-2">
                <MDBBtn color="success" className="d-flex align-items-center"
                    onClick={props.newSituationButtonClicked}>
                    <MDBIcon icon="plus-square" size="lg" />
                    <div className="d-inline-block ml-2">New Situation</div>
                </MDBBtn>
            </div>
            <div className="col-6 px-2">
                <MDBBtn color="info" className="d-flex align-items-center"
                    disabled={props.existingSituationButtonDisabled}
                    onClick={props.existingSituationButtonClicked}>
                    <MDBIcon icon="random" size="lg" />
                    <div className="d-inline-block ml-2">Existing Situation</div>
                </MDBBtn>
            </div>
        </div>
    </>
}