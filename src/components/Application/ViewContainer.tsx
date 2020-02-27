import React from 'react'
import { MDBContainer, MDBRow, MDBCol } from 'mdbreact'
import UnityScreen from '../Frame/UnityScreen'
import SituationsList from '../SituationsList/SituationsList'
import ElementCardHandler from '../ElementInformation/ElementCardHandler'
import StartingOverlay from '../Frame/StartingOverlay'
import ModalHandler from '../Modals/ModalHandler'
import { Actions } from '../../interfaces/actions.interface'
import { AppContext } from '../../interfaces/app-context.interface'
import InformationBannerHandler from '../InformationBanners/InformationBannerHandler'

type PropsType = {
    actions: Actions,
    appContext: AppContext
}
/**
 * This class is responsible to display the proper views for the current context.
 * Provides necessary context information to each component
 */
export default class ViewContainer extends React.Component<PropsType> {

    render() {
        return <>
            <StartingOverlay
                unityLoadingProgress={this.props.appContext.applicationState.unityLoadingProgress} />

            <InformationBannerHandler
                informationBannerType={this.props.appContext.applicationState.currentInformationBanner}
                actions={this.props.actions} />

            <ModalHandler
                actions={this.props.actions}
                states={this.props.appContext.states}
                transitions={this.props.appContext.transitions}
                applicationState={this.props.appContext.applicationState} />

            <div className="h-100">
                <UnityScreen
                    unityWrapper={this.props.appContext.unityWrapper}
                    modelWasUploaded={this.props.appContext.applicationState.modelWasUploaded}
                    isCurrentlyUploading={this.props.appContext.applicationState.isCurrentlyUploading} />
                <MDBContainer fluid className="h-100">
                    <MDBRow className="h-100">

                        <MDBCol size="2" className="p-0 h-100">
                            <SituationsList
                                states={this.props.appContext.states}
                                transitions={this.props.appContext.transitions}
                                actions={this.props.actions}
                                currentSituationID={this.props.appContext.applicationState.currentSituationID} />
                        </MDBCol>

                        <ElementCardHandler
                            actions={this.props.actions}
                            element={this.props.appContext.applicationState.selectedElement}
                            planeSelectionElementName={this.props.appContext.applicationState.planeSelectionElementName}
                            visualizationElements={this.props.appContext.visualizationElements}
                            interactionElements={this.props.appContext.interactionElements}
                            transitions={this.props.appContext.transitions}
                            states={this.props.appContext.states}
                            currentSituationID={this.props.appContext.applicationState.currentSituationID}
                            clickedPlane={this.props.appContext.applicationState.clickedPlane} />

                    </MDBRow>
                </MDBContainer>
            </div>
        </>
    }
}
