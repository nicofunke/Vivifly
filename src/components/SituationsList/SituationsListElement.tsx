import React from 'react'
import { MDBIcon } from 'mdbreact'
import ReactTooltip from 'react-tooltip'

// Typed props
type PropsType = {
    name: string,
    onElementClick: () => void,
    renameSituation: (newName: string) => void,
    isSelected: boolean,
    isProperSituationName: (newName: string) => boolean,
    isStart: boolean
}

export default class SituationsListElement extends React.Component<PropsType> {

    state = {
        editMode: false,
        previousSituationName: ""
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
    endEditMode(){
        if(!this.props.isProperSituationName(this.props.name)){
            this.props.renameSituation(this.state.previousSituationName)
        }
        this.setState({editMode: false, previousSituationName: ""})
    }

    render() {
        return (
            <div
                className={"p-2 situation-list-element " + (this.props.isSelected ? "blue lighten-5 font-weight-bold text-primary" : "")}
                onClick={this.props.onElementClick}>
                <div className="row">

                    <div className="col-2">
                        {this.props.isStart &&
                            <>
                                <MDBIcon icon="home" data-tip="Start Situation" data-for="situation-start-tooltip" />
                                <ReactTooltip place="right" effect="solid" id="situation-start-tooltip" />
                            </>}
                    </div>
                    <div
                        className={"text-trim col-" + (this.props.isSelected ? "8" : "10")}
                        onDoubleClick={this.onDoubleClick.bind(this)}>
                        {this.state.editMode ?
                            // Input field to change name
                            <input className="form-control form-control-sm"
                                type="text"
                                onKeyUp={this.onKeyUp.bind(this)}
                                onChange={this.handleChange.bind(this)}
                                value={this.props.name}
                                onBlur={this.endEditMode.bind(this)}
                                autoFocus />
                            // Normal name display
                            : (!!this.props.name && this.props.name !== "" ? this.props.name : "New Situation")

                        }
                    </div>
                    {this.props.isSelected &&
                        <div className="col-2">
                            <MDBIcon far icon="clock" className="hover-icon" data-tip="Add time-based transition" data-for="situation-clock-tooltip" />
                            <ReactTooltip place="top" effect="solid" id="situation-clock-tooltip" />
                        </div>}
                </div>
            </div>
        )
    }
}
