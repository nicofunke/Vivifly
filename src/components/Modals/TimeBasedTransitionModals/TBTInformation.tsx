import React from 'react'
import { MDBIcon, MDBBtn } from 'mdbreact'

// Type for props
type PropsType = {
    cancel: () => void,
    proceed: () => void
}

/**
 * Component for the first time-based transition window, that displays main information about time-based transitions
 */
export default class TBTInformation extends React.Component<PropsType> {

    render() {
        return <>
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
                        onClick={this.props.cancel}>Cancel</MDBBtn>
                    <MDBBtn
                        color="primary"
                        onClick={this.props.proceed}
                    >
                        Proceed
                        <MDBIcon icon="caret-right" className="ml-1" />
                    </MDBBtn>
                </div>
        </>
    }
}

