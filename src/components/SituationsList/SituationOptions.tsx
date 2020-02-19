import React from 'react'
import { MDBIcon } from 'mdbreact'
import { AppContext, APP_CONTEXT_DEFAULT } from '../Application/AppContext'
import { ContextUtils } from '../../Utils/ContextUtils';

// Typed props
type PropsType = {
    onRenameClick: () => void,
    onStartClick: () => void,
    situationID: number
}

/**
 * Displays options to edit a situation. This gets shown inside a tooltip
 */
export default class SituationOptions extends React.Component<PropsType> {

    // Import AppContext
    static contextType = AppContext
    context = APP_CONTEXT_DEFAULT

    render() {
        return <>
            <div className="row situation-list-element hover-icon py-2 px-1" onClick={() => this.context.setTimeBasedTransitionModalVisibility(true)}>
                <div className="col-2"><MDBIcon icon="clock" /></div>
                <div className="col-10">
                    {!!ContextUtils.getTimeBasedTransition(this.props.situationID, this.context) ?
                        "Change time-based transition" : "Add time-based transition"}
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
            <div className="row situation-list-element hover-icon py-2 px-1" onClick={() => this.context.removeSituation(this.props.situationID)}>
                <div className="col-2"><MDBIcon icon="trash-alt" /></div>
                <div className="col-10">Delete situation</div>
            </div>
        </>
    }
}