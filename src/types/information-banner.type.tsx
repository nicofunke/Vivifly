
/**
 * Type to store the current information banner. Negative values represent a hidden banner but store a number
 * to keep track of which banner should be displayed next
 */
export type InformationBannerType = 1 | 2 | 3 | -1 | -2 | -3

export const INFORMATION_BANNER_START: InformationBannerType = 1
export const INFORMATION_BANNER_VISUAL: InformationBannerType = 2
export const INFORMATION_BANNER_TIME: InformationBannerType = 3

