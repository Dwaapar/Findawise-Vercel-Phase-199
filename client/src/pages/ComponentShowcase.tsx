import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Eye, Settings, ShoppingCart } from 'lucide-react';

// Import all the new components
import { AgenticAIServices } from '@/components/services/AgenticAIServices';
import { AffiliateMarketplace } from '@/components/services/AffiliateMarketplace';
import { NeuronServiceGrid } from '@/components/services/NeuronServiceGrid';
import { ClientSuccessStories } from '@/components/services/ClientSuccessStories';
import { PricingSection } from '@/components/services/PricingSection';
import { ServiceSelector } from '@/components/purchase/ServiceSelector';
import { PricingCalculator } from '@/components/purchase/PricingCalculator';
import { CheckoutFlow } from '@/components/purchase/CheckoutFlow';
import { DashboardOverview } from '@/components/client/DashboardOverview';

export default function ComponentShowcase() {
  const [activeComponent, setActiveComponent] = useState('landing');
  const [purchaseData, setPurchaseData] = useState<any>(null);

  const components = [
    {
      id: 'landing',
      title: 'Landing Page Components',
      description: 'Main showcase components for the digital asset platform',
      category: 'Marketing'
    },
    {
      id: 'service-selector',
      title: 'Service Selector',
      description: 'Interactive service selection interface',
      category: 'Purchase Flow'
    },
    {
      id: 'pricing-calculator',
      title: 'ROI Calculator',
      description: 'Dynamic pricing and ROI calculation tool',
      category: 'Purchase Flow'
    },
    {
      id: 'checkout',
      title: 'Checkout Flow',
      description: 'Complete checkout and payment processing',
      category: 'Purchase Flow'
    },
    {
      id: 'dashboard',
      title: 'Client Dashboard',
      description: 'Service management and analytics dashboard',
      category: 'Client Portal'
    }
  ];

  const handleNavigate = (path: string) => {
    console.log('Navigate to:', path);
  };

  const handleServiceSelection = (selection: any) => {
    setPurchaseData(selection);
    setActiveComponent('pricing-calculator');
  };

  const handleCalculationComplete = (calculation: any) => {
    setPurchaseData({ ...purchaseData, calculation });
    setActiveComponent('checkout');
  };

  const handleOrderComplete = (orderData: any) => {
    console.log('Order completed:', orderData);
    setActiveComponent('dashboard');
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'landing':
        return (
          <div className="space-y-12">
            <AgenticAIServices onNavigate={handleNavigate} />
            <AffiliateMarketplace onNavigate={handleNavigate} />
            <NeuronServiceGrid onNavigate={handleNavigate} />
            <ClientSuccessStories />
            <PricingSection onNavigate={handleNavigate} />
          </div>
        );
      case 'service-selector':
        return (
          <ServiceSelector 
            onNext={handleServiceSelection}
            initialSelection={purchaseData?.services || []}
          />
        );
      case 'pricing-calculator':
        return (
          <PricingCalculator 
            selectedServices={purchaseData?.services || []}
            onCalculationComplete={handleCalculationComplete}
          />
        );
      case 'checkout':
        return (
          <CheckoutFlow 
            orderSummary={purchaseData}
            onComplete={handleOrderComplete}
          />
        );
      case 'dashboard':
        return <DashboardOverview />;
      default:
        return <div className="text-white">Component not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-mesh text-white">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-blue-950/70 to-purple-950/90" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Component Showcase</h1>
                <p className="text-gray-400">Enterprise-grade platform components</p>
              </div>
              <Badge className="bg-green-600/20 text-green-400 border-green-500/30">
                <Eye className="w-4 h-4 mr-2" />
                Demo Mode
              </Badge>
            </div>
          </div>
        </div>

        {/* Component Navigation */}
        <div className="border-b border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex items-center space-x-1 overflow-x-auto">
              {components.map((component) => (
                <Button
                  key={component.id}
                  onClick={() => setActiveComponent(component.id)}
                  variant={activeComponent === component.id ? "default" : "ghost"}
                  className={`whitespace-nowrap ${
                    activeComponent === component.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  {component.title}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Component Info Bar */}
        <div className="bg-slate-800/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {components.find(c => c.id === activeComponent)?.title}
                </h2>
                <p className="text-sm text-gray-400">
                  {components.find(c => c.id === activeComponent)?.description}
                </p>
              </div>
              <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30">
                {components.find(c => c.id === activeComponent)?.category}
              </Badge>
            </div>
          </div>
        </div>

        {/* Purchase Flow Progress */}
        {['service-selector', 'pricing-calculator', 'checkout', 'dashboard'].includes(activeComponent) && (
          <div className="bg-slate-900/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6 py-3">
              <div className="flex items-center space-x-4">
                {[
                  { id: 'service-selector', label: 'Select Services', icon: Settings },
                  { id: 'pricing-calculator', label: 'Calculate ROI', icon: Settings },
                  { id: 'checkout', label: 'Checkout', icon: ShoppingCart },
                  { id: 'dashboard', label: 'Dashboard', icon: Eye }
                ].map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                      activeComponent === step.id
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : components.findIndex(c => c.id === activeComponent) > components.findIndex(c => c.id === step.id)
                        ? 'bg-green-600 border-green-600 text-white'
                        : 'border-slate-600 text-slate-400'
                    }`}>
                      <step.icon className="w-4 h-4" />
                    </div>
                    <span className={`ml-2 text-sm ${
                      activeComponent === step.id ? 'text-white' : 'text-slate-400'
                    }`}>
                      {step.label}
                    </span>
                    {index < 3 && (
                      <ArrowRight className="w-4 h-4 mx-3 text-slate-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="min-h-screen">
          {renderComponent()}
        </div>
      </div>
    </div>
  );
}