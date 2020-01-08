import React from 'react'

export default class SituationsListElement extends React.Component {
    render() {
        return (
            <div
                className={"p-2 px-4 cursor-pointer " + (this.props.isSelected ? "blue lighten-5 font-weight-bold text-primary" : "")}
                onClick={() => this.props.setSituation(this.props.name)}>
                {this.props.name}
            </div>
        )
    }
}
