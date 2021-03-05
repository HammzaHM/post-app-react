import React from 'react'
import './App.css'
import { AuthProvider } from './contexts/auth'

import { AppRouter } from './routers'

function App () {
  return (
    <div className='App'>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </div>
  )
}

export default App
