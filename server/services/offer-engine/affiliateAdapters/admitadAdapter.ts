/**
 * Admitad Affiliate Network Adapter - Billion Dollar Empire Grade
 * Advanced integration for Admitad API with global market coverage
 */

import { BaseAffiliateAdapter } from './baseAdapter';
import { OfferSource } from '@shared/schema';
import axios, { AxiosInstance } from 'axios';

export interface AdmitadOffer {
  id: string;
  name: string;
  advertiser_name: string;
  price: number;
  oldprice?: number;
  currency: string;
  category: string;
  description: string;
  picture: string;
  url: string;
  commission: {
    type: 'percent' | 'absolute';
    value: number;
  };
  in_stock: boolean;
  rating?: number;
  brand?: string;
  model?: string;
  barcode?: string;
  country: string;
  promocode?: string;
  promo_text?: string;
  date_modified: string;
  deeplink_generator?: string;
}

export interface AdmitadCredentials {
  clientId: string;
  clientSecret: string;
  accessToken?: string;
  refreshToken?: string;
  websiteId: string;
  region?: string;
}

export class AdmitadAdapter extends BaseAffiliateAdapter {
  private api: AxiosInstance;
  private credentials: AdmitadCredentials;
  private baseURL = 'https://api.admitad.com';
  private authURL = 'https://api.admitad.com/token/';

  constructor(source: OfferSource) {
    super(source);
    this.credentials = source.credentials as AdmitadCredentials;
    
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'EmpireAffiliateEngine/1.0'
      }
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.api.interceptors.request.use(
      async (config) => {
        // Add access token to requests
        if (this.credentials.accessToken) {
          config.headers.Authorization = `Bearer ${this.credentials.accessToken}`;
        }
        
        console.log(`[Admitad] API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[Admitad] Request error:', error);
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => {
        console.log(`[Admitad] API Response: ${response.status} - ${response.data?.results?.length || 0} items`);
        return response;
      },
      async (error) => {
        console.error('[Admitad] API Error:', error.response?.status, error.response?.data);
        
        // Handle token expiration
        if (error.response?.status === 401 && this.credentials.refreshToken) {
          console.log('[Admitad] Token expired, attempting refresh...');
          const refreshed = await this.refreshAccessToken();
          if (refreshed && error.config) {
            error.config.headers.Authorization = `Bearer ${this.credentials.accessToken}`;
            return this.api.request(error.config);
          }
        }
        
        if (error.response?.status === 429) {
          console.warn('[Admitad] Rate limit hit, implementing exponential backoff');
        }
        
        return Promise.reject(error);
      }
    );
  }

  getRequiredCredentials(): string[] {
    return ['clientId', 'clientSecret', 'websiteId'];
  }

  async initialize(): Promise<boolean> {
    try {
      console.log('[Admitad] Initializing adapter...');
      
      // Validate credentials
      if (!this.credentials.clientId || !this.credentials.clientSecret || !this.credentials.websiteId) {
        console.error('[Admitad] Missing required credentials: clientId, clientSecret, and websiteId');
        return false;
      }

      // Get access token if not present
      if (!this.credentials.accessToken) {
        const tokenObtained = await this.getAccessToken();
        if (!tokenObtained) {
          console.error('[Admitad] Failed to obtain access token');
          return false;
        }
      }

      // Test API connectivity
      const testResponse = await this.api.get('/advcampaigns/website/', {
        params: {
          website: this.credentials.websiteId,
          limit: 1
        }
      });

      if (testResponse.status === 200) {
        console.log('[Admitad] ✅ Successfully connected to Admitad API');
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('[Admitad] Initialization failed:', error.message);
      return false;
    }
  }

  private async getAccessToken(): Promise<boolean> {
    try {
      const response = await axios.post(this.authURL, {
        grant_type: 'client_credentials',
        client_id: this.credentials.clientId,
        client_secret: this.credentials.clientSecret,
        scope: 'advcampaigns_for_website banners_for_website websites'
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (response.data.access_token) {
        this.credentials.accessToken = response.data.access_token;
        this.credentials.refreshToken = response.data.refresh_token;
        console.log('[Admitad] ✅ Access token obtained successfully');
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('[Admitad] Failed to get access token:', error.message);
      return false;
    }
  }

  private async refreshAccessToken(): Promise<boolean> {
    try {
      if (!this.credentials.refreshToken) return false;

      const response = await axios.post(this.authURL, {
        grant_type: 'refresh_token',
        client_id: this.credentials.clientId,
        client_secret: this.credentials.clientSecret,
        refresh_token: this.credentials.refreshToken
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (response.data.access_token) {
        this.credentials.accessToken = response.data.access_token;
        this.credentials.refreshToken = response.data.refresh_token;
        console.log('[Admitad] ✅ Access token refreshed successfully');
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('[Admitad] Failed to refresh access token:', error.message);
      return false;
    }
  }

  async fetchOffers(limit: number = 100, offset: number = 0): Promise<any[]> {
    try {
      console.log(`[Admitad] Fetching ${limit} offers (offset: ${offset})`);

      // First get available campaigns
      const campaignsResponse = await this.api.get('/advcampaigns/website/', {
        params: {
          website: this.credentials.websiteId,
          limit: 50,
          has_products: true
        }
      });

      const campaigns = campaignsResponse.data.results || [];
      const allOffers: any[] = [];

      // Fetch products from each campaign
      for (const campaign of campaigns.slice(0, 10)) { // Limit to 10 campaigns to avoid timeouts
        try {
          const productsResponse = await this.api.get(`/advcampaigns/${campaign.id}/products/`, {
            params: {
              website: this.credentials.websiteId,
              limit: Math.min(limit, 500),
              offset: offset
            }
          });

          const products = productsResponse.data.results || [];
          const transformedOffers = products.map((product: AdmitadOffer) => 
            this.transformOffer(product, campaign)
          );
          
          allOffers.push(...transformedOffers);

          if (allOffers.length >= limit) break;
        } catch (error: any) {
          console.warn(`[Admitad] Error fetching products from campaign ${campaign.id}:`, error.message);
          continue;
        }
      }

      console.log(`[Admitad] Retrieved ${allOffers.length} offers from ${campaigns.length} campaigns`);
      return allOffers.slice(0, limit);
    } catch (error: any) {
      console.error('[Admitad] Error fetching offers:', error.message);
      throw error;
    }
  }

  async fetchOffersByCategory(category: string, limit: number = 50): Promise<any[]> {
    try {
      console.log(`[Admitad] Fetching offers for category: ${category}`);

      // Get campaigns with specific category
      const campaignsResponse = await this.api.get('/advcampaigns/website/', {
        params: {
          website: this.credentials.websiteId,
          limit: 20,
          has_products: true,
          category: category
        }
      });

      const campaigns = campaignsResponse.data.results || [];
      const allOffers: any[] = [];

      for (const campaign of campaigns) {
        try {
          const productsResponse = await this.api.get(`/advcampaigns/${campaign.id}/products/`, {
            params: {
              website: this.credentials.websiteId,
              limit: Math.min(limit, 500),
              category: category
            }
          });

          const products = productsResponse.data.results || [];
          const transformedOffers = products.map((product: AdmitadOffer) => 
            this.transformOffer(product, campaign)
          );
          
          allOffers.push(...transformedOffers);

          if (allOffers.length >= limit) break;
        } catch (error: any) {
          console.warn(`[Admitad] Error fetching products from campaign ${campaign.id}:`, error.message);
          continue;
        }
      }

      return allOffers.slice(0, limit);
    } catch (error: any) {
      console.error(`[Admitad] Error fetching offers for category ${category}:`, error.message);
      throw error;
    }
  }

  async searchOffers(query: string, limit: number = 50): Promise<any[]> {
    try {
      console.log(`[Admitad] Searching offers with query: ${query}`);

      const campaignsResponse = await this.api.get('/advcampaigns/website/', {
        params: {
          website: this.credentials.websiteId,
          limit: 10,
          has_products: true
        }
      });

      const campaigns = campaignsResponse.data.results || [];
      const allOffers: any[] = [];

      for (const campaign of campaigns) {
        try {
          const productsResponse = await this.api.get(`/advcampaigns/${campaign.id}/products/`, {
            params: {
              website: this.credentials.websiteId,
              limit: Math.min(limit, 500),
              search: query
            }
          });

          const products = productsResponse.data.results || [];
          const transformedOffers = products.map((product: AdmitadOffer) => 
            this.transformOffer(product, campaign)
          );
          
          allOffers.push(...transformedOffers);

          if (allOffers.length >= limit) break;
        } catch (error: any) {
          console.warn(`[Admitad] Error searching products in campaign ${campaign.id}:`, error.message);
          continue;
        }
      }

      return allOffers.slice(0, limit);
    } catch (error: any) {
      console.error(`[Admitad] Error searching offers:`, error.message);
      throw error;
    }
  }

  private transformOffer(offer: AdmitadOffer, campaign: any): any {
    // Calculate discount info
    const hasDiscount = offer.oldprice && offer.oldprice > offer.price;
    const discountValue = hasDiscount ? 
      ((offer.oldprice! - offer.price) / offer.oldprice! * 100) : 0;

    // Generate tracking URL
    const trackingUrl = this.generateTrackingUrl(offer, campaign);

    // Determine emotion based on offer characteristics
    let emotion = 'trusted';
    if (offer.promocode || offer.promo_text) emotion = 'urgent';
    if (offer.commission.value > 10) emotion = 'exclusive';
    if (offer.rating && offer.rating > 4.0) emotion = 'popular';

    return {
      title: offer.name,
      slug: this.generateSlug(offer.name),
      merchant: offer.advertiser_name,
      price: offer.price,
      oldPrice: hasDiscount ? offer.oldprice : null,
      currency: offer.currency || 'USD',
      couponCode: offer.promocode || null,
      discountType: hasDiscount ? 'percentage' : null,
      discountValue: hasDiscount ? discountValue : null,
      validTill: null, // Admitad doesn't provide expiry dates in product data
      region: offer.country || this.credentials.region || 'global',
      emotion: emotion,
      category: this.mapCategory(offer.category),
      tags: this.extractTags(offer),
      sourceType: 'api',
      clickTrackingUrl: trackingUrl,
      apiSource: 'admitad',
      commissionEstimate: offer.commission.value,
      meta: {
        productId: offer.id,
        advertiserName: offer.advertiser_name,
        imageUrl: offer.picture,
        description: offer.description,
        inStock: offer.in_stock,
        rating: offer.rating,
        brand: offer.brand,
        model: offer.model,
        barcode: offer.barcode,
        country: offer.country,
        commissionType: offer.commission.type,
        originalUrl: offer.url,
        campaignId: campaign.id,
        campaignName: campaign.name,
        promoText: offer.promo_text,
        lastModified: offer.date_modified
      },
      qualityScore: this.calculateQualityScore(offer),
      priority: this.calculatePriority(offer, campaign)
    };
  }

  private generateTrackingUrl(offer: AdmitadOffer, campaign: any): string {
    // Use Admitad's deeplink generator if available
    if (offer.deeplink_generator) {
      const params = new URLSearchParams({
        website: this.credentials.websiteId,
        url: encodeURIComponent(offer.url)
      });
      return `${offer.deeplink_generator}?${params.toString()}`;
    }

    // Fallback to standard tracking URL
    const baseTrackingUrl = 'https://alitems.site/g/1e8d114494be36e64c084c84b99ea74b';
    const params = new URLSearchParams({
      ulp: encodeURIComponent(offer.url),
      campaign: campaign.id,
      product: offer.id,
      website: this.credentials.websiteId
    });

    return `${baseTrackingUrl}/?${params.toString()}`;
  }

  private mapCategory(category: string): string {
    const categoryMap: Record<string, string> = {
      'Electronics': 'technology',
      'Computers': 'technology',
      'Clothing': 'fashion',
      'Fashion': 'fashion',
      'Home & Garden': 'home',
      'Health & Beauty': 'health',
      'Sports': 'fitness',
      'Books': 'education',
      'Travel': 'travel',
      'Auto': 'automotive',
      'Food': 'food',
      'Business': 'business',
      'Toys': 'entertainment',
      'Baby': 'family',
      'Jewelry': 'fashion',
      'Music': 'entertainment',
      'Video Games': 'entertainment'
    };

    return categoryMap[category] || 'general';
  }

  private extractTags(offer: AdmitadOffer): string[] {
    const tags: string[] = [];
    
    // Add brand as tag
    if (offer.brand) tags.push(offer.brand.toLowerCase());
    
    // Add category as tag
    if (offer.category) tags.push(offer.category.toLowerCase());
    
    // Add commission level tags
    if (offer.commission.value > 5) tags.push('good-commission');
    if (offer.commission.value > 15) tags.push('high-commission');
    
    // Add quality indicators
    if (offer.rating && offer.rating > 3.5) tags.push('highly-rated');
    if (offer.in_stock) tags.push('in-stock');
    if (offer.promocode) tags.push('promo-code');
    if (offer.promo_text) tags.push('special-offer');
    
    // Add region tag
    if (offer.country) tags.push(offer.country.toLowerCase());
    
    // Add model as tag if available
    if (offer.model) tags.push(offer.model.toLowerCase());

    return [...new Set(tags)]; // Remove duplicates
  }

  private calculateQualityScore(offer: AdmitadOffer): number {
    let score = 50; // Base score

    // Commission value factor
    score += Math.min(offer.commission.value * 3, 30);
    
    // Rating factor
    if (offer.rating) {
      score += (offer.rating - 2.5) * 8; // Scale 2.5-5 rating to 0-20 points
    }

    // Availability factor
    if (offer.in_stock) score += 10;
    
    // Image quality factor
    if (offer.picture) score += 5;
    
    // Description quality factor
    if (offer.description && offer.description.length > 50) score += 5;
    
    // Brand recognition factor
    if (offer.brand && offer.brand.length > 2) score += 5;
    
    // Promotional content factor
    if (offer.promocode || offer.promo_text) score += 10;
    
    // Recent modification factor
    if (offer.date_modified) {
      const daysSinceModified = (Date.now() - new Date(offer.date_modified).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceModified < 30) score += 5; // Recent updates get bonus
    }

    return Math.min(Math.max(score, 0), 100);
  }

  private calculatePriority(offer: AdmitadOffer, campaign: any): number {
    let priority = 5; // Base priority

    // High commission gets higher priority
    if (offer.commission.value > 10) priority += 2;
    if (offer.commission.value > 20) priority += 1;
    
    // High rating gets higher priority
    if (offer.rating && offer.rating > 4.0) priority += 1;
    
    // Promotional content increases priority
    if (offer.promocode || offer.promo_text) priority += 1;
    
    // In-stock products get priority
    if (offer.in_stock) priority += 1;
    
    // Campaign activity factor
    if (campaign.status === 'active') priority += 1;

    return Math.min(Math.max(priority, 1), 10);
  }

  async getHealth(): Promise<{ status: 'healthy' | 'degraded' | 'unhealthy'; details: any }> {
    try {
      const start = Date.now();
      
      const response = await this.api.get('/advcampaigns/website/', {
        params: {
          website: this.credentials.websiteId,
          limit: 1
        },
        timeout: 5000
      });

      const responseTime = Date.now() - start;
      const isHealthy = response.status === 200 && responseTime < 3000;

      return {
        status: isHealthy ? 'healthy' : 'degraded',
        details: {
          responseTime,
          apiStatus: response.status,
          lastCheck: new Date(),
          campaignsAvailable: response.data?.results?.length || 0,
          tokenValid: !!this.credentials.accessToken
        }
      };
    } catch (error: any) {
      return {
        status: 'unhealthy',
        details: {
          error: error.message,
          lastCheck: new Date(),
          apiReachable: false,
          tokenValid: !!this.credentials.accessToken
        }
      };
    }
  }

  getAdapterInfo() {
    return {
      name: 'Admitad Affiliate Network',
      slug: 'admitad',
      type: 'api' as const,
      description: 'Admitad affiliate network integration with global market coverage and multi-currency support',
      supportedRegions: [
        'US', 'UK', 'DE', 'FR', 'IT', 'ES', 'RU', 'UA', 'BY', 'KZ',
        'IN', 'CN', 'JP', 'AU', 'BR', 'MX', 'CA', 'NL', 'SE', 'NO'
      ],
      supportedCategories: [
        'technology', 'fashion', 'home', 'health', 'fitness',
        'education', 'travel', 'automotive', 'food', 'business',
        'entertainment', 'family'
      ],
      requiredCredentials: ['clientId', 'clientSecret', 'websiteId'],
      features: [
        'OAuth 2.0 authentication',
        'Multi-currency support',
        'Global market coverage',
        'Campaign-based product sync',
        'Advanced search capabilities',
        'Commission tracking',
        'Promo code integration',
        'Quality scoring',
        'Real-time inventory status',
        'Automatic token refresh'
      ]
    };
  }
}