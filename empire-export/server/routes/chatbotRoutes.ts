/**
 * Real-Time Chatbot/Assistant API Routes
 * Billion-Dollar Empire Grade, Migration-Proof, Full Production
 */

import { Router } from 'express';
import { chatbotEngine } from '../services/chatbot/chatbotEngine';
import { db } from '../db';
import { 
  chatSessions, chatMessages, chatIntents, botKnowledgeBase, 
  conversationContext, chatAnalytics, humanAgents, chatEscalations,
  chatWidgets, cannedResponses, chatFeedback
} from '../../shared/chatbotTables';
import { eq, and, desc, asc, sql, like, inArray } from 'drizzle-orm';
import { z } from 'zod';

const router = Router();

// Validation schemas
const startSessionSchema = z.object({
  userId: z.string().optional(),
  channelType: z.enum(['web', 'whatsapp', 'telegram', 'voice', 'email']).default('web'),
  language: z.string().default('en'),
  userArchetype: z.string().optional(),
  metadata: z.record(z.any()).default({})
});

const sendMessageSchema = z.object({
  sessionId: z.string(),
  message: z.string().min(1).max(5000),
  messageType: z.enum(['text', 'voice', 'image']).default('text')
});

const createIntentSchema = z.object({
  intentName: z.string().min(1).max(100),
  intentCategory: z.enum(['support', 'sales', 'lead_gen', 'info']),
  triggerKeywords: z.array(z.string()).default([]),
  triggerPhrases: z.array(z.string()).default([]),
  responseTemplates: z.array(z.string()).default([]),
  confidence: z.number().min(0).max(1).default(0.5),
  priority: z.number().min(1).max(10).default(5),
  handoffToHuman: z.boolean().default(false)
});

// Initialize chatbot engine
let engineInitialized = false;

async function ensureEngineInitialized() {
  if (!engineInitialized) {
    await chatbotEngine.initialize();
    engineInitialized = true;
  }
}

// ================================================
// CHAT SESSION MANAGEMENT
// ================================================

/**
 * Start a new chat session
 * POST /api/chatbot/session/start
 */
router.post('/session/start', async (req, res) => {
  try {
    await ensureEngineInitialized();
    
    const validatedData = startSessionSchema.parse(req.body);
    const sessionId = await chatbotEngine.startSession(validatedData);
    
    res.json({
      success: true,
      data: { sessionId },
      message: 'Chat session started successfully'
    });
  } catch (error) {
    console.error('❌ Failed to start chat session:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to start chat session'
    });
  }
});

/**
 * Send message to chatbot
 * POST /api/chatbot/message
 */
router.post('/message', async (req, res) => {
  try {
    await ensureEngineInitialized();
    
    const validatedData = sendMessageSchema.parse(req.body);
    const response = await chatbotEngine.processMessage(
      validatedData.sessionId,
      validatedData.message,
      validatedData.messageType
    );
    
    res.json({
      success: true,
      data: response,
      message: 'Message processed successfully'
    });
  } catch (error) {
    console.error('❌ Failed to process message:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process message'
    });
  }
});

/**
 * Get chat session details
 * GET /api/chatbot/session/:sessionId
 */
router.get('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const [session] = await db.select()
      .from(chatSessions)
      .where(eq(chatSessions.sessionId, sessionId))
      .limit(1);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    const messages = await db.select()
      .from(chatMessages)
      .where(eq(chatMessages.sessionId, sessionId))
      .orderBy(asc(chatMessages.createdAt));

    const context = await db.select()
      .from(conversationContext)
      .where(eq(conversationContext.sessionId, sessionId));

    res.json({
      success: true,
      data: {
        session,
        messages,
        context
      }
    });
  } catch (error) {
    console.error('❌ Failed to get session:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get session'
    });
  }
});

/**
 * End chat session
 * POST /api/chatbot/session/:sessionId/end
 */
router.post('/session/:sessionId/end', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { reason } = req.body;
    
    await ensureEngineInitialized();
    await chatbotEngine.endSession(sessionId, reason);
    
    res.json({
      success: true,
      message: 'Session ended successfully'
    });
  } catch (error) {
    console.error('❌ Failed to end session:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to end session'
    });
  }
});

// ================================================
// CHAT INTENTS MANAGEMENT
// ================================================

/**
 * Get all chat intents
 * GET /api/chatbot/intents
 */
router.get('/intents', async (req, res) => {
  try {
    const intents = await db.select()
      .from(chatIntents)
      .orderBy(desc(chatIntents.priority), asc(chatIntents.intentName));
    
    res.json({
      success: true,
      data: intents
    });
  } catch (error) {
    console.error('❌ Failed to get intents:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get intents'
    });
  }
});

/**
 * Create new chat intent
 * POST /api/chatbot/intents
 */
router.post('/intents', async (req, res) => {
  try {
    const validatedData = createIntentSchema.parse(req.body);
    
    const [newIntent] = await db.insert(chatIntents)
      .values(validatedData)
      .returning();
    
    res.json({
      success: true,
      data: newIntent,
      message: 'Intent created successfully'
    });
  } catch (error) {
    console.error('❌ Failed to create intent:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create intent'
    });
  }
});

/**
 * Update chat intent
 * PUT /api/chatbot/intents/:id
 */
router.put('/intents/:id', async (req, res) => {
  try {
    const intentId = parseInt(req.params.id);
    const validatedData = createIntentSchema.partial().parse(req.body);
    
    const [updatedIntent] = await db.update(chatIntents)
      .set({ ...validatedData, updatedAt: new Date() })
      .where(eq(chatIntents.id, intentId))
      .returning();
    
    if (!updatedIntent) {
      return res.status(404).json({
        success: false,
        error: 'Intent not found'
      });
    }
    
    res.json({
      success: true,
      data: updatedIntent,
      message: 'Intent updated successfully'
    });
  } catch (error) {
    console.error('❌ Failed to update intent:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update intent'
    });
  }
});

// ================================================
// KNOWLEDGE BASE MANAGEMENT
// ================================================

/**
 * Get knowledge base entries
 * GET /api/chatbot/knowledge
 */
router.get('/knowledge', async (req, res) => {
  try {
    const { category, search, limit = 50 } = req.query;
    
    let query = db.select().from(botKnowledgeBase);
    
    if (category) {
      query = query.where(eq(botKnowledgeBase.category, category as string));
    }
    
    if (search) {
      query = query.where(like(botKnowledgeBase.title, `%${search}%`));
    }
    
    const knowledge = await query
      .orderBy(desc(botKnowledgeBase.priority), desc(botKnowledgeBase.usageCount))
      .limit(parseInt(limit as string));
    
    res.json({
      success: true,
      data: knowledge
    });
  } catch (error) {
    console.error('❌ Failed to get knowledge base:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get knowledge base'
    });
  }
});

/**
 * Add knowledge base entry
 * POST /api/chatbot/knowledge
 */
router.post('/knowledge', async (req, res) => {
  try {
    const {
      category,
      subcategory,
      title,
      content,
      tags = [],
      intents = [],
      verticals = [],
      priority = 5
    } = req.body;
    
    if (!category || !title || !content) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: category, title, content'
      });
    }
    
    const [newEntry] = await db.insert(botKnowledgeBase)
      .values({
        category,
        subcategory,
        title,
        content,
        sourceType: 'manual',
        tags,
        intents,
        verticals,
        priority
      })
      .returning();
    
    res.json({
      success: true,
      data: newEntry,
      message: 'Knowledge entry created successfully'
    });
  } catch (error) {
    console.error('❌ Failed to create knowledge entry:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create knowledge entry'
    });
  }
});

// ================================================
// CHAT WIDGETS MANAGEMENT
// ================================================

/**
 * Get chat widgets
 * GET /api/chatbot/widgets
 */
router.get('/widgets', async (req, res) => {
  try {
    const widgets = await db.select()
      .from(chatWidgets)
      .orderBy(desc(chatWidgets.createdAt));
    
    res.json({
      success: true,
      data: widgets
    });
  } catch (error) {
    console.error('❌ Failed to get widgets:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get widgets'
    });
  }
});

/**
 * Create chat widget
 * POST /api/chatbot/widgets
 */
router.post('/widgets', async (req, res) => {
  try {
    const {
      widgetName,
      widgetType = 'floating',
      targetPages = [],
      appearance = {},
      behavior = {},
      greetingMessage = 'Hello! How can I help you today?',
      placeholderText = 'Type your message...'
    } = req.body;
    
    if (!widgetName) {
      return res.status(400).json({
        success: false,
        error: 'Widget name is required'
      });
    }
    
    const [newWidget] = await db.insert(chatWidgets)
      .values({
        widgetName,
        widgetType,
        targetPages,
        appearance,
        behavior,
        greetingMessage,
        placeholderText
      })
      .returning();
    
    res.json({
      success: true,
      data: newWidget,
      message: 'Widget created successfully'
    });
  } catch (error) {
    console.error('❌ Failed to create widget:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create widget'
    });
  }
});

// ================================================
// ANALYTICS & REPORTING
// ================================================

/**
 * Get chat analytics
 * GET /api/chatbot/analytics
 */
router.get('/analytics', async (req, res) => {
  try {
    const { 
      startDate, 
      endDate, 
      eventType, 
      sessionId,
      limit = 100 
    } = req.query;
    
    let query = db.select().from(chatAnalytics);
    
    const conditions = [];
    
    if (startDate) {
      conditions.push(sql`${chatAnalytics.timestamp} >= ${new Date(startDate as string)}`);
    }
    
    if (endDate) {
      conditions.push(sql`${chatAnalytics.timestamp} <= ${new Date(endDate as string)}`);
    }
    
    if (eventType) {
      conditions.push(eq(chatAnalytics.eventType, eventType as string));
    }
    
    if (sessionId) {
      conditions.push(eq(chatAnalytics.sessionId, sessionId as string));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    const analytics = await query
      .orderBy(desc(chatAnalytics.timestamp))
      .limit(parseInt(limit as string));
    
    // Get summary statistics
    const summaryStats = await db.select({
      totalSessions: sql`COUNT(DISTINCT ${chatAnalytics.sessionId})`,
      totalMessages: sql`COUNT(*)`,
      avgResponseTime: sql`AVG(CASE WHEN ${chatAnalytics.eventData}->>'responseTime' IS NOT NULL THEN (${chatAnalytics.eventData}->>'responseTime')::numeric END)`,
      conversionRate: sql`ROUND((COUNT(CASE WHEN ${chatAnalytics.eventType} = 'conversion' THEN 1 END)::decimal / NULLIF(COUNT(DISTINCT ${chatAnalytics.sessionId}), 0)) * 100, 2)`
    })
    .from(chatAnalytics)
    .where(conditions.length > 0 ? and(...conditions) : undefined);
    
    res.json({
      success: true,
      data: {
        analytics,
        summary: summaryStats[0] || {
          totalSessions: 0,
          totalMessages: 0,
          avgResponseTime: 0,
          conversionRate: 0
        }
      }
    });
  } catch (error) {
    console.error('❌ Failed to get analytics:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get analytics'
    });
  }
});

/**
 * Get active sessions dashboard
 * GET /api/chatbot/dashboard/sessions
 */
router.get('/dashboard/sessions', async (req, res) => {
  try {
    const activeSessions = await db.select({
      sessionId: chatSessions.sessionId,
      userId: chatSessions.userId,
      channelType: chatSessions.channelType,
      status: chatSessions.status,
      intent: chatSessions.intent,
      totalMessages: chatSessions.totalMessages,
      lastActivityAt: chatSessions.lastActivityAt,
      startedAt: chatSessions.startedAt
    })
    .from(chatSessions)
    .where(eq(chatSessions.status, 'active'))
    .orderBy(desc(chatSessions.lastActivityAt));
    
    const totalActiveCount = activeSessions.length;
    const totalEscalated = await db.select({ count: sql`count(*)` })
      .from(chatSessions)
      .where(eq(chatSessions.status, 'escalated'));
    
    const recentMessages = await db.select({
      sessionId: chatMessages.sessionId,
      messageType: chatMessages.messageType,
      content: chatMessages.content,
      intent: chatMessages.intent,
      confidence: chatMessages.confidence,
      createdAt: chatMessages.createdAt
    })
    .from(chatMessages)
    .where(sql`${chatMessages.createdAt} > NOW() - INTERVAL '1 hour'`)
    .orderBy(desc(chatMessages.createdAt))
    .limit(20);
    
    res.json({
      success: true,
      data: {
        activeSessions,
        stats: {
          totalActive: totalActiveCount,
          totalEscalated: totalEscalated[0]?.count || 0
        },
        recentMessages
      }
    });
  } catch (error) {
    console.error('❌ Failed to get dashboard data:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get dashboard data'
    });
  }
});

// ================================================
// HUMAN ESCALATION MANAGEMENT
// ================================================

/**
 * Get escalations
 * GET /api/chatbot/escalations
 */
router.get('/escalations', async (req, res) => {
  try {
    const { status = 'pending' } = req.query;
    
    const escalations = await db.select()
      .from(chatEscalations)
      .where(eq(chatEscalations.status, status as string))
      .orderBy(desc(chatEscalations.createdAt));
    
    res.json({
      success: true,
      data: escalations
    });
  } catch (error) {
    console.error('❌ Failed to get escalations:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get escalations'
    });
  }
});

/**
 * Accept escalation
 * POST /api/chatbot/escalations/:id/accept
 */
router.post('/escalations/:id/accept', async (req, res) => {
  try {
    const escalationId = req.params.id;
    const { agentId, notes } = req.body;
    
    const [updatedEscalation] = await db.update(chatEscalations)
      .set({ 
        status: 'accepted',
        toAgentId: agentId,
        notes,
        responseTime: sql`EXTRACT(EPOCH FROM (NOW() - ${chatEscalations.createdAt}))`,
        updatedAt: new Date()
      })
      .where(eq(chatEscalations.id, escalationId))
      .returning();
    
    if (!updatedEscalation) {
      return res.status(404).json({
        success: false,
        error: 'Escalation not found'
      });
    }
    
    // Update session with human agent
    await db.update(chatSessions)
      .set({
        humanAgentId: agentId,
        status: 'human_assisted'
      })
      .where(eq(chatSessions.sessionId, updatedEscalation.sessionId));
    
    res.json({
      success: true,
      data: updatedEscalation,
      message: 'Escalation accepted successfully'
    });
  } catch (error) {
    console.error('❌ Failed to accept escalation:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to accept escalation'
    });
  }
});

// ================================================
// HEALTH CHECK & SYSTEM STATUS
// ================================================

/**
 * Chatbot health check
 * GET /api/chatbot/health
 */
router.get('/health', async (req, res) => {
  try {
    await ensureEngineInitialized();
    const health = await chatbotEngine.healthCheck();
    
    res.json({
      success: true,
      data: health
    });
  } catch (error) {
    console.error('❌ Chatbot health check failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Health check failed'
    });
  }
});

/**
 * Get system configuration
 * GET /api/chatbot/config
 */
router.get('/config', async (req, res) => {
  try {
    const config = {
      supportedChannels: ['web', 'whatsapp', 'telegram', 'voice', 'email'],
      supportedLanguages: ['en', 'es', 'fr', 'de'],
      maxMessageLength: 5000,
      sessionTimeout: 3600, // 1 hour in seconds
      engineStatus: engineInitialized ? 'initialized' : 'not_initialized',
      features: {
        intentDetection: true,
        llmIntegration: true,
        humanEscalation: true,
        multiLanguage: true,
        analytics: true,
        knowledgeBase: true
      }
    };
    
    res.json({
      success: true,
      data: config
    });
  } catch (error) {
    console.error('❌ Failed to get config:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get config'
    });
  }
});

export default router;