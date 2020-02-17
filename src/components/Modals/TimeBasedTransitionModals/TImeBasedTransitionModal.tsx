import React from 'react'
import Modal from '../Modal'
import { AppContext, APP_CONTEXT_DEFAULT } from '../../Application/AppContext'
import { MDBBtn, MDBIcon } from 'mdbreact'


export default class TimeBasedTransitionModal extends React.Component {

    // Import AppContext
    static contextType = AppContext
    context = APP_CONTEXT_DEFAULT

    cancel() {
        this.context.setTimeBasedTransitionWindowVisibility(false)
    }

    render() {
        return <>
            <Modal
                title="Time-based Transition"
                onClose={this.cancel.bind(this)}>
                <p>
                    Please proceed if you want to add a time-based transition.
                </p>
                <div className="row align-items-center text-info my-4">
                    <div className="col-2 d-flex justify-content-end">
                        <MDBIcon icon="info-circle" size="2x" />
                    </div>
                    <div className="col-10">
                        A time-based transition is a situation change
                        (e.g. lights changing) that takes place after a
                        certain amount of time.
                    </div>

                </div>
                <div className="d-flex justify-content-between mt-2">
                    <MDBBtn
                        color="light"
                        onClick={this.cancel.bind(this)}>Cancel</MDBBtn>
                    <MDBBtn
                        color="primary"
                        onClick={() => { }}
                    >
                        Next
                        <MDBIcon icon="caret-right" className="ml-1" />
                    </MDBBtn>
                </div>
            </Modal>
        </>
    }
}

