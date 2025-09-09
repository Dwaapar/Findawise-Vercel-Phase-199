/**
 * UGC COMMUNITY SYSTEM - EMPIRE GRADE
 * Complete User Generated Content Framework with AI Moderation
 * Community Management, Content Curation, and Engagement Systems
 */

import { db } from '../../db';
import { sql } from 'drizzle-orm';

interface UGCContent {
  id: string;
  userId: string;
  contentType: 'post' | 'image' | 'video' | 'audio' | 'document';
  title: string;
  content: string;
  mediaUrl?: string;
  tags: string[];
  category: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged' | 'archived';
  moderationScore: number;
  visibility: 'public' | 'private' | 'community' | 'premium';
  likes: number;
  views: number;
  shares: number;
  comments: number;
  reports: number;
  createdAt: Date;
  updatedAt: Date;
  metadata: any;
}

interface ModerationRule {
  id: string;
  name: string;
  type: 'ai' | 'keyword' | 'regex' | 'length' | 'custom';
  pattern: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  action: 'flag' | 'review' | 'reject' | 'auto_approve';
  enabled: boolean;
  createdAt: Date;
}

interface CommunityMember {
  id: string;
  userId: string;
  communityId: string;
  role: 'member' | 'moderator' | 'admin' | 'banned';
  reputation: number;
  contributionScore: number;
  joinedAt: Date;
  lastActive: Date;
}

export class UGCEngine {
  private static instance: UGCEngine;

  static getInstance(): UGCEngine {
    if (!UGCEngine.instance) {
      UGCEngine.instance = new UGCEngine();
    }
    return UGCEngine.instance;
  }

  async initialize(): Promise<void> {
    await this.initializeTables();
    await this.initializeDefaultModerationRules();
    console.log('✅ UGC Community System initialized');
  }

  private async initializeTables(): Promise<void> {
    try {
      // Create UGC content table
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS ugc_content (
          id VARCHAR(255) PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          content_type VARCHAR(50) NOT NULL,
          title VARCHAR(500) NOT NULL,
          content TEXT,
          media_url VARCHAR(1000),
          tags JSONB DEFAULT '[]',
          category VARCHAR(100),
          status VARCHAR(50) DEFAULT 'pending',
          moderation_score INTEGER DEFAULT 0,
          visibility VARCHAR(50) DEFAULT 'public',
          likes INTEGER DEFAULT 0,
          views INTEGER DEFAULT 0,
          shares INTEGER DEFAULT 0,
          comments INTEGER DEFAULT 0,
          reports INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          metadata JSONB DEFAULT '{}'
        )
      `);

      // Create moderation rules table
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS moderation_rules (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          type VARCHAR(50) NOT NULL,
          pattern TEXT NOT NULL,
          severity VARCHAR(50) NOT NULL,
          action VARCHAR(50) NOT NULL,
          enabled BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create community members table
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS community_members (
          id VARCHAR(255) PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          community_id VARCHAR(255) NOT NULL DEFAULT 'main',
          role VARCHAR(50) DEFAULT 'member',
          reputation INTEGER DEFAULT 0,
          contribution_score INTEGER DEFAULT 0,
          joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create UGC comments table
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS ugc_comments (
          id VARCHAR(255) PRIMARY KEY,
          content_id VARCHAR(255) NOT NULL REFERENCES ugc_content(id),
          user_id VARCHAR(255) NOT NULL,
          parent_id VARCHAR(255),
          comment TEXT NOT NULL,
          status VARCHAR(50) DEFAULT 'approved',
          likes INTEGER DEFAULT 0,
          reports INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create content reports table
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS content_reports (
          id VARCHAR(255) PRIMARY KEY,
          content_id VARCHAR(255) NOT NULL REFERENCES ugc_content(id),
          reporter_id VARCHAR(255) NOT NULL,
          reason VARCHAR(255) NOT NULL,
          description TEXT,
          status VARCHAR(50) DEFAULT 'pending',
          reviewed_by VARCHAR(255),
          reviewed_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create performance indexes
      await db.execute(sql`
        CREATE INDEX IF NOT EXISTS idx_ugc_content_user_id ON ugc_content(user_id);
        CREATE INDEX IF NOT EXISTS idx_ugc_content_status ON ugc_content(status);
        CREATE INDEX IF NOT EXISTS idx_ugc_content_category ON ugc_content(category);
        CREATE INDEX IF NOT EXISTS idx_ugc_content_created_at ON ugc_content(created_at);
        CREATE INDEX IF NOT EXISTS idx_ugc_comments_content_id ON ugc_comments(content_id);
        CREATE INDEX IF NOT EXISTS idx_community_members_user_id ON community_members(user_id);
        CREATE INDEX IF NOT EXISTS idx_content_reports_content_id ON content_reports(content_id);
      `);

    } catch (error) {
      console.error('Error initializing UGC tables:', error);
    }
  }

  private async initializeDefaultModerationRules(): Promise<void> {
    const defaultRules = [
      {
        id: 'rule_spam_detection',
        name: 'Spam Detection',
        type: 'ai',
        pattern: 'spam_classifier',
        severity: 'high',
        action: 'flag'
      },
      {
        id: 'rule_profanity_filter',
        name: 'Profanity Filter',
        type: 'keyword',
        pattern: 'profanity_wordlist',
        severity: 'medium',
        action: 'review'
      },
      {
        id: 'rule_length_check',
        name: 'Content Length Check',
        type: 'length',
        pattern: 'min:10,max:5000',
        severity: 'low',
        action: 'flag'
      },
      {
        id: 'rule_hate_speech',
        name: 'Hate Speech Detection',
        type: 'ai',
        pattern: 'hate_speech_classifier',
        severity: 'critical',
        action: 'reject'
      }
    ];

    for (const rule of defaultRules) {
      try {
        await db.execute(sql`
          INSERT INTO moderation_rules (id, name, type, pattern, severity, action, enabled)
          VALUES (${rule.id}, ${rule.name}, ${rule.type}, ${rule.pattern}, ${rule.severity}, ${rule.action}, true)
          ON CONFLICT (id) DO NOTHING
        `);
      } catch (error) {
        console.log('Moderation rule already exists:', rule.id);
      }
    }
  }

  async submitContent(userId: string, contentData: Partial<UGCContent>): Promise<UGCContent> {
    try {
      const contentId = `ugc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Run moderation check
      const moderationResult = await this.moderateContent(contentData.content || '', contentData.title || '');
      
      const content: UGCContent = {
        id: contentId,
        userId,
        contentType: contentData.contentType || 'post',
        title: contentData.title || 'Untitled',
        content: contentData.content || '',
        mediaUrl: contentData.mediaUrl,
        tags: contentData.tags || [],
        category: contentData.category || 'general',
        status: moderationResult.autoApprove ? 'approved' : 'pending',
        moderationScore: moderationResult.score,
        visibility: contentData.visibility || 'public',
        likes: 0,
        views: 0,
        shares: 0,
        comments: 0,
        reports: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: contentData.metadata || {}
      };

      await db.execute(sql`
        INSERT INTO ugc_content (
          id, user_id, content_type, title, content, media_url, tags,
          category, status, moderation_score, visibility, likes, views,
          shares, comments, reports, created_at, updated_at, metadata
        ) VALUES (
          ${content.id}, ${content.userId}, ${content.contentType}, ${content.title},
          ${content.content}, ${content.mediaUrl}, ${JSON.stringify(content.tags)},
          ${content.category}, ${content.status}, ${content.moderationScore},
          ${content.visibility}, ${content.likes}, ${content.views}, ${content.shares},
          ${content.comments}, ${content.reports}, ${content.createdAt},
          ${content.updatedAt}, ${JSON.stringify(content.metadata)}
        )
      `);

      // Update user contribution score
      await this.updateUserContribution(userId, 10);

      return content;
    } catch (error) {
      console.error('Error submitting content:', error);
      throw new Error('Failed to submit content');
    }
  }

  private async moderateContent(content: string, title: string): Promise<{ score: number; autoApprove: boolean; flags: string[] }> {
    try {
      let score = 100; // Start with perfect score
      const flags: string[] = [];

      // Get active moderation rules
      const rules = await db.execute(sql`
        SELECT * FROM moderation_rules WHERE enabled = true
      `);

      for (const rule of rules.rows) {
        const ruleData = rule as any;
        
        switch (ruleData.type) {
          case 'length':
            const lengthCheck = this.checkLength(content, ruleData.pattern);
            if (!lengthCheck.passed) {
              score -= this.getSeverityPenalty(ruleData.severity);
              flags.push(`Length violation: ${lengthCheck.reason}`);
            }
            break;
            
          case 'keyword':
            const keywordCheck = this.checkKeywords(content + ' ' + title, ruleData.pattern);
            if (!keywordCheck.passed) {
              score -= this.getSeverityPenalty(ruleData.severity);
              flags.push(`Keyword violation: ${keywordCheck.reason}`);
            }
            break;
            
          case 'ai':
            // Simulated AI moderation (would integrate with real AI service)
            const aiCheck = await this.aiModerationCheck(content, ruleData.pattern);
            if (!aiCheck.passed) {
              score -= this.getSeverityPenalty(ruleData.severity);
              flags.push(`AI detection: ${aiCheck.reason}`);
            }
            break;
        }
      }

      return {
        score: Math.max(0, score),
        autoApprove: score >= 80 && flags.length === 0,
        flags
      };
    } catch (error) {
      console.error('Error in content moderation:', error);
      return { score: 50, autoApprove: false, flags: ['Moderation error'] };
    }
  }

  private checkLength(content: string, pattern: string): { passed: boolean; reason?: string } {
    const matches = pattern.match(/min:(\d+),max:(\d+)/);
    if (!matches) return { passed: true };
    
    const min = parseInt(matches[1]);
    const max = parseInt(matches[2]);
    
    if (content.length < min) {
      return { passed: false, reason: `Content too short (${content.length} < ${min})` };
    }
    if (content.length > max) {
      return { passed: false, reason: `Content too long (${content.length} > ${max})` };
    }
    
    return { passed: true };
  }

  private checkKeywords(text: string, pattern: string): { passed: boolean; reason?: string } {
    // Simplified keyword checking (would use comprehensive wordlists)
    const badWords = ['spam', 'scam', 'fake', 'illegal', 'hate'];
    const lowerText = text.toLowerCase();
    
    for (const word of badWords) {
      if (lowerText.includes(word)) {
        return { passed: false, reason: `Contains prohibited word: ${word}` };
      }
    }
    
    return { passed: true };
  }

  private async aiModerationCheck(content: string, classifier: string): Promise<{ passed: boolean; reason?: string }> {
    // Simulated AI moderation (would integrate with real AI service)
    try {
      // Random simulation for demo
      const isSpam = Math.random() < 0.05; // 5% chance of being flagged as spam
      const isHateSpeech = Math.random() < 0.02; // 2% chance of being flagged as hate speech
      
      if (classifier === 'spam_classifier' && isSpam) {
        return { passed: false, reason: 'AI detected potential spam content' };
      }
      
      if (classifier === 'hate_speech_classifier' && isHateSpeech) {
        return { passed: false, reason: 'AI detected potential hate speech' };
      }
      
      return { passed: true };
    } catch (error) {
      return { passed: false, reason: 'AI moderation service unavailable' };
    }
  }

  private getSeverityPenalty(severity: string): number {
    switch (severity) {
      case 'low': return 5;
      case 'medium': return 15;
      case 'high': return 30;
      case 'critical': return 50;
      default: return 10;
    }
  }

  async getContent(filters: any = {}): Promise<UGCContent[]> {
    try {
      let query = sql`SELECT * FROM ugc_content WHERE status = 'approved'`;
      
      if (filters.category) {
        query = sql`${query} AND category = ${filters.category}`;
      }
      
      if (filters.userId) {
        query = sql`${query} AND user_id = ${filters.userId}`;
      }
      
      if (filters.contentType) {
        query = sql`${query} AND content_type = ${filters.contentType}`;
      }
      
      query = sql`${query} ORDER BY created_at DESC LIMIT ${filters.limit || 20} OFFSET ${filters.offset || 0}`;
      
      const result = await db.execute(query);
      return result.rows as UGCContent[];
    } catch (error) {
      console.error('Error fetching content:', error);
      return [];
    }
  }

  async updateContentStats(contentId: string, action: 'view' | 'like' | 'share'): Promise<void> {
    try {
      let updateQuery: any;
      
      switch (action) {
        case 'view':
          updateQuery = sql`UPDATE ugc_content SET views = views + 1 WHERE id = ${contentId}`;
          break;
        case 'like':
          updateQuery = sql`UPDATE ugc_content SET likes = likes + 1 WHERE id = ${contentId}`;
          break;
        case 'share':
          updateQuery = sql`UPDATE ugc_content SET shares = shares + 1 WHERE id = ${contentId}`;
          break;
      }
      
      await db.execute(updateQuery);
    } catch (error) {
      console.error('Error updating content stats:', error);
    }
  }

  async addComment(contentId: string, userId: string, comment: string, parentId?: string): Promise<any> {
    try {
      const commentId = `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Moderate comment
      const moderationResult = await this.moderateContent(comment, '');
      const status = moderationResult.autoApprove ? 'approved' : 'pending';
      
      await db.execute(sql`
        INSERT INTO ugc_comments (id, content_id, user_id, parent_id, comment, status, created_at)
        VALUES (${commentId}, ${contentId}, ${userId}, ${parentId || null}, ${comment}, ${status}, CURRENT_TIMESTAMP)
      `);
      
      // Update comment count on content
      await db.execute(sql`
        UPDATE ugc_content SET comments = comments + 1 WHERE id = ${contentId}
      `);
      
      return { id: commentId, status };
    } catch (error) {
      console.error('Error adding comment:', error);
      throw new Error('Failed to add comment');
    }
  }

  async reportContent(contentId: string, reporterId: string, reason: string, description?: string): Promise<void> {
    try {
      const reportId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await db.execute(sql`
        INSERT INTO content_reports (id, content_id, reporter_id, reason, description, created_at)
        VALUES (${reportId}, ${contentId}, ${reporterId}, ${reason}, ${description || ''}, CURRENT_TIMESTAMP)
      `);
      
      // Update report count on content
      await db.execute(sql`
        UPDATE ugc_content SET reports = reports + 1 WHERE id = ${contentId}
      `);
      
      // Auto-flag content if it gets too many reports
      const reportCount = await db.execute(sql`
        SELECT reports FROM ugc_content WHERE id = ${contentId}
      `);
      
      if (reportCount.rows[0] && (reportCount.rows[0] as any).reports >= 5) {
        await db.execute(sql`
          UPDATE ugc_content SET status = 'flagged' WHERE id = ${contentId}
        `);
      }
    } catch (error) {
      console.error('Error reporting content:', error);
      throw new Error('Failed to report content');
    }
  }

  async updateUserContribution(userId: string, points: number): Promise<void> {
    try {
      await db.execute(sql`
        INSERT INTO community_members (id, user_id, contribution_score, last_active)
        VALUES (CONCAT('member_', ${userId}), ${userId}, ${points}, CURRENT_TIMESTAMP)
        ON CONFLICT (id) DO UPDATE SET 
          contribution_score = community_members.contribution_score + ${points},
          last_active = CURRENT_TIMESTAMP
      `);
    } catch (error) {
      console.error('Error updating user contribution:', error);
    }
  }

  async getCommunityStats(): Promise<any> {
    try {
      const stats = await db.execute(sql`
        SELECT 
          COUNT(*) as total_content,
          COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_content,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_content,
          COUNT(CASE WHEN status = 'flagged' THEN 1 END) as flagged_content,
          SUM(views) as total_views,
          SUM(likes) as total_likes,
          SUM(shares) as total_shares,
          SUM(comments) as total_comments
        FROM ugc_content
      `);
      
      return stats.rows[0] || {};
    } catch (error) {
      console.error('Error fetching community stats:', error);
      return {};
    }
  }
}

export const ugcEngine = UGCEngine.getInstance();