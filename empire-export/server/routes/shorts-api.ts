/**
 * SHORTS API ROUTES - EMPIRE GRADE
 * Complete API endpoints for Shorts Engine functionality
 */

import express from 'express';
import { shortsEngine } from '../services/traffic-generators/shortsEngine';

const router = express.Router();

// Initialize Shorts Engine
shortsEngine.initialize().catch(console.error);

// Upload short video
router.post('/upload', shortsEngine.getUploadMiddleware().single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No video file provided' });
    }

    const userId = req.body.userId || 'anonymous';
    const metadata = {
      title: req.body.title,
      description: req.body.description,
      tags: req.body.tags ? JSON.parse(req.body.tags) : [],
      category: req.body.category
    };

    const video = await shortsEngine.uploadShort(userId, req.file, metadata);
    
    res.json({
      success: true,
      data: video,
      message: 'Video uploaded successfully and is being processed'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get shorts with filters
router.get('/', async (req, res) => {
  try {
    const { userId, limit = 20, offset = 0 } = req.query;
    
    const shorts = await shortsEngine.getShorts(
      userId as string,
      parseInt(limit as string),
      parseInt(offset as string)
    );
    
    res.json({ success: true, data: shorts });
  } catch (error) {
    console.error('Get shorts error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get specific short by ID
router.get('/:id', async (req, res) => {
  try {
    const video = await shortsEngine.getShortById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ success: false, error: 'Video not found' });
    }
    
    res.json({ success: true, data: video });
  } catch (error) {
    console.error('Get short error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update video stats (view, like, share)
router.post('/:id/:action', async (req, res) => {
  try {
    const { id, action } = req.params;
    
    if (!['view', 'like', 'share'].includes(action)) {
      return res.status(400).json({ success: false, error: 'Invalid action' });
    }
    
    await shortsEngine.updateVideoStats(id, action as 'view' | 'like' | 'share');
    
    res.json({ success: true, message: `${action} recorded successfully` });
  } catch (error) {
    console.error('Update stats error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete short
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.body.userId || req.query.userId;
    
    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID required' });
    }
    
    const deleted = await shortsEngine.deleteShort(req.params.id, userId as string);
    
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Video not found or unauthorized' });
    }
    
    res.json({ success: true, message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Delete short error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get processing status
router.get('/:id/status', async (req, res) => {
  try {
    const status = await shortsEngine.getProcessingStatus(req.params.id);
    
    if (!status) {
      return res.status(404).json({ success: false, error: 'Processing status not found' });
    }
    
    res.json({ success: true, data: status });
  } catch (error) {
    console.error('Get status error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get analytics
router.get('/analytics/summary', async (req, res) => {
  try {
    const { userId } = req.query;
    const analytics = await shortsEngine.getAnalytics(userId as string);
    
    res.json({ success: true, data: analytics });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;