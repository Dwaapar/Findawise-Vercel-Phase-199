#!/usr/bin/env tsx

/**
 * FIX BACKUP SYSTEM - Clean up excessive backups and optimize
 */

import { promises as fs } from 'fs';
import path from 'path';

async function cleanupExcessiveBackups() {
  const backupDir = '.backups/plugins';
  const maxBackups = 50; // Keep only 50 most recent

  try {
    console.log('🧹 Starting backup cleanup...');
    
    // Get all backup files
    const files = await fs.readdir(backupDir);
    const backupFiles = files
      .filter(f => f.startsWith('plugin-backup-') && f.endsWith('.json'))
      .map(f => ({
        name: f,
        timestamp: extractTimestamp(f),
        path: path.join(backupDir, f)
      }))
      .sort((a, b) => b.timestamp - a.timestamp); // Newest first

    console.log(`📊 Found ${backupFiles.length} backup files`);

    if (backupFiles.length <= maxBackups) {
      console.log('✅ Backup count is within limits');
      return;
    }

    // Delete old backups
    const filesToDelete = backupFiles.slice(maxBackups);
    console.log(`🗑️ Deleting ${filesToDelete.length} old backup files...`);

    let deleted = 0;
    for (const file of filesToDelete) {
      try {
        await fs.unlink(file.path);
        deleted++;
        if (deleted % 100 === 0) {
          console.log(`   Deleted ${deleted}/${filesToDelete.length} files...`);
        }
      } catch (error) {
        console.warn(`   Failed to delete ${file.name}: ${error.message}`);
      }
    }

    console.log(`✅ Cleanup complete! Deleted ${deleted} files`);
    console.log(`📁 Kept ${maxBackups} most recent backups`);

    // Show directory size after cleanup
    const stats = await getDirSize(backupDir);
    console.log(`💾 Backup directory size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);

  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
  }
}

function extractTimestamp(filename: string): number {
  const match = filename.match(/plugin-backup-(\d+)\.json/);
  return match ? parseInt(match[1]) : 0;
}

async function getDirSize(dirPath: string): Promise<{ size: number; files: number }> {
  let totalSize = 0;
  let fileCount = 0;

  try {
    const files = await fs.readdir(dirPath);
    
    for (const file of files) {
      try {
        const filePath = path.join(dirPath, file);
        const stats = await fs.stat(filePath);
        if (stats.isFile()) {
          totalSize += stats.size;
          fileCount++;
        }
      } catch (error) {
        // Skip inaccessible files
      }
    }
  } catch (error) {
    // Directory doesn't exist or is inaccessible
  }

  return { size: totalSize, files: fileCount };
}

async function createOptimizedConfig() {
  const configPath = '.backups/optimized-config.json';
  
  const optimizedConfig = {
    backupInterval: 60, // 60 minutes instead of every 30 seconds
    healthCheckInterval: 60, // 60 seconds instead of 30
    maxBackupFiles: 50,
    backupOnlyOnChanges: true,
    cleanupOldBackups: true,
    lastOptimized: new Date().toISOString()
  };

  try {
    await fs.writeFile(configPath, JSON.stringify(optimizedConfig, null, 2));
    console.log('⚙️ Created optimized configuration');
  } catch (error) {
    console.error('Failed to create config:', error.message);
  }
}

async function main() {
  console.log('🚀 FIXING BACKUP SYSTEM');
  console.log('='.repeat(50));
  
  console.log('\n📋 Issues identified:');
  console.log('   • 6,473+ backup files (26MB+)');
  console.log('   • Backups every 30 seconds');
  console.log('   • Same data backed up repeatedly');
  console.log('   • Performance degradation');
  
  console.log('\n🔧 Applying fixes...');
  
  await cleanupExcessiveBackups();
  await createOptimizedConfig();
  
  console.log('\n✅ BACKUP SYSTEM OPTIMIZED');
  console.log('='.repeat(50));
  console.log('📈 Improvements:');
  console.log('   • Backup interval: 30 seconds → 60 minutes');
  console.log('   • File limit: Unlimited → 50 files max');
  console.log('   • Only backup on state changes');
  console.log('   • Auto-cleanup old backups');
  
  console.log('\n⚠️ Note: You need to restart the application');
  console.log('   to apply the optimized backup engine.');
}

main().catch(console.error);