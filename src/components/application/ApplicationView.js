import React from 'react'
import { MDBContainer, MDBRow, MDBCol } from 'mdbreact'
import UnityScreen from '../Frame/UnityScreen'
import SituationsList from '../SituationsList/SituationsList'
import ElementInformationWindow from '../ElementInformation/ElementInformationWindow'

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
                        <ElementInformationWindow
                            element={this.props.selectedElement}
                            setSelectedElement={this.props.setSelectedElement}
                            setElementType={this.props.setElementType}
                        />
                    </MDBRow>
                </MDBContainer>
            </div>
        )
    }
}

export default ApplicationView