/**
 * Environment Detection Service
 * Detects local AI capabilities and adjusts system behavior accordingly
 */

import { logger } from '../../utils/logger.js';
import axios from 'axios';

export interface AICapabilities {
  hasGPU: boolean;
  hasOllama: boolean;
  hasVectorDB: boolean;
  hasEmbeddingServer: boolean;
  localModels: string[];
  memoryGB: number;
  cpuCores: number;
  isLocalDeployment: boolean;
}

export class EnvironmentDetector {
  private capabilities: AICapabilities | null = null;
  private lastCheck: Date | null = null;
  private checkInterval: number = 60000; // 1 minute

  async detectCapabilities(): Promise<AICapabilities> {
    // Return cached result if recent
    if (this.capabilities && this.lastCheck && 
        Date.now() - this.lastCheck.getTime() < this.checkInterval) {
      return this.capabilities;
    }

    logger.info('🔍 Detecting AI/ML environment capabilities...');

    const capabilities: AICapabilities = {
      hasGPU: false,
      hasOllama: false,
      hasVectorDB: false,
      hasEmbeddingServer: false,
      localModels: [],
      memoryGB: 0,
      cpuCores: 0,
      isLocalDeployment: false
    };

    // Check system resources
    await this.checkSystemResources(capabilities);

    // Check local AI services
    await this.checkOllamaService(capabilities);
    await this.checkVectorDatabase(capabilities);
    await this.checkEmbeddingServer(capabilities);

    // Determine if this is local deployment
    capabilities.isLocalDeployment = this.isLocalEnvironment(capabilities);

    this.capabilities = capabilities;
    this.lastCheck = new Date();

    logger.info('✅ Environment detection completed', {
      hasGPU: capabilities.hasGPU,
      hasOllama: capabilities.hasOllama,
      hasVectorDB: capabilities.hasVectorDB,
      hasEmbeddingServer: capabilities.hasEmbeddingServer,
      localModels: capabilities.localModels.length,
      isLocalDeployment: capabilities.isLocalDeployment,
      memoryGB: capabilities.memoryGB
    });

    return capabilities;
  }

  private async checkSystemResources(capabilities: AICapabilities): Promise<void> {
    try {
      // Check memory
      const memInfo = process.memoryUsage();
      capabilities.memoryGB = Math.round(memInfo.rss / (1024 * 1024 * 1024) * 10) / 10;

      // Check CPU cores
      const os = await import('os');
      capabilities.cpuCores = os.cpus().length;

      // Check for GPU indicators
      capabilities.hasGPU = !!(
        process.env.CUDA_VISIBLE_DEVICES ||
        process.env.GPU_ENABLED === 'true' ||
        process.env.NVIDIA_VISIBLE_DEVICES
      );

      logger.debug('System resources detected', {
        memoryGB: capabilities.memoryGB,
        cpuCores: capabilities.cpuCores,
        hasGPU: capabilities.hasGPU
      });

    } catch (error) {
      logger.warn('Failed to detect system resources', { error: error.message });
    }
  }

  private async checkOllamaService(capabilities: AICapabilities): Promise<void> {
    try {
      const ollamaUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
      
      const response = await axios.get(`${ollamaUrl}/api/tags`, {
        timeout: 3000
      });

      if (response.status === 200 && response.data.models) {
        capabilities.hasOllama = true;
        capabilities.localModels = response.data.models.map((model: any) => model.name);
        
        logger.debug('Ollama service detected', {
          url: ollamaUrl,
          models: capabilities.localModels
        });
      }

    } catch (error) {
      logger.debug('Ollama service not available', { 
        url: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
        error: error.message 
      });
    }
  }

  private async checkVectorDatabase(capabilities: AICapabilities): Promise<void> {
    try {
      const qdrantUrl = process.env.QDRANT_URL || 'http://localhost:6333';
      
      const response = await axios.get(`${qdrantUrl}/health`, {
        timeout: 3000
      });

      if (response.status === 200) {
        capabilities.hasVectorDB = true;
        
        logger.debug('Vector database detected', { url: qdrantUrl });
      }

    } catch (error) {
      logger.debug('Vector database not available', { 
        url: process.env.QDRANT_URL || 'http://localhost:6333',
        error: error.message 
      });
    }
  }

  private async checkEmbeddingServer(capabilities: AICapabilities): Promise<void> {
    try {
      const embeddingUrl = process.env.EMBEDDING_SERVER_URL || 'http://localhost:8001';
      
      const response = await axios.get(`${embeddingUrl}/health`, {
        timeout: 3000
      });

      if (response.status === 200) {
        capabilities.hasEmbeddingServer = true;
        
        logger.debug('Embedding server detected', { url: embeddingUrl });
      }

    } catch (error) {
      logger.debug('Embedding server not available', { 
        url: process.env.EMBEDDING_SERVER_URL || 'http://localhost:8001',
        error: error.message 
      });
    }
  }

  private isLocalEnvironment(capabilities: AICapabilities): boolean {
    // Consider it local deployment if:
    // 1. Has local AI services OR
    // 2. Has GPU and sufficient resources OR
    // 3. Environment variables indicate local setup
    
    const hasLocalServices = capabilities.hasOllama || capabilities.hasVectorDB || capabilities.hasEmbeddingServer;
    const hasGoodResources = capabilities.hasGPU && capabilities.memoryGB >= 4 && capabilities.cpuCores >= 4;
    const hasLocalEnvVars = process.env.LOCAL_AI_ENABLED === 'true' || process.env.EMPIRE_MODE === 'true';
    
    return hasLocalServices || hasGoodResources || hasLocalEnvVars;
  }

  shouldUseFallbacks(): boolean {
    if (!this.capabilities) {
      return true; // Default to fallbacks if not detected yet
    }

    // Use fallbacks if NOT in local deployment
    return !this.capabilities.isLocalDeployment;
  }

  getOptimalConfiguration(): {
    fallbackMode: boolean;
    vectorSearchEnabled: boolean;
    semanticIntelligenceEnabled: boolean;
    layoutMutationEnabled: boolean;
    maxConcurrentRequests: number;
  } {
    const capabilities = this.capabilities;
    
    if (!capabilities || !capabilities.isLocalDeployment) {
      // Replit environment - use fallbacks
      return {
        fallbackMode: true,
        vectorSearchEnabled: false,
        semanticIntelligenceEnabled: false,
        layoutMutationEnabled: false,
        maxConcurrentRequests: 2
      };
    }

    // Local environment - full capabilities
    return {
      fallbackMode: false,
      vectorSearchEnabled: capabilities.hasVectorDB,
      semanticIntelligenceEnabled: capabilities.hasOllama && capabilities.hasEmbeddingServer,
      layoutMutationEnabled: capabilities.hasGPU && capabilities.memoryGB >= 4,
      maxConcurrentRequests: Math.min(capabilities.cpuCores * 2, 20)
    };
  }
}

// Export singleton instance
export const environmentDetector = new EnvironmentDetector();