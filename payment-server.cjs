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

// STRIPE SIMULATION
app.post('/create-checkout-session', async (req, res) => {
  const { planType, price, userId } = req.body;
  console.log(`?? Payment Request: ${planType} - $${price}`);
  setTimeout(() => {
    totalRevenue += parseFloat(price);
    subscribers.push({ userId, planType, price, date: new Date() });
    console.log(`?? NEW SUBSCRIBER! Total Revenue: $${totalRevenue}`);
  }, 2000);
  res.json({ success: true, message: `Payment processing for ${planType} plan - $${price}`, sessionId: 'sim_' + Date.now() });
});

// PREMIUM STATUS
app.get('/check-premium/:userId', (req, res) => {
  res.json({ isPremium: false, plan: 'free', messageCount: 0, maxMessages: 3, features: [] });
});

// REVENUE DASHBOARD
app.get('/revenue', (req, res) => {
  res.json({ totalRevenue, subscriberCount: subscribers.length, subscribers: subscribers.slice(-10) });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log('?? BONNIE AI PAYMENT SERVER RUNNING');
  console.log(`?? Server: http://localhost:${PORT}`);
  console.log(`?? Revenue Dashboard: http://localhost:${PORT}/revenue`);
});
