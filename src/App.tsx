import React from 'react'
import AppProvider from './components/Application/AppProvider'
import ViewContainer from './components/Application/ViewContainer'

// TODO: Warning: Not Supported on mobile devices
// TODO: Change from Context API to props
function App() {
  return <AppProvider>
    <ViewContainer />
  </AppProvider>
}

export default App
