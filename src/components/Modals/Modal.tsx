import React from 'react'
import { MDBCard, MDBModalHeader, MDBModalBody } from 'mdbreact'
import KeyListener from '../core/KeyListener'

// Type for props
type PropsType = {
    onClose: () => void,
    title: string
}

/**
 * Simple top centered modal with a backdrop
 */
export default class Modal extends React.Component<PropsType> {

    render() {
        return <>
            <KeyListener onEsc={this.props.onClose} />
            <div className="position-fixed popup-overlay bg-backdrop w-100 h-100 d-flex pt-5 justify-content-center align-items-start" onClick={this.props.onClose}>
                <MDBCard onClick={(event: any) => event.stopPropagation()} className="modal-body p-0">
                    <MDBModalHeader className="d-flex justify-content-between" toggle={this.props.onClose}>
                        {this.props.title}
                    </MDBModalHeader>
                    <MDBModalBody>
                        <div className="card-text">
                            {this.props.children}
                        </div>
                    </MDBModalBody>
                </MDBCard>
            </div>
        </>
    }
}