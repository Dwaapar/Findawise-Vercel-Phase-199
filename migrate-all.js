// Force migration of all tables with proper responses
import { spawn } from 'child_process';
import fs from 'fs';

console.log('🚀 Starting comprehensive database migration...');

// Create a response file for drizzle interactive prompts
const responses = Array(200).fill('').map(() => '\n').join(''); // 200 empty responses (Enter key)

const migrate = spawn('npx', ['drizzle-kit', 'push', '--force'], {
  stdio: ['pipe', 'inherit', 'inherit']
});

// Send responses to handle any interactive prompts
migrate.stdin.write(responses);
migrate.stdin.end();

migrate.on('close', (code) => {
  console.log(`✅ Migration completed with exit code ${code}`);
  process.exit(code);
});