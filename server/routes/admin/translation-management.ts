/**
 * TRANSLATION MANAGEMENT API - BILLION-DOLLAR ENTERPRISE GRADE
 * 
 * Complete API for managing translations, cultural mappings, and 
 * localization with enterprise AI-powered auto-translation.
 */

import { Router } from 'express';
import { storage } from '../../storage';

const router = Router();

/**
 * GET /api/admin/translation-keys
 * Get all translation keys with filtering and pagination
 */
router.get('/translation-keys', async (req, res) => {
  try {
    const { category, priority, search, page = 1, limit = 100 } = req.query;
    
    // Get translation keys with advanced filtering
    const keys = await storage.getTranslationKeys({
      category: category as string,
      priority: priority ? parseInt(priority as string) : undefined,
      search: search as string,
      page: parseInt(page as string),
      limit: parseInt(limit as string)
    });
    
    res.json({
      success: true,
      data: keys,
      metadata: {
        totalCount: keys.length,
        page: parseInt(page as string),
        limit: parseInt(limit as string)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get translation keys'
    });
  }
});

/**
 * GET /api/admin/translations
 * Get translations for a specific language
 */
router.get('/translations', async (req, res) => {
  try {
    const { language, keyIds, status } = req.query;
    
    if (!language) {
      return res.status(400).json({
        success: false,
        error: 'Language parameter is required'
      });
    }
    
    const translations = await storage.getTranslations({
      languageCode: language as string,
      keyIds: keyIds ? (keyIds as string).split(',').map(id => parseInt(id)) : undefined,
      status: status as string
    });
    
    res.json({
      success: true,
      data: translations || []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get translations'
    });
  }
});

/**
 * GET /api/admin/missing-translations
 * Get missing translations for optimization
 */
router.get('/missing-translations', async (req, res) => {
  try {
    const { language } = req.query;
    
    if (!language) {
      return res.status(400).json({
        success: false,
        error: 'Language parameter is required'
      });
    }
    
    const missingTranslations = await storage.getMissingTranslations(language as string);
    
    res.json({
      success: true,
      data: missingTranslations || []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get missing translations'
    });
  }
});

/**
 * GET /api/admin/translation-stats
 * Get comprehensive translation statistics
 */
router.get('/translation-stats', async (req, res) => {
  try {
    const { language } = req.query;
    
    const stats = await storage.getTranslationStats(language as string);
    
    res.json({
      success: true,
      data: stats || {
        totalKeys: 0,
        translatedKeys: 0,
        missingTranslations: 0,
        completionPercentage: 0,
        lastUpdated: new Date().toISOString(),
        pendingReviews: 0,
        autoTranslatedCount: 0,
        qualityScore: 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get translation stats'
    });
  }
});

/**
 * POST /api/admin/auto-translate
 * Auto-translate missing translations using enterprise AI
 */
router.post('/auto-translate', async (req, res) => {
  try {
    const { keyPaths, targetLanguage, useAdvancedAI = true, contextAware = true, culturalOptimization = true } = req.body;
    
    if (!keyPaths || !Array.isArray(keyPaths) || keyPaths.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'keyPaths array is required'
      });
    }
    
    if (!targetLanguage) {
      return res.status(400).json({
        success: false,
        error: 'targetLanguage is required'
      });
    }
    
    // Enterprise AI auto-translation
    const translationResults = await storage.autoTranslateKeys({
      keyPaths,
      targetLanguage,
      options: {
        useAdvancedAI,
        contextAware,
        culturalOptimization,
        qualityThreshold: 0.9
      }
    });
    
    res.json({
      success: true,
      data: {
        translatedCount: translationResults.length,
        results: translationResults,
        language: targetLanguage,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Auto-translation failed'
    });
  }
});

/**
 * POST /api/admin/translations
 * Create or update a translation
 */
router.post('/translations', async (req, res) => {
  try {
    const { keyId, languageCode, translatedValue, isVerified = false } = req.body;
    
    if (!keyId || !languageCode || !translatedValue) {
      return res.status(400).json({
        success: false,
        error: 'keyId, languageCode, and translatedValue are required'
      });
    }
    
    const translation = await storage.createOrUpdateTranslation({
      keyId: parseInt(keyId),
      languageCode,
      translatedValue,
      isVerified,
      isAutoTranslated: false,
      quality: 100
    });
    
    res.json({
      success: true,
      data: translation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create/update translation'
    });
  }
});

/**
 * PUT /api/admin/translations/:id
 * Update a specific translation
 */
router.put('/translations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const translation = await storage.updateTranslation(parseInt(id), updateData);
    
    res.json({
      success: true,
      data: translation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update translation'
    });
  }
});

/**
 * GET /api/admin/export-translations
 * Export translations in various formats
 */
router.get('/export-translations', async (req, res) => {
  try {
    const { language, format = 'json' } = req.query;
    
    const translations = await storage.exportTranslations({
      languageCode: language as string,
      format: format as 'json' | 'csv' | 'xml'
    });
    
    // Set appropriate headers based on format
    const contentTypes = {
      json: 'application/json',
      csv: 'text/csv',
      xml: 'application/xml'
    };
    
    const fileExtensions = {
      json: 'json',
      csv: 'csv',
      xml: 'xml'
    };
    
    res.setHeader('Content-Type', contentTypes[format as keyof typeof contentTypes]);
    res.setHeader('Content-Disposition', `attachment; filename="translations_${language}.${fileExtensions[format as keyof typeof fileExtensions]}"`);
    
    res.send(translations);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to export translations'
    });
  }
});

export default router;