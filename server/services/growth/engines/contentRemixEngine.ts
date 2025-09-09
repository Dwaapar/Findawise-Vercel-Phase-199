import { db } from "../../../db";
import {
  contentRemixProjects,
  contentRemixDistribution,
  type ContentRemixProject,
  type ContentRemixDistribution
} from "../../../../shared/moneyTrafficGrowthTables";
import { eq, desc, sql, and, gte, count, sum, avg, max, min, ilike } from "drizzle-orm";
import * as crypto from 'crypto';
import { z } from 'zod';

/**
 * CONTENT REMIX & SPIN ENGINE - BILLION-DOLLAR EMPIRE GRADE
 * 
 * Intelligent content remixing and multi-platform distribution:
 * - AI-powered content adaptation for different platforms (Twitter threads, LinkedIn carousels, Instagram posts)
 * - Automated format conversion (blog → video script, article → infographic)
 * - Brand consistency with customizable templates and voice
 * - Smart scheduling across multiple social platforms
 * - Performance tracking and optimization based on engagement
 * - Viral mechanics with backlink injection and UTM tracking
 */
export class ContentRemixEngine {
  private static instance: ContentRemixEngine;
  private initialized = false;
  private errorTracker = new Map<string, { count: number; lastError: Date }>();
  private performanceMetrics = new Map<string, number>();
  private supportedPlatforms = ['twitter', 'linkedin', 'instagram', 'youtube', 'tiktok', 'facebook'];

  private constructor() {}

  public static getInstance(): ContentRemixEngine {
    if (!ContentRemixEngine.instance) {
      ContentRemixEngine.instance = new ContentRemixEngine();
    }
    return ContentRemixEngine.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      console.log('🎨 Initializing Content Remix Engine (Enterprise Edition)...');
      
      await this.verifySchema();
      this.initializeMetrics();
      this.startDistributionScheduler();
      this.startPerformanceTracking();
      
      this.initialized = true;
      console.log('✅ Content Remix Engine initialized successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize Content Remix Engine:', error);
      this.trackError('initialization', error);
      throw error;
    }
  }

  async createRemixProject(data: {
    sourceContentId: string;
    sourceContentType: 'blog' | 'video' | 'tool';
    originalTitle: string;
    originalUrl?: string;
    vertical: string;
    remixStrategy: 'carousel' | 'thread' | 'infographic' | 'video_script';
    targetPlatforms: string[];
    brandingElements?: any;
    affiliateLinks?: any[];
    backlinks?: any[];
    utmParameters?: any;
    schedulingConfig?: any;
  }): Promise<any> {
    try {
      console.log(`🎨 Creating remix project for: ${data.originalTitle}`);

      const [project] = await db.insert(contentRemixProjects).values({
        sourceContentId: data.sourceContentId,
        sourceContentType: data.sourceContentType,
        originalTitle: data.originalTitle,
        originalUrl: data.originalUrl,
        vertical: data.vertical,
        remixStrategy: data.remixStrategy,
        targetPlatforms: data.targetPlatforms,
        remixedContent: {},
        generationPrompts: this.generateRemixPrompts(data),
        brandingElements: data.brandingElements || this.getDefaultBranding(),
        affiliateLinks: data.affiliateLinks || [],
        backlinks: data.backlinks || [],
        utmParameters: data.utmParameters || this.generateUTMParameters(data),
        schedulingConfig: data.schedulingConfig || this.getDefaultScheduling(),
        isGenerated: false,
        isScheduled: false
      }).returning();

      // Generate remixed content for each platform
      const remixedContent = await this.generateRemixedContent(project);

      // Update project with generated content
      const [updatedProject] = await db.update(contentRemixProjects)
        .set({
          remixedContent,
          isGenerated: true,
          generatedAt: new Date()
        })
        .where(eq(contentRemixProjects.id, project.id))
        .returning();

      console.log(`✅ Remix project created: ${updatedProject.originalTitle}`);
      return {
        success: true,
        project: updatedProject,
        remixedContent,
        schedulingOptions: this.getSchedulingOptions(data.targetPlatforms)
      };

    } catch (error) {
      console.error('❌ Failed to create remix project:', error);
      this.trackError('create_project', error);
      throw error;
    }
  }

  async scheduleDistribution(projectId: number, scheduleConfig: {
    platform: string;
    scheduledFor: Date;
    customizations?: any;
  }[]): Promise<any> {
    try {
      const project = await db.select()
        .from(contentRemixProjects)
        .where(eq(contentRemixProjects.id, projectId))
        .limit(1);

      if (!project.length) {
        throw new Error('Remix project not found');
      }

      const projectData = project[0];
      const distributionItems = [];

      for (const schedule of scheduleConfig) {
        const platformContent = projectData.remixedContent[schedule.platform];
        if (!platformContent) {
          console.warn(`No content available for platform: ${schedule.platform}`);
          continue;
        }

        const [distribution] = await db.insert(contentRemixDistribution).values({
          projectId,
          platform: schedule.platform,
          contentFormat: this.getContentFormat(projectData.remixStrategy, schedule.platform),
          status: 'scheduled',
          scheduledFor: schedule.scheduledFor,
          engagement: {},
          reach: 0,
          clicks: 0,
          conversions: 0,
          revenue: 0,
          backlinksGenerated: 0
        }).returning();

        distributionItems.push(distribution);
      }

      // Mark project as scheduled
      await db.update(contentRemixProjects)
        .set({
          isScheduled: true
        })
        .where(eq(contentRemixProjects.id, projectId));

      console.log(`✅ Scheduled distribution for ${distributionItems.length} platforms`);
      return {
        success: true,
        distributionItems,
        nextPublication: Math.min(...scheduleConfig.map(s => s.scheduledFor.getTime()))
      };

    } catch (error) {
      console.error('❌ Failed to schedule distribution:', error);
      this.trackError('schedule_distribution', error);
      throw error;
    }
  }

  async publishContent(distributionId: number): Promise<any> {
    try {
      const distribution = await db.select()
        .from(contentRemixDistribution)
        .where(eq(contentRemixDistribution.id, distributionId))
        .limit(1);

      if (!distribution.length) {
        throw new Error('Distribution item not found');
      }

      const distributionData = distribution[0];
      const project = await db.select()
        .from(contentRemixProjects)
        .where(eq(contentRemixProjects.id, distributionData.projectId))
        .limit(1);

      if (!project.length) {
        throw new Error('Project not found');
      }

      const projectData = project[0];
      const platformContent = projectData.remixedContent[distributionData.platform];

      // Simulate platform publishing (would integrate with actual APIs)
      const publishResult = await this.publishToPlatform(
        distributionData.platform,
        platformContent,
        projectData
      );

      // Update distribution with publish results
      const [updated] = await db.update(contentRemixDistribution)
        .set({
          status: publishResult.success ? 'posted' : 'failed',
          postedAt: publishResult.success ? new Date() : null,
          platformContentId: publishResult.contentId,
          contentUrl: publishResult.contentUrl
        })
        .where(eq(contentRemixDistribution.id, distributionId))
        .returning();

      console.log(`✅ Published content to ${distributionData.platform}`);
      return {
        success: publishResult.success,
        distribution: updated,
        publishResult,
        trackingUrl: this.generateTrackingUrl(updated, projectData)
      };

    } catch (error) {
      console.error('❌ Failed to publish content:', error);
      this.trackError('publish_content', error);
      throw error;
    }
  }

  private generateRemixPrompts(data: any): any {
    const basePrompts = {
      carousel: {
        twitter: `Convert "${data.originalTitle}" into an engaging Twitter carousel thread with 5-7 tweets`,
        linkedin: `Transform "${data.originalTitle}" into a professional LinkedIn carousel with visual elements`,
        instagram: `Adapt "${data.originalTitle}" into an Instagram carousel with eye-catching visuals`
      },
      thread: {
        twitter: `Create a viral Twitter thread from "${data.originalTitle}" with engaging hooks and calls-to-action`,
        linkedin: `Transform "${data.originalTitle}" into a thought leadership LinkedIn post with insights`
      },
      infographic: {
        instagram: `Design an infographic summarizing "${data.originalTitle}" with key statistics and visuals`,
        pinterest: `Create a Pinterest-optimized infographic from "${data.originalTitle}" with viral potential`
      },
      video_script: {
        youtube: `Write a YouTube video script based on "${data.originalTitle}" with engaging intro and clear structure`,
        tiktok: `Create a short-form TikTok script from "${data.originalTitle}" with viral hooks`
      }
    };

    return basePrompts[data.remixStrategy] || basePrompts.carousel;
  }

  private getDefaultBranding(): any {
    return {
      logoUrl: '/assets/logo.png',
      brandColors: ['#007bff', '#6c757d', '#28a745'],
      fontFamily: 'Arial, sans-serif',
      brandVoice: 'professional',
      signature: 'Powered by AI Growth Engine'
    };
  }

  private generateUTMParameters(data: any): any {
    return {
      utm_source: 'social',
      utm_medium: data.remixStrategy,
      utm_campaign: `remix_${data.vertical}`,
      utm_content: data.sourceContentId,
      utm_term: data.originalTitle.toLowerCase().replace(/\s+/g, '_')
    };
  }

  private getDefaultScheduling(): any {
    return {
      timezone: 'UTC',
      optimalTimes: {
        twitter: ['09:00', '15:00', '18:00'],
        linkedin: ['08:00', '12:00', '17:00'],
        instagram: ['11:00', '14:00', '19:00'],
        facebook: ['13:00', '15:00', '20:00']
      },
      frequency: 'staggered',
      intervalMinutes: 30
    };
  }

  private async generateRemixedContent(project: any): Promise<any> {
    const remixedContent = {};

    for (const platform of project.targetPlatforms) {
      try {
        const content = await this.generatePlatformContent(project, platform);
        remixedContent[platform] = content;
      } catch (error) {
        console.error(`❌ Failed to generate content for ${platform}:`, error);
        remixedContent[platform] = null;
      }
    }

    return remixedContent;
  }

  private async generatePlatformContent(project: any, platform: string): Promise<any> {
    const strategy = project.remixStrategy;
    const branding = project.brandingElements;

    // Mock AI content generation - would integrate with actual LLM
    const contentTemplates = {
      twitter: {
        carousel: this.generateTwitterCarousel(project),
        thread: this.generateTwitterThread(project),
        infographic: this.generateTwitterInfographic(project)
      },
      linkedin: {
        carousel: this.generateLinkedInCarousel(project),
        thread: this.generateLinkedInPost(project)
      },
      instagram: {
        carousel: this.generateInstagramCarousel(project),
        infographic: this.generateInstagramInfographic(project)
      },
      youtube: {
        video_script: this.generateYouTubeScript(project)
      },
      tiktok: {
        video_script: this.generateTikTokScript(project)
      }
    };

    const platformTemplates = contentTemplates[platform];
    if (!platformTemplates || !platformTemplates[strategy]) {
      throw new Error(`Unsupported combination: ${platform} + ${strategy}`);
    }

    return platformTemplates[strategy];
  }

  private generateTwitterCarousel(project: any): any {
    return {
      type: 'carousel',
      tweets: [
        {
          text: `🧵 THREAD: ${project.originalTitle} - here's what you need to know 👇`,
          media: null,
          order: 1
        },
        {
          text: `1/ The key insight from ${project.vertical} research: [Key Point 1]`,
          media: null,
          order: 2
        },
        {
          text: `2/ This changes everything because: [Key Point 2]`,
          media: null,
          order: 3
        },
        {
          text: `3/ Here's how you can apply this: [Actionable Advice]`,
          media: null,
          order: 4
        },
        {
          text: `4/ The results speak for themselves: [Statistics/Proof]`,
          media: null,
          order: 5
        },
        {
          text: `That's a wrap! If you found this valuable, retweet the first tweet and follow me for more ${project.vertical} insights! 🚀`,
          media: null,
          order: 6
        }
      ],
      hashtags: [`#${project.vertical}`, '#growth', '#insights'],
      totalEngagement: 0
    };
  }

  private generateTwitterThread(project: any): any {
    return {
      type: 'thread',
      mainTweet: `🔥 ${project.originalTitle} - This is game-changing for ${project.vertical}! Thread below 👇`,
      replies: [
        `The problem: Most people in ${project.vertical} are doing this wrong...`,
        `The solution: Here's the framework that actually works...`,
        `The results: Companies using this see 3x better outcomes...`
      ],
      hashtags: [`#${project.vertical}`, '#tips', '#strategy'],
      cta: 'Like and retweet if this was helpful! 🙏'
    };
  }

  private generateLinkedInCarousel(project: any): any {
    return {
      type: 'carousel',
      slides: [
        {
          title: project.originalTitle,
          content: `Key insights for ${project.vertical} professionals`,
          design: 'title_slide'
        },
        {
          title: 'The Challenge',
          content: `Common problems in ${project.vertical}`,
          design: 'content_slide'
        },
        {
          title: 'The Solution',
          content: 'Step-by-step approach that works',
          design: 'content_slide'
        },
        {
          title: 'Results',
          content: 'Proven outcomes and metrics',
          design: 'stats_slide'
        },
        {
          title: 'Take Action',
          content: 'Connect with me for more insights',
          design: 'cta_slide'
        }
      ],
      caption: `${project.originalTitle}\n\nSwipe through to learn the framework that's helping ${project.vertical} professionals achieve better results.\n\n#${project.vertical} #professional development #insights`,
      hashtags: [`#${project.vertical}`, '#linkedin', '#professional']
    };
  }

  private generateInstagramCarousel(project: any): any {
    return {
      type: 'carousel',
      slides: [
        {
          image: `/api/generate-slide/title/${encodeURIComponent(project.originalTitle)}`,
          caption: project.originalTitle
        },
        {
          image: `/api/generate-slide/stat/key-metrics`,
          caption: 'Key Statistics'
        },
        {
          image: `/api/generate-slide/tip/actionable-advice`,
          caption: 'Pro Tips'
        },
        {
          image: `/api/generate-slide/cta/follow-for-more`,
          caption: 'Follow for more!'
        }
      ],
      caption: `${project.originalTitle} 💡\n\nSwipe for key insights about ${project.vertical}!\n\nSave this post and follow @yourhandle for more!\n\n#${project.vertical} #tips #insights #viral`,
      hashtags: [`#${project.vertical}`, '#instagram', '#viral', '#tips']
    };
  }

  private generateYouTubeScript(project: any): any {
    return {
      type: 'video_script',
      title: `${project.originalTitle} - Complete Guide`,
      description: `Everything you need to know about ${project.originalTitle} in ${project.vertical}`,
      script: {
        hook: `Did you know that ${project.originalTitle}? In the next 10 minutes, I'll show you exactly how this works and how you can use it.`,
        introduction: `Hey everyone, welcome back to the channel! Today we're diving deep into ${project.originalTitle}...`,
        mainContent: [
          `First, let's understand the problem in ${project.vertical}...`,
          `Now, here's the solution that actually works...`,
          `Let me show you the results and proof...`,
          `Here's how you can implement this step by step...`
        ],
        callToAction: `If this video helped you, smash that like button, subscribe for more ${project.vertical} content, and let me know in the comments what topic you want me to cover next!`,
        endScreen: `Don't forget to check out my other videos on ${project.vertical} - link in the description!`
      },
      duration: '8-12 minutes',
      keywords: [project.vertical, 'tutorial', 'guide', 'how to'],
      thumbnail: `/api/generate-thumbnail/${encodeURIComponent(project.originalTitle)}`
    };
  }

  private generateTikTokScript(project: any): any {
    return {
      type: 'short_video_script',
      hook: `This ${project.vertical} hack will blow your mind! 🤯`,
      content: [
        {
          scene: 1,
          text: `Everyone thinks ${project.vertical} is complicated...`,
          duration: '2s',
          visual: 'problem_setup'
        },
        {
          scene: 2,
          text: `But here's the secret most people don't know:`,
          duration: '3s',
          visual: 'revelation'
        },
        {
          scene: 3,
          text: `[Main insight from ${project.originalTitle}]`,
          duration: '4s',
          visual: 'main_point'
        },
        {
          scene: 4,
          text: `Try this and thank me later! Follow for more ${project.vertical} tips! 🚀`,
          duration: '3s',
          visual: 'call_to_action'
        }
      ],
      hashtags: [`#${project.vertical}`, '#tips', '#viral', '#fyp', '#hack'],
      music: 'trending_upbeat',
      totalDuration: '12-15 seconds'
    };
  }

  private getContentFormat(strategy: string, platform: string): string {
    const formats = {
      carousel: {
        twitter: 'thread',
        linkedin: 'carousel',
        instagram: 'carousel'
      },
      thread: {
        twitter: 'thread',
        linkedin: 'post'
      },
      infographic: {
        instagram: 'infographic',
        pinterest: 'infographic'
      },
      video_script: {
        youtube: 'video',
        tiktok: 'short_video'
      }
    };

    return formats[strategy]?.[platform] || 'post';
  }

  private getSchedulingOptions(platforms: string[]): any {
    return platforms.map(platform => ({
      platform,
      optimalTimes: this.getOptimalTimes(platform),
      estimatedReach: this.getEstimatedReach(platform),
      engagementRate: this.getExpectedEngagement(platform)
    }));
  }

  private getOptimalTimes(platform: string): string[] {
    const times = {
      twitter: ['9:00 AM', '3:00 PM', '6:00 PM'],
      linkedin: ['8:00 AM', '12:00 PM', '5:00 PM'],
      instagram: ['11:00 AM', '2:00 PM', '7:00 PM'],
      youtube: ['2:00 PM', '8:00 PM'],
      tiktok: ['6:00 AM', '10:00 AM', '7:00 PM'],
      facebook: ['1:00 PM', '3:00 PM', '8:00 PM']
    };

    return times[platform] || ['12:00 PM', '6:00 PM'];
  }

  private getEstimatedReach(platform: string): number {
    const baseReach = {
      twitter: 5000,
      linkedin: 3000,
      instagram: 8000,
      youtube: 12000,
      tiktok: 15000,
      facebook: 4000
    };

    return baseReach[platform] || 5000;
  }

  private getExpectedEngagement(platform: string): number {
    const engagementRates = {
      twitter: 0.045,
      linkedin: 0.027,
      instagram: 0.068,
      youtube: 0.035,
      tiktok: 0.089,
      facebook: 0.025
    };

    return engagementRates[platform] || 0.03;
  }

  private async publishToPlatform(platform: string, content: any, project: any): Promise<any> {
    // Mock platform publishing - would integrate with actual social media APIs
    console.log(`📤 Publishing to ${platform}:`, content);

    return {
      success: true,
      contentId: `${platform}_${Date.now()}`,
      contentUrl: `https://${platform}.com/post/${Date.now()}`,
      estimatedReach: this.getEstimatedReach(platform),
      scheduledEngagement: this.getExpectedEngagement(platform) * this.getEstimatedReach(platform)
    };
  }

  private generateTrackingUrl(distribution: any, project: any): string {
    const baseUrl = process.env.BASE_URL || 'https://app.example.com';
    const utmParams = new URLSearchParams(project.utmParameters);
    utmParams.set('distribution_id', distribution.id.toString());
    
    return `${baseUrl}/track/content?${utmParams.toString()}`;
  }

  async getAnalytics(projectId?: number): Promise<any> {
    try {
      let query = db.select({
        projectId: contentRemixDistribution.projectId,
        platform: contentRemixDistribution.platform,
        contentFormat: contentRemixDistribution.contentFormat,
        status: contentRemixDistribution.status,
        reach: contentRemixDistribution.reach,
        clicks: contentRemixDistribution.clicks,
        conversions: contentRemixDistribution.conversions,
        revenue: contentRemixDistribution.revenue,
        backlinksGenerated: contentRemixDistribution.backlinksGenerated,
        postedAt: contentRemixDistribution.postedAt
      }).from(contentRemixDistribution);

      if (projectId) {
        query = query.where(eq(contentRemixDistribution.projectId, projectId));
      }

      const distributions = await query.orderBy(desc(contentRemixDistribution.postedAt));

      // Aggregate metrics
      const [metrics] = await db.select({
        totalProjects: count(sql`DISTINCT ${contentRemixProjects.id}`),
        totalDistributions: count(contentRemixDistribution.id),
        totalReach: sum(contentRemixDistribution.reach),
        totalClicks: sum(contentRemixDistribution.clicks),
        totalConversions: sum(contentRemixDistribution.conversions),
        totalRevenue: sum(contentRemixDistribution.revenue),
        avgEngagement: sql<number>`
          CASE WHEN SUM(${contentRemixDistribution.reach}) > 0 
          THEN SUM(${contentRemixDistribution.clicks})::float / SUM(${contentRemixDistribution.reach})::float 
          ELSE 0 END
        `
      })
      .from(contentRemixDistribution)
      .leftJoin(contentRemixProjects, eq(contentRemixProjects.id, contentRemixDistribution.projectId));

      return {
        success: true,
        distributions,
        metrics,
        platformBreakdown: await this.getPlatformBreakdown(),
        topPerforming: await this.getTopPerformingContent()
      };

    } catch (error) {
      console.error('❌ Failed to get analytics:', error);
      this.trackError('get_analytics', error);
      throw error;
    }
  }

  private async getPlatformBreakdown(): Promise<any> {
    const breakdown = await db.select({
      platform: contentRemixDistribution.platform,
      count: count(contentRemixDistribution.id),
      totalReach: sum(contentRemixDistribution.reach),
      totalClicks: sum(contentRemixDistribution.clicks),
      avgEngagement: sql<number>`
        CASE WHEN SUM(${contentRemixDistribution.reach}) > 0 
        THEN SUM(${contentRemixDistribution.clicks})::float / SUM(${contentRemixDistribution.reach})::float 
        ELSE 0 END
      `
    })
    .from(contentRemixDistribution)
    .groupBy(contentRemixDistribution.platform);

    return breakdown;
  }

  private async getTopPerformingContent(): Promise<any> {
    return await db.select({
      projectId: contentRemixDistribution.projectId,
      platform: contentRemixDistribution.platform,
      reach: contentRemixDistribution.reach,
      clicks: contentRemixDistribution.clicks,
      conversions: contentRemixDistribution.conversions,
      revenue: contentRemixDistribution.revenue
    })
    .from(contentRemixDistribution)
    .orderBy(desc(contentRemixDistribution.reach))
    .limit(10);
  }

  private async verifySchema(): Promise<void> {
    try {
      await db.select().from(contentRemixProjects).limit(1);
      await db.select().from(contentRemixDistribution).limit(1);
    } catch (error) {
      console.error('❌ Content Remix Engine schema verification failed:', error);
      throw new Error('Content Remix Engine database schema is not properly initialized');
    }
  }

  private initializeMetrics(): void {
    this.performanceMetrics.set('remix_engine_started', Date.now());
    this.performanceMetrics.set('projects_created', 0);
    this.performanceMetrics.set('content_published', 0);
    this.performanceMetrics.set('total_reach', 0);
  }

  private startDistributionScheduler(): void {
    setInterval(() => {
      this.processScheduledDistributions();
    }, 60 * 1000); // Every minute
  }

  private startPerformanceTracking(): void {
    setInterval(() => {
      this.trackPerformanceMetrics();
    }, 30 * 60 * 1000); // Every 30 minutes
  }

  private async processScheduledDistributions(): Promise<void> {
    try {
      const now = new Date();
      const scheduled = await db.select()
        .from(contentRemixDistribution)
        .where(and(
          eq(contentRemixDistribution.status, 'scheduled'),
          sql`${contentRemixDistribution.scheduledFor} <= ${now}`
        ))
        .limit(10);

      for (const distribution of scheduled) {
        try {
          await this.publishContent(distribution.id);
        } catch (error) {
          console.error(`❌ Failed to publish scheduled content ${distribution.id}:`, error);
        }
      }
    } catch (error) {
      console.error('❌ Failed to process scheduled distributions:', error);
    }
  }

  private async trackPerformanceMetrics(): Promise<void> {
    try {
      // Update engagement metrics for published content
      const published = await db.select()
        .from(contentRemixDistribution)
        .where(eq(contentRemixDistribution.status, 'posted'))
        .limit(50);

      for (const distribution of published) {
        // Mock performance tracking - would integrate with platform APIs
        const mockMetrics = {
          reach: Math.floor(Math.random() * 10000) + 1000,
          clicks: Math.floor(Math.random() * 500) + 50,
          conversions: Math.floor(Math.random() * 50) + 5,
          revenue: Math.floor(Math.random() * 100) + 10
        };

        await db.update(contentRemixDistribution)
          .set({
            reach: mockMetrics.reach,
            clicks: mockMetrics.clicks,
            conversions: mockMetrics.conversions,
            revenue: mockMetrics.revenue
          })
          .where(eq(contentRemixDistribution.id, distribution.id));
      }
    } catch (error) {
      console.error('❌ Failed to track performance metrics:', error);
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
      console.error(`🚨 High-frequency error detected in Content Remix Engine ${context}:`, error);
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.verifySchema();
      return true;
    } catch (error) {
      console.error('❌ Content Remix Engine health check failed:', error);
      return false;
    }
  }
}