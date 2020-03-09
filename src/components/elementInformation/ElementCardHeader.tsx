import React from 'react'
import { MDBIcon } from 'mdbreact'
import ReactTooltip from 'react-tooltip'

// Type for props
type propsType = {
    title: string,
    onClose: () => void,
    removeAllEffects: () => void,
    addEffect: () => void
}

/**
 * Component for the element card header. Displays the name and some option buttons 
 * @param props 
 */
export default function ElementCardHeader(props: propsType) {
    return <>
        <div className="row">
            <div className="col-11 offset-1">
                <div className="d-flex justify-content-end">
                    <MDBIcon icon="plus" className="mx-2 hover-icon" onClick={props.addEffect} data-tip="Add effect" data-for="element-global-actions"/>
                    <MDBIcon far icon="trash-alt" className="mx-2 hover-icon" onClick={props.removeAllEffects} data-tip="Remove all effects" data-for="element-global-actions" />
                    <MDBIcon  icon="times" className="mx-2 hover-icon" onClick={props.onClose} data-tip="Close" data-for="element-global-actions" />
                    <ReactTooltip place="bottom" effect="solid" id="element-global-actions"/>
                </div>
            </div>
            <div className="col-11 offset-1 pt-4">
                <small className="text-light">Current Element:</small>
                <h4 >{props.title}</h4>
            </div>
        </div>
    </>
}