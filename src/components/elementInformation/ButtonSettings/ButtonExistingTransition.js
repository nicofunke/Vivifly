import React from 'react'
import { MDBIcon } from 'mdbreact'

export default class ButtonExistingTransition extends React.Component {

    handleChange(event) {
        const value = event.target.value
        if (value === "new") {
            this.props.newSituationButtonClicked()
        } else {
            this.props.changeDestination(parseFloat(value))
        }
    }

    render() {
        const DestinationState = this.props.states.find(state => state.id === this.props.transition.DestinationStateID)
        return <>
            <div>Clicking this button in the current situation leads to </div>
            <div className="form-group">
                <select className="form-control browser-default custom-select mt-2" value={!!DestinationState ? DestinationState.id : undefined} onChange={this.handleChange.bind(this)}>
                    <option value={undefined} disabled selected={!DestinationState}>Choose a situation</option>
                    {this.props.states.map(state =>
                        <option key={state.id} value={state.id}>{state.Name}</option>
                    )}
                    <option key="new" value="new" className="text-white bg-success"> + New Situation</option>
                </select>
            </div>
        </>
    }
}