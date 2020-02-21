import React from 'react'
import SituationSelect from '../../core/SituationSelect'
import { State } from '../../../interfaces/state.interface'
import { Transition } from '../../../interfaces/transition.interface'

/**
 * Type for props
 */
type PropsType = {
    newSituationButtonClicked: () => void,
    changeDestination: (destinationSituationID: number | undefined) => void,
    states: State[],
    transition: Transition
}

export default class ButtonExistingTransition extends React.Component<PropsType> {

    // TODO: (optional) Add goto situation button
    /**
     * Sets a new destination for the button in the current situation
     * @param situationID new chosen situation
     */
    setDestination(situationID: number | "new" | undefined) {
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
                selectSituation={this.setDestination.bind(this)}
                possibleStates={this.props.states}
                situationID={DestinationState?.id}
                emptyChoiceAllowed={true}
            />
        </>
    }
}