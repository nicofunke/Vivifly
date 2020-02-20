import React from 'react'
import { AppContext, APP_CONTEXT_DEFAULT } from '../Application/AppContext'
import Modal from './Modal'
import ElementTypePicker from '../core/ElementTypePicker'
import { MDBBtn } from 'mdbreact'
import { ElementType } from '../../types/element-type.type';

/**
 * Component to display the modal to add a new element type
 */
export default class NewElementTypeModal extends React.Component {

    // Import context
    static contextType = AppContext
    context = APP_CONTEXT_DEFAULT

    /**
     * Closes the current modal
     */
    closeModal() {
        this.context.setNewElementTypeModalVisibility(false)
    }

    /**
     * Adds a new type to the current element and closes the modal
     * @param type Type that should be added to the current element
     */
    addElementTypeAndClose(type: ElementType) {
        this.context.addElementType(this.context.applicationState.selectedElement, type)
        this.closeModal()
    }

    render() {
        return <>
            <Modal title="Add new effect" onClose={this.closeModal.bind(this)}>
                <p>Which kind of effect do you want to add to this element?</p>
                <div className="row">
                    <div className="col-10 offset-1">
                        <ElementTypePicker typeChosen={this.addElementTypeAndClose.bind(this)} />
                    </div>
                </div>
                <div className="mt-2">
                    <MDBBtn
                        color="light"
                        onClick={this.closeModal.bind(this)}>Cancel</MDBBtn>
                </div>
            </Modal>
        </>
    }
}