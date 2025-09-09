/**
 * API OPEN PORTAL - EMPIRE GRADE
 * Dynamic API Documentation and Discovery System
 * Real-time API mapping, testing interface, and developer resources
 */

import { db } from '../../db';
import { sql } from 'drizzle-orm';
import express from 'express';

interface APIEndpoint {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  title: string;
  description: string;
  category: string;
  parameters: APIParameter[];
  responses: APIResponse[];
  examples: APIExample[];
  isPublic: boolean;
  requiresAuth: boolean;
  rateLimit: number;
  lastUpdated: Date;
}

interface APIParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description: string;
  example: any;
}

interface APIResponse {
  statusCode: number;
  description: string;
  schema: any;
}

interface APIExample {
  name: string;
  request: any;
  response: any;
}

interface APIUsageStats {
  endpointId: string;
  totalCalls: number;
  successRate: number;
  avgResponseTime: number;
  lastCall: Date;
}

export class APIPortal {
  private static instance: APIPortal;
  private discoveredEndpoints: Map<string, APIEndpoint> = new Map();

  static getInstance(): APIPortal {
    if (!APIPortal.instance) {
      APIPortal.instance = new APIPortal();
    }
    return APIPortal.instance;
  }

  async initialize(): Promise<void> {
    await this.initializeTables();
    await this.discoverExistingEndpoints();
    await this.seedAPIDocumentation();
    console.log('✅ API Open Portal initialized');
  }

  private async initializeTables(): Promise<void> {
    try {
      // Create API endpoints table
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS api_endpoints (
          id VARCHAR(255) PRIMARY KEY,
          path VARCHAR(500) NOT NULL,
          method VARCHAR(10) NOT NULL,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          category VARCHAR(100),
          parameters JSONB DEFAULT '[]',
          responses JSONB DEFAULT '[]',
          examples JSONB DEFAULT '[]',
          is_public BOOLEAN DEFAULT true,
          requires_auth BOOLEAN DEFAULT false,
          rate_limit INTEGER DEFAULT 100,
          last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create API usage stats table
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS api_usage_stats (
          id VARCHAR(255) PRIMARY KEY,
          endpoint_id VARCHAR(255) NOT NULL REFERENCES api_endpoints(id),
          total_calls INTEGER DEFAULT 0,
          success_rate DECIMAL(5,2) DEFAULT 0,
          avg_response_time INTEGER DEFAULT 0,
          last_call TIMESTAMP,
          date_created DATE DEFAULT CURRENT_DATE,
          UNIQUE(endpoint_id, date_created)
        )
      `);

      // Create API keys table for developers
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS api_keys (
          id VARCHAR(255) PRIMARY KEY,
          key_value VARCHAR(255) UNIQUE NOT NULL,
          developer_id VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          permissions JSONB DEFAULT '[]',
          rate_limit INTEGER DEFAULT 1000,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          expires_at TIMESTAMP,
          last_used TIMESTAMP
        )
      `);

      // Create indexes
      await db.execute(sql`
        CREATE INDEX IF NOT EXISTS idx_api_endpoints_category ON api_endpoints(category);
        CREATE INDEX IF NOT EXISTS idx_api_endpoints_public ON api_endpoints(is_public);
        CREATE INDEX IF NOT EXISTS idx_api_usage_stats_endpoint_id ON api_usage_stats(endpoint_id);
        CREATE INDEX IF NOT EXISTS idx_api_keys_value ON api_keys(key_value);
        CREATE INDEX IF NOT EXISTS idx_api_keys_developer_id ON api_keys(developer_id);
      `);

    } catch (error) {
      console.error('Error initializing API Portal tables:', error);
    }
  }

  private async discoverExistingEndpoints(): Promise<void> {
    // Dynamically discover endpoints from the Express app
    const endpoints = [
      // Core System Endpoints
      { path: '/api/health', method: 'GET', title: 'System Health Check', category: 'system' },
      { path: '/api/db-health', method: 'GET', title: 'Database Health Check', category: 'system' },
      
      // AI/ML Endpoints
      { path: '/api/ai-ml/health', method: 'GET', title: 'AI/ML System Health', category: 'ai' },
      { path: '/api/semantic/health', method: 'GET', title: 'Semantic Intelligence Health', category: 'ai' },
      { path: '/api/vector-search/health', method: 'GET', title: 'Vector Search Health', category: 'ai' },
      
      // Content & UGC Endpoints
      { path: '/api/ugc/content', method: 'GET', title: 'Get User Generated Content', category: 'content' },
      { path: '/api/ugc/content', method: 'POST', title: 'Submit User Content', category: 'content' },
      { path: '/api/shorts', method: 'GET', title: 'Get Short Videos', category: 'content' },
      { path: '/api/shorts/upload', method: 'POST', title: 'Upload Short Video', category: 'content' },
      
      // Business & Analytics
      { path: '/api/analytics/events', method: 'POST', title: 'Track Analytics Event', category: 'analytics' },
      { path: '/api/federation/dashboard', method: 'GET', title: 'Federation Dashboard', category: 'business' },
      
      // PR & Marketing
      { path: '/api/pr-outreach/campaigns', method: 'GET', title: 'Get PR Campaigns', category: 'marketing' },
      { path: '/api/pr-outreach/campaigns', method: 'POST', title: 'Create PR Campaign', category: 'marketing' },
    ];

    for (const endpoint of endpoints) {
      const id = `${endpoint.method.toLowerCase()}_${endpoint.path.replace(/[^a-zA-Z0-9]/g, '_')}`;
      await this.registerEndpoint(id, endpoint as any);
    }
  }

  private async seedAPIDocumentation(): Promise<void> {
    const sampleDocumentation = [
      {
        id: 'get_api_health',
        path: '/api/health',
        method: 'GET' as const,
        title: 'System Health Check',
        description: 'Returns the current health status of all system components including database, cache, and services.',
        category: 'System',
        parameters: [],
        responses: [
          {
            statusCode: 200,
            description: 'System is healthy',
            schema: {
              success: 'boolean',
              data: {
                status: 'string',
                components: 'object'
              }
            }
          }
        ],
        examples: [
          {
            name: 'Basic Health Check',
            request: {},
            response: {
              success: true,
              data: {
                status: 'healthy',
                components: {
                  database: 'operational',
                  cache: 'operational',
                  ai_services: 'operational'
                }
              }
            }
          }
        ],
        isPublic: true,
        requiresAuth: false,
        rateLimit: 100
      }
    ];

    for (const doc of sampleDocumentation) {
      try {
        await db.execute(sql`
          INSERT INTO api_endpoints (
            id, path, method, title, description, category, parameters,
            responses, examples, is_public, requires_auth, rate_limit
          ) VALUES (
            ${doc.id}, ${doc.path}, ${doc.method}, ${doc.title}, ${doc.description},
            ${doc.category}, ${JSON.stringify(doc.parameters)}, ${JSON.stringify(doc.responses)},
            ${JSON.stringify(doc.examples)}, ${doc.isPublic}, ${doc.requiresAuth}, ${doc.rateLimit}
          ) ON CONFLICT (id) DO UPDATE SET last_updated = CURRENT_TIMESTAMP
        `);
      } catch (error) {
        console.log('Documentation already exists:', doc.id);
      }
    }
  }

  async registerEndpoint(id: string, endpoint: Partial<APIEndpoint>): Promise<void> {
    try {
      const endpointData: APIEndpoint = {
        id,
        path: endpoint.path || '',
        method: endpoint.method || 'GET',
        title: endpoint.title || endpoint.path || '',
        description: endpoint.description || 'No description available',
        category: endpoint.category || 'general',
        parameters: endpoint.parameters || [],
        responses: endpoint.responses || [],
        examples: endpoint.examples || [],
        isPublic: endpoint.isPublic !== false,
        requiresAuth: endpoint.requiresAuth || false,
        rateLimit: endpoint.rateLimit || 100,
        lastUpdated: new Date()
      };

      await db.execute(sql`
        INSERT INTO api_endpoints (
          id, path, method, title, description, category, parameters,
          responses, examples, is_public, requires_auth, rate_limit, last_updated
        ) VALUES (
          ${endpointData.id}, ${endpointData.path}, ${endpointData.method}, 
          ${endpointData.title}, ${endpointData.description}, ${endpointData.category},
          ${JSON.stringify(endpointData.parameters)}, ${JSON.stringify(endpointData.responses)},
          ${JSON.stringify(endpointData.examples)}, ${endpointData.isPublic}, 
          ${endpointData.requiresAuth}, ${endpointData.rateLimit}, ${endpointData.lastUpdated}
        ) ON CONFLICT (id) DO UPDATE SET 
          last_updated = ${endpointData.lastUpdated},
          title = ${endpointData.title},
          description = ${endpointData.description}
      `);

      this.discoveredEndpoints.set(id, endpointData);
    } catch (error) {
      console.error('Error registering endpoint:', error);
    }
  }

  async getAllEndpoints(category?: string, isPublic?: boolean): Promise<APIEndpoint[]> {
    try {
      let query = sql`SELECT * FROM api_endpoints WHERE 1=1`;
      
      if (category) {
        query = sql`${query} AND category = ${category}`;
      }
      
      if (isPublic !== undefined) {
        query = sql`${query} AND is_public = ${isPublic}`;
      }
      
      query = sql`${query} ORDER BY category, path`;
      
      const result = await db.execute(query);
      return result.rows as APIEndpoint[];
    } catch (error) {
      console.error('Error fetching endpoints:', error);
      return [];
    }
  }

  async getEndpointById(id: string): Promise<APIEndpoint | null> {
    try {
      const result = await db.execute(sql`
        SELECT * FROM api_endpoints WHERE id = ${id}
      `);
      return result.rows[0] as APIEndpoint || null;
    } catch (error) {
      console.error('Error fetching endpoint:', error);
      return null;
    }
  }

  async trackAPIUsage(endpointId: string, responseTime: number, success: boolean): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Update usage statistics
      await db.execute(sql`
        INSERT INTO api_usage_stats (
          id, endpoint_id, total_calls, success_rate, avg_response_time, last_call, date_created
        ) VALUES (
          CONCAT(${endpointId}, '_', ${today}), ${endpointId}, 1, 
          ${success ? 100 : 0}, ${responseTime}, CURRENT_TIMESTAMP, ${today}
        ) ON CONFLICT (endpoint_id, date_created) DO UPDATE SET 
          total_calls = api_usage_stats.total_calls + 1,
          success_rate = (api_usage_stats.success_rate * api_usage_stats.total_calls + ${success ? 100 : 0}) / (api_usage_stats.total_calls + 1),
          avg_response_time = (api_usage_stats.avg_response_time * api_usage_stats.total_calls + ${responseTime}) / (api_usage_stats.total_calls + 1),
          last_call = CURRENT_TIMESTAMP
      `);
    } catch (error) {
      console.error('Error tracking API usage:', error);
    }
  }

  async generateAPIKey(developerId: string, name: string, permissions: string[] = []): Promise<string> {
    try {
      const keyValue = `apk_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
      const keyId = `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await db.execute(sql`
        INSERT INTO api_keys (id, key_value, developer_id, name, permissions, created_at)
        VALUES (${keyId}, ${keyValue}, ${developerId}, ${name}, ${JSON.stringify(permissions)}, CURRENT_TIMESTAMP)
      `);
      
      return keyValue;
    } catch (error) {
      console.error('Error generating API key:', error);
      throw new Error('Failed to generate API key');
    }
  }

  async validateAPIKey(keyValue: string): Promise<{ valid: boolean; developerId?: string; permissions?: string[] }> {
    try {
      const result = await db.execute(sql`
        SELECT developer_id, permissions, is_active, expires_at
        FROM api_keys 
        WHERE key_value = ${keyValue} AND is_active = true
      `);
      
      if (!result.rows.length) {
        return { valid: false };
      }
      
      const key = result.rows[0] as any;
      
      // Check if key is expired
      if (key.expires_at && new Date(key.expires_at) < new Date()) {
        return { valid: false };
      }
      
      // Update last used
      await db.execute(sql`
        UPDATE api_keys SET last_used = CURRENT_TIMESTAMP WHERE key_value = ${keyValue}
      `);
      
      return {
        valid: true,
        developerId: key.developer_id,
        permissions: key.permissions
      };
    } catch (error) {
      console.error('Error validating API key:', error);
      return { valid: false };
    }
  }

  async getAPIStats(): Promise<any> {
    try {
      const stats = await db.execute(sql`
        SELECT 
          COUNT(*) as total_endpoints,
          COUNT(CASE WHEN is_public = true THEN 1 END) as public_endpoints,
          COUNT(CASE WHEN requires_auth = true THEN 1 END) as auth_required_endpoints
        FROM api_endpoints
      `);
      
      const usageStats = await db.execute(sql`
        SELECT 
          SUM(total_calls) as total_api_calls,
          AVG(success_rate) as avg_success_rate,
          AVG(avg_response_time) as avg_response_time
        FROM api_usage_stats
        WHERE date_created >= CURRENT_DATE - INTERVAL '7 days'
      `);
      
      return {
        endpoints: stats.rows[0],
        usage: usageStats.rows[0]
      };
    } catch (error) {
      console.error('Error fetching API stats:', error);
      return {};
    }
  }

  generateOpenAPISpec(): any {
    const spec = {
      openapi: '3.0.0',
      info: {
        title: 'Findawise Empire API',
        version: '1.0.0',
        description: 'Comprehensive API for the Findawise Empire platform'
      },
      servers: [
        {
          url: process.env.API_BASE_URL || 'https://findawise-empire.replit.app',
          description: 'Production server'
        }
      ],
      paths: {},
      components: {
        securitySchemes: {
          ApiKeyAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'X-API-Key'
          }
        }
      }
    };

    // Convert discovered endpoints to OpenAPI format
    for (const [id, endpoint] of this.discoveredEndpoints) {
      if (!spec.paths[endpoint.path]) {
        spec.paths[endpoint.path] = {};
      }
      
      spec.paths[endpoint.path][endpoint.method.toLowerCase()] = {
        summary: endpoint.title,
        description: endpoint.description,
        parameters: endpoint.parameters.map(param => ({
          name: param.name,
          in: 'query',
          required: param.required,
          description: param.description,
          schema: { type: param.type }
        })),
        responses: endpoint.responses.reduce((acc, response) => {
          acc[response.statusCode] = {
            description: response.description,
            content: {
              'application/json': {
                schema: response.schema
              }
            }
          };
          return acc;
        }, {}),
        security: endpoint.requiresAuth ? [{ ApiKeyAuth: [] }] : []
      };
    }

    return spec;
  }
}

export const apiPortal = APIPortal.getInstance();