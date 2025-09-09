/**
 * UGC API ROUTES - EMPIRE GRADE
 * Complete API endpoints for User Generated Content functionality
 */

import express from 'express';
import { ugcEngine } from '../services/traffic-generators/ugcEngine';

const router = express.Router();

// Initialize UGC Engine
ugcEngine.initialize().catch(console.error);

// Submit new content
router.post('/content', async (req, res) => {
  try {
    const userId = req.body.userId;
    
    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID required' });
    }
    
    const content = await ugcEngine.submitContent(userId, req.body);
    
    res.json({
      success: true,
      data: content,
      message: content.status === 'approved' ? 'Content published successfully' : 'Content submitted for review'
    });
  } catch (error) {
    console.error('Submit content error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get content with filters
router.get('/content', async (req, res) => {
  try {
    const filters = {
      category: req.query.category,
      userId: req.query.userId,
      contentType: req.query.contentType,
      limit: parseInt(req.query.limit as string) || 20,
      offset: parseInt(req.query.offset as string) || 0
    };
    
    const content = await ugcEngine.getContent(filters);
    
    res.json({ success: true, data: content });
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update content stats (view, like, share)
router.post('/content/:id/:action', async (req, res) => {
  try {
    const { id, action } = req.params;
    
    if (!['view', 'like', 'share'].includes(action)) {
      return res.status(400).json({ success: false, error: 'Invalid action' });
    }
    
    await ugcEngine.updateContentStats(id, action as 'view' | 'like' | 'share');
    
    res.json({ success: true, message: `${action} recorded successfully` });
  } catch (error) {
    console.error('Update content stats error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add comment to content
router.post('/content/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, comment, parentId } = req.body;
    
    if (!userId || !comment) {
      return res.status(400).json({ success: false, error: 'User ID and comment required' });
    }
    
    const result = await ugcEngine.addComment(id, userId, comment, parentId);
    
    res.json({
      success: true,
      data: result,
      message: result.status === 'approved' ? 'Comment added successfully' : 'Comment submitted for review'
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Report content
router.post('/content/:id/report', async (req, res) => {
  try {
    const { id } = req.params;
    const { reporterId, reason, description } = req.body;
    
    if (!reporterId || !reason) {
      return res.status(400).json({ success: false, error: 'Reporter ID and reason required' });
    }
    
    await ugcEngine.reportContent(id, reporterId, reason, description);
    
    res.json({ success: true, message: 'Content reported successfully' });
  } catch (error) {
    console.error('Report content error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get community statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await ugcEngine.getCommunityStats();
    
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Get community stats error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;