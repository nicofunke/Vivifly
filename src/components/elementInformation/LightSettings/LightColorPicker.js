import React from 'react'
import { HuePicker } from 'react-color'

export default class LightColorPicker extends React.Component {

    /**
     * Gets called if the color gets changed by using the slider and sends the new color to parent 
     */
    handleChange(color, event) {
        const rgbColor = color.rgb
        this.props.colorChanged(rgbColor.r / 255, rgbColor.g / 255, rgbColor.b / 255)
    }

    /**
     * Converts a relative color (0-1) to absolute(0-255)
     */
    relativeColorToAbsolute(relativeColor) {
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