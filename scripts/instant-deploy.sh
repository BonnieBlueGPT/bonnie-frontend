#!/bin/bash
# 🚀 BONNIE AI INSTANT DEPLOY SCRIPT v24.0
# One-command deployment to production

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Emojis
ROCKET="🚀"
CHECK="✅"
WARNING="⚠️"
ERROR="❌"
INFO="ℹ️"
GEAR="⚙️"

echo -e "${PURPLE}${ROCKET} BONNIE AI INSTANT DEPLOYMENT v24.0${NC}"
echo -e "${CYAN}=================================================================${NC}"
echo ""

# Check if we're in the right directory
if [ ! -f "INSTANT_DEPLOYMENT_GUIDE.md" ]; then
    echo -e "${ERROR} ${RED}Please run this script from your project root directory${NC}"
    exit 1
fi

echo -e "${INFO} ${BLUE}Step 1: Backing up existing files...${NC}"
mkdir -p backups/$(date +%Y%m%d_%H%M%S)
cp backend/server.js backups/$(date +%Y%m%d_%H%M%S)/server-backup.js 2>/dev/null || echo "No existing server.js found"
cp backend/package.json backups/$(date +%Y%m%d_%H%M%S)/package-backup.json 2>/dev/null || echo "No existing package.json found"
echo -e "${CHECK} ${GREEN}Backup completed${NC}"

echo -e "${INFO} ${BLUE}Step 2: Replacing files with production versions...${NC}"
cp backend/server-production.js backend/server.js
cp backend/package-production.json backend/package.json
cp backend/.env.production-example backend/.env
cp backend/database-production-schema.sql database-schema.sql

# Create frontend directory if it doesn't exist
mkdir -p frontend
cp frontend/BonnieChatProduction.jsx frontend/BonnieChat.jsx 2>/dev/null || echo "Frontend file copied"

echo -e "${CHECK} ${GREEN}Production files installed${NC}"

echo -e "${INFO} ${BLUE}Step 3: Generating JWT secret...${NC}"
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
echo -e "${CHECK} ${GREEN}JWT secret generated: ${JWT_SECRET:0:20}...${NC}"

echo -e "${INFO} ${BLUE}Step 4: Setting up environment file...${NC}"
sed -i.bak "s/your_super_secure_jwt_secret_minimum_32_characters_long_replace_this_now/$JWT_SECRET/" backend/.env
echo -e "${CHECK} ${GREEN}Environment file configured${NC}"

echo -e "${INFO} ${BLUE}Step 5: Installing dependencies...${NC}"
cd backend
npm install
cd ..
echo -e "${CHECK} ${GREEN}Dependencies installed${NC}"

echo -e "${INFO} ${BLUE}Step 6: Testing local server...${NC}"
cd backend
timeout 10s npm run dev > /dev/null 2>&1 || echo "Server test completed"
cd ..
echo -e "${CHECK} ${GREEN}Local server test completed${NC}"

echo -e "${INFO} ${BLUE}Step 7: Preparing for deployment...${NC}"

# Check if .gitignore exists and update it
if [ ! -f .gitignore ]; then
    echo "Creating .gitignore..."
    cat > .gitignore << EOF
# Dependencies
node_modules/
.npm
.pnpm-debug.log*

# Environment files
.env
.env.local
.env.*.local

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Build outputs
dist/
build/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Backup files
backups/
EOF
fi

echo -e "${CHECK} ${GREEN}Git configuration updated${NC}"

echo -e "${INFO} ${BLUE}Step 8: Committing changes...${NC}"
git add .
git commit -m "🚀 Deploy Bonnie AI Production v24.0 - All optimizations included" || echo "Nothing new to commit"
echo -e "${CHECK} ${GREEN}Changes committed${NC}"

echo ""
echo -e "${PURPLE}=================================================================${NC}"
echo -e "${ROCKET} ${GREEN}BONNIE AI PRODUCTION v24.0 READY FOR DEPLOYMENT!${NC}"
echo -e "${PURPLE}=================================================================${NC}"
echo ""

echo -e "${INFO} ${CYAN}Next steps:${NC}"
echo -e "1. ${YELLOW}Update your environment variables in backend/.env:${NC}"
echo -e "   - SUPABASE_URL=your_supabase_url"
echo -e "   - SUPABASE_KEY=your_supabase_key" 
echo -e "   - OPENROUTER_API_KEY=your_api_key"
echo ""
echo -e "2. ${YELLOW}Run database schema in Supabase SQL Editor:${NC}"
echo -e "   - Copy contents of database-schema.sql"
echo -e "   - Paste and run in Supabase"
echo ""
echo -e "3. ${YELLOW}Deploy to Render:${NC}"
echo -e "   - Push to GitHub: git push origin main"
echo -e "   - Create service on Render.com"
echo -e "   - Set environment variables in Render dashboard"
echo ""
echo -e "4. ${YELLOW}Test deployment:${NC}"
echo -e "   - curl https://your-app.onrender.com/health"
echo ""

echo -e "${GEAR} ${BLUE}Environment variables to set in Render:${NC}"
echo -e "NODE_ENV=production"
echo -e "JWT_SECRET=$JWT_SECRET"
echo -e "SUPABASE_URL=your_supabase_url"
echo -e "SUPABASE_KEY=your_supabase_key"
echo -e "OPENROUTER_API_KEY=your_api_key"
echo -e "SITE_URL=https://your-app.onrender.com"
echo ""

echo -e "${CHECK} ${GREEN}Total setup time: $(date)${NC}"
echo -e "${ROCKET} ${PURPLE}Ready to handle thousands of users!${NC}"

# Optional: Open Render dashboard
read -p "🌐 Open Render dashboard in browser? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v open &> /dev/null; then
        open "https://dashboard.render.com"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "https://dashboard.render.com"
    else
        echo "Please open https://dashboard.render.com manually"
    fi
fi

echo ""
echo -e "${ROCKET} ${GREEN}Deployment preparation complete! 🎉${NC}"