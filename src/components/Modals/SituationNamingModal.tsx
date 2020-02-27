import React from 'react'
import { MDBInput, MDBBtn } from 'mdbreact'
import { ContextUtils } from '../../Utils/ContextUtils'
import Modal from './Modal'
import { Actions } from '../../interfaces/actions.interface'
import { State } from '../../interfaces/state.interface';

type PropsType={
    situationID: number,
    actions: Actions,
    states: State[]
}
/**
 * Modal to define a name for the current situation
 */
export default class SituationNamingModal extends React.Component<PropsType> {


    /**
     * Method that gets called if the textfield for the situation name is changed.
     * Calls the action to change the name globally
     */
    handleChange(event: any) {
        const value = event.target.value
        this.props.actions.renameSituation(this.props.situationID, value)
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
     * Opens the new situation and the new new situation information box.
     */
    saveAndClose() {
        if (this.isProperSituationName()) {
            this.props.actions.setSelectedElement("", undefined) 
            this.props.actions.setRenamingModalSituation(undefined)
            this.props.actions.setCurrentSituation(this.props.situationID)
            this.props.actions.showNextInformationBanner()
        }
    }

    /**
     * Returns if the current situation name is appropriate and can be used
     */
    isProperSituationName() {
        const currentSituation = this.props.states.find(situation => situation.id === this.props.situationID)
        return !!currentSituation && ContextUtils.isProperSituationName(currentSituation.Name, this.props.states)
    }

    /**
     * Gets called if the naming was cancelled. Closes the modal and deletes the situation
     */
    cancel() {
        this.props.actions.setRenamingModalSituation(undefined)       // Hide this popup
        this.props.actions.removeSituation(this.props.situationID)    // Remove situation
    }

    render() {
        const currentSituation = this.props.states.find(situation => situation.id === this.props.situationID)
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