import React from 'react'
import NewSituationInformationBanner from './NewSituationInformationBanner'
import WelcomeInformationBanner from './WelcomeInformationBanner'

type PropsType={
    hasAlreadySelectedAnElement: boolean,
    showFirstSituationInformation: boolean
}
/**
 * Handles if and which information banner is currently displayed
 */
export default class InformationBannerHandler extends React.Component<PropsType> {
    render() {
        if(!this.props.hasAlreadySelectedAnElement){
            return <WelcomeInformationBanner />
        }
        if( this.props.showFirstSituationInformation ){
            return <NewSituationInformationBanner />
        }
        return null
    }
}