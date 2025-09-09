import { db } from "../../../db";
import {
  viralChallenges,
  challengeParticipants,
  type ViralChallenge,
  type ChallengeParticipant
} from "../../../../shared/moneyTrafficGrowthTables";
import { eq, desc, sql, and, gte, count, sum, avg, max, min, ilike } from "drizzle-orm";
import * as crypto from 'crypto';
import { z } from 'zod';

/**
 * GAMIFIED VIRAL CHALLENGE SYSTEM - BILLION-DOLLAR EMPIRE GRADE
 * 
 * Viral challenge engine with gamification mechanics:
 * - Interactive challenges (quizzes, checklists, photo/video contests)
 * - Leaderboards with rankings and competitive elements
 * - Viral sharing rewards and referral bonuses
 * - Badge system with achievement unlocks
 * - Time-based challenges with urgency mechanics
 * - Social proof integration with real-time updates
 */
export class ViralChallengeEngine {
  private static instance: ViralChallengeEngine;
  private initialized = false;
  private errorTracker = new Map<string, { count: number; lastError: Date }>();
  private performanceMetrics = new Map<string, number>();
  private challengeTypes = ['quiz', 'checklist', 'score', 'photo', 'video'];

  private constructor() {}

  public static getInstance(): ViralChallengeEngine {
    if (!ViralChallengeEngine.instance) {
      ViralChallengeEngine.instance = new ViralChallengeEngine();
    }
    return ViralChallengeEngine.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      console.log('🎯 Initializing Viral Challenge Engine (Enterprise Edition)...');
      
      await this.verifySchema();
      this.initializeMetrics();
      this.startChallengeMonitoring();
      this.startLeaderboardUpdates();
      
      this.initialized = true;
      console.log('✅ Viral Challenge Engine initialized successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize Viral Challenge Engine:', error);
      this.trackError('initialization', error);
      throw error;
    }
  }

  async createChallenge(data: {
    title: string;
    description: string;
    vertical: string;
    challengeType: 'quiz' | 'checklist' | 'score' | 'photo' | 'video';
    rules: string;
    instructions: string;
    duration?: number;
    maxParticipants?: number;
    challengeData: any;
    scoring?: any;
    rewards?: any[];
    badges?: any[];
    sharingRewards?: any;
    inviteRewards?: any;
    startDate: Date;
    endDate: Date;
  }): Promise<any> {
    try {
      console.log(`🎯 Creating viral challenge: ${data.title}`);

      const [challenge] = await db.insert(viralChallenges).values({
        title: data.title,
        description: data.description,
        vertical: data.vertical,
        challengeType: data.challengeType,
        rules: data.rules,
        instructions: data.instructions,
        duration: data.duration || 30,
        maxParticipants: data.maxParticipants || 0,
        challengeData: data.challengeData,
        scoring: data.scoring || this.getDefaultScoring(data.challengeType),
        rewards: data.rewards || [],
        badges: data.badges || this.getDefaultBadges(data.challengeType),
        sharingRewards: data.sharingRewards || this.getDefaultSharingRewards(),
        inviteRewards: data.inviteRewards || this.getDefaultInviteRewards(),
        startDate: data.startDate,
        endDate: data.endDate,
        isActive: true
      }).returning();

      const challengeUrl = await this.generateChallengeUrl(challenge);
      const socialAssets = await this.generateSocialAssets(challenge);

      console.log(`✅ Viral challenge created: ${challenge.title}`);
      return {
        success: true,
        challenge,
        challengeUrl,
        socialAssets,
        expectedViralFactor: this.calculateExpectedViralFactor(challenge)
      };

    } catch (error) {
      console.error('❌ Failed to create challenge:', error);
      this.trackError('create_challenge', error);
      throw error;
    }
  }

  async joinChallenge(challengeId: number, userData: {
    userId: string;
    userName: string;
    userEmail: string;
    invitedBy?: string;
  }): Promise<any> {
    try {
      const challenge = await db.select()
        .from(viralChallenges)
        .where(eq(viralChallenges.id, challengeId))
        .limit(1);

      if (!challenge.length) {
        throw new Error('Challenge not found');
      }

      const challengeData = challenge[0];

      // Check if challenge is active and within date range
      const now = new Date();
      if (!challengeData.isActive || now < challengeData.startDate || now > challengeData.endDate) {
        throw new Error('Challenge is not currently active');
      }

      // Check participant limit
      if (challengeData.maxParticipants > 0 && 
          challengeData.currentParticipants >= challengeData.maxParticipants) {
        throw new Error('Challenge has reached maximum participants');
      }

      // Check if user already joined
      const existingParticipant = await db.select()
        .from(challengeParticipants)
        .where(and(
          eq(challengeParticipants.challengeId, challengeId),
          eq(challengeParticipants.userId, userData.userId)
        ))
        .limit(1);

      if (existingParticipant.length > 0) {
        return {
          success: true,
          status: 'already_joined',
          participant: existingParticipant[0]
        };
      }

      // Generate referral code
      const referralCode = this.generateReferralCode(userData.userId, challengeId);

      // Join challenge
      const [participant] = await db.insert(challengeParticipants).values({
        challengeId,
        userId: userData.userId,
        userName: userData.userName,
        userEmail: userData.userEmail,
        invitedBy: userData.invitedBy,
        referralCode,
        progress: this.initializeProgress(challengeData.challengeType),
        score: 0,
        isCompleted: false
      }).returning();

      // Update challenge participant count
      await db.update(viralChallenges)
        .set({
          currentParticipants: sql`${viralChallenges.currentParticipants} + 1`
        })
        .where(eq(viralChallenges.id, challengeId));

      // Process invite rewards if invited
      if (userData.invitedBy) {
        await this.processInviteReward(userData.invitedBy, challengeId);
      }

      return {
        success: true,
        status: 'joined',
        participant,
        challenge: challengeData,
        nextSteps: this.getNextSteps(challengeData.challengeType, participant.progress)
      };

    } catch (error) {
      console.error('❌ Failed to join challenge:', error);
      this.trackError('join_challenge', error);
      throw error;
    }
  }

  async updateProgress(challengeId: number, userId: string, progressData: any): Promise<any> {
    try {
      const participant = await db.select()
        .from(challengeParticipants)
        .where(and(
          eq(challengeParticipants.challengeId, challengeId),
          eq(challengeParticipants.userId, userId)
        ))
        .limit(1);

      if (!participant.length) {
        throw new Error('Participant not found');
      }

      const participantData = participant[0];
      const challenge = await db.select()
        .from(viralChallenges)
        .where(eq(viralChallenges.id, challengeId))
        .limit(1);

      if (!challenge.length) {
        throw new Error('Challenge not found');
      }

      const challengeData = challenge[0];

      // Calculate new progress and score
      const updatedProgress = this.mergeProgress(
        participantData.progress,
        progressData,
        challengeData.challengeType
      );

      const newScore = this.calculateScore(
        updatedProgress,
        challengeData.scoring,
        challengeData.challengeType
      );

      const isCompleted = this.checkCompletion(
        updatedProgress,
        challengeData.challengeData,
        challengeData.challengeType
      );

      // Update participant
      const [updated] = await db.update(challengeParticipants)
        .set({
          progress: updatedProgress,
          score: newScore,
          isCompleted,
          completedAt: isCompleted ? new Date() : null,
          completionData: isCompleted ? progressData : participantData.completionData
        })
        .where(eq(challengeParticipants.id, participantData.id))
        .returning();

      // Update leaderboard rank
      await this.updateLeaderboardRank(challengeId, updated.id);

      // Process badges and rewards
      const earnedBadges = await this.processBadges(updated, challengeData);
      const earnedRewards = await this.processRewards(updated, challengeData);

      return {
        success: true,
        participant: updated,
        earnedBadges,
        earnedRewards,
        leaderboardPosition: await this.getLeaderboardPosition(challengeId, userId),
        nextSteps: isCompleted ? null : this.getNextSteps(challengeData.challengeType, updatedProgress)
      };

    } catch (error) {
      console.error('❌ Failed to update progress:', error);
      this.trackError('update_progress', error);
      throw error;
    }
  }

  async shareChallenge(challengeId: number, userId: string, platform: string): Promise<any> {
    try {
      const participant = await db.select()
        .from(challengeParticipants)
        .where(and(
          eq(challengeParticipants.challengeId, challengeId),
          eq(challengeParticipants.userId, userId)
        ))
        .limit(1);

      if (!participant.length) {
        throw new Error('Participant not found');
      }

      const participantData = participant[0];
      const challenge = await db.select()
        .from(viralChallenges)
        .where(eq(viralChallenges.id, challengeId))
        .limit(1);

      if (!challenge.length) {
        throw new Error('Challenge not found');
      }

      const challengeData = challenge[0];

      // Update shares count
      await db.update(challengeParticipants)
        .set({
          sharesCount: sql`${challengeParticipants.sharesCount} + 1`
        })
        .where(eq(challengeParticipants.id, participantData.id));

      // Update challenge viral metrics
      await db.update(viralChallenges)
        .set({
          totalShares: sql`${viralChallenges.totalShares} + 1`,
          viralFactor: sql`${viralChallenges.viralFactor} + 0.01`
        })
        .where(eq(viralChallenges.id, challengeId));

      // Process sharing rewards
      const sharingReward = await this.processSharingReward(participantData, challengeData, platform);

      // Generate shareable content
      const shareContent = await this.generateShareContent(challengeData, participantData, platform);

      return {
        success: true,
        shareContent,
        sharingReward,
        viralBonus: this.calculateViralBonus(participantData.sharesCount),
        shareUrl: `${shareContent.url}?ref=${participantData.referralCode}`
      };

    } catch (error) {
      console.error('❌ Failed to share challenge:', error);
      this.trackError('share_challenge', error);
      throw error;
    }
  }

  async getLeaderboard(challengeId: number, limit: number = 50): Promise<any> {
    try {
      const leaderboard = await db.select({
        rank: challengeParticipants.rank,
        userId: challengeParticipants.userId,
        userName: challengeParticipants.userName,
        score: challengeParticipants.score,
        isCompleted: challengeParticipants.isCompleted,
        completedAt: challengeParticipants.completedAt,
        badgesEarned: challengeParticipants.badgesEarned,
        sharesCount: challengeParticipants.sharesCount,
        invitesCount: challengeParticipants.invitesCount
      })
      .from(challengeParticipants)
      .where(eq(challengeParticipants.challengeId, challengeId))
      .orderBy(desc(challengeParticipants.score), desc(challengeParticipants.completedAt))
      .limit(limit);

      const [challengeStats] = await db.select({
        totalParticipants: count(challengeParticipants.id),
        completedCount: count(sql`CASE WHEN ${challengeParticipants.isCompleted} THEN 1 END`),
        avgScore: avg(challengeParticipants.score),
        totalShares: sum(challengeParticipants.sharesCount),
        totalInvites: sum(challengeParticipants.invitesCount)
      })
      .from(challengeParticipants)
      .where(eq(challengeParticipants.challengeId, challengeId));

      return {
        success: true,
        leaderboard,
        stats: challengeStats,
        lastUpdated: new Date()
      };

    } catch (error) {
      console.error('❌ Failed to get leaderboard:', error);
      this.trackError('get_leaderboard', error);
      throw error;
    }
  }

  private getDefaultScoring(challengeType: string): any {
    const scoringRules = {
      quiz: {
        correctAnswer: 10,
        timeBonus: 5,
        streakBonus: 2
      },
      checklist: {
        itemCompleted: 15,
        allCompleted: 50,
        speedBonus: 10
      },
      score: {
        basePoints: 1,
        milestone: 100,
        perfectScore: 500
      },
      photo: {
        submission: 25,
        likes: 2,
        shares: 5
      },
      video: {
        submission: 50,
        views: 1,
        engagement: 3
      }
    };

    return scoringRules[challengeType] || scoringRules.quiz;
  }

  private getDefaultBadges(challengeType: string): any[] {
    const badges = {
      quiz: [
        { name: 'Quiz Master', condition: 'score >= 100', icon: '🧠' },
        { name: 'Speed Demon', condition: 'completed_fast', icon: '⚡' },
        { name: 'Perfect Score', condition: 'all_correct', icon: '🎯' }
      ],
      checklist: [
        { name: 'Completionist', condition: 'all_items_done', icon: '✅' },
        { name: 'Fast Finisher', condition: 'completed_early', icon: '🏃' }
      ],
      photo: [
        { name: 'Photographer', condition: 'photo_submitted', icon: '📸' },
        { name: 'Viral Shot', condition: 'high_engagement', icon: '🔥' }
      ],
      video: [
        { name: 'Video Creator', condition: 'video_submitted', icon: '🎥' },
        { name: 'Viral Video', condition: 'high_views', icon: '🌟' }
      ]
    };

    return badges[challengeType] || badges.quiz;
  }

  private getDefaultSharingRewards(): any {
    return {
      points: 10,
      bonusMultiplier: 1.1,
      unlockThreshold: 5
    };
  }

  private getDefaultInviteRewards(): any {
    return {
      pointsPerInvite: 25,
      bonusAtMilestones: [5, 10, 25, 50],
      specialBadges: true
    };
  }

  private calculateExpectedViralFactor(challenge: any): number {
    let factor = 0.5; // Base viral factor

    // Challenge type impact
    const typeFactors = {
      video: 0.8,
      photo: 0.7,
      quiz: 0.6,
      checklist: 0.5,
      score: 0.6
    };
    factor += typeFactors[challenge.challengeType] || 0.5;

    // Rewards impact
    if (challenge.rewards?.length > 0) factor += 0.2;
    if (challenge.sharingRewards?.points > 0) factor += 0.1;
    if (challenge.inviteRewards?.pointsPerInvite > 0) factor += 0.1;

    return Math.min(factor, 1.0);
  }

  private generateReferralCode(userId: string, challengeId: number): string {
    const hash = crypto.createHash('md5').update(`${userId}-${challengeId}-${Date.now()}`).digest('hex');
    return hash.substring(0, 8).toUpperCase();
  }

  private initializeProgress(challengeType: string): any {
    const progressTemplates = {
      quiz: { questionsAnswered: 0, correctAnswers: 0, currentQuestion: 0 },
      checklist: { itemsCompleted: [], totalItems: 0, completionRate: 0 },
      score: { currentScore: 0, highScore: 0, attempts: 0 },
      photo: { submitted: false, likes: 0, shares: 0 },
      video: { submitted: false, views: 0, engagement: 0 }
    };

    return progressTemplates[challengeType] || progressTemplates.quiz;
  }

  private mergeProgress(currentProgress: any, newData: any, challengeType: string): any {
    switch (challengeType) {
      case 'quiz':
        return {
          ...currentProgress,
          questionsAnswered: Math.max(currentProgress.questionsAnswered, newData.questionsAnswered || 0),
          correctAnswers: Math.max(currentProgress.correctAnswers, newData.correctAnswers || 0),
          currentQuestion: newData.currentQuestion || currentProgress.currentQuestion
        };
      case 'checklist':
        return {
          ...currentProgress,
          itemsCompleted: [...new Set([...currentProgress.itemsCompleted, ...(newData.itemsCompleted || [])])],
          completionRate: newData.completionRate || currentProgress.completionRate
        };
      default:
        return { ...currentProgress, ...newData };
    }
  }

  private calculateScore(progress: any, scoring: any, challengeType: string): number {
    switch (challengeType) {
      case 'quiz':
        return (progress.correctAnswers * scoring.correctAnswer) + 
               (progress.timeBonus * scoring.timeBonus);
      case 'checklist':
        return (progress.itemsCompleted.length * scoring.itemCompleted) +
               (progress.completionRate === 1 ? scoring.allCompleted : 0);
      default:
        return progress.score || 0;
    }
  }

  private checkCompletion(progress: any, challengeData: any, challengeType: string): boolean {
    switch (challengeType) {
      case 'quiz':
        return progress.questionsAnswered >= (challengeData.totalQuestions || 10);
      case 'checklist':
        return progress.completionRate >= 1;
      case 'photo':
      case 'video':
        return progress.submitted === true;
      default:
        return false;
    }
  }

  private async generateChallengeUrl(challenge: any): Promise<string> {
    return `/challenges/${challenge.id}`;
  }

  private async generateSocialAssets(challenge: any): Promise<any> {
    return {
      twitter: {
        text: `🎯 Join the ${challenge.title} challenge! ${challenge.description}`,
        hashtags: ['challenge', challenge.vertical, 'viral'],
        url: `/challenges/${challenge.id}`
      },
      facebook: {
        title: challenge.title,
        description: challenge.description,
        image: `/api/challenges/${challenge.id}/image`
      },
      instagram: {
        caption: `🎯 ${challenge.title}\n\n${challenge.description}\n\nJoin now!`,
        hashtags: ['#challenge', `#${challenge.vertical}`, '#viral']
      }
    };
  }

  private getNextSteps(challengeType: string, progress: any): string[] {
    const nextSteps = {
      quiz: [
        `Answer question ${(progress.currentQuestion || 0) + 1}`,
        'Complete the quiz to earn points',
        'Share your progress to unlock bonuses'
      ],
      checklist: [
        'Complete the next item on your checklist',
        'Track your progress in real-time',
        'Invite friends to join the challenge'
      ]
    };

    return nextSteps[challengeType] || nextSteps.quiz;
  }

  private async updateLeaderboardRank(challengeId: number, participantId: number): Promise<void> {
    // Update ranks based on scores
    await db.execute(sql`
      UPDATE challenge_participants 
      SET rank = ranked.new_rank 
      FROM (
        SELECT id, ROW_NUMBER() OVER (ORDER BY score DESC, completed_at ASC) as new_rank
        FROM challenge_participants 
        WHERE challenge_id = ${challengeId}
      ) ranked 
      WHERE challenge_participants.id = ranked.id
    `);
  }

  private async getLeaderboardPosition(challengeId: number, userId: string): Promise<number> {
    const [result] = await db.select({ rank: challengeParticipants.rank })
      .from(challengeParticipants)
      .where(and(
        eq(challengeParticipants.challengeId, challengeId),
        eq(challengeParticipants.userId, userId)
      ))
      .limit(1);

    return result?.rank || 0;
  }

  private async processBadges(participant: any, challenge: any): Promise<any[]> {
    // Mock badge processing - would implement actual badge logic
    return [];
  }

  private async processRewards(participant: any, challenge: any): Promise<any[]> {
    // Mock reward processing - would implement actual reward logic
    return [];
  }

  private async processInviteReward(inviterId: string, challengeId: number): Promise<void> {
    // Update inviter's invite count and process rewards
    await db.update(challengeParticipants)
      .set({
        invitesCount: sql`${challengeParticipants.invitesCount} + 1`
      })
      .where(and(
        eq(challengeParticipants.challengeId, challengeId),
        eq(challengeParticipants.userId, inviterId)
      ));
  }

  private async processSharingReward(participant: any, challenge: any, platform: string): Promise<any> {
    const rewardPoints = challenge.sharingRewards?.points || 10;
    
    await db.update(challengeParticipants)
      .set({
        score: sql`${challengeParticipants.score} + ${rewardPoints}`
      })
      .where(eq(challengeParticipants.id, participant.id));

    return {
      points: rewardPoints,
      platform,
      message: `+${rewardPoints} points for sharing on ${platform}!`
    };
  }

  private async generateShareContent(challenge: any, participant: any, platform: string): Promise<any> {
    const baseUrl = process.env.BASE_URL || 'https://app.example.com';
    
    const content = {
      twitter: {
        text: `🎯 I'm crushing the ${challenge.title} challenge! Join me and let's see who wins! 💪`,
        url: `${baseUrl}/challenges/${challenge.id}?ref=${participant.referralCode}`,
        hashtags: ['challenge', challenge.vertical, 'compete']
      },
      facebook: {
        title: `Join me in the ${challenge.title} challenge!`,
        description: `I'm participating in this amazing challenge. Can you beat my score?`,
        url: `${baseUrl}/challenges/${challenge.id}?ref=${participant.referralCode}`
      },
      instagram: {
        caption: `🎯 Challenging myself with ${challenge.title}! Who's brave enough to join? Link in bio! 💪 #challenge #${challenge.vertical}`,
        url: `${baseUrl}/challenges/${challenge.id}?ref=${participant.referralCode}`
      }
    };

    return content[platform] || content.twitter;
  }

  private calculateViralBonus(sharesCount: number): number {
    return Math.floor(sharesCount / 5) * 10; // 10 bonus points per 5 shares
  }

  private async verifySchema(): Promise<void> {
    try {
      await db.select().from(viralChallenges).limit(1);
      await db.select().from(challengeParticipants).limit(1);
    } catch (error) {
      console.error('❌ Viral Challenge Engine schema verification failed:', error);
      throw new Error('Viral Challenge Engine database schema is not properly initialized');
    }
  }

  private initializeMetrics(): void {
    this.performanceMetrics.set('challenge_engine_started', Date.now());
    this.performanceMetrics.set('challenges_created', 0);
    this.performanceMetrics.set('participants_joined', 0);
    this.performanceMetrics.set('challenges_completed', 0);
  }

  private startChallengeMonitoring(): void {
    setInterval(() => {
      this.monitorActiveChallenges();
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  private startLeaderboardUpdates(): void {
    setInterval(() => {
      this.updateAllLeaderboards();
    }, 60 * 1000); // Every minute
  }

  private async monitorActiveChallenges(): Promise<void> {
    try {
      const now = new Date();
      
      // End expired challenges
      await db.update(viralChallenges)
        .set({ isActive: false })
        .where(and(
          eq(viralChallenges.isActive, true),
          sql`${viralChallenges.endDate} < ${now}`
        ));

      console.log('🎯 Challenge monitoring cycle completed');
    } catch (error) {
      console.error('❌ Failed to monitor challenges:', error);
    }
  }

  private async updateAllLeaderboards(): Promise<void> {
    try {
      const activeChallenges = await db.select({ id: viralChallenges.id })
        .from(viralChallenges)
        .where(eq(viralChallenges.isActive, true));

      for (const challenge of activeChallenges) {
        await this.updateLeaderboardRank(challenge.id, 0); // Update all ranks
      }
    } catch (error) {
      console.error('❌ Failed to update leaderboards:', error);
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
      console.error(`🚨 High-frequency error detected in Viral Challenge Engine ${context}:`, error);
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.verifySchema();
      return true;
    } catch (error) {
      console.error('❌ Viral Challenge Engine health check failed:', error);
      return false;
    }
  }
}