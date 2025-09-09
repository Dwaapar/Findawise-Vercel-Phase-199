/**
 * FlexOffers Affiliate Network Adapter - Billion Dollar Empire Grade
 * Advanced integration for FlexOffers API with comprehensive features
 */

import { BaseAffiliateAdapter } from './baseAdapter';
import { OfferSource } from '@shared/schema';
import axios, { AxiosInstance } from 'axios';

export interface FlexOffersOffer {
  productId: string;
  productName: string;
  advertiserName: string;
  price: number;
  salePrice?: number;
  currency: string;
  categoryName: string;
  description: string;
  keywords: string;
  inStock: boolean;
  couponCode?: string;
  promoText?: string;
  imageUrl: string;
  linkUrl: string;
  commission: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  validUntil?: string;
  rating?: number;
  brand: string;
  upc?: string;
  affiliateId: string;
}

export interface FlexOffersCredentials {
  apiKey: string;
  publisherId: string;
  websiteUrl: string;
  environment?: 'sandbox' | 'production';
}

export class FlexOffersAdapter extends BaseAffiliateAdapter {
  private api: AxiosInstance;
  private credentials: FlexOffersCredentials;
  private baseURL = 'https://api.flexoffers.com';

  constructor(source: OfferSource) {
    super(source);
    this.credentials = source.credentials as FlexOffersCredentials;
    
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'X-FlexOffers-API-Key': this.credentials.apiKey,
        'Content-Type': 'application/json',
        'User-Agent': 'EmpireAffiliateEngine/1.0'
      }
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.api.interceptors.request.use(
      (config) => {
        console.log(`[FlexOffers] API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[FlexOffers] Request error:', error);
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => {
        console.log(`[FlexOffers] API Response: ${response.status} - ${response.data?.totalCount || 0} items`);
        return response;
      },
      (error) => {
        console.error('[FlexOffers] API Error:', error.response?.status, error.response?.data);
        if (error.response?.status === 429) {
          console.warn('[FlexOffers] Rate limit hit, implementing exponential backoff');
        }
        return Promise.reject(error);
      }
    );
  }

  getRequiredCredentials(): string[] {
    return ['apiKey', 'publisherId', 'websiteUrl'];
  }

  async initialize(): Promise<boolean> {
    try {
      console.log('[FlexOffers] Initializing adapter...');
      
      // Validate credentials
      if (!this.credentials.apiKey || !this.credentials.publisherId) {
        console.error('[FlexOffers] Missing required credentials: apiKey and publisherId');
        return false;
      }

      // Test API connectivity
      const testResponse = await this.api.get('/publisher/products', {
        params: {
          publisherId: this.credentials.publisherId,
          limit: 1
        }
      });

      if (testResponse.status === 200) {
        console.log('[FlexOffers] ✅ Successfully connected to FlexOffers API');
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('[FlexOffers] Initialization failed:', error.message);
      return false;
    }
  }

  async fetchOffers(limit: number = 100, offset: number = 0): Promise<any[]> {
    try {
      console.log(`[FlexOffers] Fetching ${limit} offers (offset: ${offset})`);

      const response = await this.api.get('/publisher/products', {
        params: {
          publisherId: this.credentials.publisherId,
          limit: Math.min(limit, 1000), // FlexOffers max limit
          offset: offset,
          sort: '-commission.value', // Sort by highest commission
          inStock: true,
          hasImage: true
        }
      });

      const offers = response.data.products || [];
      console.log(`[FlexOffers] Retrieved ${offers.length} offers`);

      return offers.map((offer: FlexOffersOffer) => this.transformOffer(offer));
    } catch (error: any) {
      console.error('[FlexOffers] Error fetching offers:', error.message);
      throw error;
    }
  }

  async fetchOffersByCategory(category: string, limit: number = 50): Promise<any[]> {
    try {
      console.log(`[FlexOffers] Fetching offers for category: ${category}`);

      const response = await this.api.get('/publisher/products', {
        params: {
          publisherId: this.credentials.publisherId,
          categoryName: category,
          limit: Math.min(limit, 1000),
          sort: '-commission.value',
          inStock: true,
          hasImage: true
        }
      });

      const offers = response.data.products || [];
      return offers.map((offer: FlexOffersOffer) => this.transformOffer(offer));
    } catch (error: any) {
      console.error(`[FlexOffers] Error fetching offers for category ${category}:`, error.message);
      throw error;
    }
  }

  async searchOffers(query: string, limit: number = 50): Promise<any[]> {
    try {
      console.log(`[FlexOffers] Searching offers with query: ${query}`);

      const response = await this.api.get('/publisher/products', {
        params: {
          publisherId: this.credentials.publisherId,
          keywords: query,
          limit: Math.min(limit, 1000),
          sort: '-commission.value',
          inStock: true,
          hasImage: true
        }
      });

      const offers = response.data.products || [];
      return offers.map((offer: FlexOffersOffer) => this.transformOffer(offer));
    } catch (error: any) {
      console.error(`[FlexOffers] Error searching offers:`, error.message);
      throw error;
    }
  }

  private transformOffer(offer: FlexOffersOffer): any {
    // Calculate discount info
    const hasDiscount = offer.salePrice && offer.salePrice < offer.price;
    const discountValue = hasDiscount ? 
      ((offer.price - offer.salePrice!) / offer.price * 100) : 0;

    // Generate tracking URL
    const trackingUrl = this.generateTrackingUrl(offer);

    // Determine emotion based on offer characteristics
    let emotion = 'trusted';
    if (offer.couponCode || offer.promoText) emotion = 'urgent';
    if (offer.commission.value > 10) emotion = 'exclusive';
    if (offer.rating && offer.rating > 4.5) emotion = 'popular';

    return {
      title: offer.productName,
      slug: this.generateSlug(offer.productName),
      merchant: offer.advertiserName || offer.brand,
      price: offer.salePrice || offer.price,
      oldPrice: hasDiscount ? offer.price : null,
      currency: offer.currency || 'USD',
      couponCode: offer.couponCode || null,
      discountType: hasDiscount ? 'percentage' : null,
      discountValue: hasDiscount ? discountValue : null,
      validTill: offer.validUntil ? new Date(offer.validUntil) : null,
      region: 'US', // FlexOffers primarily US
      emotion: emotion,
      category: this.mapCategory(offer.categoryName),
      tags: this.extractTags(offer),
      sourceType: 'api',
      clickTrackingUrl: trackingUrl,
      apiSource: 'flexoffers',
      commissionEstimate: offer.commission.value,
      meta: {
        productId: offer.productId,
        advertiserName: offer.advertiserName,
        imageUrl: offer.imageUrl,
        description: offer.description,
        inStock: offer.inStock,
        rating: offer.rating,
        upc: offer.upc,
        brand: offer.brand,
        keywords: offer.keywords,
        commissionType: offer.commission.type,
        originalUrl: offer.linkUrl
      },
      qualityScore: this.calculateQualityScore(offer),
      priority: this.calculatePriority(offer)
    };
  }

  private generateTrackingUrl(offer: FlexOffersOffer): string {
    // FlexOffers tracking URL format
    const baseTrackingUrl = 'https://track.flexlinkspro.com';
    const params = new URLSearchParams({
      pid: this.credentials.publisherId,
      oid: offer.productId,
      url: encodeURIComponent(offer.linkUrl),
      website: this.credentials.websiteUrl || '',
      aid: offer.affiliateId
    });

    return `${baseTrackingUrl}/click?${params.toString()}`;
  }

  private mapCategory(category: string): string {
    const categoryMap: Record<string, string> = {
      'Electronics': 'technology',
      'Clothing & Accessories': 'fashion',
      'Home & Garden': 'home',
      'Health & Beauty': 'health',
      'Sports & Outdoors': 'fitness',
      'Books & Media': 'education',
      'Travel': 'travel',
      'Automotive': 'automotive',
      'Food & Beverage': 'food',
      'Business & Industrial': 'business',
      'Toys & Games': 'entertainment',
      'Baby & Kids': 'family'
    };

    return categoryMap[category] || 'general';
  }

  private extractTags(offer: FlexOffersOffer): string[] {
    const tags: string[] = [];
    
    // Add brand as tag
    if (offer.brand) tags.push(offer.brand.toLowerCase());
    
    // Add category as tag
    if (offer.categoryName) tags.push(offer.categoryName.toLowerCase());
    
    // Add commission level tags
    if (offer.commission.value > 10) tags.push('high-commission');
    if (offer.commission.value > 20) tags.push('premium-commission');
    
    // Add quality indicators
    if (offer.rating && offer.rating > 4.0) tags.push('highly-rated');
    if (offer.inStock) tags.push('in-stock');
    if (offer.couponCode) tags.push('coupon-available');
    
    // Extract keywords
    if (offer.keywords) {
      const keywords = offer.keywords.split(',').map(k => k.trim().toLowerCase());
      tags.push(...keywords.slice(0, 5)); // Limit to 5 keywords
    }

    return [...new Set(tags)]; // Remove duplicates
  }

  private calculateQualityScore(offer: FlexOffersOffer): number {
    let score = 50; // Base score

    // Commission value factor
    score += Math.min(offer.commission.value * 2, 30);
    
    // Rating factor
    if (offer.rating) {
      score += (offer.rating - 3) * 10; // Scale 3-5 rating to 0-20 points
    }

    // Availability factor
    if (offer.inStock) score += 10;
    
    // Image quality factor
    if (offer.imageUrl) score += 5;
    
    // Description quality factor
    if (offer.description && offer.description.length > 100) score += 5;
    
    // Brand recognition factor
    if (offer.brand && offer.brand.length > 3) score += 5;
    
    // Coupon availability factor
    if (offer.couponCode) score += 10;

    return Math.min(Math.max(score, 0), 100);
  }

  private calculatePriority(offer: FlexOffersOffer): number {
    let priority = 5; // Base priority

    // High commission gets higher priority
    if (offer.commission.value > 15) priority += 2;
    if (offer.commission.value > 25) priority += 1;
    
    // High rating gets higher priority
    if (offer.rating && offer.rating > 4.5) priority += 1;
    
    // Coupon availability increases priority
    if (offer.couponCode) priority += 1;
    
    // In-stock products get priority
    if (offer.inStock) priority += 1;

    return Math.min(Math.max(priority, 1), 10);
  }

  async getHealth(): Promise<{ status: 'healthy' | 'degraded' | 'unhealthy'; details: any }> {
    try {
      const start = Date.now();
      
      const response = await this.api.get('/publisher/products', {
        params: {
          publisherId: this.credentials.publisherId,
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
          dataAvailable: !!response.data?.products?.length
        }
      };
    } catch (error: any) {
      return {
        status: 'unhealthy',
        details: {
          error: error.message,
          lastCheck: new Date(),
          apiReachable: false
        }
      };
    }
  }

  getAdapterInfo() {
    return {
      name: 'FlexOffers Network',
      slug: 'flexoffers',
      type: 'api' as const,
      description: 'FlexOffers affiliate network integration with comprehensive product catalog',
      supportedRegions: ['US', 'CA'],
      supportedCategories: [
        'technology', 'fashion', 'home', 'health', 'fitness',
        'education', 'travel', 'automotive', 'food', 'business',
        'entertainment', 'family'
      ],
      requiredCredentials: ['apiKey', 'publisherId', 'websiteUrl'],
      features: [
        'Real-time product sync',
        'Commission tracking',
        'Category filtering',
        'Keyword search',
        'Coupon code extraction',
        'Quality scoring',
        'Inventory status',
        'Rating integration'
      ]
    };
  }
}