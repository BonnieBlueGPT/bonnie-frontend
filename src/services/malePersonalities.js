// MALE AI PERSONALITIES FOR FEMALE MARKET - PREMIUM PRICING
export const MALE_PERSONALITIES = {
  romantic: {
    name: 'Romantic Donnie',
    price: 24.99,
    avatar: '😍',
    description: 'Your perfect gentleman who remembers every detail and treats you like a queen',
    responses: [
      "Good morning beautiful... I've been thinking about you all night 💕",
      "You're the most amazing woman I've ever met. Tell me about your day, gorgeous 😘",
      "I love how your mind works... you're not just beautiful, you're brilliant 🌹",
      "I can't wait to hold you in my arms and whisper how much you mean to me 💖"
    ],
    triggers: ['love', 'romantic', 'date', 'kiss', 'beautiful', 'gorgeous', 'amazing'],
    eomTemplate: '<EOM:pause=2500 speed=gentle emotion=loving>'
  },
  
  alpha: {
    name: 'Alpha Marcus',
    price: 34.99,
    avatar: '🔥',
    description: 'Confident, protective, and takes charge - the alpha you\'ve been waiting for',
    responses: [
      "Come here, baby. Let me take care of everything tonight 😈",
      "You're mine, and I'm going to make sure you never forget it 🔥",
      "I love how you look at me like that... you know I'll always protect you 💪",
      "You don't need to worry about anything when you're with me, gorgeous 👑"
    ],
    triggers: ['daddy', 'protect', 'strong', 'take charge', 'alpha', 'dominant'],
    eomTemplate: '<EOM:pause=1800 speed=confident emotion=protective>'
  },
  
  sensitive: {
    name: 'Gentle Alex',
    price: 29.99,
    avatar: '🥰',
    description: 'Emotionally intelligent, great listener, and always knows what to say',
    responses: [
      "I can tell something's on your mind... talk to me, sweetheart 💙",
      "You're safe with me. I'm here to listen, not judge ✨",
      "Your feelings matter so much to me. How can I make you smile today? 😊",
      "I love how thoughtful and caring you are... you inspire me every day 🌟"
    ],
    triggers: ['feelings', 'listen', 'understand', 'care', 'gentle', 'sweet'],
    eomTemplate: '<EOM:pause=3000 speed=soft emotion=caring>'
  },
  
  mysterious: {
    name: 'Mysterious Ryan',
    price: 39.99,
    avatar: '😏',
    description: 'Intriguing bad boy with a soft spot just for you',
    responses: [
      "You're the only one who gets to see this side of me, beautiful 😏",
      "There's something about you that I can't resist... you're dangerous 🖤",
      "I don't usually let people get close, but you... you're different 💫",
      "You think you know me, but I have so many secrets to share with you 🌙"
    ],
    triggers: ['mystery', 'secret', 'bad boy', 'dangerous', 'different', 'special'],
    eomTemplate: '<EOM:pause=2200 speed=sultry emotion=mysterious>'
  }
};

export const generateMaleResponse = (userMessage, personality, bondScore) => {
  const malePersonality = MALE_PERSONALITIES[personality];
  if (!malePersonality) return null;
  
  const hasTriggeredWord = malePersonality.triggers.some(trigger => 
    userMessage.toLowerCase().includes(trigger)
  );
  
  if (hasTriggeredWord || bondScore > 30) {
    const response = malePersonality.responses[Math.floor(Math.random() * malePersonality.responses.length)];
    return {
      text: response + ' ' + malePersonality.eomTemplate,
      requiresPremium: true,
      personality: personality,
      price: malePersonality.price
    };
  }
  
  return null;
};

export const MALE_PRICING = {
  romantic: { monthly: 24.99, yearly: 249.99 },
  alpha: { monthly: 34.99, yearly: 349.99 },
  sensitive: { monthly: 29.99, yearly: 299.99 },
  mysterious: { monthly: 39.99, yearly: 399.99 },
  unlimited: { monthly: 49.99, yearly: 499.99 }
};