// Enterprise AI Configuration for Empire System
export const aiConfig = {
  // OpenAI Configuration
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
    maxTokens: 4000,
    temperature: 0.7,
    timeout: 30000
  },

  // Anthropic Configuration  
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY || '',
    model: process.env.ANTHROPIC_MODEL || 'claude-3-sonnet-20240229',
    maxTokens: 4000,
    timeout: 30000
  },

  // Local AI Configuration
  ollama: {
    baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    model: process.env.OLLAMA_MODEL || 'llama2',
    timeout: 30000
  },

  // AI Brain Configuration
  brain: {
    enabled: process.env.AI_BRAIN_ENABLED === 'true',
    provider: process.env.AI_PROVIDER || 'openai',
    fallbackProvider: process.env.AI_FALLBACK_PROVIDER || 'anthropic',
    maxRetries: 3,
    retryDelay: 1000
  },

  // Self-Evolution Configuration
  evolution: {
    enabled: process.env.SELF_EVOLUTION_ENABLED === 'true',
    learningRate: 0.1,
    maxEvolutionCycles: 10,
    evolutionInterval: 3600000 // 1 hour
  },

  // Performance Monitoring
  monitoring: {
    trackPerformance: true,
    logRequests: process.env.NODE_ENV === 'development',
    metricsEnabled: true
  }
};

export type AIConfig = typeof aiConfig;

export default aiConfig;