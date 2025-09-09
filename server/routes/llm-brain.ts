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

/**
 * GET /api/llm-brain/providers
 * Get all configured AI providers
 */
router.get("/providers", async (req, res) => {
  try {
    const providers = await llmBrainIntegration.getConfiguredProviders();
    
    res.json({
      success: true,
      data: providers,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("🚨 Failed to get providers:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get providers",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

/**
 * POST /api/llm-brain/providers
 * Add new AI provider
 */
router.post("/providers", async (req, res) => {
  try {
    const provider = await llmBrainIntegration.addProvider(req.body);
    
    res.json({
      success: true,
      data: provider,
      message: "Provider added successfully",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("🚨 Failed to add provider:", error);
    res.status(500).json({
      success: false,
      error: "Failed to add provider",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

/**
 * PUT /api/llm-brain/providers/:id
 * Update AI provider configuration
 */
router.put("/providers/:id", async (req, res) => {
  try {
    const provider = await llmBrainIntegration.updateProvider(req.params.id, req.body);
    
    res.json({
      success: true,
      data: provider,
      message: "Provider updated successfully",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("🚨 Failed to update provider:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update provider",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

/**
 * DELETE /api/llm-brain/providers/:id
 * Remove AI provider
 */
router.delete("/providers/:id", async (req, res) => {
  try {
    await llmBrainIntegration.removeProvider(req.params.id);
    
    res.json({
      success: true,
      message: "Provider removed successfully",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("🚨 Failed to remove provider:", error);
    res.status(500).json({
      success: false,
      error: "Failed to remove provider",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

/**
 * POST /api/llm-brain/providers/:id/test
 * Test AI provider connection
 */
router.post("/providers/:id/test", async (req, res) => {
  try {
    const result = await llmBrainIntegration.testProvider(req.params.id);
    
    res.json({
      success: true,
      data: result,
      message: "Provider test completed",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("🚨 Provider test failed:", error);
    res.status(500).json({
      success: false,
      error: "Provider test failed",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

/**
 * GET /api/llm-brain/status
 * Get real-time status of all providers
 */
router.get("/status", async (req, res) => {
  try {
    const status = await llmBrainIntegration.getProvidersStatus();
    
    res.json({
      success: true,
      data: status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("🚨 Failed to get status:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get status",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

/**
 * GET /api/llm-brain/stats
 * Get system statistics and usage analytics
 */
router.get("/stats", async (req, res) => {
  try {
    const stats = await llmBrainIntegration.getSystemStats();
    
    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("🚨 Failed to get stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get stats",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

export default router;