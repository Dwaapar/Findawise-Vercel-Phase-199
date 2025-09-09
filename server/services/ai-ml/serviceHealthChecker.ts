/**
 * AI/ML Service Health Checker
 * Monitors the health of local AI services and adjusts system behavior
 */

import { EventEmitter } from 'events';
import { logger } from '../../utils/logger.js';
import { environmentDetector } from './environmentDetector.js';
import axios from 'axios';

export interface ServiceHealth {
  name: string;
  url: string;
  status: 'healthy' | 'degraded' | 'offline';
  lastCheck: Date;
  responseTime: number;
  details?: any;
}

export class ServiceHealthChecker extends EventEmitter {
  private services: Map<string, ServiceHealth> = new Map();
  private checkInterval: NodeJS.Timeout | null = null;
  private checkIntervalMs = 30000; // 30 seconds

  constructor() {
    super();
    this.initializeServices();
  }

  private initializeServices(): void {
    const services = [
      {
        name: 'ollama',
        url: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
        healthPath: '/api/tags'
      },
      {
        name: 'qdrant',
        url: process.env.QDRANT_URL || 'http://localhost:6333',
        healthPath: '/health'
      },
      {
        name: 'embedding-server',
        url: process.env.EMBEDDING_SERVER_URL || 'http://localhost:8001',
        healthPath: '/health'
      }
    ];

    services.forEach(service => {
      this.services.set(service.name, {
        name: service.name,
        url: service.url,
        status: 'offline',
        lastCheck: new Date(),
        responseTime: 0
      });
    });
  }

  async startMonitoring(): Promise<void> {
    if (this.checkInterval) {
      return; // Already monitoring
    }

    logger.info('🏥 Starting AI/ML service health monitoring...');

    // Initial check
    await this.checkAllServices();

    // Start periodic monitoring
    this.checkInterval = setInterval(async () => {
      await this.checkAllServices();
    }, this.checkIntervalMs);

    logger.info('✅ Service health monitoring started');
  }

  stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      logger.info('🛑 Service health monitoring stopped');
    }
  }

  private async checkAllServices(): Promise<void> {
    const capabilities = await environmentDetector.detectCapabilities();
    
    if (!capabilities.isLocalDeployment) {
      // Skip health checks in cloud environment
      return;
    }

    const promises = Array.from(this.services.keys()).map(serviceName => 
      this.checkService(serviceName)
    );

    await Promise.allSettled(promises);

    // Emit overall health status
    const healthySevices = Array.from(this.services.values()).filter(s => s.status === 'healthy');
    const totalServices = this.services.size;

    this.emit('health:update', {
      healthy: healthySevices.length,
      total: totalServices,
      percentage: Math.round((healthySevices.length / totalServices) * 100)
    });
  }

  private async checkService(serviceName: string): Promise<void> {
    const service = this.services.get(serviceName);
    if (!service) return;

    const startTime = Date.now();

    try {
      const healthPath = this.getHealthPath(serviceName);
      const response = await axios.get(`${service.url}${healthPath}`, {
        timeout: 5000,
        validateStatus: (status) => status < 500 // Accept 2xx, 3xx, 4xx
      });

      const responseTime = Date.now() - startTime;
      const newStatus = response.status < 400 ? 'healthy' : 'degraded';

      // Update service health
      this.services.set(serviceName, {
        ...service,
        status: newStatus,
        lastCheck: new Date(),
        responseTime,
        details: {
          statusCode: response.status,
          data: response.data
        }
      });

      // Emit status change if different
      if (service.status !== newStatus) {
        this.emit('service:status-change', {
          service: serviceName,
          oldStatus: service.status,
          newStatus,
          responseTime
        });

        logger.info(`🔄 Service ${serviceName} status changed: ${service.status} → ${newStatus}`, {
          service: serviceName,
          responseTime,
          url: service.url
        });
      }

    } catch (error) {
      const responseTime = Date.now() - startTime;

      // Update service as offline
      this.services.set(serviceName, {
        ...service,
        status: 'offline',
        lastCheck: new Date(),
        responseTime,
        details: {
          error: error.message
        }
      });

      // Emit status change if different
      if (service.status !== 'offline') {
        this.emit('service:status-change', {
          service: serviceName,
          oldStatus: service.status,
          newStatus: 'offline',
          responseTime,
          error: error.message
        });

        logger.warn(`⚠️ Service ${serviceName} went offline`, {
          service: serviceName,
          error: error.message,
          url: service.url
        });
      }
    }
  }

  private getHealthPath(serviceName: string): string {
    const healthPaths = {
      'ollama': '/api/tags',
      'qdrant': '/health',
      'embedding-server': '/health'
    };

    return healthPaths[serviceName] || '/health';
  }

  getServiceHealth(serviceName: string): ServiceHealth | null {
    return this.services.get(serviceName) || null;
  }

  getAllServiceHealth(): ServiceHealth[] {
    return Array.from(this.services.values());
  }

  isServiceHealthy(serviceName: string): boolean {
    const service = this.services.get(serviceName);
    return service?.status === 'healthy';
  }

  areAllServicesHealthy(): boolean {
    return Array.from(this.services.values()).every(s => s.status === 'healthy');
  }

  getHealthySevices(): string[] {
    return Array.from(this.services.values())
      .filter(s => s.status === 'healthy')
      .map(s => s.name);
  }

  shouldEnableFeature(featureName: string): boolean {
    switch (featureName) {
      case 'vector-search':
        return this.isServiceHealthy('qdrant') && this.isServiceHealthy('embedding-server');
      
      case 'semantic-intelligence':
        return this.isServiceHealthy('ollama') && this.isServiceHealthy('embedding-server');
      
      case 'layout-mutation':
        return this.isServiceHealthy('ollama') && this.isServiceHealthy('qdrant');
      
      default:
        return false;
    }
  }
}

// Export singleton instance
export const serviceHealthChecker = new ServiceHealthChecker();