import React from 'react';
import BonnieChat from './BonnieChat';
import './globals.css';

// 🚀 Main App Component - God Mode+
function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* 🤖 Bonnie AI Chat Interface */}
      <BonnieChat />
      
      {/* 🔥 Footer with Version Info */}
      <div className="fixed bottom-2 right-2 text-xs text-gray-400 bg-white/80 backdrop-blur px-2 py-1 rounded">
        Bonnie AI v3.0.0-god-mode-plus
      </div>
    </div>
  );
}

export default App;