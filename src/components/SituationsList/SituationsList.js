import React from 'react'
import SituationsListElement from './SituationsListElement'

export default class SituationsList extends React.Component {

    render() {
        return (
            <div className=" h-100 w-100 bg-white">
                <div className="text-dark w-100 p-2">
                    <h2>Situations</h2>
                </div>
                <hr className="my-0"/>
                {this.renderSituationList()}
            </div>
        )
    }

    renderSituationList() {
        const listElements = []
        for (const state of this.props.states) {
            listElements.push(
                <SituationsListElement 
                    name={state.Name} 
                    key={state.Name}
                    setSituation={() =>this.props.setSituation(state.Name)}
                    isSelected={state.Name === this.props.applicationState.currentSituation} />)
        }
        return (
            <div>
                {listElements}
            </div>
        )
    }
}
