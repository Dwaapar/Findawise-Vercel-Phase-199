import { db } from "../../db";
import {
  dataVizTemplates,
  dataVizGraphics,
  dataVizAnalytics,
  type InsertDataVizTemplate,
  type InsertDataVizGraphic,
  type InsertDataVizAnalytics
} from "../../../shared/trafficGeneratorTables";
import { eq, desc, sql, and, gte, count, sum, avg } from "drizzle-orm";
import { z } from 'zod';

/**
 * VIRAL DATA VISUALIZATION ENGINE - BILLION-DOLLAR EMPIRE GRADE
 * 
 * Auto-generates sharable infographics, charts, data stories with:
 * - Real-time data from APIs (stocks, crypto, weather, trends)
 * - Auto-updates daily/weekly with latest stats
 * - Social media optimization (Instagram, Twitter, LinkedIn formats)
 * - Viral hooks: "Did you know?" facts, comparisons, predictions
 * - SEO-optimized landing pages for each visualization
 * - Analytics tracking on shares, views, engagement
 */
export class ViralDataVizEngine {
  private static instance: ViralDataVizEngine;
  private initialized = false;
  private errorTracker = new Map<string, { count: number; lastError: Date }>();
  private performanceMetrics = new Map<string, number>();
  private dataProviders = new Map<string, any>();
  private renderQueue: Array<any> = [];

  private constructor() {}

  public static getInstance(): ViralDataVizEngine {
    if (!ViralDataVizEngine.instance) {
      ViralDataVizEngine.instance = new ViralDataVizEngine();
    }
    return ViralDataVizEngine.instance;
  }

  /**
   * Initialize the Viral Data Visualization Engine
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      console.log('📊 Initializing Viral Data Visualization Engine (Enterprise Edition)...');
      
      // Verify database tables exist
      await this.verifySchema();
      
      // Initialize default templates
      await this.initializeDefaultTemplates();
      
      // Initialize performance monitoring
      this.initializeMetrics();
      
      // Initialize data providers
      this.initializeDataProviders();
      
      // Start automated visualization generation
      this.startAutomatedGeneration();
      
      // Start social media optimization
      this.startSocialMediaOptimization();
      
      this.initialized = true;
      console.log('✅ Viral Data Visualization Engine initialized successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize Viral Data Viz Engine:', error);
      this.trackError('initialization', error);
      throw error;
    }
  }

  /**
   * Create visualization template with viral optimization
   */
  async createTemplate(config: {
    name: string;
    description?: string;
    type: 'chart' | 'infographic' | 'comparison' | 'timeline' | 'map';
    category: string;
    dataSource: string;
    updateFrequency: 'real-time' | 'hourly' | 'daily' | 'weekly';
    socialFormats: Array<'instagram' | 'twitter' | 'linkedin' | 'facebook'>;
    viralHooks?: string[];
    chartConfig?: any;
    designConfig?: any;
  }): Promise<any> {
    try {
      const template = await db.insert(dataVizTemplates).values({
        name: config.name,
        description: config.description,
        type: config.type,
        category: config.category,
        dataSource: config.dataSource,
        updateFrequency: config.updateFrequency,
        socialFormats: config.socialFormats,
        viralHooks: config.viralHooks || [],
        chartConfig: config.chartConfig || this.getDefaultChartConfig(config.type),
        designConfig: config.designConfig || this.getDefaultDesignConfig(),
        isActive: true,
        seoOptimized: true
      }).returning();

      console.log(`📊 Created visualization template: ${config.name} (${config.type})`);
      return template[0];
    } catch (error) {
      this.trackError('createTemplate', error);
      throw error;
    }
  }

  /**
   * Generate viral data visualization from template
   */
  async generateVisualization(config: {
    templateId: number;
    title?: string;
    customData?: any;
    viralHook?: string;
    scheduledAt?: Date;
    autoPost?: boolean;
  }): Promise<any> {
    try {
      // Get template
      const template = await db.select().from(dataVizTemplates)
        .where(eq(dataVizTemplates.id, config.templateId))
        .limit(1);

      if (!template.length) {
        throw new Error('Template not found');
      }

      // Fetch fresh data
      const freshData = config.customData || await this.fetchData(template[0].dataSource);
      
      // Generate viral title and hook
      const viralContent = await this.generateViralContent({
        template: template[0],
        data: freshData,
        customHook: config.viralHook
      });

      // Create visualization record
      const visualization = await db.insert(dataVizGraphics).values({
        templateId: config.templateId,
        title: config.title || viralContent.title,
        description: viralContent.description,
        viralHook: viralContent.hook,
        dataSnapshot: freshData,
        renderStatus: 'pending',
        socialFormats: template[0].socialFormats,
        scheduledAt: config.scheduledAt,
        autoPost: config.autoPost || false,
        seoTitle: viralContent.seoTitle,
        seoDescription: viralContent.seoDescription,
        hashtags: viralContent.hashtags
      }).returning();

      // Queue for rendering
      this.queueForRendering(visualization[0]);

      console.log(`🎨 Generated visualization: ${viralContent.title}`);
      return visualization[0];
    } catch (error) {
      this.trackError('generateVisualization', error);
      throw error;
    }
  }

  /**
   * Render visualization graphics for all social formats
   */
  async renderVisualization(vizId: number): Promise<{ success: boolean; assets: any[] }> {
    try {
      // Get visualization details
      const viz = await db.select().from(dataVizGraphics)
        .where(eq(dataVizGraphics.id, vizId))
        .limit(1);

      if (!viz.length) {
        throw new Error('Visualization not found');
      }

      const assets = [];

      // Render for each social format
      for (const format of viz[0].socialFormats) {
        try {
          const asset = await this.renderForFormat(viz[0], format);
          assets.push(asset);
        } catch (error) {
          console.error(`Failed to render ${format} format:`, error);
        }
      }

      // Update visualization status
      await db.update(dataVizGraphics)
        .set({
          renderStatus: assets.length > 0 ? 'completed' : 'failed',
          renderedAt: new Date(),
          assetUrls: assets.map(a => a.url)
        })
        .where(eq(dataVizGraphics.id, vizId));

      console.log(`🖼️ Rendered ${assets.length} assets for visualization ${vizId}`);
      return { success: assets.length > 0, assets };
    } catch (error) {
      this.trackError('renderVisualization', error);
      throw error;
    }
  }

  /**
   * Auto-post to social media platforms
   */
  async autoPostToSocial(vizId: number, platforms?: string[]): Promise<{ posted: number; failed: number }> {
    try {
      // Get visualization with assets
      const viz = await db.select().from(dataVizGraphics)
        .where(eq(dataVizGraphics.id, vizId))
        .limit(1);

      if (!viz.length || !viz[0].assetUrls || viz[0].assetUrls.length === 0) {
        throw new Error('Visualization not ready for posting');
      }

      let posted = 0;
      let failed = 0;
      const targetPlatforms = platforms || viz[0].socialFormats;

      for (const platform of targetPlatforms) {
        try {
          await this.postToSocialPlatform({
            platform,
            visualization: viz[0],
            assetUrl: this.getAssetForPlatform(viz[0].assetUrls, platform)
          });
          posted++;
        } catch (error) {
          console.error(`Failed to post to ${platform}:`, error);
          failed++;
        }
      }

      // Update social posting status
      await db.update(dataVizGraphics)
        .set({
          socialPosted: posted > 0,
          socialPostedAt: posted > 0 ? new Date() : undefined
        })
        .where(eq(dataVizGraphics.id, vizId));

      console.log(`📱 Social posting complete: ${posted} posted, ${failed} failed`);
      return { posted, failed };
    } catch (error) {
      this.trackError('autoPostToSocial', error);
      throw error;
    }
  }

  /**
   * Track visualization analytics and engagement
   */
  async trackEngagement(vizId: number, event: {
    type: 'view' | 'share' | 'click' | 'download';
    platform?: string;
    source?: string;
    userAgent?: string;
    ipAddress?: string;
    referrer?: string;
  }): Promise<void> {
    try {
      await db.insert(dataVizAnalytics).values({
        vizId,
        event: event.type,
        platform: event.platform,
        source: event.source,
        userAgent: event.userAgent,
        ipAddress: event.ipAddress,
        referrer: event.referrer,
        timestamp: new Date()
      });

      // Update visualization engagement metrics
      const field = `${event.type}Count` as keyof typeof dataVizGraphics;
      if (field in dataVizGraphics) {
        await db.update(dataVizGraphics)
          .set({ [field]: sql`${dataVizGraphics[field]} + 1` })
          .where(eq(dataVizGraphics.id, vizId));
      }

      this.performanceMetrics.set('total_engagements', 
        (this.performanceMetrics.get('total_engagements') || 0) + 1);
    } catch (error) {
      this.trackError('trackEngagement', error);
    }
  }

  /**
   * Get trending visualizations and analytics
   */
  async getTrendingVisualizations(timeframe: string = '7d', limit: number = 10): Promise<any> {
    try {
      const days = this.parseTimeframe(timeframe);
      const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      const trending = await db.select({
        id: dataVizGraphics.id,
        title: dataVizGraphics.title,
        viralHook: dataVizGraphics.viralHook,
        viewCount: dataVizGraphics.viewCount,
        shareCount: dataVizGraphics.shareCount,
        clickCount: dataVizGraphics.clickCount,
        engagementScore: sql`${dataVizGraphics.viewCount} + ${dataVizGraphics.shareCount} * 3 + ${dataVizGraphics.clickCount} * 2`,
        createdAt: dataVizGraphics.createdAt
      }).from(dataVizGraphics)
      .where(gte(dataVizGraphics.createdAt, cutoffDate))
      .orderBy(desc(sql`${dataVizGraphics.viewCount} + ${dataVizGraphics.shareCount} * 3 + ${dataVizGraphics.clickCount} * 2`))
      .limit(limit);

      return trending;
    } catch (error) {
      this.trackError('getTrendingVisualizations', error);
      throw error;
    }
  }

  /**
   * Get comprehensive analytics for data visualizations
   */
  async getAnalytics(timeframe: string = '30d'): Promise<any> {
    try {
      const days = this.parseTimeframe(timeframe);
      const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      // Template metrics
      const templateMetrics = await db.select({
        totalTemplates: count(),
        activeTemplates: sum(sql`CASE WHEN is_active = true THEN 1 ELSE 0 END`)
      }).from(dataVizTemplates);

      // Visualization metrics
      const vizMetrics = await db.select({
        totalVizs: count(),
        completedVizs: sum(sql`CASE WHEN render_status = 'completed' THEN 1 ELSE 0 END`),
        socialPosts: sum(sql`CASE WHEN social_posted = true THEN 1 ELSE 0 END`),
        totalViews: sum(dataVizGraphics.viewCount),
        totalShares: sum(dataVizGraphics.shareCount),
        totalClicks: sum(dataVizGraphics.clickCount),
        avgEngagement: avg(sql`${dataVizGraphics.viewCount} + ${dataVizGraphics.shareCount} * 3 + ${dataVizGraphics.clickCount} * 2`)
      }).from(dataVizGraphics)
      .where(gte(dataVizGraphics.createdAt, cutoffDate));

      // Top performing visualizations
      const topVizs = await this.getTrendingVisualizations(timeframe, 10);

      // Platform performance
      const platformPerformance = await db.select({
        platform: dataVizAnalytics.platform,
        eventCount: count(),
        uniqueUsers: sql`COUNT(DISTINCT ${dataVizAnalytics.ipAddress})`
      }).from(dataVizAnalytics)
      .where(gte(dataVizAnalytics.timestamp, cutoffDate))
      .groupBy(dataVizAnalytics.platform)
      .orderBy(desc(count()));

      return {
        overview: {
          timeframe,
          templates: templateMetrics[0],
          visualizations: vizMetrics[0]
        },
        performance: {
          topVisualizations: topVizs,
          platformPerformance
        },
        recommendations: this.generateViralOptimizationRecommendations(vizMetrics[0])
      };
    } catch (error) {
      this.trackError('getAnalytics', error);
      throw error;
    }
  }

  // ====================================================================
  // PRIVATE HELPER METHODS
  // ====================================================================

  private async verifySchema(): Promise<void> {
    try {
      await db.select().from(dataVizTemplates).limit(1);
      await db.select().from(dataVizGraphics).limit(1);
      await db.select().from(dataVizAnalytics).limit(1);
    } catch (error) {
      throw new Error('Data Visualization database schema verification failed. Please run migrations.');
    }
  }

  private async initializeDefaultTemplates(): Promise<void> {
    const defaultTemplates = [
      {
        name: 'Daily Stock Market Trends',
        type: 'chart',
        category: 'finance',
        dataSource: 'stock_api',
        updateFrequency: 'daily',
        socialFormats: ['instagram', 'twitter', 'linkedin'],
        viralHooks: ['📈 Market Alert:', 'Breaking: Stock Performance']
      },
      {
        name: 'Crypto Price Comparison',
        type: 'comparison',
        category: 'crypto',
        dataSource: 'crypto_api',
        updateFrequency: 'hourly',
        socialFormats: ['twitter', 'instagram'],
        viralHooks: ['🚀 Crypto Update:', 'Did you know?']
      },
      {
        name: 'Weather Extremes Map',
        type: 'map',
        category: 'weather',
        dataSource: 'weather_api',
        updateFrequency: 'daily',
        socialFormats: ['instagram', 'facebook'],
        viralHooks: ['🌡️ Climate Alert:', 'Extreme Weather:']
      },
      {
        name: 'Tech Trends Timeline',
        type: 'timeline',
        category: 'technology',
        dataSource: 'tech_news_api',
        updateFrequency: 'weekly',
        socialFormats: ['linkedin', 'twitter'],
        viralHooks: ['🔮 Tech Prediction:', 'Innovation Alert:']
      }
    ];

    for (const template of defaultTemplates) {
      try {
        await this.createTemplate(template as any);
      } catch (error) {
        console.log(`Template ${template.name} might already exist`);
      }
    }
  }

  private initializeMetrics(): void {
    this.performanceMetrics.set('templates_created', 0);
    this.performanceMetrics.set('visualizations_generated', 0);
    this.performanceMetrics.set('social_posts', 0);
    this.performanceMetrics.set('total_views', 0);
    this.performanceMetrics.set('total_shares', 0);
    this.performanceMetrics.set('total_engagements', 0);
  }

  private initializeDataProviders(): void {
    // Initialize data provider configurations
    this.dataProviders.set('stock_api', {
      url: 'https://api.example.com/stocks',
      apiKey: process.env.STOCK_API_KEY,
      refreshInterval: 300000 // 5 minutes
    });

    this.dataProviders.set('crypto_api', {
      url: 'https://api.example.com/crypto',
      apiKey: process.env.CRYPTO_API_KEY,
      refreshInterval: 60000 // 1 minute
    });

    this.dataProviders.set('weather_api', {
      url: 'https://api.example.com/weather',
      apiKey: process.env.WEATHER_API_KEY,
      refreshInterval: 900000 // 15 minutes
    });
  }

  private startAutomatedGeneration(): void {
    // Generate visualizations from active templates daily
    setInterval(async () => {
      try {
        const activeTemplates = await db.select()
          .from(dataVizTemplates)
          .where(eq(dataVizTemplates.isActive, true));

        for (const template of activeTemplates) {
          if (this.shouldGenerateNow(template.updateFrequency)) {
            await this.generateVisualization({
              templateId: template.id,
              autoPost: true
            });
          }
        }
      } catch (error) {
        console.error('Automated generation error:', error);
      }
    }, 60 * 60 * 1000); // Every hour
  }

  private startSocialMediaOptimization(): void {
    // Process render queue every 5 minutes
    setInterval(async () => {
      try {
        while (this.renderQueue.length > 0) {
          const viz = this.renderQueue.shift();
          await this.renderVisualization(viz.id);
          
          if (viz.autoPost) {
            await this.autoPostToSocial(viz.id);
          }
        }
      } catch (error) {
        console.error('Social media optimization error:', error);
      }
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  private async fetchData(dataSource: string): Promise<any> {
    // Simulate data fetching from external APIs
    // In production, this would connect to real data sources
    const mockData = {
      stock_api: {
        symbols: ['AAPL', 'GOOGL', 'MSFT', 'TSLA'],
        prices: [150.25, 2800.50, 420.75, 250.00],
        changes: [2.5, -15.25, 8.50, -5.75],
        timestamp: new Date().toISOString()
      },
      crypto_api: {
        coins: ['BTC', 'ETH', 'ADA', 'SOL'],
        prices: [45000, 3200, 0.45, 95],
        changes: [1200, -150, 0.02, -3.5],
        timestamp: new Date().toISOString()
      },
      weather_api: {
        locations: ['New York', 'London', 'Tokyo', 'Sydney'],
        temperatures: [72, 65, 78, 82],
        conditions: ['Sunny', 'Cloudy', 'Rainy', 'Clear'],
        timestamp: new Date().toISOString()
      }
    };

    return mockData[dataSource as keyof typeof mockData] || {};
  }

  private async generateViralContent(config: {
    template: any;
    data: any;
    customHook?: string;
  }): Promise<any> {
    const { template, data, customHook } = config;
    
    // Generate viral hooks based on data and template
    const hooks = customHook ? [customHook] : template.viralHooks || [];
    const selectedHook = hooks[Math.floor(Math.random() * hooks.length)];
    
    const title = `${selectedHook} ${template.name} - ${new Date().toLocaleDateString()}`;
    const description = `Latest ${template.category} insights and trends. Updated ${template.updateFrequency}.`;
    
    // Generate hashtags based on category and trending topics
    const hashtags = this.generateHashtags(template.category, data);
    
    return {
      title,
      description,
      hook: selectedHook,
      seoTitle: `${title} | Trending ${template.category} Data`,
      seoDescription: `${description} Get the latest viral-worthy insights and trends.`,
      hashtags
    };
  }

  private generateHashtags(category: string, data: any): string[] {
    const baseHashtags = ['#data', '#trends', '#viral', '#insights'];
    const categoryHashtags: Record<string, string[]> = {
      finance: ['#stocks', '#investing', '#finance', '#market'],
      crypto: ['#crypto', '#bitcoin', '#blockchain', '#cryptocurrency'],
      weather: ['#weather', '#climate', '#forecast', '#temperature'],
      technology: ['#tech', '#innovation', '#future', '#trending']
    };
    
    return [...baseHashtags, ...(categoryHashtags[category] || [])];
  }

  private getDefaultChartConfig(type: string): any {
    const configs = {
      chart: {
        type: 'line',
        colors: ['#3b82f6', '#ef4444', '#10b981'],
        animations: true,
        responsive: true
      },
      comparison: {
        type: 'bar',
        colors: ['#8b5cf6', '#f59e0b'],
        layout: 'horizontal'
      },
      timeline: {
        type: 'timeline',
        colors: ['#6366f1'],
        interactive: true
      },
      map: {
        type: 'choropleth',
        colors: ['#fef3c7', '#f59e0b', '#dc2626'],
        zoomable: true
      }
    };
    
    return configs[type as keyof typeof configs] || configs.chart;
  }

  private getDefaultDesignConfig(): any {
    return {
      theme: 'modern',
      fontFamily: 'Inter, sans-serif',
      primaryColor: '#3b82f6',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      brandLogo: true,
      watermark: true
    };
  }

  private queueForRendering(visualization: any): void {
    this.renderQueue.push(visualization);
    console.log(`📋 Queued visualization ${visualization.id} for rendering`);
  }

  private async renderForFormat(viz: any, format: string): Promise<any> {
    // Simulate rendering for different social media formats
    // In production, this would use canvas libraries or external rendering services
    const dimensions = {
      instagram: { width: 1080, height: 1080 },
      twitter: { width: 1200, height: 675 },
      linkedin: { width: 1200, height: 627 },
      facebook: { width: 1200, height: 630 }
    };

    const formatDimensions = dimensions[format as keyof typeof dimensions];
    
    console.log(`🎨 Rendering ${format} format (${formatDimensions.width}x${formatDimensions.height})`);
    
    // Simulate rendering delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      format,
      url: `/generated/viz-${viz.id}-${format}.png`,
      dimensions: formatDimensions,
      fileSize: Math.floor(Math.random() * 500) + 100 // KB
    };
  }

  private async postToSocialPlatform(config: {
    platform: string;
    visualization: any;
    assetUrl: string;
  }): Promise<void> {
    // Simulate social media posting
    // In production, this would use platform APIs
    console.log(`📱 Posting to ${config.platform}: ${config.visualization.title}`);
    console.log(`🖼️ Asset: ${config.assetUrl}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  private getAssetForPlatform(assetUrls: string[], platform: string): string {
    // Find asset for specific platform
    const platformAsset = assetUrls.find(url => url.includes(`-${platform}.`));
    return platformAsset || assetUrls[0] || '';
  }

  private shouldGenerateNow(frequency: string): boolean {
    // Simple frequency check - in production this would be more sophisticated
    const now = new Date();
    const hour = now.getHours();
    
    switch (frequency) {
      case 'real-time': return true;
      case 'hourly': return true; // Always generate in this simulation
      case 'daily': return hour === 9; // 9 AM
      case 'weekly': return now.getDay() === 1 && hour === 9; // Monday 9 AM
      default: return false;
    }
  }

  private parseTimeframe(timeframe: string): number {
    const match = timeframe.match(/(\d+)([dwmy])/);
    if (!match) return 30;
    
    const value = parseInt(match[1]);
    const unit = match[2];
    
    switch (unit) {
      case 'd': return value;
      case 'w': return value * 7;
      case 'm': return value * 30;
      case 'y': return value * 365;
      default: return 30;
    }
  }

  private generateViralOptimizationRecommendations(metrics: any): string[] {
    const recommendations = [];
    
    if (metrics.totalShares / metrics.totalViews < 0.1) {
      recommendations.push('Add more compelling viral hooks to increase share rates');
    }
    
    if (metrics.socialPosts / metrics.totalVizs < 0.8) {
      recommendations.push('Enable auto-posting for more visualizations to maximize reach');
    }
    
    if (metrics.avgEngagement < 100) {
      recommendations.push('Experiment with different chart types and design themes');
    }
    
    return recommendations;
  }

  private trackError(operation: string, error: any): void {
    const key = operation;
    const existing = this.errorTracker.get(key);
    
    if (existing) {
      existing.count++;
      existing.lastError = new Date();
    } else {
      this.errorTracker.set(key, { count: 1, lastError: new Date() });
    }
    
    console.error(`Viral Data Viz Engine Error [${operation}]:`, error);
  }
}

export default ViralDataVizEngine;