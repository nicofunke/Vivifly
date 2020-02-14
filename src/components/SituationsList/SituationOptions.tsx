import React from 'react'
import { MDBIcon } from 'mdbreact'

// Typed props
type PropsType = {
    onRenameClick: () => void,
    onStartClick: () => void,
    onTimeClick: () => void,
}

/**
 * Displays options to edit a situation. This gets shown inside a tooltip
 */
export default class SituationOptions extends React.Component<PropsType> {

    render() {
        return <>
            <div className="row situation-list-element hover-icon py-2 px-1" onClick={this.props.onTimeClick}>
                <div className="col-2"><MDBIcon icon="clock" /></div>
                <div className="col-10">Add time-based transition</div>
            </div>
            <div className="row situation-list-element hover-icon py-2 px-1" onClick={this.props.onRenameClick}>
                <div className="col-2"><MDBIcon icon="pen" /></div>
                <div className="col-10">Rename Situation</div>
            </div>
            <div className="row situation-list-element hover-icon py-2 px-1" onClick={this.props.onStartClick}>
                <div className="col-2"><MDBIcon icon="home" /></div>
                <div className="col-10">Set as start situation</div>
            </div>
        </>
    }
}