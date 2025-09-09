/**
 * AI/ML Integration Router
 * Routes AI requests to appropriate services based on environment capabilities
 */

import { EventEmitter } from 'events';
import { logger } from '../../utils/logger.js';
import { environmentDetector } from './environmentDetector.js';
import { serviceHealthChecker } from './serviceHealthChecker.js';
import { localLLM } from './localLLMIntegration.js';

export interface AIRequest {
  type: 'embedding' | 'llm' | 'vector-search' | 'semantic-analysis';
  input: string | string[];
  options?: any;
  priority?: 'low' | 'medium' | 'high';
}

export interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
  source: 'local' | 'fallback';
  processingTime: number;
  metadata?: any;
}

export class AIIntegrationRouter extends EventEmitter {
  private initialized = false;
  private capabilities: any = null;

  constructor() {
    super();
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      logger.info('🚀 Initializing AI Integration Router...');

      // Detect environment capabilities
      this.capabilities = await environmentDetector.detectCapabilities();

      // Start service health monitoring if local deployment
      if (this.capabilities.isLocalDeployment) {
        await serviceHealthChecker.startMonitoring();
        
        // Initialize local LLM integration
        if (this.capabilities.hasOllama) {
          await localLLM.initialize();
        }
      }

      // Set up event listeners
      this.setupEventListeners();

      this.initialized = true;
      logger.info('✅ AI Integration Router initialized', {
        isLocal: this.capabilities.isLocalDeployment,
        hasOllama: this.capabilities.hasOllama,
        hasVectorDB: this.capabilities.hasVectorDB,
        hasEmbeddingServer: this.capabilities.hasEmbeddingServer
      });

    } catch (error) {
      logger.error('❌ Failed to initialize AI Integration Router', error);
      throw error;
    }
  }

  private setupEventListeners(): void {
    // Listen to service health changes
    serviceHealthChecker.on('service:status-change', (event) => {
      logger.info(`🔄 Service ${event.service} status: ${event.oldStatus} → ${event.newStatus}`);
      
      // Emit capability change event
      this.emit('capabilities:changed', {
        service: event.service,
        available: event.newStatus === 'healthy'
      });
    });

    // Listen to health updates
    serviceHealthChecker.on('health:update', (status) => {
      this.emit('health:update', status);
    });
  }

  async processRequest(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();

    try {
      if (!this.initialized) {
        await this.initialize();
      }

      // Route request based on type and capabilities
      switch (request.type) {
        case 'embedding':
          return await this.handleEmbeddingRequest(request, startTime);
        
        case 'llm':
          return await this.handleLLMRequest(request, startTime);
        
        case 'vector-search':
          return await this.handleVectorSearchRequest(request, startTime);
        
        case 'semantic-analysis':
          return await this.handleSemanticAnalysisRequest(request, startTime);
        
        default:
          throw new Error(`Unsupported request type: ${request.type}`);
      }

    } catch (error) {
      const processingTime = Date.now() - startTime;
      
      logger.error('❌ AI request processing failed', {
        type: request.type,
        error: error.message,
        processingTime
      });

      return {
        success: false,
        error: error.message,
        source: 'fallback',
        processingTime
      };
    }
  }

  private async handleEmbeddingRequest(request: AIRequest, startTime: number): Promise<AIResponse> {
    const processingTime = Date.now() - startTime;

    // Check if embedding server is available
    if (this.capabilities.isLocalDeployment && serviceHealthChecker.isServiceHealthy('embedding-server')) {
      try {
        // Use local embedding server
        const response = await this.callEmbeddingServer(request.input, request.options);
        
        return {
          success: true,
          data: response,
          source: 'local',
          processingTime: Date.now() - startTime,
          metadata: {
            service: 'embedding-server',
            model: request.options?.model || 'default'
          }
        };

      } catch (error) {
        logger.warn('Local embedding server failed, using fallback', { error: error.message });
      }
    }

    // Fallback to simple text processing
    return {
      success: true,
      data: this.generateSimpleEmbedding(request.input),
      source: 'fallback',
      processingTime,
      metadata: { method: 'simple_hash' }
    };
  }

  private async handleLLMRequest(request: AIRequest, startTime: number): Promise<AIResponse> {
    const processingTime = Date.now() - startTime;

    // Check if Ollama is available
    if (this.capabilities.isLocalDeployment && serviceHealthChecker.isServiceHealthy('ollama')) {
      try {
        // Use local LLM
        const response = await localLLM.generateText({
          model: request.options?.model || await localLLM.getOptimalModel(request.input as string),
          prompt: request.input as string,
          ...request.options
        });

        return {
          success: true,
          data: response,
          source: 'local',
          processingTime: Date.now() - startTime,
          metadata: {
            service: 'ollama',
            model: response.model
          }
        };

      } catch (error) {
        logger.warn('Local LLM failed, using fallback', { error: error.message });
      }
    }

    // Fallback to rule-based response
    return {
      success: true,
      data: this.generateRuleBasedResponse(request.input as string),
      source: 'fallback',
      processingTime,
      metadata: { method: 'rule_based' }
    };
  }

  private async handleVectorSearchRequest(request: AIRequest, startTime: number): Promise<AIResponse> {
    const processingTime = Date.now() - startTime;

    // Check if vector database is available
    if (this.capabilities.isLocalDeployment && serviceHealthChecker.isServiceHealthy('qdrant')) {
      try {
        // Use local vector database
        const response = await this.callVectorDatabase(request.input, request.options);
        
        return {
          success: true,
          data: response,
          source: 'local',
          processingTime: Date.now() - startTime,
          metadata: {
            service: 'qdrant',
            collection: request.options?.collection || 'default'
          }
        };

      } catch (error) {
        logger.warn('Local vector database failed, using fallback', { error: error.message });
      }
    }

    // Fallback to simple text matching
    return {
      success: true,
      data: this.performSimpleTextSearch(request.input as string, request.options),
      source: 'fallback',
      processingTime,
      metadata: { method: 'text_matching' }
    };
  }

  private async handleSemanticAnalysisRequest(request: AIRequest, startTime: number): Promise<AIResponse> {
    const processingTime = Date.now() - startTime;

    // Check if both LLM and embedding services are available
    const canUseLocal = this.capabilities.isLocalDeployment && 
                       serviceHealthChecker.isServiceHealthy('ollama') && 
                       serviceHealthChecker.isServiceHealthy('embedding-server');

    if (canUseLocal) {
      try {
        // Perform semantic analysis using local services
        const analysis = await this.performLocalSemanticAnalysis(request.input as string, request.options);
        
        return {
          success: true,
          data: analysis,
          source: 'local',
          processingTime: Date.now() - startTime,
          metadata: {
            services: ['ollama', 'embedding-server'],
            analysisType: 'full_semantic'
          }
        };

      } catch (error) {
        logger.warn('Local semantic analysis failed, using fallback', { error: error.message });
      }
    }

    // Fallback to basic text analysis
    return {
      success: true,
      data: this.performBasicTextAnalysis(request.input as string),
      source: 'fallback',
      processingTime,
      metadata: { method: 'basic_nlp' }
    };
  }

  // Service call methods (to be implemented based on actual APIs)
  private async callEmbeddingServer(input: string | string[], options?: any): Promise<any> {
    const axios = (await import('axios')).default;
    const url = process.env.EMBEDDING_SERVER_URL || 'http://localhost:8001';
    
    const response = await axios.post(`${url}/embed`, {
      text: input,
      model: options?.model || 'all-MiniLM-L6-v2',
      normalize: options?.normalize !== false
    });

    return response.data;
  }

  private async callVectorDatabase(input: string | string[], options?: any): Promise<any> {
    const axios = (await import('axios')).default;
    const url = process.env.QDRANT_URL || 'http://localhost:6333';
    
    // This would implement actual vector search logic
    // For now, return placeholder
    return {
      results: [],
      similarity_scores: [],
      metadata: { searched: input }
    };
  }

  private async performLocalSemanticAnalysis(text: string, options?: any): Promise<any> {
    // Combine LLM and embedding analysis
    const [llmAnalysis, embeddingData] = await Promise.all([
      localLLM.generateText({
        model: await localLLM.getOptimalModel('analysis'),
        prompt: `Analyze the semantic meaning of this text: "${text}"`,
        maxTokens: 500
      }),
      this.callEmbeddingServer(text)
    ]);

    return {
      semantic_analysis: llmAnalysis.text,
      embeddings: embeddingData.embeddings,
      confidence: 0.95,
      method: 'local_ai'
    };
  }

  // Fallback methods
  private generateSimpleEmbedding(input: string | string[]): any {
    const texts = Array.isArray(input) ? input : [input];
    return {
      embeddings: texts.map(text => 
        Array.from({ length: 384 }, (_, i) => 
          Math.sin(text.charCodeAt(i % text.length) * (i + 1)) * 0.1
        )
      ),
      model: 'simple_hash',
      dimensions: 384
    };
  }

  private generateRuleBasedResponse(input: string): any {
    return {
      text: `Based on your input "${input}", here is a rule-based response.`,
      model: 'rule_based',
      tokensUsed: input.split(' ').length + 10,
      processingTime: 50
    };
  }

  private performSimpleTextSearch(query: string, options?: any): any {
    return {
      results: [],
      message: 'Text search functionality requires vector database',
      query,
      method: 'fallback'
    };
  }

  private performBasicTextAnalysis(text: string): any {
    const words = text.split(/\s+/);
    const sentiment = words.some(word => 
      ['good', 'great', 'excellent', 'amazing'].includes(word.toLowerCase())
    ) ? 'positive' : 'neutral';

    return {
      word_count: words.length,
      sentiment,
      key_phrases: words.filter(word => word.length > 4),
      confidence: 0.6,
      method: 'basic_nlp'
    };
  }

  // Public methods for checking capabilities
  canProcessLocally(requestType: string): boolean {
    if (!this.capabilities?.isLocalDeployment) return false;

    switch (requestType) {
      case 'embedding':
        return serviceHealthChecker.isServiceHealthy('embedding-server');
      case 'llm':
        return serviceHealthChecker.isServiceHealthy('ollama');
      case 'vector-search':
        return serviceHealthChecker.isServiceHealthy('qdrant');
      case 'semantic-analysis':
        return serviceHealthChecker.isServiceHealthy('ollama') && 
               serviceHealthChecker.isServiceHealthy('embedding-server');
      default:
        return false;
    }
  }

  getCapabilities(): any {
    return this.capabilities;
  }

  getServiceHealth(): any {
    return serviceHealthChecker.getAllServiceHealth();
  }
}

// Export singleton instance
export const aiRouter = new AIIntegrationRouter();