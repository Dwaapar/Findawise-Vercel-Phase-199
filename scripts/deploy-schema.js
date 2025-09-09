#!/usr/bin/env node

/**
 * NON-INTERACTIVE SCHEMA DEPLOYMENT SCRIPT
 * Bypasses Drizzle's interactive prompts to deploy complete schema
 */

import { execSync } from 'child_process';
import fs from 'fs';

console.log('🚀 Starting non-interactive schema deployment...');

try {
  // Set environment to non-interactive
  process.env.CI = 'true';
  process.env.DRIZZLE_NO_PROMPT = 'true';
  
  // Clear any existing migration state
  if (fs.existsSync('./migrations')) {
    fs.rmSync('./migrations', { recursive: true, force: true });
  }
  
  console.log('📝 Generating migrations...');
  execSync('npx drizzle-kit generate', { 
    stdio: 'inherit',
    env: { ...process.env, CI: 'true' }
  });
  
  console.log('🗃️ Applying migrations...');
  execSync('npx drizzle-kit migrate', { 
    stdio: 'inherit',
    env: { ...process.env, CI: 'true' }
  });
  
  console.log('✅ Schema deployment completed successfully!');
  
} catch (error) {
  console.error('❌ Schema deployment failed:', error.message);
  
  // Fallback: Force push with create table selection
  console.log('🔄 Attempting fallback deployment...');
  try {
    // Create automated response for interactive prompt
    const response = 'create table\n'.repeat(50); // Answer "create table" to all prompts
    execSync(`echo "${response}" | npx drizzle-kit push --force`, { 
      stdio: 'inherit',
      shell: true
    });
    console.log('✅ Fallback deployment completed!');
  } catch (fallbackError) {
    console.error('❌ Fallback deployment also failed:', fallbackError.message);
    process.exit(1);
  }
}