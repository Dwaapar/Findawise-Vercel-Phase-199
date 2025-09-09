/**
 * EMERGENCY STARTUP MODE
 * Minimal server configuration to ensure successful startup
 * Only loads essential routes and services
 */

import 'dotenv/config';
import express from "express";
import cookieParser from "cookie-parser";
import { db } from "./db";
import { setupVite, serveStatic, log } from "./vite";
import { createServer } from "http";

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Essential health endpoints only
app.get('/api/status', (req, res) => {
  res.json({ 
    success: true, 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    server: 'running',
    mode: 'emergency-startup'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    server: 'running',
    mode: 'emergency-startup',
    uptime: process.uptime()
  });
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Root redirect
app.get('/', (req, res) => {
  res.json({ message: 'Findawise Empire - Emergency Startup Mode Active' });
});

async function startEmergencyServer() {
  const port = process.env.PORT || 5000;
  
  console.log('🚨 EMERGENCY STARTUP MODE ACTIVATED');
  console.log(`🚀 Starting minimal server on port ${port}`);
  
  try {
    // Test database connection
    console.log('🔍 Testing database connection...');
    await db.execute('SELECT 1');
    console.log('✅ Database connection successful');
  } catch (error) {
    console.warn('⚠️ Database connection failed, continuing without DB');
  }
  
  const server = createServer(app);
  
  // Set up Vite development or production serving
  if (app.get("env") === "development") {
    try {
      console.log('🔧 Setting up Vite development server...');
      await setupVite(app, server);
      console.log('✅ Vite development server ready');
    } catch (error) {
      console.warn('⚠️ Vite setup failed, continuing with basic server');
    }
  } else {
    serveStatic(app);
  }

  server.listen({
    port: Number(port),
    host: "0.0.0.0",
  }, () => {
    log(`✅ Emergency server operational on port ${port}`);
    console.log('🏥 Emergency startup complete - minimal services active');
    console.log(`🌐 Health check: http://localhost:${port}/api/health`);
  });
}

export default startEmergencyServer;

if (import.meta.url === `file://${process.argv[1]}`) {
  startEmergencyServer().catch(console.error);
}