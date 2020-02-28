import React from 'react'
import { MDBIcon } from 'mdbreact'
import Logo from '../../assets/logo_font.png'
import { Actions } from '../../interfaces/actions.interface'
import { State } from '../../interfaces/state.interface'
import { ContextUtils } from '../../Utils/ContextUtils';

// TODO: (prio) Export function(JSZip)
// TODO: (prio) information banner should disappear when clicking timeout

type PropsType = {
    actions: Actions,
    isDemoMode: boolean,
    states: State[]
}

export default class Navbar extends React.Component<PropsType> {

    startDemoMode() {
        const startingStateID = ContextUtils.getStartingStateID(this.props.states)
        if (startingStateID === undefined) {
            // Model has no starting state!
            return
        }
        this.props.actions.setSelectedElement("", undefined)
        this.props.actions.setCurrentSituation(startingStateID)
        this.props.actions.setDemoMode(true)
    }

    stopDemoMode() {
        this.props.actions.setDemoMode(false)
    }

    render() {
        return <>
            <nav className="navbar  navbar-light bg-white">
                <div className="navbar-brand py-0">
                    <img src={Logo} alt="Logo" height="40px" />
                </div>
                <ul className="navbar-nav flex-row">
                    <li className="nav-item active">
                        <button type="button" className="btn btn-light p-2 px-3">
                            <MDBIcon icon="file-export" className="mx-1 text-primary" />
                            Export Model
                        </button>
                    </li>
                    <li className="nav-item active">
                        {this.props.isDemoMode ?
                            <button type="button" className="btn btn-danger py-2 px-3"
                                onClick={this.stopDemoMode.bind(this)}>
                                <MDBIcon far icon="stop-circle" className="mx-1" />
                                Stop test
                            </button>
                            :
                            <button type="button" className="btn btn-success py-2 px-3"
                                onClick={this.startDemoMode.bind(this)}>
                                <MDBIcon far icon="play-circle" className="mx-1" />
                                Run test
                            </button>
                        }
                    </li>
                </ul>
            </nav>
        </>
    }
}