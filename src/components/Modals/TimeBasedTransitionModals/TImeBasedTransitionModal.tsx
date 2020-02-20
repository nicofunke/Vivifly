import React from 'react'
import Modal from '../Modal'
import { AppContext, APP_CONTEXT_DEFAULT } from '../../Application/AppContext'
import TBTInformation from './TBTInformation'
import { Transition } from '../../../interfaces/transition.interface'
import TBTTimeout from './TBTTimeout'
import TBTDestination from './TBTDestination'
import { ContextUtils } from '../../../Utils/ContextUtils'
import TBTOverview from './TBTOverview'

/**
 * Modal to define a time-based transition
 * Displays the necessary modals to set all variables and halds the transition as state
 */
export default class TimeBasedTransitionModal extends React.Component<{}, Transition> {

    // TODO: 2 Continue on enter
    state: Transition = {}

    // Import AppContext
    static contextType = AppContext
    context = APP_CONTEXT_DEFAULT

    /**
     * Gets called when the component is mounted
     * Stores the existing transition to the components state
     */
    componentDidMount() {
        const existingTransition = ContextUtils.getTimeBasedTransition(this.context.applicationState.currentSituationID, this.context)
        if (!!existingTransition) {
            this.setState(existingTransition)
        }
    }

    /**
     * Changes the timeout of the transition
     * @param timeout Timeout in ms
     */
    setTimeout(timeout: number | undefined) {
        this.setState({ Timeout: timeout })
    }

    /**
     * Changes the destination state of the current transition
     * @param destinationStateID Id of the destination state
     */
    setDestination(destinationStateID: number) {
        this.setState({ DestinationStateID: destinationStateID })
    }

    /**
     * Changes the source state of the current transition
     * @param sourceStateID Id of the source state
     */
    setSource(sourceStateID: number | undefined) {
        this.setState({ SourceStateID: sourceStateID })
    }

    /**
     * Cancels the time-based transition creation and closes the modal
     */
    cancel() {
        this.context.setTimeBasedTransitionModalVisibility(false)
    }

    /**
     * Saves the destination and stores the transition. Closes the modal
     * @param destinationStateID Destination State ID
     */
    saveDestinationAndClose(destinationStateID: number | "new") {
        // If destination == "new" create a new situation first
        if (destinationStateID === "new") {
            destinationStateID = this.context.createNewSituation("")
            this.context.setCurrentSituation(destinationStateID)
            this.context.setSituationNamingModalVisibility(true)
        }
        // Save transition and close the modal
        if ((!this.state.SourceStateID && this.state.SourceStateID !== 0) || !this.state.Timeout) {
            return
        }
        this.context.setTimeBasedTransition(this.state.SourceStateID, destinationStateID, this.state.Timeout)
        this.context.setTimeBasedTransitionModalVisibility(false)
    }

    /**
     * Removes the time-based transition globally and closes the modal
     */
    removeTransition(){
        this.context.removeTimeBasedTransition(this.context.applicationState.currentSituationID)
        this.context.setTimeBasedTransitionModalVisibility(false)
    }

    /**
     * Returns the correspondent modal content for the transition
     * @param transition Current transition element
     */
    getCurrentContent(transition: Transition): JSX.Element {
        // Source is not set => Show information modal
        if (!this.state.SourceStateID && this.state.SourceStateID !== 0) {
            return <TBTInformation
                cancel={this.cancel.bind(this)}
                proceed={() => this.setSource(this.context.applicationState.currentSituationID)} />
        }
        // Timeout is not set => Show Timeout modal
        if (!this.state.Timeout && this.state.Timeout !== 0) {
            return <TBTTimeout
                back={() => this.setSource(undefined)}
                proceed={this.setTimeout.bind(this)} />
        }
        // Destination is not set => Show destination modal
        if (!this.state.DestinationStateID && this.state.DestinationStateID !== 0) {
            return <TBTDestination
                back={() => this.setTimeout(undefined)}
                finish={this.saveDestinationAndClose.bind(this)}
                states={this.context.states} />
        }

        // Everything is set => Show overview
        return <TBTOverview
            cancel={this.cancel.bind(this)}
            finish={ this.saveDestinationAndClose.bind(this)}
            states={this.context.states}
            transition={this.state}
            setTimeout={this.setTimeout.bind(this)} 
            removeTransition={this.removeTransition.bind(this)}/>
    }


    render() {
        return <>
            <Modal
                title="Time-based Transition"
                onClose={this.cancel.bind(this)}>
                {this.getCurrentContent(this.state)}
            </Modal>
        </>
    }
}

