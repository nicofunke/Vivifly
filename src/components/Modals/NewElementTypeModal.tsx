import React from 'react'
import Modal from './Modal'
import ElementTypePicker from '../core/ElementTypePicker'
import { MDBBtn } from 'mdbreact'
import { ElementType } from '../../types/element-type.type'
import { Actions } from '../../interfaces/actions.interface';

type PropsType = {
    actions: Actions,
    element: string
}

/**
 * Component to display the modal to add a new element type
 */
export default class NewElementTypeModal extends React.Component<PropsType> {

    /**
     * Closes the current modal
     */
    closeModal() {
        this.props.actions.setNewElementTypeModalVisibility(false)
    }

    /**
     * Adds a new type to the current element and closes the modal
     * @param type Type that should be added to the current element
     */
    addElementTypeAndClose(type: ElementType) {
        this.props.actions.addElementType(this.props.element, type)
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