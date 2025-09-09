import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Check, Star, Calculator, Zap, Crown, Building, MessageSquare } from 'lucide-react';

interface PricingSectionProps {
  onNavigate: (path: string) => void;
}

export function PricingSection({ onNavigate }: PricingSectionProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const pricingPlans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for small businesses and startups',
      icon: Zap,
      price: { monthly: 299, yearly: 2990 },
      features: [
        'Up to 3 AI automation workflows',
        'Basic analytics dashboard',
        '5 neuron services access',
        'Email support',
        'Standard integrations',
        'Monthly performance reports'
      ],
      limits: {
        workflows: '3',
        users: '5',
        storage: '10GB',
        support: 'Email'
      },
      popular: false,
      gradient: 'from-blue-600 to-cyan-600'
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Ideal for growing businesses',
      icon: Star,
      price: { monthly: 799, yearly: 7990 },
      features: [
        'Unlimited AI automation workflows',
        'Advanced analytics & insights',
        'All neuron services access',
        'Priority support (24/7)',
        'Custom integrations',
        'Weekly performance reports',
        'A/B testing capabilities',
        'Advanced security features'
      ],
      limits: {
        workflows: 'Unlimited',
        users: '25',
        storage: '100GB',
        support: 'Priority 24/7'
      },
      popular: true,
      gradient: 'from-purple-600 to-pink-600'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large organizations with complex needs',
      icon: Crown,
      price: { monthly: 2499, yearly: 24990 },
      features: [
        'Custom AI agent development',
        'Enterprise-grade analytics',
        'White-label solutions',
        'Dedicated account manager',
        'Custom neuron development',
        'Real-time performance monitoring',
        'Advanced compliance features',
        'SLA guarantees',
        'Multi-region deployment',
        'Custom training & onboarding'
      ],
      limits: {
        workflows: 'Unlimited',
        users: 'Unlimited',
        storage: '1TB+',
        support: 'Dedicated Manager'
      },
      popular: false,
      gradient: 'from-orange-600 to-red-600'
    },
    {
      id: 'custom',
      name: 'Custom Solutions',
      description: 'Tailored for unique enterprise requirements',
      icon: Building,
      price: { monthly: 'Custom', yearly: 'Custom' },
      features: [
        'Fully customized platform',
        'Bespoke AI development',
        'On-premise deployment options',
        'Custom compliance requirements',
        'Unlimited everything',
        'Direct engineering access',
        'Custom SLA agreements',
        'Dedicated infrastructure'
      ],
      limits: {
        workflows: 'Custom',
        users: 'Custom',
        storage: 'Custom',
        support: 'White-glove'
      },
      popular: false,
      gradient: 'from-emerald-600 to-teal-600'
    }
  ];

  const roiCalculator = {
    timesSaved: 40, // hours per week
    costPerHour: 75, // average employee cost
    efficiency: 85, // percentage improvement
    weeklysSavings: 40 * 75 * 0.85,
    monthlySavings: 40 * 75 * 0.85 * 4.33,
    yearlySavings: 40 * 75 * 0.85 * 4.33 * 12
  };

  const addOns = [
    {
      name: 'Premium Support',
      description: '24/7 dedicated support with 15-minute response time',
      price: { monthly: 199, yearly: 1990 }
    },
    {
      name: 'Advanced Security Suite',
      description: 'Enhanced security features and compliance tools',
      price: { monthly: 299, yearly: 2990 }
    },
    {
      name: 'Custom Integrations',
      description: 'Unlimited custom API integrations and connectors',
      price: { monthly: 499, yearly: 4990 }
    }
  ];

  const formatPrice = (price: number | string) => {
    if (typeof price === 'string') return price;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getSavings = (plan: typeof pricingPlans[0]) => {
    if (typeof plan.price.yearly === 'string') return null;
    const monthlyCost = plan.price.monthly * 12;
    const savings = monthlyCost - (plan.price.yearly as number);
    return Math.round((savings / monthlyCost) * 100);
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/20 to-transparent" />
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 text-sm px-4 py-2">
            <Calculator className="w-4 h-4 mr-2" />
            TRANSPARENT PRICING
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
            Investment That Pays Off
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Choose the perfect plan for your business. All plans include our core AI automation 
            platform with transparent pricing and no hidden fees.
          </p>
        </div>

        {/* ROI Calculator Preview */}
        <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-3xl p-8 mb-12 border border-purple-700/30">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">Average ROI Calculator</h3>
            <p className="text-gray-300">Based on typical enterprise implementations</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-1">
                {formatPrice(roiCalculator.weeklysSavings)}
              </div>
              <div className="text-sm text-gray-400">Weekly Savings</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-400 mb-1">
                {formatPrice(roiCalculator.monthlySavings)}
              </div>
              <div className="text-sm text-gray-400">Monthly Savings</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400 mb-1">
                {formatPrice(roiCalculator.yearlySavings)}
              </div>
              <div className="text-sm text-gray-400">Yearly Savings</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-1">285%</div>
              <div className="text-sm text-gray-400">Average ROI</div>
            </div>
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center mb-12">
          <div className="bg-slate-800/50 rounded-full p-1 border border-slate-700/50">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                billingCycle === 'monthly'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                billingCycle === 'yearly'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Yearly
              <Badge className="ml-2 bg-green-600 text-white text-xs">Save up to 20%</Badge>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {pricingPlans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative overflow-hidden bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 transition-all duration-500 hover:scale-105 ${
                plan.popular ? 'ring-2 ring-purple-500/50' : ''
              } ${
                selectedPlan === plan.id ? 'ring-2 ring-blue-500/50' : ''
              }`}
              onMouseEnter={() => setSelectedPlan(plan.id)}
              onMouseLeave={() => setSelectedPlan(null)}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-0 hover:opacity-10 transition-opacity duration-500`} />
              
              <CardHeader className="relative z-10 text-center pb-4">
                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${plan.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <plan.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </CardTitle>
                <p className="text-gray-400 text-sm">
                  {plan.description}
                </p>
              </CardHeader>
              
              <CardContent className="relative z-10 pt-0">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-white mb-1">
                    {formatPrice(plan.price[billingCycle])}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {typeof plan.price[billingCycle] === 'string' 
                      ? 'Contact sales' 
                      : `per ${billingCycle}`}
                  </div>
                  {billingCycle === 'yearly' && getSavings(plan) && (
                    <Badge className="mt-2 bg-green-600/20 text-green-400 border-green-500/30">
                      Save {getSavings(plan)}%
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start text-sm">
                      <Check className="w-4 h-4 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
                  {Object.entries(plan.limits).map(([key, value]) => (
                    <div key={key}>
                      <div className="text-gray-400 capitalize">{key}</div>
                      <div className="font-semibold text-white">{value}</div>
                    </div>
                  ))}
                </div>
                
                <Button 
                  onClick={() => onNavigate(plan.id === 'custom' ? '/admin/configuration' : '/storefront')}
                  className={`w-full bg-gradient-to-r ${plan.gradient} hover:opacity-90 text-white font-semibold py-3 rounded-xl transition-all duration-300 group`}
                >
                  {plan.id === 'custom' ? 'Contact Sales' : 'Get Started'}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add-ons */}
        <div className="bg-gradient-to-r from-slate-900/30 to-slate-800/30 rounded-3xl p-8 mb-12 border border-slate-700/30">
          <h3 className="text-3xl font-bold text-center mb-8 text-white">
            Optional Add-ons
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {addOns.map((addon, index) => (
              <Card key={index} className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600/50">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-white">
                    {addon.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm mb-4">
                    {addon.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-white">
                      {formatPrice(addon.price[billingCycle])}
                    </span>
                    <span className="text-sm text-gray-400">
                      /{billingCycle.slice(0, -2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">
              Ready to Transform Your Business?
            </h3>
            <p className="text-gray-300">
              Join 500+ enterprises already saving millions with our platform
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => onNavigate('/storefront')}
              size="lg"
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white font-bold px-8 py-4 rounded-2xl text-lg shadow-xl hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 group"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              onClick={() => onNavigate('/admin/configuration')}
              size="lg"
              variant="outline"
              className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 px-8 py-4 rounded-2xl text-lg transition-all duration-300 group"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}