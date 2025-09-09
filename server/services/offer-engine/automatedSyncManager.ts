/**
 * Automated Sync Manager - Billion Dollar Empire Grade
 * Manages automated synchronization across all affiliate networks
 * with intelligent scheduling, error recovery, and performance optimization
 */

import cron from 'node-cron';
import { db } from '../../db';
import { offerSources, offerSyncHistory } from '@shared/schema';
import { eq, and } from 'drizzle-orm';
import { AdapterRegistry } from './affiliateAdapters/adapterRegistry';
import { OfferSyncEngine } from './offerSyncEngine';

export interface SyncSchedule {
  sourceSlug: string;
  frequency: string;
  lastSync: Date | null;
  nextSync: Date;
  isActive: boolean;
  errorCount: number;
  maxRetries: number;
}

export class AutomatedSyncManager {
  private static instance: AutomatedSyncManager;
  private adapterRegistry: AdapterRegistry;
  private syncEngine: OfferSyncEngine;
  private scheduledJobs: Map<string, cron.ScheduledTask> = new Map();
  private syncSchedules: Map<string, SyncSchedule> = new Map();
  private isInitialized = false;

  private constructor() {
    this.adapterRegistry = AdapterRegistry.getInstance();
    this.syncEngine = OfferSyncEngine.getInstance();
  }

  static getInstance(): AutomatedSyncManager {
    if (!AutomatedSyncManager.instance) {
      AutomatedSyncManager.instance = new AutomatedSyncManager();
    }
    return AutomatedSyncManager.instance;
  }

  /**
   * Initialize the automated sync manager
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('[AutoSync] Manager already initialized');
      return;
    }

    try {
      console.log('[AutoSync] 🚀 Initializing Automated Sync Manager...');

      // Load active sources from database
      await this.loadActiveSources();

      // Schedule all active sources
      await this.scheduleAllSources();

      // Start health monitoring
      this.startHealthMonitoring();

      this.isInitialized = true;
      console.log('[AutoSync] ✅ Automated Sync Manager initialized successfully');
    } catch (error: any) {
      console.error('[AutoSync] Failed to initialize manager:', error.message);
      throw error;
    }
  }

  /**
   * Load active sources from database
   */
  private async loadActiveSources(): Promise<void> {
    try {
      const activeSources = await db.select()
        .from(offerSources)
        .where(eq(offerSources.isActive, true));

      console.log(`[AutoSync] Found ${activeSources.length} active sources`);

      for (const source of activeSources) {
        const schedule: SyncSchedule = {
          sourceSlug: source.slug,
          frequency: source.syncFrequency || 'daily',
          lastSync: source.lastSync,
          nextSync: this.calculateNextSync(source.syncFrequency || 'daily', source.lastSync),
          isActive: true,
          errorCount: source.errorCount || 0,
          maxRetries: 3
        };

        this.syncSchedules.set(source.slug, schedule);
        console.log(`[AutoSync] Loaded schedule for ${source.slug}: ${schedule.frequency}`);
      }
    } catch (error: any) {
      console.error('[AutoSync] Failed to load active sources:', error.message);
      throw error;
    }
  }

  /**
   * Schedule all loaded sources
   */
  private async scheduleAllSources(): Promise<void> {
    for (const [sourceSlug, schedule] of this.syncSchedules.entries()) {
      await this.scheduleSource(sourceSlug, schedule);
    }
  }

  /**
   * Schedule a specific source
   */
  private async scheduleSource(sourceSlug: string, schedule: SyncSchedule): Promise<void> {
    try {
      // Remove existing job if any
      if (this.scheduledJobs.has(sourceSlug)) {
        this.scheduledJobs.get(sourceSlug)!.destroy();
        this.scheduledJobs.delete(sourceSlug);
      }

      // Create cron pattern based on frequency
      const cronPattern = this.getCronPattern(schedule.frequency);
      
      if (!cronPattern) {
        console.warn(`[AutoSync] Invalid frequency for ${sourceSlug}: ${schedule.frequency}`);
        return;
      }

      // Create scheduled task
      const task = cron.schedule(cronPattern, async () => {
        await this.executeSyncJob(sourceSlug);
      }, {
        scheduled: true,
        timezone: "UTC"
      });

      this.scheduledJobs.set(sourceSlug, task);
      console.log(`[AutoSync] ✅ Scheduled ${sourceSlug} with pattern: ${cronPattern}`);
    } catch (error: any) {
      console.error(`[AutoSync] Failed to schedule ${sourceSlug}:`, error.message);
    }
  }

  /**
   * Execute sync job for a source
   */
  private async executeSyncJob(sourceSlug: string): Promise<void> {
    const startTime = Date.now();
    console.log(`[AutoSync] 🔄 Starting sync job for ${sourceSlug}`);

    try {
      // Get source from database
      const [source] = await db.select()
        .from(offerSources)
        .where(eq(offerSources.slug, sourceSlug));

      if (!source) {
        console.error(`[AutoSync] Source not found: ${sourceSlug}`);
        return;
      }

      if (!source.isActive) {
        console.log(`[AutoSync] Source ${sourceSlug} is not active, skipping sync`);
        return;
      }

      // Execute sync through sync engine
      const result = await this.syncEngine.syncSource(source);

      if (result.success) {
        // Update last sync time
        await db.update(offerSources)
          .set({
            lastSync: new Date(),
            errorCount: 0,
            updatedAt: new Date()
          })
          .where(eq(offerSources.id, source.id));

        // Update schedule
        const schedule = this.syncSchedules.get(sourceSlug);
        if (schedule) {
          schedule.lastSync = new Date();
          schedule.nextSync = this.calculateNextSync(schedule.frequency, new Date());
          schedule.errorCount = 0;
        }

        const duration = Date.now() - startTime;
        console.log(`[AutoSync] ✅ Sync completed for ${sourceSlug} in ${duration}ms`);
        console.log(`[AutoSync] Stats: ${result.stats?.offersProcessed || 0} offers, ${result.stats?.newOffers || 0} new`);
      } else {
        throw new Error(result.error || 'Unknown sync error');
      }
    } catch (error: any) {
      console.error(`[AutoSync] ❌ Sync failed for ${sourceSlug}:`, error.message);
      await this.handleSyncError(sourceSlug, error);
    }
  }

  /**
   * Handle sync errors with retry logic
   */
  private async handleSyncError(sourceSlug: string, error: Error): Promise<void> {
    try {
      const schedule = this.syncSchedules.get(sourceSlug);
      if (!schedule) return;

      schedule.errorCount++;

      // Update database error count
      await db.update(offerSources)
        .set({
          errorCount: schedule.errorCount,
          updatedAt: new Date()
        })
        .where(eq(offerSources.slug, sourceSlug));

      // Deactivate source if max retries exceeded
      if (schedule.errorCount >= schedule.maxRetries) {
        console.warn(`[AutoSync] ⚠️ Max retries exceeded for ${sourceSlug}, deactivating source`);
        
        await db.update(offerSources)
          .set({
            isActive: false,
            updatedAt: new Date()
          })
          .where(eq(offerSources.slug, sourceSlug));

        schedule.isActive = false;
        
        // Remove scheduled job
        if (this.scheduledJobs.has(sourceSlug)) {
          this.scheduledJobs.get(sourceSlug)!.destroy();
          this.scheduledJobs.delete(sourceSlug);
        }

        // Notify admin (this could be extended to send actual notifications)
        console.error(`[AutoSync] 🚨 ADMIN ALERT: Source ${sourceSlug} has been deactivated due to repeated failures`);
      } else {
        // Schedule retry with exponential backoff
        const retryDelay = Math.pow(2, schedule.errorCount) * 60000; // Start with 2 minutes
        console.log(`[AutoSync] 🔄 Retrying ${sourceSlug} in ${retryDelay / 1000} seconds (attempt ${schedule.errorCount}/${schedule.maxRetries})`);
        
        setTimeout(() => {
          this.executeSyncJob(sourceSlug);
        }, retryDelay);
      }
    } catch (dbError: any) {
      console.error(`[AutoSync] Failed to handle sync error for ${sourceSlug}:`, dbError.message);
    }
  }

  /**
   * Calculate next sync time based on frequency
   */
  private calculateNextSync(frequency: string, lastSync: Date | null): Date {
    const now = new Date();
    const base = lastSync || now;

    switch (frequency) {
      case 'hourly':
        return new Date(base.getTime() + 60 * 60 * 1000); // 1 hour
      case 'twice_daily':
        return new Date(base.getTime() + 12 * 60 * 60 * 1000); // 12 hours
      case 'daily':
        return new Date(base.getTime() + 24 * 60 * 60 * 1000); // 24 hours
      case 'weekly':
        return new Date(base.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
      default:
        return new Date(base.getTime() + 24 * 60 * 60 * 1000); // Default to daily
    }
  }

  /**
   * Get cron pattern for frequency
   */
  private getCronPattern(frequency: string): string | null {
    switch (frequency) {
      case 'hourly':
        return '0 * * * *'; // Every hour
      case 'twice_daily':
        return '0 0,12 * * *'; // 12:00 AM and 12:00 PM
      case 'daily':
        return '0 2 * * *'; // 2:00 AM daily
      case 'weekly':
        return '0 2 * * 0'; // 2:00 AM every Sunday
      default:
        return null;
    }
  }

  /**
   * Start health monitoring
   */
  private startHealthMonitoring(): void {
    // Monitor every 30 minutes
    cron.schedule('*/30 * * * *', async () => {
      await this.performHealthCheck();
    });

    console.log('[AutoSync] 🏥 Health monitoring started');
  }

  /**
   * Perform health check on all sources
   */
  private async performHealthCheck(): Promise<void> {
    console.log('[AutoSync] 🔍 Performing health check...');

    try {
      const activeSources = await db.select()
        .from(offerSources)
        .where(eq(offerSources.isActive, true));

      for (const source of activeSources) {
        const adapter = await this.adapterRegistry.getAdapter(source);
        if (adapter) {
          const health = await adapter.getHealth();
          
          if (health.status === 'unhealthy') {
            console.warn(`[AutoSync] ⚠️ Source ${source.slug} is unhealthy: ${health.details.error}`);
            
            // Increase error count for unhealthy sources
            const schedule = this.syncSchedules.get(source.slug);
            if (schedule) {
              schedule.errorCount++;
              await db.update(offerSources)
                .set({
                  errorCount: schedule.errorCount,
                  updatedAt: new Date()
                })
                .where(eq(offerSources.id, source.id));
            }
          } else if (health.status === 'healthy') {
            // Reset error count for healthy sources
            const schedule = this.syncSchedules.get(source.slug);
            if (schedule && schedule.errorCount > 0) {
              schedule.errorCount = 0;
              await db.update(offerSources)
                .set({
                  errorCount: 0,
                  updatedAt: new Date()
                })
                .where(eq(offerSources.id, source.id));
            }
          }
        }
      }
    } catch (error: any) {
      console.error('[AutoSync] Health check failed:', error.message);
    }
  }

  /**
   * Add new source to sync schedule
   */
  async addSource(sourceSlug: string): Promise<void> {
    try {
      const [source] = await db.select()
        .from(offerSources)
        .where(and(
          eq(offerSources.slug, sourceSlug),
          eq(offerSources.isActive, true)
        ));

      if (!source) {
        console.error(`[AutoSync] Source not found or not active: ${sourceSlug}`);
        return;
      }

      const schedule: SyncSchedule = {
        sourceSlug: source.slug,
        frequency: source.syncFrequency || 'daily',
        lastSync: source.lastSync,
        nextSync: this.calculateNextSync(source.syncFrequency || 'daily', source.lastSync),
        isActive: true,
        errorCount: source.errorCount || 0,
        maxRetries: 3
      };

      this.syncSchedules.set(source.slug, schedule);
      await this.scheduleSource(source.slug, schedule);

      console.log(`[AutoSync] ✅ Added source to sync schedule: ${sourceSlug}`);
    } catch (error: any) {
      console.error(`[AutoSync] Failed to add source ${sourceSlug}:`, error.message);
    }
  }

  /**
   * Remove source from sync schedule
   */
  async removeSource(sourceSlug: string): Promise<void> {
    try {
      // Remove scheduled job
      if (this.scheduledJobs.has(sourceSlug)) {
        this.scheduledJobs.get(sourceSlug)!.destroy();
        this.scheduledJobs.delete(sourceSlug);
      }

      // Remove from schedules
      this.syncSchedules.delete(sourceSlug);

      console.log(`[AutoSync] ✅ Removed source from sync schedule: ${sourceSlug}`);
    } catch (error: any) {
      console.error(`[AutoSync] Failed to remove source ${sourceSlug}:`, error.message);
    }
  }

  /**
   * Force sync for a specific source
   */
  async forceSyncSource(sourceSlug: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`[AutoSync] 🚀 Force syncing ${sourceSlug}...`);
      await this.executeSyncJob(sourceSlug);
      return { success: true };
    } catch (error: any) {
      console.error(`[AutoSync] Force sync failed for ${sourceSlug}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get sync schedules for admin dashboard
   */
  getSyncSchedules(): SyncSchedule[] {
    return Array.from(this.syncSchedules.values());
  }

  /**
   * Get sync statistics
   */
  async getSyncStatistics(): Promise<any> {
    try {
      const totalSources = this.syncSchedules.size;
      const activeSources = Array.from(this.syncSchedules.values()).filter(s => s.isActive).length;
      const errorSources = Array.from(this.syncSchedules.values()).filter(s => s.errorCount > 0).length;

      // Get recent sync history
      const recentSyncs = await db.select()
        .from(offerSyncHistory)
        .orderBy(offerSyncHistory.startedAt)
        .limit(100);

      const successfulSyncs = recentSyncs.filter(s => s.status === 'success').length;
      const failedSyncs = recentSyncs.filter(s => s.status === 'failed').length;

      return {
        totalSources,
        activeSources,
        errorSources,
        recentSyncs: recentSyncs.length,
        successfulSyncs,
        failedSyncs,
        successRate: recentSyncs.length > 0 ? (successfulSyncs / recentSyncs.length * 100).toFixed(2) : '0',
        schedules: this.getSyncSchedules()
      };
    } catch (error: any) {
      console.error('[AutoSync] Failed to get statistics:', error.message);
      return {
        totalSources: 0,
        activeSources: 0,
        errorSources: 0,
        recentSyncs: 0,
        successfulSyncs: 0,
        failedSyncs: 0,
        successRate: '0',
        schedules: []
      };
    }
  }

  /**
   * Shutdown the sync manager
   */
  async shutdown(): Promise<void> {
    console.log('[AutoSync] 🛑 Shutting down Automated Sync Manager...');

    // Destroy all scheduled jobs
    for (const [sourceSlug, task] of this.scheduledJobs.entries()) {
      task.destroy();
      console.log(`[AutoSync] Stopped job for ${sourceSlug}`);
    }

    this.scheduledJobs.clear();
    this.syncSchedules.clear();
    this.isInitialized = false;

    console.log('[AutoSync] ✅ Automated Sync Manager shutdown complete');
  }
}