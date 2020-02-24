import React from 'react'
import { HuePicker, ColorResult } from 'react-color'
import { Color } from '../../../interfaces/color.interface'

/**
 * Define type for props
 */
type PropsType = {
    colorChanged: (color: Color) => void,
    color: Color | undefined
}

/**
 * Slider component to choose a color for a light
 */
export default class LightColorPicker extends React.Component<PropsType> {

    /**
     * Gets called if the color gets changed by using the slider. Sends the new color to parent 
     * @param colorResult   Color result object returned by the color slider
     */
    handleChange(colorResult: ColorResult) {
        const color: Color = {
            r: colorResult.rgb.r / 255,
            g: colorResult.rgb.g / 255,
            b: colorResult.rgb.b / 255
        }
        this.props.colorChanged(color)
    }

    /**
     * Converts a relative color (0-1) to absolute(0-255) 
     * @param relativeColor     Relative color
     */
    relativeColorToAbsolute(relativeColor: Color | undefined): Color {
        if (!relativeColor) {
            return { r: 0, g: 0, b: 0 }
        }
        const absoluteColor = { r: relativeColor.r * 255, g: relativeColor.g * 255, b: relativeColor.b * 255 }
        return absoluteColor
    }

    render() {
        return (
            <HuePicker
                onChange={this.handleChange.bind(this)}
                width="100%"
                color={this.relativeColorToAbsolute(this.props.color)} />)
    }
}
