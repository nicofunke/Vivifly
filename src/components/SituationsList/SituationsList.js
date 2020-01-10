import React from 'react'
import SituationsListElement from './SituationsListElement'
import { AppContext } from '../Application/AppContext'

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
        for (const state of this.context.states) {
            listElements.push(
                <SituationsListElement 
                    name={state.Name}
                    id={state.id} 
                    key={state.id} />)
        }
        return (
            <div>
                {listElements}
            </div>
        )
    }
}

SituationsList.contextType = AppContext
