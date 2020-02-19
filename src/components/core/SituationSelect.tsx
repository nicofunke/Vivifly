import React from 'react'
import { State } from '../../interfaces/state.interface';

// Type for props and state
type PropsType = {
    selectSituation: (situationID: number | "new") => void
    situationID: number | "new" | undefined,
    possibleStates: State[]
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
        const value = event.target.value 
        this.props.selectSituation(value)
    }

    render() {
        return <div className="form-group">
            <select className="form-control browser-default custom-select mt-2" value={this.props.situationID} onChange={this.handleChange.bind(this)}>
                <option value={undefined} disabled selected={!this.props.situationID}>Choose a situation</option>
                {this.props.possibleStates.map(state =>
                    <option key={state.id} value={state.id}>{state.Name}</option>
                )}
                <option key="new" value="new" className="text-white bg-success"> + New Situation</option>
            </select>
        </div>
    }

}
