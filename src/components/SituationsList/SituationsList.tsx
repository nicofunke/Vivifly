import React from 'react'
import SituationsListElement from './SituationsListElement'
import { AppContext, APP_CONTEXT_DEFAULT } from '../Application/AppContext';
import { ContextUtils } from '../../Utils/ContextUtils';

export default class SituationsList extends React.Component {

    // Import AppContext
    static contextType = AppContext
    context = APP_CONTEXT_DEFAULT

    render() {
        return (
            <div className=" h-100 w-100 bg-white">
                <div className="text-dark w-100 p-2">
                    <h2>Situations</h2>
                </div>
                <hr className="my-0" />
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
                    onElementClick={() => this.context.setCurrentSituation(state.id)}
                    isSelected={this.context.applicationState.currentSituationID === state.id}
                    renameSituation={(newName: string) => this.context.renameSituation(state.id, newName)}
                    isProperSituationName={ (newName: string) => ContextUtils.isProperSituationName(newName, this.context)}
                    isStart={state.id === 0}
                    key={state.id} />)
        }
        return (
            <div>
                {listElements}
            </div>
        )
    }
}
