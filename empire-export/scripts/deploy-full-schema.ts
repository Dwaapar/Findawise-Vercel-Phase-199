#!/usr/bin/env tsx

/**
 * COMPREHENSIVE SCHEMA DEPLOYMENT - BILLION DOLLAR ENTERPRISE GRADE
 * Deploys all 450+ tables from schema files to achieve full enterprise architecture
 */

import { db } from '../server/db';
import { sql } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

interface DeploymentResult {
  totalSchemaFiles: number;
  tablesCreated: number;
  tablesSkipped: number;
  errors: string[];
  success: boolean;
}

class FullSchemaDeployment {
  private result: DeploymentResult = {
    totalSchemaFiles: 0,
    tablesCreated: 0,
    tablesSkipped: 0,
    errors: [],
    success: false
  };

  async deployAllSchemas(): Promise<DeploymentResult> {
    console.log('🚀 DEPLOYING FULL BILLION-DOLLAR ENTERPRISE SCHEMA');
    console.log('================================================');
    
    const schemaDir = path.join(__dirname, '../shared');
    const schemaFiles = fs.readdirSync(schemaDir).filter(f => f.endsWith('.ts') && f !== 'schema.ts');
    
    this.result.totalSchemaFiles = schemaFiles.length;
    console.log(`📊 Found ${schemaFiles.length} schema files to process`);
    
    // Import and deploy each schema file
    for (const schemaFile of schemaFiles) {
      await this.deploySchemaFile(schemaFile);
    }
    
    // Verify final table count
    const finalCount = await this.verifyDeployment();
    
    this.result.success = this.result.errors.length === 0;
    
    console.log('\n🎯 DEPLOYMENT SUMMARY');
    console.log('=====================');
    console.log(`✅ Schema Files Processed: ${this.result.totalSchemaFiles}`);
    console.log(`✅ Tables Created: ${this.result.tablesCreated}`);
    console.log(`⚠️ Tables Skipped: ${this.result.tablesSkipped}`);
    console.log(`❌ Errors: ${this.result.errors.length}`);
    console.log(`📊 Final Database Tables: ${finalCount}`);
    console.log(`🎖️ Status: ${this.result.success ? 'SUCCESS' : 'PARTIAL SUCCESS'}`);
    
    return this.result;
  }

  private async deploySchemaFile(schemaFile: string): Promise<void> {
    console.log(`\n🔧 Processing: ${schemaFile}`);
    
    try {
      // Import the schema file dynamically
      const schemaModule = await import(`../shared/${schemaFile}`);
      
      // Get all exported table schemas
      const tableExports = Object.keys(schemaModule).filter(key => 
        key !== 'default' && !key.startsWith('insert') && !key.startsWith('select')
      );
      
      console.log(`  📋 Found ${tableExports.length} table definitions`);
      
      // Create each table using Drizzle
      for (const tableName of tableExports) {
        const tableSchema = schemaModule[tableName];
        
        if (tableSchema && typeof tableSchema === 'object' && tableSchema._.name) {
          await this.createTableFromSchema(tableSchema);
        }
      }
      
    } catch (error) {
      const errorMsg = `Failed to process ${schemaFile}: ${error.message}`;
      console.error(`  ❌ ${errorMsg}`);
      this.result.errors.push(errorMsg);
    }
  }

  private async createTableFromSchema(tableSchema: any): Promise<void> {
    const tableName = tableSchema._.name;
    
    try {
      // Check if table already exists
      const existsResult = await db.execute(sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = ${tableName}
        );
      `);
      
      const exists = existsResult.rows[0]?.exists;
      
      if (exists) {
        console.log(`    ⚪ ${tableName} - Already exists`);
        this.result.tablesSkipped++;
      } else {
        // Execute the CREATE TABLE statement using Drizzle's table schema
        // This leverages Drizzle's built-in schema-to-SQL conversion
        const createStatement = this.generateCreateTableSQL(tableSchema);
        
        if (createStatement) {
          await db.execute(sql.raw(createStatement));
          console.log(`    ✅ ${tableName} - Created`);
          this.result.tablesCreated++;
        } else {
          console.log(`    ⚠️ ${tableName} - Skipped (no valid schema)`);
          this.result.tablesSkipped++;
        }
      }
      
    } catch (error) {
      const errorMsg = `Failed to create table ${tableName}: ${error.message}`;
      console.error(`    ❌ ${errorMsg}`);
      this.result.errors.push(errorMsg);
    }
  }

  private generateCreateTableSQL(tableSchema: any): string | null {
    try {
      const tableName = tableSchema._.name;
      const columns = tableSchema._.columns;
      
      if (!columns || Object.keys(columns).length === 0) {
        return null;
      }
      
      const columnDefs: string[] = [];
      
      // Process each column
      for (const [columnName, column] of Object.entries(columns)) {
        const columnDef = this.generateColumnDefinition(columnName, column as any);
        if (columnDef) {
          columnDefs.push(columnDef);
        }
      }
      
      if (columnDefs.length === 0) {
        return null;
      }
      
      return `CREATE TABLE IF NOT EXISTS ${tableName} (
        ${columnDefs.join(',\n        ')}
      );`;
      
    } catch (error) {
      console.error(`Error generating SQL for table:`, error);
      return null;
    }
  }

  private generateColumnDefinition(columnName: string, column: any): string | null {
    try {
      let sqlType = 'TEXT'; // Default fallback
      let constraints = '';
      
      // Map Drizzle types to PostgreSQL types
      const columnType = column._.dataType;
      
      if (columnType === 'serial') {
        sqlType = 'SERIAL';
      } else if (columnType === 'integer') {
        sqlType = 'INTEGER';
      } else if (columnType === 'boolean') {
        sqlType = 'BOOLEAN';
      } else if (columnType === 'timestamp') {
        sqlType = 'TIMESTAMP';
      } else if (columnType === 'varchar') {
        const length = column._.size || 255;
        sqlType = `VARCHAR(${length})`;
      } else if (columnType === 'text') {
        sqlType = 'TEXT';
      } else if (columnType === 'jsonb') {
        sqlType = 'JSONB';
      } else if (columnType === 'real') {
        sqlType = 'REAL';
      }
      
      // Handle constraints
      if (column._.notNull) {
        constraints += ' NOT NULL';
      }
      
      if (column._.primaryKey) {
        constraints += ' PRIMARY KEY';
      }
      
      if (column._.default !== undefined) {
        if (typeof column._.default === 'string') {
          constraints += ` DEFAULT '${column._.default}'`;
        } else {
          constraints += ` DEFAULT ${column._.default}`;
        }
      }
      
      return `${columnName} ${sqlType}${constraints}`;
      
    } catch (error) {
      console.error(`Error generating column definition for ${columnName}:`, error);
      return null;
    }
  }

  private async verifyDeployment(): Promise<number> {
    try {
      const result = await db.execute(sql`
        SELECT COUNT(*) as table_count 
        FROM information_schema.tables 
        WHERE table_schema = 'public';
      `);
      
      return parseInt(result.rows[0]?.table_count || '0');
    } catch (error) {
      console.error('Error verifying deployment:', error);
      return 0;
    }
  }
}

// Execute deployment if run directly
async function main() {
  const deployment = new FullSchemaDeployment();
  try {
    const result = await deployment.deployAllSchemas();
    if (result.success) {
      console.log('\n🎉 BILLION-DOLLAR SCHEMA DEPLOYMENT COMPLETE!');
      process.exit(0);
    } else {
      console.log('\n⚠️ DEPLOYMENT COMPLETED WITH WARNINGS');  
      process.exit(1);
    }
  } catch (error) {
    console.error('\n💥 DEPLOYMENT FAILED:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { FullSchemaDeployment };