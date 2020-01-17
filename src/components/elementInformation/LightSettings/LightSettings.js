import React from 'react'
import LightColorPicker from './LightColorPicker'
import LightEmissionSlider from './LightEmissionSlider'
import { AppContext } from '../../Application/AppContext'
import { MDBIcon } from 'mdbreact'

export default class LightSettings extends React.Component {

    static contextType = AppContext

    render() {
        return <>
            <button type="button"
                className="btn btn-link btn-sm p-0 text-default"
                onClick={() => this.context.removeElementType(this.context.applicationState.selectedElement, "Light")}>
                <MDBIcon icon="angle-left" /> This is no light
            </button>
            <h5 className="deep-orange-text"><MDBIcon icon="lightbulb" className="mr-1" /> Light </h5>
            <div>A light has a fixed color and can change its emission strength dependent on the situation</div>
            <label className="mt-3">Emission</label>
            <LightEmissionSlider />
            <label className="mt-3">Color: </label>
            <LightColorPicker />
        </>
    }
}