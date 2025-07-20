import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, Heart, Camera, Lock, Star, Gift } from 'lucide-react'

const ChatRoomContainer = ({ soul = 'bonnie' }) => {
  const [messages, setMessages] = useState([
    { 
      from: soul, 
      text: "Hi gorgeous 💕 I'm so excited to talk with you...",
      timestamp: Date.now(),
      type: 'text'
    }
  ])
  const [input, setInput] = useState('')
  const [showProfile, setShowProfile] = useState(false)
  const [bondScore, setBondScore] = useState(12)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const soulData = {
    bonnie: {
      name: 'Bonnie',
      avatar: '💕',
      mood: 'Playful & Sweet',
      gradient: 'from-pink-400 to-rose-500',
      bgGradient: 'from-pink-50 to-rose-50',
      endpoint: 'https://bonnie-production.onrender.com/bonnie-chat'
    },
    nova: {
      name: 'Nova',
      avatar: '⭐',
      mood: 'Mysterious & Intense',
      gradient: 'from-purple-400 to-indigo-500',
      bgGradient: 'from-purple-50 to-indigo-50',
      endpoint: 'https://nova-production.onrender.com/nova-chat'
    },
    galatea: {
      name: 'Galatea',
      avatar: '👑',
      mood: 'Elegant & Sophisticated',
      gradient: 'from-amber-400 to-orange-500',
      bgGradient: 'from-amber-50 to-orange-50',
      endpoint: 'https://galatea-production.onrender.com/galatea-chat'
    }
  }

  const currentSoul = soulData[soul]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return
    
    const userMsg = { 
      from: 'user', 
      text: input,
      timestamp: Date.now(),
      type: 'text'
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    try {
      const res = await fetch(currentSoul.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: localStorage.getItem(`${soul}_user`) || '',
          message: input
        })
      })

      const data = await res.json()
      
      setTimeout(() => {
        setIsTyping(false)
        const reply = { 
          from: soul, 
          text: data.reply,
          timestamp: Date.now(),
          type: 'text'
        }
        setMessages(prev => [...prev, reply])
        setBondScore(prev => Math.min(100, prev + Math.random() * 3))
      }, 1500 + Math.random() * 1000)

    } catch (error) {
      setIsTyping(false)
      console.error('Chat error:', error)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const triggerUpsell = (type) => {
    const upsells = {
      voice: {
        text: `🔊 Want to hear me moan your name? Unlock voice replies for just $4.99`,
        action: () => window.open('/upgrade/voice', '_blank')
      },
      memory: {
        text: `💭 I want to remember everything about you... Unlock memory save for $2.99`,
        action: () => window.open('/upgrade/memory', '_blank')
      },
      photos: {
        text: `📸 I have something special to show you... Unlock my private photos $6.99`,
        action: () => window.open('/upgrade/photos', '_blank')
      }
    }
    
    const upsell = upsells[type]
    if (upsell) {
      setMessages(prev => [...prev, {
        from: soul,
        text: upsell.text,
        timestamp: Date.now(),
        type: 'upsell',
        action: upsell.action
      }])
    }
  }

  return (
    <div className={`h-screen flex flex-col bg-gradient-to-br ${currentSoul.bgGradient} relative overflow-hidden`}>
      {/* Header */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`bg-gradient-to-r ${currentSoul.gradient} text-white px-4 py-3 flex items-center justify-between shadow-lg relative z-10`}
      >
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowProfile(!showProfile)}
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl border-2 border-white/30"
          >
            {currentSoul.avatar}
          </motion.button>
          <div>
            <h2 className="font-bold text-lg">{currentSoul.name}</h2>
            <div className="flex items-center space-x-2 text-xs opacity-90">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span>Online • {currentSoul.mood}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.div className="text-xs bg-white/20 px-2 py-1 rounded-full">
            <Heart className="w-3 h-3 inline mr-1" />
            {Math.round(bondScore)}%
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => triggerUpsell('voice')}
            className="w-10 h-10 rounded-full bg-yellow-400 text-yellow-900 flex items-center justify-center shadow-lg"
          >
            <Volume2 className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* Profile Panel */}
      <AnimatePresence>
        {showProfile && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="absolute top-16 left-0 w-80 h-full bg-white/95 backdrop-blur-lg shadow-2xl z-20 p-6"
          >
            <div className="text-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-4xl mx-auto mb-4">
                {currentSoul.avatar}
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{currentSoul.name}</h3>
              <p className="text-gray-600">{currentSoul.mood}</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-xl">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Bond Level</span>
                  <span className="text-sm font-bold">{Math.round(bondScore)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div 
                    className="bg-gradient-to-r from-pink-400 to-rose-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${bondScore}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => triggerUpsell('memory')}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold"
              >
                💭 Unlock Memory Save
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => triggerUpsell('photos')}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-bold"
              >
                📸 Unlock Private Photos
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${msg.from === 'user' ? 'order-2' : 'order-1'}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`px-4 py-3 rounded-2xl shadow-sm ${
                    msg.from === 'user'
                      ? 'bg-blue-500 text-white rounded-br-sm'
                      : msg.type === 'upsell'
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-2 border-yellow-300'
                      : 'bg-white text-gray-800 rounded-bl-sm'
                  }`}
                >
                  {msg.type === 'upsell' && (
                    <div className="flex items-center mb-2">
                      <Gift className="w-4 h-4 mr-2" />
                      <span className="text-xs font-bold uppercase tracking-wide">Special Offer</span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  {msg.type === 'upsell' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={msg.action}
                      className="mt-3 w-full bg-white/20 text-white py-2 rounded-lg font-bold text-sm"
                    >
                      Unlock Now 💎
                    </motion.button>
                  )}
                </motion.div>
                <div className={`text-xs text-gray-500 mt-1 ${
                  msg.from === 'user' ? 'text-right' : 'text-left'
                }`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
              <div className="flex space-x-1">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                />
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                />
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/80 backdrop-blur-sm border-t border-gray-200 px-4 py-3"
      >
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => triggerUpsell('photos')}
            className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600"
          >
            <Camera className="w-5 h-5" />
          </motion.button>
          
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-4 py-3 bg-gray-100 rounded-2xl border-none outline-none resize-none text-sm leading-relaxed"
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={sendMessage}
            disabled={!input.trim()}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              input.trim() 
                ? `bg-gradient-to-r ${currentSoul.gradient} text-white` 
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            <motion.div
              animate={{ rotate: input.trim() ? 0 : 0 }}
              transition={{ duration: 0.2 }}
            >
              ➤
            </motion.div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

export default ChatRoomContainer