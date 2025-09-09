import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Quote, ArrowLeft, ArrowRight, TrendingUp, Users, DollarSign, Clock } from 'lucide-react';

export function ClientSuccessStories() {
  const [currentStory, setCurrentStory] = useState(0);

  const successStories = [
    {
      id: 1,
      client: 'TechCorp Solutions',
      industry: 'Enterprise Software',
      avatar: 'TC',
      role: 'CTO',
      name: 'Sarah Chen',
      quote: "The agentic AI implementation reduced our manual processes by 85% and increased revenue by 300%. This platform transformed our entire operation.",
      results: {
        efficiency: '+85%',
        revenue: '+300%',
        timeToMarket: '-60%',
        costs: '-45%'
      },
      services: ['Workflow Automation', 'Data Analysis', 'Custom AI Agents'],
      rating: 5,
      timeframe: '3 months'
    },
    {
      id: 2,
      client: 'Global Commerce Inc.',
      industry: 'E-commerce',
      avatar: 'GC',
      role: 'CEO',
      name: 'Michael Rodriguez',
      quote: "The affiliate marketplace connected us with premium partners and generated $2M in additional revenue within the first quarter.",
      results: {
        partnerships: '+150%',
        revenue: '+$2M',
        conversion: '+45%',
        reach: '+200%'
      },
      services: ['Affiliate Marketplace', 'Revenue Optimization', 'Partnership Brokerage'],
      rating: 5,
      timeframe: '1 quarter'
    },
    {
      id: 3,
      client: 'HealthTech Innovations',
      industry: 'Healthcare',
      avatar: 'HT',
      role: 'VP of Operations',
      name: 'Dr. Emily Watson',
      quote: "The integrated neuron services provided everything we needed in one place. From health analytics to security compliance, it's a complete ecosystem.",
      results: {
        compliance: '100%',
        efficiency: '+70%',
        patientSat: '+40%',
        costs: '-35%'
      },
      services: ['Health Services', 'Security Compliance', 'Data Analytics'],
      rating: 5,
      timeframe: '6 months'
    },
    {
      id: 4,
      client: 'FinanceFirst Advisory',
      industry: 'Financial Services',
      avatar: 'FF',
      role: 'Managing Director',
      name: 'James Thompson',
      quote: "The financial tools and AI-powered analysis helped us optimize client portfolios and increase AUM by 180% while reducing operational overhead.",
      results: {
        aum: '+180%',
        efficiency: '+65%',
        clientRet: '+55%',
        overhead: '-40%'
      },
      services: ['Finance Neuron', 'AI Analytics', 'Portfolio Optimization'],
      rating: 5,
      timeframe: '4 months'
    }
  ];

  const overallStats = [
    { label: 'Average ROI Increase', value: '285%', icon: TrendingUp },
    { label: 'Enterprise Clients', value: '500+', icon: Users },
    { label: 'Revenue Generated', value: '$100M+', icon: DollarSign },
    { label: 'Implementation Time', value: '2-6 weeks', icon: Clock }
  ];

  const nextStory = () => {
    setCurrentStory((prev) => (prev + 1) % successStories.length);
  };

  const prevStory = () => {
    setCurrentStory((prev) => (prev - 1 + successStories.length) % successStories.length);
  };

  const story = successStories[currentStory];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/30 to-transparent" />
      <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 text-sm px-4 py-2">
            <Star className="w-4 h-4 mr-2" />
            CLIENT SUCCESS STORIES
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
            Proven Results
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            See how leading enterprises have transformed their operations and achieved 
            unprecedented growth with our digital asset platform.
          </p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {overallStats.map((stat, index) => (
            <Card key={index} className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 text-center">
              <CardContent className="p-6">
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-blue-400" />
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Success Story */}
        <div className="mb-16">
          <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 overflow-hidden">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Story Content */}
                <div className="p-8 lg:p-12">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                      {story.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-white text-lg">{story.client}</div>
                      <div className="text-blue-400">{story.industry}</div>
                    </div>
                  </div>
                  
                  <Quote className="w-8 h-8 text-blue-400 mb-4" />
                  <blockquote className="text-xl text-gray-300 leading-relaxed mb-6 italic">
                    "{story.quote}"
                  </blockquote>
                  
                  <div className="flex items-center mb-6">
                    <div className="flex text-yellow-400 mr-3">
                      {[...Array(story.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-current" />
                      ))}
                    </div>
                    <div className="text-gray-400">
                      <span className="text-white font-semibold">{story.name}</span>, {story.role}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {story.services.map((service, index) => (
                      <Badge key={index} className="bg-blue-600/20 text-blue-400 border-blue-500/30">
                        {service}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="text-sm text-gray-400">
                    Implementation timeframe: <span className="text-blue-400 font-semibold">{story.timeframe}</span>
                  </div>
                </div>
                
                {/* Results Panel */}
                <div className="bg-gradient-to-br from-blue-950/30 to-purple-950/30 p-8 lg:p-12">
                  <h3 className="text-2xl font-bold text-white mb-6">Key Results</h3>
                  <div className="space-y-6">
                    {Object.entries(story.results).map(([key, value], index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="text-gray-300 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </div>
                        <div className="text-2xl font-bold text-green-400">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Navigation */}
          <div className="flex items-center justify-center mt-8 space-x-4">
            <Button
              onClick={prevStory}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 rounded-full w-12 h-12 p-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex space-x-2">
              {successStories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStory(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentStory 
                      ? 'bg-blue-500 scale-125' 
                      : 'bg-slate-600 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>
            
            <Button
              onClick={nextStory}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 rounded-full w-12 h-12 p-0"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Additional Success Metrics */}
        <div className="bg-gradient-to-r from-slate-900/30 to-slate-800/30 rounded-3xl p-8 border border-slate-700/30">
          <h3 className="text-3xl font-bold text-center mb-8 text-white">
            Why Enterprises Choose Us
          </h3>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">99.9%</div>
              <div className="text-gray-300">Uptime Guarantee</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">24/7</div>
              <div className="text-gray-300">Expert Support</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">2-6</div>
              <div className="text-gray-300">Weeks to ROI</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}