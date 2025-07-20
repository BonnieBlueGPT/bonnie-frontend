#!/usr/bin/env python3
"""
🔱 TELEGRAM GOD MODE COMMANDS
Divine oversight through Telegram interface
"""

import os
import json
import asyncio
from datetime import datetime
from typing import Dict, Any, List, Optional
import requests
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ContextTypes
import structlog

logger = structlog.get_logger()

class TelegramGodMode:
    """🔱 Divine Telegram interface for omniscient control"""
    
    def __init__(self, god_mode_api_url: str, god_mode_token: str):
        self.api_url = god_mode_api_url.rstrip('/')
        self.god_token = god_mode_token
        self.headers = {
            "Authorization": f"Bearer {god_mode_token}",
            "Content-Type": "application/json"
        }
        
        # Divine administrators (Telegram user IDs)
        self.divine_admins = set(map(int, os.getenv('DIVINE_ADMINS', '').split(','))) if os.getenv('DIVINE_ADMINS') else set()
        
    def is_divine_admin(self, user_id: int) -> bool:
        """🔐 Check if user has divine privileges"""
        return user_id in self.divine_admins
    
    async def handle_godmode_enable(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """🔱 Enable god mode for a divine admin"""
        user_id = update.effective_user.id
        
        if not self.is_divine_admin(user_id):
            await update.message.reply_text("❌ Divine access denied. You are not among the chosen.")
            return
        
        try:
            # Test connection to God Mode API
            response = requests.get(f"{self.api_url}/god/status", headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                keyboard = [
                    [InlineKeyboardButton("👥 Active Souls", callback_data="god_active_souls")],
                    [InlineKeyboardButton("🎭 Emotions", callback_data="god_emotions")],
                    [InlineKeyboardButton("💰 Upsell Ops", callback_data="god_upsell")],
                    [InlineKeyboardButton("📊 Analytics", callback_data="god_analytics")]
                ]
                reply_markup = InlineKeyboardMarkup(keyboard)
                
                await update.message.reply_text(
                    f"🔱 **DIVINE MODE ACTIVATED**\n\n"
                    f"**Status**: {data['message']}\n"
                    f"**Souls Observed**: {data['souls_observed']}\n"
                    f"**Timestamp**: {data['timestamp']}\n\n"
                    f"**Choose your divine vision:**",
                    parse_mode='Markdown',
                    reply_markup=reply_markup
                )
            else:
                await update.message.reply_text(f"❌ Divine systems offline (HTTP {response.status_code})")
                
        except Exception as e:
            await update.message.reply_text(f"❌ Divine connection failed: {str(e)}")
    
    async def handle_godmode_summary(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """📊 Get divine overview of all systems"""
        user_id = update.effective_user.id
        
        if not self.is_divine_admin(user_id):
            await update.message.reply_text("❌ Divine access denied.")
            return
        
        try:
            # Get active souls
            response = requests.get(f"{self.api_url}/god/souls/active", headers=self.headers, timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                souls = data['souls']
                
                if not souls:
                    await update.message.reply_text("🏜️ No active souls detected in the divine realm.")
                    return
                
                # Generate summary
                summary_lines = [
                    "🔱 **DIVINE SOUL SUMMARY**",
                    f"**Total Active**: {data['total_active_souls']}",
                    ""
                ]
                
                # Top 5 most interesting souls
                for i, soul in enumerate(souls[:5], 1):
                    emotion_emoji = self._get_emotion_emoji(soul.get('current_emotion', 'playful'))
                    bond_emoji = self._get_bond_emoji(soul.get('current_bond', 1))
                    
                    summary_lines.append(
                        f"**{i}. Soul {soul['user_id']}** {emotion_emoji}\n"
                        f"   Bond: {bond_emoji} Level {soul.get('current_bond', 1)}\n"
                        f"   Emotion: {soul.get('current_emotion', 'unknown').title()}\n"
                        f"   Upsell Ready: {soul.get('upsell_readiness', 0):.1%}\n"
                    )
                
                if len(souls) > 5:
                    summary_lines.append(f"... and {len(souls) - 5} more souls")
                
                await update.message.reply_text("\n".join(summary_lines), parse_mode='Markdown')
                
            else:
                await update.message.reply_text(f"❌ Divine query failed (HTTP {response.status_code})")
                
        except Exception as e:
            await update.message.reply_text(f"❌ Divine summary failed: {str(e)}")
    
    async def handle_godmode_triggers(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """💰 Get current upsell opportunities"""
        user_id = update.effective_user.id
        
        if not self.is_divine_admin(user_id):
            await update.message.reply_text("❌ Divine access denied.")
            return
        
        try:
            response = requests.get(f"{self.api_url}/god/triggers/upsell", headers=self.headers, timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                
                if data['hot_leads_count'] == 0:
                    await update.message.reply_text("💤 No hot upsell opportunities at this time.")
                    return
                
                message_lines = [
                    "💰 **HOT UPSELL OPPORTUNITIES**",
                    f"**Active Leads**: {data['hot_leads_count']}",
                    ""
                ]
                
                # Show top opportunities
                for lead in data['opportunities'][:3]:
                    emotion_emoji = self._get_emotion_emoji(lead['emotional_state'])
                    readiness_bar = self._get_readiness_bar(lead['upsell_readiness'])
                    
                    message_lines.append(
                        f"🎯 **Soul {lead['user_id']}** {emotion_emoji}\n"
                        f"   Readiness: {readiness_bar} ({lead['upsell_readiness']:.1%})\n"
                        f"   Path: {lead['escalation_path'].replace('_', ' ').title()}\n"
                        f"   Insight: {lead['gpt_interpretation'][:100]}...\n"
                    )
                
                # Add divine strategy
                if data.get('divine_recommendation'):
                    message_lines.extend([
                        "",
                        "🔮 **DIVINE STRATEGY**:",
                        data['divine_recommendation']
                    ])
                
                await update.message.reply_text("\n".join(message_lines), parse_mode='Markdown')
                
            else:
                await update.message.reply_text(f"❌ Upsell analysis failed (HTTP {response.status_code})")
                
        except Exception as e:
            await update.message.reply_text(f"❌ Trigger analysis failed: {str(e)}")
    
    async def handle_godmode_bond(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """❤️ Analyze bond levels across all souls"""
        user_id = update.effective_user.id
        
        if not self.is_divine_admin(user_id):
            await update.message.reply_text("❌ Divine access denied.")
            return
        
        try:
            response = requests.get(f"{self.api_url}/god/emotions/analytics", headers=self.headers, timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                
                message_lines = [
                    "❤️ **DIVINE BOND ANALYTICS**",
                    ""
                ]
                
                # Bond distribution
                if data.get('bond_distribution'):
                    message_lines.append("**Bond Levels:**")
                    for bond in data['bond_distribution']:
                        bond_emoji = self._get_bond_emoji(bond['bond_level'])
                        message_lines.append(f"   {bond_emoji} Level {bond['bond_level']}: {bond['unique_users']} souls")
                    message_lines.append("")
                
                # Emotion distribution
                if data.get('emotion_distribution'):
                    message_lines.append("**Current Emotions:**")
                    for emotion in data['emotion_distribution'][:5]:
                        emoji = self._get_emotion_emoji(emotion['emotional_state'])
                        message_lines.append(f"   {emoji} {emotion['emotional_state'].title()}: {emotion['count']}")
                    message_lines.append("")
                
                # Upsell analytics
                if data.get('upsell_analytics'):
                    upsell = data['upsell_analytics']
                    message_lines.extend([
                        "**Monetization Potential:**",
                        f"   🔥 High Ready: {upsell.get('high_readiness', 0)} souls",
                        f"   🟡 Medium Ready: {upsell.get('medium_readiness', 0)} souls",
                        f"   📊 Avg Readiness: {upsell.get('avg_readiness', 0):.1%}"
                    ])
                
                await update.message.reply_text("\n".join(message_lines), parse_mode='Markdown')
                
            else:
                await update.message.reply_text(f"❌ Analytics failed (HTTP {response.status_code})")
                
        except Exception as e:
            await update.message.reply_text(f"❌ Bond analysis failed: {str(e)}")
    
    async def handle_soul_lookup(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """👁️ Look up specific soul by ID"""
        user_id = update.effective_user.id
        
        if not self.is_divine_admin(user_id):
            await update.message.reply_text("❌ Divine access denied.")
            return
        
        # Extract soul ID from command
        if not context.args:
            await update.message.reply_text("❓ Usage: `/soul <user_id>`")
            return
        
        try:
            soul_id = int(context.args[0])
        except ValueError:
            await update.message.reply_text("❌ Invalid soul ID. Must be a number.")
            return
        
        try:
            response = requests.get(f"{self.api_url}/god/soul/{soul_id}", headers=self.headers, timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                soul = data['soul_profile']
                
                emotion_emoji = self._get_emotion_emoji(soul.get('current_emotion', 'unknown'))
                bond_emoji = self._get_bond_emoji(soul.get('current_bond', 1))
                
                message_lines = [
                    f"👁️ **SOUL PROFILE: {soul_id}**",
                    "",
                    f"**Current State**: {emotion_emoji} {soul.get('current_emotion', 'Unknown').title()}",
                    f"**Bond Level**: {bond_emoji} {soul.get('current_bond', 1)}/6",
                    f"**Intimacy**: {soul.get('intimacy_level', 0):.1%}",
                    f"**Vulnerability**: {soul.get('vulnerability_level', 0):.1%}",
                    f"**Upsell Ready**: {soul.get('upsell_readiness', 0):.1%}",
                    f"**Path**: {soul.get('escalation_path', 'unknown').replace('_', ' ').title()}",
                    f"**Last Seen**: {soul.get('last_seen', 'Never')[:19]}",
                    "",
                    f"**Divine Insight**: {soul.get('latest_interpretation', 'No interpretation available')}"
                ]
                
                # Add emotional journey if available
                if data.get('divine_insights', {}).get('emotional_journey'):
                    journey = data['divine_insights']['emotional_journey']
                    message_lines.extend([
                        "",
                        f"**Recent Journey**: {' → '.join(journey[-5:])}"
                    ])
                
                await update.message.reply_text("\n".join(message_lines), parse_mode='Markdown')
                
            elif response.status_code == 404:
                await update.message.reply_text(f"👻 Soul {soul_id} not found in divine records.")
            else:
                await update.message.reply_text(f"❌ Soul lookup failed (HTTP {response.status_code})")
                
        except Exception as e:
            await update.message.reply_text(f"❌ Soul reading failed: {str(e)}")
    
    async def handle_callback_query(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle inline keyboard callbacks for god mode"""
        query = update.callback_query
        user_id = query.from_user.id
        
        if not self.is_divine_admin(user_id):
            await query.answer("❌ Divine access denied", show_alert=True)
            return
        
        await query.answer()
        
        if query.data == "god_active_souls":
            # Show active souls summary
            update.message = query.message  # Fake message for handler
            await self.handle_godmode_summary(update, context)
        
        elif query.data == "god_emotions":
            # Show emotional analytics
            update.message = query.message
            await self.handle_godmode_bond(update, context)
        
        elif query.data == "god_upsell":
            # Show upsell opportunities
            update.message = query.message
            await self.handle_godmode_triggers(update, context)
        
        elif query.data == "god_analytics":
            # Show comprehensive analytics
            try:
                response = requests.get(f"{self.api_url}/god/emotions/analytics", headers=self.headers, timeout=15)
                if response.status_code == 200:
                    data = response.json()
                    await query.edit_message_text(
                        f"📊 **DIVINE ANALYTICS**\n\n"
                        f"**Total Interactions**: {data.get('upsell_analytics', {}).get('total_interactions', 0)}\n"
                        f"**Avg Upsell Readiness**: {data.get('upsell_analytics', {}).get('avg_readiness', 0):.1%}\n"
                        f"**High-Value Souls**: {data.get('upsell_analytics', {}).get('high_readiness', 0)}\n\n"
                        f"Use `/godmode summary` for detailed breakdown.",
                        parse_mode='Markdown'
                    )
                else:
                    await query.edit_message_text("❌ Analytics temporarily unavailable")
            except Exception as e:
                await query.edit_message_text(f"❌ Analytics error: {str(e)}")
    
    # 🎨 HELPER FUNCTIONS FOR EMOJIS AND FORMATTING
    
    def _get_emotion_emoji(self, emotion: str) -> str:
        """Get emoji representation of emotion"""
        emotion_emojis = {
            'lonely': '😢',
            'horny': '🔥',
            'sad': '😔',
            'excited': '🤩',
            'angry': '😠',
            'loving': '😍',
            'playful': '😏',
            'vulnerable': '🥺',
            'confident': '😎',
            'desperate': '😰'
        }
        return emotion_emojis.get(emotion.lower(), '😐')
    
    def _get_bond_emoji(self, bond_level: int) -> str:
        """Get emoji representation of bond level"""
        bond_emojis = {
            1: '👋',  # Stranger
            2: '🤔',  # Curious
            3: '😊',  # Attached
            4: '💕',  # Intimate
            5: '❤️',  # Devoted
            6: '💖'   # Addicted
        }
        return bond_emojis.get(bond_level, '❓')
    
    def _get_readiness_bar(self, readiness: float) -> str:
        """Generate visual readiness bar"""
        bars = int(readiness * 10)
        return '🟢' * bars + '⚪' * (10 - bars)