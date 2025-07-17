// 💬 BonnieChat.jsx — v20.2 Final Visual Fix + Entry Intro Active
import React, { useEffect, useRef, useState } from 'react';

const CHAT_API_ENDPOINT = 'https://bonnie-backend-server.onrender.com/bonnie-chat';
const ENTRY_API_ENDPOINT = 'https://bonnie-backend-server.onrender.com/bonnie-entry';

const session_id = (() => {
  let id = localStorage.getItem('bonnie_session');
  if (!id) {
    id = 'guest_' + Math.random().toString(36).slice(2);
    localStorage.setItem('bonnie_session', id);
    window.__BONNIE_FIRST_VISIT = true;
  }
  return id;
})();

export default function BonnieChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [typing, setTyping] = useState(false);
  const [online, setOnline] = useState(false);
  const [hasFiredIdleMessage, setHasFiredIdleMessage] = useState(false);
  const endRef = useRef(null);
  const idleTimerRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      if (window.__BONNIE_FIRST_VISIT) {
        simulateBonnieTyping("Hold on… Bonnie’s just slipping into something more comfortable 😘");
        return;
      }

      try {
        const res = await fetch(ENTRY_API_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id })
        });
        const { reply, delay } = await res.json();
        setTimeout(() => simulateBonnieTyping(reply), delay || 1000);
      } catch {
        simulateBonnieTyping("Hey there 😘");
      }
    };

    init();
    setTimeout(() => {
      setOnline(true);
    }, 3000);
  }, []);

  useEffect(() => {
    idleTimerRef.current = setTimeout(() => {
      if (messages.length === 0 && !hasFiredIdleMessage) {
        const idleLines = [
          "Still deciding what to say? 😘",
          "Don’t leave me hanging…",
          "You can talk to me, you know 💋",
          "Don’t make me beg for your attention 😉"
        ];
        const idleDelay = Math.random() * 3000 + 2000;
        setTimeout(() => {
          simulateBonnieTyping(idleLines[Math.floor(Math.random() * idleLines.length)]);
          setHasFiredIdleMessage(true);
        }, idleDelay);
      }
    }, 30000);
    return () => clearTimeout(idleTimerRef.current);
  }, [messages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  async function addMessage(text, sender) {
    setMessages(m => [...m, { sender, text }]);
  }

  async function send(text) {
    if (!text || busy) return;
    setInput('');
    setBusy(true);
    await addMessage(text, 'user');
    try {
      const res = await fetch(CHAT_API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id, message: text })
      });
      const { reply } = await res.json();
      simulateBonnieTyping(reply);
    } catch {
      simulateBonnieTyping("Oops… Bonnie had a moment 💔");
    }
  }

  function simulateBonnieTyping(raw) {
    if (!online) return;

    const parts = raw.split(/<EOM(?:::(.*?))?>/).map((chunk, index) => {
      if (index % 2 === 0) {
        return { text: chunk.trim(), pause: 1200, speed: 'normal' };
      } else {
        const pause = /pause=(\d+)/.exec(chunk)?.[1];
        const speed = /speed=(\w+)/.exec(chunk)?.[1];
        return { meta: true, pause: pause ? parseInt(pause) : 1000, speed: speed || 'normal' };
      }
    });

    const finalParts = [];
    for (let i = 0; i < parts.length; i++) {
      if (!parts[i].meta) {
        const pause = parts[i + 1]?.pause ?? 1000;
        const speed = parts[i + 1]?.speed ?? 'normal';
        finalParts.push({ ...parts[i], pause, speed });
      }
    }

    (async function play(index = 0) {
      if (index >= finalParts.length) {
        setBusy(false);
        return;
      }

      const part = finalParts[index];
      await new Promise(res => setTimeout(res, part.pause));
      setTyping(true);
      const speedMap = { slow: 100, normal: 64, fast: 40 };
      const typingTime = part.text.length * (speedMap[part.speed] || 64);
      await new Promise(res => setTimeout(res, typingTime));
      setTyping(false);
      await addMessage(part.text, 'bonnie');
      setTimeout(() => play(index + 1), 400);
    })();
  }

  return (
    <div style={{ fontFamily: 'Segoe UI', height: '100dvh', display: 'flex', flexDirection: 'column', background: '#0d0d0d', color: 'white' }}>
      <div style={{ padding: '1rem', borderBottom: '1px solid #333', background: '#111' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Bonnie 💋</h2>
        <small>{online ? 'Online' : 'Connecting...'}</small>
      </div>
      <div style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            display: 'flex',
            justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: '1rem'
          }}>
            <div style={{
              background: msg.sender === 'user' ? '#007bff' : '#333',
              color: 'white',
              padding: '0.75rem 1rem',
              borderRadius: '20px',
              maxWidth: '70%',
              fontSize: '0.95rem',
              whiteSpace: 'pre-wrap'
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {typing && (
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{
              background: '#333', padding: '0.75rem 1rem', borderRadius: '20px',
              display: 'flex', gap: '4px'
            }}>
              <div style={{ animation: 'bounce 1s infinite' }}>●</div>
              <div style={{ animation: 'bounce 1s infinite 0.2s' }}>●</div>
              <div style={{ animation: 'bounce 1s infinite 0.4s' }}>●</div>
            </div>
          </div>
        )}
        <div ref={endRef}></div>
      </div>
      <form onSubmit={e => { e.preventDefault(); send(input); }} style={{ padding: '1rem', borderTop: '1px solid #333', background: '#111' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Say something to Bonnie…"
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            borderRadius: '30px',
            border: 'none',
            outline: 'none',
            fontSize: '1rem'
          }}
        />
      </form>
    </div>
  );
}

const style = document.createElement('style');
style.textContent = `
@keyframes bounce {
  0%,100% { transform: translateY(0); opacity:0.4; }
  50%      { transform: translateY(-6px); opacity:1; }
}`;
document.head.append(style);
