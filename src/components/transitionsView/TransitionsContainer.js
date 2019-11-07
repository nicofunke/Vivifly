import React from 'react'
import { MDBRow, MDBCol } from 'mdbreact'
import DiagramScreen from './DiagramScreen'

class TransitionsContainer extends React.Component {

    render() {
        return (
            <MDBRow className="h-100">
                <MDBCol size="8" className="p-0 h-100"><DiagramScreen/></MDBCol>
                <MDBCol size="4" className="pt-2">Options</MDBCol>
            </MDBRow>
        )
    }
}

export default TransitionsContainer