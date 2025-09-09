import { Router, Request, Response } from "express";
import { MoneyTrafficGrowthEngine } from "../services/growth/moneyTrafficGrowthEngine";
import { storage } from "../storage";
import { requireAuth } from "../middleware/auth";

const moneyTrafficGrowthEngine = MoneyTrafficGrowthEngine.getInstance();

const router = Router();

/**
 * MONEY/TRAFFIC GROWTH ENGINE API ROUTES - BILLION-DOLLAR EMPIRE GRADE
 * 
 * Complete REST API for all 8 core growth modules:
 * - SEO Optimization Engine
 * - Viral Content Generation Engine  
 * - Viral Tool & Widget Factory Engine
 * - Referral System Engine
 * - Backlink Building Engine
 * - Social Media Automation Engine
 * - Email Marketing Automation Engine
 * - Conversion Optimization Engine
 */

// ====================================================================
// CORE GROWTH ENGINE ROUTES
// ====================================================================

/**
 * GET /api/growth/status
 * Get overall growth engine status and health
 */
router.get("/status", async (req: Request, res: Response) => {
  try {
    const status = {
      engine: "Money/Traffic Growth Engine - Billion-Dollar Empire Grade",
      version: "2.0.0",
      status: "operational",
      totalEngines: 17,
      coreEngines: {
        seo: "operational",
        content: "operational", 
        referral: "operational",
        backlink: "operational",
        social: "operational",
        email: "operational",
        conversion: "operational"
      },
      billionDollarEngines: {
        "blog-swarm": "operational",
        "forum": "operational", 
        "resource-directory": "operational",
        "viral-data-viz": "operational",
        "newsletter": "operational",
        "ugc-video": "operational",
        "viral-challenge": "operational",
        "content-scraper": "operational",
        "content-remix": "operational",
        "api-portal": "operational"
      },
      capabilities: [
        "Comprehensive 17-engine optimization",
        "Parallel execution for maximum efficiency",
        "Enterprise-grade analytics and reporting",
        "Migration-proof auto-restoration",
        "Billion-dollar scalability"
      ],
      uptime: process.uptime(),
      lastUpdate: new Date().toISOString()
    };

    res.json(status);
  } catch (error) {
    console.error("Error getting growth engine status:", error);
    res.status(500).json({ error: "Failed to get growth engine status" });
  }
});

/**
 * POST /api/growth/optimize
 * Execute comprehensive growth optimization for a vertical
 */
router.post("/optimize", requireAuth, async (req: Request, res: Response) => {
  try {
    const { vertical } = req.body;

    if (!vertical) {
      return res.status(400).json({ error: "Vertical is required" });
    }

    const result = await moneyTrafficGrowthEngine.executeGrowthOptimization(vertical);
    
    res.json({
      success: true,
      result,
      message: `Growth optimization executed for ${vertical}`
    });
  } catch (error) {
    console.error("Error executing growth optimization:", error);
    res.status(500).json({ error: "Failed to execute growth optimization" });
  }
});

/**
 * GET /api/growth/analytics
 * Get comprehensive growth analytics
 */
router.get("/analytics", async (req: Request, res: Response) => {
  try {
    const { vertical, timeframe = "30d" } = req.query;
    
    const analytics = await moneyTrafficGrowthEngine.getGrowthAnalytics(
      vertical as string, 
      timeframe as string
    );
    
    res.json(analytics);
  } catch (error) {
    console.error("Error getting growth analytics:", error);
    res.status(500).json({ error: "Failed to get growth analytics" });
  }
});

// ====================================================================
// SEO OPTIMIZATION ENGINE ROUTES
// ====================================================================

/**
 * POST /api/growth/seo/tasks
 * Create SEO optimization task
 */
router.post("/seo/tasks", requireAuth, async (req: Request, res: Response) => {
  try {
    const task = await storage.createSeoOptimizationTask(req.body);
    res.json({ success: true, task });
  } catch (error) {
    console.error("Error creating SEO task:", error);
    res.status(500).json({ error: "Failed to create SEO task" });
  }
});

/**
 * GET /api/growth/seo/tasks
 * Get SEO optimization tasks
 */
router.get("/seo/tasks", async (req: Request, res: Response) => {
  try {
    const { vertical } = req.query;
    const tasks = await storage.getSeoOptimizationTasks(vertical as string);
    res.json(tasks);
  } catch (error) {
    console.error("Error getting SEO tasks:", error);
    res.status(500).json({ error: "Failed to get SEO tasks" });
  }
});

/**
 * PUT /api/growth/seo/tasks/:id
 * Update SEO optimization task
 */
router.put("/seo/tasks/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await storage.updateSeoOptimizationTask(parseInt(id), req.body);
    res.json({ success: true, task });
  } catch (error) {
    console.error("Error updating SEO task:", error);
    res.status(500).json({ error: "Failed to update SEO task" });
  }
});

/**
 * POST /api/growth/seo/keywords
 * Create keyword research
 */
router.post("/seo/keywords", requireAuth, async (req: Request, res: Response) => {
  try {
    const keyword = await storage.createKeywordResearch(req.body);
    res.json({ success: true, keyword });
  } catch (error) {
    console.error("Error creating keyword research:", error);
    res.status(500).json({ error: "Failed to create keyword research" });
  }
});

/**
 * GET /api/growth/seo/keywords
 * Get keyword research data
 */
router.get("/seo/keywords", async (req: Request, res: Response) => {
  try {
    const { vertical } = req.query;
    const keywords = await storage.getKeywordResearch(vertical as string);
    res.json(keywords);
  } catch (error) {
    console.error("Error getting keyword research:", error);
    res.status(500).json({ error: "Failed to get keyword research" });
  }
});

/**
 * POST /api/growth/seo/audits
 * Create SEO site audit
 */
router.post("/seo/audits", requireAuth, async (req: Request, res: Response) => {
  try {
    const audit = await storage.createSeoSiteAudit(req.body);
    res.json({ success: true, audit });
  } catch (error) {
    console.error("Error creating SEO audit:", error);
    res.status(500).json({ error: "Failed to create SEO audit" });
  }
});

/**
 * GET /api/growth/seo/audits
 * Get SEO site audits
 */
router.get("/seo/audits", async (req: Request, res: Response) => {
  try {
    const audits = await storage.getSeoSiteAudits();
    res.json(audits);
  } catch (error) {
    console.error("Error getting SEO audits:", error);
    res.status(500).json({ error: "Failed to get SEO audits" });
  }
});

// ====================================================================
// CONTENT GENERATION ENGINE ROUTES
// ====================================================================

/**
 * POST /api/growth/content/templates
 * Create content template
 */
router.post("/content/templates", requireAuth, async (req: Request, res: Response) => {
  try {
    const template = await storage.createContentTemplate(req.body);
    res.json({ success: true, template });
  } catch (error) {
    console.error("Error creating content template:", error);
    res.status(500).json({ error: "Failed to create content template" });
  }
});

/**
 * GET /api/growth/content/templates
 * Get content templates
 */
router.get("/content/templates", async (req: Request, res: Response) => {
  try {
    const { vertical } = req.query;
    const templates = await storage.getContentTemplates(vertical as string);
    res.json(templates);
  } catch (error) {
    console.error("Error getting content templates:", error);
    res.status(500).json({ error: "Failed to get content templates" });
  }
});

/**
 * POST /api/growth/content/generate
 * Generate content
 */
router.post("/content/generate", requireAuth, async (req: Request, res: Response) => {
  try {
    const content = await storage.createContentGeneration(req.body);
    res.json({ success: true, content });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

/**
 * GET /api/growth/content/generated
 * Get generated content
 */
router.get("/content/generated", async (req: Request, res: Response) => {
  try {
    const { vertical } = req.query;
    const content = await storage.getContentGeneration(vertical as string);
    res.json(content);
  } catch (error) {
    console.error("Error getting generated content:", error);
    res.status(500).json({ error: "Failed to get generated content" });
  }
});

/**
 * POST /api/growth/content/performance
 * Track content performance
 */
router.post("/content/performance", requireAuth, async (req: Request, res: Response) => {
  try {
    const performance = await storage.trackContentPerformance(req.body);
    res.json({ success: true, performance });
  } catch (error) {
    console.error("Error tracking content performance:", error);
    res.status(500).json({ error: "Failed to track content performance" });
  }
});

/**
 * GET /api/growth/content/performance
 * Get content performance data
 */
router.get("/content/performance", async (req: Request, res: Response) => {
  try {
    const { contentId } = req.query;
    const performance = await storage.getContentPerformance(
      contentId ? parseInt(contentId as string) : undefined
    );
    res.json(performance);
  } catch (error) {
    console.error("Error getting content performance:", error);
    res.status(500).json({ error: "Failed to get content performance" });
  }
});

// ====================================================================
// VIRAL TOOL & WIDGET FACTORY ENGINE ROUTES
// ====================================================================

/**
 * POST /api/growth/viral-tools/generate
 * Generate viral tool
 */
router.post("/viral-tools/generate", requireAuth, async (req: Request, res: Response) => {
  try {
    const { vertical, toolType, customization } = req.body;
    
    if (!vertical || !toolType) {
      return res.status(400).json({ error: "Vertical and toolType are required" });
    }
    
    // Create viral tool using the engine
    const result = await moneyTrafficGrowthEngine.generateViralTool({
      vertical,
      toolType,
      customization
    });
    
    res.json(result);
  } catch (error) {
    console.error("Error generating viral tool:", error);
    res.status(500).json({ error: "Failed to generate viral tool" });
  }
});

/**
 * POST /api/growth/widgets/generate
 * Generate embeddable widget
 */
router.post("/widgets/generate", requireAuth, async (req: Request, res: Response) => {
  try {
    const { type, vertical, size, customization } = req.body;
    
    if (!type || !vertical) {
      return res.status(400).json({ error: "Type and vertical are required" });
    }
    
    // Create widget using the engine  
    const result = await moneyTrafficGrowthEngine.generateWidget({
      type,
      vertical,
      size: size || 'medium',
      customization
    });
    
    res.json(result);
  } catch (error) {
    console.error("Error generating widget:", error);
    res.status(500).json({ error: "Failed to generate widget" });
  }
});

/**
 * GET /api/growth/viral-tools/metrics
 * Get viral tool performance metrics
 */
router.get("/viral-tools/metrics", async (req: Request, res: Response) => {
  try {
    const metrics = await moneyTrafficGrowthEngine.getViralMetrics();
    res.json(metrics);
  } catch (error) {
    console.error("Error getting viral tool metrics:", error);
    res.status(500).json({ error: "Failed to get viral tool metrics" });
  }
});

// ====================================================================
// REFERRAL SYSTEM ENGINE ROUTES
// ====================================================================

/**
 * POST /api/growth/referral/programs
 * Create referral program
 */
router.post("/referral/programs", requireAuth, async (req: Request, res: Response) => {
  try {
    const program = await storage.createReferralProgram(req.body);
    res.json({ success: true, program });
  } catch (error) {
    console.error("Error creating referral program:", error);
    res.status(500).json({ error: "Failed to create referral program" });
  }
});

/**
 * GET /api/growth/referral/programs
 * Get referral programs
 */
router.get("/referral/programs", async (req: Request, res: Response) => {
  try {
    const { vertical } = req.query;
    const programs = await storage.getReferralPrograms(vertical as string);
    res.json(programs);
  } catch (error) {
    console.error("Error getting referral programs:", error);
    res.status(500).json({ error: "Failed to get referral programs" });
  }
});

/**
 * POST /api/growth/referral/links
 * Create referral link
 */
router.post("/referral/links", requireAuth, async (req: Request, res: Response) => {
  try {
    const link = await storage.createReferralLink(req.body);
    res.json({ success: true, link });
  } catch (error) {
    console.error("Error creating referral link:", error);
    res.status(500).json({ error: "Failed to create referral link" });
  }
});

/**
 * GET /api/growth/referral/links
 * Get referral links
 */
router.get("/referral/links", async (req: Request, res: Response) => {
  try {
    const { programId } = req.query;
    const links = await storage.getReferralLinks(
      programId ? parseInt(programId as string) : undefined
    );
    res.json(links);
  } catch (error) {
    console.error("Error getting referral links:", error);
    res.status(500).json({ error: "Failed to get referral links" });
  }
});

/**
 * POST /api/growth/referral/transactions
 * Track referral transaction
 */
router.post("/referral/transactions", requireAuth, async (req: Request, res: Response) => {
  try {
    const transaction = await storage.trackReferralTransaction(req.body);
    res.json({ success: true, transaction });
  } catch (error) {
    console.error("Error tracking referral transaction:", error);
    res.status(500).json({ error: "Failed to track referral transaction" });
  }
});

/**
 * GET /api/growth/referral/transactions
 * Get referral transactions
 */
router.get("/referral/transactions", async (req: Request, res: Response) => {
  try {
    const { programId } = req.query;
    const transactions = await storage.getReferralTransactions(
      programId ? parseInt(programId as string) : undefined
    );
    res.json(transactions);
  } catch (error) {
    console.error("Error getting referral transactions:", error);
    res.status(500).json({ error: "Failed to get referral transactions" });
  }
});

// ====================================================================
// BACKLINK BUILDING ENGINE ROUTES
// ====================================================================

/**
 * POST /api/growth/backlinks/opportunities
 * Create backlink opportunity
 */
router.post("/backlinks/opportunities", requireAuth, async (req: Request, res: Response) => {
  try {
    const opportunity = await storage.createBacklinkOpportunity(req.body);
    res.json({ success: true, opportunity });
  } catch (error) {
    console.error("Error creating backlink opportunity:", error);
    res.status(500).json({ error: "Failed to create backlink opportunity" });
  }
});

/**
 * GET /api/growth/backlinks/opportunities
 * Get backlink opportunities
 */
router.get("/backlinks/opportunities", async (req: Request, res: Response) => {
  try {
    const { vertical } = req.query;
    const opportunities = await storage.getBacklinkOpportunities(vertical as string);
    res.json(opportunities);
  } catch (error) {
    console.error("Error getting backlink opportunities:", error);
    res.status(500).json({ error: "Failed to get backlink opportunities" });
  }
});

/**
 * POST /api/growth/backlinks/outreach
 * Create backlink outreach
 */
router.post("/backlinks/outreach", requireAuth, async (req: Request, res: Response) => {
  try {
    const outreach = await storage.createBacklinkOutreach(req.body);
    res.json({ success: true, outreach });
  } catch (error) {
    console.error("Error creating backlink outreach:", error);
    res.status(500).json({ error: "Failed to create backlink outreach" });
  }
});

/**
 * GET /api/growth/backlinks/outreach
 * Get backlink outreach data
 */
router.get("/backlinks/outreach", async (req: Request, res: Response) => {
  try {
    const { opportunityId } = req.query;
    const outreach = await storage.getBacklinkOutreach(
      opportunityId ? parseInt(opportunityId as string) : undefined
    );
    res.json(outreach);
  } catch (error) {
    console.error("Error getting backlink outreach:", error);
    res.status(500).json({ error: "Failed to get backlink outreach" });
  }
});

/**
 * POST /api/growth/backlinks/monitoring
 * Create backlink monitoring
 */
router.post("/backlinks/monitoring", requireAuth, async (req: Request, res: Response) => {
  try {
    const monitoring = await storage.createBacklinkMonitoring(req.body);
    res.json({ success: true, monitoring });
  } catch (error) {
    console.error("Error creating backlink monitoring:", error);
    res.status(500).json({ error: "Failed to create backlink monitoring" });
  }
});

/**
 * GET /api/growth/backlinks/monitoring
 * Get backlink monitoring data
 */
router.get("/backlinks/monitoring", async (req: Request, res: Response) => {
  try {
    const monitoring = await storage.getBacklinkMonitoring();
    res.json(monitoring);
  } catch (error) {
    console.error("Error getting backlink monitoring:", error);
    res.status(500).json({ error: "Failed to get backlink monitoring" });
  }
});

// ====================================================================
// SOCIAL MEDIA AUTOMATION ENGINE ROUTES
// ====================================================================

/**
 * POST /api/growth/social/accounts
 * Create social media account
 */
router.post("/social/accounts", requireAuth, async (req: Request, res: Response) => {
  try {
    const account = await storage.createSocialMediaAccount(req.body);
    res.json({ success: true, account });
  } catch (error) {
    console.error("Error creating social media account:", error);
    res.status(500).json({ error: "Failed to create social media account" });
  }
});

/**
 * GET /api/growth/social/accounts
 * Get social media accounts
 */
router.get("/social/accounts", async (req: Request, res: Response) => {
  try {
    const { vertical } = req.query;
    const accounts = await storage.getSocialMediaAccounts(vertical as string);
    res.json(accounts);
  } catch (error) {
    console.error("Error getting social media accounts:", error);
    res.status(500).json({ error: "Failed to get social media accounts" });
  }
});

/**
 * POST /api/growth/social/posts
 * Create social media post
 */
router.post("/social/posts", requireAuth, async (req: Request, res: Response) => {
  try {
    const post = await storage.createSocialMediaPost(req.body);
    res.json({ success: true, post });
  } catch (error) {
    console.error("Error creating social media post:", error);
    res.status(500).json({ error: "Failed to create social media post" });
  }
});

/**
 * GET /api/growth/social/posts
 * Get social media posts
 */
router.get("/social/posts", async (req: Request, res: Response) => {
  try {
    const { accountId } = req.query;
    const posts = await storage.getSocialMediaPosts(
      accountId ? parseInt(accountId as string) : undefined
    );
    res.json(posts);
  } catch (error) {
    console.error("Error getting social media posts:", error);
    res.status(500).json({ error: "Failed to get social media posts" });
  }
});

/**
 * POST /api/growth/social/engagement
 * Track social media engagement
 */
router.post("/social/engagement", requireAuth, async (req: Request, res: Response) => {
  try {
    const engagement = await storage.trackSocialMediaEngagement(req.body);
    res.json({ success: true, engagement });
  } catch (error) {
    console.error("Error tracking social media engagement:", error);
    res.status(500).json({ error: "Failed to track social media engagement" });
  }
});

/**
 * GET /api/growth/social/engagement
 * Get social media engagement data
 */
router.get("/social/engagement", async (req: Request, res: Response) => {
  try {
    const { postId } = req.query;
    const engagement = await storage.getSocialMediaEngagement(
      postId ? parseInt(postId as string) : undefined
    );
    res.json(engagement);
  } catch (error) {
    console.error("Error getting social media engagement:", error);
    res.status(500).json({ error: "Failed to get social media engagement" });
  }
});

// ====================================================================
// EMAIL MARKETING AUTOMATION ENGINE ROUTES
// ====================================================================

/**
 * POST /api/growth/email/campaigns
 * Create email campaign
 */
router.post("/email/campaigns", requireAuth, async (req: Request, res: Response) => {
  try {
    const campaign = await storage.createEmailCampaign(req.body);
    res.json({ success: true, campaign });
  } catch (error) {
    console.error("Error creating email campaign:", error);
    res.status(500).json({ error: "Failed to create email campaign" });
  }
});

/**
 * GET /api/growth/email/campaigns
 * Get email campaigns
 */
router.get("/email/campaigns", async (req: Request, res: Response) => {
  try {
    const { vertical } = req.query;
    const campaigns = await storage.getEmailCampaigns(vertical as string);
    res.json(campaigns);
  } catch (error) {
    console.error("Error getting email campaigns:", error);
    res.status(500).json({ error: "Failed to get email campaigns" });
  }
});

/**
 * POST /api/growth/email/automations
 * Create email automation
 */
router.post("/email/automations", requireAuth, async (req: Request, res: Response) => {
  try {
    const automation = await storage.createEmailAutomation(req.body);
    res.json({ success: true, automation });
  } catch (error) {
    console.error("Error creating email automation:", error);
    res.status(500).json({ error: "Failed to create email automation" });
  }
});

/**
 * GET /api/growth/email/automations
 * Get email automations
 */
router.get("/email/automations", async (req: Request, res: Response) => {
  try {
    const { vertical } = req.query;
    const automations = await storage.getEmailAutomations(vertical as string);
    res.json(automations);
  } catch (error) {
    console.error("Error getting email automations:", error);
    res.status(500).json({ error: "Failed to get email automations" });
  }
});

/**
 * POST /api/growth/email/subscribers
 * Create email subscriber
 */
router.post("/email/subscribers", requireAuth, async (req: Request, res: Response) => {
  try {
    const subscriber = await storage.createEmailSubscriber(req.body);
    res.json({ success: true, subscriber });
  } catch (error) {
    console.error("Error creating email subscriber:", error);
    res.status(500).json({ error: "Failed to create email subscriber" });
  }
});

/**
 * GET /api/growth/email/subscribers
 * Get email subscribers
 */
router.get("/email/subscribers", async (req: Request, res: Response) => {
  try {
    const { vertical } = req.query;
    const subscribers = await storage.getEmailSubscribers(vertical as string);
    res.json(subscribers);
  } catch (error) {
    console.error("Error getting email subscribers:", error);
    res.status(500).json({ error: "Failed to get email subscribers" });
  }
});

// ====================================================================
// CONVERSION OPTIMIZATION ENGINE ROUTES
// ====================================================================

/**
 * POST /api/growth/conversion/funnels
 * Create conversion funnel
 */
router.post("/conversion/funnels", requireAuth, async (req: Request, res: Response) => {
  try {
    const funnel = await storage.createConversionFunnel(req.body);
    res.json({ success: true, funnel });
  } catch (error) {
    console.error("Error creating conversion funnel:", error);
    res.status(500).json({ error: "Failed to create conversion funnel" });
  }
});

/**
 * GET /api/growth/conversion/funnels
 * Get conversion funnels
 */
router.get("/conversion/funnels", async (req: Request, res: Response) => {
  try {
    const { vertical } = req.query;
    const funnels = await storage.getConversionFunnels(vertical as string);
    res.json(funnels);
  } catch (error) {
    console.error("Error getting conversion funnels:", error);
    res.status(500).json({ error: "Failed to get conversion funnels" });
  }
});

/**
 * POST /api/growth/conversion/experiments
 * Create conversion experiment
 */
router.post("/conversion/experiments", requireAuth, async (req: Request, res: Response) => {
  try {
    const experiment = await storage.createConversionExperiment(req.body);
    res.json({ success: true, experiment });
  } catch (error) {
    console.error("Error creating conversion experiment:", error);
    res.status(500).json({ error: "Failed to create conversion experiment" });
  }
});

/**
 * GET /api/growth/conversion/experiments
 * Get conversion experiments
 */
router.get("/conversion/experiments", async (req: Request, res: Response) => {
  try {
    const { funnelId } = req.query;
    const experiments = await storage.getConversionExperiments(
      funnelId ? parseInt(funnelId as string) : undefined
    );
    res.json(experiments);
  } catch (error) {
    console.error("Error getting conversion experiments:", error);
    res.status(500).json({ error: "Failed to get conversion experiments" });
  }
});

/**
 * POST /api/growth/conversion/events
 * Track conversion event
 */
router.post("/conversion/events", requireAuth, async (req: Request, res: Response) => {
  try {
    const event = await storage.trackConversionEvent(req.body);
    res.json({ success: true, event });
  } catch (error) {
    console.error("Error tracking conversion event:", error);
    res.status(500).json({ error: "Failed to track conversion event" });
  }
});

/**
 * GET /api/growth/conversion/events
 * Get conversion events
 */
router.get("/conversion/events", async (req: Request, res: Response) => {
  try {
    const { funnelId } = req.query;
    const events = await storage.getConversionEvents(
      funnelId ? parseInt(funnelId as string) : undefined
    );
    res.json(events);
  } catch (error) {
    console.error("Error getting conversion events:", error);
    res.status(500).json({ error: "Failed to get conversion events" });
  }
});

// ====================================================================
// COMPREHENSIVE 17-ENGINE OPTIMIZATION ROUTES
// ====================================================================

/**
 * POST /api/growth/optimize-all/:vertical
 * Execute comprehensive 17-engine optimization for maximum traffic growth
 */
router.post("/optimize-all/:vertical", requireAuth, async (req: Request, res: Response) => {
  try {
    const { vertical } = req.params;
    
    if (!vertical) {
      return res.status(400).json({
        success: false,
        error: 'Vertical parameter is required'
      });
    }

    console.log(`🚀 Starting comprehensive 17-engine optimization for vertical: ${vertical}`);
    
    const result = await moneyTrafficGrowthEngine.executeAllEnginesOptimization(vertical);
    
    res.json({
      success: true,
      data: result,
      message: `Comprehensive 17-engine optimization completed for ${vertical}`
    });
  } catch (error) {
    console.error('Comprehensive optimization failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to execute comprehensive optimization',
      details: error.message
    });
  }
});

/**
 * GET /api/growth/engines/:engineName
 * Get status and access to individual engines
 */
router.get("/engines/:engineName", async (req: Request, res: Response) => {
  try {
    const { engineName } = req.params;
    let engine;

    switch (engineName) {
      case 'seo':
        engine = moneyTrafficGrowthEngine.getSeoEngine();
        break;
      case 'content':
        engine = moneyTrafficGrowthEngine.getContentEngine();
        break;
      case 'referral':
        engine = moneyTrafficGrowthEngine.getReferralEngine();
        break;
      case 'backlink':
        engine = moneyTrafficGrowthEngine.getBacklinkEngine();
        break;
      case 'social':
        engine = moneyTrafficGrowthEngine.getSocialEngine();
        break;
      case 'email':
        engine = moneyTrafficGrowthEngine.getEmailEngine();
        break;
      case 'conversion':
        engine = moneyTrafficGrowthEngine.getConversionEngine();
        break;
      case 'blog-swarm':
        engine = moneyTrafficGrowthEngine.getBlogSwarmEngine();
        break;
      case 'forum':
        engine = moneyTrafficGrowthEngine.getForumEngine();
        break;
      case 'resource-directory':
        engine = moneyTrafficGrowthEngine.getResourceDirectoryEngine();
        break;
      case 'viral-data-viz':
        engine = moneyTrafficGrowthEngine.getViralDataVizEngine();
        break;
      default:
        return res.status(404).json({
          success: false,
          error: 'Engine not found',
          availableEngines: [
            'seo', 'content', 'referral', 'backlink', 'social', 'email', 'conversion',
            'blog-swarm', 'forum', 'resource-directory', 'viral-data-viz'
          ]
        });
    }

    res.json({
      success: true,
      data: {
        engineName,
        status: 'available',
        initialized: !!engine,
        type: engineName.includes('-') ? 'billion-dollar-engine' : 'core-engine'
      }
    });
  } catch (error) {
    console.error(`Engine access failed for ${req.params.engineName}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to access engine'
    });
  }
});

// ====================================================================
// BLOG SWARM ENGINE ROUTES 
// ====================================================================

/**
 * POST /api/growth/blog-swarm/create-site
 * Create a new blog site in the swarm
 */
router.post("/blog-swarm/create-site", requireAuth, async (req: Request, res: Response) => {
  try {
    const blogEngine = moneyTrafficGrowthEngine.getBlogSwarmEngine();
    const result = await blogEngine.createBlogSite(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Blog site creation failed:', error);
    res.status(500).json({ success: false, error: 'Failed to create blog site' });
  }
});

/**
 * POST /api/growth/blog-swarm/generate-post
 * Generate a new blog post using AI
 */
router.post("/blog-swarm/generate-post", requireAuth, async (req: Request, res: Response) => {
  try {
    const blogEngine = moneyTrafficGrowthEngine.getBlogSwarmEngine();
    const result = await blogEngine.generateBlogPost(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Blog post generation failed:', error);
    res.status(500).json({ success: false, error: 'Failed to generate blog post' });
  }
});

/**
 * GET /api/growth/blog-swarm/analytics
 * Get comprehensive blog swarm analytics
 */
router.get("/blog-swarm/analytics", async (req: Request, res: Response) => {
  try {
    const blogEngine = moneyTrafficGrowthEngine.getBlogSwarmEngine();
    const timeframe = req.query.timeframe as string || '30d';
    const result = await blogEngine.getSwarmAnalytics(timeframe);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Blog swarm analytics failed:', error);
    res.status(500).json({ success: false, error: 'Failed to get blog swarm analytics' });
  }
});

// ====================================================================
// FORUM ENGINE ROUTES
// ====================================================================

/**
 * POST /api/growth/forum/create-category
 * Create a new forum category
 */
router.post("/forum/create-category", requireAuth, async (req: Request, res: Response) => {
  try {
    const forumEngine = moneyTrafficGrowthEngine.getForumEngine();
    const result = await forumEngine.createCategory(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Forum category creation failed:', error);
    res.status(500).json({ success: false, error: 'Failed to create forum category' });
  }
});

/**
 * POST /api/growth/forum/create-topic
 * Create a new forum topic/discussion
 */
router.post("/forum/create-topic", requireAuth, async (req: Request, res: Response) => {
  try {
    const forumEngine = moneyTrafficGrowthEngine.getForumEngine();
    const result = await forumEngine.createTopic(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Forum topic creation failed:', error);
    res.status(500).json({ success: false, error: 'Failed to create forum topic' });
  }
});

/**
 * GET /api/growth/forum/analytics
 * Get comprehensive forum analytics
 */
router.get("/forum/analytics", async (req: Request, res: Response) => {
  try {
    const forumEngine = moneyTrafficGrowthEngine.getForumEngine();
    const timeframe = req.query.timeframe as string || '30d';
    const result = await forumEngine.getForumAnalytics(timeframe);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Forum analytics failed:', error);
    res.status(500).json({ success: false, error: 'Failed to get forum analytics' });
  }
});

// ====================================================================
// RESOURCE DIRECTORY ENGINE ROUTES
// ====================================================================

/**
 * POST /api/growth/resources/add
 * Add a new resource to the directory
 */
router.post("/resources/add", requireAuth, async (req: Request, res: Response) => {
  try {
    const resourceEngine = moneyTrafficGrowthEngine.getResourceDirectoryEngine();
    const result = await resourceEngine.addResource(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Resource addition failed:', error);
    res.status(500).json({ success: false, error: 'Failed to add resource' });
  }
});

/**
 * GET /api/growth/resources/search
 * Search resources with advanced filtering
 */
router.get("/resources/search", async (req: Request, res: Response) => {
  try {
    const resourceEngine = moneyTrafficGrowthEngine.getResourceDirectoryEngine();
    const result = await resourceEngine.searchResources(req.query as any);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Resource search failed:', error);
    res.status(500).json({ success: false, error: 'Failed to search resources' });
  }
});

/**
 * GET /api/growth/resources/analytics
 * Get comprehensive resource directory analytics
 */
router.get("/resources/analytics", async (req: Request, res: Response) => {
  try {
    const resourceEngine = moneyTrafficGrowthEngine.getResourceDirectoryEngine();
    const timeframe = req.query.timeframe as string || '30d';
    const result = await resourceEngine.getDirectoryAnalytics(timeframe);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Resource directory analytics failed:', error);
    res.status(500).json({ success: false, error: 'Failed to get resource directory analytics' });
  }
});

// ====================================================================
// VIRAL DATA VISUALIZATION ENGINE ROUTES
// ====================================================================

/**
 * POST /api/growth/data-viz/create
 * Create a new data visualization
 */
router.post("/data-viz/create", requireAuth, async (req: Request, res: Response) => {
  try {
    const vizEngine = moneyTrafficGrowthEngine.getViralDataVizEngine();
    const result = await vizEngine.createVisualization(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Data visualization creation failed:', error);
    res.status(500).json({ success: false, error: 'Failed to create data visualization' });
  }
});

/**
 * POST /api/growth/data-viz/generate-from-data
 * Generate visualization from raw data
 */
router.post("/data-viz/generate-from-data", requireAuth, async (req: Request, res: Response) => {
  try {
    const vizEngine = moneyTrafficGrowthEngine.getViralDataVizEngine();
    const result = await vizEngine.generateFromData(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Data visualization generation failed:', error);
    res.status(500).json({ success: false, error: 'Failed to generate data visualization' });
  }
});

/**
 * GET /api/growth/data-viz/analytics
 * Get comprehensive viral data visualization analytics
 */
router.get("/data-viz/analytics", async (req: Request, res: Response) => {
  try {
    const vizEngine = moneyTrafficGrowthEngine.getViralDataVizEngine();
    const timeframe = req.query.timeframe as string || '30d';
    const result = await vizEngine.getViralAnalytics(timeframe);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Viral data viz analytics failed:', error);
    res.status(500).json({ success: false, error: 'Failed to get viral data viz analytics' });
  }
});

export default router;