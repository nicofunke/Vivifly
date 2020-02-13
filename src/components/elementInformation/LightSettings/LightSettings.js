import React from 'react'
import LightColorPicker from './LightColorPicker'
import LightEmissionSlider from './LightEmissionSlider'
import { AppContext } from '../../Application/AppContext'
import { MDBIcon } from 'mdbreact'
import { ContextUtils } from '../../../Utils/ContextUtils'
import { ELEMENT_TYPE_LIGHT } from '../../../types/element-type.type'
import ReactTooltip from 'react-tooltip'

export default class LightSettings extends React.Component {

    static contextType = AppContext


    /**
     * Changes the main color of the current element(Light) 
     */
    setColor(r, g, b) {
        this.context.setLightColor(this.context.applicationState.selectedElement, r, g, b)
    }

    /**
     * Changes the emission strength of the current element in the current situation 
     */
    setEmission(alpha) {
        this.context.setLightEmission(this.context.applicationState.selectedElement, this.context.applicationState.currentSituationID, alpha)
    }

    render() {
        const currentElement = this.context.applicationState.selectedElement
        const currentSituationID = this.context.applicationState.currentSituationID
        return <>
            <div className="row">
                <div className="col-1 p-0 d-flex justify-content-center align-items-center">
                    <MDBIcon far icon="lightbulb" size="lg" className="deep-orange-text" />
                </div>
                <div className="col-11">
                    <div className="mb-1" >
                        <div className="d-inline">Light</div>
                        <div className="d-inline-block float-right">
                            <MDBIcon far icon="trash-alt"
                                className="mx-2 hover-icon"
                                data-tip="Remove light effect"
                                data-for="element-light-actions"
                                onClick={() => this.context.removeElementType(this.context.applicationState.selectedElement, ELEMENT_TYPE_LIGHT)}
                            />
                            <ReactTooltip place="bottom" effect="solid" id="element-light-actions" />
                        </div>
                    </div>
                    <div class="card-text">
                        <div>A light has a fixed color and can change its emission strength dependent on the situation</div>
                        <label className="mt-1">Current Emission:</label>
                        <LightEmissionSlider alphaChanged={this.setEmission.bind(this)} alpha={ContextUtils.getLightEmissionStrength(currentElement, currentSituationID, this.context)} />
                        <label className="mt-1">Main Color: </label>
                        <LightColorPicker colorChanged={this.setColor.bind(this)} color={ContextUtils.getLightEmissionColor(currentElement, this.context)} />
                    </div>
                </div>
            </div>
        </>
    }
}