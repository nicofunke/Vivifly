import React from 'react'
import LightColorPicker from './LightColorPicker'
import LightEmissionSlider from './LightEmissionSlider'
import { MDBIcon } from 'mdbreact'
import { ContextUtils } from '../../../Utils/ContextUtils'
import { ELEMENT_TYPE_LIGHT } from '../../../types/element-type.type'
import ReactTooltip from 'react-tooltip'
import { Color } from '../../../interfaces/color.interface'
import { Actions } from '../../../interfaces/actions.interface'
import { State } from '../../../interfaces/state.interface'
import { VisualizationElement } from '../../../interfaces/visualization-element.interface'

type PropsType = {
    actions: Actions,
    element: string,
    currentSituationID: number,
    states: State[],
    visualizationElements: VisualizationElement[]
}

/**
 * Settings for light elements
 */
export default class LightSettings extends React.Component<PropsType> {

    /**
     * Changes the main color of the current element(Light) 
     */
    setColor(color: Color) {
        this.props.actions.setLightColor(this.props.element, color)
    }

    /**
     * Changes the emission strength of the current element in the current situation 
     */
    setEmission(alpha: number) {
        this.props.actions.setLightEmission(this.props.element, this.props.currentSituationID, alpha)
    }

    render() {
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
                                onClick={() => this.props.actions.removeElementType(this.props.element, ELEMENT_TYPE_LIGHT)}
                            />
                            <ReactTooltip place="bottom" effect="solid" id="element-light-actions" />
                        </div>
                    </div>
                    <div className="card-text">
                        <div>A light has a fixed color and can change its emission strength dependent on the situation</div>
                        <label className="mt-1">Current Emission:</label>
                        <LightEmissionSlider
                            alphaChanged={this.setEmission.bind(this)}
                            alpha={ContextUtils.getLightEmissionStrength(this.props.element, this.props.currentSituationID, this.props.states)} />
                        <label className="mt-1">Main Color: </label>
                        <LightColorPicker
                            colorChanged={this.setColor.bind(this)}
                            color={ContextUtils.getLightEmissionColor(this.props.element, this.props.visualizationElements)} />
                    </div>
                </div>
            </div>
        </>
    }
}