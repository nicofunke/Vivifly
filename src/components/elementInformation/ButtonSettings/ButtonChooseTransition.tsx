import React from 'react'
import { MDBIcon, MDBBtn } from 'mdbreact'

// Type for props
type PropsType = {
    newSituationButtonClicked: () => void,
    existingSituationButtonClicked: () => void
    existingSituationButtonDisabled: boolean
}

/**
 * Component to choose whether the current button should lead to a new situation or an already existing one
 * @param props 
 */
export default function ButtonChooseTransition(props: PropsType) {
    return <>
        <div>Pushing a button leads to a new situation, e.g. lights turned on or off.<br />
            Where should this button lead to?</div>
        <div className="row">
            <div className="col-5 px-2">
                <MDBBtn color="success" className="d-flex align-items-center py-2 px-4 w-100"
                    onClick={props.newSituationButtonClicked}>
                    <MDBIcon icon="plus-square" size="lg" />
                    <div className="d-inline-block ml-3 text-left">New<br />Situation</div>
                </MDBBtn>
            </div>
            <div className="col-5 px-2">
                <MDBBtn color="info" className="d-flex align-items-center py-2 px-4 w-100"
                    disabled={props.existingSituationButtonDisabled}
                    onClick={props.existingSituationButtonClicked}>
                    <MDBIcon icon="random" size="lg" />
                    <div className="d-inline-block ml-3 text-left">Existing<br />Situation</div>
                </MDBBtn>
            </div>
        </div>
    </>
}