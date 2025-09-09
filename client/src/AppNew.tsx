import { Switch, Route, useLocation } from "wouter";
import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// New Enterprise Components
import FindawiseLandingPage from "@/pages/FindawiseLandingPage";
import EmpireDashboard from "@/pages/EmpireDashboardNew";

// ENTERPRISE COMMAND CENTER PAGES
import EnterpriseCommand from "@/pages/EnterpriseCommand";
import AIIntelligenceCenter from "@/pages/AIIntelligenceCenter";
import FederationControlCenter from "@/pages/FederationControlCenter";
import RevenueOptimizationCenter from "@/pages/RevenueOptimizationCenter";
import SecurityControlCenter from "@/pages/SecurityControlCenter";
import AnalyticsIntelligenceHub from "@/pages/AnalyticsIntelligenceHub";
import ContentAutomationCenter from "@/pages/ContentAutomationCenter";
import AffiliateNetworkCenter from "@/pages/AffiliateNetworkCenter";
import DeploymentOrchestrationCenter from "@/pages/DeploymentOrchestrationCenter";
import NotFound from "@/pages/not-found";

// Core Neuron Pages
import SecurityHome from "@/pages/SecurityHome";
import SecurityDashboard from "@/pages/SecurityDashboard";
import SecurityTools from "@/pages/SecurityTools";
import FinanceHome from "@/pages/FinanceHome";
import FinanceQuiz from "@/pages/FinanceQuiz";
import FinanceCalculators from "@/pages/FinanceCalculators";
import HealthHome from "@/pages/HealthHome";
import { TravelHome } from "@/pages/TravelHome";
import { AIToolsPage } from "@/pages/AIToolsPage";
import SaaSHome from "@/pages/SaaS/SaaSHome";

// Admin Empire Management Pages
import AdminDashboard from "@/pages/AdminDashboard";
import AdminAIDashboard from "@/pages/AdminAIDashboard";
import AdminComplianceDashboard from "@/pages/AdminComplianceDashboard";
import AdminNeuralProfile from "@/pages/AdminNeuralProfile";
import AdminOfferFeedDashboard from "@/pages/AdminOfferFeedDashboard";
import { ExperimentsDashboard } from "@/pages/ExperimentsDashboard";
import LeadsDashboard from "@/pages/LeadsDashboard";
import OfferEngineAdmin from "@/pages/OfferEngineAdmin";
import OfferEngineDashboard from "@/pages/OfferEngineDashboard";
import PrivacySettings from "@/pages/PrivacySettings";

// Advanced Admin Components - Only importing existing files
import AINativeOS from "@/pages/admin/AINativeOS";
import CrossDeviceAnalyticsDashboard from "@/pages/admin/CrossDeviceAnalyticsDashboard";
import FunnelDashboard from "@/pages/admin/FunnelDashboard";
import NotificationCenter from "@/pages/admin/NotificationCenter";
import RLHFBrainDashboard from "@/pages/admin/RLHFBrainDashboard";
import ApiKeyManagement from "@/pages/admin/ApiKeyManagement";
import InteractiveModules from "@/pages/admin/interactive-modules";
import SessionDashboard from "@/pages/admin/SessionDashboard";

// Additional existing admin components
import AIMLCenter from "@/pages/admin/AIMLCenter";
import OfflineAiDashboard from "@/pages/admin/OfflineAiDashboard";
import SemanticGraphCenter from "@/pages/admin/SemanticGraphCenter";
import VectorSearchDashboard from "@/pages/admin/VectorSearchDashboard";
import DataManagement from "@/pages/admin/data-management";
import EmpireLaunchpad from "@/pages/admin/empire-launchpad";
import RevenueSplitDashboard from "@/pages/admin/revenue-split-dashboard";
import AffiliateDashboard from "@/pages/admin/affiliate-dashboard";
import AffiliateRedirectDashboard from "@/pages/admin/affiliate-redirect-dashboard";

// Dynamic Pages
import DynamicPage from "@/pages/[slug]";

// Lazy-loaded components for performance
import { lazy } from "react";

// Enterprise Router Component
function EmpireRouter() {
  const [, navigate] = useLocation();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <Switch>
      {/* Main Automation Services Landing */}
      <Route path="/" component={FindawiseLandingPage} />
      <Route path="/landing" component={FindawiseLandingPage} />
      
      {/* ENTERPRISE COMMAND CENTERS */}
      <Route path="/enterprise-command" component={() => <EnterpriseCommand onNavigate={handleNavigate} />} />
      <Route path="/ai-intelligence" component={() => <AIIntelligenceCenter onNavigate={handleNavigate} />} />
      <Route path="/federation-control" component={() => <FederationControlCenter onNavigate={handleNavigate} />} />
      <Route path="/revenue-optimization" component={() => <RevenueOptimizationCenter onNavigate={handleNavigate} />} />
      <Route path="/security-control" component={() => <SecurityControlCenter onNavigate={handleNavigate} />} />
      <Route path="/analytics-intelligence" component={() => <AnalyticsIntelligenceHub onNavigate={handleNavigate} />} />
      <Route path="/content-automation" component={() => <ContentAutomationCenter onNavigate={handleNavigate} />} />
      <Route path="/affiliate-networks" component={() => <AffiliateNetworkCenter onNavigate={handleNavigate} />} />
      <Route path="/deployment-orchestration" component={() => <DeploymentOrchestrationCenter onNavigate={handleNavigate} />} />
      
      {/* Empire Dashboard - The Crown Jewel */}
      <Route path="/empire" component={() => <EmpireDashboard onNavigate={handleNavigate} />} />
      <Route path="/empire-dashboard" component={() => <EmpireDashboard onNavigate={handleNavigate} />} />
      <Route path="/dashboard" component={() => <EmpireDashboard onNavigate={handleNavigate} />} />
      
      {/* Revenue Centers - Multi-Vertical Monetization */}
      <Route path="/revenue" component={() => (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">💰</div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              Revenue Analytics Center
            </h1>
            <p className="text-gray-400 mb-8">Enterprise-grade revenue optimization coming soon</p>
            <button 
              onClick={() => handleNavigate("/empire")}
              className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg font-medium"
            >
              Back to Empire
            </button>
          </div>
        </div>
      )} />
      
      {/* Security Center */}
      <Route path="/security" component={SecurityHome} />
      <Route path="/security-home" component={SecurityHome} />
      <Route path="/security-dashboard" component={SecurityDashboard} />
      <Route path="/security-tools" component={SecurityTools} />
      
      {/* AI Center - Full Enterprise Implementation */}
      <Route path="/ai-center" component={() => <AIIntelligenceCenter onNavigate={handleNavigate} />} />
      <Route path="/ai-ml-center" component={() => <AIIntelligenceCenter onNavigate={handleNavigate} />} />
      <Route path="/vector-intelligence" component={() => <AIIntelligenceCenter onNavigate={handleNavigate} />} />
      <Route path="/semantic-intelligence" component={() => <AIIntelligenceCenter onNavigate={handleNavigate} />} />
      <Route path="/llm-orchestration" component={() => <AIIntelligenceCenter onNavigate={handleNavigate} />} />
      
      {/* Global Markets */}
      <Route path="/markets" component={() => (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🌍</div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Global Markets Center
            </h1>
            <p className="text-gray-400 mb-8">Worldwide expansion management coming soon</p>
            <button 
              onClick={() => handleNavigate("/empire")}
              className="bg-yellow-500 hover:bg-yellow-600 px-6 py-3 rounded-lg font-medium"
            >
              Back to Empire
            </button>
          </div>
        </div>
      )} />
      
      {/* Neuron Verticals - Simplified */}
      <Route path="/finance" component={FinanceHome} />
      <Route path="/finance-home" component={FinanceHome} />
      <Route path="/finance/quiz" component={FinanceQuiz} />
      <Route path="/finance/calculator/:calculatorId?" component={FinanceCalculators} />
      
      <Route path="/health" component={HealthHome} />
      <Route path="/health-home" component={HealthHome} />
      
      <Route path="/travel" component={TravelHome} />
      <Route path="/travel-home" component={TravelHome} />
      
      <Route path="/ai-tools" component={AIToolsPage} />
      <Route path="/tools" component={AIToolsPage} />
      
      <Route path="/saas" component={() => <SaaSHome />} />
      <Route path="/saas-home" component={() => <SaaSHome />} />
      
      {/* COMPLETE ADMIN EMPIRE MANAGEMENT SYSTEM */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      
      {/* AI & ML Administration */}
      <Route path="/admin/ai" component={AdminAIDashboard} />
      <Route path="/admin/ai-dashboard" component={AdminAIDashboard} />
      <Route path="/admin/ai-native-os" component={AINativeOS} />
      <Route path="/admin/rlhf-brain" component={RLHFBrainDashboard} />
      <Route path="/admin/ai-ml-center" component={AIMLCenter} />
      <Route path="/admin/offline-ai" component={OfflineAiDashboard} />
      <Route path="/admin/semantic-graph" component={SemanticGraphCenter} />
      <Route path="/admin/vector-search" component={VectorSearchDashboard} />
      
      {/* Revenue & Marketing Admin */}
      <Route path="/admin/offer-engine" component={OfferEngineAdmin} />
      <Route path="/admin/offer-feed" component={AdminOfferFeedDashboard} />
      <Route path="/admin/revenue-split" component={RevenueSplitDashboard} />
      <Route path="/admin/affiliate" component={AffiliateDashboard} />
      <Route path="/admin/affiliate-redirect" component={AffiliateRedirectDashboard} />
      <Route path="/admin/leads" component={LeadsDashboard} />
      <Route path="/admin/experiments" component={ExperimentsDashboard} />
      <Route path="/admin/funnel" component={FunnelDashboard} />
      
      {/* Analytics & Intelligence */}
      <Route path="/admin/cross-device" component={CrossDeviceAnalyticsDashboard} />
      <Route path="/admin/sessions" component={SessionDashboard} />
      <Route path="/admin/neural-profile" component={AdminNeuralProfile} />
      
      {/* Security & Compliance */}
      <Route path="/admin/compliance" component={AdminComplianceDashboard} />
      <Route path="/admin/api-keys" component={ApiKeyManagement} />
      
      {/* Communication & Engagement */}
      <Route path="/admin/notifications" component={NotificationCenter} />
      <Route path="/admin/interactive-modules" component={InteractiveModules} />
      <Route path="/admin/data-management" component={DataManagement} />
      <Route path="/admin/empire-launchpad" component={EmpireLaunchpad} />
      
      {/* OFFER ENGINE ECOSYSTEM */}
      <Route path="/offers" component={OfferEngineDashboard} />
      <Route path="/offer-dashboard" component={OfferEngineDashboard} />
      
      {/* PRIVACY & USER MANAGEMENT */}
      <Route path="/privacy" component={PrivacySettings} />
      <Route path="/privacy-settings" component={PrivacySettings} />
      
      {/* DYNAMIC INTERACTIVE MODULES */}
      <Route path="/fitness-transformation-quiz" component={() => <DynamicPage />} />
      <Route path="/investment-calculator" component={() => <DynamicPage />} />
      <Route path="/meditation-timer" component={() => <DynamicPage />} />
      <Route path="/anxiety-relief-toolkit" component={() => <DynamicPage />} />
      <Route path="/budgeting-bootcamp" component={() => <DynamicPage />} />
      <Route path="/travel-planning-assistant" component={() => <DynamicPage />} />
      <Route path="/home-security-assessment" component={() => <DynamicPage />} />
      <Route path="/career-transition-guide" component={() => <DynamicPage />} />
      <Route path="/smart-home-optimizer" component={() => <DynamicPage />} />
      <Route path="/retirement-readiness-quiz" component={() => <DynamicPage />} />
      
      {/* ALTERNATIVE ROUTING FOR ALL VERTICALS */}
      <Route path="/personal-finance" component={FinanceHome} />
      <Route path="/money" component={FinanceHome} />
      <Route path="/budget" component={FinanceHome} />
      <Route path="/investment" component={FinanceHome} />
      
      <Route path="/wellness" component={HealthHome} />
      <Route path="/fitness" component={HealthHome} />
      <Route path="/mental-health" component={HealthHome} />
      
      <Route path="/destinations" component={TravelHome} />
      <Route path="/wanderlust" component={TravelHome} />
      <Route path="/vacation" component={TravelHome} />
      
      <Route path="/home-security" component={SecurityHome} />
      <Route path="/smart-home" component={SecurityHome} />
      <Route path="/protection" component={SecurityHome} />
      
      <Route path="/software" component={() => <SaaSHome />} />
      <Route path="/tools-directory" component={() => <SaaSHome />} />
      <Route path="/productivity" component={() => <SaaSHome />} />
      
      <Route path="/artificial-intelligence" component={AIToolsPage} />
      <Route path="/machine-learning" component={AIToolsPage} />
      <Route path="/automation" component={AIToolsPage} />
      
      {/* Catch-all */}
      <Route component={NotFound} />
    </Switch>
  );
}

// Main App Component
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="App">
          <EmpireRouter />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}