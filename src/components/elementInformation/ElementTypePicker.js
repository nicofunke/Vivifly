import React from 'react'
import { MDBIcon } from 'mdbreact'
import { AppContext } from '../Application/AppContext'

export default class ElementTypePicker extends React.Component {

    render() {
        return <>
            <div className="row">
                <div className="col-1">

                </div>
                <div className="col-11 card-text">
                    <p>
                        What kind of element is this?
                    </p>
                    <div className="row">
                        <div className="col-3 d-flex flex-column align-items-center justify-content-center cursor-pointer element-type-button"
                            onClick={() => this.context.addElementType(this.context.applicationState.selectedElement, "Button")}>
                            <div className="d-flex justify-content-center align-items-center light-green text-white rounded-circle">
                                <MDBIcon icon="fingerprint" size="lg" />
                            </div>
                            <span>Button</span>
                        </div>
                        <div className="col-3 d-flex flex-column align-items-center justify-content-center cursor-pointer element-type-button"
                            onClick={() => this.context.addElementType(this.context.applicationState.selectedElement, "Light")}>
                            <div className="d-flex justify-content-center align-items-center deep-orange text-white rounded-circle">
                                <MDBIcon far icon="lightbulb" size="lg" />
                            </div>

                            <span>Light</span>
                        </div>
                        <div className="col-3 d-flex flex-column align-items-center justify-content-center cursor-pointer element-type-button"
                            onClick={() => this.context.addElementType(this.context.applicationState.selectedElement, "Screen")}>
                            <div className="d-flex justify-content-center align-items-center cyan text-white rounded-circle">
                                <MDBIcon icon="desktop" size="lg" />
                            </div>
                            <span>Screen</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    }
}

ElementTypePicker.contextType = AppContext