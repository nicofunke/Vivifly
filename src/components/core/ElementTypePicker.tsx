import React from 'react'
import { MDBIcon } from 'mdbreact'
import { ElementType, ELEMENT_TYPE_BUTTON, ELEMENT_TYPE_LIGHT, ELEMENT_TYPE_SCREEN } from '../../types/element-type.type';
import ReactTooltip from 'react-tooltip';

type PropsType = {
    typeChosen: (type: ElementType) => void,
    existingTypes: ElementType[]
}

/**
 * Component that displays buttons for each element type
 */
export default class ElementTypePicker extends React.Component<PropsType> {
    render() {
        const isButton = this.props.existingTypes.find(type => type === ELEMENT_TYPE_BUTTON)
        const isLight = this.props.existingTypes.find(type => type === ELEMENT_TYPE_LIGHT)
        const isScreen = this.props.existingTypes.find(type => type === ELEMENT_TYPE_SCREEN)
        return <>
            <div className="row">

                <div className="col-4"
                    data-tip={isButton ? "Element is already a button" : ""}
                    data-for={isButton ? "element-type-exists" : ""}>
                    <div className={"d-flex flex-column align-items-center justify-content-center cursor-pointer element-type-button"
                        + (isButton ? " disabled" : "")}
                        onClick={() => this.props.typeChosen(ELEMENT_TYPE_BUTTON)}>
                        <div className="d-flex justify-content-center align-items-center light-green text-white rounded-circle">
                            <MDBIcon icon="fingerprint" size="lg" />
                        </div>
                        <span>Button</span>
                    </div>
                </div>
                <div className="col-4"
                    data-tip={isLight ? "Element is already a light" : ""}
                    data-for={isLight ? "element-type-exists" : ""}>
                    <div className={"d-flex flex-column align-items-center justify-content-center cursor-pointer element-type-button"
                        + (isLight ? " disabled" : "")}
                        onClick={() => this.props.typeChosen(ELEMENT_TYPE_LIGHT)}>
                        <div className="d-flex justify-content-center align-items-center deep-orange text-white rounded-circle">
                            <MDBIcon far icon="lightbulb" size="lg" />
                        </div>
                        <span>Light</span>
                    </div>
                </div>
                <div className="col-4 "
                    data-tip={isScreen ? "Element is already a display" : ""}
                    data-for={isScreen ? "element-type-exists" : ""}>
                    <div className={"d-flex flex-column align-items-center justify-content-center cursor-pointer element-type-button"
                        + (isScreen ? " disabled" : "")}
                        onClick={() => this.props.typeChosen(ELEMENT_TYPE_SCREEN)}>
                        <div className="d-flex justify-content-center align-items-center cyan text-white rounded-circle">
                            <MDBIcon icon="desktop" size="lg" />
                        </div>
                        <span>Display</span>
                    </div>
                </div>
                <ReactTooltip place="bottom" effect="solid" id="element-type-exists" />
            </div>
        </>
    }
}
