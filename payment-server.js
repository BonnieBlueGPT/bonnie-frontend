// BONNIE AI PAYMENT SERVER - WINDOWS READY
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// REVENUE TRACKING
let totalRevenue = 0;
let subscribers = [];

// STRIPE SIMULATION (REPLACE WITH REAL STRIPE LATER)
app.post('/create-checkout-session', async (req, res) => {
  const { planType, price, userId } = req.body;
  
  console.log(`💰 Payment Request: ${planType} - $${price}`);
  
  // SIMULATE PAYMENT SUCCESS
  setTimeout(() => {
    totalRevenue += parseFloat(price);
    subscribers.push({ userId, planType, price, date: new Date() });
    console.log(`🎉 NEW SUBSCRIBER! Total Revenue: $${totalRevenue}`);
  }, 2000);
  
  res.json({ 
    success: true,
    message: `Payment processing for ${planType} plan - $${price}`,
    sessionId: 'sim_' + Date.now()
  });
});

// PREMIUM STATUS - CONTROLS PAYWALL
app.get('/check-premium/:userId', (req, res) => {
  const { userId } = req.params;
  
  // FOR TESTING PAYWALL: Change isPremium to false
  // FOR TESTING PREMIUM: Change isPremium to true
  res.json({
    isPremium: false, // SET TO FALSE TO TEST PAYWALL
    plan: 'free',
    messageCount: 0,
    maxMessages: 3,
    features: []
  });
});

// ACTIVATE PREMIUM (AFTER PAYMENT)
app.post('/activate-premium', (req, res) => {
  const { userId, planType } = req.body;
  console.log(`✅ Premium activated for ${userId}: ${planType}`);
  res.json({ success: true, plan: planType });
});

// REVENUE DASHBOARD
app.get('/revenue', (req, res) => {
  res.json({
    totalRevenue,
    subscriberCount: subscribers.length,
    subscribers: subscribers.slice(-10) // Last 10
  });
});

// SUCCESS PAGE
app.get('/success', (req, res) => {
  res.send(`
    <html>
    <head><title>Payment Successful!</title></head>
    <body style="font-family: Arial; text-align: center; background: linear-gradient(45deg, #ff6b9d, #e91e63); color: white; padding: 50px;">
      <h1>🎉 Welcome to Premium Bonnie!</h1>
      <p>Your payment was successful. Enjoy unlimited intimate conversations!</p>
      <button onclick="window.close()" style="background: white; color: #e91e63; padding: 15px 30px; border: none; border-radius: 25px; font-size: 16px; cursor: pointer;">Close & Continue</button>
    </body>
    </html>
  `);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log('🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥');
  console.log('💰 BONNIE AI PAYMENT SERVER RUNNING');
  console.log(`🚀 Server: http://localhost:${PORT}`);
  console.log(`💳 Revenue Dashboard: http://localhost:${PORT}/revenue`);
  console.log('🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥');
});