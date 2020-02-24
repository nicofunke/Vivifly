import React from 'react'
import SituationNamingModal from './SituationNamingModal'
import TimeBasedTransitionModal from './TimeBasedTransitionModals/TimeBasedTransitionModal'
import NewElementTypeModal from './NewElementTypeModal'
import { ApplicationState } from '../../interfaces/application-state.interface';
import { State } from '../../interfaces/state.interface';
import { Actions } from '../../interfaces/actions.interface';
import { Transition } from '../../interfaces/transition.interface';

type PropsType = {
    applicationState: ApplicationState,
    states: State[],
    actions: Actions,
    transitions: Transition[]
}

/**
 * Handler that displays modals such as the modal for naming situations and the modal to set a time-based transition
 */
export default class ModalHandler extends React.Component<PropsType> {

    render() {
        if (this.props.applicationState.newSituationID !== undefined) {
            return <SituationNamingModal
                situationID={this.props.applicationState.newSituationID}
                actions={this.props.actions}
                states={this.props.states} />
        }
        if (this.props.applicationState.showTimeBasedTransitionModal) {
            return <TimeBasedTransitionModal
                states={this.props.states}
                currentSituationID={this.props.applicationState.currentSituationID}
                actions={this.props.actions}
                transitions={this.props.transitions} />
        }
        if (this.props.applicationState.showNewElementTypeModal) {
            return <NewElementTypeModal
                actions={this.props.actions}
                element={this.props.applicationState.selectedElement} />
        }
        return null
    }
}