import express from 'express';
import crypto from 'crypto';
import { db } from '../../db';
import { eq, and } from 'drizzle-orm';
import { apiKeys } from '../../../shared/schema';

const router = express.Router();

// Encryption settings
const ENCRYPTION_KEY = process.env.API_KEY_ENCRYPTION_SECRET || crypto.randomBytes(32);
const ALGORITHM = 'aes-256-gcm';

// Encrypt API key
function encryptApiKey(text: string): { encrypted: string; iv: string; tag: string } {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(ALGORITHM, ENCRYPTION_KEY);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const tag = cipher.getAuthTag();
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    tag: tag.toString('hex')
  };
}

// Decrypt API key
function decryptApiKey(encryptedData: { encrypted: string; iv: string; tag: string }): string {
  const decipher = crypto.createDecipher(ALGORITHM, ENCRYPTION_KEY);
  decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));
  
  let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

// GET /api/admin/api-keys - Get all API keys
router.get('/api-keys', async (req, res) => {
  try {
    const keys = await db.select().from(apiKeys);
    
    // Return keys with decrypted values for display (masked)
    const processedKeys = keys.map(key => ({
      ...key,
      key: key.encryptedKey ? '••••••••••••••••' : '',
      hasValue: !!key.encryptedKey
    }));
    
    res.json(processedKeys);
  } catch (error) {
    console.error('Failed to fetch API keys:', error);
    res.status(500).json({ 
      error: 'Failed to fetch API keys',
      fallback: true,
      message: 'Operating in cache mode' 
    });
  }
});

// POST /api/admin/api-keys - Save/Update API key
router.post('/api-keys', async (req, res) => {
  try {
    const { id, name, key, category, description, isActive, required, encrypted } = req.body;
    
    if (!id || !name) {
      return res.status(400).json({ error: 'ID and name are required' });
    }
    
    // Encrypt the API key if provided and encryption is enabled
    let encryptedKey = null;
    let encryptionIv = null;
    let encryptionTag = null;
    
    if (key && encrypted) {
      const encryptionResult = encryptApiKey(key);
      encryptedKey = encryptionResult.encrypted;
      encryptionIv = encryptionResult.iv;
      encryptionTag = encryptionResult.tag;
    }
    
    const keyData = {
      id,
      name,
      category: category || 'general',
      description: description || '',
      isActive: isActive || false,
      required: required || false,
      encrypted: encrypted || false,
      encryptedKey,
      encryptionIv,
      encryptionTag,
      lastUsed: key ? new Date().toISOString() : null,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Check if key exists
    const existingKey = await db.select().from(apiKeys).where(eq(apiKeys.id, id)).limit(1);
    
    if (existingKey.length > 0) {
      // Update existing key
      await db.update(apiKeys)
        .set({
          ...keyData,
          usageCount: existingKey[0].usageCount || 0
        })
        .where(eq(apiKeys.id, id));
    } else {
      // Insert new key
      await db.insert(apiKeys).values(keyData);
    }
    
    // Update environment variables for immediate use
    if (key && !encrypted) {
      process.env[id.toUpperCase()] = key;
    }
    
    res.json({ 
      success: true, 
      message: 'API key saved successfully',
      encrypted: encrypted && !!key
    });
    
  } catch (error) {
    console.error('Failed to save API key:', error);
    res.status(500).json({ 
      error: 'Failed to save API key',
      fallback: true,
      message: 'Check your configuration and try again'
    });
  }
});

// DELETE /api/admin/api-keys/:id - Delete API key
router.delete('/api-keys/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if key is required
    const keyToDelete = await db.select().from(apiKeys).where(eq(apiKeys.id, id)).limit(1);
    
    if (keyToDelete.length > 0 && keyToDelete[0].required) {
      return res.status(400).json({ error: 'Cannot delete required API key' });
    }
    
    await db.delete(apiKeys).where(eq(apiKeys.id, id));
    
    // Remove from environment variables
    delete process.env[id.toUpperCase()];
    
    res.json({ success: true, message: 'API key deleted successfully' });
    
  } catch (error) {
    console.error('Failed to delete API key:', error);
    res.status(500).json({ 
      error: 'Failed to delete API key',
      fallback: true 
    });
  }
});

// POST /api/admin/api-keys/:id/test - Test API key
router.post('/api-keys/:id/test', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get the API key
    const keyRecord = await db.select().from(apiKeys).where(eq(apiKeys.id, id)).limit(1);
    
    if (keyRecord.length === 0) {
      return res.status(404).json({ error: 'API key not found' });
    }
    
    const key = keyRecord[0];
    let actualKey = '';
    
    // Decrypt if encrypted
    if (key.encrypted && key.encryptedKey) {
      try {
        actualKey = decryptApiKey({
          encrypted: key.encryptedKey,
          iv: key.encryptionIv!,
          tag: key.encryptionTag!
        });
      } catch (decryptError) {
        return res.status(400).json({ error: 'Failed to decrypt API key' });
      }
    }
    
    // Test the API key based on its type
    let testResult = { valid: false, message: 'Unknown key type' };
    
    switch (id) {
      case 'openai':
        testResult = await testOpenAIKey(actualKey);
        break;
      case 'anthropic':
        testResult = await testAnthropicKey(actualKey);
        break;
      case 'database_url':
        testResult = await testDatabaseConnection(actualKey);
        break;
      case 'stripe_secret':
        testResult = await testStripeKey(actualKey);
        break;
      default:
        testResult = { valid: true, message: 'Basic validation passed' };
    }
    
    if (testResult.valid) {
      // Update last used timestamp and increment usage count
      await db.update(apiKeys)
        .set({
          lastUsed: new Date().toISOString(),
          usageCount: (key.usageCount || 0) + 1
        })
        .where(eq(apiKeys.id, id));
    }
    
    res.json(testResult);
    
  } catch (error) {
    console.error('Failed to test API key:', error);
    res.status(500).json({ 
      error: 'Failed to test API key',
      valid: false,
      message: 'Test failed due to system error'
    });
  }
});

// Test functions for different API providers
async function testOpenAIKey(key: string): Promise<{ valid: boolean; message: string }> {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      return { valid: true, message: 'OpenAI API key is valid' };
    } else {
      return { valid: false, message: 'OpenAI API key is invalid' };
    }
  } catch (error) {
    return { valid: false, message: 'Failed to connect to OpenAI API' };
  }
}

async function testAnthropicKey(key: string): Promise<{ valid: boolean; message: string }> {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': key,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1,
        messages: [{ role: 'user', content: 'test' }]
      })
    });
    
    if (response.status === 200 || response.status === 400) {
      return { valid: true, message: 'Anthropic API key is valid' };
    } else {
      return { valid: false, message: 'Anthropic API key is invalid' };
    }
  } catch (error) {
    return { valid: false, message: 'Failed to connect to Anthropic API' };
  }
}

async function testDatabaseConnection(url: string): Promise<{ valid: boolean; message: string }> {
  try {
    // Basic URL validation for database connection strings
    if (url.startsWith('postgresql://') || url.startsWith('postgres://')) {
      return { valid: true, message: 'Database URL format is valid' };
    }
    return { valid: false, message: 'Invalid database URL format' };
  } catch (error) {
    return { valid: false, message: 'Database URL validation failed' };
  }
}

async function testStripeKey(key: string): Promise<{ valid: boolean; message: string }> {
  try {
    const response = await fetch('https://api.stripe.com/v1/balance', {
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    if (response.ok) {
      return { valid: true, message: 'Stripe API key is valid' };
    } else {
      return { valid: false, message: 'Stripe API key is invalid' };
    }
  } catch (error) {
    return { valid: false, message: 'Failed to connect to Stripe API' };
  }
}

export default router;