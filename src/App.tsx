import React from 'react'
import AppProvider from './components/Application/AppProvider'
import ViewContainer from './components/Application/ViewContainer'

// TODO: 3 Warning: Not Supported on mobile devices
// TODO: 2 Change from Context API to props
// TODO: 3 Change everything to typescript
// TODO: 2 Bug situation with link to other situation. On situation remove images disappear
function App() {
  return <AppProvider>
    <ViewContainer />
  </AppProvider>
}

export default App
