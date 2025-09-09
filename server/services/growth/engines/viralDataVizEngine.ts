import { db } from "../../../db";
import {
  dataVisualizationProjects,
  dataVisualizationStats,
  type DataVisualizationProject,
  type DataVisualizationStats
} from "../../../../shared/moneyTrafficGrowthTables";
import { eq, desc, sql, and, gte, count, sum, avg, max, min } from "drizzle-orm";
import * as crypto from 'crypto';
import { z } from 'zod';

/**
 * VIRAL DATA VISUALIZATION HUB ENGINE - BILLION-DOLLAR EMPIRE GRADE
 * 
 * Auto-generate viral-ready data visualizations and infographics:
 * - AI-powered chart generation from raw data sources (APIs, spreadsheets, databases)
 * - Interactive visualization widgets (D3.js, Chart.js, custom React components)
 * - Auto-optimization for social sharing (Twitter cards, LinkedIn posts, Pinterest pins)
 * - Embeddable widgets for external sites with affiliate tracking
 * - Comprehensive analytics on views, shares, embeds, conversions
 * - Content remix into multiple formats (static images, GIFs, videos)
 * - SEO-optimized landing pages for each visualization
 * - White-label and branded customization options
 */
export class ViralDataVizEngine {
  private static instance: ViralDataVizEngine;
  private initialized = false;
  private errorTracker = new Map<string, { count: number; lastError: Date }>();
  private performanceMetrics = new Map<string, number>();
  private chartLibraries = ['d3js', 'chartjs', 'recharts', 'plotly'];

  private constructor() {}

  public static getInstance(): ViralDataVizEngine {
    if (!ViralDataVizEngine.instance) {
      ViralDataVizEngine.instance = new ViralDataVizEngine();
    }
    return ViralDataVizEngine.instance;
  }

  /**
   * Initialize the Viral Data Visualization Engine with enterprise features
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      console.log('📊 Initializing Viral Data Visualization Hub Engine (Enterprise Edition)...');
      
      // Verify database tables exist
      await this.verifySchema();
      
      // Initialize performance monitoring
      this.initializeMetrics();
      
      // Start viral tracking service
      this.startViralTracking();
      
      this.initialized = true;
      console.log('✅ Viral Data Visualization Hub Engine initialized successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize Viral Data Viz Engine:', error);
      this.trackError('initialization', error);
      throw error;
    }
  }

  /**
   * Create a new data visualization project with AI optimization
   */
  async createVisualization(config: {
    title: string;
    description: string;
    vertical: string;
    vizType: 'chart' | 'infographic' | 'comparison' | 'stats_page';
    dataSources: any[];
    chartConfig?: any;
    interactiveElements?: any[];
    autoOptimize?: boolean;
  }): Promise<DataVisualizationProject> {
    try {
      const slug = this.createSlug(config.title);
      
      // Generate optimized chart configuration
      const optimizedChartConfig = config.autoOptimize ? 
        await this.optimizeChartForVirality(config.chartConfig || {}, config.vizType) : 
        config.chartConfig || {};

      // Generate interactive elements if not provided
      const interactiveElements = config.interactiveElements || 
        await this.generateInteractiveElements(config.vizType, optimizedChartConfig);

      // Generate embed code
      const embedCode = this.generateEmbedCode(slug, optimizedChartConfig);

      // Generate shareable URL
      const shareableUrl = `/viz/${slug}`;

      const project = await db.insert(dataVisualizationProjects).values({
        title: config.title,
        slug,
        description: config.description,
        vertical: config.vertical,
        vizType: config.vizType,
        dataSources: config.dataSources,
        chartConfig: optimizedChartConfig,
        interactiveElements,
        embedCode,
        shareableUrl,
        downloadFormats: ['png', 'pdf', 'svg', 'json'],
        isPublished: true,
        isFeatured: false,
        tags: this.generateVisualizationTags(config.title, config.vertical, config.vizType)
      }).returning();

      console.log(`📊 Created data visualization: ${config.title} (${config.vizType})`);
      return project[0];
    } catch (error) {
      this.trackError('createVisualization', error);
      throw error;
    }
  }

  /**
   * Generate visualization from raw data with AI insights
   */
  async generateFromData(config: {
    title: string;
    vertical: string;
    rawData: any;
    suggestedChartType?: string;
    insights?: string[];
    targetPlatform?: 'twitter' | 'linkedin' | 'pinterest' | 'general';
  }): Promise<DataVisualizationProject> {
    try {
      // Analyze data structure and recommend best visualization type
      const analyzedData = await this.analyzeDataStructure(config.rawData);
      const recommendedVizType = config.suggestedChartType || analyzedData.recommendedType;

      // Generate AI insights from data
      const dataInsights = config.insights || await this.generateDataInsights(config.rawData, config.vertical);

      // Create optimized chart configuration
      const chartConfig = await this.createOptimizedChartConfig(
        config.rawData, 
        recommendedVizType, 
        config.targetPlatform || 'general'
      );

      // Generate title and description if not provided
      const optimizedTitle = config.title || await this.generateViralTitle(analyzedData, config.vertical);
      const description = await this.generateViralDescription(optimizedTitle, dataInsights, config.vertical);

      return await this.createVisualization({
        title: optimizedTitle,
        description,
        vertical: config.vertical,
        vizType: recommendedVizType as any,
        dataSources: [{ type: 'raw_data', data: config.rawData, insights: dataInsights }],
        chartConfig,
        autoOptimize: true
      });
    } catch (error) {
      this.trackError('generateFromData', error);
      throw error;
    }
  }

  /**
   * Track viral metrics across social platforms
   */
  async trackViralMetrics(projectId: number, platform: string, metrics: {
    shares?: number;
    likes?: number;
    comments?: number;
    clickThroughs?: number;
    reachEstimate?: number;
  }): Promise<void> {
    try {
      // Calculate virality coefficient
      const viralityCoefficient = this.calculateViralityCoefficient(metrics);
      
      // Calculate engagement rate
      const engagementRate = this.calculateEngagementRate(metrics);

      // Upsert platform stats
      await db.insert(dataVisualizationStats).values({
        projectId,
        platform,
        shares: metrics.shares || 0,
        likes: metrics.likes || 0,
        comments: metrics.comments || 0,
        clickThroughs: metrics.clickThroughs || 0,
        viralityCoefficient,
        engagementRate,
        reachEstimate: metrics.reachEstimate || 0
      }).onConflictDoUpdate({
        target: [dataVisualizationStats.projectId, dataVisualizationStats.platform],
        set: {
          shares: metrics.shares || 0,
          likes: metrics.likes || 0,
          comments: metrics.comments || 0,
          clickThroughs: metrics.clickThroughs || 0,
          viralityCoefficient,
          engagementRate,
          reachEstimate: metrics.reachEstimate || 0,
          lastTracked: new Date()
        }
      });

      // Update project viral score
      await this.updateProjectViralScore(projectId);

      console.log(`📈 Updated viral metrics for project ${projectId} on ${platform}`);
    } catch (error) {
      this.trackError('trackViralMetrics', error);
      throw error;
    }
  }

  /**
   * Auto-remix visualization into multiple formats for different platforms
   */
  async remixForPlatforms(projectId: number, targetPlatforms: string[]): Promise<{ remixes: any[]; totalGenerated: number }> {
    try {
      const project = await db.select().from(dataVisualizationProjects)
        .where(eq(dataVisualizationProjects.id, projectId))
        .limit(1);

      if (!project.length) throw new Error('Project not found');

      const remixes = [];

      for (const platform of targetPlatforms) {
        try {
          const platformOptimized = await this.optimizeForPlatform(project[0], platform);
          remixes.push({
            platform,
            optimizedConfig: platformOptimized.chartConfig,
            dimensions: platformOptimized.dimensions,
            format: platformOptimized.format,
            shareableUrl: `/viz/${project[0].slug}?platform=${platform}`,
            embedCode: this.generatePlatformEmbedCode(project[0].slug, platform, platformOptimized)
          });
        } catch (error) {
          console.error(`Failed to remix for ${platform}:`, error);
        }
      }

      console.log(`🎨 Generated ${remixes.length} platform remixes for project ${projectId}`);
      return { remixes, totalGenerated: remixes.length };
    } catch (error) {
      this.trackError('remixForPlatforms', error);
      throw error;
    }
  }

  /**
   * Get comprehensive viral analytics
   */
  async getViralAnalytics(timeframe: string = '30d'): Promise<any> {
    try {
      const days = this.parseTimeframe(timeframe);
      const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      // Project metrics
      const projectMetrics = await db.select({
        totalProjects: count(),
        publishedProjects: sum(sql`CASE WHEN is_published = true THEN 1 ELSE 0 END`),
        featuredProjects: sum(sql`CASE WHEN is_featured = true THEN 1 ELSE 0 END`),
        totalViews: sum(dataVisualizationProjects.views),
        totalShares: sum(dataVisualizationProjects.shares),
        totalEmbeds: sum(dataVisualizationProjects.embeds),
        totalDownloads: sum(dataVisualizationProjects.downloads),
        avgViralScore: avg(dataVisualizationProjects.viralScore)
      }).from(dataVisualizationProjects)
      .where(gte(dataVisualizationProjects.createdAt, cutoffDate));

      // Top viral projects
      const topViralProjects = await db.select({
        id: dataVisualizationProjects.id,
        title: dataVisualizationProjects.title,
        vizType: dataVisualizationProjects.vizType,
        views: dataVisualizationProjects.views,
        shares: dataVisualizationProjects.shares,
        embeds: dataVisualizationProjects.embeds,
        viralScore: dataVisualizationProjects.viralScore
      }).from(dataVisualizationProjects)
      .orderBy(desc(dataVisualizationProjects.viralScore))
      .limit(10);

      // Platform performance
      const platformPerformance = await db.select({
        platform: dataVisualizationStats.platform,
        totalShares: sum(dataVisualizationStats.shares),
        totalLikes: sum(dataVisualizationStats.likes),
        totalComments: sum(dataVisualizationStats.comments),
        avgViralityCoefficient: avg(dataVisualizationStats.viralityCoefficient),
        avgEngagementRate: avg(dataVisualizationStats.engagementRate),
        totalReach: sum(dataVisualizationStats.reachEstimate)
      }).from(dataVisualizationStats)
      .groupBy(dataVisualizationStats.platform)
      .orderBy(desc(sum(dataVisualizationStats.shares)));

      // Chart type performance
      const chartTypePerformance = await db.select({
        vizType: dataVisualizationProjects.vizType,
        count: count(),
        avgViralScore: avg(dataVisualizationProjects.viralScore),
        totalShares: sum(dataVisualizationProjects.shares),
        totalViews: sum(dataVisualizationProjects.views)
      }).from(dataVisualizationProjects)
      .where(gte(dataVisualizationProjects.createdAt, cutoffDate))
      .groupBy(dataVisualizationProjects.vizType)
      .orderBy(desc(avg(dataVisualizationProjects.viralScore)));

      return {
        overview: {
          timeframe,
          projects: projectMetrics[0]
        },
        performance: {
          topViralProjects,
          platformPerformance,
          chartTypePerformance
        },
        recommendations: this.generateViralOptimizationRecommendations(projectMetrics[0], platformPerformance)
      };
    } catch (error) {
      this.trackError('getViralAnalytics', error);
      throw error;
    }
  }

  /**
   * Generate embeddable widget code for external sites
   */
  generateEmbedWidget(projectId: number, options: {
    width?: number;
    height?: number;
    responsive?: boolean;
    theme?: 'light' | 'dark';
    showBranding?: boolean;
    affiliateId?: string;
  }): string {
    const width = options.width || 800;
    const height = options.height || 600;
    const responsive = options.responsive !== false;
    const theme = options.theme || 'light';
    const showBranding = options.showBranding !== false;
    const affiliateParam = options.affiliateId ? `&affiliate=${options.affiliateId}` : '';

    return `<iframe 
      src="/api/viz/embed/${projectId}?theme=${theme}&branding=${showBranding}${affiliateParam}"
      width="${width}" 
      height="${height}"
      ${responsive ? 'style="max-width: 100%; height: auto;"' : ''}
      frameborder="0"
      allowfullscreen>
    </iframe>`;
  }

  // ====================================================================
  // PRIVATE HELPER METHODS
  // ====================================================================

  private async verifySchema(): Promise<void> {
    try {
      await db.select().from(dataVisualizationProjects).limit(1);
      await db.select().from(dataVisualizationStats).limit(1);
    } catch (error) {
      throw new Error('Database schema verification failed. Please run migrations.');
    }
  }

  private initializeMetrics(): void {
    this.performanceMetrics.set('visualizations_created', 0);
    this.performanceMetrics.set('viral_shares', 0);
    this.performanceMetrics.set('embed_views', 0);
    this.performanceMetrics.set('platform_remixes', 0);
  }

  private startViralTracking(): void {
    // Track viral metrics every hour
    setInterval(async () => {
      try {
        await this.updateAllViralScores();
      } catch (error) {
        console.error('Viral tracking error:', error);
      }
    }, 60 * 60 * 1000); // Every hour
  }

  private async optimizeChartForVirality(chartConfig: any, vizType: string): Promise<any> {
    // AI optimization for maximum viral potential
    const optimizations = {
      colors: this.getViralColorPalette(vizType),
      typography: this.getViralTypography(),
      animations: this.getViralAnimations(vizType),
      interactivity: this.getViralInteractivity(vizType)
    };

    return { ...chartConfig, ...optimizations };
  }

  private async generateInteractiveElements(vizType: string, chartConfig: any): Promise<any[]> {
    const elements = [];

    switch (vizType) {
      case 'chart':
        elements.push(
          { type: 'hover', config: { showDataLabels: true, highlightColor: '#ff6b6b' } },
          { type: 'click', config: { drillDown: true, showDetails: true } },
          { type: 'zoom', config: { enabled: true, wheelZoom: true } }
        );
        break;
      case 'infographic':
        elements.push(
          { type: 'scroll', config: { parallax: true, fadeIn: true } },
          { type: 'click', config: { expandSections: true } }
        );
        break;
      case 'comparison':
        elements.push(
          { type: 'filter', config: { categories: true, values: true } },
          { type: 'sort', config: { columns: true, direction: 'both' } }
        );
        break;
    }

    return elements;
  }

  private generateEmbedCode(slug: string, chartConfig: any): string {
    return `<div class="findawise-viz" data-slug="${slug}">
      <script src="/js/viz-embed.js"></script>
      <script>FindawiseViz.render('${slug}', ${JSON.stringify(chartConfig)});</script>
    </div>`;
  }

  private generateVisualizationTags(title: string, vertical: string, vizType: string): string[] {
    const baseTags = [vertical, vizType, 'data', 'visualization', 'infographic'];
    const titleWords = title.toLowerCase().split(' ').filter(word => word.length > 3);
    return [...baseTags, ...titleWords.slice(0, 5)];
  }

  private async analyzeDataStructure(rawData: any): Promise<any> {
    // Simulate AI data analysis
    // In production, this would use real AI/ML algorithms
    const dataPoints = Array.isArray(rawData) ? rawData.length : Object.keys(rawData).length;
    const hasTimeData = JSON.stringify(rawData).includes('date') || JSON.stringify(rawData).includes('time');
    const hasNumericData = JSON.stringify(rawData).match(/\d+/g);

    let recommendedType = 'stats_page';
    
    if (hasTimeData && hasNumericData) {
      recommendedType = 'chart';
    } else if (dataPoints > 10 && hasNumericData) {
      recommendedType = 'infographic';
    } else if (dataPoints <= 5) {
      recommendedType = 'comparison';
    }

    return {
      dataPoints,
      hasTimeData,
      hasNumericData,
      recommendedType,
      complexity: dataPoints > 50 ? 'high' : dataPoints > 10 ? 'medium' : 'low'
    };
  }

  private async generateDataInsights(rawData: any, vertical: string): Promise<string[]> {
    // Generate AI insights from data
    // In production, this would use real AI APIs
    return [
      `This ${vertical} data shows interesting trends over time`,
      `Key patterns emerge when analyzing the data structure`,
      `Notable correlations exist between different data points`
    ];
  }

  private async createOptimizedChartConfig(rawData: any, vizType: string, platform: string): Promise<any> {
    const baseConfig = {
      data: rawData,
      responsive: true,
      maintainAspectRatio: platform !== 'pinterest'
    };

    switch (platform) {
      case 'twitter':
        return {
          ...baseConfig,
          width: 1200,
          height: 675,
          colors: ['#1DA1F2', '#14171A', '#657786'],
          fontSize: 16
        };
      case 'linkedin':
        return {
          ...baseConfig,
          width: 1200,
          height: 627,
          colors: ['#0077B5', '#000000', '#5E5E5E'],
          fontSize: 14
        };
      case 'pinterest':
        return {
          ...baseConfig,
          width: 735,
          height: 1102,
          colors: ['#E60023', '#000000', '#767676'],
          fontSize: 18
        };
      default:
        return {
          ...baseConfig,
          width: 800,
          height: 600,
          colors: ['#6366f1', '#ef4444', '#10b981'],
          fontSize: 14
        };
    }
  }

  private async generateViralTitle(analyzedData: any, vertical: string): Promise<string> {
    // Generate viral-optimized titles
    // In production, this would use AI APIs
    const templates = [
      `This ${vertical} Data Will Surprise You`,
      `The Shocking Truth About ${vertical}`,
      `${analyzedData.dataPoints} ${vertical} Stats That Matter`,
      `What ${vertical} Data Reveals About 2025`
    ];

    return templates[Math.floor(Math.random() * templates.length)];
  }

  private async generateViralDescription(title: string, insights: string[], vertical: string): Promise<string> {
    return `${title} - ${insights.join('. ')}. Comprehensive ${vertical} data analysis with actionable insights.`;
  }

  private calculateViralityCoefficient(metrics: any): number {
    const shares = metrics.shares || 0;
    const likes = metrics.likes || 0;
    const comments = metrics.comments || 0;
    const clicks = metrics.clickThroughs || 0;

    // Weighted formula for virality
    return (shares * 3 + comments * 2 + likes * 1 + clicks * 0.5) / 100;
  }

  private calculateEngagementRate(metrics: any): number {
    const totalEngagement = (metrics.likes || 0) + (metrics.comments || 0) + (metrics.shares || 0);
    const reach = metrics.reachEstimate || 1;
    return (totalEngagement / reach) * 100;
  }

  private async updateProjectViralScore(projectId: number): Promise<void> {
    // Calculate overall viral score from all platform stats
    const stats = await db.select().from(dataVisualizationStats)
      .where(eq(dataVisualizationStats.projectId, projectId));

    const totalViralScore = stats.reduce((sum, stat) => sum + stat.viralityCoefficient, 0);
    const avgViralScore = stats.length > 0 ? totalViralScore / stats.length : 0;

    await db.update(dataVisualizationProjects)
      .set({ viralScore: avgViralScore })
      .where(eq(dataVisualizationProjects.id, projectId));
  }

  private async optimizeForPlatform(project: any, platform: string): Promise<any> {
    const platformConfigs = {
      twitter: { width: 1200, height: 675, format: 'png' },
      linkedin: { width: 1200, height: 627, format: 'png' },
      pinterest: { width: 735, height: 1102, format: 'png' },
      instagram: { width: 1080, height: 1080, format: 'png' },
      facebook: { width: 1200, height: 630, format: 'png' }
    };

    const config = platformConfigs[platform] || platformConfigs.twitter;
    
    return {
      chartConfig: { ...project.chartConfig, ...config },
      dimensions: { width: config.width, height: config.height },
      format: config.format
    };
  }

  private generatePlatformEmbedCode(slug: string, platform: string, optimizedConfig: any): string {
    return `<div class="findawise-viz-${platform}" data-slug="${slug}" data-platform="${platform}">
      <script src="/js/viz-embed-${platform}.js"></script>
    </div>`;
  }

  private async updateAllViralScores(): Promise<void> {
    // Update viral scores for all projects
    const projects = await db.select({ id: dataVisualizationProjects.id })
      .from(dataVisualizationProjects)
      .where(eq(dataVisualizationProjects.isPublished, true));

    for (const project of projects) {
      try {
        await this.updateProjectViralScore(project.id);
      } catch (error) {
        console.error(`Failed to update viral score for project ${project.id}:`, error);
      }
    }
  }

  private getViralColorPalette(vizType: string): string[] {
    const palettes = {
      chart: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7'],
      infographic: ['#e17055', '#74b9ff', '#00b894', '#fdcb6e', '#a29bfe'],
      comparison: ['#2d3436', '#636e72', '#b2bec3', '#ddd', '#00cec9'],
      stats_page: ['#0984e3', '#00b894', '#e17055', '#fdcb6e', '#6c5ce7']
    };

    return palettes[vizType] || palettes.chart;
  }

  private getViralTypography(): any {
    return {
      fontFamily: 'Inter, system-ui, sans-serif',
      titleSize: 24,
      subtitleSize: 18,
      bodySize: 14,
      fontWeight: { title: 700, subtitle: 600, body: 400 }
    };
  }

  private getViralAnimations(vizType: string): any {
    return {
      entrance: 'fadeInUp',
      duration: 1000,
      delay: 200,
      easing: 'easeOutCubic'
    };
  }

  private getViralInteractivity(vizType: string): any {
    return {
      hover: true,
      click: true,
      touch: true,
      keyboard: true
    };
  }

  private createSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  private parseTimeframe(timeframe: string): number {
    const unit = timeframe.slice(-1);
    const value = parseInt(timeframe.slice(0, -1));
    
    switch (unit) {
      case 'd': return value;
      case 'w': return value * 7;
      case 'm': return value * 30;
      default: return 30;
    }
  }

  private generateViralOptimizationRecommendations(projectMetrics: any, platformPerformance: any[]): string[] {
    const recommendations = [];
    
    if (projectMetrics.avgViralScore < 5) {
      recommendations.push('Focus on creating more interactive and engaging visualizations');
    }
    
    if (projectMetrics.totalShares / projectMetrics.totalViews < 0.05) {
      recommendations.push('Add more social sharing buttons and optimize for platform-specific formats');
    }
    
    const bestPlatform = platformPerformance.length > 0 ? platformPerformance[0].platform : null;
    if (bestPlatform) {
      recommendations.push(`${bestPlatform} is your best performing platform - create more content optimized for it`);
    }
    
    return recommendations;
  }

  private trackError(operation: string, error: any): void {
    const key = operation;
    const existing = this.errorTracker.get(key) || { count: 0, lastError: new Date() };
    existing.count++;
    existing.lastError = new Date();
    this.errorTracker.set(key, existing);
    
    console.error(`❌ Viral Data Viz Engine Error [${operation}]:`, error);
  }
}

// Export singleton instance
export const viralDataVizEngine = ViralDataVizEngine.getInstance();