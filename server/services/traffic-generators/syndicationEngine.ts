/**
 * SYNDICATION ENGINE - EMPIRE GRADE
 * Content Distribution and Network Integration System
 * Multi-platform publishing, RSS feeds, and partnership networks
 */

import { db } from '../../db';
import { sql } from 'drizzle-orm';

interface SyndicationNetwork {
  id: string;
  name: string;
  type: 'rss' | 'api' | 'webhook' | 'partner';
  endpoint: string;
  authMethod: 'none' | 'api_key' | 'oauth' | 'basic';
  credentials: any;
  isActive: boolean;
  settings: any;
  lastSync: Date;
  successRate: number;
}

interface SyndicationContent {
  id: string;
  sourceId: string;
  sourceType: 'blog' | 'news' | 'product' | 'video' | 'course';
  title: string;
  content: string;
  excerpt: string;
  mediaUrls: string[];
  tags: string[];
  category: string;
  publishedAt: Date;
  syndicatedTo: string[];
  status: 'pending' | 'syndicating' | 'completed' | 'failed';
}

interface SyndicationRule {
  id: string;
  name: string;
  sourceFilter: any;
  targetNetworks: string[];
  transformations: any;
  schedule: string;
  isActive: boolean;
}

export class SyndicationEngine {
  private static instance: SyndicationEngine;

  static getInstance(): SyndicationEngine {
    if (!SyndicationEngine.instance) {
      SyndicationEngine.instance = new SyndicationEngine();
    }
    return SyndicationEngine.instance;
  }

  async initialize(): Promise<void> {
    await this.initializeTables();
    await this.seedDefaultNetworks();
    await this.initializeScheduler();
    console.log('✅ Syndication Engine initialized');
  }

  private async initializeTables(): Promise<void> {
    try {
      // Create syndication networks table
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS syndication_networks (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          type VARCHAR(50) NOT NULL,
          endpoint VARCHAR(1000) NOT NULL,
          auth_method VARCHAR(50) DEFAULT 'none',
          credentials JSONB DEFAULT '{}',
          is_active BOOLEAN DEFAULT true,
          settings JSONB DEFAULT '{}',
          last_sync TIMESTAMP,
          success_rate DECIMAL(5,2) DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create syndication content table
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS syndication_content (
          id VARCHAR(255) PRIMARY KEY,
          source_id VARCHAR(255) NOT NULL,
          source_type VARCHAR(50) NOT NULL,
          title VARCHAR(500) NOT NULL,
          content TEXT,
          excerpt TEXT,
          media_urls JSONB DEFAULT '[]',
          tags JSONB DEFAULT '[]',
          category VARCHAR(100),
          published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          syndicated_to JSONB DEFAULT '[]',
          status VARCHAR(50) DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create syndication rules table
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS syndication_rules (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          source_filter JSONB DEFAULT '{}',
          target_networks JSONB DEFAULT '[]',
          transformations JSONB DEFAULT '{}',
          schedule VARCHAR(100) DEFAULT 'immediate',
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create syndication logs table
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS syndication_logs (
          id VARCHAR(255) PRIMARY KEY,
          content_id VARCHAR(255) NOT NULL REFERENCES syndication_content(id),
          network_id VARCHAR(255) NOT NULL REFERENCES syndication_networks(id),
          status VARCHAR(50) NOT NULL,
          response_data JSONB,
          error_message TEXT,
          synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create indexes
      await db.execute(sql`
        CREATE INDEX IF NOT EXISTS idx_syndication_content_source_id ON syndication_content(source_id);
        CREATE INDEX IF NOT EXISTS idx_syndication_content_status ON syndication_content(status);
        CREATE INDEX IF NOT EXISTS idx_syndication_content_published_at ON syndication_content(published_at);
        CREATE INDEX IF NOT EXISTS idx_syndication_logs_content_id ON syndication_logs(content_id);
        CREATE INDEX IF NOT EXISTS idx_syndication_logs_network_id ON syndication_logs(network_id);
      `);

    } catch (error) {
      console.error('Error initializing Syndication tables:', error);
    }
  }

  private async seedDefaultNetworks(): Promise<void> {
    const defaultNetworks = [
      {
        id: 'medium_api',
        name: 'Medium',
        type: 'api',
        endpoint: 'https://api.medium.com/v1',
        authMethod: 'api_key',
        settings: {
          publicationId: '',
          defaultTags: ['technology', 'startup'],
          contentType: 'html'
        }
      },
      {
        id: 'dev_to_api',
        name: 'Dev.to',
        type: 'api',
        endpoint: 'https://dev.to/api',
        authMethod: 'api_key',
        settings: {
          organization: '',
          series: '',
          defaultTags: ['webdev', 'programming']
        }
      },
      {
        id: 'hashnode_api',
        name: 'Hashnode',
        type: 'api',
        endpoint: 'https://api.hashnode.com',
        authMethod: 'api_key',
        settings: {
          publicationId: '',
          defaultTags: ['tech', 'coding']
        }
      },
      {
        id: 'linkedin_api',
        name: 'LinkedIn',
        type: 'api',
        endpoint: 'https://api.linkedin.com/v2',
        authMethod: 'oauth',
        settings: {
          visibility: 'PUBLIC',
          defaultHashtags: ['#technology', '#innovation']
        }
      },
      {
        id: 'rss_feed',
        name: 'RSS Feed',
        type: 'rss',
        endpoint: '/feed.xml',
        authMethod: 'none',
        settings: {
          title: 'Findawise Empire Feed',
          description: 'Latest content from Findawise Empire',
          maxItems: 50
        }
      }
    ];

    for (const network of defaultNetworks) {
      try {
        await db.execute(sql`
          INSERT INTO syndication_networks (
            id, name, type, endpoint, auth_method, settings
          ) VALUES (
            ${network.id}, ${network.name}, ${network.type}, 
            ${network.endpoint}, ${network.authMethod}, ${JSON.stringify(network.settings)}
          ) ON CONFLICT (id) DO NOTHING
        `);
      } catch (error) {
        console.log('Network already exists:', network.id);
      }
    }
  }

  async addContent(contentData: Partial<SyndicationContent>): Promise<SyndicationContent> {
    try {
      const contentId = `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const content: SyndicationContent = {
        id: contentId,
        sourceId: contentData.sourceId || '',
        sourceType: contentData.sourceType || 'blog',
        title: contentData.title || 'Untitled',
        content: contentData.content || '',
        excerpt: contentData.excerpt || contentData.content?.substring(0, 200) || '',
        mediaUrls: contentData.mediaUrls || [],
        tags: contentData.tags || [],
        category: contentData.category || 'general',
        publishedAt: contentData.publishedAt || new Date(),
        syndicatedTo: [],
        status: 'pending'
      };

      await db.execute(sql`
        INSERT INTO syndication_content (
          id, source_id, source_type, title, content, excerpt, media_urls,
          tags, category, published_at, syndicated_to, status
        ) VALUES (
          ${content.id}, ${content.sourceId}, ${content.sourceType}, ${content.title},
          ${content.content}, ${content.excerpt}, ${JSON.stringify(content.mediaUrls)},
          ${JSON.stringify(content.tags)}, ${content.category}, ${content.publishedAt},
          ${JSON.stringify(content.syndicatedTo)}, ${content.status}
        )
      `);

      // Trigger syndication
      await this.triggerSyndication(contentId);

      return content;
    } catch (error) {
      console.error('Error adding content:', error);
      throw new Error('Failed to add content for syndication');
    }
  }

  private async triggerSyndication(contentId: string): Promise<void> {
    try {
      // Get active syndication rules
      const rules = await db.execute(sql`
        SELECT * FROM syndication_rules WHERE is_active = true
      `);

      // Get content
      const contentResult = await db.execute(sql`
        SELECT * FROM syndication_content WHERE id = ${contentId}
      `);

      if (!contentResult.rows.length) return;

      const content = contentResult.rows[0] as any;

      // Apply rules and syndicate
      for (const rule of rules.rows) {
        const ruleData = rule as any;
        
        if (this.matchesFilter(content, ruleData.source_filter)) {
          for (const networkId of ruleData.target_networks) {
            await this.syndicateToNetwork(contentId, networkId, ruleData.transformations);
          }
        }
      }
    } catch (error) {
      console.error('Error triggering syndication:', error);
    }
  }

  private matchesFilter(content: any, filter: any): boolean {
    // Simple filter matching logic
    if (filter.sourceType && content.source_type !== filter.sourceType) return false;
    if (filter.category && content.category !== filter.category) return false;
    if (filter.tags && filter.tags.length > 0) {
      const contentTags = content.tags || [];
      const hasMatchingTag = filter.tags.some((tag: string) => contentTags.includes(tag));
      if (!hasMatchingTag) return false;
    }
    return true;
  }

  private async syndicateToNetwork(contentId: string, networkId: string, transformations: any): Promise<void> {
    try {
      // Get network details
      const networkResult = await db.execute(sql`
        SELECT * FROM syndication_networks WHERE id = ${networkId} AND is_active = true
      `);

      if (!networkResult.rows.length) return;

      const network = networkResult.rows[0] as any;

      // Get content
      const contentResult = await db.execute(sql`
        SELECT * FROM syndication_content WHERE id = ${contentId}
      `);

      if (!contentResult.rows.length) return;

      const content = contentResult.rows[0] as any;

      // Transform content based on network requirements
      const transformedContent = this.transformContent(content, transformations, network.settings);

      // Syndicate based on network type
      let result;
      switch (network.type) {
        case 'api':
          result = await this.syndicateViaAPI(network, transformedContent);
          break;
        case 'rss':
          result = await this.updateRSSFeed(network, transformedContent);
          break;
        case 'webhook':
          result = await this.syndicateViaWebhook(network, transformedContent);
          break;
        default:
          result = { success: false, error: 'Unknown network type' };
      }

      // Log the result
      await this.logSyndicationResult(contentId, networkId, result);

      // Update content syndication status
      if (result.success) {
        await db.execute(sql`
          UPDATE syndication_content 
          SET syndicated_to = syndicated_to || ${JSON.stringify([networkId])},
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ${contentId}
        `);
      }

    } catch (error) {
      console.error('Error syndicating to network:', error);
      await this.logSyndicationResult(contentId, networkId, { success: false, error: error.message });
    }
  }

  private transformContent(content: any, transformations: any, networkSettings: any): any {
    let transformed = { ...content };

    // Apply transformations
    if (transformations.titlePrefix) {
      transformed.title = transformations.titlePrefix + transformed.title;
    }

    if (transformations.contentFormat === 'markdown' && content.content) {
      // Convert HTML to Markdown if needed
      transformed.content = this.htmlToMarkdown(content.content);
    }

    if (transformations.addTags && networkSettings.defaultTags) {
      transformed.tags = [...(transformed.tags || []), ...networkSettings.defaultTags];
    }

    if (transformations.excerpt && !transformed.excerpt) {
      transformed.excerpt = transformed.content?.substring(0, 200) + '...';
    }

    return transformed;
  }

  private htmlToMarkdown(html: string): string {
    // Simple HTML to Markdown conversion
    return html
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n')
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
      .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
      .replace(/<[^>]*>/g, ''); // Remove remaining HTML tags
  }

  private async syndicateViaAPI(network: any, content: any): Promise<any> {
    try {
      // Simulate API call (would use actual HTTP client)
      console.log(`📤 Syndicating "${content.title}" to ${network.name} via API`);
      
      // Different API implementations for different networks
      switch (network.id) {
        case 'medium_api':
          return this.syndicateToMedium(network, content);
        case 'dev_to_api':
          return this.syndicateToDevTo(network, content);
        case 'linkedin_api':
          return this.syndicateToLinkedIn(network, content);
        default:
          return { success: false, error: 'API not implemented for this network' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  private async syndicateToMedium(network: any, content: any): Promise<any> {
    // Medium API implementation (simulated)
    console.log(`📝 Publishing to Medium: ${content.title}`);
    return { success: true, externalId: `medium_${Date.now()}`, url: `https://medium.com/@user/${content.title}` };
  }

  private async syndicateToDevTo(network: any, content: any): Promise<any> {
    // Dev.to API implementation (simulated)
    console.log(`💻 Publishing to Dev.to: ${content.title}`);
    return { success: true, externalId: `devto_${Date.now()}`, url: `https://dev.to/user/${content.title}` };
  }

  private async syndicateToLinkedIn(network: any, content: any): Promise<any> {
    // LinkedIn API implementation (simulated)
    console.log(`💼 Publishing to LinkedIn: ${content.title}`);
    return { success: true, externalId: `linkedin_${Date.now()}`, url: `https://linkedin.com/posts/${Date.now()}` };
  }

  private async updateRSSFeed(network: any, content: any): Promise<any> {
    try {
      console.log(`📡 Adding to RSS feed: ${content.title}`);
      // RSS feed would be generated from database content
      return { success: true, message: 'Added to RSS feed' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  private async syndicateViaWebhook(network: any, content: any): Promise<any> {
    try {
      console.log(`🔗 Sending webhook to ${network.endpoint}: ${content.title}`);
      // Webhook implementation (simulated)
      return { success: true, message: 'Webhook sent successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  private async logSyndicationResult(contentId: string, networkId: string, result: any): Promise<void> {
    try {
      const logId = `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await db.execute(sql`
        INSERT INTO syndication_logs (
          id, content_id, network_id, status, response_data, error_message
        ) VALUES (
          ${logId}, ${contentId}, ${networkId}, ${result.success ? 'success' : 'failed'},
          ${JSON.stringify(result)}, ${result.error || null}
        )
      `);
    } catch (error) {
      console.error('Error logging syndication result:', error);
    }
  }

  async createRule(ruleData: Partial<SyndicationRule>): Promise<SyndicationRule> {
    try {
      const ruleId = `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const rule: SyndicationRule = {
        id: ruleId,
        name: ruleData.name || 'Untitled Rule',
        sourceFilter: ruleData.sourceFilter || {},
        targetNetworks: ruleData.targetNetworks || [],
        transformations: ruleData.transformations || {},
        schedule: ruleData.schedule || 'immediate',
        isActive: ruleData.isActive !== false
      };

      await db.execute(sql`
        INSERT INTO syndication_rules (
          id, name, source_filter, target_networks, transformations, schedule, is_active
        ) VALUES (
          ${rule.id}, ${rule.name}, ${JSON.stringify(rule.sourceFilter)},
          ${JSON.stringify(rule.targetNetworks)}, ${JSON.stringify(rule.transformations)},
          ${rule.schedule}, ${rule.isActive}
        )
      `);

      return rule;
    } catch (error) {
      console.error('Error creating syndication rule:', error);
      throw new Error('Failed to create syndication rule');
    }
  }

  async getNetworks(): Promise<SyndicationNetwork[]> {
    try {
      const result = await db.execute(sql`
        SELECT * FROM syndication_networks ORDER BY name
      `);
      return result.rows as SyndicationNetwork[];
    } catch (error) {
      console.error('Error fetching networks:', error);
      return [];
    }
  }

  async getSyndicationStats(): Promise<any> {
    try {
      const stats = await db.execute(sql`
        SELECT 
          COUNT(*) as total_content,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
          COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending
        FROM syndication_content
      `);

      const networkStats = await db.execute(sql`
        SELECT 
          sn.name,
          COUNT(sl.id) as total_syncs,
          COUNT(CASE WHEN sl.status = 'success' THEN 1 END) as successful_syncs
        FROM syndication_networks sn
        LEFT JOIN syndication_logs sl ON sn.id = sl.network_id
        GROUP BY sn.id, sn.name
      `);

      return {
        content: stats.rows[0],
        networks: networkStats.rows
      };
    } catch (error) {
      console.error('Error fetching syndication stats:', error);
      return {};
    }
  }

  private async initializeScheduler(): Promise<void> {
    // Schedule periodic syndication for delayed rules
    setInterval(async () => {
      try {
        // Process scheduled syndications
        const pendingContent = await db.execute(sql`
          SELECT * FROM syndication_content 
          WHERE status = 'pending' 
          AND published_at <= CURRENT_TIMESTAMP
          LIMIT 10
        `);

        for (const content of pendingContent.rows) {
          await this.triggerSyndication((content as any).id);
        }
      } catch (error) {
        console.error('Error in syndication scheduler:', error);
      }
    }, 60000); // Run every minute

    console.log('✅ Syndication scheduler initialized');
  }
}

export const syndicationEngine = SyndicationEngine.getInstance();