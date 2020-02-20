import React from 'react'
import { State } from '../../interfaces/state.interface';

// Type for props and state
type PropsType = {
    selectSituation: (situationID: number | "new" | undefined) => void
    situationID: number | "new" | undefined,
    possibleStates: State[],
    emptyChoiceAllowed: boolean
}

/**
 * Dropdown element to choose a situation or create a new one
 */
export default class SituationSelect extends React.Component<PropsType> {

    /**
     * Handles changes on the selection and class the props method
     * @param event Selection change event
     */
    handleChange(event: any) {
        let value = event.target.value
        if(value === "No change"){
            value = undefined
        } else if( value !== "new"){
            value = parseInt(value)
        }
        this.props.selectSituation(value)
    }

    render() {
        return <div className="form-group">
            <select className="form-control browser-default custom-select mt-2" value={this.props.situationID} onChange={this.handleChange.bind(this)}>
                <option value={undefined} disabled={!this.props.emptyChoiceAllowed} selected={this.props.situationID === undefined}>
                    {this.props.emptyChoiceAllowed ? "No change" : "Choose a situation"}
                </option>
                {this.props.possibleStates.map(state =>
                    <option key={state.id} value={state.id}>{state.Name}</option>
                )}
                <option key="new" value="new" className="text-success font-weight-bold"> + New Situation</option>
            </select>
        </div>
    }

}
