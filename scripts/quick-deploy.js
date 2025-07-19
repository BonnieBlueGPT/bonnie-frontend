#!/usr/bin/env node

// 🚀 BONNIE AI GIRLFRIEND SYSTEM - Quick Deploy Script
// Helps verify setup and provides deployment assistance

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const checkFile = (filePath, description) => {
  const fullPath = path.join(rootDir, filePath);
  if (fs.existsSync(fullPath)) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description} - Missing: ${filePath}`, 'red');
    return false;
  }
};

const main = async () => {
  log('\n🚀 BONNIE AI GIRLFRIEND SYSTEM - DEPLOYMENT CHECKER\n', 'bright');
  
  let allGood = true;
  
  // Check required files
  log('📁 Checking Required Files:', 'cyan');
  const requiredFiles = [
    ['package.json', 'Package configuration'],
    ['backend/server.js', 'Main server file'],
    ['.env.example', 'Environment template'],
    ['render.yaml', 'Render configuration'],
    ['complete-supabase-setup.sql', 'Database schema'],
    ['README.md', 'Documentation'],
    ['RENDER_DEPLOYMENT_GUIDE.md', 'Deployment guide'],
    ['DEPLOYMENT_CHECKLIST.md', 'Deployment checklist'],
    ['.gitignore', 'Git ignore rules'],
    ['tests/api.test.js', 'Test suite'],
    ['tests/setup.js', 'Test configuration']
  ];
  
  requiredFiles.forEach(([file, desc]) => {
    if (!checkFile(file, desc)) {
      allGood = false;
    }
  });
  
  // Check package.json content
  log('\n📦 Checking Package Configuration:', 'cyan');
  try {
    const packagePath = path.join(rootDir, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    const requiredDeps = [
      '@supabase/supabase-js',
      'express',
      'cors',
      'helmet',
      'compression',
      'express-rate-limit',
      'winston',
      'axios',
      'dotenv',
      'node-cache',
      'uuid'
    ];
    
    requiredDeps.forEach(dep => {
      if (packageJson.dependencies && packageJson.dependencies[dep]) {
        log(`✅ Dependency: ${dep}`, 'green');
      } else {
        log(`❌ Missing dependency: ${dep}`, 'red');
        allGood = false;
      }
    });
    
    if (packageJson.scripts && packageJson.scripts.start) {
      log(`✅ Start script configured`, 'green');
    } else {
      log(`❌ Missing start script in package.json`, 'red');
      allGood = false;
    }
    
  } catch (error) {
    log(`❌ Error reading package.json: ${error.message}`, 'red');
    allGood = false;
  }
  
  // Check server file
  log('\n🖥️  Checking Server Configuration:', 'cyan');
  try {
    const serverPath = path.join(rootDir, 'backend/server.js');
    const serverContent = fs.readFileSync(serverPath, 'utf8');
    
    const requiredElements = [
      ['import express', 'Express import'],
      ['import cors', 'CORS import'],
      ['import helmet', 'Helmet import'],
      ['createClient', 'Supabase client'],
      ['OpenRouterClient', 'OpenRouter client'],
      ['processAdvancedBonnie', 'Main processing function'],
      ['/health', 'Health endpoint'],
      ['/bonnie-chat', 'Chat endpoint'],
      ['/bonnie-entry', 'Entry endpoint']
    ];
    
    requiredElements.forEach(([element, desc]) => {
      if (serverContent.includes(element)) {
        log(`✅ ${desc}`, 'green');
      } else {
        log(`❌ Missing: ${desc}`, 'red');
        allGood = false;
      }
    });
    
  } catch (error) {
    log(`❌ Error reading server.js: ${error.message}`, 'red');
    allGood = false;
  }
  
  // Environment variables check
  log('\n🔧 Environment Variables Guide:', 'cyan');
  log('Make sure to set these in Render dashboard:', 'yellow');
  const envVars = [
    'NODE_ENV=production',
    'SUPABASE_URL=https://your-project.supabase.co',
    'SUPABASE_KEY=your-supabase-anon-key',
    'OPENROUTER_API_KEY=sk-or-v1-your-key',
    'JWT_SECRET=your-32-character-secret'
  ];
  
  envVars.forEach(envVar => {
    log(`  • ${envVar}`, 'blue');
  });
  
  // Final assessment
  log('\n📊 Deployment Readiness Assessment:', 'cyan');
  if (allGood) {
    log('🎉 ALL CHECKS PASSED! Your system is ready for deployment!', 'green');
    log('\n📋 Next Steps:', 'bright');
    log('1. Follow RENDER_DEPLOYMENT_GUIDE.md', 'blue');
    log('2. Set up Supabase database with complete-supabase-setup.sql', 'blue');
    log('3. Configure environment variables in Render', 'blue');
    log('4. Deploy and test your system', 'blue');
    log('5. Use DEPLOYMENT_CHECKLIST.md to verify everything works', 'blue');
  } else {
    log('⚠️  Some issues found. Please fix them before deploying.', 'yellow');
    log('Check the errors above and ensure all files are present.', 'yellow');
  }
  
  log('\n🔗 Helpful Links:', 'cyan');
  log('• Render: https://render.com', 'blue');
  log('• Supabase: https://supabase.com', 'blue');
  log('• OpenRouter: https://openrouter.ai', 'blue');
  log('• Deployment Guide: ./RENDER_DEPLOYMENT_GUIDE.md', 'blue');
  log('• Checklist: ./DEPLOYMENT_CHECKLIST.md', 'blue');
  
  log('\n💰 Estimated Monthly Costs:', 'cyan');
  log('• Render Starter: $7/month', 'blue');
  log('• Supabase: Free tier available', 'blue');
  log('• OpenRouter: ~$5-15/month usage', 'blue');
  log('• Total: ~$12-25/month', 'green');
  
  log('\n🚀 Ready to launch your AI girlfriend business!', 'bright');
};

main().catch(console.error);