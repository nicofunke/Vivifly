import React from 'react'
import { MDBCard, MDBCardBody, MDBCardTitle, MDBIcon, MDBCardText, MDBInput, MDBBtn } from 'mdbreact'
import { AppContext } from '../Application/AppContext'

/**
 * Popup to define a name for the current situation
 * Only pop ups if the name of the current situation is ""
 */
// TODO: Validation warnings
// TODO: Auto focus
export default class NewSituationPopup extends React.Component {

    // Default: not active (gets activated if the current situation is "")
    state = { currentlyActive: false }

    /**
     * Method that gets called if the textfield for the situation name is used
     * calls the method to change the name globally 
     */
    handleChange(event) {
        const currentSituationId = this.context.applicationState.currentSituationID
        this.setState({ currentlyActive: true })
        this.context.renameSituation(currentSituationId, event.target.value)
    }

    /**
     * Listens to keydown events and closes the popup if enter is pressed 
     */
    handleKeyDown(event) {
        if (event.key === 'Enter') {
            this.closePopup()
        }
    }

    /**
     * Closes the popup if the current situation has an appropriate name
     */
    closePopup() {
        if( this.isProperSituationName()){
            this.setState({ currentlyActive: false })
        }
    }

    /**
     * Returns if the current situation name is appropriate and can be used
     */
    isProperSituationName(){
        const currentSituationID =  this.context.applicationState.currentSituationID
        const currentSituation = this.context.states.find(situation => situation.id === currentSituationID)
        const isDuplicate = this.context.states.filter( state => state.Name === currentSituation.Name).length > 1
        return !!currentSituation && currentSituation.Name !=="" && !isDuplicate
    }

    render() {
        const currentSituationID = this.context.applicationState.currentSituationID
        const currentSituation = this.context.states.find(situation => situation.id === currentSituationID)
        if (!this.state.currentlyActive &&
            (!currentSituation || currentSituation.Name !== "")) {
            return null
        }
        return <>
            <div className="position-fixed popup-overlay bg-white-transparent w-100 h-100 d-flex align-items-center justify-content-center">
                <MDBCard>
                    <MDBCardBody>
                        <MDBCardTitle className="text-success">
                            <MDBIcon icon="check-circle" size="lg" className="mr-1" />
                            Situation Created!
                        </MDBCardTitle>
                        <MDBCardText>
                            You successfully created a new situation!<br />
                            Please give it a meaningful name, so that you can easily <br />
                            recognize it later on
                        </MDBCardText>
                        <MDBInput label="Situation Name"
                            value={currentSituation.Name}
                            onChange={this.handleChange.bind(this)}
                            onKeyDown={this.handleKeyDown.bind(this)}
                            outline
                            autoFocus  />
                        <small className="grey-text">
                            Meaningful names are for example
                            turnedOff, ready or gettingReady
                        </small>
                        <div className="d-flex justify-content-end mt-2">
                            <MDBBtn
                                color="primary"
                                onClick={this.closePopup.bind(this)}
                                disabled={!this.isProperSituationName()}>Okay</MDBBtn>
                        </div>
                    </MDBCardBody>
                </MDBCard>
            </div>
        </>
    }
}

NewSituationPopup.contextType = AppContext