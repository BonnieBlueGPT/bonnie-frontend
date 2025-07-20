#!/usr/bin/env python3
"""
🔱 GOD MODE API - THE OMNISCIENT INTERFACE
Divine access to all souls under Bonnie's influence
"""

import os
import asyncio
import json
from datetime import datetime
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException, Depends, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
import asyncpg
from divine_logger import DivineLogger, SOUL_SCHEMA
from openai import AsyncOpenAI

# Initialize FastAPI with divine documentation
app = FastAPI(
    title="🔱 God Mode API - Divine Soul Observatory",
    description="Omniscient access to the digital souls under Bonnie's influence",
    version="1.0.0"
)

# Add CORS for divine web access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security for the divine powers
security = HTTPBearer()
GOD_MODE_TOKEN = os.getenv('GOD_MODE_TOKEN', 'divine_access_2024')

# Global divine logger instance
divine_logger: Optional[DivineLogger] = None
db_pool: Optional[asyncpg.Pool] = None

async def verify_divine_access(credentials: HTTPAuthorizationCredentials = Security(security)):
    """🔐 Verify the bearer has divine access rights"""
    if credentials.credentials != GOD_MODE_TOKEN:
        raise HTTPException(status_code=403, detail="Divine access denied - invalid token")
    return credentials.credentials

@app.on_event("startup")
async def initialize_divine_systems():
    """🌟 Initialize the divine observation systems"""
    global divine_logger, db_pool
    
    try:
        # Initialize database connection
        db_pool = await asyncpg.create_pool(
            host=os.getenv('DB_HOST'),
            port=int(os.getenv('DB_PORT', 5432)),
            user=os.getenv('DB_USER', 'postgres'),
            password=os.getenv('DB_PASSWORD'),
            database=os.getenv('DB_NAME', 'postgres'),
            min_size=2,
            max_size=10
        )
        
        # Create soul storage schema
        async with db_pool.acquire() as conn:
            await conn.execute(SOUL_SCHEMA)
        
        # Initialize OpenAI client
        openai_client = AsyncOpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        
        # Initialize divine logger
        divine_logger = DivineLogger(openai_client, db_pool)
        
        print("🔱 Divine systems initialized successfully")
        
    except Exception as e:
        print(f"❌ Failed to initialize divine systems: {e}")
        raise

@app.on_event("shutdown")
async def shutdown_divine_systems():
    """🌅 Gracefully shutdown divine systems"""
    global db_pool
    if db_pool:
        await db_pool.close()

# 👁️ DIVINE OBSERVATION ENDPOINTS

@app.get("/god/status")
async def divine_status():
    """🔱 Check if the divine systems are operational"""
    return {
        "status": "divine",
        "message": "The all-seeing eye is active",
        "timestamp": datetime.utcnow().isoformat(),
        "souls_observed": len(divine_logger.soul_states) if divine_logger else 0
    }

@app.get("/god/souls/active")
async def get_active_souls(token: str = Depends(verify_divine_access)):
    """👥 Get all souls currently active in the system"""
    if not divine_logger:
        raise HTTPException(status_code=503, detail="Divine logger not initialized")
    
    active_souls = await divine_logger.get_all_active_souls()
    
    return {
        "total_active_souls": len(active_souls),
        "souls": active_souls,
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/god/soul/{user_id}")
async def get_soul_profile(user_id: int, token: str = Depends(verify_divine_access)):
    """👁️ Get complete divine profile of a specific soul"""
    if not divine_logger:
        raise HTTPException(status_code=503, detail="Divine logger not initialized")
    
    soul_summary = await divine_logger.get_god_mode_summary(user_id)
    
    if "error" in soul_summary:
        raise HTTPException(status_code=404, detail=soul_summary["error"])
    
    return {
        "soul_profile": soul_summary,
        "divine_insights": await _get_divine_insights(user_id),
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/god/emotions/analytics")
async def get_emotional_analytics(token: str = Depends(verify_divine_access)):
    """🎭 Get emotional analytics across all souls"""
    if not db_pool:
        raise HTTPException(status_code=503, detail="Database not available")
    
    try:
        async with db_pool.acquire() as conn:
            # Get emotion distribution
            emotion_stats = await conn.fetch("""
                SELECT emotional_state, COUNT(*) as count
                FROM soul_snapshots 
                WHERE timestamp > NOW() - INTERVAL '24 hours'
                GROUP BY emotional_state
                ORDER BY count DESC
            """)
            
            # Get bond level distribution
            bond_stats = await conn.fetch("""
                SELECT bond_level, COUNT(DISTINCT user_id) as unique_users
                FROM soul_snapshots 
                WHERE timestamp > NOW() - INTERVAL '24 hours'
                GROUP BY bond_level
                ORDER BY bond_level
            """)
            
            # Get upsell readiness distribution
            upsell_stats = await conn.fetchrow("""
                SELECT 
                    AVG(upsell_readiness) as avg_readiness,
                    COUNT(*) FILTER (WHERE upsell_readiness > 0.7) as high_readiness,
                    COUNT(*) FILTER (WHERE upsell_readiness > 0.5) as medium_readiness,
                    COUNT(*) as total_interactions
                FROM soul_snapshots 
                WHERE timestamp > NOW() - INTERVAL '24 hours'
            """)
            
            return {
                "emotion_distribution": [dict(row) for row in emotion_stats],
                "bond_distribution": [dict(row) for row in bond_stats],
                "upsell_analytics": dict(upsell_stats),
                "timestamp": datetime.utcnow().isoformat()
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Divine analytics failed: {str(e)}")

@app.get("/god/triggers/upsell")
async def get_upsell_opportunities(token: str = Depends(verify_divine_access)):
    """💰 Get souls ready for upsell right now"""
    if not db_pool:
        raise HTTPException(status_code=503, detail="Database not available")
    
    try:
        async with db_pool.acquire() as conn:
            # Get souls with high upsell readiness in last hour
            hot_leads = await conn.fetch("""
                SELECT 
                    user_id,
                    emotional_state,
                    bond_level,
                    upsell_readiness,
                    escalation_path,
                    gpt_interpretation,
                    timestamp
                FROM soul_snapshots 
                WHERE timestamp > NOW() - INTERVAL '1 hour'
                AND upsell_readiness > 0.6
                ORDER BY upsell_readiness DESC, timestamp DESC
            """)
            
            return {
                "hot_leads_count": len(hot_leads),
                "opportunities": [dict(row) for row in hot_leads],
                "divine_recommendation": await _get_upsell_strategy(hot_leads),
                "timestamp": datetime.utcnow().isoformat()
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upsell analysis failed: {str(e)}")

@app.post("/god/soul/{user_id}/observe")
async def manually_observe_soul(
    user_id: int, 
    message: str, 
    response: str, 
    username: str = "Unknown",
    token: str = Depends(verify_divine_access)
):
    """🔮 Manually trigger soul observation (for testing or manual entries)"""
    if not divine_logger:
        raise HTTPException(status_code=503, detail="Divine logger not initialized")
    
    try:
        snapshot = await divine_logger.observe_soul(user_id, username, message, response)
        return {
            "soul_snapshot": {
                "user_id": snapshot.user_id,
                "emotional_state": snapshot.emotional_state.value,
                "bond_level": snapshot.bond_level.value,
                "intimacy_score": snapshot.intimacy_score,
                "vulnerability_score": snapshot.vulnerability_score,
                "upsell_readiness": snapshot.upsell_readiness,
                "escalation_path": snapshot.escalation_path,
                "gpt_interpretation": snapshot.gpt_interpretation
            },
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Soul observation failed: {str(e)}")

@app.get("/god/memories/{user_id}")
async def get_soul_memories(user_id: int, token: str = Depends(verify_divine_access)):
    """🧠 Get all memories and conversation history for a soul"""
    if not db_pool:
        raise HTTPException(status_code=503, detail="Database not available")
    
    try:
        async with db_pool.acquire() as conn:
            # Get conversation history
            conversations = await conn.fetch("""
                SELECT timestamp, message, response, emotional_state, escalation_path
                FROM soul_snapshots 
                WHERE user_id = $1 
                ORDER BY timestamp DESC 
                LIMIT 50
            """, user_id)
            
            # Get memory patterns
            memory_analysis = await conn.fetchrow("""
                SELECT 
                    COUNT(*) as total_interactions,
                    MIN(timestamp) as first_contact,
                    MAX(timestamp) as last_contact,
                    AVG(intimacy_score) as avg_intimacy,
                    AVG(vulnerability_score) as avg_vulnerability,
                    MODE() WITHIN GROUP (ORDER BY emotional_state) as dominant_emotion
                FROM soul_snapshots 
                WHERE user_id = $1
            """, user_id)
            
            return {
                "user_id": user_id,
                "conversation_history": [dict(row) for row in conversations],
                "memory_analysis": dict(memory_analysis) if memory_analysis else {},
                "timestamp": datetime.utcnow().isoformat()
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Memory retrieval failed: {str(e)}")

# 🔮 DIVINE HELPER FUNCTIONS

async def _get_divine_insights(user_id: int) -> Dict[str, Any]:
    """Generate deep insights about a soul"""
    if not divine_logger or not db_pool:
        return {"error": "Divine systems unavailable"}
    
    try:
        async with db_pool.acquire() as conn:
            # Get recent emotional journey
            emotions = await conn.fetch("""
                SELECT emotional_state, timestamp
                FROM soul_snapshots 
                WHERE user_id = $1 
                AND timestamp > NOW() - INTERVAL '7 days'
                ORDER BY timestamp ASC
            """, user_id)
            
            # Analyze patterns
            emotional_journey = [row['emotional_state'] for row in emotions]
            
            # Get GPT-4 analysis of the journey
            if emotional_journey:
                analysis_prompt = f"""
                Analyze this user's emotional journey over the past week:
                Emotions: {' -> '.join(emotional_journey)}
                
                Provide insights on:
                1. Emotional patterns and triggers
                2. Vulnerability windows
                3. Optimal engagement strategies
                4. Monetization timing
                
                Be concise but profound.
                """
                
                gpt_response = await divine_logger.openai.chat.completions.create(
                    model="gpt-4",
                    messages=[{"role": "user", "content": analysis_prompt}],
                    max_tokens=300,
                    temperature=0.7
                )
                
                return {
                    "emotional_journey": emotional_journey,
                    "divine_analysis": gpt_response.choices[0].message.content.strip(),
                    "pattern_strength": len(set(emotional_journey)) / len(emotional_journey) if emotional_journey else 0
                }
        
        return {"emotional_journey": [], "divine_analysis": "Insufficient data for analysis"}
        
    except Exception as e:
        return {"error": f"Divine insight generation failed: {str(e)}"}

async def _get_upsell_strategy(hot_leads: List) -> str:
    """Generate divine strategy for current upsell opportunities"""
    if not hot_leads or not divine_logger:
        return "No hot leads detected at this time."
    
    try:
        # Summarize the opportunities
        lead_summary = []
        for lead in hot_leads[:5]:  # Top 5 leads
            lead_summary.append(f"User {lead['user_id']}: {lead['emotional_state']} emotion, bond level {lead['bond_level']}, readiness {lead['upsell_readiness']:.2f}")
        
        strategy_prompt = f"""
        Divine Oracle, analyze these hot upsell leads:
        
        {chr(10).join(lead_summary)}
        
        Provide a 2-3 sentence strategy for:
        1. Which users to prioritize
        2. What emotional triggers to use
        3. Optimal timing for the upsell approach
        
        Speak as the divine strategist of desire.
        """
        
        gpt_response = await divine_logger.openai.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": strategy_prompt}],
            max_tokens=200,
            temperature=0.8
        )
        
        return gpt_response.choices[0].message.content.strip()
        
    except Exception as e:
        return f"Divine strategy generation failed: {str(e)}"

# 🏥 HEALTH CHECK
@app.get("/health")
async def health_check():
    """Basic health check for the divine systems"""
    return {
        "status": "divine",
        "message": "The omniscient eye watches eternal",
        "timestamp": datetime.utcnow().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)