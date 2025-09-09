/**
 * EMPIRE VALIDATION API ROUTES
 * Billion-Dollar Grade System Validation and Hardening
 */

import { Router } from 'express';
import { comprehensiveSystemValidator } from '../services/empire-hardening/comprehensiveSystemValidator';
import { empireGradeSystemHealer } from '../services/empire-hardening/empireGradeSystemHealer';
import { migrationProofEngine } from '../services/empire-hardening/migrationProofEngine';
import { performanceOptimizer } from '../services/empire-hardening/performanceOptimizer';

const router = Router();

// Execute comprehensive empire-grade validation
router.get('/api/empire-validation/comprehensive', async (req, res) => {
  try {
    console.log('🏆 Starting billion-dollar empire validation...');
    const validation = await comprehensiveSystemValidator.performEmpireGradeValidation();
    
    res.json({
      success: true,
      data: validation,
      message: `System status: ${validation.overall}`
    });
  } catch (error) {
    console.error('❌ Empire validation failed:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Execute system healing
router.post('/api/empire-validation/heal', async (req, res) => {
  try {
    console.log('🔧 Executing system healing...');
    const healingResult = await empireGradeSystemHealer.performComprehensiveHealing();
    
    res.json({
      success: true,
      data: healingResult,
      message: `Healing completed. Status: ${healingResult.overall}`
    });
  } catch (error) {
    console.error('❌ System healing failed:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Test migration-proof capabilities
router.post('/api/empire-validation/migration-test', async (req, res) => {
  try {
    console.log('🚀 Testing migration-proof capabilities...');
    const testResult = await migrationProofEngine.performMigrationTest();
    
    res.json({
      success: true,
      data: testResult,
      message: 'Migration test completed'
    });
  } catch (error) {
    console.error('❌ Migration test failed:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Optimize system performance
router.post('/api/empire-validation/optimize', async (req, res) => {
  try {
    console.log('⚡ Optimizing system performance...');
    const optimization = await performanceOptimizer.performOptimization();
    
    res.json({
      success: true,
      data: optimization,
      message: 'Performance optimization completed'
    });
  } catch (error) {
    console.error('❌ Performance optimization failed:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get system status summary
router.get('/api/empire-validation/status', async (req, res) => {
  try {
    const healer = empireGradeSystemHealer.getInstance();
    const healthReport = await healer.performComprehensiveHealing();
    const migrationStatus = migrationProofEngine.getSystemStatus();
    const performanceMetrics = await performanceOptimizer.analyzeSystemPerformance();
    
    res.json({
      success: true,
      data: {
        health: healthReport,
        migration: migrationStatus,
        performance: performanceMetrics,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('❌ Status check failed:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;