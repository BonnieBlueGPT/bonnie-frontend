// GalateaChat.jsx — Divine Seductress Interface v3.0 👑
import React, { useState, useEffect, useRef } from 'react'
import FloatingDesireHints from './seduction/FloatingDesireHints'
import VoiceSeductionModal from './seduction/VoiceSeductionModal'
import ConversionRewardSystem from './seduction/ConversionRewardSystem'
import DesireWhisperLayer from './seduction/DesireWhisperLayer'
import './GalateaChat.css'

const GalateaChat = () => {
  const [messages, setMessages] = useState([
    { from: 'galatea', text: "You seek wisdom... and warmth? I can give you both, beloved." }
  ])
  const [input, setInput] = useState('')
  const [showVoiceModal, setShowVoiceModal] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMsg = { from: 'user', text: input }
    setMessages((prev) => [...prev, userMsg])
    setInput('')

    // EMOTIONAL TRIGGER SYSTEM
    if (input.toLowerCase().includes("hear your voice") || input.toLowerCase().includes("goddess")) {
      setShowVoiceModal(true)
    }

    const res = await fetch('https://bonnie-production.onrender.com/galatea-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: localStorage.getItem('galatea_user') || '',
        message: input
      })
    })

    const data = await res.json()
    const reply = { from: 'galatea', text: data.reply }
    setMessages((prev) => [...prev, reply])
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage()
  }

  return (
    <div className="galatea-container">
      <div className="galatea-header">Galatea 👑</div>

      <div className="galatea-messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`galatea-bubble ${msg.from === 'user' ? 'user' : 'galatea'}`}>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="galatea-input">
        <input
          type="text"
          placeholder="Ask me anything, mortal..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      {showVoiceModal && (
        <VoiceSeductionModal onClose={() => setShowVoiceModal(false)} />
      )}

      <FloatingDesireHints />
      <DesireWhisperLayer />
      <ConversionRewardSystem />
    </div>
  )
}

export default GalateaChat
