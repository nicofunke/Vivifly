import React, { Component } from 'react'
import { MDBCard, MDBCardBody } from 'mdbreact'
import ElementCardStartScreen from './ElementCardStartScreen'
import ButtonSettings from './ButtonSettings/ButtonSettings'
import DisplaySettings from './DisplaySettings/DisplaySettings'
import { AppContext, APP_CONTEXT_DEFAULT } from '../Application/AppContext'
import LightSettings from './LightSettings/LightSettings'
import { ContextUtils } from '../../Utils/ContextUtils'
import ElementCardHeader from './ElementCardHeader'
import KeyListener from '../core/KeyListener'

/**
 * Handler component for the element card. 
 * Displays the appropriate element cards for the currently selected element
 */
export default class ElementCardHandler extends Component {

    // Import context
    static contextType = AppContext
    context = APP_CONTEXT_DEFAULT

    /**
     * Closes the element card. Sets the currently selected element to none. 
     * Stops plane selection mode if it is currently active
     */
    closeElementCard() {
        if(!!this.context.applicationState.planeSelectionElementName){
            this.context.setPlaneSelectionMode(this.context.applicationState.selectedElement, false)
        }
        this.context.setSelectedElement("", undefined)
    }

    /**
     * Returns the correspondent settings for the current element as JSX
     */
    elementTypeSettings() {
        const elementTypes = ContextUtils.getElementTypes(this.context.applicationState.selectedElement, this.context)
        if (!elementTypes || elementTypes.length === 0) {
            return <ElementCardStartScreen />
        }
        let output: JSX.Element[] = []
        if (elementTypes.find(type => type === "Button")) {
            output.push(<div className="my-3" key="ButtonSettings"><ButtonSettings /></div>)
        }
        if (elementTypes.find(type => type === "Screen")) {
            output.push(<div className="my-3" key="DisplaySettings"><DisplaySettings /></div>)
        }
        if (elementTypes.find(type => type === "Light")) {
            output.push(<div className="my-3" key="LightSettings"><LightSettings /></div>)
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
            <KeyListener onEsc={this.closeElementCard.bind(this)} />
            <div className="window-upper-right">
                <MDBCard>
                    <div className="primary-color-dark text-white">
                        <MDBCardBody className="pb-1">
                            <ElementCardHeader
                                title={this.context.applicationState.selectedElement}
                                onClose={this.closeElementCard.bind(this)}
                                removeAllEffects={this.removeAllElementTypes.bind(this)}
                                addEffect={() => this.context.setNewElementTypeModalVisibility(true)} />
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
