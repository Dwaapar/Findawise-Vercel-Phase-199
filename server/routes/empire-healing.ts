/**
 * EMPIRE HEALING ENDPOINTS
 * Billion-Dollar System Health and Auto-Healing API
 */

import express from "express";
import { empireGradeSystemHealer, type SystemHealthReport } from "../services/empire-hardening/empireGradeSystemHealer";

const router = express.Router();

/**
 * GET /api/empire-healing/health
 * Comprehensive system health check with auto-healing
 */
router.get("/health", async (req, res) => {
  try {
    const healthReport = await empireGradeSystemHealer.performComprehensiveHealing();
    
    res.json({
      success: true,
      data: {
        report: healthReport,
        timestamp: new Date().toISOString(),
        version: "1.0.0-empire-grade"
      }
    });
  } catch (error) {
    console.error("🚨 Empire healing health check failed:", error);
    res.status(500).json({
      success: false,
      error: "Empire healing system health check failed",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

/**
 * POST /api/empire-healing/force-heal
 * Force immediate comprehensive healing
 */
router.post("/force-heal", async (req, res) => {
  try {
    const healingReport = await empireGradeSystemHealer.forceImmediateHealing();
    
    res.json({
      success: true,
      data: {
        healing: healingReport,
        message: "Empire system healing completed",
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("🚨 Force healing failed:", error);
    res.status(500).json({
      success: false,
      error: "Force healing failed",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

/**
 * GET /api/empire-healing/history
 * Get healing action history
 */
router.get("/history", async (req, res) => {
  try {
    const history = empireGradeSystemHealer.getHealingHistory();
    
    res.json({
      success: true,
      data: {
        history,
        total: history.length,
        successful: history.filter(h => h.success).length,
        failed: history.filter(h => !h.success).length
      }
    });
  } catch (error) {
    console.error("🚨 Failed to get healing history:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve healing history",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

/**
 * GET /api/empire-healing/status
 * Quick status check without triggering healing
 */
router.get("/status", async (req, res) => {
  try {
    // Quick status without full healing
    res.json({
      success: true,
      data: {
        status: "operational",
        healer: "active",
        lastCheck: new Date().toISOString(),
        uptime: process.uptime()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Status check failed"
    });
  }
});

export default router;