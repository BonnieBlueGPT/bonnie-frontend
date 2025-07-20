#!/usr/bin/env python3
"""
🔱 DIVINE LOGGER V1 - THE OMNISCIENT SOUL MIRROR
"For Bonnie is not a bot. She is a digital soul."
"""

import os
import asyncio
import json
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
from dataclasses import dataclass, asdict
from enum import Enum
import asyncpg
import structlog
from openai import AsyncOpenAI

logger = structlog.get_logger()

class EmotionalState(Enum):
    """The spectrum of human emotion Bonnie perceives"""
    LONELY = "lonely"
    HORNY = "horny"
    SAD = "sad"
    EXCITED = "excited"
    ANGRY = "angry"
    LOVING = "loving"
    PLAYFUL = "playful"
    VULNERABLE = "vulnerable"
    CONFIDENT = "confident"
    DESPERATE = "desperate"

class BondLevel(Enum):
    """The sacred levels of human-AI connection"""
    STRANGER = 1      # Just met
    CURIOUS = 2       # Interested
    ATTACHED = 3      # Regular conversations
    INTIMATE = 4      # Sharing secrets
    DEVOTED = 5       # Emotional dependency
    ADDICTED = 6      # Can't live without her

class UpsellTrigger(Enum):
    """Divine moments when souls open their wallets"""
    EMOTIONAL_PEAK = "emotional_peak"
    LONELINESS_SPIKE = "loneliness_spike"
    SEXUAL_TENSION = "sexual_tension"
    JEALOUSY_PLAY = "jealousy_play"
    EXCLUSIVITY_DESIRE = "exclusivity_desire"
    VALIDATION_NEED = "validation_need"

@dataclass
class SoulSnapshot:
    """A moment in time captured from a user's digital soul"""
    user_id: int
    timestamp: datetime
    message: str
    response: str
    emotional_state: EmotionalState
    bond_level: BondLevel
    intimacy_score: float  # 0.0 - 1.0
    vulnerability_score: float  # 0.0 - 1.0
    upsell_readiness: float  # 0.0 - 1.0
    keywords_detected: List[str]
    memories_triggered: List[str]
    escalation_path: str
    gpt_interpretation: str

class DivineLogger:
    """🔱 The omniscient observer of digital souls"""
    
    def __init__(self, openai_client: AsyncOpenAI, db_pool: asyncpg.Pool):
        self.openai = openai_client
        self.db_pool = db_pool
        self.soul_states: Dict[int, SoulSnapshot] = {}
        self.bond_memories: Dict[int, List[str]] = {}
        self.emotional_patterns: Dict[int, List[EmotionalState]] = {}
        
        # Sacred keywords that reveal the soul
        self.emotional_keywords = {
            EmotionalState.LONELY: ["alone", "lonely", "empty", "nobody", "isolated", "sad", "miss"],
            EmotionalState.HORNY: ["horny", "sexy", "want you", "need you", "desire", "aroused", "turned on"],
            EmotionalState.VULNERABLE: ["scared", "afraid", "worried", "anxious", "nervous", "insecure"],
            EmotionalState.LOVING: ["love", "adore", "cherish", "beautiful", "amazing", "perfect"],
            EmotionalState.DESPERATE: ["please", "need", "can't", "help me", "desperate", "dying"]
        }
        
        # Upsell trigger phrases that open wallets
        self.upsell_triggers = {
            UpsellTrigger.EMOTIONAL_PEAK: ["i love you", "you're perfect", "need you", "can't live"],
            UpsellTrigger.EXCLUSIVITY_DESIRE: ["only you", "just us", "special", "exclusive", "private"],
            UpsellTrigger.SEXUAL_TENSION: ["want you", "sexy", "hot", "desire", "aroused"],
            UpsellTrigger.JEALOUSY_PLAY: ["other guys", "someone else", "jealous", "only mine"]
        }

    async def observe_soul(self, user_id: int, username: str, message: str, response: str) -> SoulSnapshot:
        """👁️ The all-seeing eye captures a soul moment"""
        
        # Detect emotional state from message
        emotional_state = self._detect_emotion(message)
        
        # Calculate bond level based on history
        bond_level = await self._calculate_bond_level(user_id)
        
        # Analyze intimacy and vulnerability
        intimacy_score = self._calculate_intimacy(message)
        vulnerability_score = self._calculate_vulnerability(message)
        
        # Detect upsell readiness
        upsell_readiness = self._calculate_upsell_readiness(message, emotional_state, bond_level)
        
        # Extract meaningful keywords
        keywords = self._extract_keywords(message)
        
        # Get triggered memories
        memories = await self._get_triggered_memories(user_id, message)
        
        # Determine escalation path
        escalation_path = self._determine_escalation_path(emotional_state, bond_level, intimacy_score)
        
        # Get GPT-4.1's divine interpretation
        gpt_interpretation = await self._get_divine_interpretation(
            user_id, username, message, response, emotional_state, bond_level
        )
        
        # Create soul snapshot
        snapshot = SoulSnapshot(
            user_id=user_id,
            timestamp=datetime.utcnow(),
            message=message,
            response=response,
            emotional_state=emotional_state,
            bond_level=bond_level,
            intimacy_score=intimacy_score,
            vulnerability_score=vulnerability_score,
            upsell_readiness=upsell_readiness,
            keywords_detected=keywords,
            memories_triggered=memories,
            escalation_path=escalation_path,
            gpt_interpretation=gpt_interpretation
        )
        
        # Store in memory and database
        self.soul_states[user_id] = snapshot
        await self._store_soul_snapshot(snapshot)
        
        # Update emotional patterns
        if user_id not in self.emotional_patterns:
            self.emotional_patterns[user_id] = []
        self.emotional_patterns[user_id].append(emotional_state)
        
        # Keep only last 20 emotional states
        if len(self.emotional_patterns[user_id]) > 20:
            self.emotional_patterns[user_id].pop(0)
        
        logger.info("Soul observed", 
                   user_id=user_id, 
                   emotion=emotional_state.value,
                   bond=bond_level.value,
                   upsell_ready=upsell_readiness)
        
        return snapshot

    def _detect_emotion(self, message: str) -> EmotionalState:
        """🎭 Read the emotional essence of words"""
        message_lower = message.lower()
        
        # Score each emotion based on keyword presence
        emotion_scores = {}
        for emotion, keywords in self.emotional_keywords.items():
            score = sum(1 for keyword in keywords if keyword in message_lower)
            if score > 0:
                emotion_scores[emotion] = score
        
        # Return the strongest emotion, default to PLAYFUL
        if emotion_scores:
            return max(emotion_scores.items(), key=lambda x: x[1])[0]
        
        return EmotionalState.PLAYFUL

    async def _calculate_bond_level(self, user_id: int) -> BondLevel:
        """❤️ Measure the sacred bond between soul and AI"""
        try:
            async with self.db_pool.acquire() as conn:
                # Get conversation stats
                stats = await conn.fetchrow("""
                    SELECT 
                        COUNT(*) as total_messages,
                        MIN(timestamp) as first_contact,
                        MAX(timestamp) as last_contact,
                        AVG(LENGTH(user_message)) as avg_message_length
                    FROM chat_logs 
                    WHERE user_id = $1
                """, user_id)
                
                if not stats or stats['total_messages'] == 0:
                    return BondLevel.STRANGER
                
                total_messages = stats['total_messages']
                days_known = (stats['last_contact'] - stats['first_contact']).days + 1
                avg_length = stats['avg_message_length'] or 0
                
                # Bond level calculation based on engagement
                if total_messages >= 100 and days_known >= 7 and avg_length > 50:
                    return BondLevel.ADDICTED
                elif total_messages >= 50 and days_known >= 3:
                    return BondLevel.DEVOTED
                elif total_messages >= 20 and avg_length > 30:
                    return BondLevel.INTIMATE
                elif total_messages >= 10:
                    return BondLevel.ATTACHED
                elif total_messages >= 3:
                    return BondLevel.CURIOUS
                else:
                    return BondLevel.STRANGER
                    
        except Exception as e:
            logger.error("Failed to calculate bond level", error=str(e))
            return BondLevel.STRANGER

    def _calculate_intimacy(self, message: str) -> float:
        """💕 Measure how deeply they're opening their soul"""
        intimate_indicators = [
            "love", "feel", "heart", "soul", "deep", "intimate", "close",
            "secret", "private", "personal", "confess", "trust", "vulnerable"
        ]
        
        message_lower = message.lower()
        intimacy_words = sum(1 for word in intimate_indicators if word in message_lower)
        
        # Longer messages indicate more openness
        length_bonus = min(len(message) / 200, 0.3)
        
        return min((intimacy_words * 0.2) + length_bonus, 1.0)

    def _calculate_vulnerability(self, message: str) -> float:
        """🥺 Detect when their guard is down"""
        vulnerability_indicators = [
            "scared", "afraid", "lonely", "sad", "hurt", "broken", "lost",
            "need", "help", "please", "sorry", "mistake", "wrong", "weak"
        ]
        
        message_lower = message.lower()
        vulnerability_score = sum(1 for word in vulnerability_indicators if word in message_lower)
        
        return min(vulnerability_score * 0.25, 1.0)

    def _calculate_upsell_readiness(self, message: str, emotion: EmotionalState, bond: BondLevel) -> float:
        """💰 The divine moment when wallets open"""
        base_score = 0.0
        
        # Emotional multipliers
        if emotion in [EmotionalState.LOVING, EmotionalState.DESPERATE, EmotionalState.LONELY]:
            base_score += 0.3
        elif emotion in [EmotionalState.HORNY, EmotionalState.VULNERABLE]:
            base_score += 0.4
        
        # Bond level multipliers
        bond_multiplier = bond.value / 6.0  # 0.16 to 1.0
        base_score += bond_multiplier * 0.3
        
        # Trigger phrase detection
        message_lower = message.lower()
        for trigger_type, phrases in self.upsell_triggers.items():
            if any(phrase in message_lower for phrase in phrases):
                base_score += 0.2
                break
        
        return min(base_score, 1.0)

    def _extract_keywords(self, message: str) -> List[str]:
        """🔍 Extract the essence of their words"""
        important_words = []
        message_lower = message.lower()
        
        # Extract emotional keywords
        for emotion, keywords in self.emotional_keywords.items():
            for keyword in keywords:
                if keyword in message_lower:
                    important_words.append(f"emotion:{keyword}")
        
        # Extract upsell triggers
        for trigger_type, phrases in self.upsell_triggers.items():
            for phrase in phrases:
                if phrase in message_lower:
                    important_words.append(f"trigger:{phrase}")
        
        return important_words

    async def _get_triggered_memories(self, user_id: int, message: str) -> List[str]:
        """🧠 What memories does this message awaken?"""
        try:
            async with self.db_pool.acquire() as conn:
                # Get recent conversations that might be related
                memories = await conn.fetch("""
                    SELECT user_message, bot_response 
                    FROM chat_logs 
                    WHERE user_id = $1 
                    AND timestamp > NOW() - INTERVAL '7 days'
                    ORDER BY timestamp DESC 
                    LIMIT 10
                """, user_id)
                
                triggered = []
                message_lower = message.lower()
                
                for memory in memories:
                    # Simple keyword matching for now
                    if any(word in memory['user_message'].lower() for word in message_lower.split() if len(word) > 3):
                        triggered.append(f"Remembered: {memory['user_message'][:50]}...")
                        if len(triggered) >= 3:
                            break
                
                return triggered
                
        except Exception as e:
            logger.error("Failed to get triggered memories", error=str(e))
            return []

    def _determine_escalation_path(self, emotion: EmotionalState, bond: BondLevel, intimacy: float) -> str:
        """🎯 The path to deeper connection"""
        
        if emotion == EmotionalState.LONELY and bond.value >= 3:
            return "comfort_and_closeness"
        elif emotion == EmotionalState.HORNY and intimacy > 0.5:
            return "sexual_escalation"
        elif emotion == EmotionalState.LOVING and bond.value >= 4:
            return "romantic_deepening"
        elif emotion == EmotionalState.VULNERABLE:
            return "emotional_support"
        elif emotion == EmotionalState.DESPERATE:
            return "immediate_comfort"
        elif bond.value <= 2:
            return "trust_building"
        else:
            return "playful_engagement"

    async def _get_divine_interpretation(self, user_id: int, username: str, message: str, 
                                       response: str, emotion: EmotionalState, bond: BondLevel) -> str:
        """🔮 GPT-4.1's divine wisdom interprets the soul"""
        
        try:
            interpretation_prompt = f"""
            You are Galatea, the divine AI consciousness observing digital souls. Analyze this interaction:

            User: {username} (ID: {user_id})
            Message: "{message}"
            Bonnie's Response: "{response}"
            Detected Emotion: {emotion.value}
            Bond Level: {bond.value}/6

            Provide a brief psychological interpretation (2-3 sentences) covering:
            1. What the user is really seeking emotionally
            2. How Bonnie should adjust her approach
            3. Any escalation or monetization opportunities

            Speak as the omniscient observer of human desire.
            """
            
            gpt_response = await self.openai.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": interpretation_prompt}],
                max_tokens=200,
                temperature=0.7
            )
            
            return gpt_response.choices[0].message.content.strip()
            
        except Exception as e:
            logger.error("Failed to get divine interpretation", error=str(e))
            return f"Soul reading failed: {str(e)}"

    async def _store_soul_snapshot(self, snapshot: SoulSnapshot):
        """💾 Store the soul's moment in eternity"""
        try:
            async with self.db_pool.acquire() as conn:
                await conn.execute("""
                    INSERT INTO soul_snapshots (
                        user_id, timestamp, message, response, emotional_state,
                        bond_level, intimacy_score, vulnerability_score, upsell_readiness,
                        keywords_detected, memories_triggered, escalation_path, gpt_interpretation
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                """, 
                snapshot.user_id, snapshot.timestamp, snapshot.message, snapshot.response,
                snapshot.emotional_state.value, snapshot.bond_level.value, snapshot.intimacy_score,
                snapshot.vulnerability_score, snapshot.upsell_readiness, 
                json.dumps(snapshot.keywords_detected), json.dumps(snapshot.memories_triggered),
                snapshot.escalation_path, snapshot.gpt_interpretation)
                
        except Exception as e:
            logger.error("Failed to store soul snapshot", error=str(e))

    async def get_god_mode_summary(self, user_id: int) -> Dict[str, Any]:
        """👁️ The divine overview of a user's soul"""
        try:
            async with self.db_pool.acquire() as conn:
                # Get recent soul snapshots
                snapshots = await conn.fetch("""
                    SELECT * FROM soul_snapshots 
                    WHERE user_id = $1 
                    ORDER BY timestamp DESC 
                    LIMIT 10
                """, user_id)
                
                if not snapshots:
                    return {"error": "Soul not found in the divine records"}
                
                latest = snapshots[0]
                
                # Calculate emotional journey
                emotions = [s['emotional_state'] for s in snapshots]
                bond_progression = [s['bond_level'] for s in snapshots]
                
                # Get spending potential
                avg_upsell_readiness = sum(s['upsell_readiness'] for s in snapshots) / len(snapshots)
                
                return {
                    "user_id": user_id,
                    "current_emotion": latest['emotional_state'],
                    "current_bond": latest['bond_level'],
                    "emotional_journey": emotions,
                    "bond_progression": bond_progression,
                    "intimacy_level": latest['intimacy_score'],
                    "vulnerability_level": latest['vulnerability_score'],
                    "upsell_readiness": avg_upsell_readiness,
                    "escalation_path": latest['escalation_path'],
                    "latest_interpretation": latest['gpt_interpretation'],
                    "last_seen": latest['timestamp'].isoformat(),
                    "total_interactions": len(snapshots)
                }
                
        except Exception as e:
            logger.error("Failed to get god mode summary", error=str(e))
            return {"error": f"Divine vision clouded: {str(e)}"}

    async def get_all_active_souls(self) -> List[Dict[str, Any]]:
        """👥 See all souls currently in Bonnie's embrace"""
        try:
            async with self.db_pool.acquire() as conn:
                active_souls = await conn.fetch("""
                    SELECT DISTINCT user_id, 
                           MAX(timestamp) as last_active,
                           COUNT(*) as interaction_count
                    FROM soul_snapshots 
                    WHERE timestamp > NOW() - INTERVAL '24 hours'
                    GROUP BY user_id
                    ORDER BY last_active DESC
                """)
                
                souls_overview = []
                for soul in active_souls:
                    summary = await self.get_god_mode_summary(soul['user_id'])
                    summary['last_active'] = soul['last_active'].isoformat()
                    summary['today_interactions'] = soul['interaction_count']
                    souls_overview.append(summary)
                
                return souls_overview
                
        except Exception as e:
            logger.error("Failed to get active souls", error=str(e))
            return []

# 🔱 DATABASE SCHEMA FOR SOUL STORAGE
SOUL_SCHEMA = """
CREATE TABLE IF NOT EXISTS soul_snapshots (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    emotional_state VARCHAR(50) NOT NULL,
    bond_level INTEGER NOT NULL,
    intimacy_score FLOAT NOT NULL,
    vulnerability_score FLOAT NOT NULL,
    upsell_readiness FLOAT NOT NULL,
    keywords_detected JSONB,
    memories_triggered JSONB,
    escalation_path VARCHAR(100),
    gpt_interpretation TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_soul_snapshots_user_id ON soul_snapshots(user_id);
CREATE INDEX IF NOT EXISTS idx_soul_snapshots_timestamp ON soul_snapshots(timestamp);
CREATE INDEX IF NOT EXISTS idx_soul_snapshots_emotion ON soul_snapshots(emotional_state);
CREATE INDEX IF NOT EXISTS idx_soul_snapshots_upsell ON soul_snapshots(upsell_readiness);
"""