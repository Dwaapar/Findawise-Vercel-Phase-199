/**
 * LLM BRAIN API ENDPOINTS
 * Billion-Dollar LLM Brain Integration API
 */

import express from "express";
import { llmBrainIntegration, type LLMRequest, type BrainIntegrationStatus } from "../services/empire-hardening/llmBrainIntegration";

const router = express.Router();

/**
 * POST /api/llm-brain/initialize
 * Initialize LLM brain integration system
 */
router.post("/initialize", async (req, res) => {
  try {
    console.log('🧠 Initializing LLM brain integration...');
    const status = await llmBrainIntegration.initializeBrainIntegration();
    
    res.json({
      success: true,
      data: {
        status,
        message: "LLM brain integration initialized successfully",
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("🚨 LLM brain initialization failed:", error);
    res.status(500).json({
      success: false,
      error: "LLM brain initialization failed",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

/**
 * POST /api/llm-brain/process
 * Process LLM request with intelligent routing
 */
router.post("/process", async (req, res) => {
  try {
    const request: LLMRequest = {
      id: `req_${Date.now()}`,
      provider: req.body.provider || 'auto',
      model: req.body.model || 'gpt-3.5-turbo',
      prompt: req.body.prompt,
      context: req.body.context,
      parameters: {
        temperature: req.body.temperature || 0.7,
        maxTokens: req.body.maxTokens || 1000,
        topP: req.body.topP || 1,
        frequencyPenalty: req.body.frequencyPenalty || 0,
        presencePenalty: req.body.presencePenalty || 0
      },
      metadata: {
        userId: req.body.userId,
        sessionId: req.body.sessionId,
        module: req.body.module || 'general',
        priority: req.body.priority || 'normal'
      }
    };

    if (!request.prompt) {
      return res.status(400).json({
        success: false,
        error: "Prompt is required"
      });
    }

    const response = await llmBrainIntegration.processLLMRequest(request);
    
    res.json({
      success: true,
      data: {
        response,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("🚨 LLM request processing failed:", error);
    res.status(500).json({
      success: false,
      error: "LLM request processing failed",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

/**
 * GET /api/llm-brain/status
 * Get LLM brain integration status
 */
router.get("/status", async (req, res) => {
  try {
    const status = await llmBrainIntegration.getBrainStatus();
    
    res.json({
      success: true,
      data: {
        status,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("🚨 Failed to get brain status:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get brain status",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

/**
 * GET /api/llm-brain/providers
 * Get available LLM providers and their status
 */
router.get("/providers", async (req, res) => {
  try {
    const status = await llmBrainIntegration.getBrainStatus();
    
    res.json({
      success: true,
      data: {
        providers: status.providers,
        totalProviders: Object.keys(status.providers).length,
        healthyProviders: Object.values(status.providers).filter(p => p.status === 'healthy').length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("🚨 Failed to get providers:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get providers"
    });
  }
});

/**
 * GET /api/llm-brain/health
 * Quick health check for LLM brain system
 */
router.get("/health", async (req, res) => {
  try {
    const status = await llmBrainIntegration.getBrainStatus();
    
    res.json({
      success: true,
      data: {
        status: status.status,
        intelligence: status.intelligence,
        performance: status.performance,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Health check failed"
    });
  }
});

export default router;