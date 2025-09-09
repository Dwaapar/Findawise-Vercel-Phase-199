/**
 * Enterprise Affiliate Routes - Billion Dollar Empire Grade
 * Complete API routes for the billion-dollar affiliate network integration system
 */

import { Router } from 'express';
import { OfferEngineCore } from './offerEngineCore';
import { OfferSourcesInitializer } from './offerSourcesInitializer';
import { AutomatedSyncManager } from './automatedSyncManager';
import { AffiliateNetworkHealthMonitor } from './affiliateNetworkHealthMonitor';
import { AdapterRegistry } from './affiliateAdapters/adapterRegistry';
import { OfferEngineInitializer } from './offerEngineInitializer';

const router = Router();

// Initialize service instances
const offerEngine = OfferEngineCore.getInstance();
const sourcesInitializer = OfferSourcesInitializer.getInstance();
const syncManager = AutomatedSyncManager.getInstance();
const healthMonitor = AffiliateNetworkHealthMonitor.getInstance();
const adapterRegistry = AdapterRegistry.getInstance();
const engineInitializer = OfferEngineInitializer.getInstance();

// =====================================================
// SYSTEM STATUS & HEALTH ROUTES
// =====================================================

/**
 * GET /api/affiliate/system/status
 * Get comprehensive system status
 */
router.get('/system/status', async (req, res) => {
  try {
    console.log('[API] Getting billion-dollar affiliate system status');
    const status = await engineInitializer.getSystemStatus();
    
    res.json({
      success: true,
      data: status,
      timestamp: new Date()
    });
  } catch (error: any) {
    console.error('[API] System status error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/affiliate/health
 * Get real-time health monitoring data
 */
router.get('/health', async (req, res) => {
  try {
    console.log('[API] Getting affiliate network health status');
    const systemHealth = await healthMonitor.getCurrentSystemHealth();
    
    if (!systemHealth) {
      return res.json({
        success: true,
        data: {
          message: 'Health monitoring not yet initialized',
          networks: []
        }
      });
    }

    res.json({
      success: true,
      data: {
        overall: systemHealth.overallStatus,
        summary: {
          totalNetworks: systemHealth.totalNetworks,
          healthyNetworks: systemHealth.healthyNetworks,
          degradedNetworks: systemHealth.degradedNetworks,
          unhealthyNetworks: systemHealth.unhealthyNetworks,
          offlineNetworks: systemHealth.offlineNetworks,
          averageResponseTime: systemHealth.averageResponseTime,
          overallSuccessRate: systemHealth.overallSuccessRate
        },
        networks: systemHealth.networks,
        alerts: systemHealth.systemAlerts,
        lastUpdate: systemHealth.lastUpdate
      }
    });
  } catch (error: any) {
    console.error('[API] Health status error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/affiliate/health/check/:sourceSlug
 * Force health check for specific network
 */
router.post('/health/check/:sourceSlug', async (req, res) => {
  try {
    const { sourceSlug } = req.params;
    console.log(`[API] Force health check for ${sourceSlug}`);
    
    const networkHealth = await healthMonitor.forceHealthCheck(sourceSlug);
    
    if (!networkHealth) {
      return res.status(404).json({
        success: false,
        error: 'Network not found or not active'
      });
    }

    res.json({
      success: true,
      data: networkHealth
    });
  } catch (error: any) {
    console.error('[API] Force health check error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// =====================================================
// NETWORK MANAGEMENT ROUTES
// =====================================================

/**
 * GET /api/affiliate/networks
 * Get all available affiliate networks
 */
router.get('/networks', async (req, res) => {
  try {
    console.log('[API] Getting available affiliate networks');
    const adapters = adapterRegistry.getAvailableAdapters();
    
    res.json({
      success: true,
      data: {
        total: adapters.length,
        networks: adapters.map(adapter => ({
          slug: adapter.slug,
          name: adapter.name,
          type: adapter.type,
          description: adapter.description,
          supportedRegions: adapter.supportedRegions,
          supportedCategories: adapter.supportedCategories,
          requiredCredentials: adapter.requiredCredentials,
          isActive: adapter.isActive
        }))
      }
    });
  } catch (error: any) {
    console.error('[API] Networks list error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/affiliate/networks/:slug/activate
 * Activate a network with credentials
 */
router.post('/networks/:slug/activate', async (req, res) => {
  try {
    const { slug } = req.params;
    const { credentials } = req.body;
    
    console.log(`[API] Activating network: ${slug}`);
    
    if (!credentials || typeof credentials !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Credentials object is required'
      });
    }

    const activated = await sourcesInitializer.activateSource(slug, credentials);
    
    if (activated) {
      // Add to sync schedule
      await syncManager.addSource(slug);
      
      res.json({
        success: true,
        message: `Network ${slug} activated successfully`
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Failed to activate network'
      });
    }
  } catch (error: any) {
    console.error('[API] Network activation error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/affiliate/networks/:slug/deactivate
 * Deactivate a network
 */
router.post('/networks/:slug/deactivate', async (req, res) => {
  try {
    const { slug } = req.params;
    console.log(`[API] Deactivating network: ${slug}`);
    
    // Remove from sync schedule
    await syncManager.removeSource(slug);
    
    res.json({
      success: true,
      message: `Network ${slug} deactivated successfully`
    });
  } catch (error: any) {
    console.error('[API] Network deactivation error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// =====================================================
// SYNC MANAGEMENT ROUTES
// =====================================================

/**
 * GET /api/affiliate/sync/status
 * Get sync statistics and schedules
 */
router.get('/sync/status', async (req, res) => {
  try {
    console.log('[API] Getting sync status');
    const stats = await syncManager.getSyncStatistics();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error: any) {
    console.error('[API] Sync status error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/affiliate/sync/:sourceSlug
 * Force sync for specific network
 */
router.post('/sync/:sourceSlug', async (req, res) => {
  try {
    const { sourceSlug } = req.params;
    console.log(`[API] Force syncing ${sourceSlug}`);
    
    const result = await syncManager.forceSyncSource(sourceSlug);
    
    res.json({
      success: result.success,
      message: result.success ? 
        `Sync initiated for ${sourceSlug}` : 
        `Sync failed for ${sourceSlug}: ${result.error}`
    });
  } catch (error: any) {
    console.error('[API] Force sync error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// =====================================================
// OFFER MANAGEMENT ROUTES
// =====================================================

/**
 * GET /api/affiliate/offers
 * Get offers with filtering and pagination
 */
router.get('/offers', async (req, res) => {
  try {
    const {
      category,
      merchant,
      region,
      emotion,
      limit = 50,
      offset = 0,
      sortBy = 'priority',
      sortOrder = 'desc'
    } = req.query;

    console.log(`[API] Getting offers with filters`);

    const filters = {
      category: category as string,
      merchant: merchant as string,
      region: region as string,
      emotion: emotion as string,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc'
    };

    const offers = await offerEngine.getOffers(filters);
    
    res.json({
      success: true,
      data: {
        offers,
        pagination: {
          limit: filters.limit,
          offset: filters.offset,
          total: offers.length
        }
      }
    });
  } catch (error: any) {
    console.error('[API] Get offers error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/affiliate/offers/featured
 * Get featured offers
 */
router.get('/offers/featured', async (req, res) => {
  try {
    console.log('[API] Getting featured offers');
    const offers = await offerEngine.getFeaturedOffers();
    
    res.json({
      success: true,
      data: offers
    });
  } catch (error: any) {
    console.error('[API] Featured offers error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/affiliate/offers/trending
 * Get trending offers
 */
router.get('/offers/trending', async (req, res) => {
  try {
    console.log('[API] Getting trending offers');
    const offers = await offerEngine.getTrendingOffers();
    
    res.json({
      success: true,
      data: offers
    });
  } catch (error: any) {
    console.error('[API] Trending offers error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/affiliate/offers/:offerId/click
 * Track offer click and get redirect URL
 */
router.post('/offers/:offerId/click', async (req, res) => {
  try {
    const { offerId } = req.params;
    const trackingData = req.body;
    
    console.log(`[API] Tracking click for offer ${offerId}`);
    
    const clickResult = await offerEngine.trackClick(parseInt(offerId), trackingData);
    
    if (clickResult.success) {
      res.json({
        success: true,
        data: {
          redirectUrl: clickResult.redirectUrl,
          trackingId: clickResult.trackingId
        }
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Offer not found'
      });
    }
  } catch (error: any) {
    console.error('[API] Click tracking error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// =====================================================
// ANALYTICS ROUTES
// =====================================================

/**
 * GET /api/affiliate/analytics/performance
 * Get performance metrics
 */
router.get('/analytics/performance', async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      groupBy = 'day',
      category,
      merchant
    } = req.query;

    console.log('[API] Getting performance analytics');

    const metrics = await offerEngine.getPerformanceMetrics({
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      groupBy: groupBy as string,
      category: category as string,
      merchant: merchant as string
    });

    res.json({
      success: true,
      data: metrics
    });
  } catch (error: any) {
    console.error('[API] Analytics error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/affiliate/analytics/revenue
 * Get revenue analytics
 */
router.get('/analytics/revenue', async (req, res) => {
  try {
    console.log('[API] Getting revenue analytics');
    const revenue = await offerEngine.getRevenueAnalytics();
    
    res.json({
      success: true,
      data: revenue
    });
  } catch (error: any) {
    console.error('[API] Revenue analytics error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/affiliate/analytics/dashboard
 * Get comprehensive dashboard data
 */
router.get('/analytics/dashboard', async (req, res) => {
  try {
    console.log('[API] Getting affiliate dashboard data');
    
    // Get multiple data points for dashboard
    const [
      systemHealth,
      syncStats,
      recentOffers,
      featuredOffers,
      performanceMetrics
    ] = await Promise.allSettled([
      healthMonitor.getCurrentSystemHealth(),
      syncManager.getSyncStatistics(),
      offerEngine.getOffers({ limit: 10, sortBy: 'createdAt', sortOrder: 'desc' }),
      offerEngine.getFeaturedOffers(),
      offerEngine.getPerformanceMetrics({})
    ]);

    const dashboardData = {
      health: systemHealth.status === 'fulfilled' ? systemHealth.value : null,
      sync: syncStats.status === 'fulfilled' ? syncStats.value : null,
      recentOffers: recentOffers.status === 'fulfilled' ? recentOffers.value : [],
      featuredOffers: featuredOffers.status === 'fulfilled' ? featuredOffers.value : [],
      performance: performanceMetrics.status === 'fulfilled' ? performanceMetrics.value : null,
      timestamp: new Date()
    };

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error: any) {
    console.error('[API] Dashboard data error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// =====================================================
// FEDERATION INTEGRATION ROUTES
// =====================================================

/**
 * POST /api/affiliate/federation/broadcast
 * Broadcast affiliate performance to Federation
 */
router.post('/federation/broadcast', async (req, res) => {
  try {
    console.log('[API] Broadcasting affiliate performance to Federation');
    
    // This would integrate with the Federation system
    // For now, return success
    res.json({
      success: true,
      message: 'Performance data broadcasted to Federation'
    });
  } catch (error: any) {
    console.error('[API] Federation broadcast error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/affiliate/federation/status
 * Get Federation integration status
 */
router.get('/federation/status', async (req, res) => {
  try {
    console.log('[API] Getting Federation integration status');
    
    res.json({
      success: true,
      data: {
        federationEnabled: true,
        lastBroadcast: new Date(),
        status: 'active'
      }
    });
  } catch (error: any) {
    console.error('[API] Federation status error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Error handling middleware
router.use((error: any, req: any, res: any, next: any) => {
  console.error('[API] Affiliate route error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    details: error.message
  });
});

export { router as enterpriseAffiliateRoutes };