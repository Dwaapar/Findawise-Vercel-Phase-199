/**
 * MIGRATION-PROOF API ENDPOINTS
 * Billion-Dollar Migration-Proof Export/Import System
 */

import express from "express";
import { migrationProofEngine, type MigrationProofReport, type ImportValidationResult } from "../services/empire-hardening/migrationProofEngine";

const router = express.Router();

/**
 * POST /api/migration-proof/export
 * Comprehensive system export with integrity validation
 */
router.post("/export", async (req, res) => {
  try {
    console.log('🚀 Starting migration-proof export...');
    const exportReport = await migrationProofEngine.performComprehensiveExport();
    
    res.json({
      success: true,
      data: {
        report: exportReport,
        message: "Migration-proof export completed successfully",
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("🚨 Migration export failed:", error);
    res.status(500).json({
      success: false,
      error: "Migration export failed",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

/**
 * POST /api/migration-proof/import
 * Comprehensive system import with conflict resolution
 */
router.post("/import", async (req, res) => {
  try {
    const { exportPath } = req.body;
    
    if (!exportPath) {
      return res.status(400).json({
        success: false,
        error: "Export path is required"
      });
    }

    console.log('🚀 Starting migration-proof import...');
    const importResult = await migrationProofEngine.performComprehensiveImport(exportPath);
    
    res.json({
      success: importResult.isValid,
      data: {
        result: importResult,
        message: importResult.isValid ? "Migration import completed successfully" : "Migration import completed with issues",
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("🚨 Migration import failed:", error);
    res.status(500).json({
      success: false,
      error: "Migration import failed",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

/**
 * GET /api/migration-proof/status
 * Get current migration system status
 */
router.get("/status", async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        system: "operational",
        version: "1.0.0-empire-grade",
        capabilities: [
          "Full database export/import",
          "Schema preservation",
          "Dependency resolution", 
          "Integrity validation",
          "Conflict resolution",
          "Zero-downtime migration"
        ],
        lastExport: null, // Would track actual last export
        supportedFormats: ["JSON", "CSV", "SQL"]
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