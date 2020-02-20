import React from 'react'
import { AppContext, APP_CONTEXT_DEFAULT } from '../Application/AppContext'
import NewSituationInformation from '../InformationWindows/NewSituationInformation'
import WelcomeWindow from '../InformationWindows/WelcomeWindow'

/**
 * Handles if and which information window is currently displayed
 */
export default class InformationWindowHandler extends React.Component {

    static contextType = AppContext
    context = APP_CONTEXT_DEFAULT


    render() {
        const applicationState = this.context.applicationState
        if (!applicationState ) {
            return null
        }
        if(!applicationState.hasAlreadySelectedAnElement){
            return <WelcomeWindow />
        }
        if( applicationState.showFirstSituationInformation ){
            return <NewSituationInformation />
        }
        return null
    }
}