import React from 'react'
import { MDBIcon } from 'mdbreact'
import Logo from '../../assets/logo_font.png'
import { Actions } from '../../interfaces/actions.interface'
import { ContextUtils } from '../../Utils/ContextUtils'
import { AppContext } from '../../interfaces/app-context.interface'
import { ModelExport } from '../../Utils/ModelExport'

// TODO: (prio) information banner should disappear when clicking somewhere

type PropsType = {
    actions: Actions,
    isDemoMode: boolean,
    context: AppContext
}

export default class Navbar extends React.Component<PropsType> {

    /**
     * Starts the "demo" mode to test current model
     */
    startDemoMode() {
        const startingStateID = ContextUtils.getStartingStateID(this.props.context.states)
        if (startingStateID === undefined) {
            // Model has no starting state!
            return
        }
        this.props.actions.setSelectedElement("", undefined)
        this.props.actions.setCurrentSituation(startingStateID)
        this.props.actions.setDemoMode(true)
    }

    /**
     * stops the demo mode
     */
    stopDemoMode() {
        this.props.actions.setDemoMode(false)
    }

    /**
     * Gets called if the export button is clicked. Exports the current model as zip and starts download
     */
    onExportClick(){
        const modelExport = new ModelExport(this.props.context)
        modelExport.startModelDownload()
    }

    render() {
        return <>
            <nav className="navbar  navbar-light bg-white">
                <div className="navbar-brand py-0">
                    <img src={Logo} alt="Logo" height="40px" />
                </div>
                <ul className="navbar-nav flex-row">
                    <li className="nav-item active">
                        <button type="button" className="btn btn-light p-2 px-3" onClick={this.onExportClick.bind(this)}>
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