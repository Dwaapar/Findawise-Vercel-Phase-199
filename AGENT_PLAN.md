# Build Fix Commander - Action Plan

## Goal
Make the repo build cleanly with zero TypeScript/Drizzle errors while preserving all features.

## Current State
- Project migration from Replit Agent completed
- Application is running successfully
- Build passes but with duplicate method warnings
- Need to eliminate all TypeScript errors

## Planned Actions
1. ✅ Run preflight checks (node/npm versions)
2. ⏳ Run TypeScript typecheck to capture current errors
3. Fix database write shapes using schema-driven types
4. Restore missing imports and constants
5. Fix option object types and API calls
6. Verify both gates pass with zero errors

## Focus Files
- server/storage.ts - Main database operations
- shared/schema.ts - Schema definitions

## Search Patterns to Fix
- Empty inserts: `.values({ })`
- Missing schema fields: updatedAt, timestamp, status
- Required fields: sessionId, activityType, position, email
- Wrong cache options: cache(3600) -> cache({ ttl: 3600 })
- Missing imports: translations, regions, etc.