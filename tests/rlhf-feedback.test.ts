import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the RLHF engine before importing the router
vi.mock('../server/services/rlhf/rlhfEngine', () => ({
  rlhfEngine: {
    collectFeedback: vi.fn()
  }
}));

const rlhfRouter = (await import('../server/routes/rlhf')).default;
const { rlhfEngine } = await import('../server/services/rlhf/rlhfEngine');

describe('POST /api/rlhf/feedback', () => {
  const app = express();
  app.use(express.json());
  app.use('/api/rlhf', rlhfRouter);

  beforeEach(() => {
    rlhfEngine.collectFeedback.mockReset();
  });

  it('collects feedback successfully', async () => {
    rlhfEngine.collectFeedback.mockResolvedValue(undefined);

    const res = await request(app)
      .post('/api/rlhf/feedback')
      .send({
        sessionId: 's1',
        taskType: 'test',
        signalType: 'click',
        signalValue: 1
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(rlhfEngine.collectFeedback).toHaveBeenCalledWith({
      sessionId: 's1',
      userId: undefined,
      agentId: undefined,
      promptVersion: undefined,
      taskType: 'test',
      pagePath: undefined,
      userArchetype: undefined,
      feedbackType: 'implicit',
      signalType: 'click',
      signalValue: 1,
      rawValue: undefined,
      interactionDuration: undefined,
      deviceType: undefined,
      browserInfo: undefined,
      geoLocation: undefined,
      metadata: undefined
    });
  });

  it('returns 400 when required fields are missing', async () => {
    const res = await request(app)
      .post('/api/rlhf/feedback')
      .send({ taskType: 'test', signalType: 'click', signalValue: 1 });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('handles collection errors', async () => {
    rlhfEngine.collectFeedback.mockRejectedValue(new Error('fail'));

    const res = await request(app)
      .post('/api/rlhf/feedback')
      .send({
        sessionId: 's1',
        taskType: 'test',
        signalType: 'click',
        signalValue: 1
      });

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Failed to collect feedback');
  });
});

