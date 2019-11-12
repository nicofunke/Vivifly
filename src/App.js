import React from 'react'
import './App.css'
import CustomSideNav from './components/frame/CustomSideNav'
import { MDBContainer, MDBRow, MDBCol } from "mdbreact";
import UnityScreen from './components/elementsView/UnityScreen';

function App() {
  return (
    <div className="h-100">
      <UnityScreen objectSelected={() => console.log("jip")}/>
    <MDBContainer fluid className="h-100">
      
      <MDBRow className="h-100">
        <MDBCol size="2"className="p-0 h-100"><CustomSideNav /></MDBCol>
      </MDBRow>
    </MDBContainer>
    </div>
  );
}

export default App;
