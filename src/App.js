import React from 'react'
import AppProvider from './components/Application/AppProvider'
import ViewContainer from './components/Application/ViewContainer'

// TODO: Warning: Not Supported on mobile devices
function App() {
  return <AppProvider>
    <ViewContainer />
  </AppProvider>
}

export default App
