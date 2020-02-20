import React, { Component } from 'react'
import { MDBCard, MDBCardBody } from 'mdbreact'
import ElementTypePicker from './ElementTypePicker'
import ButtonSettings from './ButtonSettings/ButtonSettings'
import DisplaySettings from './DisplaySettings/DisplaySettings'
import { AppContext, APP_CONTEXT_DEFAULT } from '../Application/AppContext'
import LightSettings from './LightSettings/LightSettings'
import { ContextUtils } from '../../Utils/ContextUtils'
import ElementInformationHeader from './ElementInformationHeader'
import KeyListener from '../core/KeyListener'

export default class ElementInformationWindowHandler extends Component {

    // Import context
    static contextType = AppContext
    context = APP_CONTEXT_DEFAULT

    /**
     * Gets called when escape is pressed. Sets the currently selected element to none
     */
    onEscape() {
        this.context.setSelectedElement("", undefined)
    }

    /**
     * Returns the correspondent settings for the current element as JSX
     */
    elementTypeSettings() {
        const elementTypes = ContextUtils.getElementTypes(this.context.applicationState.selectedElement, this.context)
        if (!elementTypes || elementTypes.length === 0) {
            return <ElementTypePicker />
        }
        let output: JSX.Element[] = []
        if (elementTypes.find(type => type === "Button")) {
            output.push(<div className="my-2" key="ButtonSettings"><ButtonSettings /></div>)
        }
        if (elementTypes.find(type => type === "Screen")) {
            output.push(<div className="my-2" key="DisplaySettings"><DisplaySettings /></div>)
        }
        if (elementTypes.find(type => type === "Light")) {
            output.push(<div className="my-2" key="LightSettings"><LightSettings /></div>)
        }
        return <>
            {output}
        </>
    }

    /**
     * Removes all type of effects from the current element
     */
    removeAllElementTypes(){
        const element = this.context.applicationState.selectedElement
        const types = ContextUtils.getElementTypes(element, this.context)
        types.forEach(type => {
            this.context.removeElementType(element, type)
        })
    }

    render() {
        if (!this.context.applicationState.selectedElement || this.context.applicationState.selectedElement === "") {
            return null
        }
        return <>
            <KeyListener onEsc={this.onEscape.bind(this)} />
            <div className="window-upper-right">
                <MDBCard>
                    <div className="primary-color-dark text-white">
                        <MDBCardBody className="pb-1">
                            <ElementInformationHeader
                                title={this.context.applicationState.selectedElement}
                                onClose={() => this.context.setSelectedElement("", undefined)}
                                removeAllEffects={this.removeAllElementTypes.bind(this)} />
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
