import React from 'react'
import { AppContext } from '../Application/AppContext'

export default class SituationsListElement extends React.Component {
    render() {
        const isSelected = this.context.applicationState.currentSituationID === this.props.id
        return (
            <div
                className={"p-2 px-4 cursor-pointer " + (isSelected ? "blue lighten-5 font-weight-bold text-primary" : "")}
                onClick={() => this.context.setCurrentSituation(this.props.id)}>
                { (!!this.props.name && this.props.name !== "" ? this.props.name : "New Situation"  )}
            </div>
        )
    }
}

SituationsListElement.contextType = AppContext
