/**
 * Test Setup Configuration
 * Global test setup for Vitest
 */

import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';

// Set test environment variables immediately so modules can access them
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';

console.log('🧪 Test environment initialized');

// Global lifecycle hooks
beforeAll(() => {
  // Additional setup before tests run
});

afterAll(() => {
  // Global cleanup
  console.log('🧪 Test environment cleaned up');
});

beforeEach(() => {
  // Reset any mocks or state before each test
});

afterEach(() => {
  // Clean up after each test
});

// Global mocks for enterprise modules
const mockLogger = {
  info: () => {},
  error: () => {},
  warn: () => {},
  debug: () => {}
};

// Mock external dependencies
// @ts-ignore
global.mockLogger = mockLogger;
