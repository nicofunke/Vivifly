import React from 'react'

export default class LightEmissionSlider extends React.Component {
    
    /**
     * Method gets called if the slider value changes
     * Calls the method from props to change the emission strength(alpha value) 
     * @param event slider change event
     */
    handleChange(event){
        const alpha = event.target.value / 100.0
        this.props.alphaChanged(alpha)
    }
    
    render() {
        // slider has integer values from 1 to 100 while alpha is decimal
        const sliderValue = this.props.alpha * 100
        return <input type="range" className="custom-range"  onChange={this.handleChange.bind(this)} value={sliderValue}/>
    }
}