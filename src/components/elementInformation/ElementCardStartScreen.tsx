import React from 'react'
import { AppContext, APP_CONTEXT_DEFAULT } from '../Application/AppContext'
import ElementTypePicker from '../core/ElementTypePicker'
import { ElementType } from '../../types/element-type.type';

/**
 * Component for the element card if element currently has no type.
 * Displays element type picker.
 */
export default class ElementCardStartScreen extends React.Component {

    // Import context
    static contextType = AppContext
    context = APP_CONTEXT_DEFAULT

    render() {
        const element = this.context.applicationState.selectedElement
        return <>
            <div className="row">
                <div className="col-11 offset-1 card-text">
                    <p>
                        What kind of element is this?
                    </p>
                    <div className="row">
                        <div className="col-9">
                            <ElementTypePicker
                                typeChosen={(type: ElementType) => this.context.addElementType(element, type)} />
                        </div>
                    </div>

                </div>
            </div>
        </>
    }
}
