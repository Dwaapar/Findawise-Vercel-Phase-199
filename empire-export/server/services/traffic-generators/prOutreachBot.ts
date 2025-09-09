/**
 * PR OUTREACH BOT - EMPIRE GRADE
 * Automated Public Relations and Media Outreach System
 * Press Release Distribution, Journalist Contacts, and Campaign Management
 */

import { db } from '../../db';
import { sql } from 'drizzle-orm';
import nodemailer from 'nodemailer';

interface PRCampaign {
  id: string;
  userId: string;
  title: string;
  pressRelease: string;
  targetAudience: string[];
  status: 'draft' | 'scheduled' | 'sending' | 'completed' | 'paused';
  scheduledAt?: Date;
  sentCount: number;
  openRate: number;
  responseRate: number;
  createdAt: Date;
  metadata: any;
}

interface MediaContact {
  id: string;
  name: string;
  email: string;
  publication: string;
  beat: string[];
  tier: 'tier1' | 'tier2' | 'tier3';
  location: string;
  verified: boolean;
  lastContacted?: Date;
  responseHistory: any[];
}

interface OutreachTemplate {
  id: string;
  name: string;
  subject: string;
  template: string;
  type: 'press_release' | 'pitch' | 'follow_up' | 'announcement';
  variables: string[];
  performance: {
    sent: number;
    opened: number;
    responded: number;
  };
}

export class PROutreachBot {
  private static instance: PROutreachBot;
  private emailTransporter: any;

  static getInstance(): PROutreachBot {
    if (!PROutreachBot.instance) {
      PROutreachBot.instance = new PROutreachBot();
    }
    return PROutreachBot.instance;
  }

  async initialize(): Promise<void> {
    await this.initializeTables();
    await this.initializeEmailTransporter();
    await this.seedDefaultTemplates();
    await this.seedMediaContacts();
    console.log('✅ PR Outreach Bot initialized');
  }

  private async initializeTables(): Promise<void> {
    try {
      // Create PR campaigns table
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS pr_campaigns (
          id VARCHAR(255) PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          title VARCHAR(500) NOT NULL,
          press_release TEXT NOT NULL,
          target_audience JSONB DEFAULT '[]',
          status VARCHAR(50) DEFAULT 'draft',
          scheduled_at TIMESTAMP,
          sent_count INTEGER DEFAULT 0,
          open_rate DECIMAL(5,2) DEFAULT 0,
          response_rate DECIMAL(5,2) DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          metadata JSONB DEFAULT '{}'
        )
      `);

      // Create media contacts table
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS media_contacts (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          publication VARCHAR(255),
          beat JSONB DEFAULT '[]',
          tier VARCHAR(50) DEFAULT 'tier3',
          location VARCHAR(255),
          verified BOOLEAN DEFAULT false,
          last_contacted TIMESTAMP,
          response_history JSONB DEFAULT '[]',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create outreach templates table
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS outreach_templates (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          subject VARCHAR(500) NOT NULL,
          template TEXT NOT NULL,
          type VARCHAR(50) NOT NULL,
          variables JSONB DEFAULT '[]',
          performance JSONB DEFAULT '{"sent": 0, "opened": 0, "responded": 0}',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create outreach sends table
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS outreach_sends (
          id VARCHAR(255) PRIMARY KEY,
          campaign_id VARCHAR(255) NOT NULL REFERENCES pr_campaigns(id),
          contact_id VARCHAR(255) NOT NULL REFERENCES media_contacts(id),
          template_id VARCHAR(255) NOT NULL REFERENCES outreach_templates(id),
          subject VARCHAR(500) NOT NULL,
          content TEXT NOT NULL,
          status VARCHAR(50) DEFAULT 'sent',
          sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          opened_at TIMESTAMP,
          clicked_at TIMESTAMP,
          replied_at TIMESTAMP,
          tracking_id VARCHAR(255) UNIQUE
        )
      `);

      // Create performance indexes
      await db.execute(sql`
        CREATE INDEX IF NOT EXISTS idx_pr_campaigns_user_id ON pr_campaigns(user_id);
        CREATE INDEX IF NOT EXISTS idx_pr_campaigns_status ON pr_campaigns(status);
        CREATE INDEX IF NOT EXISTS idx_media_contacts_email ON media_contacts(email);
        CREATE INDEX IF NOT EXISTS idx_media_contacts_tier ON media_contacts(tier);
        CREATE INDEX IF NOT EXISTS idx_outreach_sends_campaign_id ON outreach_sends(campaign_id);
        CREATE INDEX IF NOT EXISTS idx_outreach_sends_tracking_id ON outreach_sends(tracking_id);
      `);

    } catch (error) {
      console.error('Error initializing PR Outreach tables:', error);
    }
  }

  private async initializeEmailTransporter(): Promise<void> {
    try {
      // Initialize email transporter (would use actual SMTP credentials)
      this.emailTransporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    } catch (error) {
      console.log('Email transporter not configured - running in simulation mode');
      this.emailTransporter = null;
    }
  }

  private async seedDefaultTemplates(): Promise<void> {
    const templates = [
      {
        id: 'template_press_release',
        name: 'Standard Press Release',
        subject: 'PRESS RELEASE: {{title}}',
        template: `Dear {{contact_name}},

I hope this email finds you well. I'm reaching out to share an exciting announcement from {{company_name}}.

{{press_release}}

I believe this story would be of interest to your readers at {{publication}}. Please let me know if you'd like additional information, quotes, or high-resolution images.

Best regards,
{{sender_name}}
{{sender_title}}
{{company_name}}`,
        type: 'press_release',
        variables: ['contact_name', 'company_name', 'press_release', 'publication', 'sender_name', 'sender_title']
      },
      {
        id: 'template_pitch',
        name: 'Story Pitch',
        subject: 'Story Idea: {{pitch_title}}',
        template: `Hi {{contact_name}},

I have a story idea that I think would resonate with {{publication}}'s audience:

{{pitch_content}}

This story ties into current trends around {{trend_keywords}} and would provide valuable insights for your readers.

Would you be interested in learning more? I'm happy to provide additional details, data, or arrange interviews.

Best,
{{sender_name}}`,
        type: 'pitch',
        variables: ['contact_name', 'publication', 'pitch_title', 'pitch_content', 'trend_keywords', 'sender_name']
      },
      {
        id: 'template_follow_up',
        name: 'Follow-up Template',
        subject: 'Following up: {{original_subject}}',
        template: `Hi {{contact_name}},

I wanted to follow up on my previous email about {{topic}}. I understand you receive many pitches, but I believe this story would be particularly relevant for {{publication}} because:

• {{reason_1}}
• {{reason_2}}
• {{reason_3}}

Would you have 5 minutes for a brief call to discuss this further?

Thanks for your time,
{{sender_name}}`,
        type: 'follow_up',
        variables: ['contact_name', 'original_subject', 'topic', 'publication', 'reason_1', 'reason_2', 'reason_3', 'sender_name']
      }
    ];

    for (const template of templates) {
      try {
        await db.execute(sql`
          INSERT INTO outreach_templates (id, name, subject, template, type, variables)
          VALUES (${template.id}, ${template.name}, ${template.subject}, ${template.template}, 
                  ${template.type}, ${JSON.stringify(template.variables)})
          ON CONFLICT (id) DO NOTHING
        `);
      } catch (error) {
        console.log('Template already exists:', template.id);
      }
    }
  }

  private async seedMediaContacts(): Promise<void> {
    const contacts = [
      {
        id: 'contact_techcrunch',
        name: 'TechCrunch Tips',
        email: 'tips@techcrunch.com',
        publication: 'TechCrunch',
        beat: ['startups', 'technology', 'venture capital'],
        tier: 'tier1',
        location: 'San Francisco, CA'
      },
      {
        id: 'contact_venturebeat',
        name: 'VentureBeat News',
        email: 'news@venturebeat.com',
        publication: 'VentureBeat',
        beat: ['enterprise', 'ai', 'startups'],
        tier: 'tier1',
        location: 'San Francisco, CA'
      },
      {
        id: 'contact_forbes',
        name: 'Forbes Technology',
        email: 'technology@forbes.com',
        publication: 'Forbes',
        beat: ['business', 'technology', 'entrepreneurs'],
        tier: 'tier1',
        location: 'New York, NY'
      },
      {
        id: 'contact_wired',
        name: 'WIRED News',
        email: 'news@wired.com',
        publication: 'WIRED',
        beat: ['technology', 'innovation', 'culture'],
        tier: 'tier1',
        location: 'San Francisco, CA'
      }
    ];

    for (const contact of contacts) {
      try {
        await db.execute(sql`
          INSERT INTO media_contacts (id, name, email, publication, beat, tier, location, verified)
          VALUES (${contact.id}, ${contact.name}, ${contact.email}, ${contact.publication}, 
                  ${JSON.stringify(contact.beat)}, ${contact.tier}, ${contact.location}, true)
          ON CONFLICT (email) DO NOTHING
        `);
      } catch (error) {
        console.log('Contact already exists:', contact.email);
      }
    }
  }

  async createCampaign(userId: string, campaignData: Partial<PRCampaign>): Promise<PRCampaign> {
    try {
      const campaignId = `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const campaign: PRCampaign = {
        id: campaignId,
        userId,
        title: campaignData.title || 'Untitled Campaign',
        pressRelease: campaignData.pressRelease || '',
        targetAudience: campaignData.targetAudience || [],
        status: 'draft',
        scheduledAt: campaignData.scheduledAt,
        sentCount: 0,
        openRate: 0,
        responseRate: 0,
        createdAt: new Date(),
        metadata: campaignData.metadata || {}
      };

      await db.execute(sql`
        INSERT INTO pr_campaigns (
          id, user_id, title, press_release, target_audience, status,
          scheduled_at, sent_count, open_rate, response_rate, created_at, metadata
        ) VALUES (
          ${campaign.id}, ${campaign.userId}, ${campaign.title}, ${campaign.pressRelease},
          ${JSON.stringify(campaign.targetAudience)}, ${campaign.status}, ${campaign.scheduledAt},
          ${campaign.sentCount}, ${campaign.openRate}, ${campaign.responseRate},
          ${campaign.createdAt}, ${JSON.stringify(campaign.metadata)}
        )
      `);

      return campaign;
    } catch (error) {
      console.error('Error creating PR campaign:', error);
      throw new Error('Failed to create PR campaign');
    }
  }

  async launchCampaign(campaignId: string, userId: string): Promise<void> {
    try {
      // Get campaign details
      const campaignResult = await db.execute(sql`
        SELECT * FROM pr_campaigns WHERE id = ${campaignId} AND user_id = ${userId}
      `);
      
      if (!campaignResult.rows.length) {
        throw new Error('Campaign not found');
      }
      
      const campaign = campaignResult.rows[0] as any;
      
      // Update campaign status
      await db.execute(sql`
        UPDATE pr_campaigns SET status = 'sending', updated_at = CURRENT_TIMESTAMP
        WHERE id = ${campaignId}
      `);

      // Get target contacts
      const contacts = await this.getTargetContacts(campaign.target_audience);
      
      // Get appropriate template
      const template = await this.getTemplate('press_release');
      
      // Send emails
      await this.sendToContacts(campaign, contacts, template);
      
      // Update campaign status
      await db.execute(sql`
        UPDATE pr_campaigns SET status = 'completed', sent_count = ${contacts.length}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${campaignId}
      `);

    } catch (error) {
      console.error('Error launching PR campaign:', error);
      
      // Update campaign status to failed
      await db.execute(sql`
        UPDATE pr_campaigns SET status = 'draft', updated_at = CURRENT_TIMESTAMP
        WHERE id = ${campaignId}
      `);
      
      throw error;
    }
  }

  private async getTargetContacts(targetAudience: string[]): Promise<MediaContact[]> {
    try {
      let query = sql`SELECT * FROM media_contacts WHERE verified = true`;
      
      if (targetAudience.length > 0) {
        // Filter by beat/publication
        query = sql`
          SELECT * FROM media_contacts 
          WHERE verified = true 
          AND (
            beat ?| ${targetAudience} OR 
            publication = ANY(${targetAudience})
          )
        `;
      }
      
      const result = await db.execute(query);
      return result.rows as MediaContact[];
    } catch (error) {
      console.error('Error getting target contacts:', error);
      return [];
    }
  }

  private async getTemplate(type: string): Promise<OutreachTemplate | null> {
    try {
      const result = await db.execute(sql`
        SELECT * FROM outreach_templates WHERE type = ${type} LIMIT 1
      `);
      return result.rows[0] as OutreachTemplate || null;
    } catch (error) {
      console.error('Error getting template:', error);
      return null;
    }
  }

  private async sendToContacts(campaign: any, contacts: MediaContact[], template: OutreachTemplate | null): Promise<void> {
    if (!template) {
      throw new Error('No template found');
    }

    for (const contact of contacts) {
      try {
        const trackingId = `track_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Personalize content
        const personalizedContent = this.personalizeTemplate(template.template, {
          contact_name: contact.name,
          publication: contact.publication,
          company_name: 'Findawise Empire',
          press_release: campaign.press_release,
          sender_name: 'PR Team',
          sender_title: 'Public Relations'
        });

        const personalizedSubject = this.personalizeTemplate(template.subject, {
          title: campaign.title
        });

        // Send email (simulated for now)
        await this.sendEmail(contact.email, personalizedSubject, personalizedContent, trackingId);
        
        // Record the send
        await db.execute(sql`
          INSERT INTO outreach_sends (
            id, campaign_id, contact_id, template_id, subject, content, 
            status, sent_at, tracking_id
          ) VALUES (
            CONCAT('send_', ${Date.now()}, '_', FLOOR(RANDOM() * 1000)), 
            ${campaign.id}, ${contact.id}, ${template.id},
            ${personalizedSubject}, ${personalizedContent}, 'sent', 
            CURRENT_TIMESTAMP, ${trackingId}
          )
        `);

        // Update contact last contacted
        await db.execute(sql`
          UPDATE media_contacts SET last_contacted = CURRENT_TIMESTAMP
          WHERE id = ${contact.id}
        `);

        // Small delay to avoid rate limiting
        await this.sleep(100);
        
      } catch (error) {
        console.error(`Error sending to ${contact.email}:`, error);
      }
    }
  }

  private personalizeTemplate(template: string, variables: Record<string, string>): string {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, value);
    }
    return result;
  }

  private async sendEmail(to: string, subject: string, content: string, trackingId: string): Promise<void> {
    try {
      if (this.emailTransporter) {
        // Add tracking pixel
        const trackingPixel = `<img src="${process.env.BASE_URL}/api/track/open/${trackingId}" width="1" height="1" style="display:none;">`;
        const htmlContent = `${content.replace(/\n/g, '<br>')}<br><br>${trackingPixel}`;
        
        await this.emailTransporter.sendMail({
          from: process.env.FROM_EMAIL,
          to,
          subject,
          html: htmlContent,
          text: content
        });
        
        console.log(`✅ Email sent to ${to}`);
      } else {
        // Simulate email sending
        console.log(`📧 Simulated email to ${to}: ${subject}`);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async trackOpen(trackingId: string): Promise<void> {
    try {
      await db.execute(sql`
        UPDATE outreach_sends 
        SET opened_at = CURRENT_TIMESTAMP
        WHERE tracking_id = ${trackingId} AND opened_at IS NULL
      `);
    } catch (error) {
      console.error('Error tracking email open:', error);
    }
  }

  async trackClick(trackingId: string): Promise<void> {
    try {
      await db.execute(sql`
        UPDATE outreach_sends 
        SET clicked_at = CURRENT_TIMESTAMP
        WHERE tracking_id = ${trackingId} AND clicked_at IS NULL
      `);
    } catch (error) {
      console.error('Error tracking email click:', error);
    }
  }

  async getCampaigns(userId: string): Promise<PRCampaign[]> {
    try {
      const result = await db.execute(sql`
        SELECT * FROM pr_campaigns 
        WHERE user_id = ${userId} 
        ORDER BY created_at DESC
      `);
      return result.rows as PRCampaign[];
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      return [];
    }
  }

  async getCampaignAnalytics(campaignId: string): Promise<any> {
    try {
      const analytics = await db.execute(sql`
        SELECT 
          COUNT(*) as total_sent,
          COUNT(CASE WHEN opened_at IS NOT NULL THEN 1 END) as total_opened,
          COUNT(CASE WHEN clicked_at IS NOT NULL THEN 1 END) as total_clicked,
          COUNT(CASE WHEN replied_at IS NOT NULL THEN 1 END) as total_replied
        FROM outreach_sends 
        WHERE campaign_id = ${campaignId}
      `);
      
      return analytics.rows[0] || { total_sent: 0, total_opened: 0, total_clicked: 0, total_replied: 0 };
    } catch (error) {
      console.error('Error fetching campaign analytics:', error);
      return { total_sent: 0, total_opened: 0, total_clicked: 0, total_replied: 0 };
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const prOutreachBot = PROutreachBot.getInstance();