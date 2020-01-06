import React from 'react'
import { MDBProgress } from 'mdbreact'

export default class LoadingOverlay extends React.Component {

    render() {
        // TODO: Loading Spinner
        if (this.props.isSpinner) {
            return <></>
        }
        // Progress Bar
        return <>
            <div className="position-fixed h-100 w-100 overflow-hidden bg-white loading-overlay">
                <div className="row h-100">
                    <div className="col-12 my-auto row">
                        <div className="text-center col-12 mb-2">{this.props.message}</div>
                        <div className="col-sm-6 offset-sm-3"><MDBProgress value={100 * this.props.loadingProgress} /></div>
                    </div>
                </div>
            </div>
        </>
    }
}