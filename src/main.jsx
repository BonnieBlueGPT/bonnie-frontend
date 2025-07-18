import React from 'react'
import ReactDOM from 'react-dom/client'
import BonnieChat from './BonnieChat'

// Initialize Bonnie's domain immediately
document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BonnieChat />
  </React.StrictMode>,
)
