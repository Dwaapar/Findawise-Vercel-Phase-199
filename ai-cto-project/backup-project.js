#!/usr/bin/env node

/**
 * PROJECT BACKUP SYSTEM FOR AI CTO
 * 
 * Creates comprehensive backups before autonomous error fixing
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

class ProjectBackup {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.backupDir = path.join(__dirname, 'backups');
  }

  async createFullBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(this.backupDir, `full-backup-${timestamp}`);

    console.log(`${colors.cyan}📦 Creating full project backup...${colors.reset}`);
    console.log(`   Backup location: ${backupPath}`);

    await fs.mkdir(backupPath, { recursive: true });

    // Backup critical files
    await this.backupCriticalFiles(backupPath);
    
    // Backup source code
    await this.backupSourceCode(backupPath);
    
    // Create manifest
    await this.createBackupManifest(backupPath);

    console.log(`${colors.green}✅ Full backup completed${colors.reset}`);
    return backupPath;
  }

  async backupCriticalFiles(backupPath) {
    const criticalFiles = [
      'package.json',
      'package-lock.json', 
      'tsconfig.json',
      'vite.config.ts',
      'tailwind.config.ts',
      'drizzle.config.ts'
    ];

    for (const file of criticalFiles) {
      try {
        const source = path.join(this.projectRoot, file);
        const dest = path.join(backupPath, file);
        await fs.copyFile(source, dest);
        console.log(`   ✅ Backed up ${file}`);
      } catch (error) {
        console.log(`   ⚠️  Could not backup ${file}: ${error.message}`);
      }
    }
  }

  async backupSourceCode(backupPath) {
    const sourceDir = path.join(backupPath, 'source');
    await fs.mkdir(sourceDir, { recursive: true });

    await this.copyDirectory(path.join(this.projectRoot, 'server'), path.join(sourceDir, 'server'));
    await this.copyDirectory(path.join(this.projectRoot, 'client'), path.join(sourceDir, 'client'));
    await this.copyDirectory(path.join(this.projectRoot, 'shared'), path.join(sourceDir, 'shared'));
    await this.copyDirectory(path.join(this.projectRoot, 'config'), path.join(sourceDir, 'config'));
  }

  async copyDirectory(source, dest) {
    try {
      await fs.mkdir(dest, { recursive: true });
      const entries = await fs.readdir(source, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.name.startsWith('.') || entry.name === 'node_modules') {
          continue;
        }

        const sourcePath = path.join(source, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
          await this.copyDirectory(sourcePath, destPath);
        } else if (entry.name.match(/\.(ts|tsx|js|jsx|json|md)$/)) {
          await fs.copyFile(sourcePath, destPath);
        }
      }
    } catch (error) {
      // Skip directories that can't be read
    }
  }

  async createBackupManifest(backupPath) {
    const manifest = {
      timestamp: new Date().toISOString(),
      projectRoot: this.projectRoot,
      backupPath,
      aiCTOVersion: '1.0.0',
      files: await this.getFileList(backupPath),
      projectHealth: await this.getProjectHealth()
    };

    await fs.writeFile(
      path.join(backupPath, 'backup-manifest.json'),
      JSON.stringify(manifest, null, 2)
    );
  }

  async getFileList(backupPath) {
    const files = [];
    
    const scanDir = async (dir) => {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          const relativePath = path.relative(backupPath, fullPath);
          
          if (entry.isDirectory()) {
            await scanDir(fullPath);
          } else {
            files.push(relativePath);
          }
        }
      } catch (error) {
        // Skip
      }
    };

    await scanDir(backupPath);
    return files;
  }

  async getProjectHealth() {
    try {
      // Get error count
      const tscResult = execSync('npx tsc --noEmit', {
        cwd: this.projectRoot,
        stdio: 'pipe'
      });
      
      return {
        buildStatus: 'success',
        errorCount: 0
      };
    } catch (error) {
      const errorCount = (error.stdout || error.stderr || '').split('\n')
        .filter(line => line.includes('error TS')).length;
      
      return {
        buildStatus: 'failed',
        errorCount
      };
    }
  }
}

async function main() {
  console.log(`${colors.bold}${colors.cyan}AI CTO - PROJECT BACKUP SYSTEM${colors.reset}\n`);
  
  const backup = new ProjectBackup();
  
  try {
    const backupPath = await backup.createFullBackup();
    
    console.log(`\n${colors.green}🎉 BACKUP COMPLETED SUCCESSFULLY${colors.reset}`);
    console.log(`${colors.yellow}Backup saved to: ${backupPath}${colors.reset}`);
    console.log(`\n${colors.cyan}Your project is now safely backed up before AI CTO error fixing!${colors.reset}`);
    
  } catch (error) {
    console.error(`${colors.red}❌ Backup failed: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = ProjectBackup;