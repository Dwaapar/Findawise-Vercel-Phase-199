/**
 * Affiliate Network Health Monitor - Billion Dollar Empire Grade
 * Real-time monitoring and alerting for all affiliate network integrations
 */

import { EventEmitter } from 'events';
import { db } from '../../db';
import { offerSources, offerSyncHistory } from '@shared/schema';
import { eq, desc, gte } from 'drizzle-orm';
import { AdapterRegistry } from './affiliateAdapters/adapterRegistry';

export interface NetworkHealth {
  sourceSlug: string;
  sourceName: string;
  status: 'healthy' | 'degraded' | 'unhealthy' | 'offline';
  lastCheck: Date;
  responseTime: number;
  errorCount: number;
  successRate: number;
  lastSuccessfulSync: Date | null;
  totalSyncs: number;
  details: {
    apiReachable: boolean;
    credentialsValid: boolean;
    dataAvailable: boolean;
    rateLimit: boolean;
    error?: string;
  };
  alerts: Array<{
    level: 'info' | 'warning' | 'error' | 'critical';
    message: string;
    timestamp: Date;
  }>;
}

export interface SystemHealth {
  overallStatus: 'healthy' | 'degraded' | 'critical';
  totalNetworks: number;
  healthyNetworks: number;
  degradedNetworks: number;
  unhealthyNetworks: number;
  offlineNetworks: number;
  averageResponseTime: number;
  overallSuccessRate: number;
  lastUpdate: Date;
  networks: NetworkHealth[];
  systemAlerts: Array<{
    level: 'info' | 'warning' | 'error' | 'critical';
    message: string;
    timestamp: Date;
    sourceSlug?: string;
  }>;
}

export class AffiliateNetworkHealthMonitor extends EventEmitter {
  private static instance: AffiliateNetworkHealthMonitor;
  private adapterRegistry: AdapterRegistry;
  private networkHealthMap: Map<string, NetworkHealth> = new Map();
  private monitoringInterval: NodeJS.Timeout | null = null;
  private alertThresholds = {
    responseTime: {
      warning: 3000,  // 3 seconds
      critical: 10000 // 10 seconds
    },
    errorRate: {
      warning: 20,  // 20%
      critical: 50  // 50%
    },
    syncAge: {
      warning: 24 * 60 * 60 * 1000,   // 24 hours
      critical: 72 * 60 * 60 * 1000   // 72 hours
    }
  };

  private constructor() {
    super();
    this.adapterRegistry = AdapterRegistry.getInstance();
  }

  static getInstance(): AffiliateNetworkHealthMonitor {
    if (!AffiliateNetworkHealthMonitor.instance) {
      AffiliateNetworkHealthMonitor.instance = new AffiliateNetworkHealthMonitor();
    }
    return AffiliateNetworkHealthMonitor.instance;
  }

  /**
   * Start health monitoring
   */
  async startMonitoring(intervalMinutes: number = 5): Promise<void> {
    console.log('[HealthMonitor] 🏥 Starting Affiliate Network Health Monitoring...');

    // Perform initial health check
    await this.performHealthCheck();

    // Set up periodic monitoring
    this.monitoringInterval = setInterval(async () => {
      await this.performHealthCheck();
    }, intervalMinutes * 60 * 1000);

    console.log(`[HealthMonitor] ✅ Health monitoring started (interval: ${intervalMinutes} minutes)`);
  }

  /**
   * Stop health monitoring
   */
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log('[HealthMonitor] 🛑 Health monitoring stopped');
    }
  }

  /**
   * Perform comprehensive health check on all networks
   */
  async performHealthCheck(): Promise<SystemHealth> {
    console.log('[HealthMonitor] 🔍 Performing health check on all networks...');

    try {
      // Get all active sources
      const sources = await db.select()
        .from(offerSources)
        .where(eq(offerSources.isActive, true));

      const networkHealthResults: NetworkHealth[] = [];

      // Check each network
      for (const source of sources) {
        const networkHealth = await this.checkNetworkHealth(source);
        networkHealthResults.push(networkHealth);
        this.networkHealthMap.set(source.slug, networkHealth);

        // Emit events for status changes
        this.emitHealthEvents(networkHealth);
      }

      // Calculate system-wide health
      const systemHealth = this.calculateSystemHealth(networkHealthResults);

      // Emit system health event
      this.emit('systemHealthUpdate', systemHealth);

      console.log(`[HealthMonitor] Health check complete: ${systemHealth.overallStatus}`);
      return systemHealth;
    } catch (error: any) {
      console.error('[HealthMonitor] Health check failed:', error.message);
      throw error;
    }
  }

  /**
   * Check health of individual network
   */
  private async checkNetworkHealth(source: any): Promise<NetworkHealth> {
    const startTime = Date.now();
    
    const networkHealth: NetworkHealth = {
      sourceSlug: source.slug,
      sourceName: source.name,
      status: 'offline',
      lastCheck: new Date(),
      responseTime: 0,
      errorCount: source.errorCount || 0,
      successRate: 0,
      lastSuccessfulSync: source.lastSync,
      totalSyncs: 0,
      details: {
        apiReachable: false,
        credentialsValid: false,
        dataAvailable: false,
        rateLimit: false
      },
      alerts: []
    };

    try {
      // Get adapter instance
      const adapter = await this.adapterRegistry.getAdapter(source);
      
      if (!adapter) {
        networkHealth.status = 'offline';
        networkHealth.details.error = 'Adapter not available';
        networkHealth.alerts.push({
          level: 'critical',
          message: 'Network adapter is not available',
          timestamp: new Date()
        });
        return networkHealth;
      }

      // Perform adapter health check
      const adapterHealth = await adapter.getHealth();
      networkHealth.responseTime = Date.now() - startTime;
      networkHealth.status = adapterHealth.status;
      networkHealth.details = { ...networkHealth.details, ...adapterHealth.details };

      // Get sync statistics
      const syncStats = await this.getSyncStatistics(source.id);
      networkHealth.successRate = syncStats.successRate;
      networkHealth.totalSyncs = syncStats.totalSyncs;

      // Analyze health and generate alerts
      this.analyzeHealthAndGenerateAlerts(networkHealth);

    } catch (error: any) {
      networkHealth.status = 'unhealthy';
      networkHealth.responseTime = Date.now() - startTime;
      networkHealth.details.error = error.message;
      networkHealth.alerts.push({
        level: 'error',
        message: `Health check failed: ${error.message}`,
        timestamp: new Date()
      });
    }

    return networkHealth;
  }

  /**
   * Get sync statistics for a source
   */
  private async getSyncStatistics(sourceId: number): Promise<{ successRate: number; totalSyncs: number }> {
    try {
      // Get syncs from the last 7 days
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      const recentSyncs = await db.select()
        .from(offerSyncHistory)
        .where(
          gte(offerSyncHistory.startedAt, sevenDaysAgo)
        )
        .orderBy(desc(offerSyncHistory.startedAt))
        .limit(100);

      const totalSyncs = recentSyncs.length;
      const successfulSyncs = recentSyncs.filter(sync => sync.status === 'success').length;
      const successRate = totalSyncs > 0 ? (successfulSyncs / totalSyncs) * 100 : 0;

      return { successRate, totalSyncs };
    } catch (error: any) {
      console.error('[HealthMonitor] Failed to get sync statistics:', error.message);
      return { successRate: 0, totalSyncs: 0 };
    }
  }

  /**
   * Analyze health metrics and generate appropriate alerts
   */
  private analyzeHealthAndGenerateAlerts(networkHealth: NetworkHealth): void {
    // Response time alerts
    if (networkHealth.responseTime > this.alertThresholds.responseTime.critical) {
      networkHealth.alerts.push({
        level: 'critical',
        message: `Critical response time: ${networkHealth.responseTime}ms (threshold: ${this.alertThresholds.responseTime.critical}ms)`,
        timestamp: new Date()
      });
    } else if (networkHealth.responseTime > this.alertThresholds.responseTime.warning) {
      networkHealth.alerts.push({
        level: 'warning',
        message: `Slow response time: ${networkHealth.responseTime}ms (threshold: ${this.alertThresholds.responseTime.warning}ms)`,
        timestamp: new Date()
      });
    }

    // Success rate alerts
    if (networkHealth.successRate < (100 - this.alertThresholds.errorRate.critical)) {
      networkHealth.alerts.push({
        level: 'critical',
        message: `Critical error rate: ${(100 - networkHealth.successRate).toFixed(1)}% (threshold: ${this.alertThresholds.errorRate.critical}%)`,
        timestamp: new Date()
      });
    } else if (networkHealth.successRate < (100 - this.alertThresholds.errorRate.warning)) {
      networkHealth.alerts.push({
        level: 'warning',
        message: `High error rate: ${(100 - networkHealth.successRate).toFixed(1)}% (threshold: ${this.alertThresholds.errorRate.warning}%)`,
        timestamp: new Date()
      });
    }

    // Sync age alerts
    if (networkHealth.lastSuccessfulSync) {
      const syncAge = Date.now() - networkHealth.lastSuccessfulSync.getTime();
      
      if (syncAge > this.alertThresholds.syncAge.critical) {
        networkHealth.alerts.push({
          level: 'critical',
          message: `No successful sync in ${Math.round(syncAge / (24 * 60 * 60 * 1000))} days`,
          timestamp: new Date()
        });
      } else if (syncAge > this.alertThresholds.syncAge.warning) {
        networkHealth.alerts.push({
          level: 'warning',
          message: `Last successful sync was ${Math.round(syncAge / (60 * 60 * 1000))} hours ago`,
          timestamp: new Date()
        });
      }
    } else {
      networkHealth.alerts.push({
        level: 'warning',
        message: 'No successful syncs recorded',
        timestamp: new Date()
      });
    }

    // Credential validation alerts
    if (!networkHealth.details.credentialsValid) {
      networkHealth.alerts.push({
        level: 'error',
        message: 'Invalid or missing credentials',
        timestamp: new Date()
      });
    }

    // Data availability alerts
    if (!networkHealth.details.dataAvailable) {
      networkHealth.alerts.push({
        level: 'warning',
        message: 'No data available from this source',
        timestamp: new Date()
      });
    }

    // Rate limit alerts
    if (networkHealth.details.rateLimit) {
      networkHealth.alerts.push({
        level: 'warning',
        message: 'Rate limit restrictions detected',
        timestamp: new Date()
      });
    }
  }

  /**
   * Calculate overall system health
   */
  private calculateSystemHealth(networkHealthResults: NetworkHealth[]): SystemHealth {
    const totalNetworks = networkHealthResults.length;
    const healthyNetworks = networkHealthResults.filter(n => n.status === 'healthy').length;
    const degradedNetworks = networkHealthResults.filter(n => n.status === 'degraded').length;
    const unhealthyNetworks = networkHealthResults.filter(n => n.status === 'unhealthy').length;
    const offlineNetworks = networkHealthResults.filter(n => n.status === 'offline').length;

    // Calculate averages
    const averageResponseTime = totalNetworks > 0 ? 
      networkHealthResults.reduce((sum, n) => sum + n.responseTime, 0) / totalNetworks : 0;
    
    const overallSuccessRate = totalNetworks > 0 ?
      networkHealthResults.reduce((sum, n) => sum + n.successRate, 0) / totalNetworks : 0;

    // Determine overall status
    let overallStatus: 'healthy' | 'degraded' | 'critical' = 'healthy';
    
    if (offlineNetworks > 0 || unhealthyNetworks > totalNetworks * 0.3) {
      overallStatus = 'critical';
    } else if (degradedNetworks > 0 || unhealthyNetworks > 0 || overallSuccessRate < 80) {
      overallStatus = 'degraded';
    }

    // Generate system-level alerts
    const systemAlerts: Array<{
      level: 'info' | 'warning' | 'error' | 'critical';
      message: string;
      timestamp: Date;
      sourceSlug?: string;
    }> = [];

    if (overallStatus === 'critical') {
      systemAlerts.push({
        level: 'critical',
        message: `System health critical: ${offlineNetworks} offline, ${unhealthyNetworks} unhealthy networks`,
        timestamp: new Date()
      });
    }

    if (overallSuccessRate < 70) {
      systemAlerts.push({
        level: 'critical',
        message: `Overall success rate critical: ${overallSuccessRate.toFixed(1)}%`,
        timestamp: new Date()
      });
    }

    if (averageResponseTime > 5000) {
      systemAlerts.push({
        level: 'warning',
        message: `High average response time: ${averageResponseTime.toFixed(0)}ms`,
        timestamp: new Date()
      });
    }

    return {
      overallStatus,
      totalNetworks,
      healthyNetworks,
      degradedNetworks,
      unhealthyNetworks,
      offlineNetworks,
      averageResponseTime: Math.round(averageResponseTime),
      overallSuccessRate: Math.round(overallSuccessRate * 100) / 100,
      lastUpdate: new Date(),
      networks: networkHealthResults,
      systemAlerts
    };
  }

  /**
   * Emit health-related events
   */
  private emitHealthEvents(networkHealth: NetworkHealth): void {
    // Check for status changes
    const previousHealth = this.networkHealthMap.get(networkHealth.sourceSlug);
    
    if (previousHealth && previousHealth.status !== networkHealth.status) {
      this.emit('statusChange', {
        sourceSlug: networkHealth.sourceSlug,
        sourceName: networkHealth.sourceName,
        previousStatus: previousHealth.status,
        newStatus: networkHealth.status,
        timestamp: new Date()
      });
    }

    // Emit critical alerts
    const criticalAlerts = networkHealth.alerts.filter(alert => alert.level === 'critical');
    for (const alert of criticalAlerts) {
      this.emit('criticalAlert', {
        sourceSlug: networkHealth.sourceSlug,
        sourceName: networkHealth.sourceName,
        alert,
        timestamp: new Date()
      });
    }

    // Emit network health update
    this.emit('networkHealthUpdate', networkHealth);
  }

  /**
   * Get current system health
   */
  getCurrentSystemHealth(): SystemHealth | null {
    if (this.networkHealthMap.size === 0) {
      return null;
    }

    const networkHealthResults = Array.from(this.networkHealthMap.values());
    return this.calculateSystemHealth(networkHealthResults);
  }

  /**
   * Get health for specific network
   */
  getNetworkHealth(sourceSlug: string): NetworkHealth | null {
    return this.networkHealthMap.get(sourceSlug) || null;
  }

  /**
   * Get all network health data
   */
  getAllNetworkHealth(): NetworkHealth[] {
    return Array.from(this.networkHealthMap.values());
  }

  /**
   * Force health check for specific network
   */
  async forceHealthCheck(sourceSlug: string): Promise<NetworkHealth | null> {
    try {
      const [source] = await db.select()
        .from(offerSources)
        .where(eq(offerSources.slug, sourceSlug));

      if (!source) {
        console.error(`[HealthMonitor] Source not found: ${sourceSlug}`);
        return null;
      }

      const networkHealth = await this.checkNetworkHealth(source);
      this.networkHealthMap.set(source.slug, networkHealth);
      
      this.emitHealthEvents(networkHealth);
      
      return networkHealth;
    } catch (error: any) {
      console.error(`[HealthMonitor] Force health check failed for ${sourceSlug}:`, error.message);
      return null;
    }
  }

  /**
   * Update alert thresholds
   */
  updateAlertThresholds(thresholds: Partial<typeof this.alertThresholds>): void {
    this.alertThresholds = { ...this.alertThresholds, ...thresholds };
    console.log('[HealthMonitor] Alert thresholds updated:', this.alertThresholds);
  }

  /**
   * Get health monitoring statistics
   */
  getMonitoringStatistics(): {
    totalChecks: number;
    averageResponseTime: number;
    uptime: number;
    alertCounts: Record<string, number>;
  } {
    const networks = Array.from(this.networkHealthMap.values());
    const totalChecks = networks.length;
    const averageResponseTime = totalChecks > 0 ? 
      networks.reduce((sum, n) => sum + n.responseTime, 0) / totalChecks : 0;

    const healthyNetworks = networks.filter(n => n.status === 'healthy').length;
    const uptime = totalChecks > 0 ? (healthyNetworks / totalChecks) * 100 : 0;

    const alertCounts = {
      info: 0,
      warning: 0,
      error: 0,
      critical: 0
    };

    networks.forEach(network => {
      network.alerts.forEach(alert => {
        alertCounts[alert.level]++;
      });
    });

    return {
      totalChecks,
      averageResponseTime: Math.round(averageResponseTime),
      uptime: Math.round(uptime * 100) / 100,
      alertCounts
    };
  }
}