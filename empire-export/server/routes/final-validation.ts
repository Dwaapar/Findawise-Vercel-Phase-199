/**
 * FINAL VALIDATION API ENDPOINTS
 * Billion-Dollar Final System Validation and Hardening API
 */

import express from "express";
import { finalSystemValidator, type FinalValidationReport } from "../services/empire-hardening/finalSystemValidator";

const router = express.Router();

/**
 * POST /api/final-validation/comprehensive
 * Run comprehensive final validation and hardening
 */
router.post("/comprehensive", async (req, res) => {
  try {
    console.log('🏆 Starting comprehensive final validation...');
    const report = await finalSystemValidator.performFinalValidation();
    
    res.json({
      success: true,
      data: {
        report,
        message: "Final validation completed",
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("🚨 Final validation failed:", error);
    res.status(500).json({
      success: false,
      error: "Final validation failed",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

/**
 * GET /api/final-validation/status
 * Get current validation status
 */
router.get("/status", async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        status: "ready",
        capabilities: [
          "Comprehensive module validation",
          "Schema and config health checks",
          "Migration proof testing",
          "LLM readiness validation",
          "Auto-healing verification",
          "Security compliance audit",
          "Performance benchmarking"
        ],
        phases: [
          "Boot Phase - System self-verification",
          "Testing Phase - Module and integration tests",
          "Integration Phase - Semantic graph validation",
          "Upgrade Phase - Empire grade hardening",
          "Alert & Heal Phase - Self-healing validation",
          "Documentation Phase - Auto-documentation"
        ]
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