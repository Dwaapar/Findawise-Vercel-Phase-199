// Enterprise-grade Vercel API handler - Optimized ES Module Version
import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';

// Create minimal Express app for Vercel
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, x-client-version');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  next();
});

// Essential health endpoints
app.get('/api/status', (req, res) => {
  res.json({ 
    success: true, 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    server: 'running',
    mode: 'production',
    version: '1.0.0'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    server: 'running',
    mode: 'production',
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
    }
  });
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Lazy load full routes system
let fullApp = null;
let isLoadingFullApp = false;

async function getFullApp() {
  if (fullApp) return fullApp;
  if (isLoadingFullApp) {
    // Return current app while loading
    return app;
  }

  try {
    isLoadingFullApp = true;
    console.log('Loading full application...');
    
    // Dynamic import with proper ES module handling
    const { registerRoutes } = await import('../server/routes.js');
    await registerRoutes(app);
    
    fullApp = app;
    console.log('Full application loaded successfully');
    return fullApp;
  } catch (error) {
    console.error('Failed to load full application:', error);
    isLoadingFullApp = false;
    // Return basic app as fallback
    return app;
  }
}

// Main handler function
export default async function handler(req, res) {
  try {
    // Enterprise request tracking
    const startTime = Date.now();
    const requestId = `req_${Math.random().toString(36).substring(2, 15)}`;
    
    console.log(`[${requestId}] ${req.method} ${req.url} - Start`);

    // Get the appropriate app (basic for health checks, full for other routes)
    const currentApp = req.url.includes('/health') || req.url.includes('/status') 
      ? app 
      : await getFullApp();

    // Handle request with Express app
    return new Promise((resolve, reject) => {
      currentApp(req, res, (err) => {
        const duration = Date.now() - startTime;
        console.log(`[${requestId}] ${req.method} ${req.url} - ${duration}ms`);
        
        if (err) {
          console.error(`[${requestId}] Error:`, err);
          reject(err);
        } else {
          resolve();
        }
      });
    });

  } catch (error) {
    console.error('Vercel handler error:', error);
    
    // Enterprise error response
    const errorResponse = {
      error: 'Service temporarily unavailable',
      status: 'error',
      timestamp: new Date().toISOString(),
      message: process.env.NODE_ENV === 'development' 
        ? (error instanceof Error ? error.message : 'Unknown error')
        : 'Internal server error'
    };

    res.status(500).json(errorResponse);
  }
}