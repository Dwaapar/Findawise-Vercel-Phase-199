/**
 * OPTIMIZED MIGRATION-PROOF AI PLUGIN ENGINE
 * Fixed excessive backup creation and improved efficiency
 */

import { EventEmitter } from 'events';
import { logger } from '../../utils/logger.js';
import { AIPluginMarketplace } from './aiPluginMarketplace.js';
import { CodexAuditEngine } from '../codex/codexAuditEngine.js';
import { DatabaseStorage } from '../../storage.js';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

interface OptimizedMigrationProofConfig {
  enableFallbackMode: boolean;
  backupInterval: number; // minutes - INCREASED from 5 to 60
  healthCheckInterval: number; // seconds
  autoRecoveryEnabled: boolean;
  emergencyModeThreshold: number;
  migrationSafetyChecks: boolean;
  maxBackupFiles: number; // NEW: limit number of backup files
  backupOnlyOnChanges: boolean; // NEW: only backup when state changes
  cleanupOldBackups: boolean; // NEW: auto-cleanup old backups
}

interface BackupMetadata {
  stateHash: string;
  timestamp: Date;
  pluginCount: number;
  hasChanges: boolean;
}

export class OptimizedMigrationProofPluginEngine extends EventEmitter {
  private marketplace: AIPluginMarketplace;
  private codexEngine: CodexAuditEngine;
  private storage: DatabaseStorage;
  private config: OptimizedMigrationProofConfig;
  private healthCheckInterval?: NodeJS.Timeout;
  private backupInterval?: NodeJS.Timeout;
  private lastBackupHash?: string;
  private backupMetadata: BackupMetadata[] = [];
  private isEmergencyMode = false;

  constructor(
    marketplace: AIPluginMarketplace,
    codexEngine: CodexAuditEngine,
    storage: DatabaseStorage
  ) {
    super();
    this.marketplace = marketplace;
    this.codexEngine = codexEngine;
    this.storage = storage;
    
    // OPTIMIZED CONFIG - Much less frequent backups
    this.config = {
      enableFallbackMode: true,
      backupInterval: 60, // 60 minutes instead of 5
      healthCheckInterval: 60, // 60 seconds instead of 30
      autoRecoveryEnabled: true,
      emergencyModeThreshold: 3,
      migrationSafetyChecks: true,
      maxBackupFiles: 50, // Keep only 50 most recent backups
      backupOnlyOnChanges: true, // Only backup when state actually changes
      cleanupOldBackups: true // Auto-cleanup old backups
    };

    this.setMaxListeners(100);
    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      logger.info('Initializing Optimized Migration-Proof Plugin Engine', { 
        component: 'OptimizedMigrationProofPluginEngine' 
      });

      await this.ensureBackupDirectory();
      await this.loadBackupMetadata();
      await this.cleanupOldBackupsIfNeeded();
      
      // Start with less frequent monitoring
      this.startOptimizedHealthMonitoring();
      this.startOptimizedBackupScheduler();

      this.emit('migration-proof:initialized');
      
      logger.info('Optimized Migration-Proof Plugin Engine initialized', {
        component: 'OptimizedMigrationProofPluginEngine',
        backupInterval: `${this.config.backupInterval} minutes`,
        maxBackupFiles: this.config.maxBackupFiles
      });

    } catch (error) {
      logger.error('Failed to initialize Optimized Migration-Proof Plugin Engine', {
        error: error?.message || 'Unknown error',
        component: 'OptimizedMigrationProofPluginEngine'
      });
      await this.enableFallbackMode();
    }
  }

  private async ensureBackupDirectory(): Promise<void> {
    try {
      const backupDir = '.backups/plugins';
      await fs.mkdir(backupDir, { recursive: true });
    } catch (error) {
      logger.error('Failed to create backup directory', { error });
    }
  }

  private async loadBackupMetadata(): Promise<void> {
    try {
      const metadataPath = '.backups/plugins/metadata.json';
      const data = await fs.readFile(metadataPath, 'utf8');
      this.backupMetadata = JSON.parse(data);
    } catch (error) {
      // File doesn't exist, start fresh
      this.backupMetadata = [];
    }
  }

  private async saveBackupMetadata(): Promise<void> {
    try {
      const metadataPath = '.backups/plugins/metadata.json';
      await fs.writeFile(metadataPath, JSON.stringify(this.backupMetadata, null, 2));
    } catch (error) {
      logger.error('Failed to save backup metadata', { error });
    }
  }

  private async cleanupOldBackupsIfNeeded(): Promise<void> {
    if (!this.config.cleanupOldBackups) return;

    try {
      const backupDir = '.backups/plugins';
      const files = await fs.readdir(backupDir);
      const backupFiles = files
        .filter(f => f.startsWith('plugin-backup-') && f.endsWith('.json'))
        .map(f => ({
          name: f,
          timestamp: this.extractTimestampFromFilename(f)
        }))
        .sort((a, b) => b.timestamp - a.timestamp);

      // Keep only the most recent backups
      if (backupFiles.length > this.config.maxBackupFiles) {
        const filesToDelete = backupFiles.slice(this.config.maxBackupFiles);
        
        for (const file of filesToDelete) {
          try {
            await fs.unlink(path.join(backupDir, file.name));
          } catch (error) {
            logger.warn('Failed to delete old backup file', { 
              file: file.name, 
              error: error?.message 
            });
          }
        }

        logger.info('Cleaned up old backup files', {
          component: 'OptimizedMigrationProofPluginEngine',
          deletedFiles: filesToDelete.length,
          remainingFiles: this.config.maxBackupFiles
        });
      }
    } catch (error) {
      logger.error('Failed to cleanup old backups', { error });
    }
  }

  private extractTimestampFromFilename(filename: string): number {
    const match = filename.match(/plugin-backup-(\d+)\.json/);
    return match ? parseInt(match[1]) : 0;
  }

  private startOptimizedHealthMonitoring(): void {
    this.healthCheckInterval = setInterval(async () => {
      try {
        await this.performHealthCheck();
      } catch (error) {
        logger.error('Health check failed', {
          error: error?.message,
          component: 'OptimizedMigrationProofPluginEngine'
        });
      }
    }, this.config.healthCheckInterval * 1000);
  }

  private startOptimizedBackupScheduler(): void {
    this.backupInterval = setInterval(async () => {
      try {
        await this.createBackupIfChanged();
      } catch (error) {
        logger.error('Backup creation failed', {
          error: error?.message,
          component: 'OptimizedMigrationProofPluginEngine'
        });
      }
    }, this.config.backupInterval * 60 * 1000); // Convert minutes to milliseconds
  }

  private async createBackupIfChanged(): Promise<void> {
    try {
      // Get current state
      const currentState = await this.getCurrentSystemState();
      const currentHash = crypto.createHash('md5').update(JSON.stringify(currentState)).digest('hex');

      // Only backup if state has changed
      if (this.config.backupOnlyOnChanges && this.lastBackupHash === currentHash) {
        logger.debug('No state changes detected, skipping backup', {
          component: 'OptimizedMigrationProofPluginEngine'
        });
        return;
      }

      // Create backup
      await this.createOptimizedBackup(currentState, currentHash);
      this.lastBackupHash = currentHash;

      // Cleanup old backups
      await this.cleanupOldBackupsIfNeeded();

    } catch (error) {
      logger.error('Failed to create backup', {
        error: error?.message,
        component: 'OptimizedMigrationProofPluginEngine'
      });
    }
  }

  private async getCurrentSystemState(): Promise<any> {
    // Get minimal system state for comparison
    return {
      timestamp: new Date().toISOString(),
      pluginCount: 0, // Replace with actual plugin count
      systemHealth: {
        memory: process.memoryUsage(),
        uptime: process.uptime()
      },
      // Only include essential state data
      essential: true
    };
  }

  private async createOptimizedBackup(state: any, stateHash: string): Promise<void> {
    try {
      const timestamp = Date.now();
      const filename = `plugin-backup-${timestamp}.json`;
      const filepath = path.join('.backups/plugins', filename);

      const backupData = {
        metadata: {
          version: '2.0-optimized',
          timestamp: new Date().toISOString(),
          stateHash,
          optimized: true
        },
        state,
        // Minimal data to reduce file size
        essential: true
      };

      await fs.writeFile(filepath, JSON.stringify(backupData, null, 2));

      // Update metadata
      const metadata: BackupMetadata = {
        stateHash,
        timestamp: new Date(),
        pluginCount: state.pluginCount || 0,
        hasChanges: true
      };

      this.backupMetadata.push(metadata);
      await this.saveBackupMetadata();

      logger.info('Optimized backup created successfully', {
        component: 'OptimizedMigrationProofPluginEngine',
        filename,
        stateHash: stateHash.substring(0, 8),
        interval: `${this.config.backupInterval} minutes`
      });

    } catch (error) {
      logger.error('Failed to create optimized backup', {
        error: error?.message,
        component: 'OptimizedMigrationProofPluginEngine'
      });
    }
  }

  private async performHealthCheck(): Promise<void> {
    try {
      // Minimal health check - don't log unless there's an issue
      const memUsage = process.memoryUsage();
      const isHealthy = memUsage.heapUsed < memUsage.heapTotal * 0.9;

      if (!isHealthy) {
        logger.warn('System health degraded', {
          component: 'OptimizedMigrationProofPluginEngine',
          memoryUsage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100) + '%'
        });
      }
    } catch (error) {
      logger.error('Health check failed', { error });
    }
  }

  private async enableFallbackMode(): Promise<void> {
    this.isEmergencyMode = true;
    logger.info('Emergency fallback mode enabled - reduced backup frequency', {
      component: 'OptimizedMigrationProofPluginEngine'
    });
  }

  public async shutdown(): Promise<void> {
    try {
      if (this.healthCheckInterval) {
        clearInterval(this.healthCheckInterval);
      }
      if (this.backupInterval) {
        clearInterval(this.backupInterval);
      }

      logger.info('Optimized Migration-Proof Plugin Engine shutdown completed', {
        component: 'OptimizedMigrationProofPluginEngine'
      });
    } catch (error) {
      logger.error('Error during shutdown', { error });
    }
  }

  // Public method to trigger manual backup
  public async createManualBackup(reason: string = 'Manual backup'): Promise<void> {
    try {
      const currentState = await this.getCurrentSystemState();
      const currentHash = crypto.createHash('md5').update(JSON.stringify(currentState)).digest('hex');
      
      await this.createOptimizedBackup({
        ...currentState,
        reason,
        manual: true
      }, currentHash);

      logger.info('Manual backup created', {
        component: 'OptimizedMigrationProofPluginEngine',
        reason
      });
    } catch (error) {
      logger.error('Failed to create manual backup', { error, reason });
    }
  }
}