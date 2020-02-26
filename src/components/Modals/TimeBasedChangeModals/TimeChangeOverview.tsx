import React from 'react'
import SituationSelect from '../../core/SituationSelect'
import { State } from '../../../interfaces/state.interface'
import { MDBBtn, MDBIcon, MDBInput } from 'mdbreact'
import { Transition } from '../../../interfaces/transition.interface';

// Type for props state
type PropsType = {
    cancel: () => void,
    finish: (destinationStateID: number | "new") => void,
    states: State[],
    transition: Transition,
    setTimeout: (timeout: number) => void,
    removeTransition: () => void
}
type StateType = {
    destinationStateID: number | "new" | undefined
}

/**
 * Component for the time-based change overview window, which allows to change destination and timeout
 */
export default class TimeChangeOverview extends React.Component<PropsType, StateType> {

    // This component stores a copy of destinationID in order to also use "new" as value 
    // default type for state
    state: StateType = { destinationStateID: undefined }

    /**
     * Copies the destination to the current state on mounting
     */
    componentDidMount() {
        this.setState({ destinationStateID: this.props.transition.DestinationStateID })
    }

    render() {
        return <>
                <MDBBtn color="danger" size="sm" className="float-right" onClick={this.props.removeTransition}>
                    <MDBIcon icon="trash-alt" className="mr-1" />Remove
                </MDBBtn>

            <p>
                The situation changes after
            </p>

            <div>
                <MDBInput
                    label="Timeout in ms"
                    type="number"
                    value={this.props.transition.Timeout}
                    onChange={(event: any) => this.props.setTimeout(event.target.value)}
                    outline />
                <small className="text-danger">
                    {(!!this.props.transition.Timeout && this.props.transition.Timeout > 0)
                        || "Please choose a positive value"}
                </small>
            </div>

            <div className="mt-1">
                to situation:
            </div>


            <SituationSelect
                selectSituation={DestinationStateID => this.setState({ destinationStateID: DestinationStateID })}
                situationID={this.state.destinationStateID}
                possibleStates={this.props.states}
                emptyChoiceAllowed={false}
            />

            <div className="d-flex justify-content-between mt-2">
                <MDBBtn
                    color="light"
                    onClick={this.props.cancel}
                >
                    Cancel
                </MDBBtn>
                <MDBBtn
                    color="success"
                    disabled={this.props.transition.DestinationStateID === undefined
                        || !(!!this.props.transition.Timeout && this.props.transition.Timeout > 0)}
                    onClick={() => this.state.destinationStateID !== undefined
                        && this.props.finish(this.state.destinationStateID)}>
                    <MDBIcon icon="save" className="mr-2" />
                    Save Changes
                </MDBBtn>
            </div>
        </>
    }
}

