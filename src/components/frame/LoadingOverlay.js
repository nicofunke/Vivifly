import React from 'react'
import Logo from '../../assets/logo_font.png'

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
                        <div className="text-center col-12 mb-4"> <img src={Logo} alt="Logo" height="80px" /></div>
                        <div className="col-sm-4 offset-sm-4">
                            <div class="progress">
                                <div class="progress-bar blue-gradient" role="progressbar" style={{ width: `${100 * this.props.loadingProgress}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    }
}