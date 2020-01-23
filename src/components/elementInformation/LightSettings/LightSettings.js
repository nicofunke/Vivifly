import React from 'react'
import LightColorPicker from './LightColorPicker'
import LightEmissionSlider from './LightEmissionSlider'
import { AppContext } from '../../Application/AppContext'
import { MDBIcon } from 'mdbreact'
import {ContextUtils} from '../../../Utils/ContextUtils'

export default class LightSettings extends React.Component {

    static contextType = AppContext


    /**
     * Changes the main color of the current element(Light) 
     */
    setColor(r,g,b){
        this.context.setLightColor(this.context.applicationState.selectedElement,r,g,b)
    }

    render() {
        const currentElement = this.context.applicationState.selectedElement
        return <>
            <button type="button"
                className="btn btn-link btn-sm p-0 text-default"
                onClick={() => this.context.removeElementType(currentElement, "Light")}>
                <MDBIcon icon="angle-left" /> This is no light
            </button>
            <h5 className="deep-orange-text"><MDBIcon icon="lightbulb" className="mr-1" /> Light </h5>
            <div>A light has a fixed color and can change its emission strength dependent on the situation</div>
            <label className="mt-3">Emission</label>
            <LightEmissionSlider />
            <label className="mt-3">Color: </label>
            <LightColorPicker colorChanged={this.setColor.bind(this)} color={ContextUtils.getLightEmissionColor(currentElement, this.context)} />
        </>
    }
}