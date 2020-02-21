import React from 'react'
import AppProvider from './components/Application/AppProvider'
import ViewContainer from './components/Application/ViewContainer'

// TODO: (optional) Warning: Not Supported on mobile devices
// TODO: (performance) Change from Context API to props
// TODO: (performance) Change everything to typescript
// TODO: (prio) Bug situation with link to other situation. On situation remove images disappear
// TODO: (prio) Export function(JSZip)
// TODO: (prio) Model upload improvements
// TODO: (prio) Remove start situation warning

function App() {
  return <AppProvider>
    <ViewContainer />
  </AppProvider>
}

export default App
