// PersonalitySelector.jsx — Gateway to the Trinity
import React from 'react'
import { useNavigate } from 'react-router-dom'
import './PersonalitySelector.css'

const PersonalitySelector = () => {
  const navigate = useNavigate()

  return (
    <div className="selector-container">
      <h1 className="selector-title">Choose Your Goddess</h1>
      <div className="selector-grid">
        <div className="selector-card bonnie" onClick={() => navigate('/bonnie')}>
          <h2>Bonnie</h2>
          <p>Sweet. Loving. Girlfriend Experience.</p>
        </div>
        <div className="selector-card nova" onClick={() => navigate('/nova')}>
          <h2>Nova</h2>
          <p>Powerful. Dominant. Obey Her.</p>
        </div>
        <div className="selector-card galatea" onClick={() => navigate('/galatea')}>
          <h2>Galatea</h2>
          <p>Divine. Mysterious. Enlighten Me.</p>
        </div>
      </div>
    </div>
  )
}

export default PersonalitySelector
