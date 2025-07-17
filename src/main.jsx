import React from 'react';
import ReactDOM from 'react-dom/client';
import BonnieChat from './BonnieChat.jsx';
// Uncomment the line below to use the advanced version with message chunking
// import BonnieChat from './BonnieChatAdvanced.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BonnieChat />
  </React.StrictMode>
);
