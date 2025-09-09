#!/usr/bin/env tsx

/**
 * FORCE SCHEMA DEPLOYMENT - BILLION DOLLAR ENTERPRISE GRADE
 * Bypasses all interactive prompts and deploys complete schema
 */

import { execSync } from 'child_process';
import { db } from '../server/db';
import { sql } from 'drizzle-orm';

async function forceDeploySchema() {
  console.log('🚀 FORCE DEPLOYING COMPLETE BILLION-DOLLAR SCHEMA');
  console.log('==================================================');
  
  try {
    console.log('📊 Current table count...');
    const beforeResult = await db.execute(sql`
      SELECT COUNT(*) as table_count 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `);
    const beforeCount = parseInt(beforeResult.rows[0]?.table_count || '0');
    console.log(`📋 Current tables: ${beforeCount}`);
    
    console.log('\n🔧 Force pushing all schema changes...');
    
    // Set environment variable to bypass interactive prompts
    process.env.DRIZZLE_NO_INTERACTIVE = '1';
    
    // Execute drizzle push with force flag
    const output = execSync('npx drizzle-kit push --force', {
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: 'pipe',
      timeout: 300000, // 5 minutes timeout
      env: {
        ...process.env,
        DRIZZLE_NO_INTERACTIVE: '1'
      }
    });
    
    console.log('✅ Schema deployment output:');
    console.log(output);
    
    console.log('\n📊 Verifying deployment...');
    const afterResult = await db.execute(sql`
      SELECT COUNT(*) as table_count 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `);
    const afterCount = parseInt(afterResult.rows[0]?.table_count || '0');
    
    console.log(`📋 Tables before: ${beforeCount}`);
    console.log(`📋 Tables after: ${afterCount}`);
    console.log(`➕ Tables added: ${afterCount - beforeCount}`);
    
    if (afterCount > 400) {
      console.log('\n🎉 BILLION-DOLLAR SCHEMA DEPLOYMENT SUCCESSFUL!');
      console.log(`✅ Enterprise architecture achieved with ${afterCount} tables`);
      return true;
    } else {
      console.log('\n⚠️ Schema deployment incomplete');
      console.log(`❌ Expected 400+ tables, got ${afterCount}`);
      return false;
    }
    
  } catch (error) {
    console.error('\n💥 Schema deployment failed:');
    console.error(error.message);
    
    if (error.stdout) {
      console.log('\nSTDOUT:', error.stdout);
    }
    if (error.stderr) {
      console.log('\nSTDERR:', error.stderr);
    }
    
    return false;
  }
}

// Execute
forceDeploySchema()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Deployment script failed:', error);
    process.exit(1);
  });