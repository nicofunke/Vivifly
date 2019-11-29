import React from 'react'
import { MDBContainer, MDBRow, MDBCol } from "mdbreact"
import UnityScreen from '../frame/UnityScreen'
import SituationsList from '../frame/SituationsList'
import ElementInformation from '../elementInformation/ElementInformationWindow'

class ApplicationView extends React.Component {

    render() {
        return (
            <div className="h-100">
                <UnityScreen
                    setSelectedElement={this.props.setSelectedElement}
                    selectedElementName={this.props.model.selectedElementName} />
                <MDBContainer fluid className="h-100">
                    <MDBRow className="h-100">
                        <MDBCol size="2" className="p-0 h-100">
                            <SituationsList
                                situations={this.props.model.situations}
                                currentSituation={this.props.model.currentSituationName}
                                setSituation={this.props.setSituation} />
                        </MDBCol>
                        <ElementInformation
                            element={this.props.selectedElement}
                        />
                    </MDBRow>
                </MDBContainer>
            </div>
        )
    }
}

export default ApplicationView