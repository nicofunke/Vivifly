import React from 'react'
import { MDBContainer, MDBRow, MDBCol } from 'mdbreact'
import UnityScreen from '../Frame/UnityScreen'
import SituationsList from '../SituationsList/SituationsList'
import ElementInformationWindowHandler from '../ElementInformation/ElementInformationWindowHandler'
import StartingOverlay from '../Frame/StartingOverlay'
import InformationWindowHandler from '../InformationWindows/InformationWindowHandler'
import ModalHandler from '../Modals/ModalHandler'

/**
 * This class is responsible to display the proper views for the current state
 */
export default class ViewContainer extends React.Component {

    render() {
        return <>
            <StartingOverlay />
        
            <InformationWindowHandler />

            <ModalHandler />
            
            <div className="h-100">
                <UnityScreen />
                <MDBContainer fluid className="h-100">
                    <MDBRow className="h-100">
                        <MDBCol size="2" className="p-0 h-100">
                            <SituationsList />
                        </MDBCol>
                        <ElementInformationWindowHandler />
                    </MDBRow>
                </MDBContainer>
            </div>
        </>
    }
}
