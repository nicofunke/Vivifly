import React from 'react'

class SituationsListElement extends React.Component {
    render() {
        return (
            <div
                className={"p-2 cursor-pointer " + (this.props.isSelected ? "bg-primary text-white" : "")}
                onClick={() => this.props.setSituation(this.props.name)}
            >
                {this.props.name}
            </div>
        )
    }
}

export default SituationsListElement