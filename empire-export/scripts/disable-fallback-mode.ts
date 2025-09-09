/**
 * DISABLE FALLBACK MODE SCRIPT
 * This script disables the empire fallback systems for local development
 */

import { logger } from '../server/utils/logger.js';

const DISABLE_FALLBACK_MODE = process.env.DISABLE_FALLBACK_MODE === 'true';

// Configuration for local development
const LOCAL_CONFIG = {
  // Disable fallback systems
  enableFallbackMode: false,
  enableEmergencyMode: false,
  enableAutoHealing: false,
  
  // Reduce monitoring intensity
  healthCheckInterval: 300, // 5 minutes instead of 30 seconds
  backupInterval: 30, // 30 minutes instead of 5 minutes
  
  // Simplify plugin system
  enablePluginMarketplace: false,
  enableMigrationProof: false,
  
  // Database optimization
  maxConnections: 10,
  connectionTimeout: 5000,
  
  // Memory optimization
  maxMemoryUsage: '256MB',
  enableMemoryOptimization: false,
};

async function disableFallbackMode() {
  try {
    logger.info('🔧 Disabling fallback mode for local development');
    
    // Write configuration to file
    const configPath = './config/local.json';
    const fs = await import('fs/promises');
    await fs.mkdir('./config', { recursive: true });
    await fs.writeFile(configPath, JSON.stringify(LOCAL_CONFIG, null, 2));
    
    logger.info('✅ Local configuration created', { path: configPath });
    
    // Update environment variables
    process.env.EMPIRE_MODE = 'local';
    process.env.FALLBACK_MODE = 'disabled';
    process.env.EMERGENCY_MODE = 'disabled';
    
    logger.info('🎉 Fallback mode disabled successfully');
    
  } catch (error) {
    logger.error('❌ Failed to disable fallback mode', { error });
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  disableFallbackMode()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Failed to disable fallback mode:', error);
      process.exit(1);
    });
}

export { disableFallbackMode, LOCAL_CONFIG };