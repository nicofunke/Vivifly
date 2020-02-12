import React from 'react'
import { MDBIcon, MDBCloseIcon } from 'mdbreact'

type propsType = {
    title: string,
    onClose: () => void
}

export default function ElementInformationHeader(props: propsType) {
    return <>
        <div className="row">
            <div className="col-1 p-0 text-center"><MDBCloseIcon className="mr-1 text-white" onClick={props.onClose} /></div>
            <div className="col-11">
                <div className="d-flex justify-content-end">
                    <MDBIcon icon="plus" className="mx-2 hover-icon" />
                    <MDBIcon far icon="trash-alt" className="mx-2 hover-icon" />
                </div>
            </div>
            <div className="col-11 offset-1 pt-4">
                <h4 >{props.title}</h4>
            </div>
        </div>
    </>
}