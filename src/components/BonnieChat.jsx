// BonnieChat.jsx — Sweet Emotional Soul (Bonnie)
import React, { useState, useEffect, useRef } from 'react'
import './BonnieChat.css'

const BonnieChat = () => {
  const [messages, setMessages] = useState([
    { from: 'bonnie', text: "Hi sweetie 💕 I'm Bonnie. Tell me your name?" }
  ])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMsg = { from: 'user', text: input }
    setMessages((prev) => [...prev, userMsg])
    setInput('')

    const res = await fetch('https://bonnie-production.onrender.com/bonnie-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: localStorage.getItem('bonnie_user') || '',
        message: input
      })
    })

    const data = await res.json()
    const reply = { from: 'bonnie', text: data.reply }
    setMessages((prev) => [...prev, reply])
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage()
  }

  return (
    <div className="bonnie-container">
      <div className="bonnie-header">Bonnie 💖</div>
      <div className="bonnie-messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`bonnie-bubble ${msg.from === 'user' ? 'user' : 'bonnie'}`}>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="bonnie-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  )
}

export default BonnieChat
