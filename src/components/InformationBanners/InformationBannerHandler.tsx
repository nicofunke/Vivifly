import React from 'react'
import FirstSituationInformationBanner from './FirstSituationInformationBanner'
import WelcomeInformationBanner from './WelcomeInformationBanner'
import { InformationBannerType, INFORMATION_BANNER_START, INFORMATION_BANNER_VISUAL, INFORMATION_BANNER_TIME } from '../../types/information-banner.type';
import { InformationBannerUtils } from '../../Utils/InformationBannerUtils'
import { Actions } from '../../interfaces/actions.interface'
import SecondSituationInformationBanner from './SecondSituationInformationBanner';

type PropsType = {
    informationBannerType: InformationBannerType,
    actions: Actions
}
/**
 * Handles if and which information banner is currently displayed
 */
export default class InformationBannerHandler extends React.Component<PropsType> {

    render() {
        if (!InformationBannerUtils.isInformationBannerVisible(this.props.informationBannerType)) {
            return null
        }
        if (this.props.informationBannerType === INFORMATION_BANNER_START) {
            return <WelcomeInformationBanner />
        }
        if (this.props.informationBannerType === INFORMATION_BANNER_VISUAL) {
            return <FirstSituationInformationBanner />
        }
        if(this.props.informationBannerType === INFORMATION_BANNER_TIME) { 
            return <SecondSituationInformationBanner />
        }
        return null
    }
}