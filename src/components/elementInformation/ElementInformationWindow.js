import React, { Component } from 'react'
import { MDBCard, MDBCardBody, MDBCardTitle } from 'mdbreact'
import ElementTypePicker from './ElementTypePicker'
import ElementButtonSettings from './ElementButtonSettings'
import ElementDisplaySettings from './ElementDisplaySettings'
import ElementLightSettings from './ElementLightSettings'
import { MDBCloseIcon } from "mdbreact"

export default class ElementInformationWindow extends Component {

    /**
     * Returns an array with the types (Button, Light, ...) of the given element
     */
    getElementTypes(element) {
        let elementTypes = []
        for (const interactionElement of this.props.interactionElements) {
            if (interactionElement.Name === element) {
                elementTypes.push(interactionElement.Type)
            }
        }
        for (const visualizationElement of this.props.visualizationElements) {
            if (visualizationElement.Name === element) {
                elementTypes.push(visualizationElement.Type)
            }
        }
        return elementTypes
    }

    /**
     * Listener for the escape key, to close window if escape is pressed
     */
    onKeyPressed(event){
        if(event.keyCode === 27) {
          this.props.setSelectedElement("")
        }
      }

      /**
       * Start listening to keydown events after mounting
       */
      componentDidMount(){
        document.addEventListener("keydown", this.onKeyPressed.bind(this), false)
      }

      /**
       * Stop listening to keydown events on unmounting
       */
      componentWillUnmount(){
        document.removeEventListener("keydown", this.onKeyPressed.bind(this), false)
      }

    render() {
        if (!this.props.applicationState.selectedElement || this.props.applicationState.selectedElement === "") {
            return null
        }
        return <>
            <div className="window-upper-right">
                <MDBCard>
                    <MDBCardBody>
                        <div className="row align-items-start">
                            <MDBCardTitle className="col-10">{this.props.applicationState.selectedElement}</MDBCardTitle>
                            <MDBCloseIcon className="col-2" onClick={() => this.props.setSelectedElement("")} />
                        </div>
                        
                        <ElementSettings
                            element={this.props.applicationState.selectedElement}
                            elementTypes={this.getElementTypes(this.props.applicationState.selectedElement)}
                            setSelectedElement={this.props.setSelectedElement}
                            addElementType={this.props.addElementType} />
                    </MDBCardBody>
                </MDBCard>
            </div>
        </>
    }
}

function ElementSettings(props) {
    if (!props.elementTypes || props.elementTypes.length === 0) {
        return <ElementTypePicker element={props.element} addElementType={props.addElementType} />
    }
    let output = []
    if (props.elementTypes.find(type => type === "Button")) {
        output.push(<ElementButtonSettings key="ButtonSettings" />)
    }
    if (props.elementTypes.find(type => type === "Display")) {
        output.push(<ElementDisplaySettings key="DisplaySettings"/>)
    }
    if (props.elementTypes.find(type => type === "Light")) {
        output.push(<ElementLightSettings key="LightSettings"/>)
    }
    return <>
        {output}
    </>
}
