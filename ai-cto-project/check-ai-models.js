#!/usr/bin/env node

/**
 * AI MODELS CHECKER FOR 12GB RTX GPU
 * 
 * Verifies and installs optimal AI models for TypeScript error fixing
 */

const { execSync } = require('child_process');
const fs = require('fs');

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m', 
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Optimized models for 12GB RTX GPU
const requiredModels = {
  'codellama:7b-code-q4_K_M': {
    purpose: 'Code Analysis & Import Fixing',
    vram: '3.8GB',
    strength: 'Import resolution, module analysis'
  },
  'deepseek-coder:6.7b-instruct-q4_K_M': {
    purpose: 'TypeScript Type Fixing', 
    vram: '3.5GB',
    strength: 'Type inference, interface generation'
  },
  'starcoder:3b-q4_K_M': {
    purpose: 'Code Validation & Syntax',
    vram: '2.2GB', 
    strength: 'Syntax validation, quick fixes'
  },
  'magicoder:7b-s-cl-q4_K_M': {
    purpose: 'Critical Review & Safety',
    vram: '3.7GB',
    strength: 'Code review, safety validation'
  }
};

async function checkOllamaInstallation() {
  console.log(`${colors.cyan}🔍 Checking Ollama installation...${colors.reset}`);
  
  try {
    const version = execSync('ollama --version', { encoding: 'utf-8' });
    console.log(`   ✅ Ollama version: ${version.trim()}`);
    return true;
  } catch (error) {
    console.log(`${colors.red}❌ Ollama not found. Please install Ollama first:${colors.reset}`);
    console.log(`   ${colors.yellow}curl -fsSL https://ollama.ai/install.sh | sh${colors.reset}`);
    return false;
  }
}

async function checkAvailableModels() {
  console.log(`${colors.cyan}📋 Checking available models...${colors.reset}`);
  
  try {
    const output = execSync('ollama list', { encoding: 'utf-8' });
    const installedModels = output.split('\n')
      .slice(1) // Skip header
      .map(line => line.split(/\s+/)[0])
      .filter(model => model && !model.includes('NAME'));
    
    return installedModels;
  } catch (error) {
    console.log(`${colors.yellow}⚠️  Could not list models${colors.reset}`);
    return [];
  }
}

async function installModel(modelName, info) {
  console.log(`${colors.yellow}📥 Installing ${modelName} (${info.vram})...${colors.reset}`);
  console.log(`   Purpose: ${info.purpose}`);
  console.log(`   Strength: ${info.strength}`);
  
  try {
    execSync(`ollama pull ${modelName}`, { 
      stdio: 'inherit',
      timeout: 600000 // 10 minute timeout
    });
    
    console.log(`   ${colors.green}✅ ${modelName} installed successfully${colors.reset}`);
    return true;
  } catch (error) {
    console.log(`   ${colors.red}❌ Failed to install ${modelName}${colors.reset}`);
    return false;
  }
}

async function testModel(modelName) {
  console.log(`${colors.cyan}🧪 Testing ${modelName}...${colors.reset}`);
  
  const testPrompt = 'Fix this TypeScript error: Cannot find module "react". Respond with: import React from "react";';
  
  try {
    const response = execSync(`ollama run ${modelName} "${testPrompt}"`, {
      encoding: 'utf-8',
      timeout: 30000
    });
    
    if (response.toLowerCase().includes('import')) {
      console.log(`   ${colors.green}✅ ${modelName} working correctly${colors.reset}`);
      return true;
    } else {
      console.log(`   ${colors.yellow}⚠️  ${modelName} responded but may need fine-tuning${colors.reset}`);
      return false;
    }
  } catch (error) {
    console.log(`   ${colors.red}❌ ${modelName} test failed${colors.reset}`);
    return false;
  }
}

async function checkGPUMemory() {
  console.log(`${colors.cyan}🎮 Checking GPU memory...${colors.reset}`);
  
  try {
    // Try nvidia-smi first
    const nvidiaSmi = execSync('nvidia-smi --query-gpu=memory.total,memory.used --format=csv,noheader,nounits', {
      encoding: 'utf-8'
    });
    
    const lines = nvidiaSmi.trim().split('\n');
    for (let i = 0; i < lines.length; i++) {
      const [total, used] = lines[i].split(', ').map(Number);
      const available = total - used;
      
      console.log(`   GPU ${i}: ${total}MB total, ${used}MB used, ${available}MB available`);
      
      if (total >= 12000) {
        console.log(`   ${colors.green}✅ GPU ${i} has sufficient memory (${Math.floor(total/1024)}GB)${colors.reset}`);
      } else {
        console.log(`   ${colors.yellow}⚠️  GPU ${i} may be limited (${Math.floor(total/1024)}GB)${colors.reset}`);
      }
    }
    
    return true;
  } catch (error) {
    console.log(`   ${colors.yellow}⚠️  Could not detect GPU memory (continuing anyway)${colors.reset}`);
    return false;
  }
}

async function calculateVRAMUsage() {
  console.log(`${colors.cyan}📊 VRAM Usage Analysis for 12GB RTX GPU:${colors.reset}`);
  
  let totalVRAM = 0;
  
  for (const [model, info] of Object.entries(requiredModels)) {
    const vramGB = parseFloat(info.vram);
    totalVRAM += vramGB;
    console.log(`   ${model}: ${info.vram}`);
  }
  
  console.log(`   ${colors.bold}Total VRAM needed: ${totalVRAM.toFixed(1)}GB${colors.reset}`);
  
  if (totalVRAM <= 10) {
    console.log(`   ${colors.green}✅ Safe for 12GB GPU (${(12 - totalVRAM).toFixed(1)}GB buffer)${colors.reset}`);
  } else if (totalVRAM <= 12) {
    console.log(`   ${colors.yellow}⚠️  Tight fit for 12GB GPU${colors.reset}`);
  } else {
    console.log(`   ${colors.red}❌ Exceeds 12GB GPU capacity${colors.reset}`);
  }
  
  console.log(`   ${colors.cyan}Note: Only 2 models will run simultaneously${colors.reset}`);
}

async function createModelConfig() {
  const config = {
    models: requiredModels,
    gpuConfig: {
      maxConcurrentModels: 2,
      vramLimit: 12288, // 12GB in MB
      fallbackMode: 'rule-based'
    },
    modelPriority: [
      'codellama:7b-code-q4_K_M',      // Primary for imports
      'deepseek-coder:6.7b-instruct-q4_K_M', // Primary for types
      'starcoder:3b-q4_K_M',           // Fallback for syntax
      'magicoder:7b-s-cl-q4_K_M'      // Review only
    ]
  };
  
  fs.writeFileSync('ai-models-config.json', JSON.stringify(config, null, 2));
  console.log(`${colors.green}✅ Model configuration saved to ai-models-config.json${colors.reset}`);
}

async function main() {
  console.log(`${colors.bold}${colors.cyan}AI CTO - MODEL CHECKER FOR 12GB RTX GPU${colors.reset}\n`);
  
  // Check Ollama installation
  const hasOllama = await checkOllamaInstallation();
  if (!hasOllama) {
    process.exit(1);
  }
  
  // Check GPU memory
  await checkGPUMemory();
  
  // Calculate VRAM usage
  await calculateVRAMUsage();
  
  // Check installed models
  const installedModels = await checkAvailableModels();
  console.log(`   Currently installed: ${installedModels.length} models`);
  
  // Install missing models
  let allModelsReady = true;
  
  for (const [modelName, info] of Object.entries(requiredModels)) {
    if (installedModels.includes(modelName)) {
      console.log(`   ${colors.green}✅ ${modelName} already installed${colors.reset}`);
      
      // Test the model
      await testModel(modelName);
    } else {
      console.log(`   ${colors.yellow}⚠️  ${modelName} missing${colors.reset}`);
      
      const success = await installModel(modelName, info);
      if (success) {
        await testModel(modelName);
      } else {
        allModelsReady = false;
      }
    }
  }
  
  // Create configuration
  await createModelConfig();
  
  // Final status
  if (allModelsReady) {
    console.log(`\n${colors.green}🎉 ALL MODELS READY FOR AI CTO ERROR FIXING!${colors.reset}`);
    console.log(`${colors.cyan}Your 12GB RTX GPU is optimally configured for:${colors.reset}`);
    console.log(`   • Autonomous TypeScript error resolution`);
    console.log(`   • Import fixing and module resolution`); 
    console.log(`   • Type inference and interface generation`);
    console.log(`   • Code validation and safety checks`);
    console.log(`\n${colors.yellow}Run 'node ai-cto.js' to start fixing your project!${colors.reset}`);
  } else {
    console.log(`\n${colors.yellow}⚠️  Some models failed to install. AI CTO will use rule-based fallbacks.${colors.reset}`);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { checkOllamaInstallation, requiredModels };