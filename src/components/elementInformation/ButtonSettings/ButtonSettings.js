import React, { Component } from 'react'
import { MDBIcon } from 'mdbreact'
import { AppContext } from '../../Application/AppContext'
import ButtonChooseTransition from './ButtonChooseTransition'
import ButtonExistingTransition from './ButtonExistingTransition'
import { ContextUtils } from '../../../Utils/ContextUtils'
import { ELEMENT_TYPE_BUTTON } from '../../../types/element-type.type'
import ReactTooltip from 'react-tooltip'

export default class ButtonSettings extends Component {

    static contextType = AppContext

    /**
     * Function that gets called if the new situation button is pressed
     * Creates a new situation and sets a transition from the current button to this situation
     * Opens the naming modal
     */
    newSituationButtonClicked() {
        const newSituationID = this.context.createNewSituation("")
        this.context.setTransition(
            this.context.applicationState.currentSituationID,
            newSituationID,
            this.context.applicationState.selectedElement)
        this.context.setCurrentSituation(newSituationID)
        this.context.setSituationNamingModalVisibility(true)
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
                                onClick={() => this.context.removeElementType(this.context.applicationState.selectedElement, ELEMENT_TYPE_BUTTON)}
                            />
                            <ReactTooltip place="bottom" effect="solid" id="element-button-actions" />
                        </div>
                    </div>

                    <div className="card-text">
                        {!transition ?
                            <ButtonChooseTransition
                                newSituationButtonClicked={this.newSituationButtonClicked.bind(this)}
                                existingSituationButtonClicked={this.existingSituationButtonClicked.bind(this)}
                                existingSituationButtonDisabled={!!this.context.states && this.context.states.length <= 1} />
                            :
                            <ButtonExistingTransition
                                transition={transition}
                                states={this.context.states}
                                changeDestination={destination => this.context.setTransition(transition.SourceStateID, destination, transition.InteractionElement)}
                                newSituationButtonClicked={this.newSituationButtonClicked.bind(this)} />}
                    </div>
                </div>
            </div>
        </>
    }
}
