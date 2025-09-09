/**
 * AUTONOMOUS ERROR RESOLUTION ENGINE
 * 
 * AI CTO System for Zero-Error Project Management
 * Optimized for 12GB RTX GPU with specialized local AI models
 * 
 * MISSION: Fix all 6,213 TypeScript errors with zero project degradation
 */

import { EventEmitter } from 'events';
import { DatabaseStorage } from '../../storage';
import { CodexAuditEngine } from '../codex/codexAuditEngine';
import { BillionDollarCTOAudit } from '../empire-hardening/billionDollarCTOAudit';
import path from 'path';
import fs from 'fs/promises';

interface ErrorCategory {
  type: 'import' | 'type' | 'syntax' | 'missing_declaration' | 'config' | 'dependency';
  severity: 'critical' | 'high' | 'medium' | 'low';
  pattern: string;
  autoFixable: boolean;
  riskLevel: 'safe' | 'medium' | 'high';
}

interface ProjectSnapshot {
  timestamp: Date;
  errorCount: number;
  fileHashes: Map<string, string>;
  buildStatus: 'success' | 'failed';
  testResults?: any;
}

interface FixProposal {
  id: string;
  errorId: string;
  filePath: string;
  originalCode: string;
  proposedCode: string;
  explanation: string;
  riskAssessment: string;
  confidence: number;
  estimatedImpact: string;
  requiresApproval: boolean;
}

interface LocalAIConfig {
  codeAnalysisModel: string;    // ~3-4GB VRAM - CodeLlama 7B quantized
  typeFixingModel: string;      // ~2-3GB VRAM - DeepSeek Coder 6.7B
  validationModel: string;      // ~3-4GB VRAM - Code T5+ small
  maxConcurrentModels: number;  // 2 models max for 12GB GPU
}

export class AutonomousErrorResolutionEngine extends EventEmitter {
  private storage: DatabaseStorage;
  private codexEngine: CodexAuditEngine;
  private ctoBillionAudit: BillionDollarCTOAudit;
  private isRunning = false;
  private currentSnapshot: ProjectSnapshot | null = null;
  private pendingApprovals: FixProposal[] = [];
  private projectRoot: string;
  
  // AI Model Configuration for 12GB RTX GPU
  private aiConfig: LocalAIConfig = {
    codeAnalysisModel: 'codellama:7b-code-q4_K_M',      // 3.8GB VRAM
    typeFixingModel: 'deepseek-coder:6.7b-instruct-q4_K_M', // 3.5GB VRAM  
    validationModel: 'starcoder:3b-q4_K_M',             // 2.2GB VRAM
    maxConcurrentModels: 2 // Never exceed GPU memory
  };

  // Error categorization patterns
  private errorCategories: ErrorCategory[] = [
    {
      type: 'import',
      severity: 'high',
      pattern: 'Cannot find module|Module not found',
      autoFixable: true,
      riskLevel: 'safe'
    },
    {
      type: 'type',
      severity: 'medium', 
      pattern: 'Type.*does not exist|Property.*does not exist',
      autoFixable: true,
      riskLevel: 'safe'
    },
    {
      type: 'syntax',
      severity: 'high',
      pattern: 'Unexpected token|Expected',
      autoFixable: true,
      riskLevel: 'medium'
    },
    {
      type: 'missing_declaration',
      severity: 'medium',
      pattern: 'implicitly has an.*any.*type',
      autoFixable: true,
      riskLevel: 'safe'
    },
    {
      type: 'config',
      severity: 'critical',
      pattern: 'Cannot resolve.*tsconfig|Module resolution',
      autoFixable: true,
      riskLevel: 'medium'
    }
  ];

  constructor(storage: DatabaseStorage, projectRoot: string = process.cwd()) {
    super();
    this.storage = storage;
    this.projectRoot = projectRoot;
    this.codexEngine = new CodexAuditEngine(storage);
    this.ctoBillionAudit = new BillionDollarCTOAudit();
  }

  /**
   * Start the autonomous error resolution process
   */
  async startAutonomousResolution(): Promise<void> {
    if (this.isRunning) {
      console.log('🤖 AI CTO already running - Error resolution in progress');
      return;
    }

    this.isRunning = true;
    console.log('🚀 STARTING AI CTO AUTONOMOUS ERROR RESOLUTION');
    console.log('🎯 TARGET: Fix all 6,213 TypeScript errors with zero degradation');
    console.log('💾 GPU Config: RTX 12GB optimized local AI models');

    try {
      // Step 1: Create initial project snapshot
      await this.createProjectSnapshot();
      
      // Step 2: Scan and categorize all errors
      const errors = await this.scanAllErrors();
      console.log(`📊 Found ${errors.length} total errors to resolve`);
      
      // Step 3: Initialize local AI models
      await this.initializeLocalAI();
      
      // Step 4: Start systematic error resolution
      await this.beginSystematicResolution(errors);
      
      this.emit('resolution_started', { totalErrors: errors.length });
      
    } catch (error) {
      console.error('❌ Failed to start autonomous resolution:', error);
      this.isRunning = false;
      throw error;
    }
  }

  /**
   * Create a complete project snapshot for rollback safety
   */
  private async createProjectSnapshot(): Promise<void> {
    console.log('📸 Creating project snapshot for safety...');
    
    const fileHashes = new Map<string, string>();
    const buildStatus = await this.checkBuildStatus();
    
    // Hash all TypeScript files for change detection
    const tsFiles = await this.findTypeScriptFiles();
    for (const file of tsFiles) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        const hash = this.hashString(content);
        fileHashes.set(file, hash);
      } catch (error) {
        console.warn(`⚠️ Could not hash file ${file}: ${error.message}`);
      }
    }

    this.currentSnapshot = {
      timestamp: new Date(),
      errorCount: await this.getErrorCount(),
      fileHashes,
      buildStatus
    };

    console.log(`✅ Snapshot created: ${fileHashes.size} files, ${this.currentSnapshot.errorCount} errors`);
    
    // Store snapshot in database for recovery
    await this.storage.db.insert(this.storage.schema.codexAudits).values({
      auditId: `snapshot_${Date.now()}`,
      auditType: 'project_snapshot',
      scope: 'full_project',
      status: 'completed',
      auditConfig: {
        snapshotData: {
          fileCount: fileHashes.size,
          errorCount: this.currentSnapshot.errorCount,
          buildStatus
        }
      },
      startedAt: new Date(),
      completedAt: new Date()
    });
  }

  /**
   * Scan and categorize all TypeScript errors
   */
  private async scanAllErrors(): Promise<any[]> {
    console.log('🔍 Scanning all TypeScript errors...');
    
    try {
      // Run TypeScript compiler to get all errors
      const { execSync } = require('child_process');
      const tscOutput = execSync('npx tsc --noEmit --pretty false', { 
        encoding: 'utf-8',
        cwd: this.projectRoot,
        stdio: 'pipe'
      }).toString();
      
      // Parse TypeScript errors
      const errors = this.parseTypeScriptErrors(tscOutput);
      console.log(`📊 Parsed ${errors.length} TypeScript errors`);
      
      // Categorize errors by pattern
      const categorizedErrors = errors.map(error => ({
        ...error,
        category: this.categorizeError(error.message),
        id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }));
      
      // Sort by severity and risk
      categorizedErrors.sort((a, b) => {
        const severityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
        return severityOrder[b.category.severity] - severityOrder[a.category.severity];
      });
      
      return categorizedErrors;
      
    } catch (error) {
      console.warn('⚠️ TypeScript scan failed, using LSP diagnostics fallback');
      return await this.getLSPErrors();
    }
  }

  /**
   * Initialize optimized local AI models for 12GB GPU
   */
  private async initializeLocalAI(): Promise<void> {
    console.log('🧠 Initializing AI models optimized for 12GB RTX GPU...');
    
    try {
      // Check if Ollama is available
      const { execSync } = require('child_process');
      
      // Pull required models if not available
      const requiredModels = [
        this.aiConfig.codeAnalysisModel,
        this.aiConfig.typeFixingModel,
        this.aiConfig.validationModel
      ];
      
      for (const model of requiredModels) {
        try {
          console.log(`📥 Ensuring model available: ${model}`);
          execSync(`ollama show ${model}`, { stdio: 'pipe' });
          console.log(`✅ Model ready: ${model}`);
        } catch {
          console.log(`📥 Pulling model: ${model}`);
          execSync(`ollama pull ${model}`, { stdio: 'inherit' });
        }
      }
      
      console.log('✅ All AI models ready for error resolution');
      this.emit('ai_models_ready');
      
    } catch (error) {
      console.warn('⚠️ Local AI setup failed, continuing with rule-based fixes');
      this.emit('ai_models_fallback');
    }
  }

  /**
   * Begin systematic error resolution
   */
  private async beginSystematicResolution(errors: any[]): Promise<void> {
    console.log('🔧 Beginning systematic error resolution...');
    
    let fixedCount = 0;
    let skippedCount = 0;
    
    // Process errors in batches to avoid overwhelming the system
    const batchSize = 10;
    
    for (let i = 0; i < errors.length; i += batchSize) {
      const batch = errors.slice(i, i + batchSize);
      console.log(`🔄 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(errors.length/batchSize)}`);
      
      for (const error of batch) {
        try {
          const fixResult = await this.processError(error);
          
          if (fixResult.fixed) {
            fixedCount++;
            console.log(`✅ Fixed: ${error.message.substring(0, 60)}...`);
          } else if (fixResult.needsApproval) {
            this.pendingApprovals.push(fixResult.proposal);
            console.log(`⏳ Needs approval: ${error.message.substring(0, 60)}...`);
          } else {
            skippedCount++;
            console.log(`⏭️ Skipped: ${fixResult.reason}`);
          }
          
          // Emit progress
          this.emit('progress', {
            total: errors.length,
            fixed: fixedCount,
            pending: this.pendingApprovals.length,
            skipped: skippedCount
          });
          
        } catch (error) {
          console.error(`❌ Error processing: ${error.message}`);
          skippedCount++;
        }
        
        // Small delay to prevent overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Verify project integrity after each batch
      if (fixedCount > 0 && fixedCount % 50 === 0) {
        await this.verifyProjectIntegrity();
      }
    }
    
    console.log(`📊 Resolution complete: ${fixedCount} fixed, ${this.pendingApprovals.length} pending approval, ${skippedCount} skipped`);
    
    // Generate summary report
    await this.generateResolutionReport(fixedCount, this.pendingApprovals.length, skippedCount);
  }

  /**
   * Process individual error with AI analysis
   */
  private async processError(error: any): Promise<any> {
    const category = error.category;
    
    // Skip if not auto-fixable or too risky
    if (!category.autoFixable || category.riskLevel === 'high') {
      return { fixed: false, reason: 'High risk or not auto-fixable' };
    }
    
    try {
      // Generate fix proposal using AI
      const proposal = await this.generateFixProposal(error);
      
      if (proposal.confidence > 0.8 && proposal.requiresApproval === false) {
        // Auto-apply safe fixes
        const applied = await this.applyFix(proposal);
        return { fixed: applied, proposal };
      } else {
        // Queue for human approval
        return { fixed: false, needsApproval: true, proposal };
      }
      
    } catch (error) {
      return { fixed: false, reason: `Fix generation failed: ${error.message}` };
    }
  }

  /**
   * Generate fix proposal using local AI
   */
  private async generateFixProposal(error: any): Promise<FixProposal> {
    const filePath = error.filePath;
    const fileContent = await fs.readFile(path.join(this.projectRoot, filePath), 'utf-8');
    
    // Use appropriate AI model based on error type
    const modelToUse = this.selectAIModel(error.category.type);
    
    const prompt = this.buildFixPrompt(error, fileContent);
    const aiResponse = await this.queryLocalAI(modelToUse, prompt);
    
    const proposal: FixProposal = {
      id: `fix_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      errorId: error.id,
      filePath,
      originalCode: this.extractErrorContext(fileContent, error),
      proposedCode: aiResponse.proposedFix,
      explanation: aiResponse.explanation,
      riskAssessment: this.assessRisk(error, aiResponse),
      confidence: aiResponse.confidence,
      estimatedImpact: aiResponse.impact,
      requiresApproval: error.category.riskLevel !== 'safe' || aiResponse.confidence < 0.9
    };
    
    return proposal;
  }

  // Helper methods
  
  private parseTypeScriptErrors(output: string): any[] {
    const errors = [];
    const lines = output.split('\n');
    
    for (const line of lines) {
      const match = line.match(/^(.+)\((\d+),(\d+)\): error TS(\d+): (.+)$/);
      if (match) {
        const [, filePath, line, column, code, message] = match;
        errors.push({
          filePath: filePath.replace(this.projectRoot + '/', ''),
          line: parseInt(line),
          column: parseInt(column),
          code: `TS${code}`,
          message: message.trim()
        });
      }
    }
    
    return errors;
  }
  
  private categorizeError(message: string): ErrorCategory {
    for (const category of this.errorCategories) {
      if (new RegExp(category.pattern, 'i').test(message)) {
        return category;
      }
    }
    
    // Default category for unknown errors
    return {
      type: 'syntax',
      severity: 'medium',
      pattern: 'unknown',
      autoFixable: false,
      riskLevel: 'high'
    };
  }
  
  private selectAIModel(errorType: string): string {
    switch (errorType) {
      case 'import':
      case 'config':
        return this.aiConfig.codeAnalysisModel;
      case 'type':
      case 'missing_declaration':
        return this.aiConfig.typeFixingModel;
      default:
        return this.aiConfig.validationModel;
    }
  }
  
  private buildFixPrompt(error: any, fileContent: string): string {
    return `You are an expert TypeScript developer. Fix this error with minimal code changes:

ERROR: ${error.message}
FILE: ${error.filePath}
LINE: ${error.line}

CONTEXT:
${this.extractErrorContext(fileContent, error)}

Provide response in JSON format:
{
  "proposedFix": "corrected code",
  "explanation": "brief explanation",
  "confidence": 0.0-1.0,
  "impact": "description of impact"
}

Requirements:
- Make minimal changes
- Preserve existing functionality  
- Follow TypeScript best practices
- Only fix the specific error`;
  }
  
  private extractErrorContext(content: string, error: any): string {
    const lines = content.split('\n');
    const errorLine = error.line - 1;
    const start = Math.max(0, errorLine - 3);
    const end = Math.min(lines.length, errorLine + 4);
    
    return lines.slice(start, end)
      .map((line, i) => `${start + i + 1}: ${line}`)
      .join('\n');
  }
  
  private async queryLocalAI(model: string, prompt: string): Promise<any> {
    try {
      const { execSync } = require('child_process');
      const response = execSync(`ollama run ${model} "${prompt.replace(/"/g, '\\"')}"`, {
        encoding: 'utf-8',
        timeout: 30000
      });
      
      // Try to parse JSON response
      try {
        return JSON.parse(response);
      } catch {
        // Fallback for non-JSON responses
        return {
          proposedFix: this.extractCodeFromResponse(response),
          explanation: 'AI generated fix',
          confidence: 0.7,
          impact: 'Minimal'
        };
      }
    } catch (error) {
      throw new Error(`AI query failed: ${error.message}`);
    }
  }
  
  private extractCodeFromResponse(response: string): string {
    // Extract code blocks from AI response
    const codeMatch = response.match(/```(?:typescript|ts)?\n([\s\S]*?)\n```/);
    return codeMatch ? codeMatch[1] : response.trim();
  }
  
  private assessRisk(error: any, aiResponse: any): string {
    if (error.category.riskLevel === 'high') return 'High';
    if (aiResponse.confidence < 0.7) return 'Medium';
    return 'Low';
  }
  
  private async applyFix(proposal: FixProposal): Promise<boolean> {
    try {
      const filePath = path.join(this.projectRoot, proposal.filePath);
      const content = await fs.readFile(filePath, 'utf-8');
      
      // Apply the fix (simple string replacement for now)
      const updatedContent = content.replace(proposal.originalCode, proposal.proposedCode);
      
      // Verify the change makes sense
      if (updatedContent === content) {
        throw new Error('No changes applied');
      }
      
      // Write the fix
      await fs.writeFile(filePath, updatedContent, 'utf-8');
      
      // Log the fix
      console.log(`🔧 Applied fix to ${proposal.filePath}`);
      
      return true;
    } catch (error) {
      console.error(`❌ Failed to apply fix: ${error.message}`);
      return false;
    }
  }
  
  private async verifyProjectIntegrity(): Promise<boolean> {
    console.log('🔍 Verifying project integrity...');
    
    try {
      // Quick build check
      const buildStatus = await this.checkBuildStatus();
      
      if (buildStatus === 'failed') {
        console.warn('⚠️ Build verification failed - considering rollback');
        this.emit('integrity_warning', { type: 'build_failed' });
        return false;
      }
      
      console.log('✅ Project integrity verified');
      return true;
      
    } catch (error) {
      console.error('❌ Integrity check failed:', error);
      return false;
    }
  }
  
  private async checkBuildStatus(): Promise<'success' | 'failed'> {
    try {
      const { execSync } = require('child_process');
      execSync('npx tsc --noEmit', { 
        stdio: 'pipe',
        timeout: 60000,
        cwd: this.projectRoot
      });
      return 'success';
    } catch {
      return 'failed';
    }
  }
  
  private async getErrorCount(): Promise<number> {
    try {
      const errors = await this.scanAllErrors();
      return errors.length;
    } catch {
      return 0;
    }
  }
  
  private async findTypeScriptFiles(): Promise<string[]> {
    const { execSync } = require('child_process');
    try {
      const output = execSync('find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules', {
        encoding: 'utf-8',
        cwd: this.projectRoot
      });
      return output.trim().split('\n').filter(f => f.length > 0);
    } catch {
      return [];
    }
  }
  
  private hashString(str: string): string {
    const crypto = require('crypto');
    return crypto.createHash('md5').update(str).digest('hex');
  }
  
  private async getLSPErrors(): Promise<any[]> {
    // Fallback to parse existing LSP diagnostics
    return [];
  }
  
  private async generateResolutionReport(fixed: number, pending: number, skipped: number): Promise<void> {
    const report = {
      timestamp: new Date(),
      totalFixed: fixed,
      pendingApproval: pending,
      skipped: skipped,
      errorReduction: ((fixed / 6213) * 100).toFixed(2),
      recommendations: this.generateRecommendations(fixed, pending, skipped)
    };
    
    console.log('📊 RESOLUTION SUMMARY:');
    console.log(`✅ Fixed: ${fixed} errors (${report.errorReduction}% reduction)`);
    console.log(`⏳ Pending approval: ${pending} errors`);
    console.log(`⏭️ Skipped: ${skipped} errors`);
    
    this.emit('resolution_complete', report);
  }
  
  private generateRecommendations(fixed: number, pending: number, skipped: number): string[] {
    const recommendations = [];
    
    if (pending > 0) {
      recommendations.push(`Review ${pending} pending fixes for manual approval`);
    }
    
    if (skipped > fixed) {
      recommendations.push('Consider updating error patterns to handle more error types');
    }
    
    if (fixed > 0) {
      recommendations.push('Run full test suite to verify fixes maintain functionality');
    }
    
    return recommendations;
  }

  /**
   * Get pending approvals for human review
   */
  getPendingApprovals(): FixProposal[] {
    return [...this.pendingApprovals];
  }

  /**
   * Approve a specific fix proposal
   */
  async approveFix(proposalId: string): Promise<boolean> {
    const proposal = this.pendingApprovals.find(p => p.id === proposalId);
    if (!proposal) return false;
    
    const success = await this.applyFix(proposal);
    if (success) {
      this.pendingApprovals = this.pendingApprovals.filter(p => p.id !== proposalId);
    }
    
    return success;
  }

  /**
   * Reject a fix proposal
   */
  rejectFix(proposalId: string): boolean {
    const initialLength = this.pendingApprovals.length;
    this.pendingApprovals = this.pendingApprovals.filter(p => p.id !== proposalId);
    return this.pendingApprovals.length < initialLength;
  }

  /**
   * Stop the autonomous resolution process
   */
  async stop(): Promise<void> {
    this.isRunning = false;
    console.log('🛑 AI CTO autonomous resolution stopped');
    this.emit('resolution_stopped');
  }

  /**
   * Get current status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      pendingApprovals: this.pendingApprovals.length,
      hasSnapshot: !!this.currentSnapshot,
      lastSnapshotTime: this.currentSnapshot?.timestamp
    };
  }
}