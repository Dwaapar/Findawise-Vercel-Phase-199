/**
 * Empire Brain "Throne Protocol" API Routes  
 * Billion-Dollar Empire Grade, Self-Evolving Intelligence APIs
 * 
 * Complete API endpoints for unified LLM routing, RLHF, autonomous
 * decisions, system mutations, and empire intelligence management.
 */

import { Router } from 'express';
import { throneProtocol } from '../services/empire/throneProtocol';
import { db } from '../db';
import { 
  empireIntelligence, llmProviders, intelligenceRoutes, autonomicDecisions,
  systemMutations, rlhfFeedback, empireVectorMemory, intentGraphs,
  empireBrainConfig, empireAnalytics
} from '../../shared/empireBrainTables';
import { eq, and, desc, asc, sql, like, gte, lte, inArray } from 'drizzle-orm';
import { z } from 'zod';

const router = Router();

// Validation schemas
const llmRequestSchema = z.object({
  request: z.string().min(1),
  context: z.record(z.any()).default({}),
  capabilities: z.array(z.string()).default(['reasoning']),
  maxTokens: z.number().optional(),
  temperature: z.number().min(0).max(2).optional()
});

const rlhfFeedbackSchema = z.object({
  action: z.string().min(1),
  outcome: z.record(z.any()),
  userFeedback: z.enum(['positive', 'negative', 'neutral']),
  feedbackDetails: z.record(z.any()).optional(),
  sessionId: z.string().optional(),
  userId: z.string().optional()
});

const mutationRequestSchema = z.object({
  mutationType: z.enum(['layout', 'content', 'flow', 'offer', 'cta', 'persona']),
  targetSystem: z.string().min(1),
  targetComponent: z.string().optional(),
  mutationReason: z.string().min(1),
  expectedImpact: z.record(z.any()),
  riskLevel: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  testingStrategy: z.array(z.string()).default([])
});

const configUpdateSchema = z.object({
  configKey: z.string().min(1),
  configValue: z.any(),
  description: z.string().optional(),
  requiresRestart: z.boolean().default(false)
});

let engineInitialized = false;

async function ensureEngineInitialized() {
  if (!engineInitialized) {
    await throneProtocol.initialize();
    engineInitialized = true;
  }
}

// ================================================
// EMPIRE BRAIN CORE INTELLIGENCE
// ================================================

/**
 * Get Empire Brain status and dashboard
 * GET /api/empire-brain/dashboard
 */
router.get('/dashboard', async (req, res) => {
  try {
    await ensureEngineInitialized();
    const dashboard = await throneProtocol.getThroneDashboard();
    
    res.json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    console.error('❌ Failed to get throne dashboard:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get throne dashboard'
    });
  }
});

/**
 * Process intelligent request through optimal LLM
 * POST /api/empire-brain/intelligence
 */
router.post('/intelligence', async (req, res) => {
  try {
    await ensureEngineInitialized();
    
    const validatedData = llmRequestSchema.parse(req.body);
    
    const response = await throneProtocol.routeToOptimalLLM(
      validatedData.request,
      validatedData.context,
      validatedData.capabilities
    );
    
    res.json({
      success: true,
      data: response,
      metadata: {
        request: validatedData.request,
        capabilities: validatedData.capabilities,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('❌ Failed to process intelligence request:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process intelligence request'
    });
  }
});

/**
 * Submit RLHF feedback for system learning
 * POST /api/empire-brain/feedback
 */
router.post('/feedback', async (req, res) => {
  try {
    await ensureEngineInitialized();
    
    const validatedData = rlhfFeedbackSchema.parse(req.body);
    
    await throneProtocol.processRLHFFeedback(
      validatedData.action,
      validatedData.outcome,
      validatedData.userFeedback,
      validatedData.feedbackDetails
    );
    
    res.json({
      success: true,
      message: 'RLHF feedback processed successfully',
      data: {
        action: validatedData.action,
        feedback: validatedData.userFeedback,
        processed: true
      }
    });
  } catch (error) {
    console.error('❌ Failed to process RLHF feedback:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process RLHF feedback'
    });
  }
});

// ================================================
// AUTONOMOUS DECISION ENGINE
// ================================================

/**
 * Get autonomous decisions
 * GET /api/empire-brain/decisions
 */
router.get('/decisions', async (req, res) => {
  try {
    const { 
      decisionType, 
      status = 'completed',
      limit = 50,
      startDate,
      endDate 
    } = req.query;
    
    let query = db.select().from(autonomicDecisions);
    
    const conditions = [];
    
    if (decisionType) {
      conditions.push(eq(autonomicDecisions.decisionType, decisionType as string));
    }
    
    if (status) {
      conditions.push(eq(autonomicDecisions.implementationStatus, status as string));
    }
    
    if (startDate) {
      conditions.push(gte(autonomicDecisions.createdAt, new Date(startDate as string)));
    }
    
    if (endDate) {
      conditions.push(lte(autonomicDecisions.createdAt, new Date(endDate as string)));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    const decisions = await query
      .orderBy(desc(autonomicDecisions.createdAt))
      .limit(parseInt(limit as string));
    
    res.json({
      success: true,
      data: decisions
    });
  } catch (error) {
    console.error('❌ Failed to get decisions:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get decisions'
    });
  }
});

/**
 * Get decision by ID
 * GET /api/empire-brain/decisions/:id
 */
router.get('/decisions/:id', async (req, res) => {
  try {
    const decisionId = req.params.id;
    
    const [decision] = await db.select()
      .from(autonomicDecisions)
      .where(eq(autonomicDecisions.decisionId, decisionId))
      .limit(1);
    
    if (!decision) {
      return res.status(404).json({
        success: false,
        error: 'Decision not found'
      });
    }
    
    res.json({
      success: true,
      data: decision
    });
  } catch (error) {
    console.error('❌ Failed to get decision:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get decision'
    });
  }
});

// ================================================
// SYSTEM MUTATION ENGINE
// ================================================

/**
 * Get system mutations
 * GET /api/empire-brain/mutations
 */
router.get('/mutations', async (req, res) => {
  try {
    const { 
      mutationType, 
      status = 'successful',
      targetSystem,
      limit = 50 
    } = req.query;
    
    let query = db.select().from(systemMutations);
    
    const conditions = [];
    
    if (mutationType) {
      conditions.push(eq(systemMutations.mutationType, mutationType as string));
    }
    
    if (status) {
      conditions.push(eq(systemMutations.mutationStatus, status as string));
    }
    
    if (targetSystem) {
      conditions.push(like(systemMutations.targetSystem, `%${targetSystem}%`));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    const mutations = await query
      .orderBy(desc(systemMutations.executedAt))
      .limit(parseInt(limit as string));
    
    res.json({
      success: true,
      data: mutations
    });
  } catch (error) {
    console.error('❌ Failed to get mutations:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get mutations'
    });
  }
});

/**
 * Request system mutation
 * POST /api/empire-brain/mutations
 */
router.post('/mutations', async (req, res) => {
  try {
    await ensureEngineInitialized();
    
    const validatedData = mutationRequestSchema.parse(req.body);
    
    // Create mutation object
    const mutation = {
      mutationId: `mut_${Date.now()}`,
      mutationType: validatedData.mutationType,
      targetSystem: validatedData.targetSystem,
      targetComponent: validatedData.targetComponent,
      originalState: {}, // Will be populated by system
      mutatedState: {}, // Will be populated by system
      mutationReason: validatedData.mutationReason,
      expectedImpact: validatedData.expectedImpact,
      rollbackPlan: {}, // Will be generated by system
      testingStrategy: validatedData.testingStrategy
    };
    
    // Execute mutation
    const success = await throneProtocol.executeMutation(mutation);
    
    if (success) {
      res.json({
        success: true,
        message: 'System mutation executed successfully',
        data: {
          mutationId: mutation.mutationId,
          status: 'executing'
        }
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to execute mutation'
      });
    }
  } catch (error) {
    console.error('❌ Failed to request mutation:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to request mutation'
    });
  }
});

// ================================================
// LLM PROVIDER MANAGEMENT
// ================================================

/**
 * Get LLM providers status
 * GET /api/empire-brain/providers
 */
router.get('/providers', async (req, res) => {
  try {
    const { activeOnly = true } = req.query;
    
    let query = db.select().from(llmProviders);
    
    if (activeOnly === 'true') {
      query = query.where(eq(llmProviders.isActive, true));
    }
    
    const providers = await query.orderBy(desc(llmProviders.priority));
    
    res.json({
      success: true,
      data: providers
    });
  } catch (error) {
    console.error('❌ Failed to get providers:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get providers'
    });
  }
});

/**
 * Update LLM provider configuration
 * PUT /api/empire-brain/providers/:id
 */
router.put('/providers/:id', async (req, res) => {
  try {
    const providerId = req.params.id;
    const { priority, isActive, quotaLimit, configSettings } = req.body;
    
    const updateData: any = {
      updatedAt: new Date()
    };
    
    if (priority !== undefined) updateData.priority = priority;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (quotaLimit !== undefined) updateData.quotaLimit = quotaLimit;
    if (configSettings !== undefined) updateData.configSettings = configSettings;
    
    const [updatedProvider] = await db.update(llmProviders)
      .set(updateData)
      .where(eq(llmProviders.id, providerId))
      .returning();
    
    if (!updatedProvider) {
      return res.status(404).json({
        success: false,
        error: 'Provider not found'
      });
    }
    
    res.json({
      success: true,
      data: updatedProvider,
      message: 'Provider updated successfully'
    });
  } catch (error) {
    console.error('❌ Failed to update provider:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update provider'
    });
  }
});

// ================================================
// VECTOR MEMORY SYSTEM
// ================================================

/**
 * Search vector memory
 * POST /api/empire-brain/memory/search
 */
router.post('/memory/search', async (req, res) => {
  try {
    const { query, limit = 10, threshold = 0.8 } = req.body;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }
    
    // For now, return text-based search
    // TODO: Implement actual vector similarity search
    const memories = await db.select()
      .from(empireVectorMemory)
      .where(and(
        eq(empireVectorMemory.isActive, true),
        like(empireVectorMemory.memoryContent, `%${query}%`)
      ))
      .orderBy(desc(empireVectorMemory.importanceScore))
      .limit(limit);
    
    res.json({
      success: true,
      data: memories,
      metadata: {
        query,
        threshold,
        results: memories.length
      }
    });
  } catch (error) {
    console.error('❌ Failed to search memory:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to search memory'
    });
  }
});

/**
 * Add memory
 * POST /api/empire-brain/memory
 */
router.post('/memory', async (req, res) => {
  try {
    const { content, memoryType, importance = 0.5, contextTags = [] } = req.body;
    
    if (!content || !memoryType) {
      return res.status(400).json({
        success: false,
        error: 'Content and memory type are required'
      });
    }
    
    const [memory] = await db.insert(empireVectorMemory).values({
      memoryContent: content,
      memoryType,
      vectorEmbedding: [], // TODO: Generate actual embedding
      memorySource: 'api_request',
      contextTags,
      importanceScore: importance,
      isActive: true
    }).returning();
    
    res.json({
      success: true,
      data: memory,
      message: 'Memory added successfully'
    });
  } catch (error) {
    console.error('❌ Failed to add memory:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to add memory'
    });
  }
});

// ================================================
// CONFIGURATION MANAGEMENT
// ================================================

/**
 * Get brain configuration
 * GET /api/empire-brain/config
 */
router.get('/config', async (req, res) => {
  try {
    const { activeOnly = true } = req.query;
    
    let query = db.select().from(empireBrainConfig);
    
    if (activeOnly === 'true') {
      query = query.where(eq(empireBrainConfig.isActive, true));
    }
    
    const configs = await query.orderBy(asc(empireBrainConfig.configKey));
    
    res.json({
      success: true,
      data: configs
    });
  } catch (error) {
    console.error('❌ Failed to get config:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get config'
    });
  }
});

/**
 * Update brain configuration
 * PUT /api/empire-brain/config
 */
router.put('/config', async (req, res) => {
  try {
    const validatedData = configUpdateSchema.parse(req.body);
    
    const [config] = await db.insert(empireBrainConfig).values({
      configKey: validatedData.configKey,
      configValue: validatedData.configValue,
      configType: 'user',
      description: validatedData.description,
      requiresRestart: validatedData.requiresRestart,
      isActive: true
    }).onConflictDoUpdate({
      target: empireBrainConfig.configKey,
      set: {
        configValue: validatedData.configValue,
        description: validatedData.description,
        requiresRestart: validatedData.requiresRestart,
        updatedAt: new Date()
      }
    }).returning();
    
    res.json({
      success: true,
      data: config,
      message: 'Configuration updated successfully'
    });
  } catch (error) {
    console.error('❌ Failed to update config:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update config'
    });
  }
});

// ================================================
// ANALYTICS & METRICS
// ================================================

/**
 * Get empire analytics
 * GET /api/empire-brain/analytics
 */
router.get('/analytics', async (req, res) => {
  try {
    const { 
      metricType, 
      startDate, 
      endDate, 
      limit = 100 
    } = req.query;
    
    let query = db.select().from(empireAnalytics);
    
    const conditions = [];
    
    if (metricType) {
      conditions.push(eq(empireAnalytics.metricType, metricType as string));
    }
    
    if (startDate) {
      conditions.push(gte(empireAnalytics.recordedAt, new Date(startDate as string)));
    }
    
    if (endDate) {
      conditions.push(lte(empireAnalytics.recordedAt, new Date(endDate as string)));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    const analytics = await query
      .orderBy(desc(empireAnalytics.recordedAt))
      .limit(parseInt(limit as string));
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('❌ Failed to get analytics:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get analytics'
    });
  }
});

// ================================================
// HEALTH & STATUS
// ================================================

/**
 * Empire Brain health check
 * GET /api/empire-brain/health
 */
router.get('/health', async (req, res) => {
  try {
    await ensureEngineInitialized();
    const health = await throneProtocol.healthCheck();
    
    res.json({
      success: true,
      data: health
    });
  } catch (error) {
    console.error('❌ Empire Brain health check failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Health check failed'
    });
  }
});

/**
 * Get system status
 * GET /api/empire-brain/status
 */
router.get('/status', async (req, res) => {
  try {
    const status = {
      engineInitialized,
      timestamp: new Date(),
      features: {
        llmRouting: true,
        autonomicDecisions: true,
        systemMutations: true,
        vectorMemory: true,
        rlhfFeedback: true,
        intentGraphs: true,
        realTimeAnalytics: true
      }
    };
    
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('❌ Failed to get status:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get status'
    });
  }
});

export default router;