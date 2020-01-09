import React from 'react'
import { MDBContainer, MDBRow, MDBCol } from 'mdbreact'
import UnityScreen from '../Frame/UnityScreen'
import SituationsList from '../SituationsList/SituationsList'
import ElementInformationWindow from '../ElementInformation/ElementInformationWindow'
import StartingOverlay from '../Frame/StartingOverlay'
import WelcomeWindow from '../InformationWindows/WelcomeWindow'
import NewSituationPopup from '../InformationWindows/NewSituationPopup'

/**
 * This class is responsible to display the proper views for the current state
 * It gets the state as props
 */
export default class ViewContainer extends React.Component {

    render() {
        return <>
            <StartingOverlay loadingProgress={this.props.applicationState.unityLoadingProgress} />
            <WelcomeWindow applicationState={this.props.applicationState} />
            <NewSituationPopup 
                applicationState={this.props.applicationState}
                states={this.props.states} 
                renameSituation={this.props.renameSituation}/>
            <div className="h-100">
                <UnityScreen
                    setSelectedElement={this.props.setSelectedElement}
                    applicationState={this.props.applicationState}
                    setUnityLoadingProgress={this.props.setUnityLoadingProgress} />
                <MDBContainer fluid className="h-100">
                    <MDBRow className="h-100">
                        <MDBCol size="2" className="p-0 h-100">
                            <SituationsList
                                states={this.props.states}
                                applicationState={this.props.applicationState}
                                setCurrentSituation={this.props.setCurrentSituation} />
                        </MDBCol>
                        <ElementInformationWindow
                            applicationState={this.props.applicationState}
                            interactionElements={this.props.interactionElements}
                            visualizationElements={this.props.visualizationElements}
                            states={this.props.states}
                            setSelectedElement={this.props.setSelectedElement}
                            addElementType={this.props.addElementType}
                            removeElementType={this.props.removeElementType}
                            createNewSituation={this.props.createNewSituation}
                            setCurrentSituation={this.props.setCurrentSituation}
                            addButtonTransition={this.props.addButtonTransition}
                        />
                    </MDBRow>
                </MDBContainer>
            </div>
        </>
    }
}
