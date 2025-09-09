/**
 * AI Content Defender & Plagiarism Watchdog API Routes
 * Billion-Dollar Empire Grade, Migration-Proof, Full Production
 */

import { Router } from 'express';
import { contentDefenderEngine } from '../services/contentDefender/contentDefenderEngine';
import { db } from '../db';
import { 
  contentInventory, plagiarismDetections, dmcaRequests,
  scraperDetections, contentRefreshes, contentMonitoringJobs, seoCounterAttacks
} from '../../shared/contentDefenderTables';
import { eq, and, desc, asc, sql, like, gte, lte } from 'drizzle-orm';
import { z } from 'zod';

const router = Router();

// Validation schemas
const addContentSchema = z.object({
  contentType: z.enum(['blog_post', 'landing_page', 'product_page', 'article', 'tool_page']),
  title: z.string().min(1).max(255),
  sourceUrl: z.string().url(),
  content: z.string().min(1),
  priority: z.number().min(1).max(10).default(5),
  metadata: z.record(z.any()).default({})
});

const scanRequestSchema = z.object({
  contentIds: z.array(z.string()).optional(),
  scanType: z.enum(['full', 'priority', 'recent']).default('recent'),
  forceRescan: z.boolean().default(false)
});

const dmcaRequestSchema = z.object({
  contentId: z.string(),
  targetUrl: z.string().url(),
  violationType: z.enum(['plagiarism', 'clone', 'scraping', 'seo_attack']),
  customMessage: z.string().optional()
});

// Initialize engine
let engineInitialized = false;

async function ensureEngineInitialized() {
  if (!engineInitialized) {
    await contentDefenderEngine.initialize();
    engineInitialized = true;
  }
}

// ================================================
// CONTENT INVENTORY MANAGEMENT
// ================================================

/**
 * Get content inventory
 * GET /api/content-defender/inventory
 */
router.get('/inventory', async (req, res) => {
  try {
    const { 
      contentType, 
      riskLevel, 
      limit = 50, 
      offset = 0,
      sortBy = 'lastScanned'
    } = req.query;
    
    let query = db.select().from(contentInventory);
    
    if (contentType) {
      query = query.where(eq(contentInventory.contentType, contentType as string));
    }
    
    // Apply sorting
    const sortColumn = sortBy === 'priority' ? contentInventory.priority :
                      sortBy === 'modified' ? contentInventory.lastModified :
                      contentInventory.lastScanned;
    
    query = query.orderBy(desc(sortColumn));
    query = query.limit(parseInt(limit as string)).offset(parseInt(offset as string));
    
    const inventory = await query;
    
    // Get threat counts for each content item
    const inventoryWithThreats = await Promise.all(
      inventory.map(async (item) => {
        const threats = await db.select({ count: sql`count(*)` })
          .from(plagiarismDetection)
          .where(and(
            eq(plagiarismDetection.contentId, item.id),
            eq(plagiarismDetection.status, 'detected')
          ));
        
        return {
          ...item,
          threatCount: threats[0]?.count || 0
        };
      })
    );
    
    res.json({
      success: true,
      data: inventoryWithThreats,
      pagination: {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        total: inventory.length
      }
    });
  } catch (error) {
    console.error('❌ Failed to get inventory:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get inventory'
    });
  }
});

/**
 * Add content to inventory
 * POST /api/content-defender/inventory
 */
router.post('/inventory', async (req, res) => {
  try {
    const validatedData = addContentSchema.parse(req.body);
    
    // Generate content hash
    const crypto = require('crypto');
    const contentHash = crypto.createHash('md5').update(validatedData.content).digest('hex');
    
    const [newContent] = await db.insert(contentInventory)
      .values({
        ...validatedData,
        contentHash,
        publishedAt: new Date(),
        lastScanned: new Date(0), // Force scan on next run
        version: 1
      })
      .returning();
    
    res.json({
      success: true,
      data: newContent,
      message: 'Content added to inventory successfully'
    });
  } catch (error) {
    console.error('❌ Failed to add content:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to add content'
    });
  }
});

/**
 * Update content in inventory
 * PUT /api/content-defender/inventory/:id
 */
router.put('/inventory/:id', async (req, res) => {
  try {
    const contentId = req.params.id;
    const updateData = addContentSchema.partial().parse(req.body);
    
    if (updateData.content) {
      const crypto = require('crypto');
      updateData.contentHash = crypto.createHash('md5').update(updateData.content).digest('hex');
      updateData.lastModified = new Date();
    }
    
    const [updatedContent] = await db.update(contentInventory)
      .set(updateData)
      .where(eq(contentInventory.id, contentId))
      .returning();
    
    if (!updatedContent) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }
    
    res.json({
      success: true,
      data: updatedContent,
      message: 'Content updated successfully'
    });
  } catch (error) {
    console.error('❌ Failed to update content:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update content'
    });
  }
});

// ================================================
// SCANNING & DETECTION
// ================================================

/**
 * Trigger content scan
 * POST /api/content-defender/scan
 */
router.post('/scan', async (req, res) => {
  try {
    await ensureEngineInitialized();
    
    const validatedData = scanRequestSchema.parse(req.body);
    
    // Start scan asynchronously
    const scanPromise = contentDefenderEngine.scanAllContent();
    
    // Don't wait for completion, return immediate response
    res.json({
      success: true,
      message: 'Content scan initiated successfully',
      data: {
        scanType: validatedData.scanType,
        estimated: '5-15 minutes'
      }
    });
    
    // Log completion when done
    scanPromise.then(results => {
      console.log(`✅ Content scan completed: ${results.length} items processed`);
    }).catch(error => {
      console.error('❌ Content scan failed:', error);
    });
    
  } catch (error) {
    console.error('❌ Failed to start scan:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to start scan'
    });
  }
});

/**
 * Get scan results
 * GET /api/content-defender/threats
 */
router.get('/threats', async (req, res) => {
  try {
    const { 
      riskLevel, 
      threatType, 
      status = 'detected',
      limit = 50,
      startDate,
      endDate 
    } = req.query;
    
    let query = db.select().from(plagiarismDetections);
    
    const conditions = [];
    
    if (status) {
      conditions.push(eq(plagiarismDetections.status, status as string));
    }
    
    if (startDate) {
      conditions.push(gte(plagiarismDetections.detectedAt, new Date(startDate as string)));
    }
    
    if (endDate) {
      conditions.push(lte(plagiarismDetections.detectedAt, new Date(endDate as string)));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    const threats = await query
      .orderBy(desc(plagiarismDetections.detectedAt))
      .limit(parseInt(limit as string));
    
    // Get associated content information
    const threatsWithContent = await Promise.all(
      threats.map(async (threat) => {
        const [content] = await db.select({
          title: contentInventory.contentTitle,
          sourceUrl: contentInventory.contentUrl,
          contentType: contentInventory.contentType
        })
        .from(contentInventory)
        .where(eq(contentInventory.id, threat.originalContentId))
        .limit(1);
        
        return {
          ...threat,
          content: content || null
        };
      })
    );
    
    res.json({
      success: true,
      data: threatsWithContent
    });
  } catch (error) {
    console.error('❌ Failed to get threats:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get threats'
    });
  }
});

/**
 * Get threat dashboard
 * GET /api/content-defender/dashboard
 */
router.get('/dashboard', async (req, res) => {
  try {
    await ensureEngineInitialized();
    const dashboard = await contentDefenderEngine.getThreatDashboard();
    
    res.json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    console.error('❌ Failed to get dashboard:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get dashboard'
    });
  }
});

// ================================================
// DMCA MANAGEMENT
// ================================================

/**
 * Get DMCA requests
 * GET /api/content-defender/dmca
 */
router.get('/dmca', async (req, res) => {
  try {
    const { status, priority, limit = 50 } = req.query;
    
    let query = db.select().from(dmcaRequests);
    
    if (status) {
      query = query.where(eq(dmcaRequests.status, status as string));
    }
    
    if (priority) {
      query = query.where(eq(dmcaRequests.priority, priority as string));
    }
    
    const requests = await query
      .orderBy(desc(dmcaRequests.createdAt))
      .limit(parseInt(limit as string));
    
    res.json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error('❌ Failed to get DMCA requests:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get DMCA requests'
    });
  }
});

/**
 * Create DMCA request
 * POST /api/content-defender/dmca
 */
router.post('/dmca', async (req, res) => {
  try {
    await ensureEngineInitialized();
    
    const validatedData = dmcaRequestSchema.parse(req.body);
    
    // Find the threat to generate DMCA for
    const threat = {
      threatType: validatedData.violationType,
      threatSource: validatedData.targetUrl,
      similarityScore: 0.9, // Assume high similarity for manual requests
      firstDetected: new Date(),
      isActive: true,
      metadata: { manualRequest: true }
    };
    
    const requestId = await contentDefenderEngine.generateDMCARequest(
      validatedData.contentId, 
      threat
    );
    
    res.json({
      success: true,
      data: { requestId },
      message: 'DMCA request created successfully'
    });
  } catch (error) {
    console.error('❌ Failed to create DMCA request:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create DMCA request'
    });
  }
});

/**
 * Send DMCA request
 * POST /api/content-defender/dmca/:id/send
 */
router.post('/dmca/:id/send', async (req, res) => {
  try {
    await ensureEngineInitialized();
    
    const requestId = req.params.id;
    await contentDefenderEngine.sendDMCARequest(requestId);
    
    res.json({
      success: true,
      message: 'DMCA request sent successfully'
    });
  } catch (error) {
    console.error('❌ Failed to send DMCA request:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send DMCA request'
    });
  }
});

/**
 * Update DMCA request status
 * PUT /api/content-defender/dmca/:id/status
 */
router.put('/dmca/:id/status', async (req, res) => {
  try {
    const requestId = req.params.id;
    const { status, notes, responseReceived } = req.body;
    
    if (!['draft', 'sent', 'responded', 'resolved', 'failed'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status value'
      });
    }
    
    const updateData: any = { status, updatedAt: new Date() };
    
    if (notes) updateData.notes = notes;
    if (responseReceived) updateData.responseAt = new Date();
    
    const [updatedRequest] = await db.update(dmcaRequests)
      .set(updateData)
      .where(eq(dmcaRequests.id, requestId))
      .returning();
    
    if (!updatedRequest) {
      return res.status(404).json({
        success: false,
        error: 'DMCA request not found'
      });
    }
    
    res.json({
      success: true,
      data: updatedRequest,
      message: 'DMCA request status updated successfully'
    });
  } catch (error) {
    console.error('❌ Failed to update DMCA status:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update DMCA status'
    });
  }
});

// ================================================
// CONTENT REFRESH & REWRITING
// ================================================

/**
 * Get content refresh requests
 * GET /api/content-defender/refresh
 */
router.get('/refresh', async (req, res) => {
  try {
    const { status, priority, limit = 50 } = req.query;
    
    let query = db.select().from(contentRefresh);
    
    if (status) {
      query = query.where(eq(contentRefresh.status, status as string));
    }
    
    if (priority) {
      query = query.where(eq(contentRefresh.priority, priority as string));
    }
    
    const refreshRequests = await query
      .orderBy(desc(contentRefresh.requestedAt))
      .limit(parseInt(limit as string));
    
    res.json({
      success: true,
      data: refreshRequests
    });
  } catch (error) {
    console.error('❌ Failed to get refresh requests:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get refresh requests'
    });
  }
});

/**
 * Request content refresh
 * POST /api/content-defender/refresh
 */
router.post('/refresh', async (req, res) => {
  try {
    const { contentId, refreshType = 'ai_rewrite', reason, priority = 'medium' } = req.body;
    
    if (!contentId) {
      return res.status(400).json({
        success: false,
        error: 'Content ID is required'
      });
    }
    
    const [refreshRequest] = await db.insert(contentRefresh)
      .values({
        contentId,
        refreshType,
        reason: reason || 'manual_request',
        priority,
        status: 'queued',
        requestedAt: new Date()
      })
      .returning();
    
    res.json({
      success: true,
      data: refreshRequest,
      message: 'Content refresh request created successfully'
    });
  } catch (error) {
    console.error('❌ Failed to create refresh request:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create refresh request'
    });
  }
});

// ================================================
// CONTENT BACKUPS
// ================================================

/**
 * Get content backups
 * GET /api/content-defender/backups
 */
router.get('/backups', async (req, res) => {
  try {
    const { contentId, backupType, limit = 50 } = req.query;
    
    let query = db.select().from(contentBackups);
    
    if (contentId) {
      query = query.where(eq(contentBackups.contentId, contentId as string));
    }
    
    if (backupType) {
      query = query.where(eq(contentBackups.backupType, backupType as string));
    }
    
    const backups = await query
      .orderBy(desc(contentBackups.createdAt))
      .limit(parseInt(limit as string));
    
    res.json({
      success: true,
      data: backups
    });
  } catch (error) {
    console.error('❌ Failed to get backups:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get backups'
    });
  }
});

/**
 * Create content backup
 * POST /api/content-defender/backups
 */
router.post('/backups', async (req, res) => {
  try {
    const { contentId, backupType = 'manual', reason } = req.body;
    
    if (!contentId) {
      return res.status(400).json({
        success: false,
        error: 'Content ID is required'
      });
    }
    
    // Get current content
    const [content] = await db.select()
      .from(contentInventory)
      .where(eq(contentInventory.id, contentId))
      .limit(1);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }
    
    const [backup] = await db.insert(contentBackups)
      .values({
        contentId,
        backupType,
        originalContent: content.content,
        metadata: {
          version: content.version,
          backupReason: reason || 'manual_backup',
          originalFingerprint: content.lastFingerprint
        }
      })
      .returning();
    
    res.json({
      success: true,
      data: backup,
      message: 'Content backup created successfully'
    });
  } catch (error) {
    console.error('❌ Failed to create backup:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create backup'
    });
  }
});

// ================================================
// ANALYTICS & REPORTING
// ================================================

/**
 * Get protection analytics
 * GET /api/content-defender/analytics
 */
router.get('/analytics', async (req, res) => {
  try {
    const { startDate, endDate, granularity = 'daily' } = req.query;
    
    const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate as string) : new Date();
    
    // Threat detection trends
    const threatStats = await db.select({
      date: sql`DATE(${plagiarismDetection.detectionDate})`,
      riskLevel: plagiarismDetection.riskLevel,
      count: sql`count(*)`
    })
    .from(plagiarismDetection)
    .where(and(
      gte(plagiarismDetection.detectionDate, start),
      lte(plagiarismDetection.detectionDate, end)
    ))
    .groupBy(sql`DATE(${plagiarismDetection.detectionDate})`, plagiarismDetection.riskLevel);
    
    // DMCA success rates
    const dmcaStats = await db.select({
      status: dmcaRequests.status,
      count: sql`count(*)`
    })
    .from(dmcaRequests)
    .where(and(
      gte(dmcaRequests.createdAt, start),
      lte(dmcaRequests.createdAt, end)
    ))
    .groupBy(dmcaRequests.status);
    
    // Content refresh activity
    const refreshStats = await db.select({
      status: contentRefresh.status,
      count: sql`count(*)`
    })
    .from(contentRefresh)
    .where(and(
      gte(contentRefresh.requestedAt, start),
      lte(contentRefresh.requestedAt, end)
    ))
    .groupBy(contentRefresh.status);
    
    res.json({
      success: true,
      data: {
        period: { start, end },
        threatStats,
        dmcaStats,
        refreshStats,
        summary: {
          totalThreats: threatStats.reduce((sum, stat) => sum + parseInt(stat.count as string), 0),
          criticalThreats: threatStats.filter(s => s.riskLevel === 'critical').reduce((sum, stat) => sum + parseInt(stat.count as string), 0),
          dmcaRequests: dmcaStats.reduce((sum, stat) => sum + parseInt(stat.count as string), 0),
          successfulDMCA: dmcaStats.filter(s => s.status === 'resolved').reduce((sum, stat) => sum + parseInt(stat.count as string), 0)
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

// ================================================
// SYSTEM HEALTH & STATUS
// ================================================

/**
 * Content Defender health check
 * GET /api/content-defender/health
 */
router.get('/health', async (req, res) => {
  try {
    await ensureEngineInitialized();
    const health = await contentDefenderEngine.healthCheck();
    
    res.json({
      success: true,
      data: health
    });
  } catch (error) {
    console.error('❌ Content Defender health check failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Health check failed'
    });
  }
});

/**
 * Get system configuration
 * GET /api/content-defender/config
 */
router.get('/config', async (req, res) => {
  try {
    const config = {
      supportedContentTypes: ['blog_post', 'landing_page', 'product_page', 'article', 'tool_page'],
      scanFrequency: '6 hours',
      riskLevels: ['low', 'medium', 'high', 'critical'],
      threatTypes: ['scraping', 'plagiarism', 'clone', 'seo_attack'],
      dmcaStatuses: ['draft', 'sent', 'responded', 'resolved', 'failed'],
      refreshTypes: ['ai_rewrite', 'manual_edit', 'content_update'],
      engineStatus: engineInitialized ? 'initialized' : 'not_initialized',
      features: {
        automaticScanning: true,
        dmcaGeneration: true,
        aiRewriting: true,
        seoDefense: true,
        contentBackups: true,
        realTimeMonitoring: true
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