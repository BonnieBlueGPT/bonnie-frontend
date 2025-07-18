import React from 'react'
import ReactDOM from 'react-dom/client'
import BonnieGodMode from './components/BonnieGodMode'
import ErrorBoundary from './components/ErrorBoundary'

// Initialize Bonnie's domain immediately
document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BonnieGodMode />
    </ErrorBoundary>
  </React.StrictMode>,
)
