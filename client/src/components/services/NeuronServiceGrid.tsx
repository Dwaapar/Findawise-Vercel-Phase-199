import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Brain, Calculator, Heart, Code, Plane, Shield, GraduationCap, Bot, Zap, Users } from 'lucide-react';

interface NeuronServiceGridProps {
  onNavigate: (path: string) => void;
}

export function NeuronServiceGrid({ onNavigate }: NeuronServiceGridProps) {
  const [hoveredNeuron, setHoveredNeuron] = useState<string | null>(null);

  const neuronServices = [
    {
      id: 'ai-tools',
      title: 'AI Tools Neuron',
      description: 'Advanced AI-powered tools for productivity, content creation, and business automation.',
      icon: Bot,
      path: '/ai-tools',
      features: ['Content Generation', 'Image Processing', 'Data Analysis', 'Automation Scripts'],
      users: '50K+',
      satisfaction: '98%',
      gradient: 'from-violet-600 via-purple-600 to-indigo-600',
      category: 'AI & Automation'
    },
    {
      id: 'finance',
      title: 'Finance Neuron',
      description: 'Comprehensive financial tools, calculators, and investment analysis for smart money management.',
      icon: Calculator,
      path: '/finance',
      features: ['Investment Calculators', 'Budget Planning', 'Risk Analysis', 'Portfolio Tracking'],
      users: '75K+',
      satisfaction: '96%',
      gradient: 'from-emerald-600 via-green-600 to-teal-600',
      category: 'Financial Services'
    },
    {
      id: 'health',
      title: 'Health & Wellness Neuron',
      description: 'Personalized health tracking, wellness programs, and medical insights for optimal living.',
      icon: Heart,
      path: '/health',
      features: ['Health Tracking', 'Fitness Plans', 'Nutrition Guides', 'Mental Wellness'],
      users: '120K+',
      satisfaction: '97%',
      gradient: 'from-rose-600 via-pink-600 to-red-600',
      category: 'Healthcare'
    },
    {
      id: 'saas',
      title: 'SaaS Solutions Neuron',
      description: 'Enterprise software solutions, tool comparisons, and SaaS optimization services.',
      icon: Code,
      path: '/saas',
      features: ['Tool Comparison', 'Stack Optimization', 'Cost Analysis', 'Integration Support'],
      users: '85K+',
      satisfaction: '95%',
      gradient: 'from-blue-600 via-cyan-600 to-sky-600',
      category: 'Software'
    },
    {
      id: 'travel',
      title: 'Travel Neuron',
      description: 'Smart travel planning, destination guides, and travel optimization for seamless journeys.',
      icon: Plane,
      path: '/travel',
      features: ['Trip Planning', 'Destination Guides', 'Budget Optimization', 'Local Insights'],
      users: '60K+',
      satisfaction: '94%',
      gradient: 'from-orange-600 via-amber-600 to-yellow-600',
      category: 'Travel & Lifestyle'
    },
    {
      id: 'security',
      title: 'Security Neuron',
      description: 'Cybersecurity assessments, privacy tools, and security awareness training.',
      icon: Shield,
      path: '/security',
      features: ['Security Audits', 'Privacy Tools', 'Threat Analysis', 'Training Programs'],
      users: '40K+',
      satisfaction: '99%',
      gradient: 'from-red-600 via-orange-600 to-yellow-600',
      category: 'Cybersecurity'
    },
    {
      id: 'education',
      title: 'Education Neuron',
      description: 'Learning platforms, skill development, and educational content for continuous growth.',
      icon: GraduationCap,
      path: '/education',
      features: ['Course Creation', 'Skill Assessment', 'Progress Tracking', 'Certification'],
      users: '95K+',
      satisfaction: '96%',
      gradient: 'from-indigo-600 via-blue-600 to-purple-600',
      category: 'Education'
    }
  ];

  const categories = Array.from(new Set(neuronServices.map(service => service.category)));

  const gridStats = [
    { label: 'Active Services', value: '7+', icon: Brain },
    { label: 'Total Users', value: '525K+', icon: Users },
    { label: 'Success Rate', value: '96.4%', icon: Zap }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/20 to-transparent" />
      <div className="absolute top-1/4 left-1/5 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/5 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 text-sm px-4 py-2">
            <Brain className="w-4 h-4 mr-2" />
            NEURON SERVICES
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-indigo-100 to-purple-100 bg-clip-text text-transparent">
            Complete Service Ecosystem
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Access our comprehensive suite of specialized services designed to automate, optimize, 
            and accelerate every aspect of your business and personal productivity.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-6 mb-16">
          {gridStats.map((stat, index) => (
            <Card key={index} className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 text-center">
              <CardContent className="p-6">
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-indigo-400" />
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Neuron Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {neuronServices.map((neuron) => (
            <Card 
              key={neuron.id}
              className={`group relative overflow-hidden bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 hover:border-slate-600/50 transition-all duration-500 cursor-pointer ${
                hoveredNeuron === neuron.id ? 'scale-105 shadow-2xl shadow-indigo-500/20' : ''
              }`}
              onMouseEnter={() => setHoveredNeuron(neuron.id)}
              onMouseLeave={() => setHoveredNeuron(null)}
              onClick={() => onNavigate(neuron.path)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${neuron.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              
              <CardHeader className="relative z-10 pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${neuron.gradient} shadow-lg`}>
                    <neuron.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-indigo-600/20 text-indigo-400 border-indigo-500/30 text-xs">
                    {neuron.category}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-bold text-white group-hover:text-indigo-100 transition-colors">
                  {neuron.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="relative z-10 pt-0">
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  {neuron.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  {neuron.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center text-xs">
                      <div className="w-1.5 h-1.5 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mr-2" />
                      <span className="text-gray-400">{feature}</span>
                    </div>
                  ))}
                  {neuron.features.length > 3 && (
                    <div className="text-xs text-gray-500">+{neuron.features.length - 3} more features</div>
                  )}
                </div>
                
                <div className="flex items-center justify-between mb-4 text-xs">
                  <div>
                    <div className="text-gray-400">Users</div>
                    <div className="font-semibold text-indigo-400">{neuron.users}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-400">Satisfaction</div>
                    <div className="font-semibold text-green-400">{neuron.satisfaction}</div>
                  </div>
                </div>
                
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(neuron.path);
                  }}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2 rounded-lg text-sm transition-all duration-300 group"
                >
                  Explore Service
                  <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Service Categories */}
        <div className="bg-gradient-to-r from-slate-900/30 to-slate-800/30 rounded-3xl p-8 mb-12 border border-slate-700/30">
          <h3 className="text-2xl font-bold text-center mb-6 text-white">
            Service Categories
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category, index) => (
              <Badge 
                key={index}
                className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 text-indigo-300 border-indigo-500/30 px-4 py-2 hover:from-indigo-600/30 hover:to-purple-600/30 transition-all duration-300 cursor-pointer"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">
              Need a Custom Solution?
            </h3>
            <p className="text-gray-300">
              We can build specialized neuron services tailored to your unique requirements
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => onNavigate('/admin/neuron-federation')}
              size="lg"
              className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold px-8 py-4 rounded-2xl text-lg shadow-xl hover:shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 group"
            >
              Browse All Services
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              onClick={() => onNavigate('/admin/configuration')}
              size="lg"
              variant="outline"
              className="border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/10 px-8 py-4 rounded-2xl text-lg transition-all duration-300"
            >
              Request Custom Service
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}