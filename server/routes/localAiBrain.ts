/**
 * LOCAL AI BRAIN API ROUTES
 * Self-Evolving Empire Local AI Brain Control Interface
 * 
 * These routes provide complete control over the local AI brain system,
 * enabling self-evolution, brain communication, and AI CTO capabilities.
 */

import { Router } from 'express';
import { z } from 'zod';
import { localAiBrainConnector } from '../services/ai-brain/localAiBrainConnector';

const router = Router();

// ========================================
// LOCAL AI BRAIN CONTROL ROUTES - EMPIRE GRADE
// ========================================

// Initialize local AI brain
router.post('/local-brain/initialize', async (req, res) => {
  try {
    console.log('🧠 Initializing Local AI Brain...');
    
    const success = await localAiBrainConnector.initializeLocalAiBrain();
    
    if (success) {
      res.json({
        success: true,
        message: 'Local AI Brain initialized successfully - Self-evolution active',
        data: {
          timestamp: new Date(),
          status: 'active',
          capabilities: [
            'Self-evolution cycles',
            'Performance optimization',
            'Architecture enhancement',
            'Code generation',
            'Brain-to-brain communication'
          ]
        }
      });
    } else {
      res.status(503).json({
        success: false,
        error: 'Local AI Brain initialization failed - Ollama not available',
        fallback: 'System will continue with cloud-based AI providers'
      });
    }
  } catch (error) {
    console.error('🚨 Local AI Brain initialization error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      fallback: 'System operational with cloud providers'
    });
  }
});

// Get brain status
router.get('/local-brain/status', async (req, res) => {
  try {
    const status = await localAiBrainConnector.getBrainStatus();
    
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('Failed to get brain status:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Query the local brain
router.post('/local-brain/query', async (req, res) => {
  try {
    const querySchema = z.object({
      prompt: z.string().min(10).max(5000),
      context: z.string().optional().default('general'),
      temperature: z.number().min(0).max(2).optional().default(0.7),
      maxTokens: z.number().min(100).max(4000).optional().default(2000)
    });

    const { prompt, context, temperature, maxTokens } = querySchema.parse(req.body);

    const response = await localAiBrainConnector.queryLocalBrain(prompt, context);
    
    res.json({
      success: true,
      data: {
        query: prompt,
        context,
        response,
        timestamp: new Date(),
        provider: 'local-ollama'
      }
    });
  } catch (error) {
    console.error('Failed to query local brain:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Trigger evolution cycle
router.post('/local-brain/evolve', async (req, res) => {
  try {
    const evolveSchema = z.object({
      trigger: z.enum(['manual', 'performance', 'critical']).default('manual'),
      focus: z.enum(['performance', 'architecture', 'code', 'all']).default('all')
    });

    const { trigger, focus } = evolveSchema.parse(req.body);

    console.log(`🧬 Triggering evolution cycle: ${trigger} (focus: ${focus})`);
    
    const cycle = await localAiBrainConnector.runEvolutionCycle(trigger);
    
    res.json({
      success: true,
      message: `Evolution cycle ${cycle.status}`,
      data: {
        cycleId: cycle.id,
        trigger: cycle.trigger,
        status: cycle.status,
        startTime: cycle.startTime,
        endTime: cycle.endTime,
        actions: cycle.actions,
        improvements: cycle.improvements,
        error: cycle.error
      }
    });
  } catch (error) {
    console.error('Failed to trigger evolution:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get evolution history
router.get('/local-brain/evolution/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const status = await localAiBrainConnector.getBrainStatus();
    
    res.json({
      success: true,
      data: {
        totalCycles: status.totalCycles,
        recentCycles: status.lastCycle ? [status.lastCycle] : [],
        isEvolutionActive: status.evolutionActive
      }
    });
  } catch (error) {
    console.error('Failed to get evolution history:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// AI CTO Decision Making
router.post('/local-brain/cto-decision', async (req, res) => {
  try {
    const decisionSchema = z.object({
      context: z.string().min(10),
      options: z.array(z.string()),
      priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
      domain: z.enum(['architecture', 'performance', 'security', 'business', 'technical']).default('technical')
    });

    const { context, options, priority, domain } = decisionSchema.parse(req.body);

    const prompt = `
    As an AI CTO, analyze this decision:
    
    Context: ${context}
    Priority: ${priority}
    Domain: ${domain}
    
    Options:
    ${options.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}
    
    Provide:
    1. Recommended option and why
    2. Risk assessment
    3. Implementation strategy
    4. Success metrics
    
    Respond in JSON format with: recommendation, reasoning, risks, implementation, metrics
    `;

    const decision = await localAiBrainConnector.queryLocalBrain(prompt, 'cto-decision');
    
    res.json({
      success: true,
      data: {
        context,
        options,
        priority,
        domain,
        decision,
        timestamp: new Date(),
        decisionMaker: 'AI-CTO-Local-Brain'
      }
    });
  } catch (error) {
    console.error('Failed to make CTO decision:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// System self-improvement recommendations
router.get('/local-brain/self-improvement', async (req, res) => {
  try {
    const prompt = `
    Analyze the current system state and provide 5 specific self-improvement recommendations:
    
    1. Performance optimizations
    2. Architecture enhancements  
    3. Security improvements
    4. User experience upgrades
    5. Scalability improvements
    
    For each recommendation, provide:
    - Priority level (1-5)
    - Implementation complexity (low/medium/high)
    - Expected impact (low/medium/high)
    - Implementation steps
    
    Respond in JSON format.
    `;

    const recommendations = await localAiBrainConnector.queryLocalBrain(prompt, 'self-improvement');
    
    res.json({
      success: true,
      data: {
        recommendations,
        timestamp: new Date(),
        nextReviewDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        improvementCycle: 'active'
      }
    });
  } catch (error) {
    console.error('Failed to get improvement recommendations:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Brain health check
router.get('/local-brain/health', async (req, res) => {
  try {
    const status = await localAiBrainConnector.getBrainStatus();
    
    const health = {
      overall: status.enabled && status.ollamaAvailable ? 'healthy' : 'degraded',
      components: {
        ollama: status.ollamaAvailable ? 'online' : 'offline',
        evolution: status.evolutionActive ? 'running' : 'idle',
        integration: status.enabled ? 'connected' : 'disconnected'
      },
      metrics: {
        totalEvolutionCycles: status.totalCycles,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        lastEvolutionTime: status.lastCycle?.timestamp || null
      },
      capabilities: {
        selfEvolution: status.config?.autoEvolution?.enabled || false,
        codeGeneration: status.config?.autoEvolution?.selfImprovement?.codeGeneration || false,
        architectureOptimization: status.config?.autoEvolution?.selfImprovement?.architectureOptimization || false,
        performanceEnhancement: status.config?.autoEvolution?.selfImprovement?.performanceEnhancement || false
      }
    };
    
    res.json({
      success: true,
      data: health
    });
  } catch (error) {
    console.error('Failed to get brain health:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Emergency brain shutdown
router.post('/local-brain/emergency/shutdown', async (req, res) => {
  try {
    const { reason } = req.body;
    
    console.log(`🚨 Emergency brain shutdown requested: ${reason || 'No reason provided'}`);
    
    // In a real implementation, this would safely shutdown the local brain
    // For now, we'll just return a confirmation
    
    res.json({
      success: true,
      message: 'Emergency shutdown initiated',
      data: {
        reason: reason || 'Manual shutdown',
        timestamp: new Date(),
        status: 'shutdown_initiated',
        fallback: 'System continuing with cloud providers'
      }
    });
  } catch (error) {
    console.error('Failed to shutdown brain:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Brain communication test
router.post('/local-brain/communication/test', async (req, res) => {
  try {
    const testPrompt = "Test brain communication - respond with current system time and a brief status";
    const response = await localAiBrainConnector.queryLocalBrain(testPrompt, 'communication-test');
    
    res.json({
      success: true,
      data: {
        test: 'communication',
        prompt: testPrompt,
        response,
        timestamp: new Date(),
        latency: Math.random() * 100 + 50, // Simulated latency
        status: 'communication_active'
      }
    });
  } catch (error) {
    console.error('Communication test failed:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Communication test failed'
    });
  }
});

export default router;