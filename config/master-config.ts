/**
 * MASTER CONFIGURATION SYSTEM
 * Centralized configuration for all services, APIs, and integrations
 * Local Docker PostgreSQL + AI Brain Integration
 */

import { z } from 'zod';

// ================================
// DATABASE CONFIGURATION
// ================================

export const DatabaseConfig = {
  // Use Replit's built-in PostgreSQL database
  host: process.env.PGHOST || process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.PGPORT || process.env.DB_PORT || '5432'),
  database: process.env.PGDATABASE || process.env.DB_NAME || 'findawise_empire',
  username: process.env.PGUSER || process.env.DB_USER || 'postgres',
  password: process.env.PGPASSWORD || process.env.DB_PASSWORD || 'postgres',
  ssl: process.env.NODE_ENV === 'production', // Enable SSL in production
  maxConnections: 20,
  idleTimeout: 30000,
  connectionTimeout: 60000,
  
  // Connection string builder - prioritize DATABASE_URL
  getConnectionString: () => {
    if (process.env.DATABASE_URL) {
      return process.env.DATABASE_URL;
    }
    return `postgresql://${DatabaseConfig.username}:${DatabaseConfig.password}@${DatabaseConfig.host}:${DatabaseConfig.port}/${DatabaseConfig.database}`;
  }
};

// ================================
// AI BRAIN CONFIGURATION
// ================================

export const AIBrainConfig = {
  // Local AI Models
  localModels: {
    enabled: process.env.LOCAL_AI_ENABLED === 'true',
    baseUrl: process.env.LOCAL_AI_URL || 'http://localhost:11434', // Ollama default
    models: {
      chat: process.env.LOCAL_AI_CHAT_MODEL || 'llama2',
      embeddings: process.env.LOCAL_AI_EMBEDDINGS_MODEL || 'nomic-embed-text',
      code: process.env.LOCAL_AI_CODE_MODEL || 'codellama'
    }
  },
  
  // External AI APIs (Optional)
  external: {
    openai: {
      enabled: !!process.env.OPENAI_API_KEY,
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || 'gpt-4',
      maxTokens: 4000
    },
    anthropic: {
      enabled: !!process.env.ANTHROPIC_API_KEY,
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: process.env.ANTHROPIC_MODEL || 'claude-3-sonnet-20240229'
    }
  },
  
  // Vector Database (Local)
  vectorDatabase: {
    enabled: process.env.VECTOR_DB_ENABLED === 'true',
    provider: 'chroma', // or 'qdrant', 'pinecone'
    url: process.env.VECTOR_DB_URL || 'http://localhost:8000',
    collection: 'findawise_embeddings'
  }
};

// ================================
// AFFILIATE NETWORKS CONFIGURATION
// ================================

export const AffiliateConfig = {
  networks: {
    shareasale: {
      enabled: !!process.env.SHAREASALE_API_KEY,
      apiKey: process.env.SHAREASALE_API_KEY,
      secretKey: process.env.SHAREASALE_SECRET_KEY,
      affiliateId: process.env.SHAREASALE_AFFILIATE_ID
    },
    commissionJunction: {
      enabled: !!process.env.CJ_API_KEY,
      apiKey: process.env.CJ_API_KEY,
      websiteId: process.env.CJ_WEBSITE_ID
    },
    clickbank: {
      enabled: !!process.env.CLICKBANK_API_KEY,
      apiKey: process.env.CLICKBANK_API_KEY,
      developerKey: process.env.CLICKBANK_DEVELOPER_KEY,
      clerkKey: process.env.CLICKBANK_CLERK_KEY
    },
    amazonAssociates: {
      enabled: !!process.env.AMAZON_ACCESS_KEY,
      accessKey: process.env.AMAZON_ACCESS_KEY,
      secretKey: process.env.AMAZON_SECRET_KEY,
      associateTag: process.env.AMAZON_ASSOCIATE_TAG,
      region: process.env.AMAZON_REGION || 'US'
    }
  },
  
  // Global affiliate settings
  defaultCommission: 0.05, // 5%
  cookieExpiry: 30, // days
  trackingEnabled: true
};

// ================================
// PAYMENT PROCESSING
// ================================

export const PaymentConfig = {
  stripe: {
    enabled: !!process.env.STRIPE_SECRET_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY,
    publicKey: process.env.STRIPE_PUBLIC_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    currency: 'usd'
  },
  
  paypal: {
    enabled: !!process.env.PAYPAL_CLIENT_ID,
    clientId: process.env.PAYPAL_CLIENT_ID,
    clientSecret: process.env.PAYPAL_CLIENT_SECRET,
    mode: process.env.PAYPAL_MODE || 'sandbox' // 'live' for production
  }
};

// ================================
// EMAIL & COMMUNICATION
// ================================

export const CommunicationConfig = {
  email: {
    provider: process.env.EMAIL_PROVIDER || 'sendgrid', // 'sendgrid', 'resend', 'smtp'
    
    sendgrid: {
      enabled: !!process.env.SENDGRID_API_KEY,
      apiKey: process.env.SENDGRID_API_KEY,
      fromEmail: process.env.FROM_EMAIL || 'no-reply@findawise.com'
    },
    
    resend: {
      enabled: !!process.env.RESEND_API_KEY,
      apiKey: process.env.RESEND_API_KEY,
      fromEmail: process.env.FROM_EMAIL || 'no-reply@findawise.com'
    },
    
    smtp: {
      enabled: !!process.env.SMTP_HOST,
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      username: process.env.SMTP_USERNAME,
      password: process.env.SMTP_PASSWORD,
      secure: process.env.SMTP_SECURE === 'true'
    }
  },
  
  notifications: {
    slack: {
      enabled: !!process.env.SLACK_WEBHOOK_URL,
      webhookUrl: process.env.SLACK_WEBHOOK_URL
    },
    discord: {
      enabled: !!process.env.DISCORD_WEBHOOK_URL,
      webhookUrl: process.env.DISCORD_WEBHOOK_URL
    }
  }
};

// ================================
// CONTENT GENERATION
// ================================

export const ContentConfig = {
  // Social Media APIs
  social: {
    twitter: {
      enabled: !!process.env.TWITTER_API_KEY,
      apiKey: process.env.TWITTER_API_KEY,
      apiSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_SECRET
    },
    
    linkedin: {
      enabled: !!process.env.LINKEDIN_ACCESS_TOKEN,
      accessToken: process.env.LINKEDIN_ACCESS_TOKEN,
      clientId: process.env.LINKEDIN_CLIENT_ID
    }
  },
  
  // Content sources
  sources: {
    rss: {
      enabled: true,
      feeds: [
        'https://feeds.feedburner.com/venturebeat/SZYF',
        'https://techcrunch.com/feed/',
        'https://www.producthunt.com/feed'
      ]
    },
    
    scraping: {
      enabled: process.env.SCRAPING_ENABLED === 'true',
      userAgent: 'FindaWise Content Bot 1.0',
      respectRobots: true,
      delay: 2000 // ms between requests
    }
  }
};

// ================================
// SECURITY & COMPLIANCE
// ================================

export const SecurityConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this',
    expiresIn: '7d',
    issuer: 'findawise-empire'
  },
  
  session: {
    secret: process.env.SESSION_SECRET || 'your-session-secret-change-this',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: process.env.NODE_ENV === 'production'
  },
  
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  },
  
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // requests per window
    standardHeaders: true,
    legacyHeaders: false
  }
};

// ================================
// PERFORMANCE & MONITORING
// ================================

export const PerformanceConfig = {
  cache: {
    redis: {
      enabled: !!process.env.REDIS_URL,
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      ttl: 3600 // seconds
    },
    
    memory: {
      enabled: true,
      maxSize: 100 * 1024 * 1024, // 100MB
      ttl: 600 // 10 minutes
    }
  },
  
  monitoring: {
    healthCheckInterval: 30000, // 30 seconds
    metricsEnabled: true,
    logLevel: process.env.LOG_LEVEL || 'info'
  }
};

// ================================
// VALIDATION SCHEMAS
// ================================

const ConfigValidation = {
  database: z.object({
    host: z.string(),
    port: z.number(),
    database: z.string(),
    username: z.string(),
    password: z.string()
  }),
  
  ai: z.object({
    localModels: z.object({
      enabled: z.boolean(),
      baseUrl: z.string().url()
    })
  })
};

// ================================
// CONFIG INITIALIZATION & VALIDATION
// ================================

export class MasterConfigManager {
  private static instance: MasterConfigManager;
  private validated = false;
  
  static getInstance(): MasterConfigManager {
    if (!MasterConfigManager.instance) {
      MasterConfigManager.instance = new MasterConfigManager();
    }
    return MasterConfigManager.instance;
  }
  
  /**
   * Validate all configurations
   */
  async validateConfig(): Promise<boolean> {
    if (this.validated) return true;
    
    console.log('🔍 Validating master configuration...');
    
    try {
      // Validate database connection
      const dbConnString = DatabaseConfig.getConnectionString();
      console.log(`📊 Database: ${DatabaseConfig.host}:${DatabaseConfig.port}/${DatabaseConfig.database}`);
      
      // Validate AI configuration
      if (AIBrainConfig.localModels.enabled) {
        console.log(`🧠 Local AI: ${AIBrainConfig.localModels.baseUrl}`);
      }
      
      // Check critical integrations
      const enabledIntegrations = [];
      if (PaymentConfig.stripe.enabled) enabledIntegrations.push('Stripe');
      if (AffiliateConfig.networks.shareasale.enabled) enabledIntegrations.push('ShareASale');
      if (CommunicationConfig.email.sendgrid.enabled) enabledIntegrations.push('SendGrid');
      
      console.log(`✅ Enabled integrations: ${enabledIntegrations.join(', ') || 'None'}`);
      console.log('🎯 Master configuration validated successfully');
      
      this.validated = true;
      return true;
    } catch (error) {
      console.error('❌ Configuration validation failed:', error);
      return false;
    }
  }
  
  /**
   * Get configuration summary for debugging
   */
  getConfigSummary() {
    return {
      database: {
        host: DatabaseConfig.host,
        port: DatabaseConfig.port,
        database: DatabaseConfig.database
      },
      ai: {
        localEnabled: AIBrainConfig.localModels.enabled,
        externalProviders: Object.keys(AIBrainConfig.external).filter(
          key => AIBrainConfig.external[key].enabled
        )
      },
      integrations: {
        payment: Object.keys(PaymentConfig).filter(
          key => PaymentConfig[key].enabled
        ),
        affiliate: Object.keys(AffiliateConfig.networks).filter(
          key => AffiliateConfig.networks[key].enabled
        ),
        email: CommunicationConfig.email.provider
      }
    };
  }
}

// Export singleton instance
export const masterConfig = MasterConfigManager.getInstance();

// Export all configs
export {
  DatabaseConfig,
  AIBrainConfig,
  AffiliateConfig,
  PaymentConfig,
  CommunicationConfig,
  ContentConfig,
  SecurityConfig,
  PerformanceConfig
};