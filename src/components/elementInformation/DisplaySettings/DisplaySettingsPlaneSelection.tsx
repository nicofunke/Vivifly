import React from 'react'
import { MDBBtn, MDBIcon } from 'mdbreact'

// Type for props
type PropsType = {
    stopPlaneSelectionMode: () => void
}

/**
 * Display settings that get displayed during plane selection mode.
 * Only allows to stop plane selection mode
 */
export default class DisplaySettingsPlaneSelection extends React.Component<PropsType> {

    render() {
        return <>
            <div className="mb-1" >
                Display
            </div>
            <div className="card-text">
                <p>Please click on the surface of the element where the screen should appear</p>
                <MDBBtn
                    color="light"
                    onClick={this.props.stopPlaneSelectionMode}
                >
                    <MDBIcon icon="sync-alt" className="mr-1" />
                    Restore previous surface
                </MDBBtn>
            </div>
        </>
    }
}