import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Bot, Brain, Zap, Target, BarChart3, Workflow, Cpu, Database, MessageSquare } from 'lucide-react';

interface AgenticAIServicesProps {
  onNavigate: (path: string) => void;
}

export function AgenticAIServices({ onNavigate }: AgenticAIServicesProps) {
  const [hoveredService, setHoveredService] = useState<string | null>(null);

  const aiServices = [
    {
      id: 'workflow-automation',
      title: 'Complete Workflow Automation',
      description: 'End-to-end business process automation with AI agents that handle everything from data entry to decision making.',
      icon: Workflow,
      features: ['Automated data processing', 'Decision trees', 'Error handling', 'Real-time monitoring'],
      roi: '300%',
      timeToValue: '2 weeks',
      pricing: 'From $2,500/month',
      gradient: 'from-blue-600 via-purple-600 to-pink-600'
    },
    {
      id: 'data-analysis',
      title: 'AI-Powered Data Analysis',
      description: 'Advanced data analytics and insights generation using machine learning and predictive modeling.',
      icon: BarChart3,
      features: ['Predictive analytics', 'Pattern recognition', 'Automated reporting', 'Custom dashboards'],
      roi: '250%',
      timeToValue: '1 week',
      pricing: 'From $1,800/month',
      gradient: 'from-green-600 via-teal-600 to-blue-600'
    },
    {
      id: 'custom-agents',
      title: 'Custom AI Agents',
      description: 'Bespoke AI agents tailored to your specific business needs and industry requirements.',
      icon: Bot,
      features: ['Industry-specific training', 'Custom integrations', 'Scalable architecture', 'Continuous learning'],
      roi: '400%',
      timeToValue: '3 weeks',
      pricing: 'From $5,000/month',
      gradient: 'from-purple-600 via-indigo-600 to-blue-600'
    },
    {
      id: 'intelligent-automation',
      title: 'Intelligent Process Automation',
      description: 'Smart automation that adapts and learns from your business processes to optimize performance.',
      icon: Brain,
      features: ['Self-optimizing processes', 'Anomaly detection', 'Performance tuning', 'Cost optimization'],
      roi: '350%',
      timeToValue: '2 weeks',
      pricing: 'From $3,200/month',
      gradient: 'from-orange-600 via-red-600 to-pink-600'
    }
  ];

  const capabilities = [
    { icon: Cpu, title: 'Neural Processing', description: 'Advanced AI models for complex decision making' },
    { icon: Database, title: 'Data Integration', description: 'Seamless connection to all your data sources' },
    { icon: MessageSquare, title: 'Natural Language', description: 'Conversational AI for human-like interactions' },
    { icon: Target, title: 'Goal Optimization', description: 'AI that continuously optimizes for your objectives' }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/20 to-transparent" />
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 text-sm px-4 py-2">
            <Zap className="w-4 h-4 mr-2" />
            AGENTIC AI & AUTOMATION
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
            AI That Works For You
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Our agentic AI systems don't just automate tasks—they understand your business, make decisions, 
            and continuously optimize to deliver unprecedented efficiency and growth.
          </p>
        </div>

        {/* AI Services Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {aiServices.map((service) => (
            <Card 
              key={service.id}
              className={`group relative overflow-hidden bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 hover:border-slate-600/50 transition-all duration-500 ${
                hoveredService === service.id ? 'scale-105 shadow-2xl shadow-blue-500/20' : ''
              }`}
              onMouseEnter={() => setHoveredService(service.id)}
              onMouseLeave={() => setHoveredService(null)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              
              <CardHeader className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${service.gradient} shadow-lg`}>
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-400">+{service.roi}</div>
                    <div className="text-sm text-gray-400">Average ROI</div>
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-white group-hover:text-blue-100 transition-colors">
                  {service.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="relative z-10">
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {service.description}
                </p>
                
                <div className="space-y-3 mb-6">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-3" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-sm text-gray-400">Time to Value</div>
                    <div className="font-semibold text-blue-400">{service.timeToValue}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Starting at</div>
                    <div className="font-semibold text-white">{service.pricing}</div>
                  </div>
                </div>
                
                <Button 
                  onClick={() => onNavigate('/ai-tools')}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 group"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Capabilities */}
        <div className="bg-gradient-to-r from-slate-900/30 to-slate-800/30 rounded-3xl p-8 mb-12 border border-slate-700/30">
          <h3 className="text-3xl font-bold text-center mb-8 text-white">
            Enterprise AI Capabilities
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilities.map((capability, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <capability.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-white mb-2">{capability.title}</h4>
                <p className="text-sm text-gray-400">{capability.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Button 
            onClick={() => onNavigate('/ai-tools')}
            size="lg"
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold px-8 py-4 rounded-2xl text-lg shadow-xl hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 group"
          >
            Explore AI Services
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}