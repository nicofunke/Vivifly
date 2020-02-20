import React from 'react'
import { MDBIcon } from 'mdbreact'
import { AppContext, APP_CONTEXT_DEFAULT } from '../Application/AppContext'
import { ElementType, ELEMENT_TYPE_BUTTON, ELEMENT_TYPE_LIGHT, ELEMENT_TYPE_SCREEN } from '../../types/element-type.type';

type PropsType = {
    typeChosen: (type: ElementType) => void
}

/**
 * Component that displays buttons for each element type
 */
export default class ElementTypePicker extends React.Component<PropsType> {

    // Import context
    static contextType = AppContext
    context = APP_CONTEXT_DEFAULT

    render() {
        return <>
            <div className="row">
                <div className="col-4 d-flex flex-column align-items-center justify-content-center cursor-pointer element-type-button"
                    onClick={() => this.props.typeChosen(ELEMENT_TYPE_BUTTON)}>
                    <div className="d-flex justify-content-center align-items-center light-green text-white rounded-circle">
                        <MDBIcon icon="fingerprint" size="lg" />
                    </div>
                    <span>Button</span>
                </div>
                <div className="col-4 d-flex flex-column align-items-center justify-content-center cursor-pointer element-type-button"
                    onClick={() => this.props.typeChosen(ELEMENT_TYPE_LIGHT)}>
                    <div className="d-flex justify-content-center align-items-center deep-orange text-white rounded-circle">
                        <MDBIcon far icon="lightbulb" size="lg" />
                    </div>
                    <span>Light</span>
                </div>
                <div className="col-4 d-flex flex-column align-items-center justify-content-center cursor-pointer element-type-button"
                    onClick={() => this.props.typeChosen(ELEMENT_TYPE_SCREEN)}>
                    <div className="d-flex justify-content-center align-items-center cyan text-white rounded-circle">
                        <MDBIcon icon="desktop" size="lg" />
                    </div>
                    <span>Display</span>
                </div>
            </div>
        </>
    }
}
