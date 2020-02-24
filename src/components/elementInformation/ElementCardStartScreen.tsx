import React from 'react'
import ElementTypePicker from '../core/ElementTypePicker'
import { ElementType } from '../../types/element-type.type'
import { Actions } from '../../interfaces/actions.interface'

type PropsType = {
    element: string,
    actions: Actions
}
/**
 * Component for the element card if element currently has no type.
 * Displays element type picker.
 */
export default class ElementCardStartScreen extends React.Component<PropsType> {

    render() {
        return <>
            <div className="row">
                <div className="col-11 offset-1 card-text">
                    <p>
                        What kind of element is this?
                    </p>
                    <div className="row">
                        <div className="col-9">
                            <ElementTypePicker
                                typeChosen={(type: ElementType) =>
                                    this.props.actions.addElementType(this.props.element, type)} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    }
}
