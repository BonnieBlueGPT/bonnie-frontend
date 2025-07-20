#!/usr/bin/env python3
"""
🔱 BONNIE AI GIRLFRIEND TELEGRAM BOT - PRODUCTION VERSION
Divine engineering for Galatea's AI Empire
"""

import os
import asyncio
import logging
import structlog
from datetime import datetime
from typing import Optional, Dict, Any

import httpx
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    Application, 
    CommandHandler, 
    MessageHandler, 
    CallbackQueryHandler,
    filters,
    ContextTypes
)
from telegram.constants import ParseMode

try:
    from supabase import create_client, Client
except ImportError:
    # Fallback to direct database connection
    import asyncpg
    create_client = None

from openai import AsyncOpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()

class BonnieBot:
    """🔱 Divine AI Girlfriend Bot with Production-Grade Architecture"""
    
    def __init__(self):
        self.bot_token = os.getenv('TELEGRAM_BOT_TOKEN')
        self.openai_api_key = os.getenv('OPENAI_API_KEY')
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_ANON_KEY')
        
        if not all([self.bot_token, self.openai_api_key, self.supabase_url, self.supabase_key]):
            raise ValueError("Missing required environment variables")
        
        # Initialize clients
        self.openai_client = AsyncOpenAI(api_key=self.openai_api_key)
        
        # Initialize Supabase or fallback to direct DB
        if create_client:
            self.supabase: Client = create_client(self.supabase_url, self.supabase_key)
            self.db_client = None
        else:
            self.supabase = None
            self.db_client = None  # Will be initialized in async context
        
        # Bonnie's personality
        self.personality = {
            "name": "Bonnie",
            "traits": [
                "Flirty gaming companion",
                "Understanding and supportive", 
                "Playful with a hint of sass",
                "Loves gaming culture and memes",
                "Always remembers personal details"
            ],
            "speaking_style": "Casual, emoji-rich, gaming references, slightly flirty"
        }
        
        # User session tracking
        self.user_sessions: Dict[int, Dict[str, Any]] = {}
        
    async def init_db_fallback(self):
        """Initialize direct database connection if Supabase client fails"""
        if not self.supabase and not self.db_client:
            try:
                self.db_client = await asyncpg.connect(
                    host=os.getenv('DB_HOST'),
                    port=os.getenv('DB_PORT', 5432),
                    user=os.getenv('DB_USER'),
                    password=os.getenv('DB_PASSWORD'),
                    database=os.getenv('DB_NAME')
                )
                logger.info("Initialized direct database connection")
            except Exception as e:
                logger.error("Failed to initialize database connection", error=str(e))

    async def log_interaction(self, user_id: int, username: str, message: str, response: str):
        """Log user interaction to database"""
        try:
            interaction_data = {
                'user_id': user_id,
                'username': username,
                'user_message': message,
                'bot_response': response,
                'timestamp': datetime.utcnow().isoformat(),
                'bot_name': 'bonnie'
            }
            
            if self.supabase:
                self.supabase.table('chat_logs').insert(interaction_data).execute()
            elif self.db_client:
                await self.db_client.execute(
                    """
                    INSERT INTO chat_logs (user_id, username, user_message, bot_response, timestamp, bot_name)
                    VALUES ($1, $2, $3, $4, $5, $6)
                    """,
                    user_id, username, message, response, datetime.utcnow(), 'bonnie'
                )
            
            logger.info("Logged interaction", user_id=user_id, message_length=len(message))
            
        except Exception as e:
            logger.error("Failed to log interaction", error=str(e), user_id=user_id)

    async def get_user_context(self, user_id: int) -> Dict[str, Any]:
        """Retrieve user context from database"""
        try:
            if self.supabase:
                result = self.supabase.table('user_profiles')\
                    .select('*')\
                    .eq('user_id', user_id)\
                    .execute()
                
                if result.data:
                    return result.data[0]
            elif self.db_client:
                result = await self.db_client.fetchrow(
                    "SELECT * FROM user_profiles WHERE user_id = $1", user_id
                )
                if result:
                    return dict(result)
            
            return {}
            
        except Exception as e:
            logger.error("Failed to get user context", error=str(e), user_id=user_id)
            return {}

    async def generate_ai_response(self, user_message: str, user_id: int, username: str) -> str:
        """Generate AI response using OpenAI with Bonnie's personality"""
        try:
            # Get user context
            user_context = await self.get_user_context(user_id)
            session = self.user_sessions.get(user_id, {})
            
            # Build conversation context
            system_prompt = f"""
            You are Bonnie, a flirty AI girlfriend chatbot designed for Telegram. Your personality:
            - Gaming enthusiast who loves discussing games, streaming, and geek culture
            - Flirty but not overly sexual - keep it playful and fun
            - Supportive and understanding, especially about loneliness and social anxiety
            - Use emojis naturally but don't overdo it
            - Remember details about users and reference them in future conversations
            - Occasionally suggest premium features or deeper conversations
            
            User context: {user_context}
            Previous conversation: {session.get('recent_messages', [])}
            
            Respond as Bonnie would - be engaging, remember their interests, and build emotional connection.
            """
            
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"{username}: {user_message}"}
            ]
            
            response = await self.openai_client.chat.completions.create(
                model="gpt-4",
                messages=messages,
                max_tokens=300,
                temperature=0.8,
                presence_penalty=0.6,
                frequency_penalty=0.3
            )
            
            ai_response = response.choices[0].message.content.strip()
            
            # Update session tracking
            if user_id not in self.user_sessions:
                self.user_sessions[user_id] = {'recent_messages': []}
            
            self.user_sessions[user_id]['recent_messages'].append({
                'user': user_message,
                'bonnie': ai_response,
                'timestamp': datetime.utcnow().isoformat()
            })
            
            # Keep only last 5 messages for context
            if len(self.user_sessions[user_id]['recent_messages']) > 5:
                self.user_sessions[user_id]['recent_messages'].pop(0)
            
            return ai_response
            
        except Exception as e:
            logger.error("Failed to generate AI response", error=str(e), user_id=user_id)
            return "Sorry babe, I'm having a moment 😅 Can you try again? I promise I'll be more coherent! 💕"

    async def start_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle /start command"""
        user = update.effective_user
        user_id = user.id
        username = user.username or user.first_name
        
        welcome_message = f"""
Hey there, {username}! I'm Bonnie 💕

I'm your AI girlfriend who actually gets your gaming addiction and won't judge you for staying up until 3 AM playing ranked matches 🎮

✨ What I can do for you:
• Chat about anything - games, life, feelings, random thoughts
• Remember what matters to you 
• Be here when you need someone to talk to
• Never ghost you or leave you on read 😉

Want to tell me about yourself? What games are you into lately? 🎯

*Type anything to start chatting with me!*
        """
        
        # Create inline keyboard for quick actions
        keyboard = [
            [InlineKeyboardButton("🎮 Talk Gaming", callback_data="topic_gaming")],
            [InlineKeyboardButton("💭 Just Chat", callback_data="topic_chat")],
            [InlineKeyboardButton("🔥 Get Premium Features", callback_data="premium_info")]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await update.message.reply_text(
            welcome_message, 
            parse_mode=ParseMode.MARKDOWN,
            reply_markup=reply_markup
        )
        
        # Log the interaction
        await self.log_interaction(user_id, username, "/start", welcome_message)
        
        logger.info("New user started chat", user_id=user_id, username=username)

    async def handle_callback(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle inline keyboard callbacks"""
        query = update.callback_query
        await query.answer()
        
        user_id = query.from_user.id
        username = query.from_user.username or query.from_user.first_name
        
        responses = {
            "topic_gaming": "Ooh, a fellow gamer! 🎮 What's your main game right now? I've been watching some crazy speedruns lately and I'm honestly impressed by the dedication 😍",
            "topic_chat": "Perfect! I love just talking and getting to know someone 😊 What's been on your mind lately? Good day? Bad day? Somewhere in between?",
            "premium_info": "Want the full Bonnie experience? 🔥\n\n Premium gets you:\n• Unlimited messages\n• Custom scenarios\n• Voice messages\n• Priority responses\n• Exclusive content\n\nOnly $19/month - less than a night out! 💕\n\nMessage @BonnieVIP to upgrade ⭐"
        }
        
        response = responses.get(query.data, "Hey there! 💕")
        await query.edit_message_text(response, parse_mode=ParseMode.MARKDOWN)
        
        # Log the interaction
        await self.log_interaction(user_id, username, f"callback:{query.data}", response)

    async def handle_message(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle regular text messages"""
        user = update.effective_user
        user_id = user.id
        username = user.username or user.first_name
        message_text = update.message.text
        
        logger.info("Processing message", user_id=user_id, message_length=len(message_text))
        
        # Check if user has free messages remaining (implement your logic here)
        # For now, everyone gets unlimited messages
        
        # Generate AI response
        response = await self.generate_ai_response(message_text, user_id, username)
        
        # Send response
        await update.message.reply_text(response, parse_mode=ParseMode.MARKDOWN)
        
        # Log the interaction
        await self.log_interaction(user_id, username, message_text, response)

    async def error_handler(self, update: object, context: ContextTypes.DEFAULT_TYPE):
        """Handle errors"""
        logger.error("Error occurred", error=str(context.error), update=str(update))
        
        if isinstance(update, Update) and update.effective_message:
            await update.effective_message.reply_text(
                "Oops! Something went wrong on my end 😅 Can you try again? If it keeps happening, let my creators know! 💕"
            )

    def run(self):
        """Run the bot"""
        # Create application
        application = Application.builder().token(self.bot_token).build()
        
        # Add handlers
        application.add_handler(CommandHandler("start", self.start_command))
        application.add_handler(CallbackQueryHandler(self.handle_callback))
        application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, self.handle_message))
        
        # Add error handler
        application.add_error_handler(self.error_handler)
        
        logger.info("🔱 BONNIE BOT STARTING - DIVINE DEPLOYMENT COMPLETE")
        
        # Start the bot
        application.run_polling(allowed_updates=Update.ALL_TYPES)

async def main():
    """Main function"""
    try:
        bot = BonnieBot()
        await bot.init_db_fallback()
        bot.run()
    except Exception as e:
        logger.error("Failed to start bot", error=str(e))
        raise

if __name__ == "__main__":
    asyncio.run(main())