import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Handshake, TrendingUp, Users, Shield, Globe, DollarSign, Star, CheckCircle } from 'lucide-react';

interface AffiliateMarketplaceProps {
  onNavigate: (path: string) => void;
}

export function AffiliateMarketplace({ onNavigate }: AffiliateMarketplaceProps) {
  const [activeTab, setActiveTab] = useState('partnerships');

  const partnershipTypes = [
    {
      id: 'brand-partnerships',
      title: 'Brand Partnerships',
      description: 'Strategic alliances with top-tier brands for mutual growth and revenue expansion.',
      icon: Handshake,
      benefits: ['Co-marketing opportunities', 'Shared customer base', 'Joint product development', 'Premium commission rates'],
      commission: '15-35%',
      minCommitment: '$10K/month',
      gradient: 'from-emerald-600 via-teal-600 to-cyan-600'
    },
    {
      id: 'affiliate-brokerage',
      title: 'Affiliate Brokerage',
      description: 'Professional affiliate network management with enterprise-grade tracking and optimization.',
      icon: TrendingUp,
      benefits: ['Advanced analytics', 'Performance optimization', 'Fraud protection', 'Real-time reporting'],
      commission: '8-25%',
      minCommitment: '$5K/month',
      gradient: 'from-blue-600 via-indigo-600 to-purple-600'
    },
    {
      id: 'revenue-sharing',
      title: 'Revenue Sharing Programs',
      description: 'Long-term revenue partnerships with profit-sharing models for sustained growth.',
      icon: DollarSign,
      benefits: ['Recurring revenue', 'Performance bonuses', 'Equity participation', 'Growth incentives'],
      commission: '20-50%',
      minCommitment: '$25K/month',
      gradient: 'from-orange-600 via-red-600 to-pink-600'
    }
  ];

  const featuredPartners = [
    {
      name: 'Enterprise Solutions Inc.',
      category: 'SaaS Platform',
      commission: '25%',
      rating: 4.9,
      description: 'Leading enterprise software solutions with $500M+ ARR',
      features: ['API Integration', 'White-label options', 'Dedicated support']
    },
    {
      name: 'Global Commerce Network',
      category: 'E-commerce',
      commission: '18%',
      rating: 4.8,
      description: 'International marketplace with 50M+ active users',
      features: ['Multi-currency', 'Global shipping', 'Mobile-first']
    },
    {
      name: 'FinTech Innovations',
      category: 'Financial Services',
      commission: '30%',
      rating: 4.9,
      description: 'Next-gen financial technology for modern businesses',
      features: ['Bank-grade security', 'Real-time processing', 'Compliance-ready']
    }
  ];

  const marketplaceStats = [
    { label: 'Active Partners', value: '2,500+', icon: Users },
    { label: 'Revenue Generated', value: '$50M+', icon: DollarSign },
    { label: 'Global Reach', value: '180+ Countries', icon: Globe },
    { label: 'Success Rate', value: '94%', icon: CheckCircle }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/20 to-transparent" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-0 text-sm px-4 py-2">
            <Handshake className="w-4 h-4 mr-2" />
            AFFILIATE MARKETPLACE
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-emerald-100 to-teal-100 bg-clip-text text-transparent">
            Partnership Excellence
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Connect with premium brands and unlock new revenue streams through our curated 
            affiliate marketplace designed for enterprise-level partnerships.
          </p>
        </div>

        {/* Marketplace Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {marketplaceStats.map((stat, index) => (
            <Card key={index} className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 text-center">
              <CardContent className="p-6">
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-emerald-400" />
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Partnership Types */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-8 text-white">
            Partnership Opportunities
          </h3>
          <div className="grid lg:grid-cols-3 gap-8">
            {partnershipTypes.map((type) => (
              <Card 
                key={type.id}
                className="group relative overflow-hidden bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 hover:border-slate-600/50 transition-all duration-500 hover:scale-105"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${type.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                <CardHeader className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${type.gradient} shadow-lg`}>
                      <type.icon className="w-8 h-8 text-white" />
                    </div>
                    <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-500/30">
                      {type.commission}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold text-white group-hover:text-emerald-100 transition-colors">
                    {type.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="relative z-10">
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {type.description}
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    {type.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mr-3" />
                        <span className="text-gray-300">{benefit}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mb-6">
                    <div className="text-sm text-gray-400 mb-1">Minimum Commitment</div>
                    <div className="font-semibold text-emerald-400">{type.minCommitment}</div>
                  </div>
                  
                  <Button 
                    onClick={() => onNavigate('/admin/affiliate-dashboard')}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 group"
                  >
                    Apply Now
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Partners */}
        <div className="bg-gradient-to-r from-slate-900/30 to-slate-800/30 rounded-3xl p-8 mb-12 border border-slate-700/30">
          <h3 className="text-3xl font-bold text-center mb-8 text-white">
            Featured Partners
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredPartners.map((partner, index) => (
              <Card key={index} className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-500/30">
                      {partner.category}
                    </Badge>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-300">{partner.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg font-bold text-white">
                    {partner.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm mb-4">
                    {partner.description}
                  </p>
                  <div className="space-y-2 mb-4">
                    {partner.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-xs">
                        <CheckCircle className="w-3 h-3 text-emerald-400 mr-2" />
                        <span className="text-gray-400">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Commission</span>
                    <span className="font-bold text-emerald-400">{partner.commission}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Button 
            onClick={() => onNavigate('/admin/affiliate-dashboard')}
            size="lg"
            className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white font-bold px-8 py-4 rounded-2xl text-lg shadow-xl hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 group"
          >
            Join the Marketplace
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}