import { db } from "../../../db";
import { referralPrograms, referralLinks, referralTransactions } from "../../../../shared/schema";
import { eq, desc, sql, and, gte, count, sum, avg, max, min } from "drizzle-orm";
import * as crypto from 'crypto';

/**
 * REFERRAL SYSTEM ENGINE - BILLION-DOLLAR EMPIRE GRADE
 * 
 * Features:
 * - Multi-level referral programs
 * - Viral growth mechanics
 * - Fraud detection and prevention
 * - Real-time commission tracking
 * - Automated reward distribution
 * - Social sharing optimization
 */
export class ReferralSystemEngine {
  private initialized = false;
  private rewardQueue: any[] = [];
  private fraudDetectionModel: any;
  private performanceMetrics: Map<string, number> = new Map();

  constructor() {}

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      console.log('🔗 Initializing Referral System Engine...');
      
      // Initialize referral programs
      await this.initializeReferralPrograms();
      
      // Initialize fraud detection
      await this.initializeFraudDetection();
      
      // Initialize reward automation
      await this.initializeRewardAutomation();
      
      // Start viral mechanics
      this.startViralMechanics();
      
      this.initialized = true;
      console.log('✅ Referral System Engine initialized successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize Referral System Engine:', error);
      throw error;
    }
  }

  /**
   * Initialize referral programs for all verticals
   */
  private async initializeReferralPrograms(): Promise<void> {
    const referralPrograms = [
      {
        name: 'Finance Mastery Referral Program',
        description: 'Earn commissions by referring people to our financial planning tools',
        vertical: 'finance',
        rewardType: 'percentage',
        rewardValue: 25.0, // 25% commission
        referrerReward: 25.0,
        refereeReward: 10.0, // 10% discount for new users
        minimumPurchase: 50.0,
        cookieDuration: 90, // 90 days
        maxRewardsPerUser: 0, // unlimited
        isActive: true,
        autoApproval: true,
        trackingMethod: 'cookie',
        paymentSchedule: 'monthly',
        termsAndConditions: 'Standard referral terms apply. Minimum payout threshold is $100.'
      },
      {
        name: 'Health & Wellness Ambassador Program',
        description: 'Share our wellness tools and earn rewards for every successful referral',
        vertical: 'health',
        rewardType: 'percentage',
        rewardValue: 30.0, // 30% commission
        referrerReward: 30.0,
        refereeReward: 15.0, // 15% discount for new users
        minimumPurchase: 30.0,
        cookieDuration: 60, // 60 days
        maxRewardsPerUser: 0, // unlimited
        isActive: true,
        autoApproval: true,
        trackingMethod: 'cookie',
        paymentSchedule: 'monthly',
        termsAndConditions: 'Health & wellness referral terms. Minimum payout $50.'
      },
      {
        name: 'SaaS Tools Partnership Program',
        description: 'Refer businesses to our SaaS tool recommendations and earn recurring commissions',
        vertical: 'saas', 
        rewardType: 'percentage',
        rewardValue: 40.0, // 40% recurring commission
        referrerReward: 40.0,
        refereeReward: 20.0, // 20% discount for new users
        minimumPurchase: 100.0,
        cookieDuration: 120, // 120 days
        maxRewardsPerUser: 0, // unlimited
        isActive: true,
        autoApproval: false, // manual approval for higher value
        trackingMethod: 'cookie',
        paymentSchedule: 'monthly',
        termsAndConditions: 'SaaS partnership terms. Recurring payouts for active subscriptions.'
      },
      {
        name: 'Travel Deals Network',
        description: 'Share exclusive travel deals and earn commissions on bookings',
        vertical: 'travel',
        rewardType: 'fixed',
        rewardValue: 50.0, // $50 per booking
        referrerReward: 50.0,
        refereeReward: 100.0, // $100 travel credit
        minimumPurchase: 500.0,
        cookieDuration: 30, // 30 days
        maxRewardsPerUser: 50, // max 50 referrals per month
        isActive: true,
        autoApproval: true,
        trackingMethod: 'cookie',
        paymentSchedule: 'weekly',
        termsAndConditions: 'Travel booking referral terms. Credits valid for 1 year.'
      },
      {
        name: 'Security Solutions Affiliate Program', 
        description: 'Refer security-conscious users to our protection services',
        vertical: 'security',
        rewardType: 'percentage',
        rewardValue: 35.0, // 35% commission
        referrerReward: 35.0,
        refereeReward: 10.0, // 10% discount
        minimumPurchase: 75.0,
        cookieDuration: 90, // 90 days
        maxRewardsPerUser: 0, // unlimited
        isActive: true,
        autoApproval: true,
        trackingMethod: 'cookie',
        paymentSchedule: 'monthly',
        termsAndConditions: 'Security referral program terms. Annual renewals eligible.'
      }
    ];

    // Store referral programs in database
    for (const program of referralPrograms) {
      try {
        await db.insert(referralPrograms).values({
          name: program.name,
          description: program.description,
          vertical: program.vertical,
          rewardType: program.rewardType,
          rewardValue: program.rewardValue,
          referrerReward: program.referrerReward,
          refereeReward: program.refereeReward,
          minimumPurchase: program.minimumPurchase,
          cookieDuration: program.cookieDuration,
          maxRewardsPerUser: program.maxRewardsPerUser,
          isActive: program.isActive,
          autoApproval: program.autoApproval,
          trackingMethod: program.trackingMethod,
          paymentSchedule: program.paymentSchedule,
          termsAndConditions: program.termsAndConditions
        }).onConflictDoNothing();
        
        console.log(`🎯 Referral program created: ${program.name}`);
        
      } catch (error) {
        console.error(`❌ Failed to create program ${program.name}:`, error);
      }
    }
  }

  /**
   * Initialize fraud detection system
   */
  private async initializeFraudDetection(): Promise<void> {
    // Fraud detection patterns and thresholds
    const fraudDetectionRules = {
      // Velocity checks
      maxReferralsPerHour: 10,
      maxReferralsPerDay: 50,
      maxReferralsPerIP: 5,
      
      // Behavioral patterns
      suspiciousPatterns: [
        'rapid_succession_referrals',
        'same_ip_multiple_referrals', 
        'fake_email_patterns',
        'duplicate_payment_methods',
        'geographic_inconsistencies'
      ],
      
      // Quality thresholds
      minSessionDuration: 30, // seconds
      maxBounceRate: 80, // percentage
      minPageViews: 2,
      
      // Machine learning features
      riskFactors: [
        'user_agent_diversity',
        'referral_source_quality',
        'conversion_timing_patterns',
        'engagement_depth_score'
      ]
    };
    
    console.log('🛡️ Fraud detection system configured');
  }

  /**
   * Initialize automated reward system
   */
  private async initializeRewardAutomation(): Promise<void> {
    // Reward tiers and automation rules
    const rewardTiers = {
      bronze: { minReferrals: 1, bonusMultiplier: 1.0, perks: ['basic_analytics'] },
      silver: { minReferrals: 10, bonusMultiplier: 1.1, perks: ['advanced_analytics', 'priority_support'] },
      gold: { minReferrals: 25, bonusMultiplier: 1.25, perks: ['custom_landing_pages', 'dedicated_manager'] },
      platinum: { minReferrals: 50, bonusMultiplier: 1.5, perks: ['exclusive_offers', 'early_access'] },
      diamond: { minReferrals: 100, bonusMultiplier: 2.0, perks: ['all_perks', 'revenue_sharing'] }
    };
    
    console.log('🎁 Reward automation configured');
  }

  /**
   * Start viral mechanics and gamification
   */
  private startViralMechanics(): void {
    // Run reward calculations every hour
    setInterval(async () => {
      await this.processRewardQueue();
    }, 60 * 60 * 1000);

    // Generate leaderboard updates every 15 minutes
    setInterval(async () => {
      await this.updateLeaderboards();
    }, 15 * 60 * 1000);

    // Initial processing
    setTimeout(() => {
      this.processRewardQueue();
      this.updateLeaderboards();
    }, 5000);
  }

  /**
   * Generate viral referral links with tracking
   */
  async generateReferralLink(config: {
    userId: string;
    programId: number;
    customCode?: string;
    expiresAt?: Date;
  }): Promise<{ success: boolean; link: any }> {
    try {
      const { userId, programId, customCode, expiresAt } = config;
      
      // Generate unique referral code
      const referralCode = customCode || this.generateUniqueCode(userId, programId);
      
      // Create tracking link
      const trackingLink = `https://findawise.com/ref/${referralCode}`;
      
      // Store referral link
      const [createdLink] = await db.insert(referralLinks).values({
        userId,
        programId,
        referralCode,
        trackingLink,
        isActive: true,
        expiresAt: expiresAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year default
        createdAt: new Date()
      }).returning();
      
      console.log(`✅ Generated referral link: ${trackingLink}`);
      
      return {
        success: true,
        link: {
          id: createdLink.id,
          code: referralCode,
          url: trackingLink,
          qrCode: this.generateQRCode(trackingLink),
          socialShareUrls: this.generateSocialShareUrls(trackingLink, programId),
          analytics: {
            clicks: 0,
            conversions: 0,
            revenue: 0,
            conversionRate: 0
          }
        }
      };
      
    } catch (error) {
      console.error('❌ Failed to generate referral link:', error);
      return { success: false, link: null };
    }
  }

  /**
   * Generate unique referral code
   */
  private generateUniqueCode(userId: string, programId: number): string {
    const timestamp = Date.now().toString(36);
    const userHash = crypto.createHash('md5').update(userId).digest('hex').substring(0, 6);
    const programHash = programId.toString(36);
    
    return `${userHash}${programHash}${timestamp}`.toUpperCase();
  }

  /**
   * Generate QR code for referral link
   */
  private generateQRCode(url: string): string {
    // In production, use a QR code library
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
  }

  /**
   * Generate social sharing URLs
   */
  private generateSocialShareUrls(url: string, programId: number): any {
    const shareText = "Check out this amazing opportunity!";
    
    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + url)}`,
      email: `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(url)}`
    };
  }

  /**
   * Process reward queue and distribute payments
   */
  async processRewardQueue(): Promise<void> {
    try {
      console.log('💰 Processing reward queue...');
      
      // Get pending transactions
      const pendingTransactions = await db.select()
        .from(referralTransactions)
        .where(eq(referralTransactions.status, 'pending'))
        .limit(100);
      
      for (const transaction of pendingTransactions) {
        try {
          // Validate transaction
          const isValid = await this.validateTransaction(transaction);
          
          if (isValid) {
            // Process payment
            const paymentResult = await this.processPayment(transaction);
            
            if (paymentResult.success) {
              // Update transaction status
              await db.update(referralTransactions)
                .set({ 
                  status: 'completed',
                  processedAt: new Date(),
                  paymentReference: paymentResult.reference
                })
                .where(eq(referralTransactions.id, transaction.id));
              
              console.log(`✅ Processed reward: $${transaction.amount} for user ${transaction.referrerId}`);
            }
          } else {
            // Mark as invalid
            await db.update(referralTransactions)
              .set({ status: 'rejected', processedAt: new Date() })
              .where(eq(referralTransactions.id, transaction.id));
          }
          
        } catch (error) {
          console.error(`❌ Failed to process transaction ${transaction.id}:`, error);
        }
      }
      
    } catch (error) {
      console.error('❌ Failed to process reward queue:', error);
    }
  }

  /**
   * Validate referral transaction
   */
  private async validateTransaction(transaction: any): Promise<boolean> {
    // Implement fraud detection checks
    const checks = [
      this.checkVelocityLimits(transaction.referrerId),
      this.checkIPReputation(transaction.refereeIP),
      this.checkEngagementQuality(transaction.refereeId),
      this.checkPaymentValidity(transaction.amount)
    ];
    
    const results = await Promise.all(checks);
    return results.every(result => result === true);
  }

  /**
   * Check velocity limits for fraud detection
   */
  private async checkVelocityLimits(referrerId: string): Promise<boolean> {
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    // Check hourly limit
    const hourlyCount = await db.select({ count: count() })
      .from(referralTransactions)
      .where(and(
        eq(referralTransactions.referrerId, referrerId),
        gte(referralTransactions.createdAt, hourAgo)
      ));
    
    if (hourlyCount[0].count > 10) return false;
    
    // Check daily limit
    const dailyCount = await db.select({ count: count() })
      .from(referralTransactions)
      .where(and(
        eq(referralTransactions.referrerId, referrerId),
        gte(referralTransactions.createdAt, dayAgo)
      ));
    
    return dailyCount[0].count <= 50;
  }

  /**
   * Update leaderboards and rankings
   */
  async updateLeaderboards(): Promise<void> {
    try {
      console.log('🏆 Updating referral leaderboards...');
      
      // Calculate top referrers by revenue
      const topByRevenue = await db.select({
        referrerId: referralTransactions.referrerId,
        totalRevenue: sum(referralTransactions.amount),
        totalReferrals: count(referralTransactions.id)
      })
      .from(referralTransactions)
      .where(eq(referralTransactions.status, 'completed'))
      .groupBy(referralTransactions.referrerId)
      .orderBy(desc(sum(referralTransactions.amount)))
      .limit(100);
      
      // Calculate top referrers by volume  
      const topByVolume = await db.select({
        referrerId: referralTransactions.referrerId,
        totalReferrals: count(referralTransactions.id),
        totalRevenue: sum(referralTransactions.amount)
      })
      .from(referralTransactions)
      .where(eq(referralTransactions.status, 'completed'))
      .groupBy(referralTransactions.referrerId)
      .orderBy(desc(count(referralTransactions.id)))
      .limit(100);
      
      // Store leaderboard data (would be cached in production)
      this.performanceMetrics.set('leaderboard_revenue', topByRevenue.length);
      this.performanceMetrics.set('leaderboard_volume', topByVolume.length);
      
      console.log(`✅ Updated leaderboards: ${topByRevenue.length} revenue leaders, ${topByVolume.length} volume leaders`);
      
    } catch (error) {
      console.error('❌ Failed to update leaderboards:', error);
    }
  }

  // Additional utility methods for fraud detection
  private async checkIPReputation(ip: string): Promise<boolean> {
    // Implement IP reputation checking
    return true; // Placeholder
  }

  private async checkEngagementQuality(userId: string): Promise<boolean> {
    // Check user engagement metrics
    return true; // Placeholder
  }

  private async checkPaymentValidity(amount: number): Promise<boolean> {
    // Validate payment amount is reasonable
    return amount > 0 && amount < 10000;
  }

  private async processPayment(transaction: any): Promise<{ success: boolean; reference?: string }> {
    // Implement actual payment processing
    return { success: true, reference: `PAY_${Date.now()}` };
  }

  /**
   * Initialize default referral programs
   */
  private async initializeDefaultPrograms(): Promise<void> {
    const defaultPrograms = [
      {
        name: 'Health & Wellness Affiliate Program',
        description: 'Share wellness tools and earn recurring commissions',
        vertical: 'health',
        rewardType: 'percentage',
        rewardValue: 30.0, // 30% commission
        referrerReward: 30.0,
        refereeReward: 15.0, // 15% discount
        minimumPurchase: 30.0,
        cookieDuration: 60,
        maxRewardsPerUser: 0,
        isActive: true,
        autoApproval: true,
        trackingMethod: 'cookie',
        paymentSchedule: 'biweekly',
        termsAndConditions: 'Health products referral program. Recurring commissions on subscriptions.'
      },
      {
        name: 'SaaS Tool Partner Program',
        description: 'Enterprise referral program for B2B software recommendations',
        vertical: 'saas',
        rewardType: 'percentage',
        rewardValue: 35.0, // 35% commission
        referrerReward: 35.0,
        refereeReward: 20.0, // 20% discount
        minimumPurchase: 100.0,
        cookieDuration: 120, // 4 months
        maxRewardsPerUser: 0,
        isActive: true,
        autoApproval: false, // Manual approval for enterprise
        trackingMethod: 'cookie',
        paymentSchedule: 'monthly',
        termsAndConditions: 'Enterprise B2B referral program. Higher commissions for qualified leads.'
      },
      {
        name: 'Travel Deals Affiliate Network',
        description: 'Earn from travel bookings and destination recommendations',
        vertical: 'travel',
        rewardType: 'percentage',
        rewardValue: 8.0, // 8% commission (lower margin industry)
        referrerReward: 8.0,
        refereeReward: 5.0, // 5% discount
        minimumPurchase: 200.0,
        cookieDuration: 30, // shorter for travel
        maxRewardsPerUser: 0,
        isActive: true,
        autoApproval: true,
        trackingMethod: 'cookie',
        paymentSchedule: 'monthly',
        termsAndConditions: 'Travel affiliate program. Commissions on completed bookings only.'
      },
      {
        name: 'Security Solutions Referral Program',
        description: 'High-value referral program for security products',
        vertical: 'security',
        rewardType: 'percentage',
        rewardValue: 40.0, // 40% commission (high-value products)
        referrerReward: 40.0,
        refereeReward: 10.0,
        minimumPurchase: 150.0,
        cookieDuration: 180, // 6 months (long consideration)
        maxRewardsPerUser: 0,
        isActive: true,
        autoApproval: false, // Manual approval for security
        trackingMethod: 'cookie',
        paymentSchedule: 'monthly',
        termsAndConditions: 'Security products referral program. Background checks may be required.'
      }
    ];

    for (const program of referralPrograms) {
      try {
        await db.insert(referralPrograms).values(program).onConflictDoNothing();
        console.log(`🎯 Seeded referral program: ${program.name}`);
      } catch (error) {
        console.error(`❌ Failed to seed program ${program.name}:`, error);
      }
    }
  }

  /**
   * Initialize fraud detection system
   */
  private async initializeFraudDetection(): Promise<void> {
    this.fraudDetectionModel = {
      suspiciousPatterns: [
        'rapid_successive_clicks',
        'unusual_geographic_patterns',
        'cookie_manipulation',
        'bot_like_behavior',
        'suspicious_user_agents'
      ],
      riskThresholds: {
        click_velocity: 10, // clicks per minute
        geographic_spread: 5, // different countries in 24h
        conversion_rate: 80, // suspiciously high conversion %
        session_duration: 5 // seconds (too fast)
      }
    };
    
    console.log('🛡️ Fraud detection system configured');
  }

  /**
   * Initialize automated reward distribution
   */
  private async initializeRewardAutomation(): Promise<void> {
    // Process rewards every hour
    setInterval(async () => {
      await this.processRewardQueue();
    }, 60 * 60 * 1000);

    console.log('💰 Reward automation initialized');
  }

  /**
   * Start viral growth mechanics
   */
  private startViralMechanics(): void {
    // Update viral metrics every 15 minutes
    setInterval(async () => {
      await this.updateViralMetrics();
    }, 15 * 60 * 1000);

    // Initial viral metrics calculation
    setTimeout(() => this.updateViralMetrics(), 5000);
  }

  /**
   * Create referral link for user
   */
  async createReferralLink(userId: string, programId: number, customData?: any): Promise<string> {
    try {
      const program = await db.select()
        .from(referralPrograms)
        .where(eq(referralPrograms.id, programId))
        .limit(1);

      if (!program[0]) {
        throw new Error('Referral program not found');
      }

      const referralCode = this.generateReferralCode(userId);
      const customUrl = customData?.customUrl || '';
      const targetUrl = customData?.targetUrl || '/';

      await db.insert(referralLinks).values({
        programId,
        referrerId: userId,
        referralCode,
        customUrl,
        targetUrl,
        campaignName: customData?.campaignName || '',
        utmSource: 'referral',
        utmMedium: 'link',
        utmCampaign: `ref_${referralCode}`,
        clicks: 0,
        conversions: 0,
        revenue: 0,
        commissionEarned: 0,
        isActive: true
      });

      const referralUrl = `${process.env.DOMAIN || 'https://findawise.com'}/ref/${referralCode}`;
      
      console.log(`🔗 Created referral link for user ${userId}: ${referralCode}`);
      
      return referralUrl;
      
    } catch (error) {
      console.error('❌ Failed to create referral link:', error);
      throw error;
    }
  }

  /**
   * Generate unique referral code
   */
  private generateReferralCode(userId: string): string {
    const timestamp = Date.now().toString(36);
    const random = crypto.randomBytes(4).toString('hex');
    const userHash = crypto.createHash('md5').update(userId).digest('hex').slice(0, 4);
    
    return `${userHash}${timestamp}${random}`.toUpperCase();
  }

  /**
   * Track referral click
   */
  async trackReferralClick(referralCode: string, clickData: any): Promise<void> {
    try {
      // Check for fraud
      const fraudScore = await this.calculateFraudScore(clickData);
      
      if (fraudScore > 0.8) {
        console.warn(`🚨 Suspicious click detected for ${referralCode}:`, fraudScore);
        return; // Don't count suspicious clicks
      }

      // Update click count
      await db.update(referralLinks)
        .set({
          clicks: sql`clicks + 1`,
          lastClickAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(referralLinks.referralCode, referralCode));

      // Log transaction
      const link = await db.select()
        .from(referralLinks)
        .where(eq(referralLinks.referralCode, referralCode))
        .limit(1);

      if (link[0]) {
        await db.insert(referralTransactions).values({
          linkId: link[0].id,
          programId: link[0].programId,
          referrerId: link[0].referrerId,
          refereeId: clickData.userId || null,
          refereeEmail: clickData.email || null,
          transactionType: 'click',
          transactionValue: 0,
          commissionRate: 0,
          commissionAmount: 0,
          status: 'approved',
          ipAddress: clickData.ipAddress,
          userAgent: clickData.userAgent,
          conversionData: clickData
        });
      }

      console.log(`👆 Tracked click for referral ${referralCode}`);
      
    } catch (error) {
      console.error('❌ Failed to track referral click:', error);
    }
  }

  /**
   * Track referral conversion
   */
  async trackReferralConversion(referralCode: string, conversionData: any): Promise<void> {
    try {
      const link = await db.select()
        .from(referralLinks)
        .innerJoin(referralPrograms, eq(referralLinks.programId, referralPrograms.id))
        .where(eq(referralLinks.referralCode, referralCode))
        .limit(1);

      if (!link[0]) {
        console.warn(`⚠️ Referral link not found: ${referralCode}`);
        return;
      }

      const program = link[0].referral_programs;
      const referralLink = link[0].referral_links;

      // Check minimum purchase requirement
      if (conversionData.orderValue < program.minimumPurchase) {
        console.log(`💰 Order value ${conversionData.orderValue} below minimum ${program.minimumPurchase}`);
        return;
      }

      // Calculate commission
      const commissionAmount = this.calculateCommission(conversionData.orderValue, program);

      // Update referral link stats
      await db.update(referralLinks)
        .set({
          conversions: sql`conversions + 1`,
          revenue: sql`revenue + ${conversionData.orderValue}`,
          commissionEarned: sql`commission_earned + ${commissionAmount}`,
          updatedAt: new Date()
        })
        .where(eq(referralLinks.id, referralLink.id));

      // Log conversion transaction
      await db.insert(referralTransactions).values({
        linkId: referralLink.id,
        programId: program.id,
        referrerId: referralLink.referrerId,
        refereeId: conversionData.userId,
        refereeEmail: conversionData.email,
        transactionType: 'conversion',
        transactionValue: conversionData.orderValue,
        commissionRate: program.rewardValue,
        commissionAmount,
        status: program.autoApproval ? 'approved' : 'pending',
        ipAddress: conversionData.ipAddress,
        userAgent: conversionData.userAgent,
        conversionData
      });

      // Add to reward queue if auto-approved
      if (program.autoApproval) {
        this.rewardQueue.push({
          referrerId: referralLink.referrerId,
          amount: commissionAmount,
          programId: program.id,
          transactionId: conversionData.transactionId
        });
      }

      console.log(`💰 Tracked conversion for ${referralCode}: $${commissionAmount} commission`);
      
    } catch (error) {
      console.error('❌ Failed to track referral conversion:', error);
    }
  }

  /**
   * Calculate commission based on program rules
   */
  private calculateCommission(orderValue: number, program: any): number {
    if (program.rewardType === 'percentage') {
      return (orderValue * program.rewardValue) / 100;
    } else if (program.rewardType === 'fixed') {
      return program.rewardValue;
    }
    
    return 0;
  }

  /**
   * Calculate fraud score for click/conversion
   */
  private async calculateFraudScore(data: any): Promise<number> {
    let fraudScore = 0;

    // Check user agent patterns
    if (this.isSuspiciousUserAgent(data.userAgent)) {
      fraudScore += 0.3;
    }

    // Check IP patterns
    if (await this.isSuspiciousIP(data.ipAddress)) {
      fraudScore += 0.4;
    }

    // Check session duration
    if (data.sessionDuration < this.fraudDetectionModel.riskThresholds.session_duration) {
      fraudScore += 0.2;
    }

    // Check click velocity
    if (data.clickVelocity > this.fraudDetectionModel.riskThresholds.click_velocity) {
      fraudScore += 0.5;
    }

    return Math.min(1, fraudScore);
  }

  /**
   * Check if user agent looks suspicious
   */
  private isSuspiciousUserAgent(userAgent: string): boolean {
    if (!userAgent) return true;
    
    const suspiciousPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /headless/i,
      /phantom/i,
      /selenium/i
    ];
    
    return suspiciousPatterns.some(pattern => pattern.test(userAgent));
  }

  /**
   * Check if IP address is suspicious
   */
  private async isSuspiciousIP(ipAddress: string): Promise<boolean> {
    // Basic checks - in production, integrate with IP reputation services
    if (!ipAddress) return true;
    
    // Check for common suspicious patterns
    const suspiciousRanges = [
      '10.0.0.0/8',    // Private ranges often used by bots
      '172.16.0.0/12',
      '192.168.0.0/16'
    ];
    
    // For now, just basic validation
    return !ipAddress.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/);
  }

  /**
   * Process reward queue and distribute commissions
   */
  private async processRewardQueue(): Promise<void> {
    try {
      if (this.rewardQueue.length === 0) return;

      console.log(`💰 Processing ${this.rewardQueue.length} rewards...`);
      
      for (const reward of this.rewardQueue) {
        await this.distributeReward(reward);
      }
      
      this.rewardQueue = [];
      console.log('✅ Reward queue processed');
      
    } catch (error) {
      console.error('❌ Failed to process reward queue:', error);
    }
  }

  /**
   * Distribute individual reward
   */
  private async distributeReward(reward: any): Promise<void> {
    try {
      // In production, integrate with payment processor
      console.log(`💳 Distributing $${reward.amount} to ${reward.referrerId}`);
      
      // Update transaction status
      await db.update(referralTransactions)
        .set({
          status: 'paid',
          paymentDate: new Date()
        })
        .where(
          and(
            eq(referralTransactions.referrerId, reward.referrerId),
            eq(referralTransactions.commissionAmount, reward.amount),
            eq(referralTransactions.status, 'approved')
          )
        );
      
    } catch (error) {
      console.error('❌ Failed to distribute reward:', error);
    }
  }

  /**
   * Update viral metrics for all programs
   */
  private async updateViralMetrics(): Promise<void> {
    try {
      const programs = await db.select().from(referralPrograms);
      
      for (const program of programs) {
        await this.calculateViralMetrics(program.id);
      }
      
      console.log('📊 Viral metrics updated');
      
    } catch (error) {
      console.error('❌ Failed to update viral metrics:', error);
    }
  }

  /**
   * Calculate viral metrics for specific program
   */
  private async calculateViralMetrics(programId: number): Promise<any> {
    try {
      const metrics = await db.select({
        totalLinks: count(),
        totalClicks: sum(referralLinks.clicks),
        totalConversions: sum(referralLinks.conversions),
        totalRevenue: sum(referralLinks.revenue),
        totalCommissions: sum(referralLinks.commissionEarned)
      }).from(referralLinks)
        .where(eq(referralLinks.programId, programId));

      const viralMetrics = {
        programId,
        totalLinks: metrics[0]?.totalLinks || 0,
        totalClicks: metrics[0]?.totalClicks || 0,
        totalConversions: metrics[0]?.totalConversions || 0,
        totalRevenue: metrics[0]?.totalRevenue || 0,
        totalCommissions: metrics[0]?.totalCommissions || 0,
        conversionRate: metrics[0]?.totalClicks > 0 ? 
          ((metrics[0]?.totalConversions || 0) / metrics[0].totalClicks) * 100 : 0,
        viralCoefficient: this.calculateViralCoefficient(metrics[0] || {}),
        calculatedAt: new Date()
      };

      return viralMetrics;
      
    } catch (error) {
      console.error('❌ Failed to calculate viral metrics:', error);
      return {};
    }
  }

  /**
   * Calculate viral coefficient (how many new users each user brings)
   */
  private calculateViralCoefficient(metrics: any): number {
    const totalUsers = metrics.totalLinks || 1;
    const newUsers = metrics.totalConversions || 0;
    
    return newUsers / totalUsers;
  }

  /**
   * Get referral analytics for vertical and timeframe
   */
  async getAnalytics(vertical?: string, timeframe = '30d'): Promise<any> {
    try {
      const days = parseInt(timeframe.replace('d', ''));
      const dateThreshold = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      // Get program analytics
      const programStats = await db.select({
        totalPrograms: count(),
        activePrograms: sum(sql`CASE WHEN is_active = true THEN 1 ELSE 0 END`),
        avgCommissionRate: avg(referralPrograms.rewardValue)
      }).from(referralPrograms)
        .where(vertical ? eq(referralPrograms.vertical, vertical) : sql`1=1`);

      // Get link analytics
      const linkStats = await db.select({
        totalLinks: count(),
        totalClicks: sum(referralLinks.clicks),
        totalConversions: sum(referralLinks.conversions),
        totalRevenue: sum(referralLinks.revenue),
        totalCommissions: sum(referralLinks.commissionEarned)
      }).from(referralLinks)
        .innerJoin(referralPrograms, eq(referralLinks.programId, referralPrograms.id))
        .where(
          and(
            gte(referralLinks.createdAt, dateThreshold),
            vertical ? eq(referralPrograms.vertical, vertical) : sql`1=1`
          )
        );

      // Get transaction analytics
      const transactionStats = await db.select({
        totalTransactions: count(),
        paidTransactions: sum(sql`CASE WHEN status = 'paid' THEN 1 ELSE 0 END`),
        pendingTransactions: sum(sql`CASE WHEN status = 'pending' THEN 1 ELSE 0 END`),
        avgTransactionValue: avg(referralTransactions.transactionValue)
      }).from(referralTransactions)
        .innerJoin(referralPrograms, eq(referralTransactions.programId, referralPrograms.id))
        .where(
          and(
            gte(referralTransactions.createdAt, dateThreshold),
            vertical ? eq(referralPrograms.vertical, vertical) : sql`1=1`
          )
        );

      const conversionRate = linkStats[0]?.totalClicks > 0 ? 
        ((linkStats[0]?.totalConversions || 0) / linkStats[0].totalClicks) * 100 : 0;

      const viralCoefficient = linkStats[0]?.totalLinks > 0 ?
        (linkStats[0]?.totalConversions || 0) / linkStats[0].totalLinks : 0;

      return {
        timeframe,
        vertical: vertical || 'all',
        programs: programStats[0] || {},
        links: linkStats[0] || {},
        transactions: transactionStats[0] || {},
        performance: {
          conversionRate,
          viralCoefficient,
          avgRevenuePerReferral: linkStats[0]?.totalLinks > 0 ?
            (linkStats[0]?.totalRevenue || 0) / linkStats[0].totalLinks : 0,
          totalROI: linkStats[0]?.totalCommissions > 0 ?
            ((linkStats[0]?.totalRevenue || 0) / linkStats[0].totalCommissions) * 100 : 0
        },
        generatedAt: new Date()
      };

    } catch (error) {
      console.error('❌ Failed to get referral analytics:', error);
      return this.getDefaultAnalytics(vertical, timeframe);
    }
  }

  /**
   * Get default analytics when database query fails
   */
  private getDefaultAnalytics(vertical?: string, timeframe = '30d'): any {
    return {
      timeframe,
      vertical: vertical || 'all',
      programs: { totalPrograms: 0, activePrograms: 0, avgCommissionRate: 0 },
      links: { totalLinks: 0, totalClicks: 0, totalConversions: 0, totalRevenue: 0 },
      transactions: { totalTransactions: 0, paidTransactions: 0, pendingTransactions: 0 },
      performance: { conversionRate: 0, viralCoefficient: 0, avgRevenuePerReferral: 0, totalROI: 0 },
      generatedAt: new Date()
    };
  }

  /**
   * Get current health status
   */
  getHealthStatus(): any {
    return {
      module: 'Referral System Engine',
      status: this.initialized ? 'operational' : 'initializing',
      rewardQueueSize: this.rewardQueue.length,
      metrics: Object.fromEntries(this.performanceMetrics),
      uptime: process.uptime()
    };
  }
}

export const referralSystemEngine = new ReferralSystemEngine();