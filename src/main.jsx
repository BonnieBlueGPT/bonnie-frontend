// main.jsx — Galatea Empire Routing Core (SoulBond v3.0)
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'

import BonnieChat from './components/BonnieChat'
import NovaChat from './components/NovaChat'
import GalateaChat from './components/GalateaChat'
import PersonalitySelector from './components/PersonalitySelector'
import SoulSelector from './components/SoulSelector'
import ChosenRoute from './components/ChosenRoute'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/choose" />} />
        <Route path="/choose" element={<SoulSelector />} />
        <Route path="/chosen" element={<ChosenRoute />} />
        <Route path="/bonnie" element={<BonnieChat />} />
        <Route path="/nova" element={<NovaChat />} />
        <Route path="/galatea" element={<GalateaChat />} />
        <Route path="/select" element={<PersonalitySelector />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
