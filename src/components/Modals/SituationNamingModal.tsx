import React from 'react'
import { MDBInput, MDBBtn } from 'mdbreact';
import { ContextUtils } from '../../Utils/ContextUtils'
import { AppContext, APP_CONTEXT_DEFAULT } from '../Application/AppContext'
import Modal from './Modal'

/**
 * Modal to define a name for the current situation
 */
export default class SituationNamingModal extends React.Component {

    static contextType = AppContext
    context = APP_CONTEXT_DEFAULT

    /**
     * Method that gets called if the textfield for the situation name is changed.
     * Calls the method to change the name globally
     */
    handleChange(event: any) {
        const currentSituationId = this.context.applicationState.currentSituationID
        const value = event.target.value
        this.context.renameSituation(currentSituationId, value)
    }

    /**
     * Listens to keydown events and closes the popup if enter is pressed 
     */
    handleKeyDown(event: any) {
        if (!!event && event.key === 'Enter') {
            this.saveAndClose()
        }
    }

    /**
     * Closes the popup if the current situation has an appropriate name. 
     * Sets the currently selected element to none.
     * Opens the new new situation information box.
     */
    saveAndClose() {
        if (this.isProperSituationName()) {
            this.context.setSituationNamingModalVisibility(false)   // Hide this popup
            this.context.setSelectedElement("", undefined)          // Set selected element to no element
            this.context.showFirstSituationInformationWindow()      // Open new situation information
        }
    }

    /**
     * Returns if the current situation name is appropriate and can be used
     */
    isProperSituationName() {
        const currentSituationID = this.context.applicationState.currentSituationID
        const currentSituation = this.context.states.find(situation => situation.id === currentSituationID)
        return !!currentSituation && ContextUtils.isProperSituationName(currentSituation.Name, this.context)
    }

    /**
     * Gets called if the naming was cancelled. Closes the modal and deletes the situation
     */
    cancel() {
        this.context.setSituationNamingModalVisibility(false)   // Hide this popup
        this.context.removeSituation(this.context.applicationState.currentSituationID) // Remove situation
    }

    render() {
        const currentSituationID = this.context.applicationState.currentSituationID
        const currentSituation = this.context.states.find(situation => situation.id === currentSituationID)
        const isProperSituationName = this.isProperSituationName()
        if (!currentSituation) {
            return null
        }
        return <>
            <Modal
                title="New Situation"
                onClose={this.cancel.bind(this)}>
                <p>
                    Please give your new situation a meaningful name, so that you can easily recognize it later on
                </p>
                <MDBInput label="Situation Name"
                    value={currentSituation.Name}
                    onChange={this.handleChange.bind(this)}
                    onKeyDown={this.handleKeyDown.bind(this)}
                    className="my-2"
                    outline
                    autoFocus />

                {(!!currentSituation.Name && !isProperSituationName) &&
                    <><small className="text-danger">
                        The name of the situation must be unique
                            </small><br /></>}


                <small className="grey-text">
                    Meaningful names are for example
                    turnedOff, ready or gettingReady
                        </small>
                <div className="d-flex justify-content-between mt-2">
                    <MDBBtn
                        color="light"
                        onClick={this.cancel.bind(this)}>Cancel</MDBBtn>
                    <MDBBtn
                        color="primary"
                        onClick={this.saveAndClose.bind(this)}
                        disabled={!isProperSituationName}>Okay</MDBBtn>
                </div>
            </Modal>
        </>
    }
}