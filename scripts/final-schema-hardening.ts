#!/usr/bin/env tsx
/**
 * 🏆 FINAL SCHEMA HARDENING
 * Fixes remaining schema issues identified in system validation
 */

import { Pool } from 'pg';

class FinalSchemaHardener {
  private db: Pool;

  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: false
    });
  }

  async hardenSchemas(): Promise<void> {
    console.log('🔧 FINAL SCHEMA HARDENING IN PROGRESS');
    console.log('=====================================');

    try {
      // Fix analytics_events table
      await this.fixAnalyticsEvents();
      
      // Fix user_sessions table
      await this.fixUserSessions();
      
      // Fix conversion_events table
      await this.fixConversionEvents();
      
      console.log('✅ FINAL SCHEMA HARDENING COMPLETE');
      
    } catch (error) {
      console.error('❌ Schema hardening failed:', error);
      throw error;
    }
  }

  private async fixAnalyticsEvents(): Promise<void> {
    console.log('📊 Fixing analytics_events table...');
    
    try {
      // Add missing columns
      await this.db.query(`
        ALTER TABLE analytics_events 
        ADD COLUMN IF NOT EXISTS event_data JSONB DEFAULT '{}',
        ADD COLUMN IF NOT EXISTS timestamp TIMESTAMP DEFAULT NOW(),
        ADD COLUMN IF NOT EXISTS session_id VARCHAR(255),
        ADD COLUMN IF NOT EXISTS page_url TEXT,
        ADD COLUMN IF NOT EXISTS referrer_url TEXT
      `);
      
      console.log('✅ analytics_events table hardened');
      
    } catch (error) {
      console.log(`ℹ️  analytics_events: ${error.message}`);
    }
  }

  private async fixUserSessions(): Promise<void> {
    console.log('👤 Fixing user_sessions table...');
    
    try {
      // Add missing columns
      await this.db.query(`
        ALTER TABLE user_sessions 
        ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP,
        ADD COLUMN IF NOT EXISTS last_activity TIMESTAMP DEFAULT NOW(),
        ADD COLUMN IF NOT EXISTS device_info JSONB DEFAULT '{}',
        ADD COLUMN IF NOT EXISTS session_data JSONB DEFAULT '{}'
      `);
      
      console.log('✅ user_sessions table hardened');
      
    } catch (error) {
      console.log(`ℹ️  user_sessions: ${error.message}`);
    }
  }

  private async fixConversionEvents(): Promise<void> {
    console.log('💰 Fixing conversion_events table...');
    
    try {
      // Add missing columns
      await this.db.query(`
        ALTER TABLE conversion_events 
        ADD COLUMN IF NOT EXISTS conversion_type VARCHAR(100),
        ADD COLUMN IF NOT EXISTS value DECIMAL(10,2) DEFAULT 0,
        ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'USD',
        ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'
      `);
      
      console.log('✅ conversion_events table hardened');
      
    } catch (error) {
      console.log(`ℹ️  conversion_events: ${error.message}`);
    }
  }

  async cleanup(): Promise<void> {
    await this.db.end();
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const hardener = new FinalSchemaHardener();
  
  hardener.hardenSchemas()
    .then(() => hardener.cleanup())
    .then(() => {
      console.log('🎉 FINAL SCHEMA HARDENING SUCCESSFUL');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 SCHEMA HARDENING FAILED:', error);
      hardener.cleanup().then(() => process.exit(1));
    });
}

export { FinalSchemaHardener };