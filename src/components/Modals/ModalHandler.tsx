import React from 'react'
import { AppContext, APP_CONTEXT_DEFAULT } from '../Application/AppContext'
import SituationNamingModal from './SituationNamingModal'
import TimeBasedTransitionModal from './TimeBasedTransitionModals/TImeBasedTransitionModal';

/**
 * Handler that displays modals such as the modal for naming situations and the modal to set a time-based transition
 */
export default class ModalHandler extends React.Component {

    // Import context
    static contextType = AppContext
    context = APP_CONTEXT_DEFAULT


    render() {
        if( this.context.applicationState.showSituationNamingWindow){
            return <SituationNamingModal />
        }
        if( this.context.applicationState.showTimeBasedTransitionWindow){
            return <TimeBasedTransitionModal />
        }
        return null
    }
}