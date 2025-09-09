import React from 'react';
import { EnterpriseHero } from '@/components/ui/enterprise-hero';
import { EnterpriseFeatures } from '@/components/ui/enterprise-features';
import { EnterpriseCta } from '@/components/ui/enterprise-cta';
import { useLocation } from 'wouter';

// Billion-Dollar Enterprise Landing Page for Findawise AI Empire
export default function FindawiseLandingPage() {
  const [location, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 text-white overflow-x-hidden">
      {/* Enterprise Hero Section */}
      <EnterpriseHero onNavigate={(path) => setLocation(path)} />
      
      {/* Enterprise Features Section */}
      <EnterpriseFeatures />
      
      {/* Enterprise CTA Section */}
      <EnterpriseCta onNavigate={(path) => setLocation(path)} />
    </div>
  );
}