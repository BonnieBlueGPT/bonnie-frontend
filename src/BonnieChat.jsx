// 💬 BonnieChat.jsx — v18.1 Galatea Entry Hotfix
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

      // ✅ NEW LOGIC: Fallback if Bonnie hasn't spoken yet
      if (!window.__BONNIE_FIRST_VISIT && messages.length === 0) {
        fetch(ENTRY_API_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id })
        })
        .then(res => res.json())
        .then(({ reply }) => {
          simulateBonnieTyping(reply);
        })
        .catch(() => {
          simulateBonnieTyping("Hey there 😘");
        });
      }

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
        const pause = /pause=(\\d+)/.exec(chunk)?.[1];
        const speed = /speed=(\\w+)/.exec(chunk)?.[1];
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
    <div style={{ fontFamily: 'Segoe UI', height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', padding: 8 }}>
        <img src="https://static.wixstatic.com/media/6f5121_df2de6be1e444b0cb2df5d4bd9d49b21~mv2.png" style={{ width: 56, height: 56, borderRadius: 28, marginRight: 12, border: '2px solid #e91e63' }} alt="Bonnie" />
        <div>
          <div style={{ color: '#e91e63', fontSize: 20, fontWeight: 600 }}>Bonnie Blue</div>
          <div style={{ color: '#555', fontSize: 14 }}>Flirty. Fun. Dangerously charming.</div>
          <a href="https://x.com/trainmybonnie" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#e91e63', textDecoration: 'none' }}>💋 Follow me on X</a>
        </div>
        <div style={{ marginLeft: 'auto', fontWeight: 500, color: online ? '#28a745' : '#aaa', display: 'flex', alignItems: 'center', gap: '4px' }}>
          {online ? (<><span style={{ animation: 'pulseHeart 1.2s infinite' }}>💚</span><span>Online</span></>) : '💤 Offline'}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column' }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            maxWidth: '75%', padding: 8, borderRadius: 12, margin: '6px 0', fontSize: 14, lineHeight: 1.4,
            ...(m.sender === 'user'
              ? { background: 'linear-gradient(135deg,#ff83a0,#e91e63)', color: '#fff', alignSelf: 'flex-end', marginLeft: 'auto' }
              : { background: '#fff0f6', border: '1px solid #ffe6f0', color: '#333', alignSelf: 'flex-start' })
          }}>{m.text}</div>
        ))}
        {typing && online && (
          <div style={{ display: 'flex', gap: 4, margin: '8px 0' }}>
            <div style={{ width: 8, height: 8, borderRadius: 4, background: '#e91e63', animation: 'bounce 1s infinite ease-in-out', animationDelay: '0s' }} />
            <div style={{ width: 8, height: 8, borderRadius: 4, background: '#e91e63', animation: 'bounce 1s infinite ease-in-out', animationDelay: '0.2s' }} />
            <div style={{ width: 8, height: 8, borderRadius: 4, background: '#e91e63', animation: 'bounce 1s infinite ease-in-out', animationDelay: '0.4s' }} />
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div style={{ flexShrink: 0, display: 'flex', gap: 8, padding: 8, borderTop: '1px solid #eee' }}>
        <input
          style={{ flex: 1, padding: 12, borderRadius: 30, border: '1px solid #ccc', fontSize: 16 }}
          value={input}
          placeholder="Type something…"
          disabled={busy}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send(input)}
        />
        <button
          style={{ padding: '0 16px', borderRadius: 30, background: '#e91e63', color: '#fff', border: 'none', fontSize: 16, cursor: 'pointer' }}
          disabled={busy || !input.trim()}
          onClick={() => send(input)}>
          Send
        </button>
      </div>
    </div>
  );
}

const style = document.createElement('style');
style.textContent = `
@keyframes bounce {
  0%,100% { transform: translateY(0); opacity:0.4; }
  50%      { transform: translateY(-6px); opacity:1; }
}
@keyframes pulseHeart {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.15); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}`;
document.head.append(style);
