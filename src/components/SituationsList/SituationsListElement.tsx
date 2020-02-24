import React from 'react'
import { MDBIcon } from 'mdbreact'
import ReactTooltip from 'react-tooltip'
import SituationOptions from './SituationOptions'
import SituationInformationIcons from './SituationInformationIcons'

// Typed props
type PropsType = {
    name: string,
    isSelected: boolean,
    isStart: boolean,
    hasTimeBasedTransition: boolean,
    id: number,
    openTimeBasedOptions: () => void,
    isProperSituationName: (newName: string) => boolean,
    onElementClick: () => void,
    renameSituation: (newName: string) => void,
    removeSituation: () => void
}

// TODO: (optional) Unreachable situation warning

export default class SituationsListElement extends React.Component<PropsType> {

    // Default state
    state = {
        editMode: false,            // Boolean if the name is currently editable
        previousSituationName: ""   // Temp variable to hold the previous name while editing the name
    }

    /**
     * Gets called if a double click is triggered on the situation name. Starts the name editing mode
     */
    onDoubleClick() {
        if (!this.props.isSelected) {
            return
        }
        this.setState({ editMode: true, previousSituationName: this.props.name })
    }

    /**
     * Stores the new situation name if the input was changed
     * @param event Input change event
     */
    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value
        this.props.renameSituation(value)
    }

    /**
     * Gets called if a key was pressed. 
     * Ends the edit mode on enter
     * @param event Key up event
     */
    onKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            this.endEditMode()
        }
    }

    /**
     * Ends the edit mode. Resets the situation name if the current value is not valid
     */
    endEditMode() {
        if (!this.props.isProperSituationName(this.props.name)) {
            this.props.renameSituation(this.state.previousSituationName)
        }
        this.setState({ editMode: false, previousSituationName: "" })
    }

    // TODO: (prio) Set Start situation
    render() {
        return (
            <div
                className={"p-2 situation-list-element " + (this.props.isSelected ? "blue lighten-5 font-weight-bold text-primary" : "")}
                onClick={this.props.onElementClick}>
                <div className="row no-gutters">

                    <div className="col-2">
                        <SituationInformationIcons
                            isStart={this.props.isStart}
                            hasTimeBasedTransition={this.props.hasTimeBasedTransition}
                            openTimeBasedOptions={this.props.openTimeBasedOptions}
                            id={this.props.id} />
                    </div>
                    <div
                        className="text-trim col-9"
                        onDoubleClick={this.onDoubleClick.bind(this)}>
                        {this.state.editMode ?
                            // Input field to change name
                            <input className="form-control form-control-sm"
                                type="text"
                                onKeyUp={this.onKeyUp.bind(this)}
                                onChange={this.handleChange.bind(this)}
                                value={this.props.name}
                                onBlur={this.endEditMode.bind(this)}
                                onFocus={event => event.target.select()}
                                autoFocus />
                            // Normal name display
                            : (!!this.props.name && this.props.name !== "" ? this.props.name : "New Situation")

                        }
                    </div>


                    <div
                        className={"col-1 hover-icon" + (this.props.isSelected ? "" : " icon-invisible")}
                        data-tip="options"
                        data-event='click focus'
                        data-for={"situation" + this.props.id + "-options-tooltip"}  >
                        <MDBIcon icon="ellipsis-v" />

                    </div>

                    <ReactTooltip
                        id={"situation" + this.props.id + "-options-tooltip"}
                        globalEventOff="click"
                        aria-haspopup="true"
                        place="right"
                        effect="solid"
                        type="light"
                        className='situation-options-tooltip'>
                        <SituationOptions
                            onRenameClick={() => this.setState({ editMode: true, previousSituationName: this.props.name })}
                            onDeleteClick={this.props.removeSituation}
                            onTimeBasedClick={this.props.openTimeBasedOptions}
                            hasTimeBasedTransition={this.props.hasTimeBasedTransition}
                            onStartClick={() => console.log("Set start situation")}
                            situationID={this.props.id} />
                    </ReactTooltip>

                </div>
            </div>
        )
    }
}
