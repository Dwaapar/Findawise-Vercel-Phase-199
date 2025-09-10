import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the offline AI sync engine before importing the router
vi.mock('../server/services/offline-ai/offlineAiSyncEngine', () => ({
  offlineAiSyncEngine: {
    registerDevice: vi.fn()
  }
}));

// Dynamically import the router after mocks are set up
const offlineAiRouter = (await import('../server/routes/offline-ai')).default;
const { offlineAiSyncEngine } = await import('../server/services/offline-ai/offlineAiSyncEngine');

describe('POST /api/offline-ai/device/register', () => {
  const app = express();
  app.use(express.json());
  app.use('/api/offline-ai', offlineAiRouter);

  beforeEach(() => {
    offlineAiSyncEngine.registerDevice.mockReset();
  });

  it('registers a device successfully', async () => {
    offlineAiSyncEngine.registerDevice.mockResolvedValue('device123');

    const res = await request(app)
      .post('/api/offline-ai/device/register')
      .send({
        deviceId: 'device123',
        capabilities: { offline: true }
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.deviceId).toBe('device123');
    expect(offlineAiSyncEngine.registerDevice).toHaveBeenCalledWith({
      deviceId: 'device123',
      capabilities: { offline: true }
    });
  });

  it('handles registration errors', async () => {
    offlineAiSyncEngine.registerDevice.mockRejectedValue(new Error('fail'));

    const res = await request(app)
      .post('/api/offline-ai/device/register')
      .send({
        deviceId: 'device123',
        capabilities: { offline: true }
      });

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Failed to register device');
  });
});

