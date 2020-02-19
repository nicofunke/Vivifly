import React from 'react'
import SituationSelect from '../../core/SituationSelect';
import { State } from '../../../interfaces/state.interface';
import { MDBBtn, MDBIcon } from 'mdbreact';

// Type for props state
type PropsType = {
    back: () => void,
    finish: (destinationStateID: number | "new" ) => void,
    states: State[]
}
type StateType = {
    destinationStateID: number | "new" | undefined
}

/**
 * Component for the third time-based transition window, to choose the destination situation
 */
export default class TBTDestination extends React.Component<PropsType, StateType> {

    state: StateType = { destinationStateID: undefined }

    /**
     * Stores a new destination situation in the state
     * @param destinationSituationID New destination situation ID or "new" for new situation
     */
    setDestination(destinationSituationID: number | "new") {
        this.setState({ destinationStateID: destinationSituationID })
    }

    render() {
        return <>
            <p>
                Where should this time-based transition lead to?
            </p>
            <SituationSelect
                selectSituation={this.setDestination.bind(this)}
                situationID={this.state.destinationStateID}
                possibleStates={this.props.states}
            />


            <div className="d-flex justify-content-between mt-2">
                <MDBBtn
                    color="light"
                    onClick={this.props.back}
                >
                    <MDBIcon icon="caret-left" className="mr-1" />
                    Back
                </MDBBtn>
                <MDBBtn
                    color="success"
                    disabled={this.state.destinationStateID === undefined}
                    onClick={() => this.state.destinationStateID !== undefined && this.props.finish(this.state.destinationStateID)}
                >
                    Finish
                </MDBBtn>
            </div>
        </>
    }
}

