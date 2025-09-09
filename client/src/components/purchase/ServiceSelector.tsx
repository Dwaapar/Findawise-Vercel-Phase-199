import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, Bot, Handshake, Brain, Calculator, Heart, Code, Plane, Shield, GraduationCap, Plus, Minus } from 'lucide-react';

interface ServiceSelectorProps {
  onNext: (selectedServices: any[]) => void;
  initialSelection?: any[];
}

export function ServiceSelector({ onNext, initialSelection = [] }: ServiceSelectorProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>(
    initialSelection.map(s => s.id) || []
  );
  const [selectedTier, setSelectedTier] = useState<string>('professional');

  const serviceCategories = [
    {
      id: 'agentic-ai',
      title: 'Agentic AI & Automation',
      icon: Bot,
      description: 'Complete business automation with intelligent AI agents',
      services: [
        {
          id: 'workflow-automation',
          name: 'Workflow Automation',
          description: 'End-to-end process automation',
          basePrice: 2500,
          features: ['Automated workflows', 'Decision trees', 'Error handling', 'Real-time monitoring']
        },
        {
          id: 'data-analysis',
          name: 'AI Data Analysis',
          description: 'Advanced analytics and insights',
          basePrice: 1800,
          features: ['Predictive analytics', 'Pattern recognition', 'Automated reporting', 'Custom dashboards']
        },
        {
          id: 'custom-agents',
          name: 'Custom AI Agents',
          description: 'Bespoke AI solutions for your business',
          basePrice: 5000,
          features: ['Industry-specific training', 'Custom integrations', 'Scalable architecture', 'Continuous learning']
        }
      ],
      gradient: 'from-blue-600 to-purple-600'
    },
    {
      id: 'affiliate-services',
      title: 'Affiliate & Partnership Services',
      icon: Handshake,
      description: 'Revenue optimization through strategic partnerships',
      services: [
        {
          id: 'brand-partnerships',
          name: 'Brand Partnership Management',
          description: 'Strategic alliance management',
          basePrice: 1200,
          features: ['Partnership sourcing', 'Contract management', 'Performance tracking', 'Revenue optimization']
        },
        {
          id: 'affiliate-optimization',
          name: 'Affiliate Network Optimization',
          description: 'Maximize affiliate revenue',
          basePrice: 800,
          features: ['Network analysis', 'Performance optimization', 'Fraud protection', 'Real-time analytics']
        },
        {
          id: 'revenue-sharing',
          name: 'Revenue Sharing Programs',
          description: 'Advanced profit-sharing models',
          basePrice: 1500,
          features: ['Revenue tracking', 'Automated payouts', 'Performance incentives', 'Growth optimization']
        }
      ],
      gradient: 'from-emerald-600 to-teal-600'
    },
    {
      id: 'neuron-services',
      title: 'Specialized Neuron Services',
      icon: Brain,
      description: 'Complete suite of business and productivity tools',
      services: [
        {
          id: 'finance-neuron',
          name: 'Finance & Investment Tools',
          icon: Calculator,
          description: 'Financial planning and analysis',
          basePrice: 600,
          features: ['Investment calculators', 'Portfolio analysis', 'Risk assessment', 'Financial planning']
        },
        {
          id: 'health-neuron',
          name: 'Health & Wellness Platform',
          icon: Heart,
          description: 'Employee wellness programs',
          basePrice: 400,
          features: ['Health tracking', 'Wellness programs', 'Medical insights', 'Fitness planning']
        },
        {
          id: 'saas-neuron',
          name: 'SaaS Optimization Suite',
          icon: Code,
          description: 'Software stack optimization',
          basePrice: 800,
          features: ['Tool analysis', 'Cost optimization', 'Integration support', 'Performance monitoring']
        },
        {
          id: 'travel-neuron',
          name: 'Travel Management System',
          icon: Plane,
          description: 'Corporate travel optimization',
          basePrice: 500,
          features: ['Trip planning', 'Cost optimization', 'Policy compliance', 'Expense tracking']
        },
        {
          id: 'security-neuron',
          name: 'Security & Compliance Tools',
          icon: Shield,
          description: 'Cybersecurity assessment and training',
          basePrice: 1000,
          features: ['Security audits', 'Compliance monitoring', 'Threat analysis', 'Training programs']
        },
        {
          id: 'education-neuron',
          name: 'Learning & Development Platform',
          icon: GraduationCap,
          description: 'Employee training and development',
          basePrice: 700,
          features: ['Course creation', 'Skill tracking', 'Certification', 'Progress analytics']
        }
      ],
      gradient: 'from-indigo-600 to-purple-600'
    }
  ];

  const pricingTiers = [
    {
      id: 'starter',
      name: 'Starter',
      multiplier: 0.8,
      description: 'Basic features, email support',
      limits: 'Up to 5 users'
    },
    {
      id: 'professional',
      name: 'Professional',
      multiplier: 1.0,
      description: 'Full features, priority support',
      limits: 'Up to 25 users'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      multiplier: 1.5,
      description: 'Advanced features, dedicated support',
      limits: 'Unlimited users'
    }
  ];

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const getSelectedServicesData = () => {
    const selected = [];
    serviceCategories.forEach(category => {
      category.services.forEach(service => {
        if (selectedServices.includes(service.id)) {
          selected.push({
            ...service,
            category: category.title,
            categoryId: category.id,
            finalPrice: Math.round(service.basePrice * (pricingTiers.find(t => t.id === selectedTier)?.multiplier || 1))
          });
        }
      });
    });
    return selected;
  };

  const getTotalPrice = () => {
    const selected = getSelectedServicesData();
    return selected.reduce((total, service) => total + service.finalPrice, 0);
  };

  const handleNext = () => {
    const selectedData = getSelectedServicesData();
    const tierData = pricingTiers.find(t => t.id === selectedTier);
    
    onNext({
      services: selectedData,
      tier: tierData,
      totalPrice: getTotalPrice()
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Select Your Services</h2>
        <p className="text-gray-300">Choose the services that best fit your business needs</p>
      </div>

      {/* Pricing Tier Selection */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Choose Your Plan Tier</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {pricingTiers.map((tier) => (
            <Card 
              key={tier.id}
              className={`cursor-pointer transition-all duration-300 ${
                selectedTier === tier.id 
                  ? 'ring-2 ring-blue-500 bg-blue-950/30' 
                  : 'bg-slate-900/50 hover:bg-slate-800/50'
              } border-slate-700/50`}
              onClick={() => setSelectedTier(tier.id)}
            >
              <CardContent className="p-4 text-center">
                <h4 className="font-semibold text-white mb-1">{tier.name}</h4>
                <p className="text-sm text-gray-400 mb-2">{tier.description}</p>
                <p className="text-xs text-gray-500">{tier.limits}</p>
                <div className="mt-2">
                  <span className="text-lg font-bold text-blue-400">
                    {tier.multiplier === 1 ? 'Base Price' : `${Math.round(tier.multiplier * 100)}% of Base`}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Service Categories */}
      <div className="space-y-8 mb-8">
        {serviceCategories.map((category) => (
          <div key={category.id} className="bg-slate-900/30 rounded-2xl p-6 border border-slate-700/30">
            <div className="flex items-center mb-6">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${category.gradient} mr-4`}>
                <category.icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{category.title}</h3>
                <p className="text-gray-400">{category.description}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.services.map((service) => {
                const isSelected = selectedServices.includes(service.id);
                const finalPrice = Math.round(service.basePrice * (pricingTiers.find(t => t.id === selectedTier)?.multiplier || 1));
                
                return (
                  <Card 
                    key={service.id}
                    className={`cursor-pointer transition-all duration-300 ${
                      isSelected 
                        ? 'ring-2 ring-blue-500 bg-blue-950/20' 
                        : 'bg-slate-800/50 hover:bg-slate-700/50'
                    } border-slate-600/50`}
                    onClick={() => toggleService(service.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {service.icon && <service.icon className="w-5 h-5 text-blue-400 mr-2" />}
                          <Checkbox 
                            checked={isSelected}
                            onChange={() => {}}
                            className="mr-3"
                          />
                          <div>
                            <CardTitle className="text-lg font-semibold text-white">
                              {service.name}
                            </CardTitle>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400">{service.description}</p>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="mb-4">
                        <div className="text-2xl font-bold text-white">
                          ${finalPrice.toLocaleString()}
                          <span className="text-sm text-gray-400 font-normal">/month</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {service.features.map((feature, index) => (
                          <div key={index} className="flex items-center text-xs">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2" />
                            <span className="text-gray-400">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Summary and Continue */}
      <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">Order Summary</h3>
            <p className="text-gray-400">
              {selectedServices.length} service{selectedServices.length !== 1 ? 's' : ''} selected
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">
              ${getTotalPrice().toLocaleString()}
              <span className="text-lg text-gray-400 font-normal">/month</span>
            </div>
            <div className="text-sm text-gray-400">
              {pricingTiers.find(t => t.id === selectedTier)?.name} tier
            </div>
          </div>
        </div>
        
        <Button 
          onClick={handleNext}
          disabled={selectedServices.length === 0}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 rounded-xl text-lg transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Configuration
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}