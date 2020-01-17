import React from 'react'
import { HuePicker } from 'react-color'

export default class LightColorPicker extends React.Component {

    handleChange(color, event) {
        console.log(color.rgb)
    }

    render() {
        return <HuePicker onChange={this.handleChange} width={360}/>
    }
}