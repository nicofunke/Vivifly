import { InformationBannerType, INFORMATION_BANNER_START, INFORMATION_BANNER_VISUAL, INFORMATION_BANNER_TIME } from "../types/information-banner.type"

/**
 * Utils class containing functions to handle Information banner type
 */
export class InformationBannerUtils {
    /**
     * Returns the next information banner
     * @param informationBanner current information banner
     */
    static nextInformationBanner(informationBanner: InformationBannerType): InformationBannerType {
        const result = Math.abs(informationBanner) + 1
        if (result !== INFORMATION_BANNER_START
            && result !== INFORMATION_BANNER_VISUAL
            && result !== INFORMATION_BANNER_TIME) {
            return -3
        }
        return result
    }

    /**
     * Returns the hidden information banner
     * @param informationBanner Current banner to hide
     */
    static hideInformationBanner(informationBanner: InformationBannerType): InformationBannerType {
        const result = Math.abs(informationBanner) * -1
        if (result !== -1 && result !== -2 && result !== -3) {
            return -3
        }
        return result
    }

    /**
     * Checks if the information banner is currently visible
     * @param informationBanner Banner value to check
     */
    static isInformationBannerVisible(informationBanner: InformationBannerType): boolean {
        return (informationBanner > 0)
    }
}