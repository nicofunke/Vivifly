import React from 'react'

export default class LightEmissionSlider extends React.Component {
    
    handleChange(event){
        const alpha = event.target.value / 100.0
        console.log(alpha)
    }
    
    render() {
        return <input type="range" className="custom-range" onChange={this.handleChange} />
    }
}