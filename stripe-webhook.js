// REAL STRIPE PAYMENT PROCESSOR - INSTANT MONEY
const express = require('express');
const stripe = require('stripe')('sk_test_51XXXXXX'); // GET YOUR REAL KEY
const app = express();

app.use(express.json());

// INSTANT PAYMENT PROCESSING
app.post('/api/create-payment', async (req, res) => {
  try {
    const { amount, planType } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      metadata: { planType }
    });
    
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// WEBHOOK FOR SUCCESSFUL PAYMENTS
app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, 'whsec_XXXXX');
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  if (event.type === 'payment_intent.succeeded') {
    console.log('💰 PAYMENT SUCCESSFUL!', event.data.object);
    // Activate premium for user
  }
  
  res.json({received: true});
});

app.listen(3002, () => console.log('💳 STRIPE SERVER: http://localhost:3002'));