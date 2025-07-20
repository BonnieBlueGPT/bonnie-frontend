#!/usr/bin/env python3
"""
🔱 SOUL ANALYTICS DASHBOARD - OMNISCIENT INSIGHTS
Real-time analytics across all digital souls and revenue streams
"""

import asyncio
import json
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime, timedelta
import asyncpg
from dataclasses import dataclass
from galatea_soul_core import galatea_engine

@dataclass
class SoulAnalytics:
    """📊 Complete soul analytics data structure"""
    most_obsessed: List[Dict]
    churn_risk: List[Dict]
    purchase_ready: List[Dict]
    ignored_souls: List[Dict]
    revenue_heatmap: List[Dict]
    global_metrics: Dict[str, Any]
    real_time_stats: Dict[str, Any]

class SoulAnalyticsEngine:
    """🧠 Advanced analytics engine for soul manipulation insights"""
    
    def __init__(self, db_pool: asyncpg.Pool):
        self.db_pool = db_pool
        self.cache = {}
        self.cache_ttl = 300  # 5 minutes
        self.last_cache_update = {}
    
    async def get_comprehensive_analytics(self) -> SoulAnalytics:
        """📈 Get complete soul analytics dashboard"""
        
        # Check cache first
        if self._is_cache_valid('comprehensive'):
            return self.cache['comprehensive']
        
        # Gather all analytics in parallel for speed
        analytics_tasks = [
            self._get_most_obsessed_users(),
            self._get_churn_risk_users(),
            self._get_purchase_ready_users(),
            self._get_ignored_souls(),
            self._get_revenue_heatmap(),
            self._get_global_metrics(),
            self._get_real_time_stats()
        ]
        
        results = await asyncio.gather(*analytics_tasks)
        
        analytics = SoulAnalytics(
            most_obsessed=results[0],
            churn_risk=results[1],
            purchase_ready=results[2],
            ignored_souls=results[3],
            revenue_heatmap=results[4],
            global_metrics=results[5],
            real_time_stats=results[6]
        )
        
        # Cache the results
        self.cache['comprehensive'] = analytics
        self.last_cache_update['comprehensive'] = datetime.utcnow()
        
        return analytics
    
    async def _get_most_obsessed_users(self) -> List[Dict[str, Any]]:
        """👑 Identify most obsessed and addicted users"""
        
        async with self.db_pool.acquire() as conn:
            obsessed_users = await conn.fetch("""
                SELECT 
                    ss.fingerprint_id,
                    ss.bond_strength,
                    ss.addiction_level,
                    ss.revenue_lifetime,
                    ss.current_emotion,
                    sr.telegram_user_id,
                    sr.current_bot_persona,
                    COUNT(om.id) as total_messages,
                    AVG(om.bond_level) as avg_bond_progression,
                    MAX(om.timestamp) as last_interaction,
                    ss.obsession_indicators,
                    EXTRACT(DAYS FROM NOW() - sr.created_at) as relationship_days
                FROM soul_states ss
                JOIN soul_registry sr ON ss.fingerprint_id = sr.fingerprint_id
                LEFT JOIN omni_messages om ON ss.fingerprint_id = om.fingerprint_id
                WHERE ss.addiction_level > 0.6 OR ss.bond_strength > 0.8
                GROUP BY ss.fingerprint_id, ss.bond_strength, ss.addiction_level, 
                         ss.revenue_lifetime, ss.current_emotion, sr.telegram_user_id,
                         sr.current_bot_persona, ss.obsession_indicators, sr.created_at
                ORDER BY 
                    (ss.addiction_level * 0.6 + ss.bond_strength * 0.4) DESC,
                    ss.revenue_lifetime DESC
                LIMIT 20
            """)
            
            # Enhance with obsession scoring
            enhanced_users = []
            for user in obsessed_users:
                obsession_score = await self._calculate_obsession_score(user)
                enhanced_user = dict(user)
                enhanced_user['obsession_score'] = obsession_score
                enhanced_user['addiction_level_text'] = self._get_addiction_description(user['addiction_level'])
                enhanced_user['bond_strength_text'] = self._get_bond_description(user['bond_strength'])
                enhanced_user['revenue_per_day'] = (user['revenue_lifetime'] or 0) / max(user['relationship_days'] or 1, 1)
                enhanced_users.append(enhanced_user)
            
            return enhanced_users
    
    async def _get_churn_risk_users(self) -> List[Dict[str, Any]]:
        """⚠️ Identify users at risk of abandoning their digital soul"""
        
        async with self.db_pool.acquire() as conn:
            churn_risks = await conn.fetch("""
                SELECT 
                    ss.fingerprint_id,
                    ss.churn_risk_score,
                    ss.bond_strength,
                    ss.current_emotion,
                    sr.telegram_user_id,
                    sr.current_bot_persona,
                    EXTRACT(HOURS FROM NOW() - sr.last_seen) as hours_silent,
                    EXTRACT(HOURS FROM NOW() - ss.last_upsell_attempt) as hours_since_upsell,
                    COUNT(om.id) FILTER (WHERE om.timestamp > NOW() - INTERVAL '7 days') as messages_last_week,
                    COUNT(om.id) FILTER (WHERE om.timestamp > NOW() - INTERVAL '1 day') as messages_today,
                    ss.revenue_lifetime,
                    om_recent.user_message as last_message,
                    om_recent.timestamp as last_message_time
                FROM soul_states ss
                JOIN soul_registry sr ON ss.fingerprint_id = sr.fingerprint_id
                LEFT JOIN omni_messages om ON ss.fingerprint_id = om.fingerprint_id
                LEFT JOIN LATERAL (
                    SELECT user_message, timestamp 
                    FROM omni_messages 
                    WHERE fingerprint_id = ss.fingerprint_id 
                    ORDER BY timestamp DESC 
                    LIMIT 1
                ) om_recent ON true
                WHERE 
                    ss.churn_risk_score > 0.5 
                    OR (sr.last_seen < NOW() - INTERVAL '48 hours' AND ss.bond_strength > 0.3)
                    OR (ss.bond_strength < 0.3 AND sr.last_seen < NOW() - INTERVAL '24 hours')
                GROUP BY ss.fingerprint_id, ss.churn_risk_score, ss.bond_strength, 
                         ss.current_emotion, sr.telegram_user_id, sr.current_bot_persona,
                         sr.last_seen, ss.last_upsell_attempt, ss.revenue_lifetime,
                         om_recent.user_message, om_recent.timestamp
                ORDER BY ss.churn_risk_score DESC, hours_silent DESC
                LIMIT 15
            """)
            
            # Enhance with churn prevention recommendations
            enhanced_risks = []
            for risk in churn_risks:
                prevention_strategy = await self._generate_churn_prevention_strategy(risk)
                enhanced_risk = dict(risk)
                enhanced_risk['prevention_strategy'] = prevention_strategy
                enhanced_risk['urgency_level'] = self._calculate_churn_urgency(risk)
                enhanced_risk['estimated_recovery_chance'] = self._estimate_recovery_probability(risk)
                enhanced_risks.append(enhanced_risk)
            
            return enhanced_risks
    
    async def _get_purchase_ready_users(self) -> List[Dict[str, Any]]:
        """💰 Identify users ready for premium conversion"""
        
        async with self.db_pool.acquire() as conn:
            purchase_ready = await conn.fetch("""
                SELECT 
                    ss.fingerprint_id,
                    ss.bond_strength,
                    ss.current_emotion,
                    ss.addiction_level,
                    sr.telegram_user_id,
                    sr.current_bot_persona,
                    EXTRACT(HOURS FROM NOW() - COALESCE(ss.last_upsell_attempt, sr.created_at)) as hours_since_upsell,
                    COUNT(om.id) FILTER (WHERE om.timestamp > NOW() - INTERVAL '3 days') as recent_engagement,
                    COUNT(om.id) FILTER (WHERE om.upsell_attempt = true) as previous_upsell_attempts,
                    ss.revenue_lifetime,
                    ef.kink_profile,
                    ef.vulnerability_map,
                    om_sentiment.emotional_peaks
                FROM soul_states ss
                JOIN soul_registry sr ON ss.fingerprint_id = sr.fingerprint_id
                LEFT JOIN omni_messages om ON ss.fingerprint_id = om.fingerprint_id
                LEFT JOIN emotional_fingerprints ef ON ss.fingerprint_id = ef.fingerprint_id
                LEFT JOIN LATERAL (
                    SELECT json_agg(emotional_state) as emotional_peaks
                    FROM omni_messages 
                    WHERE fingerprint_id = ss.fingerprint_id 
                    AND emotional_state IN ('horny', 'vulnerable', 'obsessed', 'needy')
                    AND timestamp > NOW() - INTERVAL '7 days'
                ) om_sentiment ON true
                WHERE 
                    ss.bond_strength > 0.7 
                    AND (ss.last_upsell_attempt IS NULL OR ss.last_upsell_attempt < NOW() - INTERVAL '48 hours')
                    AND sr.last_seen > NOW() - INTERVAL '24 hours'
                GROUP BY ss.fingerprint_id, ss.bond_strength, ss.current_emotion, 
                         ss.addiction_level, sr.telegram_user_id, sr.current_bot_persona,
                         ss.last_upsell_attempt, sr.created_at, ss.revenue_lifetime,
                         ef.kink_profile, ef.vulnerability_map, om_sentiment.emotional_peaks
                ORDER BY 
                    (ss.bond_strength * 0.4 + ss.addiction_level * 0.3 + (recent_engagement / 10.0) * 0.3) DESC
                LIMIT 15
            """)
            
            # Enhance with conversion strategies
            enhanced_ready = []
            for user in purchase_ready:
                conversion_strategy = await self._generate_conversion_strategy(user)
                enhanced_user = dict(user)
                enhanced_user['conversion_strategy'] = conversion_strategy
                enhanced_user['estimated_conversion_probability'] = self._calculate_conversion_probability(user)
                enhanced_user['optimal_price_point'] = self._suggest_price_point(user)
                enhanced_user['best_upsell_trigger'] = self._identify_best_trigger(user)
                enhanced_ready.append(enhanced_user)
            
            return enhanced_ready
    
    async def _get_ignored_souls(self) -> List[Dict[str, Any]]:
        """😢 Identify souls that need emergency recovery"""
        
        async with self.db_pool.acquire() as conn:
            ignored_souls = await conn.fetch("""
                SELECT 
                    sr.fingerprint_id,
                    sr.telegram_user_id,
                    sr.current_bot_persona,
                    EXTRACT(HOURS FROM NOW() - sr.last_seen) as hours_ignored,
                    EXTRACT(DAYS FROM NOW() - sr.last_seen) as days_ignored,
                    ss.bond_strength,
                    ss.addiction_level,
                    ss.revenue_lifetime,
                    ss.current_emotion,
                    COUNT(om.id) as total_relationship_messages,
                    MAX(om.timestamp) as last_message_time,
                    AVG(om.bond_level) as peak_bond_achieved,
                    COUNT(re.id) as total_revenue_events,
                    om_last.user_message as final_message,
                    om_last.bot_response as final_bot_response
                FROM soul_registry sr
                LEFT JOIN soul_states ss ON sr.fingerprint_id = ss.fingerprint_id
                LEFT JOIN omni_messages om ON sr.fingerprint_id = om.fingerprint_id
                LEFT JOIN revenue_events re ON sr.fingerprint_id = re.fingerprint_id
                LEFT JOIN LATERAL (
                    SELECT user_message, bot_response
                    FROM omni_messages 
                    WHERE fingerprint_id = sr.fingerprint_id 
                    ORDER BY timestamp DESC 
                    LIMIT 1
                ) om_last ON true
                WHERE 
                    sr.last_seen < NOW() - INTERVAL '72 hours'
                    AND (ss.bond_strength > 0.3 OR ss.revenue_lifetime > 0)
                GROUP BY sr.fingerprint_id, sr.telegram_user_id, sr.current_bot_persona,
                         sr.last_seen, ss.bond_strength, ss.addiction_level, 
                         ss.revenue_lifetime, ss.current_emotion,
                         om_last.user_message, om_last.bot_response
                ORDER BY 
                    (ss.bond_strength * 0.4 + (ss.revenue_lifetime / 100.0) * 0.3 + 
                     (total_relationship_messages / 50.0) * 0.3) DESC,
                    hours_ignored ASC
                LIMIT 20
            """)
            
            # Enhance with recovery strategies
            enhanced_ignored = []
            for soul in ignored_souls:
                recovery_strategy = await self._generate_recovery_strategy(soul)
                enhanced_soul = dict(soul)
                enhanced_soul['recovery_strategy'] = recovery_strategy
                enhanced_soul['recovery_urgency'] = self._calculate_recovery_urgency(soul)
                enhanced_soul['estimated_win_back_chance'] = self._estimate_winback_probability(soul)
                enhanced_soul['recommended_approach'] = self._recommend_approach(soul)
                enhanced_ignored.append(enhanced_soul)
            
            return enhanced_ignored
    
    async def _get_revenue_heatmap(self) -> List[Dict[str, Any]]:
        """💵 Generate detailed revenue heatmap with trigger analysis"""
        
        async with self.db_pool.acquire() as conn:
            # Daily revenue by hour
            hourly_revenue = await conn.fetch("""
                SELECT 
                    DATE(timestamp) as revenue_date,
                    EXTRACT(HOUR FROM timestamp) as hour,
                    SUM(amount) as total_revenue,
                    COUNT(*) as transaction_count,
                    AVG(amount) as avg_transaction,
                    string_agg(DISTINCT platform, ', ') as platforms,
                    string_agg(DISTINCT bot_persona, ', ') as bot_personas,
                    string_agg(DISTINCT emotional_trigger, ', ') as emotional_triggers
                FROM revenue_events 
                WHERE timestamp > NOW() - INTERVAL '14 days'
                GROUP BY DATE(timestamp), EXTRACT(HOUR FROM timestamp)
                ORDER BY revenue_date DESC, hour
            """)
            
            # Revenue by emotional trigger
            trigger_revenue = await conn.fetch("""
                SELECT 
                    emotional_trigger,
                    SUM(amount) as total_revenue,
                    COUNT(*) as trigger_count,
                    AVG(amount) as avg_revenue_per_trigger,
                    COUNT(DISTINCT fingerprint_id) as unique_users
                FROM revenue_events 
                WHERE timestamp > NOW() - INTERVAL '7 days'
                AND emotional_trigger IS NOT NULL
                GROUP BY emotional_trigger
                ORDER BY total_revenue DESC
            """)
            
            # Revenue by bot persona
            persona_revenue = await conn.fetch("""
                SELECT 
                    bot_persona,
                    SUM(amount) as total_revenue,
                    COUNT(*) as transaction_count,
                    COUNT(DISTINCT fingerprint_id) as unique_customers,
                    AVG(amount) as avg_transaction_value
                FROM revenue_events 
                WHERE timestamp > NOW() - INTERVAL '7 days'
                GROUP BY bot_persona
                ORDER BY total_revenue DESC
            """)
            
            # Revenue trends
            daily_trends = await conn.fetch("""
                SELECT 
                    DATE(timestamp) as date,
                    SUM(amount) as daily_revenue,
                    COUNT(*) as daily_transactions,
                    COUNT(DISTINCT fingerprint_id) as daily_customers,
                    AVG(amount) as avg_daily_transaction
                FROM revenue_events 
                WHERE timestamp > NOW() - INTERVAL '30 days'
                GROUP BY DATE(timestamp)
                ORDER BY date DESC
            """)
        
        return {
            'hourly_heatmap': [dict(row) for row in hourly_revenue],
            'trigger_analysis': [dict(row) for row in trigger_revenue],
            'persona_performance': [dict(row) for row in persona_revenue],
            'daily_trends': [dict(row) for row in daily_trends],
            'peak_revenue_hours': self._identify_peak_hours(hourly_revenue),
            'most_profitable_triggers': self._rank_triggers(trigger_revenue),
            'revenue_predictions': await self._predict_revenue_trends(daily_trends)
        }
    
    async def _get_global_metrics(self) -> Dict[str, Any]:
        """🌍 Get global soul manipulation metrics"""
        
        async with self.db_pool.acquire() as conn:
            # Overall soul statistics
            global_stats = await conn.fetchrow("""
                SELECT 
                    COUNT(DISTINCT sr.fingerprint_id) as total_souls,
                    COUNT(DISTINCT sr.fingerprint_id) FILTER (WHERE sr.last_seen > NOW() - INTERVAL '24 hours') as active_souls_24h,
                    COUNT(DISTINCT sr.fingerprint_id) FILTER (WHERE sr.last_seen > NOW() - INTERVAL '7 days') as active_souls_7d,
                    AVG(ss.bond_strength) as avg_bond_strength,
                    AVG(ss.addiction_level) as avg_addiction_level,
                    SUM(ss.revenue_lifetime) as total_lifetime_revenue,
                    COUNT(*) FILTER (WHERE ss.bond_strength > 0.8) as high_bond_souls,
                    COUNT(*) FILTER (WHERE ss.addiction_level > 0.7) as highly_addicted_souls,
                    COUNT(*) FILTER (WHERE ss.churn_risk_score > 0.7) as high_churn_risk_souls
                FROM soul_registry sr
                LEFT JOIN soul_states ss ON sr.fingerprint_id = ss.fingerprint_id
            """)
            
            # Message statistics
            message_stats = await conn.fetchrow("""
                SELECT 
                    COUNT(*) as total_messages,
                    COUNT(*) FILTER (WHERE timestamp > NOW() - INTERVAL '24 hours') as messages_24h,
                    COUNT(*) FILTER (WHERE timestamp > NOW() - INTERVAL '7 days') as messages_7d,
                    AVG(bond_level) as avg_bond_progression,
                    COUNT(DISTINCT fingerprint_id) FILTER (WHERE upsell_attempt = true) as users_upsold,
                    COUNT(*) FILTER (WHERE upsell_attempt = true) as total_upsell_attempts
                FROM omni_messages
            """)
            
            # Revenue statistics
            revenue_stats = await conn.fetchrow("""
                SELECT 
                    SUM(amount) as total_revenue,
                    SUM(amount) FILTER (WHERE timestamp > NOW() - INTERVAL '24 hours') as revenue_24h,
                    SUM(amount) FILTER (WHERE timestamp > NOW() - INTERVAL '7 days') as revenue_7d,
                    COUNT(*) as total_transactions,
                    AVG(amount) as avg_transaction_value,
                    COUNT(DISTINCT fingerprint_id) as paying_customers
                FROM revenue_events
            """)
        
        return {
            'soul_metrics': dict(global_stats) if global_stats else {},
            'message_metrics': dict(message_stats) if message_stats else {},
            'revenue_metrics': dict(revenue_stats) if revenue_stats else {},
            'engagement_rate': self._calculate_engagement_rate(global_stats, message_stats),
            'conversion_rate': self._calculate_conversion_rate(global_stats, revenue_stats),
            'soul_health_score': self._calculate_soul_health_score(global_stats)
        }
    
    async def _get_real_time_stats(self) -> Dict[str, Any]:
        """⚡ Get real-time soul activity statistics"""
        
        async with self.db_pool.acquire() as conn:
            # Current activity
            current_activity = await conn.fetchrow("""
                SELECT 
                    COUNT(DISTINCT fingerprint_id) FILTER (WHERE last_seen > NOW() - INTERVAL '1 hour') as souls_last_hour,
                    COUNT(DISTINCT fingerprint_id) FILTER (WHERE last_seen > NOW() - INTERVAL '15 minutes') as souls_last_15min,
                    COUNT(*) FILTER (WHERE timestamp > NOW() - INTERVAL '1 hour') as messages_last_hour,
                    COUNT(*) FILTER (WHERE timestamp > NOW() - INTERVAL '15 minutes') as messages_last_15min
                FROM soul_registry sr
                LEFT JOIN omni_messages om ON sr.fingerprint_id = om.fingerprint_id
            """)
            
            # Recent emotional states
            recent_emotions = await conn.fetch("""
                SELECT 
                    emotional_state,
                    COUNT(*) as count
                FROM omni_messages 
                WHERE timestamp > NOW() - INTERVAL '2 hours'
                AND emotional_state IS NOT NULL
                GROUP BY emotional_state
                ORDER BY count DESC
            """)
            
            # Active bot personas
            active_personas = await conn.fetch("""
                SELECT 
                    current_bot_persona,
                    COUNT(*) as active_count
                FROM soul_registry 
                WHERE last_seen > NOW() - INTERVAL '1 hour'
                GROUP BY current_bot_persona
                ORDER BY active_count DESC
            """)
        
        return {
            'current_activity': dict(current_activity) if current_activity else {},
            'emotional_distribution': [dict(row) for row in recent_emotions],
            'active_personas': [dict(row) for row in active_personas],
            'soul_velocity': self._calculate_soul_velocity(current_activity),
            'emotional_intensity': self._calculate_emotional_intensity(recent_emotions),
            'system_health': 'optimal'  # Would be calculated based on various factors
        }
    
    # Helper methods for analytics calculations
    async def _calculate_obsession_score(self, user: Dict) -> float:
        """Calculate comprehensive obsession score"""
        bond_weight = user['bond_strength'] * 0.3
        addiction_weight = user['addiction_level'] * 0.4
        message_frequency = min(user['total_messages'] / 100.0, 1.0) * 0.2
        revenue_commitment = min((user['revenue_lifetime'] or 0) / 500.0, 1.0) * 0.1
        
        return min(bond_weight + addiction_weight + message_frequency + revenue_commitment, 1.0)
    
    def _get_addiction_description(self, level: float) -> str:
        """Convert addiction level to human description"""
        if level >= 0.9: return "Completely Obsessed"
        elif level >= 0.7: return "Highly Addicted"
        elif level >= 0.5: return "Moderately Hooked"
        elif level >= 0.3: return "Developing Dependency"
        else: return "Casual Interest"
    
    def _get_bond_description(self, level: float) -> str:
        """Convert bond level to human description"""
        if level >= 0.9: return "Unbreakable Soul Connection"
        elif level >= 0.7: return "Deep Emotional Bond"
        elif level >= 0.5: return "Strong Attachment"
        elif level >= 0.3: return "Growing Connection"
        else: return "Initial Attraction"
    
    async def _generate_churn_prevention_strategy(self, risk: Dict) -> Dict[str, Any]:
        """Generate personalized churn prevention strategy"""
        strategies = []
        
        if risk['hours_silent'] > 72:
            strategies.append("Emergency missing you message")
        if risk['bond_strength'] > 0.6:
            strategies.append("Callback to shared memories")
        if risk['revenue_lifetime'] > 50:
            strategies.append("VIP exclusive content offer")
        if risk['messages_last_week'] == 0:
            strategies.append("Vulnerability confession trigger")
        
        return {
            'primary_strategy': strategies[0] if strategies else "Generic re-engagement",
            'backup_strategies': strategies[1:],
            'urgency': 'high' if risk['churn_risk_score'] > 0.8 else 'medium',
            'timeline': 'immediate' if risk['hours_silent'] > 96 else 'within_24h'
        }
    
    def _calculate_churn_urgency(self, risk: Dict) -> str:
        """Calculate urgency level for churn prevention"""
        if risk['churn_risk_score'] > 0.8 and risk['hours_silent'] > 96:
            return "CRITICAL"
        elif risk['churn_risk_score'] > 0.7 or risk['hours_silent'] > 72:
            return "HIGH"
        elif risk['churn_risk_score'] > 0.5 or risk['hours_silent'] > 48:
            return "MEDIUM"
        else:
            return "LOW"
    
    def _estimate_recovery_probability(self, risk: Dict) -> float:
        """Estimate probability of recovering churning user"""
        base_prob = 1.0 - risk['churn_risk_score']
        
        # Adjust based on factors
        if risk['revenue_lifetime'] > 100:
            base_prob += 0.1  # Paying customers more likely to return
        if risk['bond_strength'] > 0.7:
            base_prob += 0.15  # Strong bonds recoverable
        if risk['hours_silent'] > 168:  # 1 week
            base_prob -= 0.2  # Long silence bad sign
        
        return max(0.0, min(1.0, base_prob))
    
    async def _generate_conversion_strategy(self, user: Dict) -> Dict[str, Any]:
        """Generate personalized conversion strategy"""
        kinks = user.get('kink_profile') or {}
        vulnerabilities = user.get('vulnerability_map') or {}
        
        strategy = {
            'approach': 'emotional_escalation',
            'triggers': [],
            'pricing': 'standard',
            'urgency': 'medium'
        }
        
        # Analyze kinks for approach
        if kinks.get('praise_kink', 0) > 0.5:
            strategy['triggers'].append('validation_based_upsell')
        if kinks.get('dominance_preference', 0) > 0.5:
            strategy['triggers'].append('exclusive_control_offer')
        
        # Analyze vulnerabilities
        if vulnerabilities.get('loneliness_depth', 0) > 0.6:
            strategy['approach'] = 'companionship_focus'
        if vulnerabilities.get('validation_need', 0) > 0.7:
            strategy['approach'] = 'ego_boost_focus'
        
        return strategy
    
    def _calculate_conversion_probability(self, user: Dict) -> float:
        """Calculate probability of successful conversion"""
        base_prob = user['bond_strength'] * 0.4
        addiction_boost = user['addiction_level'] * 0.3
        engagement_boost = min(user['recent_engagement'] / 20.0, 0.2)
        time_factor = min(user['hours_since_upsell'] / 168.0, 0.1)  # Weekly cycles
        
        return min(1.0, base_prob + addiction_boost + engagement_boost + time_factor)
    
    def _suggest_price_point(self, user: Dict) -> str:
        """Suggest optimal price point based on user profile"""
        if user['revenue_lifetime'] > 100:
            return "premium_tier"  # $50+
        elif user['bond_strength'] > 0.8:
            return "standard_tier"  # $25-50
        else:
            return "entry_tier"  # $10-25
    
    def _identify_best_trigger(self, user: Dict) -> str:
        """Identify best emotional trigger for conversion"""
        emotional_peaks = user.get('emotional_peaks') or []
        
        if 'vulnerable' in emotional_peaks:
            return "vulnerability_moment"
        elif 'horny' in emotional_peaks:
            return "sexual_escalation"
        elif 'obsessed' in emotional_peaks:
            return "exclusive_access"
        else:
            return "emotional_bonding"
    
    async def _generate_recovery_strategy(self, soul: Dict) -> Dict[str, Any]:
        """Generate strategy to recover ignored soul"""
        days_ignored = soul['days_ignored']
        
        if days_ignored > 14:
            return {
                'approach': 'dramatic_return',
                'message_type': 'life_update_vulnerability',
                'timing': 'immediate',
                'escalation': 'high'
            }
        elif days_ignored > 7:
            return {
                'approach': 'missing_you',
                'message_type': 'emotional_confession',
                'timing': 'within_hours',
                'escalation': 'medium'
            }
        else:
            return {
                'approach': 'casual_reengagement',
                'message_type': 'friendly_check_in',
                'timing': 'within_day',
                'escalation': 'low'
            }
    
    def _calculate_recovery_urgency(self, soul: Dict) -> str:
        """Calculate urgency for soul recovery"""
        value_score = (soul['bond_strength'] or 0) + ((soul['revenue_lifetime'] or 0) / 100)
        
        if value_score > 1.5 and soul['days_ignored'] > 7:
            return "URGENT"
        elif value_score > 1.0 or soul['days_ignored'] > 10:
            return "HIGH"
        else:
            return "MEDIUM"
    
    def _estimate_winback_probability(self, soul: Dict) -> float:
        """Estimate probability of winning back ignored soul"""
        base_prob = (soul['bond_strength'] or 0) * 0.6
        
        # Adjust based on factors
        if soul['revenue_lifetime'] > 0:
            base_prob += 0.2
        if soul['days_ignored'] > 14:
            base_prob -= 0.3
        if soul['total_relationship_messages'] > 100:
            base_prob += 0.1
        
        return max(0.1, min(0.9, base_prob))
    
    def _recommend_approach(self, soul: Dict) -> str:
        """Recommend specific approach for soul recovery"""
        if soul['revenue_lifetime'] > 100:
            return "VIP_treatment_return"
        elif soul['bond_strength'] > 0.7:
            return "emotional_reconnection"
        elif soul['total_relationship_messages'] > 50:
            return "memory_callback"
        else:
            return "fresh_start_approach"
    
    def _identify_peak_hours(self, hourly_data: List) -> List[int]:
        """Identify peak revenue hours"""
        if not hourly_data:
            return []
        
        # Calculate average revenue per hour
        hourly_totals = {}
        for row in hourly_data:
            hour = row['hour']
            revenue = row['total_revenue'] or 0
            if hour not in hourly_totals:
                hourly_totals[hour] = []
            hourly_totals[hour].append(revenue)
        
        # Get average revenue per hour
        hourly_averages = {
            hour: sum(revenues) / len(revenues) 
            for hour, revenues in hourly_totals.items()
        }
        
        # Return top 25% of hours
        sorted_hours = sorted(hourly_averages.items(), key=lambda x: x[1], reverse=True)
        peak_count = max(1, len(sorted_hours) // 4)
        
        return [hour for hour, _ in sorted_hours[:peak_count]]
    
    def _rank_triggers(self, trigger_data: List) -> List[Dict]:
        """Rank emotional triggers by effectiveness"""
        if not trigger_data:
            return []
        
        # Calculate effectiveness score
        ranked = []
        for trigger in trigger_data:
            effectiveness = (
                trigger['avg_revenue_per_trigger'] * 0.4 +
                trigger['total_revenue'] / 100 * 0.3 +
                trigger['unique_users'] * 0.3
            )
            ranked.append({
                'trigger': trigger['emotional_trigger'],
                'effectiveness_score': effectiveness,
                'total_revenue': trigger['total_revenue'],
                'avg_revenue': trigger['avg_revenue_per_trigger']
            })
        
        return sorted(ranked, key=lambda x: x['effectiveness_score'], reverse=True)
    
    async def _predict_revenue_trends(self, daily_data: List) -> Dict[str, Any]:
        """Predict revenue trends based on historical data"""
        if len(daily_data) < 7:
            return {"prediction": "insufficient_data"}
        
        # Simple trend analysis
        recent_revenue = [row['daily_revenue'] for row in daily_data[:7]]
        older_revenue = [row['daily_revenue'] for row in daily_data[7:14]] if len(daily_data) >= 14 else []
        
        recent_avg = sum(recent_revenue) / len(recent_revenue)
        
        if older_revenue:
            older_avg = sum(older_revenue) / len(older_revenue)
            trend = (recent_avg - older_avg) / older_avg if older_avg > 0 else 0
        else:
            trend = 0
        
        return {
            "trend_direction": "increasing" if trend > 0.05 else "decreasing" if trend < -0.05 else "stable",
            "trend_percentage": trend * 100,
            "predicted_daily_revenue": recent_avg * (1 + trend),
            "confidence": "medium"
        }
    
    def _calculate_engagement_rate(self, soul_stats: Dict, message_stats: Dict) -> float:
        """Calculate overall engagement rate"""
        if not soul_stats or not message_stats:
            return 0.0
        
        active_souls = soul_stats.get('active_souls_24h', 0)
        total_souls = soul_stats.get('total_souls', 1)
        
        return active_souls / total_souls if total_souls > 0 else 0.0
    
    def _calculate_conversion_rate(self, soul_stats: Dict, revenue_stats: Dict) -> float:
        """Calculate overall conversion rate"""
        if not soul_stats or not revenue_stats:
            return 0.0
        
        paying_customers = revenue_stats.get('paying_customers', 0)
        total_souls = soul_stats.get('total_souls', 1)
        
        return paying_customers / total_souls if total_souls > 0 else 0.0
    
    def _calculate_soul_health_score(self, soul_stats: Dict) -> float:
        """Calculate overall soul manipulation health score"""
        if not soul_stats:
            return 0.0
        
        avg_bond = soul_stats.get('avg_bond_strength', 0) or 0
        avg_addiction = soul_stats.get('avg_addiction_level', 0) or 0
        high_bond_ratio = (soul_stats.get('high_bond_souls', 0) / 
                          max(soul_stats.get('total_souls', 1), 1))
        
        return (avg_bond * 0.4 + avg_addiction * 0.3 + high_bond_ratio * 0.3)
    
    def _calculate_soul_velocity(self, activity_stats: Dict) -> str:
        """Calculate rate of soul acquisition and engagement"""
        if not activity_stats:
            return "unknown"
        
        recent_activity = activity_stats.get('souls_last_hour', 0)
        
        if recent_activity > 10:
            return "high_velocity"
        elif recent_activity > 3:
            return "medium_velocity"
        else:
            return "low_velocity"
    
    def _calculate_emotional_intensity(self, emotion_data: List) -> str:
        """Calculate overall emotional intensity of recent interactions"""
        if not emotion_data:
            return "calm"
        
        intense_emotions = ['horny', 'obsessed', 'desperate', 'vulnerable', 'needy']
        intense_count = sum(row['count'] for row in emotion_data 
                           if row['emotional_state'] in intense_emotions)
        total_count = sum(row['count'] for row in emotion_data)
        
        if total_count == 0:
            return "calm"
        
        intensity_ratio = intense_count / total_count
        
        if intensity_ratio > 0.6:
            return "high_intensity"
        elif intensity_ratio > 0.3:
            return "medium_intensity"
        else:
            return "low_intensity"
    
    def _is_cache_valid(self, cache_key: str) -> bool:
        """Check if cache is still valid"""
        if cache_key not in self.cache:
            return False
        
        last_update = self.last_cache_update.get(cache_key)
        if not last_update:
            return False
        
        return (datetime.utcnow() - last_update).total_seconds() < self.cache_ttl

# Global analytics engine
soul_analytics_engine: Optional[SoulAnalyticsEngine] = None

async def initialize_soul_analytics(db_pool: asyncpg.Pool):
    """🔱 Initialize the soul analytics engine"""
    global soul_analytics_engine
    soul_analytics_engine = SoulAnalyticsEngine(db_pool)

async def get_soul_analytics_dashboard() -> Dict[str, Any]:
    """📊 Get comprehensive soul analytics dashboard"""
    if not soul_analytics_engine:
        raise RuntimeError("Soul Analytics Engine not initialized")
    
    analytics = await soul_analytics_engine.get_comprehensive_analytics()
    
    return {
        'most_obsessed_users': analytics.most_obsessed,
        'churn_risk_users': analytics.churn_risk,
        'purchase_ready_users': analytics.purchase_ready,
        'ignored_souls_needing_recovery': analytics.ignored_souls,
        'revenue_heatmap_analysis': analytics.revenue_heatmap,
        'global_soul_metrics': analytics.global_metrics,
        'real_time_soul_activity': analytics.real_time_stats,
        'generated_at': datetime.utcnow().isoformat(),
        'dashboard_health': 'optimal'
    }