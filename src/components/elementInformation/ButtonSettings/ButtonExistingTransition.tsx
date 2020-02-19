import React from 'react'
import SituationSelect from '../../core/SituationSelect'
import { State } from '../../../interfaces/state.interface'
import { Transition } from '../../../interfaces/transition.interface'

/**
 * Type for props
 */
type PropsType = {
    newSituationButtonClicked: () => void,
    changeDestination: (destinationSituationID: number) => void,
    states: State[],
    transition: Transition
}

export default class ButtonExistingTransition extends React.Component<PropsType> {

    // TODO: Add goto situation button
    // TODO: No transition should be possible

    /**
     * Gets called if the situation dropdown changes
     * @param situationID new chosen situation
     */
    setSituation(situationID: number | "new") {
        if (situationID === "new") {
            this.props.newSituationButtonClicked()
        } else {
            this.props.changeDestination(situationID)
        }
    }

    render() {
        const DestinationState = this.props.states.find(state => state.id === this.props.transition.DestinationStateID)
        return <>
            <div>Clicking this button in the current situation leads to </div>
            <SituationSelect
                selectSituation={this.setSituation.bind(this)}
                possibleStates={this.props.states}
                situationID={DestinationState?.id}
            />
        </>
    }
}