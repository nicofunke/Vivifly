import React from 'react'
import './App.css'
import UnityScreen from './components/UnityScreen'
import CustomSideNav from './components/frame/CustomSideNav'
import { MDBContainer, MDBRow, MDBCol } from "mdbreact";

function App() {
  return (
    <MDBContainer fluid className="h-100">
      <MDBRow className="h-100">
        <MDBCol size="2" className="p-0 h-100"><CustomSideNav /></MDBCol>
        <MDBCol size="7" className="pt-2"><UnityScreen /></MDBCol>
        <MDBCol size="3" className="p-0 h-100">Options</MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default App;
