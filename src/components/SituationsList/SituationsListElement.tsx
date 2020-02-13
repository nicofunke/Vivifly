import React from 'react'
import { MDBIcon } from 'mdbreact'
import ReactTooltip from 'react-tooltip'

// Typed props
type PropsType = {
    name: string,
    onElementClick: () => void,
    isSelected: boolean,
    isStart: boolean
}

export default class SituationsListElement extends React.Component<PropsType> {

    state = {
        editMode: false,
        previousSituationName: ""
    }

    onDoubleClick(){
        if(!this.props.isSelected){
            return
        }
        this.setState({editMode: true})
        // TODO: Change situation name
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
                    <div className={"text-trim col-" + ( this.props.isSelected ? "8" : "10")} onDoubleClick={this.onDoubleClick.bind(this)}>
                        {(!!this.props.name && this.props.name !== "" ? this.props.name : "New Situation")}
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
