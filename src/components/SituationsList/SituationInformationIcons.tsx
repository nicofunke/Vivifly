import React from 'react'
import { MDBIcon } from 'mdbreact'
import ReactTooltip from 'react-tooltip'

// Typed props
type PropsType = {
    isStart: boolean,
    hasTimeBasedChange: boolean,
    openTimeBasedOptions: () => void,
    id: number
}

/**
 * Component that displays information icons according to a situation
 */
export default class SituationInformationIcons extends React.Component<PropsType> {
    render() {
        return <>
            <div className="row no-gutters">
                <div className="col-6">
                    {this.props.isStart &&
                        <>
                            <MDBIcon icon="home" data-tip="Starting Situation" data-for="situation-start-tooltip" className="mr-1" />
                            <ReactTooltip place="right" effect="solid" id="situation-start-tooltip" />
                        </>}
                </div>
                <div className="col-6">
                    {this.props.hasTimeBasedChange &&
                        <>
                            <MDBIcon
                                icon="clock"
                                data-tip="Changes time-based"
                                data-for={`situation${this.props.id}-clock-tooltip`}
                                onClick={this.props.openTimeBasedOptions} />
                            <ReactTooltip place="right" effect="solid" id={`situation${this.props.id}-clock-tooltip`} />
                        </>}
                </div>
            </div>
        </>
    }
}