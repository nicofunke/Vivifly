import React, { Component } from 'react'
import { MDBCard, MDBCardBody } from 'mdbreact'
import ElementCardStartScreen from './ElementCardStartScreen'
import ButtonSettings from './ButtonSettings/ButtonSettings'
import DisplaySettings from './DisplaySettings/DisplaySettings'
import LightSettings from './LightSettings/LightSettings'
import { ContextUtils } from '../../Utils/ContextUtils'
import ElementCardHeader from './ElementCardHeader'
import KeyListener from '../core/KeyListener'
import { Actions } from '../../interfaces/actions.interface'
import { VisualizationElement } from '../../interfaces/visualization-element.interface'
import { InteractionElement } from '../../interfaces/interaction-element.interface'
import { Transition } from '../../interfaces/transition.interface'
import { State } from '../../interfaces/state.interface'
import { Vector3 } from '../../interfaces/vector3.interface'

type PropsType = {
    actions: Actions,
    element: string,
    planeSelectionElementName?: string,
    visualizationElements: VisualizationElement[],
    interactionElements: InteractionElement[],
    transitions: Transition[],
    states: State[],
    currentSituationID: number,
    clickedPlane?: Vector3
}

// TODO: (optional) Drag and drop

/**
 * Handler component for the element card. 
 * Displays the appropriate element cards for the currently selected element
 */
export default class ElementCardHandler extends Component<PropsType> {

    /**
     * Closes the element card. Sets the currently selected element to none. 
     * Stops plane selection mode if it is currently active
     */
    closeElementCard() {
        if (!!this.props.planeSelectionElementName) {
            this.props.actions.setPlaneSelectionMode(this.props.element, false)
        }
        this.props.actions.setSelectedElement("", undefined)
    }

    /**
     * Returns the correspondent settings for the current element as JSX
     */
    elementTypeSettings(): JSX.Element {
        const elementTypes = ContextUtils.getElementTypes(this.props.element,
            this.props.interactionElements, this.props.visualizationElements)
        if (!elementTypes || elementTypes.length === 0) {
            return <ElementCardStartScreen
                actions={this.props.actions}
                element={this.props.element} />
        }
        let output: JSX.Element[] = []
        if (elementTypes.find(type => type === "Button")) {
            output.push(
                <div className="my-3" key="ButtonSettings">
                    <ButtonSettings
                        element={this.props.element}
                        transitions={this.props.transitions}
                        states={this.props.states}
                        actions={this.props.actions}
                        currentSituationID={this.props.currentSituationID} />
                </div>)
        }
        if (elementTypes.find(type => type === "Screen")) {
            output.push(
                <div className="my-3" key="DisplaySettings">
                    <DisplaySettings
                        visualizationElements={this.props.visualizationElements}
                        element={this.props.element}
                        clickedPlane={this.props.clickedPlane}
                        actions={this.props.actions}
                        currentSituationID={this.props.currentSituationID}
                        states={this.props.states}
                        planeSelectionElementName={this.props.planeSelectionElementName} />
                </div>)
        }
        if (elementTypes.find(type => type === "Light")) {
            output.push(
                <div className="my-3" key="LightSettings">
                    <LightSettings
                        actions={this.props.actions}
                        element={this.props.element}
                        currentSituationID={this.props.currentSituationID}
                        states={this.props.states}
                        visualizationElements={this.props.visualizationElements} />
                </div>)
        }
        return <>
            {output}
        </>
    }

    /**
     * Removes all type of effects from the current element
     */
    removeAllElementTypes() {
        const types = ContextUtils.getElementTypes(this.props.element,
            this.props.interactionElements, this.props.visualizationElements)
        types.forEach(type => {
            this.props.actions.removeElementType(this.props.element, type)
        })
    }

    render() {
        if (this.props.element === "") {
            return null
        }
        return <>
            <KeyListener onEsc={this.closeElementCard.bind(this)} />
            <div className="window-upper-right">
                <MDBCard>
                    <div className="primary-color-dark text-white">
                        <MDBCardBody className="pb-1">
                            <ElementCardHeader
                                title={this.props.element}
                                onClose={this.closeElementCard.bind(this)}
                                removeAllEffects={this.removeAllElementTypes.bind(this)}
                                addEffect={() => this.props.actions.setNewElementTypeModalVisibility(true)} />
                        </MDBCardBody>
                    </div>
                    <MDBCardBody>
                        {this.elementTypeSettings()}
                    </MDBCardBody>
                </MDBCard>
            </div>
        </>
    }
}
