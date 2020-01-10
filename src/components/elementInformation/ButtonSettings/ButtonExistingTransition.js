import React from 'react'

export default class ButtonExistingTransition extends React.Component {

    handleChange(event) {
        this.props.changeDestination(parseFloat(event.target.value))
    }

    render() {
        const DestinationState = this.props.states.find(state => state.id === this.props.transition.DestinationStateID)
        return <>
            <p>Clicking this button in the current situation leads to </p>
            <div className="form-group">
                <select className="form-control" value={!!DestinationState ? DestinationState.id : undefined} onChange={this.handleChange.bind(this)}>
                    <option value={undefined} disabled selected={!DestinationState}>Choose a situation</option>
                    {this.props.states.map(state =>
                        <option key={state.id}  value={state.id}>{state.Name}</option>
                    )}
                </select>
            </div>
        </>
    }
}