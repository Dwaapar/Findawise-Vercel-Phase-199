/**
 * Global Deal Sniper & Price Tracker API Routes
 * Billion-Dollar Empire Grade, AI-First, Migration-Proof
 */

import { Router } from 'express';
import { dealSniperEngine } from '../services/dealSniper/dealSniperEngine';
import { db } from '../db';
import { 
  productCatalog, priceHistory, priceAlerts,
  dealEvents, couponCodes, retailerApis,
  dealAnalytics, pricePredictions, userWishlists,
  dealInventory, dealCategories, dealSources, dealAlerts
} from '../../shared/dealSniperTables';
import { eq, and, desc, asc, sql, like, gte, lte } from 'drizzle-orm';
import { z } from 'zod';

const router = Router();

// Validation schemas
const subscriptionSchema = z.object({
  userId: z.string(),
  categories: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]),
  maxPrice: z.number().positive().optional(),
  minDiscount: z.number().min(1).max(100).default(10),
  preferredRetailers: z.array(z.string()).default([]),
  alertFrequency: z.enum(['instant', 'hourly', 'daily']).default('instant')
});

const dealSearchSchema = z.object({
  category: z.string().optional(),
  retailer: z.string().optional(),
  minDiscount: z.number().min(0).max(100).optional(),
  maxPrice: z.number().positive().optional(),
  sortBy: z.enum(['score', 'discount', 'price', 'recent']).default('score'),
  limit: z.number().min(1).max(100).default(20)
});

// Initialize engine
let engineInitialized = false;

async function ensureEngineInitialized() {
  if (!engineInitialized) {
    await dealSniperEngine.initialize();
    engineInitialized = true;
  }
}

// ================================================
// DEAL DISCOVERY & SCANNING
// ================================================

/**
 * Trigger deal scan
 * POST /api/deal-sniper/scan
 */
router.post('/scan', async (req, res) => {
  try {
    await ensureEngineInitialized();
    
    // Start scan asynchronously
    const scanPromise = dealSniperEngine.scanForDeals();
    
    res.json({
      success: true,
      message: 'Deal scan initiated successfully',
      data: {
        estimated: '10-30 minutes'
      }
    });
    
    // Log completion when done
    scanPromise.then(deals => {
      console.log(`✅ Deal scan completed: ${deals.length} deals found`);
    }).catch(error => {
      console.error('❌ Deal scan failed:', error);
    });
    
  } catch (error) {
    console.error('❌ Failed to start deal scan:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to start deal scan'
    });
  }
});

/**
 * Get trending deals
 * GET /api/deal-sniper/trending
 */
router.get('/trending', async (req, res) => {
  try {
    await ensureEngineInitialized();
    
    const { limit = 20 } = req.query;
    const deals = await dealSniperEngine.getTrendingDeals(parseInt(limit as string));
    
    res.json({
      success: true,
      data: deals
    });
  } catch (error) {
    console.error('❌ Failed to get trending deals:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get trending deals'
    });
  }
});

/**
 * Search deals
 * GET /api/deal-sniper/deals
 */
router.get('/deals', async (req, res) => {
  try {
    const validatedQuery = dealSearchSchema.parse(req.query);
    
    let query = db.select().from(dealInventory);
    const conditions = [eq(dealInventory.isActive, true)];
    
    if (validatedQuery.category) {
      conditions.push(eq(dealInventory.category, validatedQuery.category));
    }
    
    if (validatedQuery.retailer) {
      conditions.push(eq(dealInventory.retailer, validatedQuery.retailer));
    }
    
    if (validatedQuery.minDiscount) {
      conditions.push(gte(dealInventory.discountPercent, validatedQuery.minDiscount));
    }
    
    if (validatedQuery.maxPrice) {
      conditions.push(lte(dealInventory.currentPrice, validatedQuery.maxPrice));
    }
    
    query = query.where(and(...conditions));
    
    // Apply sorting
    const sortColumn = validatedQuery.sortBy === 'score' ? dealInventory.dealScore :
                      validatedQuery.sortBy === 'discount' ? dealInventory.discountPercent :
                      validatedQuery.sortBy === 'price' ? dealInventory.currentPrice :
                      dealInventory.createdAt;
    
    query = query.orderBy(desc(sortColumn));
    query = query.limit(validatedQuery.limit);
    
    const deals = await query;
    
    res.json({
      success: true,
      data: deals,
      filters: validatedQuery
    });
  } catch (error) {
    console.error('❌ Failed to search deals:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to search deals'
    });
  }
});

/**
 * Get deals by category
 * GET /api/deal-sniper/category/:category
 */
router.get('/category/:category', async (req, res) => {
  try {
    await ensureEngineInitialized();
    
    const { category } = req.params;
    const { limit = 50 } = req.query;
    
    const deals = await dealSniperEngine.getDealsByCategory(category, parseInt(limit as string));
    
    res.json({
      success: true,
      data: deals,
      category
    });
  } catch (error) {
    console.error('❌ Failed to get deals by category:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get deals by category'
    });
  }
});

// ================================================
// PRICE TRACKING & HISTORY
// ================================================

/**
 * Get price history for a product
 * GET /api/deal-sniper/price-history/:product
 */
router.get('/price-history/:product', async (req, res) => {
  try {
    await ensureEngineInitialized();
    
    const { product } = req.params;
    const { retailer } = req.query;
    
    if (!retailer) {
      return res.status(400).json({
        success: false,
        error: 'Retailer parameter is required'
      });
    }
    
    const history = await dealSniperEngine.getPriceHistory(
      decodeURIComponent(product), 
      retailer as string
    );
    
    res.json({
      success: true,
      data: history,
      product: decodeURIComponent(product),
      retailer
    });
  } catch (error) {
    console.error('❌ Failed to get price history:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get price history'
    });
  }
});

/**
 * Add product to price tracking
 * POST /api/deal-sniper/track
 */
router.post('/track', async (req, res) => {
  try {
    const { productUrl, userId, targetPrice, alertType = 'price_drop' } = req.body;
    
    if (!productUrl || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Product URL and user ID are required'
      });
    }
    
    const [tracking] = await db.insert(priceTracking).values({
      userId,
      productUrl,
      targetPrice: targetPrice || null,
      alertType,
      isActive: true,
      trackingFrequency: 'hourly'
    }).returning();
    
    res.json({
      success: true,
      data: tracking,
      message: 'Product added to price tracking successfully'
    });
  } catch (error) {
    console.error('❌ Failed to add price tracking:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to add price tracking'
    });
  }
});

/**
 * Get user's price tracking list
 * GET /api/deal-sniper/tracking/:userId
 */
router.get('/tracking/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50 } = req.query;
    
    const tracking = await db.select()
      .from(priceTracking)
      .where(and(
        eq(priceTracking.userId, userId),
        eq(priceTracking.isActive, true)
      ))
      .orderBy(desc(priceTracking.createdAt))
      .limit(parseInt(limit as string));
    
    res.json({
      success: true,
      data: tracking
    });
  } catch (error) {
    console.error('❌ Failed to get price tracking:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get price tracking'
    });
  }
});

// ================================================
// USER SUBSCRIPTIONS & ALERTS
// ================================================

/**
 * Subscribe user to deal alerts
 * POST /api/deal-sniper/subscribe
 */
router.post('/subscribe', async (req, res) => {
  try {
    await ensureEngineInitialized();
    
    const validatedData = subscriptionSchema.parse(req.body);
    
    const subscriptionId = await dealSniperEngine.subscribeUser(
      validatedData.userId, 
      validatedData
    );
    
    res.json({
      success: true,
      data: { subscriptionId },
      message: 'User subscribed to deal alerts successfully'
    });
  } catch (error) {
    console.error('❌ Failed to subscribe user:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to subscribe user'
    });
  }
});

/**
 * Get user subscriptions
 * GET /api/deal-sniper/subscriptions/:userId
 */
router.get('/subscriptions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const subscriptions = await db.select()
      .from(userSubscriptions)
      .where(eq(userSubscriptions.userId, userId))
      .orderBy(desc(userSubscriptions.createdAt));
    
    res.json({
      success: true,
      data: subscriptions
    });
  } catch (error) {
    console.error('❌ Failed to get subscriptions:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get subscriptions'
    });
  }
});

/**
 * Update subscription
 * PUT /api/deal-sniper/subscriptions/:id
 */
router.put('/subscriptions/:id', async (req, res) => {
  try {
    const subscriptionId = req.params.id;
    const updateData = subscriptionSchema.partial().parse(req.body);
    
    const [updatedSubscription] = await db.update(userSubscriptions)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(userSubscriptions.id, subscriptionId))
      .returning();
    
    if (!updatedSubscription) {
      return res.status(404).json({
        success: false,
        error: 'Subscription not found'
      });
    }
    
    res.json({
      success: true,
      data: updatedSubscription,
      message: 'Subscription updated successfully'
    });
  } catch (error) {
    console.error('❌ Failed to update subscription:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update subscription'
    });
  }
});

/**
 * Unsubscribe from alerts
 * DELETE /api/deal-sniper/subscriptions/:id
 */
router.delete('/subscriptions/:id', async (req, res) => {
  try {
    const subscriptionId = req.params.id;
    
    const [updatedSubscription] = await db.update(userSubscriptions)
      .set({ 
        isActive: false,
        updatedAt: new Date()
      })
      .where(eq(userSubscriptions.id, subscriptionId))
      .returning();
    
    if (!updatedSubscription) {
      return res.status(404).json({
        success: false,
        error: 'Subscription not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Unsubscribed successfully'
    });
  } catch (error) {
    console.error('❌ Failed to unsubscribe:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to unsubscribe'
    });
  }
});

/**
 * Get user's deal alerts
 * GET /api/deal-sniper/alerts/:userId
 */
router.get('/alerts/:userId', async (req, res) => {
  try {
    await ensureEngineInitialized();
    
    const { userId } = req.params;
    const { limit = 50, unreadOnly = false } = req.query;
    
    const alerts = await dealSniperEngine.getUserAlerts(userId, parseInt(limit as string));
    
    const filteredAlerts = unreadOnly === 'true' 
      ? alerts.filter((alert: any) => !alert.isRead)
      : alerts;
    
    res.json({
      success: true,
      data: filteredAlerts
    });
  } catch (error) {
    console.error('❌ Failed to get user alerts:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get user alerts'
    });
  }
});

/**
 * Mark alert as read
 * PUT /api/deal-sniper/alerts/:alertId/read
 */
router.put('/alerts/:alertId/read', async (req, res) => {
  try {
    const alertId = req.params.alertId;
    
    const [updatedAlert] = await db.update(dealAlerts)
      .set({ 
        isRead: true,
        readAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(dealAlerts.id, alertId))
      .returning();
    
    if (!updatedAlert) {
      return res.status(404).json({
        success: false,
        error: 'Alert not found'
      });
    }
    
    res.json({
      success: true,
      data: updatedAlert,
      message: 'Alert marked as read'
    });
  } catch (error) {
    console.error('❌ Failed to mark alert as read:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to mark alert as read'
    });
  }
});

// ================================================
// DEAL SOURCES & MANAGEMENT
// ================================================

/**
 * Get deal sources
 * GET /api/deal-sniper/sources
 */
router.get('/sources', async (req, res) => {
  try {
    const { activeOnly = true } = req.query;
    
    let query = db.select().from(dealSources);
    
    if (activeOnly === 'true') {
      query = query.where(eq(dealSources.isActive, true));
    }
    
    const sources = await query.orderBy(desc(dealSources.priority));
    
    res.json({
      success: true,
      data: sources
    });
  } catch (error) {
    console.error('❌ Failed to get deal sources:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get deal sources'
    });
  }
});

/**
 * Get deal categories
 * GET /api/deal-sniper/categories
 */
router.get('/categories', async (req, res) => {
  try {
    const categories = await db.select()
      .from(dealCategories)
      .where(eq(dealCategories.isActive, true))
      .orderBy(desc(dealCategories.priority));
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('❌ Failed to get categories:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get categories'
    });
  }
});

// ================================================
// ANALYTICS & REPORTING
// ================================================

/**
 * Get deal analytics
 * GET /api/deal-sniper/analytics
 */
router.get('/analytics', async (req, res) => {
  try {
    const { startDate, endDate, granularity = 'daily' } = req.query;
    
    const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate as string) : new Date();
    
    // Deal discovery trends
    const dealStats = await db.select({
      date: sql`DATE(${dealInventory.createdAt})`,
      category: dealInventory.category,
      count: sql`count(*)`
    })
    .from(dealInventory)
    .where(and(
      gte(dealInventory.createdAt, start),
      lte(dealInventory.createdAt, end)
    ))
    .groupBy(sql`DATE(${dealInventory.createdAt})`, dealInventory.category);
    
    // Alert engagement
    const alertStats = await db.select({
      alertType: dealAlerts.alertType,
      count: sql`count(*)`
    })
    .from(dealAlerts)
    .where(and(
      gte(dealAlerts.createdAt, start),
      lte(dealAlerts.createdAt, end)
    ))
    .groupBy(dealAlerts.alertType);
    
    // Top retailers
    const retailerStats = await db.select({
      retailer: dealInventory.retailer,
      dealCount: sql`count(*)`,
      avgDiscount: sql`avg(${dealInventory.discountPercent})`
    })
    .from(dealInventory)
    .where(and(
      gte(dealInventory.createdAt, start),
      lte(dealInventory.createdAt, end)
    ))
    .groupBy(dealInventory.retailer)
    .orderBy(desc(sql`count(*)`))
    .limit(10);
    
    res.json({
      success: true,
      data: {
        period: { start, end },
        dealStats,
        alertStats,
        retailerStats,
        summary: {
          totalDeals: dealStats.reduce((sum, stat) => sum + parseInt(stat.count as string), 0),
          totalAlerts: alertStats.reduce((sum, stat) => sum + parseInt(stat.count as string), 0),
          topRetailer: retailerStats[0]?.retailer || 'N/A'
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
 * Deal Sniper health check
 * GET /api/deal-sniper/health
 */
router.get('/health', async (req, res) => {
  try {
    await ensureEngineInitialized();
    const health = await dealSniperEngine.healthCheck();
    
    res.json({
      success: true,
      data: health
    });
  } catch (error) {
    console.error('❌ Deal Sniper health check failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Health check failed'
    });
  }
});

/**
 * Get system configuration
 * GET /api/deal-sniper/config
 */
router.get('/config', async (req, res) => {
  try {
    const config = {
      supportedRetailers: ['amazon', 'bestbuy', 'walmart', 'target', 'newegg'],
      scanFrequency: '30 minutes',
      alertTypes: ['price_drop', 'flash_sale', 'coupon', 'restock'],
      subscriptionTypes: ['deal_alerts', 'price_tracking', 'category_updates'],
      priceTrackingFrequencies: ['hourly', 'daily', 'weekly'],
      engineStatus: engineInitialized ? 'initialized' : 'not_initialized',
      features: {
        realTimeTracking: true,
        priceHistory: true,
        dealScoring: true,
        multiRetailer: true,
        categoryFiltering: true,
        customAlerts: true
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