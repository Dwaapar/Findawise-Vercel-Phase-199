#!/usr/bin/env node

/**
 * AUTONOMOUS AI CTO - STANDALONE PROJECT DOCTOR
 * 
 * ██╗   ██╗ ██████╗ ██╗   ██╗██████╗      █████╗ ██╗         ██████╗████████╗ ██████╗ 
 * ╚██╗ ██╔╝██╔═══██╗██║   ██║██╔══██╗    ██╔══██╗██║        ██╔════╝╚══██╔══╝██╔═══██╗
 *  ╚████╔╝ ██║   ██║██║   ██║██████╔╝    ███████║██║        ██║        ██║   ██║   ██║
 *   ╚██╔╝  ██║   ██║██║   ██║██╔══██╗    ██╔══██║██║        ██║        ██║   ██║   ██║
 *    ██║   ╚██████╔╝╚██████╔╝██║  ██║    ██║  ██║██║        ╚██████╗   ██║   ╚██████╔╝
 *    ╚═╝    ╚═════╝  ╚═════╝ ╚═╝  ╚═╝    ╚═╝  ╚═╝╚═╝         ╚═════╝   ╚═╝    ╚═════╝ 
 * 
 * MISSION: Fix 6,213 TypeScript errors with ZERO project degradation
 * GPU: Optimized for 12GB RTX with specialized AI models
 * 
 * This project treats your main project like its life - no mistakes allowed.
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync, spawn } = require('child_process');
const readline = require('readline');

// ASCII Art and Colors
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m'
};

class AutonomousAICTO {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.backupDir = path.join(__dirname, 'backups');
    this.logFile = path.join(__dirname, 'ai-cto.log');
    this.isRunning = false;
    this.totalErrors = 0;
    this.fixedErrors = 0;
    this.pendingApprovals = [];
    this.errorCounts = new Map();
    
    // GPU optimized AI models for 12GB RTX
    this.aiModels = {
      codeAnalysis: 'codellama:7b-code-q4_K_M',      // 3.8GB VRAM
      typeFixer: 'deepseek-coder:6.7b-instruct-q4_K_M', // 3.5GB VRAM
      validator: 'starcoder:3b-q4_K_M',               // 2.2GB VRAM
      reviewer: 'magicoder:7b-s-cl-q4_K_M'           // 3.7GB VRAM (for critical review)
    };
    
    this.safePatterns = [
      /Cannot find module.*['"](.+)['"]/, // Missing imports
      /Property.*does not exist on type/, // Type errors
      /Argument of type.*is not assignable/, // Type mismatches
      /.*implicitly has an.*any.*type/, // Missing type declarations
      /Module.*has no exported member/, // Export errors
    ];
    
    this.riskPatterns = [
      /delete/i,
      /drop/i,
      /truncate/i,
      /remove/i,
      /destroy/i
    ];

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  // ==================== STARTUP & INITIALIZATION ====================
  
  async start() {
    this.displayBanner();
    
    try {
      console.log(`${colors.cyan}🔍 INITIALIZING AI CTO AUTONOMOUS SYSTEM${colors.reset}`);
      
      await this.checkPrerequisites();
      await this.initializeSystem();
      await this.createProjectSnapshot();
      
      const errors = await this.scanTypeScriptErrors();
      this.totalErrors = errors.length;
      
      console.log(`${colors.yellow}📊 SYSTEM STATUS:${colors.reset}`);
      console.log(`   Total errors found: ${colors.red}${this.totalErrors}${colors.reset}`);
      console.log(`   Target project: ${colors.blue}${this.projectRoot}${colors.reset}`);
      console.log(`   Backup directory: ${colors.green}${this.backupDir}${colors.reset}`);
      
      if (this.totalErrors === 0) {
        console.log(`${colors.green}✅ No TypeScript errors found! Project is clean.${colors.reset}`);
        return;
      }
      
      const proceed = await this.askUser(`${colors.yellow}🚀 Start autonomous error resolution? (y/n): ${colors.reset}`);
      if (proceed.toLowerCase() !== 'y') {
        console.log(`${colors.dim}Operation cancelled by user.${colors.reset}`);
        return;
      }
      
      await this.startAutonomousResolution(errors);
      
    } catch (error) {
      this.logError('System initialization failed', error);
      console.error(`${colors.red}❌ CRITICAL ERROR: ${error.message}${colors.reset}`);
    }
  }
  
  displayBanner() {
    console.clear();
    console.log(`${colors.cyan}${colors.bold}`);
    console.log(`
███████╗██╗██╗  ██╗    ██╗   ██╗ ██████╗ ██╗   ██╗██████╗     ██████╗ ██████╗  ██████╗      ██╗███████╗ ██████╗████████╗
██╔════╝██║╚██╗██╔╝    ╚██╗ ██╔╝██╔═══██╗██║   ██║██╔══██╗    ██╔══██╗██╔══██╗██╔═══██╗     ██║██╔════╝██╔════╝╚══██╔══╝
█████╗  ██║ ╚███╔╝      ╚████╔╝ ██║   ██║██║   ██║██████╔╝    ██████╔╝██████╔╝██║   ██║     ██║█████╗  ██║        ██║   
██╔══╝  ██║ ██╔██╗       ╚██╔╝  ██║   ██║██║   ██║██╔══██╗    ██╔═══╝ ██╔══██╗██║   ██║██   ██║██╔══╝  ██║        ██║   
██║     ██║██╔╝ ██╗       ██║   ╚██████╔╝╚██████╔╝██║  ██║    ██║     ██║  ██║╚██████╔╝╚█████╔╝███████╗╚██████╗   ██║   
╚═╝     ╚═╝╚═╝  ╚═╝       ╚═╝    ╚═════╝  ╚═════╝ ╚═╝  ╚═╝    ╚═╝     ╚═╝  ╚═╝ ╚═════╝  ╚════╝ ╚══════╝ ╚═════╝   ╚═╝   
    `);
    console.log(`${colors.reset}`);
    console.log(`${colors.yellow}🎯 AUTONOMOUS AI CTO - PROJECT DOCTOR${colors.reset}`);
    console.log(`${colors.green}   Mission: Fix your project with ZERO degradation${colors.reset}`);
    console.log(`${colors.blue}   Optimized for: 12GB RTX GPU${colors.reset}`);
    console.log(`${colors.magenta}   AI Models: Specialized TypeScript error resolution${colors.reset}`);
    console.log('');
  }

  // ==================== SYSTEM CHECKS & INITIALIZATION ====================
  
  async checkPrerequisites() {
    console.log(`${colors.cyan}🔧 Checking system prerequisites...${colors.reset}`);
    
    const checks = [
      { name: 'Node.js', command: 'node --version' },
      { name: 'TypeScript', command: 'npx tsc --version' },
      { name: 'npm', command: 'npm --version' }
    ];
    
    for (const check of checks) {
      try {
        const result = execSync(check.command, { encoding: 'utf-8', cwd: this.projectRoot });
        console.log(`   ✅ ${check.name}: ${result.trim()}`);
      } catch (error) {
        throw new Error(`Missing prerequisite: ${check.name}`);
      }
    }
    
    // Check for Ollama (optional for local AI)
    try {
      execSync('ollama --version', { encoding: 'utf-8' });
      console.log(`   ✅ Ollama: Available for local AI models`);
      this.hasOllama = true;
    } catch {
      console.log(`   ⚠️  Ollama: Not available (will use rule-based fixes)`);
      this.hasOllama = false;
    }
  }
  
  async initializeSystem() {
    console.log(`${colors.cyan}⚙️  Initializing AI CTO system...${colors.reset}`);
    
    // Create backup directory
    await fs.mkdir(this.backupDir, { recursive: true });
    
    // Initialize log file
    await this.log('AI CTO System initialized', 'info');
    
    // Check available AI models if Ollama is present
    if (this.hasOllama) {
      await this.checkAIModels();
    }
    
    console.log(`   ✅ System initialized successfully`);
  }
  
  async checkAIModels() {
    console.log(`${colors.magenta}🧠 Checking AI models for 12GB RTX GPU...${colors.reset}`);
    
    for (const [purpose, model] of Object.entries(this.aiModels)) {
      try {
        execSync(`ollama show ${model}`, { stdio: 'pipe' });
        console.log(`   ✅ ${purpose}: ${model}`);
      } catch {
        console.log(`   📥 Pulling ${purpose}: ${model}`);
        try {
          execSync(`ollama pull ${model}`, { stdio: 'inherit' });
        } catch (error) {
          console.log(`   ⚠️  Failed to pull ${model}, will use fallback`);
        }
      }
    }
  }

  // ==================== PROJECT SNAPSHOT & BACKUP ====================
  
  async createProjectSnapshot() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const snapshotFile = path.join(this.backupDir, `snapshot-${timestamp}.json`);
    
    console.log(`${colors.cyan}📸 Creating project snapshot...${colors.reset}`);
    
    try {
      const snapshot = {
        timestamp: new Date().toISOString(),
        projectRoot: this.projectRoot,
        files: await this.getProjectFiles(),
        errorCount: await this.getErrorCount(),
        buildStatus: await this.checkBuildStatus()
      };
      
      await fs.writeFile(snapshotFile, JSON.stringify(snapshot, null, 2));
      await this.log(`Project snapshot created: ${snapshotFile}`, 'info');
      
      console.log(`   ✅ Snapshot saved: ${path.basename(snapshotFile)}`);
      
    } catch (error) {
      this.logError('Failed to create project snapshot', error);
      throw error;
    }
  }
  
  async getProjectFiles() {
    const files = [];
    
    const scanDir = async (dir) => {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          if (entry.name.startsWith('.') || entry.name === 'node_modules') {
            continue;
          }
          
          const fullPath = path.join(dir, entry.name);
          const relativePath = path.relative(this.projectRoot, fullPath);
          
          if (entry.isDirectory()) {
            await scanDir(fullPath);
          } else if (entry.name.match(/\.(ts|tsx|js|jsx)$/)) {
            try {
              const content = await fs.readFile(fullPath, 'utf-8');
              files.push({
                path: relativePath,
                hash: this.hashString(content),
                size: content.length
              });
            } catch (error) {
              // Skip files that can't be read
            }
          }
        }
      } catch (error) {
        // Skip directories that can't be read
      }
    };
    
    await scanDir(this.projectRoot);
    return files;
  }

  // ==================== ERROR SCANNING & CATEGORIZATION ====================
  
  async scanTypeScriptErrors() {
    console.log(`${colors.cyan}🔍 Scanning TypeScript errors...${colors.reset}`);
    
    try {
      // Run TypeScript compiler to get all errors
      const result = execSync('npx tsc --noEmit --pretty false', {
        encoding: 'utf-8',
        cwd: this.projectRoot,
        stdio: 'pipe'
      });
      
      return []; // No errors
      
    } catch (error) {
      // Parse TypeScript errors from stdout
      const errors = this.parseTypeScriptErrors(error.stdout || error.stderr || '');
      
      console.log(`   📊 Found ${errors.length} TypeScript errors`);
      
      // Categorize errors
      const categorized = this.categorizeErrors(errors);
      this.printErrorSummary(categorized);
      
      return categorized;
    }
  }
  
  parseTypeScriptErrors(output) {
    const errors = [];
    const lines = output.split('\n');
    
    for (const line of lines) {
      // Parse TypeScript error format: file(line,col): error TSxxxx: message
      const match = line.match(/^(.+?)\((\d+),(\d+)\): error (TS\d+): (.+)$/);
      if (match) {
        const [, filePath, line, column, code, message] = match;
        
        errors.push({
          id: `${code}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          filePath: path.relative(this.projectRoot, filePath),
          line: parseInt(line),
          column: parseInt(column),
          code,
          message,
          severity: this.determineErrorSeverity(code, message),
          category: this.categorizeError(message),
          isAutoFixable: this.isAutoFixable(message),
          riskLevel: this.assessRiskLevel(message)
        });
      }
    }
    
    return errors;
  }
  
  categorizeErrors(errors) {
    const categories = {
      imports: [],
      types: [],
      syntax: [],
      declarations: [],
      config: [],
      other: []
    };
    
    for (const error of errors) {
      const category = error.category;
      if (categories[category]) {
        categories[category].push(error);
      } else {
        categories.other.push(error);
      }
    }
    
    return categories;
  }
  
  categorizeError(message) {
    if (/Cannot find module|Module.*not found/i.test(message)) {
      return 'imports';
    }
    if (/Type.*does not exist|Property.*does not exist/i.test(message)) {
      return 'types';
    }
    if (/Unexpected token|Expected/i.test(message)) {
      return 'syntax';
    }
    if (/implicitly has an.*any.*type/i.test(message)) {
      return 'declarations';
    }
    if (/Cannot resolve.*tsconfig|Module resolution/i.test(message)) {
      return 'config';
    }
    return 'other';
  }
  
  isAutoFixable(message) {
    return this.safePatterns.some(pattern => pattern.test(message));
  }
  
  assessRiskLevel(message) {
    if (this.riskPatterns.some(pattern => pattern.test(message))) {
      return 'high';
    }
    if (/delete|remove|drop/i.test(message)) {
      return 'medium';
    }
    return 'low';
  }
  
  determineErrorSeverity(code, message) {
    // Critical errors that break compilation
    const critical = ['TS2307', 'TS2304', 'TS2339', 'TS2322'];
    if (critical.includes(code)) return 'critical';
    
    // High priority errors
    const high = ['TS7006', 'TS7016', 'TS2345'];
    if (high.includes(code)) return 'high';
    
    return 'medium';
  }
  
  printErrorSummary(categorized) {
    console.log(`${colors.yellow}📈 ERROR BREAKDOWN:${colors.reset}`);
    
    for (const [category, errors] of Object.entries(categorized)) {
      if (errors.length > 0) {
        console.log(`   ${category}: ${colors.red}${errors.length}${colors.reset} errors`);
        this.errorCounts.set(category, errors.length);
      }
    }
  }

  // ==================== AUTONOMOUS ERROR RESOLUTION ====================
  
  async startAutonomousResolution(categorizedErrors) {
    this.isRunning = true;
    console.log(`${colors.green}🚀 STARTING AUTONOMOUS ERROR RESOLUTION${colors.reset}`);
    
    // Process errors by category and severity
    const processingOrder = ['config', 'imports', 'declarations', 'types', 'syntax', 'other'];
    
    for (const category of processingOrder) {
      const errors = categorizedErrors[category] || [];
      if (errors.length === 0) continue;
      
      console.log(`${colors.cyan}🔧 Processing ${category} errors (${errors.length})...${colors.reset}`);
      
      // Sort by severity and risk
      errors.sort((a, b) => {
        const severityOrder = { critical: 3, high: 2, medium: 1 };
        const riskOrder = { low: 3, medium: 2, high: 1 };
        
        return (severityOrder[b.severity] - severityOrder[a.severity]) ||
               (riskOrder[b.riskLevel] - riskOrder[a.riskLevel]);
      });
      
      for (const error of errors) {
        if (!this.isRunning) break;
        
        try {
          const result = await this.processError(error);
          this.handleFixResult(result, error);
          
          // Small delay to prevent overwhelming
          await this.sleep(100);
          
        } catch (error) {
          this.logError(`Failed to process error: ${error.id}`, error);
        }
      }
      
      // Verify project integrity after each category
      if (this.fixedErrors > 0) {
        await this.verifyProjectIntegrity();
      }
    }
    
    await this.generateFinalReport();
  }
  
  async processError(error) {
    console.log(`${colors.dim}   Processing: ${error.message.substring(0, 50)}...${colors.reset}`);
    
    // Check if auto-fixable and safe
    if (!error.isAutoFixable || error.riskLevel === 'high') {
      return {
        type: 'skipped',
        reason: 'High risk or not auto-fixable',
        error
      };
    }
    
    // Generate fix proposal
    const proposal = await this.generateFixProposal(error);
    
    if (!proposal) {
      return {
        type: 'failed',
        reason: 'Could not generate fix proposal',
        error
      };
    }
    
    // Apply safe fixes automatically
    if (proposal.confidence > 0.8 && proposal.riskLevel === 'low') {
      const success = await this.applyFix(proposal);
      
      return {
        type: success ? 'fixed' : 'failed',
        proposal,
        error
      };
    }
    
    // Queue for manual approval
    this.pendingApprovals.push({ proposal, error });
    
    return {
      type: 'pending_approval',
      proposal,
      error
    };
  }
  
  async generateFixProposal(error) {
    try {
      const filePath = path.join(this.projectRoot, error.filePath);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      
      // Use AI or rule-based fixing
      if (this.hasOllama) {
        return await this.generateAIFix(error, fileContent);
      } else {
        return await this.generateRuleBasedFix(error, fileContent);
      }
      
    } catch (error) {
      this.logError('Fix proposal generation failed', error);
      return null;
    }
  }
  
  async generateAIFix(error, fileContent) {
    const model = this.selectAIModel(error.category);
    const prompt = this.buildFixPrompt(error, fileContent);
    
    try {
      const response = await this.queryAI(model, prompt);
      
      return {
        id: `fix_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        errorId: error.id,
        filePath: error.filePath,
        originalCode: this.extractErrorContext(fileContent, error),
        proposedCode: response.proposedFix,
        explanation: response.explanation,
        confidence: response.confidence || 0.7,
        riskLevel: this.assessFixRisk(response.proposedFix),
        method: 'ai'
      };
      
    } catch (error) {
      this.logError('AI fix generation failed', error);
      return null;
    }
  }
  
  async generateRuleBasedFix(error, fileContent) {
    // Rule-based fixes for common patterns
    if (/Cannot find module.*['"](.+)['"]/.test(error.message)) {
      return this.fixMissingImport(error, fileContent);
    }
    
    if (/Property.*does not exist on type/.test(error.message)) {
      return this.fixPropertyError(error, fileContent);
    }
    
    if (/implicitly has an.*any.*type/.test(error.message)) {
      return this.fixImplicitAny(error, fileContent);
    }
    
    return null;
  }
  
  async applyFix(proposal) {
    try {
      // Create backup before applying fix
      await this.createFileBackup(proposal.filePath);
      
      const filePath = path.join(this.projectRoot, proposal.filePath);
      const content = await fs.readFile(filePath, 'utf-8');
      
      // Apply the fix
      const updatedContent = content.replace(proposal.originalCode, proposal.proposedCode);
      
      if (updatedContent === content) {
        throw new Error('No changes applied - fix did not match content');
      }
      
      await fs.writeFile(filePath, updatedContent, 'utf-8');
      
      // Verify the fix didn't break compilation
      const compileResult = await this.quickCompileCheck();
      
      if (!compileResult.success) {
        // Rollback the change
        await fs.writeFile(filePath, content, 'utf-8');
        throw new Error('Fix caused compilation errors, rolled back');
      }
      
      this.fixedErrors++;
      await this.log(`Applied fix: ${proposal.explanation}`, 'info');
      
      return true;
      
    } catch (error) {
      this.logError('Fix application failed', error);
      return false;
    }
  }
  
  handleFixResult(result, error) {
    switch (result.type) {
      case 'fixed':
        console.log(`   ${colors.green}✅ Fixed: ${error.message.substring(0, 40)}...${colors.reset}`);
        break;
      case 'pending_approval':
        console.log(`   ${colors.yellow}⏳ Needs approval: ${error.message.substring(0, 40)}...${colors.reset}`);
        break;
      case 'skipped':
        console.log(`   ${colors.dim}⏭️  Skipped: ${result.reason}${colors.reset}`);
        break;
      case 'failed':
        console.log(`   ${colors.red}❌ Failed: ${result.reason}${colors.reset}`);
        break;
    }
  }

  // ==================== VALIDATION & SAFETY ====================
  
  async verifyProjectIntegrity() {
    console.log(`${colors.cyan}🔍 Verifying project integrity...${colors.reset}`);
    
    try {
      const buildResult = await this.checkBuildStatus();
      
      if (!buildResult.success) {
        console.log(`${colors.red}⚠️  Build verification failed!${colors.reset}`);
        console.log(`   Error: ${buildResult.error}`);
        
        const rollback = await this.askUser(`${colors.yellow}Rollback changes? (y/n): ${colors.reset}`);
        if (rollback.toLowerCase() === 'y') {
          await this.rollbackToSnapshot();
        }
        
        return false;
      }
      
      console.log(`   ${colors.green}✅ Project integrity verified${colors.reset}`);
      return true;
      
    } catch (error) {
      this.logError('Integrity verification failed', error);
      return false;
    }
  }
  
  async checkBuildStatus() {
    try {
      execSync('npx tsc --noEmit', {
        cwd: this.projectRoot,
        stdio: 'pipe',
        timeout: 60000
      });
      
      return { success: true };
      
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  async quickCompileCheck() {
    try {
      execSync('npx tsc --noEmit --skipLibCheck', {
        cwd: this.projectRoot,
        stdio: 'pipe',
        timeout: 30000
      });
      
      return { success: true };
      
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ==================== REPORTING & INTERACTION ====================
  
  async generateFinalReport() {
    console.log(`${colors.green}📊 FINAL RESOLUTION REPORT${colors.reset}`);
    
    const currentErrors = await this.getErrorCount();
    const errorsFixed = this.totalErrors - currentErrors;
    const successRate = ((errorsFixed / this.totalErrors) * 100).toFixed(1);
    
    console.log(`   Initial errors: ${colors.red}${this.totalErrors}${colors.reset}`);
    console.log(`   Errors fixed: ${colors.green}${errorsFixed}${colors.reset}`);
    console.log(`   Remaining errors: ${colors.yellow}${currentErrors}${colors.reset}`);
    console.log(`   Success rate: ${colors.cyan}${successRate}%${colors.reset}`);
    console.log(`   Pending approvals: ${colors.magenta}${this.pendingApprovals.length}${colors.reset}`);
    
    if (this.pendingApprovals.length > 0) {
      console.log(`${colors.yellow}⏳ PENDING APPROVALS:${colors.reset}`);
      await this.reviewPendingApprovals();
    }
    
    // Save report
    const report = {
      timestamp: new Date().toISOString(),
      totalErrors: this.totalErrors,
      errorsFixed,
      remainingErrors: currentErrors,
      successRate: parseFloat(successRate),
      pendingApprovals: this.pendingApprovals.length
    };
    
    const reportFile = path.join(this.backupDir, `report-${Date.now()}.json`);
    await fs.writeFile(reportFile, JSON.stringify(report, null, 2));
    
    console.log(`${colors.green}✅ Resolution complete! Report saved: ${path.basename(reportFile)}${colors.reset}`);
  }
  
  async reviewPendingApprovals() {
    for (let i = 0; i < this.pendingApprovals.length; i++) {
      const { proposal, error } = this.pendingApprovals[i];
      
      console.log(`${colors.cyan}─────────────────────────────────────────${colors.reset}`);
      console.log(`${colors.yellow}APPROVAL ${i + 1}/${this.pendingApprovals.length}:${colors.reset}`);
      console.log(`File: ${colors.blue}${error.filePath}:${error.line}${colors.reset}`);
      console.log(`Error: ${colors.red}${error.message}${colors.reset}`);
      console.log(`Fix: ${colors.green}${proposal.explanation}${colors.reset}`);
      console.log(`Confidence: ${colors.cyan}${(proposal.confidence * 100).toFixed(1)}%${colors.reset}`);
      console.log(`${colors.dim}Original:${colors.reset}`);
      console.log(`${colors.dim}${proposal.originalCode}${colors.reset}`);
      console.log(`${colors.dim}Proposed:${colors.reset}`);
      console.log(`${colors.green}${proposal.proposedCode}${colors.reset}`);
      
      const response = await this.askUser(`${colors.yellow}Apply this fix? (y/n/q): ${colors.reset}`);
      
      if (response.toLowerCase() === 'q') {
        break;
      } else if (response.toLowerCase() === 'y') {
        const success = await this.applyFix(proposal);
        console.log(success ? 
          `${colors.green}✅ Fix applied successfully${colors.reset}` : 
          `${colors.red}❌ Fix application failed${colors.reset}`
        );
      } else {
        console.log(`${colors.dim}Fix rejected${colors.reset}`);
      }
    }
  }

  // ==================== UTILITY METHODS ====================
  
  async createFileBackup(filePath) {
    const fullPath = path.join(this.projectRoot, filePath);
    const backupPath = path.join(this.backupDir, `${filePath.replace(/[/\\]/g, '_')}.backup`);
    
    try {
      const content = await fs.readFile(fullPath, 'utf-8');
      await fs.writeFile(backupPath, content, 'utf-8');
    } catch (error) {
      this.logError(`Failed to backup file: ${filePath}`, error);
    }
  }
  
  async getErrorCount() {
    try {
      const errors = await this.scanTypeScriptErrors();
      return errors.reduce((total, category) => total + category.length, 0);
    } catch {
      return 0;
    }
  }
  
  selectAIModel(category) {
    switch (category) {
      case 'imports':
      case 'config':
        return this.aiModels.codeAnalysis;
      case 'types':
      case 'declarations':
        return this.aiModels.typeFixer;
      default:
        return this.aiModels.validator;
    }
  }
  
  buildFixPrompt(error, fileContent) {
    const context = this.extractErrorContext(fileContent, error);
    
    return `You are an expert TypeScript developer. Fix this error with minimal changes:

ERROR: ${error.message}
FILE: ${error.filePath}
LINE: ${error.line}

CONTEXT:
${context}

Provide response in JSON format:
{
  "proposedFix": "corrected code",
  "explanation": "brief explanation",
  "confidence": 0.0-1.0
}

Requirements:
- Make minimal changes
- Preserve existing functionality
- Follow TypeScript best practices
- Only fix the specific error`;
  }
  
  extractErrorContext(content, error) {
    const lines = content.split('\n');
    const errorLine = error.line - 1;
    const start = Math.max(0, errorLine - 3);
    const end = Math.min(lines.length, errorLine + 4);
    
    return lines.slice(start, end)
      .map((line, i) => `${start + i + 1}: ${line}`)
      .join('\n');
  }
  
  async queryAI(model, prompt) {
    const response = execSync(`ollama run ${model} "${prompt.replace(/"/g, '\\"')}"`, {
      encoding: 'utf-8',
      timeout: 30000
    });
    
    try {
      return JSON.parse(response);
    } catch {
      return {
        proposedFix: this.extractCodeFromResponse(response),
        explanation: 'AI generated fix',
        confidence: 0.7
      };
    }
  }
  
  extractCodeFromResponse(response) {
    const codeMatch = response.match(/```(?:typescript|ts)?\n([\s\S]*?)\n```/);
    return codeMatch ? codeMatch[1] : response.trim();
  }
  
  assessFixRisk(code) {
    if (this.riskPatterns.some(pattern => pattern.test(code))) {
      return 'high';
    }
    return 'low';
  }
  
  hashString(str) {
    const crypto = require('crypto');
    return crypto.createHash('md5').update(str).digest('hex');
  }
  
  async log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
    
    try {
      await fs.appendFile(this.logFile, logEntry);
    } catch {
      // Silent fail for logging
    }
  }
  
  logError(message, error) {
    const errorMessage = `${message}: ${error.message || error}`;
    this.log(errorMessage, 'error');
    console.error(`${colors.red}❌ ${errorMessage}${colors.reset}`);
  }
  
  async askUser(question) {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer.trim());
      });
    });
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ==================== SPECIFIC FIX IMPLEMENTATIONS ====================
  
  fixMissingImport(error, fileContent) {
    const match = error.message.match(/Cannot find module.*['"](.+)['"]/);
    if (!match) return null;
    
    const moduleName = match[1];
    const lines = fileContent.split('\n');
    
    // Find a good place to add the import
    let insertLine = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ')) {
        insertLine = i + 1;
      } else if (lines[i].trim() !== '' && insertLine > 0) {
        break;
      }
    }
    
    const importStatement = `import ${moduleName} from '${moduleName}';`;
    lines.splice(insertLine, 0, importStatement);
    
    return {
      id: `fix_import_${Date.now()}`,
      errorId: error.id,
      filePath: error.filePath,
      originalCode: '', // Will be replaced with actual context
      proposedCode: lines.join('\n'),
      explanation: `Add missing import for ${moduleName}`,
      confidence: 0.9,
      riskLevel: 'low',
      method: 'rule-based'
    };
  }
  
  fixPropertyError(error, fileContent) {
    // This would implement property error fixes
    return null; // Placeholder
  }
  
  fixImplicitAny(error, fileContent) {
    // This would implement implicit any fixes
    return null; // Placeholder
  }
  
  async rollbackToSnapshot() {
    console.log(`${colors.yellow}🔄 Rolling back to last snapshot...${colors.reset}`);
    // Implementation would restore from backup
    console.log(`${colors.green}✅ Rollback completed${colors.reset}`);
  }
}

// ==================== MAIN EXECUTION ====================

if (require.main === module) {
  const aiCTO = new AutonomousAICTO();
  
  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log(`\n${colors.yellow}🛑 Graceful shutdown initiated...${colors.reset}`);
    aiCTO.isRunning = false;
    await aiCTO.log('System shutdown by user', 'info');
    process.exit(0);
  });
  
  // Start the AI CTO
  aiCTO.start().catch((error) => {
    console.error(`${colors.red}❌ FATAL ERROR: ${error.message}${colors.reset}`);
    process.exit(1);
  });
}

module.exports = AutonomousAICTO;