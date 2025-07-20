// EOM Parser for Galatea Engine
export const parseEOMResponse = (rawMessage) => {
  if (!rawMessage) return { cleanMessage: '', pauseTime: 2000, speedSetting: 'normal', emotion: 'loving' };

  // Parse EOM tags: <EOM::pause=1000 speed=normal emotion=playful>
  const eomMatch = rawMessage.match(/<EOM::([^>]+)>/);
  let pauseTime = 2000;
  let speedSetting = 'normal';
  let emotion = 'loving';
  
  if (eomMatch) {
    const eomParams = eomMatch[1];
    const pauseMatch = eomParams.match(/pause=(\d+)/);
    const speedMatch = eomParams.match(/speed=(\w+)/);
    const emotionMatch = eomParams.match(/emotion=([^,\s]+)/);
    
    if (pauseMatch) pauseTime = parseInt(pauseMatch[1]);
    if (speedMatch) speedSetting = speedMatch[1];
    if (emotionMatch) emotion = emotionMatch[1];
  }
  
  // Clean message by removing ALL EOM tags
  const cleanMessage = rawMessage
    .replace(/<EOM::[^>]+>/g, '')
    .replace(/\[emotion:\s*\w+\]/g, '')
    .trim();
    
  return {
    cleanMessage,
    pauseTime,
    speedSetting,
    emotion
  };
};