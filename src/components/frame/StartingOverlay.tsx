import React from 'react'
import Logo from '../../assets/logo_font.png'
import LogoGrey from '../../assets/logo_font_grey.png'

type PropsType = { unityLoadingProgress: number }

export default class StartingOverlay extends React.Component<PropsType> {

    render() {
        if (this.props.unityLoadingProgress >= 1.0) {
            return null
        }
        return <>
            <div className="position-fixed h-100 w-100 overflow-hidden bg-white starting-overlay">
                <div className="row h-100">
                    <div className="col-12 my-auto row">
                        <div className="text-center col-12 mb-4">
                            <div className="position-relative d-inline-block" style={{ maxWidth: "230px" }}>
                                <div className="position-absolute h-100 overflow-hidden" style={{ width: `${100 * this.props.unityLoadingProgress}%` }}>
                                    <img src={Logo} alt="Logo" height="80px" />
                                </div>
                                <img src={LogoGrey} alt="Logo" height="80px" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    }
}