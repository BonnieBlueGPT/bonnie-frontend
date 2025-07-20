#!/bin/bash
# 🔱 DIVINE DEPLOYMENT SCRIPT FOR BONNIE TELEGRAM BOT

echo "🔱 DIVINE DEPLOYMENT INITIATED..."

# Clear any cached dependencies
echo "🧹 Clearing pip cache..."
pip cache purge

# Upgrade pip to latest version
echo "⬆️ Upgrading pip..."
python -m pip install --upgrade pip

# Install dependencies with strict version resolution
echo "📦 Installing dependencies with strict resolution..."
pip install --no-cache-dir -r requirements.txt

# Verify critical dependencies are installed correctly
echo "🔍 Verifying installations..."
python -c "
import sys
try:
    import telegram
    import openai
    import supabase
    import httpx
    print('✅ All critical dependencies installed successfully!')
    print(f'📱 python-telegram-bot: {telegram.__version__}')
    print(f'🤖 openai: {openai.__version__}')
    print(f'🗄️ supabase: {supabase.__version__}')
    print(f'🌐 httpx: {httpx.__version__}')
except ImportError as e:
    print(f'❌ Import error: {e}')
    sys.exit(1)
"

echo "🚀 Starting Bonnie Telegram Bot..."
python bonnie_bot.py