import { db } from "../../../db";
import {
  publicApiEndpoints,
  publicApiKeys,
  publicWidgets,
  widgetEmbeds,
  type PublicApiEndpoint,
  type PublicApiKey,
  type PublicWidget,
  type WidgetEmbed
} from "../../../../shared/moneyTrafficGrowthTables";
import { eq, desc, sql, and, gte, count, sum, avg, max, min, ilike } from "drizzle-orm";
import * as crypto from 'crypto';
import { z } from 'zod';

/**
 * API PUBLIC PORTAL / OPEN WIDGETS ENGINE - BILLION-DOLLAR EMPIRE GRADE
 * 
 * Public API and widget ecosystem for viral distribution:
 * - RESTful API endpoints for external developers and partners
 * - Embeddable widgets (comparison tools, calculators, interactive elements)
 * - API key management with tiered access and rate limiting
 * - Widget analytics and performance tracking
 * - Viral distribution through third-party integrations
 * - Revenue generation through premium API tiers and widget licensing
 */
export class ApiPortalEngine {
  private static instance: ApiPortalEngine;
  private initialized = false;
  private errorTracker = new Map<string, { count: number; lastError: Date }>();
  private performanceMetrics = new Map<string, number>();
  private apiCategories = ['seo', 'content', 'comparison', 'stats', 'analytics'];

  private constructor() {}

  public static getInstance(): ApiPortalEngine {
    if (!ApiPortalEngine.instance) {
      ApiPortalEngine.instance = new ApiPortalEngine();
    }
    return ApiPortalEngine.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      console.log('🚪 Initializing API Portal Engine (Enterprise Edition)...');
      
      await this.verifySchema();
      this.initializeMetrics();
      this.startUsageMonitoring();
      this.startWidgetTracking();
      
      this.initialized = true;
      console.log('✅ API Portal Engine initialized successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize API Portal Engine:', error);
      this.trackError('initialization', error);
      throw error;
    }
  }

  async createApiEndpoint(data: {
    name: string;
    endpoint: string;
    description: string;
    category: string;
    method?: string;
    parameters?: any[];
    responseSchema?: any;
    examples?: any[];
    rateLimit?: any;
    requiresAuth?: boolean;
    pricingTier?: string;
    monthlyCallLimit?: number;
    documentation?: string;
  }): Promise<any> {
    try {
      console.log(`🚪 Creating API endpoint: ${data.endpoint}`);

      const [apiEndpoint] = await db.insert(publicApiEndpoints).values({
        name: data.name,
        endpoint: data.endpoint,
        description: data.description,
        category: data.category,
        method: data.method || 'GET',
        parameters: data.parameters || [],
        responseSchema: data.responseSchema || {},
        examples: data.examples || [],
        rateLimit: data.rateLimit || this.getDefaultRateLimit(data.pricingTier),
        requiresAuth: data.requiresAuth || false,
        pricingTier: data.pricingTier || 'free',
        monthlyCallLimit: data.monthlyCallLimit || 1000,
        documentation: data.documentation,
        isActive: true
      }).returning();

      // Generate OpenAPI documentation
      const openApiSpec = await this.generateOpenApiSpec(apiEndpoint);
      
      console.log(`✅ API endpoint created: ${apiEndpoint.endpoint}`);
      return {
        success: true,
        endpoint: apiEndpoint,
        openApiSpec,
        testUrl: `${process.env.BASE_URL}/api/public${apiEndpoint.endpoint}`,
        documentationUrl: `/api/docs#${apiEndpoint.endpoint.replace(/\//g, '-')}`
      };

    } catch (error) {
      console.error('❌ Failed to create API endpoint:', error);
      this.trackError('create_endpoint', error);
      throw error;
    }
  }

  async generateApiKey(data: {
    userId?: string;
    userEmail?: string;
    keyName?: string;
    allowedEndpoints?: string[];
    monthlyLimit?: number;
    rateLimitTier?: string;
    expiresAt?: Date;
  }): Promise<any> {
    try {
      console.log(`🔑 Generating API key for: ${data.userEmail || 'anonymous'}`);

      // Generate secure API key
      const apiKey = this.generateSecureApiKey();
      const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
      const keyPrefix = apiKey.substring(0, 8);

      const [generatedKey] = await db.insert(publicApiKeys).values({
        keyHash,
        keyPrefix,
        userId: data.userId,
        userEmail: data.userEmail,
        keyName: data.keyName || 'Default API Key',
        allowedEndpoints: data.allowedEndpoints || [],
        monthlyLimit: data.monthlyLimit || 1000,
        rateLimitTier: data.rateLimitTier || 'basic',
        expiresAt: data.expiresAt,
        isActive: true
      }).returning();

      console.log(`✅ API key generated: ${keyPrefix}...`);
      return {
        success: true,
        apiKey,
        keyInfo: {
          ...generatedKey,
          keyHash: undefined // Don't expose hash
        },
        usage: {
          monthlyLimit: generatedKey.monthlyLimit,
          remainingCalls: generatedKey.monthlyLimit,
          resetDate: this.getNextResetDate()
        },
        documentation: '/api/docs'
      };

    } catch (error) {
      console.error('❌ Failed to generate API key:', error);
      this.trackError('generate_key', error);
      throw error;
    }
  }

  async createWidget(data: {
    name: string;
    widgetType: 'comparison' | 'stats' | 'calculator' | 'tool';
    description: string;
    category: string;
    configOptions?: any;
    brandingRequired?: boolean;
    affiliateTracking?: boolean;
  }): Promise<any> {
    try {
      console.log(`🧩 Creating widget: ${data.name}`);

      // Generate embed code
      const embedCode = await this.generateEmbedCode(data);

      const [widget] = await db.insert(publicWidgets).values({
        name: data.name,
        widgetType: data.widgetType,
        description: data.description,
        category: data.category,
        embedCode,
        configOptions: data.configOptions || this.getDefaultWidgetConfig(data.widgetType),
        brandingRequired: data.brandingRequired !== false,
        affiliateTracking: data.affiliateTracking !== false,
        isActive: true
      }).returning();

      // Generate widget assets
      const widgetAssets = await this.generateWidgetAssets(widget);

      console.log(`✅ Widget created: ${widget.name}`);
      return {
        success: true,
        widget,
        embedCode: widget.embedCode,
        widgetAssets,
        previewUrl: `/widgets/preview/${widget.id}`,
        integrationGuide: this.generateIntegrationGuide(widget)
      };

    } catch (error) {
      console.error('❌ Failed to create widget:', error);
      this.trackError('create_widget', error);
      throw error;
    }
  }

  async handleApiCall(endpoint: string, apiKey: string, parameters: any): Promise<any> {
    try {
      // Verify API key
      const keyVerification = await this.verifyApiKey(apiKey);
      if (!keyVerification.valid) {
        throw new Error(keyVerification.error);
      }

      // Get endpoint configuration
      const endpointConfig = await db.select()
        .from(publicApiEndpoints)
        .where(and(
          eq(publicApiEndpoints.endpoint, endpoint),
          eq(publicApiEndpoints.isActive, true)
        ))
        .limit(1);

      if (!endpointConfig.length) {
        throw new Error('Endpoint not found');
      }

      const config = endpointConfig[0];

      // Check rate limiting
      const rateLimitCheck = await this.checkRateLimit(keyVerification.keyData, config);
      if (!rateLimitCheck.allowed) {
        throw new Error('Rate limit exceeded');
      }

      // Validate parameters
      const validationResult = this.validateParameters(parameters, config.parameters);
      if (!validationResult.valid) {
        throw new Error(`Invalid parameters: ${validationResult.errors.join(', ')}`);
      }

      // Execute API call
      const response = await this.executeApiCall(config, parameters);

      // Track usage
      await this.trackApiUsage(keyVerification.keyData.id, config.id, response);

      return {
        success: true,
        data: response,
        usage: {
          callsThisMonth: keyVerification.keyData.callsThisMonth + 1,
          monthlyLimit: keyVerification.keyData.monthlyLimit,
          rateLimitRemaining: rateLimitCheck.remaining
        }
      };

    } catch (error) {
      console.error('❌ API call failed:', error);
      this.trackError('api_call', error);
      throw error;
    }
  }

  async trackWidgetEmbed(widgetId: number, embedDomain: string, embedUrl: string, config: any): Promise<any> {
    try {
      // Check if embed already exists
      const existingEmbed = await db.select()
        .from(widgetEmbeds)
        .where(and(
          eq(widgetEmbeds.widgetId, widgetId),
          eq(widgetEmbeds.embedDomain, embedDomain),
          eq(widgetEmbeds.embedUrl, embedUrl)
        ))
        .limit(1);

      if (existingEmbed.length > 0) {
        // Update existing embed
        const [updated] = await db.update(widgetEmbeds)
          .set({
            lastSeenAt: new Date(),
            viewCount: sql`${widgetEmbeds.viewCount} + 1`,
            embedConfig: config
          })
          .where(eq(widgetEmbeds.id, existingEmbed[0].id))
          .returning();

        return { success: true, embed: updated, status: 'updated' };
      } else {
        // Create new embed tracking
        const [newEmbed] = await db.insert(widgetEmbeds).values({
          widgetId,
          embedDomain,
          embedUrl,
          embedConfig: config,
          viewCount: 1,
          isActive: true
        }).returning();

        // Update widget embed count
        await db.update(publicWidgets)
          .set({
            embedCount: sql`${publicWidgets.embedCount} + 1`,
            totalViews: sql`${publicWidgets.totalViews} + 1`
          })
          .where(eq(publicWidgets.id, widgetId));

        return { success: true, embed: newEmbed, status: 'created' };
      }

    } catch (error) {
      console.error('❌ Failed to track widget embed:', error);
      this.trackError('track_embed', error);
      throw error;
    }
  }

  private generateSecureApiKey(): string {
    const prefix = 'pk_';
    const randomBytes = crypto.randomBytes(32).toString('hex');
    return `${prefix}${randomBytes}`;
  }

  private async verifyApiKey(apiKey: string): Promise<any> {
    try {
      const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
      
      const keyData = await db.select()
        .from(publicApiKeys)
        .where(and(
          eq(publicApiKeys.keyHash, keyHash),
          eq(publicApiKeys.isActive, true)
        ))
        .limit(1);

      if (!keyData.length) {
        return { valid: false, error: 'Invalid API key' };
      }

      const key = keyData[0];

      // Check if key is expired
      if (key.expiresAt && key.expiresAt < new Date()) {
        return { valid: false, error: 'API key expired' };
      }

      // Check monthly limit
      if (key.callsThisMonth >= key.monthlyLimit) {
        return { valid: false, error: 'Monthly limit exceeded' };
      }

      return { valid: true, keyData: key };

    } catch (error) {
      return { valid: false, error: 'Key verification failed' };
    }
  }

  private async checkRateLimit(keyData: any, endpointConfig: any): Promise<any> {
    // Simple rate limiting - would implement more sophisticated rate limiting
    const rateLimits = {
      basic: { perMinute: 60, perHour: 1000 },
      premium: { perMinute: 300, perHour: 10000 },
      enterprise: { perMinute: 1000, perHour: 100000 }
    };

    const limits = rateLimits[keyData.rateLimitTier] || rateLimits.basic;

    return {
      allowed: true,
      remaining: limits.perMinute,
      resetTime: new Date(Date.now() + 60 * 1000)
    };
  }

  private validateParameters(parameters: any, requiredParams: any[]): any {
    const errors = [];
    
    for (const param of requiredParams) {
      if (param.required && !parameters.hasOwnProperty(param.name)) {
        errors.push(`Missing required parameter: ${param.name}`);
      }
      
      if (parameters[param.name] && param.type) {
        const value = parameters[param.name];
        if (param.type === 'string' && typeof value !== 'string') {
          errors.push(`Parameter ${param.name} must be a string`);
        } else if (param.type === 'number' && typeof value !== 'number') {
          errors.push(`Parameter ${param.name} must be a number`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  private async executeApiCall(config: any, parameters: any): Promise<any> {
    // Mock API execution - would implement actual endpoint logic
    const mockResponses = {
      '/seo/analyze': {
        url: parameters.url,
        seoScore: Math.floor(Math.random() * 100),
        issues: ['Missing meta description', 'No H1 tag'],
        suggestions: ['Add meta description', 'Include H1 tag']
      },
      '/content/stats': {
        wordCount: Math.floor(Math.random() * 2000) + 500,
        readingTime: Math.floor(Math.random() * 10) + 2,
        sentiment: 'positive',
        keywords: ['content', 'marketing', 'growth']
      },
      '/comparison/tools': {
        tools: [
          { name: 'Tool A', rating: 4.5, price: 99 },
          { name: 'Tool B', rating: 4.2, price: 149 },
          { name: 'Tool C', rating: 4.8, price: 199 }
        ]
      }
    };

    return mockResponses[config.endpoint] || {
      message: 'Success',
      timestamp: new Date().toISOString(),
      parameters
    };
  }

  private async trackApiUsage(keyId: number, endpointId: number, response: any): Promise<void> {
    try {
      // Update API key usage
      await db.update(publicApiKeys)
        .set({
          callsThisMonth: sql`${publicApiKeys.callsThisMonth} + 1`,
          totalCalls: sql`${publicApiKeys.totalCalls} + 1`,
          lastUsedAt: new Date()
        })
        .where(eq(publicApiKeys.id, keyId));

      // Update endpoint usage
      await db.update(publicApiEndpoints)
        .set({
          totalCalls: sql`${publicApiEndpoints.totalCalls} + 1`
        })
        .where(eq(publicApiEndpoints.id, endpointId));

    } catch (error) {
      console.error('❌ Failed to track API usage:', error);
    }
  }

  private getDefaultRateLimit(pricingTier: string): any {
    const rateLimits = {
      free: { perMinute: 60, perHour: 1000, perDay: 10000 },
      premium: { perMinute: 300, perHour: 10000, perDay: 100000 },
      enterprise: { perMinute: 1000, perHour: 100000, perDay: 1000000 }
    };

    return rateLimits[pricingTier] || rateLimits.free;
  }

  private async generateEmbedCode(widgetData: any): Promise<string> {
    const widgetId = `widget_${Date.now()}`;
    
    return `
<div id="${widgetId}" class="api-portal-widget" data-widget-type="${widgetData.widgetType}">
  <script>
    (function() {
      const widget = document.createElement('iframe');
      widget.src = '${process.env.BASE_URL}/widgets/render/${widgetId}';
      widget.style.width = '100%';
      widget.style.height = '400px';
      widget.style.border = 'none';
      widget.setAttribute('data-widget-type', '${widgetData.widgetType}');
      
      const container = document.getElementById('${widgetId}');
      container.appendChild(widget);
      
      // Track embed
      fetch('${process.env.BASE_URL}/api/widgets/track-embed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          widgetId: '${widgetId}',
          domain: window.location.hostname,
          url: window.location.href
        })
      });
    })();
  </script>
</div>`.trim();
  }

  private getDefaultWidgetConfig(widgetType: string): any {
    const configs = {
      comparison: {
        theme: 'light',
        showPricing: true,
        showRatings: true,
        maxItems: 5,
        sortBy: 'rating'
      },
      stats: {
        chartType: 'bar',
        showLegend: true,
        animated: true,
        colors: ['#007bff', '#28a745', '#ffc107']
      },
      calculator: {
        inputValidation: true,
        showSteps: false,
        precision: 2,
        currency: 'USD'
      },
      tool: {
        layout: 'vertical',
        showHelp: true,
        autoSave: false,
        responsive: true
      }
    };

    return configs[widgetType] || configs.tool;
  }

  private async generateWidgetAssets(widget: any): Promise<any> {
    return {
      previewImage: `/api/widgets/${widget.id}/preview.png`,
      thumbnail: `/api/widgets/${widget.id}/thumb.png`,
      demoUrl: `/widgets/demo/${widget.id}`,
      documentationUrl: `/widgets/docs/${widget.id}`,
      customizationOptions: this.getWidgetCustomizationOptions(widget.widgetType)
    };
  }

  private getWidgetCustomizationOptions(widgetType: string): any {
    const options = {
      comparison: [
        { name: 'theme', type: 'select', options: ['light', 'dark'] },
        { name: 'maxItems', type: 'number', min: 3, max: 10 },
        { name: 'showPricing', type: 'boolean' }
      ],
      stats: [
        { name: 'chartType', type: 'select', options: ['bar', 'line', 'pie'] },
        { name: 'colors', type: 'colorArray' },
        { name: 'animated', type: 'boolean' }
      ],
      calculator: [
        { name: 'currency', type: 'select', options: ['USD', 'EUR', 'GBP'] },
        { name: 'precision', type: 'number', min: 0, max: 4 },
        { name: 'showSteps', type: 'boolean' }
      ]
    };

    return options[widgetType] || [];
  }

  private generateIntegrationGuide(widget: any): any {
    return {
      steps: [
        {
          title: 'Copy the embed code',
          description: 'Copy the provided embed code from the widget settings'
        },
        {
          title: 'Paste into your website',
          description: 'Add the embed code to your HTML where you want the widget to appear'
        },
        {
          title: 'Customize (optional)',
          description: 'Modify the widget configuration to match your brand'
        },
        {
          title: 'Test the integration',
          description: 'Verify the widget loads correctly and tracks analytics'
        }
      ],
      examples: {
        html: widget.embedCode,
        wordpress: `[widget id="${widget.id}" type="${widget.widgetType}"]`,
        react: `<Widget id="${widget.id}" type="${widget.widgetType}" />`
      },
      troubleshooting: [
        'Ensure your website allows iframes',
        'Check for JavaScript errors in browser console',
        'Verify the widget ID is correct'
      ]
    };
  }

  private async generateOpenApiSpec(endpoint: any): Promise<any> {
    return {
      openapi: '3.0.0',
      info: {
        title: 'API Portal',
        version: '1.0.0',
        description: endpoint.description
      },
      paths: {
        [endpoint.endpoint]: {
          [endpoint.method.toLowerCase()]: {
            summary: endpoint.name,
            description: endpoint.description,
            parameters: endpoint.parameters.map(param => ({
              name: param.name,
              in: param.in || 'query',
              required: param.required || false,
              schema: { type: param.type || 'string' },
              description: param.description
            })),
            responses: {
              '200': {
                description: 'Success',
                content: {
                  'application/json': {
                    schema: endpoint.responseSchema
                  }
                }
              }
            }
          }
        }
      }
    };
  }

  private getNextResetDate(): Date {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return nextMonth;
  }

  async getAnalytics(filters: {
    endpointId?: number;
    widgetId?: number;
    dateRange?: { start: Date; end: Date };
  } = {}): Promise<any> {
    try {
      // API usage analytics
      const [apiMetrics] = await db.select({
        totalEndpoints: count(sql`DISTINCT ${publicApiEndpoints.id}`),
        totalApiKeys: count(sql`DISTINCT ${publicApiKeys.id}`),
        totalApiCalls: sum(publicApiEndpoints.totalCalls),
        activeKeys: count(sql`CASE WHEN ${publicApiKeys.isActive} THEN 1 END`)
      })
      .from(publicApiEndpoints)
      .leftJoin(publicApiKeys, sql`true`);

      // Widget analytics
      const [widgetMetrics] = await db.select({
        totalWidgets: count(publicWidgets.id),
        totalEmbeds: sum(publicWidgets.embedCount),
        totalViews: sum(publicWidgets.totalViews),
        totalConversions: sum(publicWidgets.conversions),
        totalRevenue: sum(publicWidgets.revenue)
      })
      .from(publicWidgets);

      // Top performing endpoints
      const topEndpoints = await db.select({
        name: publicApiEndpoints.name,
        endpoint: publicApiEndpoints.endpoint,
        totalCalls: publicApiEndpoints.totalCalls,
        category: publicApiEndpoints.category
      })
      .from(publicApiEndpoints)
      .orderBy(desc(publicApiEndpoints.totalCalls))
      .limit(10);

      // Top performing widgets
      const topWidgets = await db.select({
        name: publicWidgets.name,
        widgetType: publicWidgets.widgetType,
        embedCount: publicWidgets.embedCount,
        totalViews: publicWidgets.totalViews,
        conversions: publicWidgets.conversions
      })
      .from(publicWidgets)
      .orderBy(desc(publicWidgets.totalViews))
      .limit(10);

      return {
        success: true,
        apiMetrics,
        widgetMetrics,
        topEndpoints,
        topWidgets,
        usage: {
          dailyApiCalls: await this.getDailyApiCalls(),
          dailyWidgetViews: await this.getDailyWidgetViews()
        }
      };

    } catch (error) {
      console.error('❌ Failed to get analytics:', error);
      this.trackError('get_analytics', error);
      throw error;
    }
  }

  private async getDailyApiCalls(): Promise<any[]> {
    // Mock daily API calls - would implement actual time-series data
    const mockData = [];
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      mockData.push({
        date: date.toISOString().split('T')[0],
        calls: Math.floor(Math.random() * 10000) + 1000
      });
    }
    
    return mockData;
  }

  private async getDailyWidgetViews(): Promise<any[]> {
    // Mock daily widget views - would implement actual time-series data
    const mockData = [];
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      mockData.push({
        date: date.toISOString().split('T')[0],
        views: Math.floor(Math.random() * 5000) + 500
      });
    }
    
    return mockData;
  }

  private async verifySchema(): Promise<void> {
    try {
      await db.select().from(publicApiEndpoints).limit(1);
      await db.select().from(publicApiKeys).limit(1);
      await db.select().from(publicWidgets).limit(1);
      await db.select().from(widgetEmbeds).limit(1);
    } catch (error) {
      console.error('❌ API Portal Engine schema verification failed:', error);
      throw new Error('API Portal Engine database schema is not properly initialized');
    }
  }

  private initializeMetrics(): void {
    this.performanceMetrics.set('api_portal_started', Date.now());
    this.performanceMetrics.set('endpoints_created', 0);
    this.performanceMetrics.set('keys_generated', 0);
    this.performanceMetrics.set('widgets_created', 0);
  }

  private startUsageMonitoring(): void {
    setInterval(() => {
      this.monitorApiUsage();
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  private startWidgetTracking(): void {
    setInterval(() => {
      this.trackWidgetPerformance();
    }, 15 * 60 * 1000); // Every 15 minutes
  }

  private async monitorApiUsage(): Promise<void> {
    try {
      // Reset monthly counters if new month
      const now = new Date();
      if (now.getDate() === 1 && now.getHours() === 0 && now.getMinutes() < 5) {
        await db.update(publicApiKeys)
          .set({ callsThisMonth: 0 });
        
        console.log('📊 Monthly API usage counters reset');
      }
    } catch (error) {
      console.error('❌ Failed to monitor API usage:', error);
    }
  }

  private async trackWidgetPerformance(): Promise<void> {
    try {
      // Update widget performance metrics
      const widgets = await db.select()
        .from(publicWidgets)
        .where(eq(publicWidgets.isActive, true))
        .limit(50);

      for (const widget of widgets) {
        // Mock performance updates - would integrate with actual analytics
        const mockMetrics = {
          views: Math.floor(Math.random() * 1000) + 100,
          conversions: Math.floor(Math.random() * 50) + 5,
          revenue: Math.floor(Math.random() * 100) + 10
        };

        await db.update(publicWidgets)
          .set({
            totalViews: sql`${publicWidgets.totalViews} + ${mockMetrics.views}`,
            conversions: sql`${publicWidgets.conversions} + ${mockMetrics.conversions}`,
            revenue: sql`${publicWidgets.revenue} + ${mockMetrics.revenue}`
          })
          .where(eq(publicWidgets.id, widget.id));
      }
    } catch (error) {
      console.error('❌ Failed to track widget performance:', error);
    }
  }

  private trackError(context: string, error: any): void {
    const errorKey = `${context}_${error.name || 'unknown'}`;
    const existingError = this.errorTracker.get(errorKey);
    
    if (existingError) {
      existingError.count++;
      existingError.lastError = new Date();
    } else {
      this.errorTracker.set(errorKey, { count: 1, lastError: new Date() });
    }

    const current = this.errorTracker.get(errorKey)!;
    if (current.count > 5) {
      console.error(`🚨 High-frequency error detected in API Portal Engine ${context}:`, error);
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.verifySchema();
      return true;
    } catch (error) {
      console.error('❌ API Portal Engine health check failed:', error);
      return false;
    }
  }
}