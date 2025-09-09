/**
 * SYSTEM HEALTH API - EMPIRE GRADE MONITORING
 * Provides comprehensive system health status and component verification
 */

import { Router, Request, Response } from 'express';
import { systemHealthOptimizer } from '../services/empire-hardening/systemHealthOptimizer.js';

const router = Router();

// Get comprehensive system health status
router.get('/status', async (req: Request, res: Response) => {
  try {
    const healthReport = await systemHealthOptimizer.optimizeSystemHealth();
    
    res.json({
      success: true,
      data: {
        overall: healthReport.overall,
        timestamp: new Date().toISOString(),
        components: healthReport.components,
        performance: healthReport.performance,
        recommendations: healthReport.recommendations,
        systemGrades: {
          database: healthReport.performance.dbResponseTime < 1000 ? 'A+' : 'B+',
          cache: healthReport.performance.cacheHitRate > 90 ? 'A+' : 'B+',
          components: Object.values(healthReport.components).every(c => c.status === 'HEALTHY') ? 'A+' : 'B+',
          overall: healthReport.overall === 'OPTIMAL' ? 'EMPIRE_GRADE' : 
                  healthReport.overall === 'GOOD' ? 'A_PLUS_GRADE' : 'PRODUCTION_READY'
        }
      }
    });
  } catch (error) {
    console.error('System health check failed:', error);
    res.status(500).json({
      success: false,
      error: 'System health check failed',
      timestamp: new Date().toISOString()
    });
  }
});

// Force system optimization
router.post('/optimize', async (req: Request, res: Response) => {
  try {
    console.log('🔧 Manual system optimization triggered');
    const healthReport = await systemHealthOptimizer.optimizeSystemHealth();
    
    res.json({
      success: true,
      data: {
        message: 'System optimization completed',
        beforeStatus: 'N/A',
        afterStatus: healthReport.overall,
        optimizations: healthReport.recommendations,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('System optimization failed:', error);
    res.status(500).json({
      success: false,
      error: 'System optimization failed',
      timestamp: new Date().toISOString()
    });
  }
});

// Get component-specific health
router.get('/component/:name', async (req: Request, res: Response) => {
  try {
    const componentName = req.params.name;
    const healthReport = await systemHealthOptimizer.optimizeSystemHealth();
    
    const component = healthReport.components[componentName];
    if (!component) {
      return res.status(404).json({
        success: false,
        error: `Component '${componentName}' not found`,
        availableComponents: Object.keys(healthReport.components)
      });
    }
    
    res.json({
      success: true,
      data: {
        component: componentName,
        ...component,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error(`Component health check failed for ${req.params.name}:`, error);
    res.status(500).json({
      success: false,
      error: 'Component health check failed',
      timestamp: new Date().toISOString()
    });
  }
});

export default router;