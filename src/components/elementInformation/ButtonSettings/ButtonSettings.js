import React, { Component } from 'react'
import { MDBIcon } from 'mdbreact'
import { AppContext } from '../../Application/AppContext'
import ButtonChooseTransition from './ButtonChooseTransition'
import ButtonExistingTransition from './ButtonExistingTransition'
import { ContextUtils } from '../../../Utils/ContextUtils'

export default class ButtonSettings extends Component {

    static contextType = AppContext

    /**
     * Function that gets called if the new situation button is pressed
     * Creates a new situation and sets a transition from the current button to this situation
     * Since the situation is created without a name it will open a popup to give it a name
     */
    newSituationButtonClicked() {
        const newSituationID = this.context.createNewSituation("")
        this.context.setTransition(
            this.context.applicationState.currentSituationID,
            newSituationID,
            this.context.applicationState.selectedElement)
        this.context.setCurrentSituation(newSituationID)
        this.context.setSelectedElement("")
    }

    /**
     * Function that gets called if the existing situation button is pressed
     * Creates a new transition without destination
     */
    existingSituationButtonClicked() {
        this.context.setTransition(
            this.context.applicationState.currentSituationID,
            null,
            this.context.applicationState.selectedElement)
    }

    render() {
        const transition = ContextUtils.getTransition(this.context.applicationState.selectedElement, this.context.applicationState.currentSituationID, this.context)
        return <>
            <button type="button"
                className="btn btn-link btn-sm p-0 text-default"
                onClick={() => this.context.removeElementType(this.context.applicationState.selectedElement, "Button")}>
                <MDBIcon icon="angle-left" /> This is no button
            </button>
            <h5 className="light-green-text"><MDBIcon icon="fingerprint" className="mr-1" /> Button </h5>
            {!transition ?
                <ButtonChooseTransition
                    newSituationButtonClicked={this.newSituationButtonClicked.bind(this)}
                    existingSituationButtonClicked={this.existingSituationButtonClicked.bind(this)}
                    existingSituationButtonDisabled={!!this.context.states && this.context.states.length <= 1} />
                :
                <ButtonExistingTransition
                    transition={transition}
                    states={this.context.states}
                    changeDestination={destination => this.context.setTransition(transition.SourceStateID, destination, transition.InteractionElement)} />}
        </>
    }
}
