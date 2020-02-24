import React from 'react'
import SituationsListElement from './SituationsListElement'
import { ContextUtils } from '../../Utils/ContextUtils'
import { State } from '../../interfaces/state.interface'
import { Actions } from '../../interfaces/actions.interface'
import { Transition } from '../../interfaces/transition.interface'

type PropsType = {
    states: State[],
    actions: Actions,
    currentSituationID: number,
    transitions: Transition[]
}

/**
 * Component that displays all situation in form of a list
 */
export default class SituationsList extends React.Component<PropsType> {

    /**
     * Returns the situations list
     */
    renderSituationList(): JSX.Element {
        const listElements = []
        for (const state of this.props.states) {
            listElements.push(
                <SituationsListElement
                    name={state.Name}
                    onElementClick={() => this.props.actions.setCurrentSituation(state.id)}
                    isSelected={this.props.currentSituationID === state.id}
                    renameSituation={(newName: string) => this.props.actions.renameSituation(state.id, newName)}
                    isProperSituationName={(newName: string) => ContextUtils.isProperSituationName(newName, this.props.states)}
                    isStart={state.id === 0}
                    hasTimeBasedTransition={!!ContextUtils.getTimeBasedTransition(state.id, this.props.transitions)}
                    openTimeBasedOptions={() => this.props.actions.setTimeBasedTransitionModalVisibility(true)}
                    removeSituation={() => this.props.actions.removeSituation(state.id)}
                    id={state.id}
                    key={state.id} />)
        }
        return (
            <div>
                {listElements}
            </div>
        )
    }

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
}
