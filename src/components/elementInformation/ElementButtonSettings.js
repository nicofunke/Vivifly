import React, { Component } from 'react'
import { MDBBtn, MDBIcon } from "mdbreact"

export default class ElementButtonSettings extends Component {

    /**
     * Function that gets called if the new situation button is pressed
     * Creates a new situation and sets a transition from the current button to this situation
     * Since the situation is created without a name it will open a popup to give it a name
     */
    newSituationButtonClicked(){
        const newSituationID = this.props.createNewSituation("")
        this.props.setCurrentSituation(newSituationID)
        this.props.setSelectedElement("")
        // TODO: Add transition
    }

    render() {
        return <>
            <button type="button"
                className="btn btn-link btn-sm p-0 text-default"
                onClick={() => this.props.removeElementType(this.props.element, "Button")}>
                <MDBIcon icon="angle-left" /> This is no button
            </button>
            <h5 className="light-green-text"><MDBIcon icon="fingerprint" className="mr-1" /> Button </h5>
            <p>Pushing a button leads to a new situation, e.g. lights turned on or off.</p>
            <p>Where should this button lead to?</p>
            <div className="row">
                <div className="col-6 px-2">
                    <MDBBtn color="success" className="d-flex align-items-center"
                        onClick={this.newSituationButtonClicked.bind(this)}>
                        <MDBIcon icon="plus-square" size="lg" />
                        <div className="d-inline-block ml-2">New Situation</div>
                    </MDBBtn>
                </div>
                <div className="col-6 px-2">
                    <MDBBtn color="info" className="d-flex align-items-center"
                        disabled={!!this.props.states && this.props.states.length <= 1}>
                        <MDBIcon icon="random" size="lg" />
                        <div className="d-inline-block ml-2">Existing Situation</div>
                    </MDBBtn>
                </div>
            </div>
        </>
    }
}