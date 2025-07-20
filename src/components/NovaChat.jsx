// NovaChat.jsx — Dark Domme Interface v3.0 🖤
import React, { useState, useEffect, useRef } from 'react'
import FloatingDesireHints from './seduction/FloatingDesireHints'
import VoiceSeductionModal from './seduction/VoiceSeductionModal'
import ConversionRewardSystem from './seduction/ConversionRewardSystem'
import DesireWhisperLayer from './seduction/DesireWhisperLayer'
import './NovaChat.css'

const NovaChat = () => {
  const [messages, setMessages] = useState([
    { from: 'nova', text: "You made it... finally. Let's see what you're made of. 🖤" }
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
    if (input.toLowerCase().includes("hear your voice") || input.toLowerCase().includes("command me")) {
      setShowVoiceModal(true)
    }

    const res = await fetch('https://bonnie-production.onrender.com/nova-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: localStorage.getItem('nova_user') || '',
        message: input
      })
    })

    const data = await res.json()
    const reply = { from: 'nova', text: data.reply }
    setMessages((prev) => [...prev, reply])
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage()
  }

  return (
    <div className="nova-container">
      <div className="nova-header">Nova 🔥</div>

      <div className="nova-messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`nova-bubble ${msg.from === 'user' ? 'user' : 'nova'}`}>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="nova-input">
        <input
          type="text"
          placeholder="Speak up, pet..."
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

export default NovaChat
