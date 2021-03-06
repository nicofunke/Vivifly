import React from 'react'

/**
 * Typing for components props
 */
type PropsType = {
    alpha: number | undefined,
    alphaChanged: (alpha: number) => void
}

/**
 * Slider component to change the alpha value of a light
 */
export default class LightEmissionSlider extends React.Component<PropsType> {

    /**
     * Method gets called if the slider value changes
     * Calls the method from props to change the emission strength(alpha value) 
     * @param event slider change event
     */
    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const alpha = parseFloat(event.target.value) / 100.0
        this.props.alphaChanged(alpha)
    }

    render() {
        // slider has integer values from 1 to 100 while alpha is decimal
        const sliderValue = (this.props.alpha || 0.0) * 100
        return <input type="range" className="custom-range" onChange={this.handleChange.bind(this)} value={sliderValue} />
    }
}