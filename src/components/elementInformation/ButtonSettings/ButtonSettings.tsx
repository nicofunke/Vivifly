import React, { Component } from 'react'
import { MDBIcon } from 'mdbreact'
import ButtonChooseTransition from './ButtonChooseTransition'
import ButtonExistingTransition from './ButtonExistingTransition'
import { ContextUtils } from '../../../Utils/ContextUtils'
import { ELEMENT_TYPE_BUTTON } from '../../../types/element-type.type'
import ReactTooltip from 'react-tooltip'
import { Actions } from '../../../interfaces/actions.interface'
import { Transition } from '../../../interfaces/transition.interface'
import { State } from '../../../interfaces/state.interface'

type PropsType ={
    actions: Actions,
    currentSituationID: number,
    element: string,
    transitions: Transition[],
    states: State[]
}

/**
 * Component to display the settings for button elements
 */
export default class ButtonSettings extends Component<PropsType> {

    /**
     * Function that gets called if the new situation button is pressed
     * Creates a new situation and sets a transition from the current button to this situation
     * Opens the naming modal
     */
    newSituationButtonClicked() {
        const newSituationID = this.props.actions.createNewSituation("")
        this.props.actions.setButtonTransition(
            this.props.currentSituationID,
            newSituationID,
            this.props.element)
        this.props.actions.setRenamingModalSituation(newSituationID)
    }

    /**
     * Function that gets called if the existing situation button is pressed
     * Creates a new transition without destination
     */
    existingSituationButtonClicked() {
        this.props.actions.setButtonTransition(
            this.props.currentSituationID,
            undefined,
            this.props.element)
    }

    render() {
        const transition = ContextUtils.getButtonTransition(this.props.element, this.props.currentSituationID, this.props.transitions)
        return <>
            <div className="row">
                <div className="col-1 p-0 d-flex justify-content-center align-items-center">
                    <MDBIcon icon="fingerprint" size="lg" className="light-green-text" />
                </div>
                <div className="col-11">
                    <div className="mb-1" >
                        <div className="d-inline">Button</div>
                        <div className="d-inline-block float-right">
                            <MDBIcon far icon="trash-alt"
                                className="mx-2 hover-icon"
                                data-tip="Remove button effect"
                                data-for="element-button-actions"
                                onClick={() => this.props.actions.removeElementType(this.props.element, ELEMENT_TYPE_BUTTON)}
                            />
                            <ReactTooltip place="bottom" effect="solid" id="element-button-actions" />
                        </div>
                    </div>

                    <div className="card-text">
                        {!transition ?
                            <ButtonChooseTransition
                                newSituationButtonClicked={this.newSituationButtonClicked.bind(this)}
                                existingSituationButtonClicked={this.existingSituationButtonClicked.bind(this)}
                                existingSituationButtonDisabled={!!this.props.states && this.props.states.length <= 1} />
                            :
                            <ButtonExistingTransition
                                transition={transition}
                                states={this.props.states}
                                changeDestination={(destination: number | undefined) => transition.SourceStateID !== undefined && !!transition.InteractionElement
                                    && this.props.actions.setButtonTransition(transition.SourceStateID, destination, transition.InteractionElement)}
                                newSituationButtonClicked={this.newSituationButtonClicked.bind(this)} />}
                    </div>
                </div>
            </div>
        </>
    }
}
