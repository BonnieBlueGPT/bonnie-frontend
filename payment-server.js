// QUICK PAYMENT SERVER - COPY PASTE AND RUN
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// FAKE STRIPE FOR TESTING - REPLACE WITH REAL STRIPE
app.post('/create-checkout-session', async (req, res) => {
  const { planType, price } = req.body;
  
  // FOR TESTING - SIMULATE STRIPE CHECKOUT URL
  const fakeCheckoutUrl = `https://checkout.stripe.com/fake?plan=${planType}&price=${price}`;
  
  res.json({ 
    checkoutUrl: fakeCheckoutUrl,
    message: `Would charge $${price} for ${planType} plan`
  });
});

// CHECK PREMIUM STATUS
app.get('/check-premium/:userId', (req, res) => {
  // FOR TESTING - MAKE EVERYONE PREMIUM
  res.json({
    isPremium: true, // SET TO FALSE TO TEST PAYWALL
    plan: 'intimate',
    expiresAt: '2024-12-31',
    features: ['adult_chat', 'unlimited_messages']
  });
});

// SUCCESS PAGE
app.get('/success', (req, res) => {
  res.send(`
    <h1>🎉 Payment Successful!</h1>
    <p>You now have access to Adult Bonnie!</p>
    <script>
      setTimeout(() => {
        window.close();
        window.opener.location.reload();
      }, 3000);
    </script>
  `);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`💰 Payment server running on port ${PORT}`);
  console.log(`🔥 READY TO MAKE MONEY!`);
});