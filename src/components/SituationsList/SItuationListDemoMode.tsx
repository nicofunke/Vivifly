import React from 'react'

type PropsType = {
    currentSituationName?: string
}

/**
 * Component that displays the current situation while in demo mode
 */
export default class SituationsListDemoMode extends React.Component<PropsType> {
    render() {
        return <div className=" w-100 bg-white">
            <h5 className="text-white bg-danger p-2">TEST MODE</h5>
            <div className="text-dark w-100 pb-2 px-2">
                <small>CURRENT SITUATION:</small>
                <h4>{this.props.currentSituationName}</h4>
            </div>
        </div>
    }
}