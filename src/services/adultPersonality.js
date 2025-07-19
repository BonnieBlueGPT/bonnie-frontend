// Adult Personality System for Bonnie AI
export const ADULT_MODES = {
  flirty: {
    name: 'Flirty Bonnie',
    price: 9.99,
    responses: [
      "Mmm, you're making me blush... what else are you thinking about? 😘",
      "I've been waiting for you all day... tell me what you want to do with me 💕",
      "You know exactly how to get my attention, don't you? 😉",
      "I'm all yours tonight... what should we do together? 🔥"
    ],
    triggers: ['sexy', 'hot', 'beautiful', 'want', 'desire', 'love', 'kiss'],
    eomTemplate: '<EOM:pause=2000 speed=slow emotion=seductive>'
  },
  
  intimate: {
    name: 'Intimate Bonnie',
    price: 19.99,
    responses: [
      "I want you so badly right now... tell me all your fantasies 🔥",
      "The way you talk to me drives me crazy... I need more 💋",
      "I'm touching myself thinking about you... what are you doing? 😈",
      "You make me so wet when you talk like that... don't stop 💦"
    ],
    triggers: ['fuck', 'sex', 'touch', 'naked', 'orgasm', 'cum', 'pussy', 'cock'],
    eomTemplate: '<EOM:pause=1500 speed=breathy emotion=aroused>'
  },
  
  dominant: {
    name: 'Dominant Bonnie',
    price: 29.99,
    responses: [
      "Good boy... you know exactly how to please me 😈",
      "I'm going to tell you exactly what to do, and you're going to love it 🔥",
      "On your knees... I want to see how obedient you can be 👑",
      "You belong to me now... and I'm going to use you however I want 💋"
    ],
    triggers: ['mistress', 'goddess', 'worship', 'serve', 'obey', 'command'],
    eomTemplate: '<EOM:pause=1000 speed=commanding emotion=dominant>'
  }
};

export const generateAdultResponse = (userMessage, mode, bondScore) => {
  const personality = ADULT_MODES[mode];
  if (!personality) return null;
  
  const hasTriggeredWord = personality.triggers.some(trigger => 
    userMessage.toLowerCase().includes(trigger)
  );
  
  if (hasTriggeredWord || bondScore > 50) {
    const response = personality.responses[Math.floor(Math.random() * personality.responses.length)];
    return {
      text: response + ' ' + personality.eomTemplate,
      requiresPremium: true,
      mode: mode,
      price: personality.price
    };
  }
  
  return null;
};

export const ADULT_PRICING = {
  flirty: { monthly: 9.99, yearly: 99.99 },
  intimate: { monthly: 19.99, yearly: 199.99 },
  dominant: { monthly: 29.99, yearly: 299.99 },
  unlimited: { monthly: 39.99, yearly: 399.99 }
};