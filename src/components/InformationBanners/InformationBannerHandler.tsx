import React from 'react'
import FirstSituationInformationBanner from './FirstSituationInformationBanner'
import WelcomeInformationBanner from './WelcomeInformationBanner'
import { InformationBannerType, INFORMATION_BANNER_START, INFORMATION_BANNER_VISUAL, INFORMATION_BANNER_TIME } from '../../types/information-banner.type';
import { InformationBannerUtils } from '../../Utils/InformationBannerUtils'
import { Actions } from '../../interfaces/actions.interface'
import SecondSituationInformationBanner from './SecondSituationInformationBanner';
import KeyListener from '../core/KeyListener';

type PropsType = {
    informationBannerType: InformationBannerType,
    actions: Actions
}
/**
 * Handles if and which information banner is currently displayed
 */
export default class InformationBannerHandler extends React.Component<PropsType> {

    /**
     * Calls the action to close the current information banner
     */
    closeCurrentBanner() {
        this.props.actions.hideInformationBanner()
    }

    render() {
        if (!InformationBannerUtils.isInformationBannerVisible(this.props.informationBannerType)) {
            return null
        }
        let banner: JSX.Element = <></>
        if (this.props.informationBannerType === INFORMATION_BANNER_START) {
            banner = <WelcomeInformationBanner />
        }
        if (this.props.informationBannerType === INFORMATION_BANNER_VISUAL) {
            banner = <FirstSituationInformationBanner />
        }
        if (this.props.informationBannerType === INFORMATION_BANNER_TIME) {
            banner = <SecondSituationInformationBanner />
        }
        return <>
        <KeyListener onMouseClick={this.closeCurrentBanner.bind(this)}/>
            {banner}
        </>
    }
}