/**
 * PR OUTREACH API ROUTES - EMPIRE GRADE
 * Complete API endpoints for PR Outreach Bot functionality
 */

import express from 'express';
import { prOutreachBot } from '../services/traffic-generators/prOutreachBot';

const router = express.Router();

// Initialize PR Outreach Bot
prOutreachBot.initialize().catch(console.error);

// Create new PR campaign
router.post('/campaigns', async (req, res) => {
  try {
    const userId = req.body.userId;
    
    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID required' });
    }
    
    const campaign = await prOutreachBot.createCampaign(userId, req.body);
    
    res.json({
      success: true,
      data: campaign,
      message: 'PR campaign created successfully'
    });
  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user campaigns
router.get('/campaigns', async (req, res) => {
  try {
    const userId = req.query.userId as string;
    
    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID required' });
    }
    
    const campaigns = await prOutreachBot.getCampaigns(userId);
    
    res.json({ success: true, data: campaigns });
  } catch (error) {
    console.error('Get campaigns error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Launch PR campaign
router.post('/campaigns/:id/launch', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.body.userId;
    
    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID required' });
    }
    
    await prOutreachBot.launchCampaign(id, userId);
    
    res.json({ success: true, message: 'Campaign launched successfully' });
  } catch (error) {
    console.error('Launch campaign error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get campaign analytics
router.get('/campaigns/:id/analytics', async (req, res) => {
  try {
    const { id } = req.params;
    
    const analytics = await prOutreachBot.getCampaignAnalytics(id);
    
    res.json({ success: true, data: analytics });
  } catch (error) {
    console.error('Get campaign analytics error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Track email open
router.get('/track/open/:trackingId', async (req, res) => {
  try {
    const { trackingId } = req.params;
    
    await prOutreachBot.trackOpen(trackingId);
    
    // Return 1x1 transparent pixel
    const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    res.set('Content-Type', 'image/gif');
    res.set('Content-Length', pixel.length.toString());
    res.send(pixel);
  } catch (error) {
    console.error('Track open error:', error);
    res.status(500).send('Error');
  }
});

// Track email click
router.get('/track/click/:trackingId', async (req, res) => {
  try {
    const { trackingId } = req.params;
    const redirectUrl = req.query.url as string;
    
    await prOutreachBot.trackClick(trackingId);
    
    if (redirectUrl) {
      res.redirect(redirectUrl);
    } else {
      res.json({ success: true, message: 'Click tracked' });
    }
  } catch (error) {
    console.error('Track click error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;