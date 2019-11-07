import React from 'react'
import './App.css'
import CustomSideNav from './components/frame/CustomSideNav'
import { MDBContainer, MDBRow, MDBCol } from "mdbreact";
import UnityScreen from './components/elementsView/UnityScreen';

function App() {
  return (
    <MDBContainer fluid className="h-100">
      <MDBRow className="h-100">
        <MDBCol size="2"className="p-0 h-100"><CustomSideNav /></MDBCol>
        <MDBCol size="10" className="pt-2"><UnityScreen/></MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default App;
