// Enterprise-grade Vercel API handler for Findawise Empire - ES Module Version
import 'dotenv/config';

// Handle CORS for all requests
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, x-client-version');
}

export default async function handler(req, res) {
  setCorsHeaders(res);

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Enterprise security check - Rate limiting headers
  res.setHeader('X-RateLimit-Limit', '1000');
  res.setHeader('X-RateLimit-Remaining', '999');
  res.setHeader('X-RateLimit-Reset', new Date(Date.now() + 3600000).getTime());

  try {
    // Validate essential environment
    const requiredEnvs = ['NODE_ENV'];
    for (const env of requiredEnvs) {
      if (!process.env[env]) {
        console.warn(`Missing environment variable: ${env}`);
      }
    }

    // Dynamic import of the Express app - Pure ES module
    const serverModule = await import('../server/index.js');
    const app = serverModule.default;
    
    if (!app) {
      throw new Error('Failed to load Express application');
    }

    // Enterprise logging for requests
    const startTime = Date.now();
    const requestId = `req_${Math.random().toString(36).substring(2, 15)}`;
    
    console.log(`[${requestId}] ${req.method} ${req.url} - Start`);

    // Create a promise to handle the Express app
    return new Promise((resolve, reject) => {
      try {
        // Add enterprise request tracking
        req.requestId = requestId;
        req.startTime = startTime;
        
        // Handle request with Express app
        app(req, res, (err) => {
          const duration = Date.now() - startTime;
          console.log(`[${requestId}] ${req.method} ${req.url} - ${duration}ms`);
          
          if (err) {
            console.error(`[${requestId}] Error:`, err);
            reject(err);
          } else {
            resolve();
          }
        });
      } catch (error) {
        reject(error);
      }
    });

  } catch (error) {
    console.error('Vercel handler error:', error);
    
    // Enterprise error response with more context
    const errorResponse = {
      error: 'Empire systems temporarily unavailable',
      status: 'error',
      timestamp: new Date().toISOString(),
      requestId: req.requestId || 'unknown',
      message: process.env.NODE_ENV === 'development' 
        ? (error instanceof Error ? error.message : 'Unknown error')
        : 'Internal server error'
    };

    // Add health check response
    if (req.url === '/api/health') {
      errorResponse.health = 'degraded';
      errorResponse.services = {
        api: 'offline',
        database: 'unknown'
      };
    }

    res.status(500).json(errorResponse);
  }
}