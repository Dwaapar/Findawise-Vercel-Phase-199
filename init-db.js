// Simple database initialization script
import { DatabaseInitializationSystem } from './server/startup/database-initialization';

async function main() {
  try {
    console.log('🚀 Starting database initialization...');
    const init = new DatabaseInitializationSystem();
    const result = await init.initializeEmpireDatabase();
    console.log('✅ Initialization completed:', JSON.stringify(result, null, 2));
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

main();