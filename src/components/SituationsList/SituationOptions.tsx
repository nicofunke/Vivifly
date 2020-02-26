import React from 'react'
import { MDBIcon } from 'mdbreact'

// Typed props
type PropsType = {
    onTimeBasedClick: () => void,
    onRenameClick: () => void,
    onStartClick: () => void,
    onDeleteClick: () => void,
    hasTimeBasedChange: boolean
    situationID: number
}

/**
 * Displays options to edit a situation. This gets shown inside a tooltip
 */
export default class SituationOptions extends React.Component<PropsType> {

    render() {
        return <>
            <div className="row situation-list-element hover-icon py-2 px-1" onClick={this.props.onTimeBasedClick}>
                <div className="col-2"><MDBIcon icon="clock" /></div>
                <div className="col-10">
                    {this.props.hasTimeBasedChange ? "Edit time-based change" : "Add time-based change"}
                </div>
            </div>
            <div className="row situation-list-element hover-icon py-2 px-1" onClick={this.props.onRenameClick}>
                <div className="col-2"><MDBIcon icon="pen" /></div>
                <div className="col-10">Rename Situation</div>
            </div>
            <div className="row situation-list-element hover-icon py-2 px-1" onClick={this.props.onStartClick}>
                <div className="col-2"><MDBIcon icon="home" /></div>
                <div className="col-10">Set as start situation</div>
            </div>
            <div className="row situation-list-element hover-icon py-2 px-1" onClick={this.props.onDeleteClick}>
                <div className="col-2"><MDBIcon icon="trash-alt" /></div>
                <div className="col-10">Delete situation</div>
            </div>
        </>
    }
}