/**
 * Global Franchise Expansion & Multi-Region Deployment API Routes
 * Billion-Dollar Empire Grade, AI-Powered Market Analysis, Migration-Proof
 */

import { Router } from 'express';
import { franchiseExpansionEngine } from '../services/franchise/franchiseExpansionEngine';
import { db } from '../db';
import { 
  franchiseTemplates, franchiseInstances, franchiseDeployments, crossPromotionLinks,
  franchiseAnalytics, franchiseUpdates, franchiseBackups, franchiseManagementDashboard,
  franchiseOpportunities
} from '../../shared/franchiseExpansionTables';
import { eq, and, desc, asc, sql, like, gte, lte } from 'drizzle-orm';
import { z } from 'zod';

const router = Router();

// Validation schemas
const marketAnalysisSchema = z.object({
  region: z.string().min(1),
  analysisType: z.enum(['full', 'competitor', 'demographic', 'economic']).default('full'),
  priority: z.number().min(1).max(10).default(5)
});

const partnerApplicationSchema = z.object({
  applicantName: z.string().min(1),
  email: z.string().email(),
  targetRegion: z.string().min(1),
  businessExperience: z.number().min(0),
  availableCapital: z.number().min(0),
  localNetworkSize: z.number().min(0).default(0),
  hasOfficeSpace: z.boolean().default(false),
  teamSize: z.number().min(1).default(1),
  techCapabilities: z.number().min(1).max(10).default(5),
  visionAlignment: z.number().min(1).max(10).default(7)
});

const expansionPlanSchema = z.object({
  region: z.string().min(1),
  partnerId: z.string().optional(),
  priority: z.number().min(1).max(10).default(5),
  customPhases: z.array(z.object({
    name: z.string(),
    duration: z.number(),
    investment: z.number()
  })).optional()
});

// Initialize engine
let engineInitialized = false;

async function ensureEngineInitialized() {
  if (!engineInitialized) {
    await franchiseExpansionEngine.initialize();
    engineInitialized = true;
  }
}

// ================================================
// MARKET ANALYSIS & OPPORTUNITIES
// ================================================

/**
 * Analyze global market opportunities
 * POST /api/franchise-expansion/analyze-markets
 */
router.post('/analyze-markets', async (req, res) => {
  try {
    await ensureEngineInitialized();
    
    // Start analysis asynchronously
    const analysisPromise = franchiseExpansionEngine.analyzeGlobalMarkets();
    
    res.json({
      success: true,
      message: 'Global market analysis initiated successfully',
      data: {
        estimated: '15-45 minutes'
      }
    });
    
    // Log completion when done
    analysisPromise.then(opportunities => {
      console.log(`✅ Market analysis completed: ${opportunities.length} opportunities found`);
    }).catch(error => {
      console.error('❌ Market analysis failed:', error);
    });
    
  } catch (error) {
    console.error('❌ Failed to start market analysis:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to start market analysis'
    });
  }
});

/**
 * Get market analysis results
 * GET /api/franchise-expansion/market-analysis
 */
router.get('/market-analysis', async (req, res) => {
  try {
    const { region, limit = 20, sortBy = 'roi' } = req.query;
    
    let query = db.select().from(marketAnalysis);
    
    if (region) {
      query = query.where(like(marketAnalysis.region, `%${region}%`));
    }
    
    // Apply sorting
    const sortColumn = sortBy === 'roi' ? marketAnalysis.expectedROI :
                      sortBy === 'market_size' ? marketAnalysis.marketSize :
                      sortBy === 'risk' ? marketAnalysis.riskScore :
                      marketAnalysis.analysisDate;
    
    const results = await query
      .orderBy(desc(sortColumn))
      .limit(parseInt(limit as string));
    
    res.json({
      success: true,
      data: results,
      filters: { region, sortBy, limit }
    });
  } catch (error) {
    console.error('❌ Failed to get market analysis:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get market analysis'
    });
  }
});

/**
 * Get specific market analysis
 * GET /api/franchise-expansion/market-analysis/:region
 */
router.get('/market-analysis/:region', async (req, res) => {
  try {
    const { region } = req.params;
    
    const analysis = await db.select()
      .from(marketAnalysis)
      .where(eq(marketAnalysis.region, region))
      .orderBy(desc(marketAnalysis.analysisDate))
      .limit(1);
    
    if (!analysis[0]) {
      return res.status(404).json({
        success: false,
        error: 'Market analysis not found for this region'
      });
    }
    
    res.json({
      success: true,
      data: analysis[0]
    });
  } catch (error) {
    console.error('❌ Failed to get market analysis:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get market analysis'
    });
  }
});

/**
 * Get franchise opportunities
 * GET /api/franchise-expansion/opportunities
 */
router.get('/opportunities', async (req, res) => {
  try {
    const { region, active = true, limit = 50 } = req.query;
    
    let query = db.select().from(franchiseOpportunities);
    const conditions = [];
    
    if (active === 'true') {
      conditions.push(eq(franchiseOpportunities.isActive, true));
    }
    
    if (region) {
      conditions.push(like(franchiseOpportunities.region, `%${region}%`));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    const opportunities = await query
      .orderBy(desc(franchiseOpportunities.priority))
      .limit(parseInt(limit as string));
    
    res.json({
      success: true,
      data: opportunities
    });
  } catch (error) {
    console.error('❌ Failed to get opportunities:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get opportunities'
    });
  }
});

// ================================================
// PARTNER MANAGEMENT
// ================================================

/**
 * Submit partner application
 * POST /api/franchise-expansion/apply
 */
router.post('/apply', async (req, res) => {
  try {
    const validatedData = partnerApplicationSchema.parse(req.body);
    
    // Calculate application score
    const applicationScore = Math.min(100, 
      (validatedData.businessExperience * 10) +
      (validatedData.availableCapital / 10000) +
      (validatedData.visionAlignment * 5) +
      (validatedData.techCapabilities * 3)
    );
    
    const [application] = await db.insert(partnerApplications).values({
      ...validatedData,
      applicationScore,
      applicationStatus: 'submitted',
      submissionSource: 'api'
    }).returning();
    
    res.json({
      success: true,
      data: application,
      message: 'Partner application submitted successfully'
    });
  } catch (error) {
    console.error('❌ Failed to submit application:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to submit application'
    });
  }
});

/**
 * Get partner applications
 * GET /api/franchise-expansion/applications
 */
router.get('/applications', async (req, res) => {
  try {
    const { status, region, limit = 50, sortBy = 'score' } = req.query;
    
    let query = db.select().from(partnerApplications);
    const conditions = [];
    
    if (status) {
      conditions.push(eq(partnerApplications.applicationStatus, status as string));
    }
    
    if (region) {
      conditions.push(like(partnerApplications.targetRegion, `%${region}%`));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    // Apply sorting
    const sortColumn = sortBy === 'score' ? partnerApplications.applicationScore :
                      sortBy === 'date' ? partnerApplications.createdAt :
                      partnerApplications.applicationScore;
    
    const applications = await query
      .orderBy(desc(sortColumn))
      .limit(parseInt(limit as string));
    
    res.json({
      success: true,
      data: applications,
      filters: { status, region, sortBy }
    });
  } catch (error) {
    console.error('❌ Failed to get applications:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get applications'
    });
  }
});

/**
 * Review partner application
 * PUT /api/franchise-expansion/applications/:id/review
 */
router.put('/applications/:id/review', async (req, res) => {
  try {
    const applicationId = req.params.id;
    const { status, reviewNotes, reviewScore } = req.body;
    
    if (!['approved', 'rejected', 'pending_review'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be approved, rejected, or pending_review'
      });
    }
    
    const [updatedApplication] = await db.update(partnerApplications)
      .set({
        applicationStatus: status,
        reviewNotes: reviewNotes || null,
        reviewScore: reviewScore || null,
        reviewedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(partnerApplications.id, applicationId))
      .returning();
    
    if (!updatedApplication) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }
    
    res.json({
      success: true,
      data: updatedApplication,
      message: `Application ${status} successfully`
    });
  } catch (error) {
    console.error('❌ Failed to review application:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to review application'
    });
  }
});

/**
 * Find qualified partners for region
 * GET /api/franchise-expansion/partners/:region
 */
router.get('/partners/:region', async (req, res) => {
  try {
    await ensureEngineInitialized();
    
    const { region } = req.params;
    const { minCapital, minExperience, minScore } = req.query;
    
    const criteria = {
      minCapital: minCapital ? parseInt(minCapital as string) : undefined,
      minExperience: minExperience ? parseInt(minExperience as string) : undefined,
      minScore: minScore ? parseInt(minScore as string) : undefined
    };
    
    const partners = await franchiseExpansionEngine.findFranchisePartners(region, criteria);
    
    res.json({
      success: true,
      data: partners,
      region,
      criteria
    });
  } catch (error) {
    console.error('❌ Failed to find partners:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to find partners'
    });
  }
});

// ================================================
// EXPANSION PLANNING
// ================================================

/**
 * Create expansion plan
 * POST /api/franchise-expansion/plan
 */
router.post('/plan', async (req, res) => {
  try {
    await ensureEngineInitialized();
    
    const validatedData = expansionPlanSchema.parse(req.body);
    
    const plan = await franchiseExpansionEngine.createExpansionPlan(
      validatedData.region,
      validatedData.partnerId
    );
    
    res.json({
      success: true,
      data: plan,
      message: 'Expansion plan created successfully'
    });
  } catch (error) {
    console.error('❌ Failed to create expansion plan:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create expansion plan'
    });
  }
});

/**
 * Get expansion plans
 * GET /api/franchise-expansion/plans
 */
router.get('/plans', async (req, res) => {
  try {
    const { region, status, limit = 20 } = req.query;
    
    let query = db.select().from(regionExpansion);
    const conditions = [];
    
    if (region) {
      conditions.push(like(regionExpansion.region, `%${region}%`));
    }
    
    if (status) {
      conditions.push(eq(regionExpansion.expansionStatus, status as string));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    const plans = await query
      .orderBy(desc(regionExpansion.priority))
      .limit(parseInt(limit as string));
    
    res.json({
      success: true,
      data: plans
    });
  } catch (error) {
    console.error('❌ Failed to get expansion plans:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get expansion plans'
    });
  }
});

/**
 * Update expansion plan status
 * PUT /api/franchise-expansion/plans/:id
 */
router.put('/plans/:id', async (req, res) => {
  try {
    const planId = req.params.id;
    const { status, currentPhase, actualInvestment, notes } = req.body;
    
    const updateData: any = {
      updatedAt: new Date()
    };
    
    if (status) updateData.expansionStatus = status;
    if (currentPhase !== undefined) updateData.currentPhase = currentPhase;
    if (actualInvestment !== undefined) updateData.actualInvestment = actualInvestment;
    if (notes) updateData.notes = notes;
    
    const [updatedPlan] = await db.update(regionExpansion)
      .set(updateData)
      .where(eq(regionExpansion.id, planId))
      .returning();
    
    if (!updatedPlan) {
      return res.status(404).json({
        success: false,
        error: 'Expansion plan not found'
      });
    }
    
    res.json({
      success: true,
      data: updatedPlan,
      message: 'Expansion plan updated successfully'
    });
  } catch (error) {
    console.error('❌ Failed to update expansion plan:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update expansion plan'
    });
  }
});

// ================================================
// BUSINESS INTELLIGENCE & REPORTING
// ================================================

/**
 * Get expansion dashboard
 * GET /api/franchise-expansion/dashboard
 */
router.get('/dashboard', async (req, res) => {
  try {
    await ensureEngineInitialized();
    
    const dashboard = await franchiseExpansionEngine.getExpansionDashboard();
    
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

/**
 * Get revenue projections
 * GET /api/franchise-expansion/revenue-projections
 */
router.get('/revenue-projections', async (req, res) => {
  try {
    const { region, timeframe = 36 } = req.query;
    
    let query = db.select().from(revenueProjections);
    
    if (region) {
      query = query.where(like(revenueProjections.region, `%${region}%`));
    }
    
    const projections = await query
      .where(lte(revenueProjections.projectionMonths, parseInt(timeframe as string)))
      .orderBy(desc(revenueProjections.projectedRevenue));
    
    res.json({
      success: true,
      data: projections,
      filters: { region, timeframe }
    });
  } catch (error) {
    console.error('❌ Failed to get revenue projections:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get revenue projections'
    });
  }
});

/**
 * Get business metrics
 * GET /api/franchise-expansion/metrics
 */
router.get('/metrics', async (req, res) => {
  try {
    const { startDate, endDate, region } = req.query;
    
    const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate as string) : new Date();
    
    let query = db.select().from(marketMetrics);
    const conditions = [
      gte(marketMetrics.metricDate, start),
      lte(marketMetrics.metricDate, end)
    ];
    
    if (region) {
      conditions.push(like(marketMetrics.region, `%${region}%`));
    }
    
    const metrics = await query
      .where(and(...conditions))
      .orderBy(desc(marketMetrics.metricDate));
    
    // Aggregate metrics by type
    const aggregated = metrics.reduce((acc: any, metric) => {
      const type = metric.metricType;
      if (!acc[type]) {
        acc[type] = {
          type,
          values: [],
          average: 0,
          trend: 'stable'
        };
      }
      acc[type].values.push({
        date: metric.metricDate,
        value: metric.metricValue,
        region: metric.region
      });
      return acc;
    }, {});
    
    // Calculate averages and trends
    Object.keys(aggregated).forEach(type => {
      const values = aggregated[type].values.map((v: any) => v.value);
      aggregated[type].average = values.reduce((sum: number, val: number) => sum + val, 0) / values.length;
      
      if (values.length >= 2) {
        const recent = values.slice(-3).reduce((sum: number, val: number) => sum + val, 0) / Math.min(3, values.length);
        const earlier = values.slice(0, -3).reduce((sum: number, val: number) => sum + val, 0) / Math.max(1, values.length - 3);
        aggregated[type].trend = recent > earlier ? 'increasing' : recent < earlier ? 'decreasing' : 'stable';
      }
    });
    
    res.json({
      success: true,
      data: {
        period: { start, end },
        region: region || 'all',
        metrics: Object.values(aggregated),
        totalDataPoints: metrics.length
      }
    });
  } catch (error) {
    console.error('❌ Failed to get metrics:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get metrics'
    });
  }
});

// ================================================
// COMPETITOR ANALYSIS
// ================================================

/**
 * Get competitor analysis
 * GET /api/franchise-expansion/competitors
 */
router.get('/competitors', async (req, res) => {
  try {
    const { region, limit = 20 } = req.query;
    
    let query = db.select().from(competitorAnalysis);
    
    if (region) {
      query = query.where(like(competitorAnalysis.region, `%${region}%`));
    }
    
    const competitors = await query
      .orderBy(desc(competitorAnalysis.threatLevel))
      .limit(parseInt(limit as string));
    
    res.json({
      success: true,
      data: competitors
    });
  } catch (error) {
    console.error('❌ Failed to get competitor analysis:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get competitor analysis'
    });
  }
});

/**
 * Add competitor analysis
 * POST /api/franchise-expansion/competitors
 */
router.post('/competitors', async (req, res) => {
  try {
    const {
      competitorName,
      region,
      marketShare,
      strengths,
      weaknesses,
      threatLevel,
      notes
    } = req.body;
    
    if (!competitorName || !region) {
      return res.status(400).json({
        success: false,
        error: 'Competitor name and region are required'
      });
    }
    
    const [competitor] = await db.insert(competitorAnalysis).values({
      competitorName,
      region,
      marketShare: marketShare || 0,
      competitorStrengths: strengths || [],
      competitorWeaknesses: weaknesses || [],
      threatLevel: threatLevel || 5,
      competitiveAdvantages: [],
      marketPosition: 'unknown',
      analysisStatus: 'completed',
      notes: notes || ''
    }).returning();
    
    res.json({
      success: true,
      data: competitor,
      message: 'Competitor analysis added successfully'
    });
  } catch (error) {
    console.error('❌ Failed to add competitor analysis:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to add competitor analysis'
    });
  }
});

// ================================================
// LEGAL & COMPLIANCE
// ================================================

/**
 * Get legal compliance status
 * GET /api/franchise-expansion/compliance
 */
router.get('/compliance', async (req, res) => {
  try {
    const { region, status } = req.query;
    
    let query = db.select().from(legalCompliance);
    const conditions = [];
    
    if (region) {
      conditions.push(like(legalCompliance.region, `%${region}%`));
    }
    
    if (status) {
      conditions.push(eq(legalCompliance.complianceStatus, status as string));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    const compliance = await query
      .orderBy(desc(legalCompliance.createdAt));
    
    res.json({
      success: true,
      data: compliance
    });
  } catch (error) {
    console.error('❌ Failed to get compliance status:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get compliance status'
    });
  }
});

// ================================================
// SYSTEM HEALTH & STATUS
// ================================================

/**
 * Franchise expansion health check
 * GET /api/franchise-expansion/health
 */
router.get('/health', async (req, res) => {
  try {
    await ensureEngineInitialized();
    const health = await franchiseExpansionEngine.healthCheck();
    
    res.json({
      success: true,
      data: health
    });
  } catch (error) {
    console.error('❌ Franchise expansion health check failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Health check failed'
    });
  }
});

/**
 * Get system configuration
 * GET /api/franchise-expansion/config
 */
router.get('/config', async (req, res) => {
  try {
    const config = {
      supportedRegions: ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East', 'Africa'],
      analysisTypes: ['full', 'competitor', 'demographic', 'economic'],
      expansionStatuses: ['planned', 'in_progress', 'completed', 'paused', 'cancelled'],
      partnerRequirements: {
        minCapital: 250000,
        minExperience: 2,
        minQualificationScore: 60
      },
      metrics: {
        expectedROI: { min: 15, target: 25 },
        timeToMarket: { min: 6, max: 36 },
        riskTolerance: { max: 70 }
      },
      engineStatus: engineInitialized ? 'initialized' : 'not_initialized',
      features: {
        marketAnalysis: true,
        partnerMatching: true,
        expansionPlanning: true,
        competitorTracking: true,
        revenueProjections: true,
        legalCompliance: true
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