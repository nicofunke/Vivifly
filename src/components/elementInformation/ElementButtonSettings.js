import React, { Component } from 'react'
import { MDBBtn, MDBIcon } from "mdbreact"

export default class ElementButtonSettings extends Component {

    render() {
        return <>
            <button type="button"
                className="btn btn-link btn-sm p-0 text-default"
                onClick={() => this.props.removeElementType(this.props.element,"Button")}>
                <MDBIcon icon="angle-left" /> This is no button
            </button>
            <h5 className="light-green-text"><MDBIcon icon="fingerprint" className="mr-1" /> Button </h5>
            <p>Pushing a button leads to a new situation, e.g. lights turned on or off.</p>
            <p>Where should this button lead to?</p>
            <div className="row">
                <div className="col-6 px-2">
                    <MDBBtn color="success" className="d-flex align-items-center">
                        <MDBIcon icon="plus-square" size="lg" />
                        <div className="d-inline-block ml-2">New Situation</div>
                    </MDBBtn>
                </div>
                <div className="col-6 px-2">
                    <MDBBtn color="info" className="d-flex align-items-center">
                        <MDBIcon icon="random" size="lg" />
                        <div className="d-inline-block ml-2">Existing Situation</div>
                    </MDBBtn>
                </div>
            </div>
        </>
    }
}