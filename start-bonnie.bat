@echo off
echo 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
echo          BONNIE AI - MONEY MAKING MACHINE STARTING
echo 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

echo 💰 Starting Payment Server...
start "Payment Server" cmd /k "node payment-server.js"

echo 🚀 Waiting 3 seconds...
timeout /t 3 /nobreak >nul

echo 🎯 Starting Frontend...
start "Frontend" cmd /k "npm run dev"

echo ✅ Bonnie AI is starting up!
echo 💻 Frontend will be at: http://localhost:5173
echo 💳 Payment server at: http://localhost:3001
echo 📊 Revenue dashboard: http://localhost:3001/revenue

echo 🔥 READY TO MAKE MONEY! 🔥
pause