import React from 'react'
import { MDBIcon } from 'mdbreact'
import Logo from '../../assets/logo_font.png'

export default class Navbar extends React.Component {

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
                        <button type="button" className="btn btn-success py-2 px-3">
                            <MDBIcon far icon="play-circle" className="mx-1" />
                            Run
                        </button>
                    </li>
                </ul>

            </nav>
        </>
    }
}