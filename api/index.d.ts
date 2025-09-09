// Type declarations for Vercel serverless function
declare module '../dist/index.js' {
  import type { Express } from 'express';
  const app: Express & { handle?: Function };
  export default app;
}