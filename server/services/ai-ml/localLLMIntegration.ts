/**
 * Local LLM Integration Service
 * Provides seamless integration with Ollama and local AI models
 */

import { EventEmitter } from 'events';
import { logger } from '../../utils/logger.js';
import axios from 'axios';

export interface LLMRequest {
  model?: string;
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  stop?: string[];
  stream?: boolean;
}

export interface LLMResponse {
  text: string;
  model: string;
  tokensUsed: number;
  processingTime: number;
  finishReason: string;
}

export class LocalLLMIntegration extends EventEmitter {
  private initialized = false;
  private availableModels: string[] = [];
  private ollamaUrl: string;
  private healthCheckInterval: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.ollamaUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      logger.info('🧠 Initializing Local LLM Integration...');

      // Check Ollama availability
      await this.checkOllamaHealth();

      // Load available models
      await this.loadAvailableModels();

      // Start health monitoring
      this.startHealthMonitoring();

      this.initialized = true;
      logger.info('✅ Local LLM Integration initialized', {
        ollamaUrl: this.ollamaUrl,
        availableModels: this.availableModels.length,
        models: this.availableModels
      });

    } catch (error) {
      logger.warn('⚠️ Local LLM Integration failed to initialize', { error: error.message });
      throw error;
    }
  }

  private async checkOllamaHealth(): Promise<void> {
    try {
      const response = await axios.get(`${this.ollamaUrl}/api/tags`, { timeout: 5000 });
      if (response.status !== 200) {
        throw new Error(`Ollama health check failed: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Ollama not available at ${this.ollamaUrl}: ${error.message}`);
    }
  }

  private async loadAvailableModels(): Promise<void> {
    try {
      const response = await axios.get(`${this.ollamaUrl}/api/tags`);
      
      if (response.data && response.data.models) {
        this.availableModels = response.data.models.map((model: any) => model.name);
        logger.info('📚 Loaded available models', { models: this.availableModels });
      } else {
        logger.warn('⚠️ No models found in Ollama');
        this.availableModels = [];
      }

    } catch (error) {
      logger.error('❌ Failed to load models from Ollama', { error: error.message });
      this.availableModels = [];
    }
  }

  private startHealthMonitoring(): void {
    // Check health every 60 seconds
    this.healthCheckInterval = setInterval(async () => {
      try {
        await this.checkOllamaHealth();
        await this.loadAvailableModels();
      } catch (error) {
        logger.warn('🔍 Health check failed', { error: error.message });
        this.emit('health:degraded', { service: 'ollama', error: error.message });
      }
    }, 60000);
  }

  async generateText(request: LLMRequest): Promise<LLMResponse> {
    if (!this.initialized) {
      await this.initialize();
    }

    const startTime = Date.now();

    try {
      // Select model
      const model = request.model || await this.getOptimalModel(request.prompt);
      
      if (!this.availableModels.includes(model)) {
        throw new Error(`Model ${model} not available. Available: ${this.availableModels.join(', ')}`);
      }

      // Prepare request payload
      const payload = {
        model,
        prompt: request.prompt,
        options: {
          temperature: request.temperature || 0.7,
          num_predict: request.maxTokens || 1000,
          stop: request.stop || [],
        },
        stream: request.stream || false
      };

      // Make request to Ollama
      const response = await axios.post(`${this.ollamaUrl}/api/generate`, payload, {
        timeout: 120000 // 2 minutes timeout
      });

      const processingTime = Date.now() - startTime;

      if (!response.data || !response.data.response) {
        throw new Error('Invalid response from Ollama');
      }

      const result: LLMResponse = {
        text: response.data.response,
        model,
        tokensUsed: this.estimateTokens(request.prompt + response.data.response),
        processingTime,
        finishReason: response.data.done ? 'stop' : 'length'
      };

      logger.debug('✅ LLM generation completed', {
        model,
        promptLength: request.prompt.length,
        responseLength: result.text.length,
        processingTime
      });

      return result;

    } catch (error) {
      const processingTime = Date.now() - startTime;
      
      logger.error('❌ LLM generation failed', {
        model: request.model,
        error: error.message,
        processingTime
      });

      throw error;
    }
  }

  async getOptimalModel(prompt: string): Promise<string> {
    // Model selection logic based on prompt and available models
    const promptLower = prompt.toLowerCase();

    // Coding tasks
    if (this.isCodeRelated(promptLower)) {
      const codingModels = ['deepseek-coder:33b', 'deepseek-coder:6.7b', 'codellama:13b', 'codellama:7b'];
      for (const model of codingModels) {
        if (this.availableModels.includes(model)) {
          return model;
        }
      }
    }

    // Complex reasoning tasks
    if (this.isComplexReasoning(promptLower)) {
      const reasoningModels = ['llama3.1:70b', 'mixtral:8x7b', 'llama3.1:8b'];
      for (const model of reasoningModels) {
        if (this.availableModels.includes(model)) {
          return model;
        }
      }
    }

    // General purpose - fast models
    const generalModels = ['llama3.1:8b', 'mixtral:8x7b', 'llama3:8b', 'mistral:7b'];
    for (const model of generalModels) {
      if (this.availableModels.includes(model)) {
        return model;
      }
    }

    // Fallback to first available model
    if (this.availableModels.length > 0) {
      return this.availableModels[0];
    }

    throw new Error('No models available');
  }

  private isCodeRelated(prompt: string): boolean {
    const codeKeywords = ['code', 'function', 'class', 'variable', 'algorithm', 'programming', 'javascript', 'python', 'typescript', 'react', 'api', 'debug'];
    return codeKeywords.some(keyword => prompt.includes(keyword));
  }

  private isComplexReasoning(prompt: string): boolean {
    const reasoningKeywords = ['analyze', 'explain', 'compare', 'evaluate', 'strategy', 'plan', 'complex', 'reasoning'];
    return reasoningKeywords.some(keyword => prompt.includes(keyword)) && prompt.length > 200;
  }

  private estimateTokens(text: string): number {
    // Rough estimation: 1 token ≈ 4 characters for English
    return Math.ceil(text.length / 4);
  }

  // Streaming support for real-time responses
  async generateTextStream(request: LLMRequest, onChunk: (chunk: string) => void): Promise<LLMResponse> {
    if (!this.initialized) {
      await this.initialize();
    }

    const startTime = Date.now();
    let fullResponse = '';

    try {
      const model = request.model || await this.getOptimalModel(request.prompt);
      
      const payload = {
        model,
        prompt: request.prompt,
        options: {
          temperature: request.temperature || 0.7,
          num_predict: request.maxTokens || 1000,
          stop: request.stop || [],
        },
        stream: true
      };

      const response = await axios.post(`${this.ollamaUrl}/api/generate`, payload, {
        responseType: 'stream',
        timeout: 120000
      });

      return new Promise((resolve, reject) => {
        let buffer = '';

        response.data.on('data', (chunk: Buffer) => {
          buffer += chunk.toString();
          
          // Process complete JSON lines
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Keep incomplete line in buffer

          for (const line of lines) {
            if (line.trim()) {
              try {
                const data = JSON.parse(line);
                if (data.response) {
                  fullResponse += data.response;
                  onChunk(data.response);
                }
                
                if (data.done) {
                  const processingTime = Date.now() - startTime;
                  resolve({
                    text: fullResponse,
                    model,
                    tokensUsed: this.estimateTokens(request.prompt + fullResponse),
                    processingTime,
                    finishReason: 'stop'
                  });
                }
              } catch (parseError) {
                // Ignore malformed JSON lines
              }
            }
          }
        });

        response.data.on('error', (error: Error) => {
          reject(error);
        });

        response.data.on('end', () => {
          if (!fullResponse) {
            reject(new Error('Stream ended without response'));
          }
        });
      });

    } catch (error) {
      logger.error('❌ Streaming generation failed', { error: error.message });
      throw error;
    }
  }

  // Utility methods
  getAvailableModels(): string[] {
    return [...this.availableModels];
  }

  isModelAvailable(modelName: string): boolean {
    return this.availableModels.includes(modelName);
  }

  async pullModel(modelName: string): Promise<void> {
    try {
      logger.info(`📥 Pulling model: ${modelName}`);
      
      const response = await axios.post(`${this.ollamaUrl}/api/pull`, {
        name: modelName
      }, {
        timeout: 600000 // 10 minutes for model download
      });

      if (response.status === 200) {
        await this.loadAvailableModels(); // Refresh model list
        logger.info(`✅ Model pulled successfully: ${modelName}`);
      }

    } catch (error) {
      logger.error(`❌ Failed to pull model ${modelName}`, { error: error.message });
      throw error;
    }
  }

  async getModelInfo(modelName: string): Promise<any> {
    try {
      const response = await axios.post(`${this.ollamaUrl}/api/show`, {
        name: modelName
      });

      return response.data;

    } catch (error) {
      logger.error(`❌ Failed to get model info for ${modelName}`, { error: error.message });
      throw error;
    }
  }

  shutdown(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
    
    this.initialized = false;
    logger.info('🛑 Local LLM Integration shutdown');
  }
}

// Export singleton instance
export const localLLM = new LocalLLMIntegration();