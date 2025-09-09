import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { 
  ArrowRight, CheckCircle, Star, Users, Globe, Shield, 
  Zap, TrendingUp, Award, PlayCircle, ChevronRight, ChevronDown,
  Crown, Brain, Target, Rocket, BarChart3, Lock,
  Code, Database, Cloud, Cpu, Network, Settings,
  Layers, Monitor, Smartphone, Tablet, Lightbulb,
  FileText, MessageSquare, Mail, Phone, MapPin,
  Bot, Workflow, Store, DollarSign, Search, Clock,
  Calendar, Calculator, Headphones, Shield as ShieldCheck,
  Sparkles, ArrowUpRight, ExternalLink, Timer,
  Building, PieChart, TrendingDown, Activity,
  Infinity, Eye, MousePointer, Palette, Orbit,
  Mic, Video, Camera, Share2, Download, Menu, X,
  HeadphonesIcon, Briefcase, PenTool, BarChart,
  Megaphone, Compass, Wrench
} from 'lucide-react';
import { useLocation } from 'wouter';
import { 
  useEmpireStats, 
  useWorkflowStore, 
  useActiveAgents, 
  useAffiliateOffers, 
  useSystemMetrics,
  useNeuronServices,
  useRevenueMetrics,
  useAutomationStats
} from '@/hooks/useEmpireData';

// Event tracking utility
const track = (event: string, data?: Record<string, any>) => {
  console.log('Event:', event, data);
  // Replace with your analytics
};

// Findawise Homepage - Parent Company of 7 Businesses
export default function FindawiseLandingPage() {
  const [location, setLocation] = useLocation();
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [hoveredCompany, setHoveredCompany] = useState<string | null>(null);
  const [currentDealIndex, setCurrentDealIndex] = useState(0);
  
  const heroRef = useRef<HTMLDivElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const megaButtonRef = useRef<HTMLButtonElement>(null);
  
  // Parallax and scroll animations
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, -100]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.8]);
  
  // Reduced motion preference
  const shouldReduceMotion = useReducedMotion();
  
  useEffect(() => {
    if (shouldReduceMotion) {
      setIsVideoPlaying(false);
    }
  }, [shouldReduceMotion]);

  // Real-time backend data hooks
  const { data: empireStats, isLoading: empireLoading } = useEmpireStats();
  const { data: workflowStore, isLoading: workflowLoading } = useWorkflowStore();
  const { data: activeAgents, isLoading: agentsLoading } = useActiveAgents();
  const { data: affiliateOffers, isLoading: offersLoading } = useAffiliateOffers();
  const { data: systemMetrics, isLoading: metricsLoading } = useSystemMetrics();
  const { data: revenueMetrics, isLoading: revenueLoading } = useRevenueMetrics();
  const { data: automationStats, isLoading: automationLoading } = useAutomationStats();

  // Close mega menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node) &&
          megaButtonRef.current && !megaButtonRef.current.contains(event.target as Node)) {
        setMegaMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMegaMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleNavigate = (path: string) => {
    setLocation(path);
    setMegaMenuOpen(false);
    setMobileMenuOpen(false);
  };

  // 7 Companies Data - Exact as specified
  const companies = [
    {
      icon: Workflow,
      name: 'Automation Services',
      subtitle: '"We Do It for You"',
      oneLiner: 'End-to-end automation design & delivery (audit → integrate → ship).',
      useCases: ['Lead routing', 'Finance ops', 'Ticket triage', 'KPI reporting'],
      value: 'Save hundreds of hours, reduce errors, scale without headcount.',
      cta: 'Book a 72h Pilot Build',
      path: '/automation',
      gradient: 'from-blue-600 to-indigo-600'
    },
    {
      icon: Store,
      name: 'Workflow Store',
      subtitle: 'Prebuilt Flows You Can Deploy Today',
      oneLiner: 'Plug-and-play automations (scraping, enrichment, outreach, finance, reporting).',
      useCases: ['1-click deploy with env/secrets', 'Evergreen with patch notes and guides'],
      value: 'Buy once, run forever, extend as needed.',
      cta: 'Browse 350+ Workflows',
      path: '/workflows',
      gradient: 'from-green-600 to-emerald-600'
    },
    {
      icon: Database,
      name: 'Digital Assets',
      subtitle: 'Accelerators for Growth',
      oneLiner: 'Prompt packs, datasets, playbooks, design kits, creative bundles.',
      useCases: ['Agent prompts (SDR/support)', 'Datasets (finetune/eval)', 'Playbooks', 'Ad & landing creatives'],
      value: 'Ship faster; skip reinvention.',
      cta: 'Download Assets → Go Live Same Day',
      path: '/assets',
      gradient: 'from-purple-600 to-violet-600'
    },
    {
      icon: Bot,
      name: 'AI Agents',
      subtitle: 'Managed + Self-Host Options',
      oneLiner: 'Agents that act, not just chat—integrations, memory, approvals.',
      useCases: ['Managed (we run) or self-host (runbooks)', 'SDR (qualify + book)', 'Support (auto-resolve)', 'Ops (reconcile & notify)'],
      value: 'Reduce repetitive headcount; add intelligent scale.',
      cta: 'Deploy Your First Agent',
      path: '/agents',
      gradient: 'from-cyan-600 to-blue-600'
    },
    {
      icon: TrendingUp,
      name: 'Affiliate Hub',
      subtitle: 'Promote the Best Brands',
      oneLiner: 'Vetted high-EPC brands + dynamic creatives.',
      useCases: ['Smart links (geo/device)', 'Creative rotation', 'Real-time EPC/CVR/payouts', 'Disclosures baked in'],
      value: 'Maximize commission with proven partners.',
      cta: 'Open Affiliate Hub',
      path: '/deals',
      gradient: 'from-orange-600 to-red-600'
    },
    {
      icon: Brain,
      name: 'Decision Platform',
      subtitle: 'End Choice Overload',
      oneLiner: 'Expert guides, interactive comparisons, adaptive quizzes.',
      useCases: ['Best X for Y guides', 'Pros/cons tables', 'Adaptive quiz', 'Research prompts'],
      value: 'Clarity in chaos + monetization via verified offers.',
      cta: 'Take the 2-Minute Quiz',
      path: '/guides',
      gradient: 'from-pink-600 to-rose-600'
    },
    {
      icon: Wrench,
      name: 'Services (Tools)',
      subtitle: 'Practical Utilities for Teams & Individuals',
      oneLiner: 'Self-serve mini-products that solve everyday needs.',
      useCases: ['Resume Maker', 'Cover Letter', 'Portfolio Builder', 'Email Optimizer', 'Ad Copy Splitter', 'Content Calendar Maker'],
      value: 'Handle essentials in minutes.',
      cta: 'Explore Tools',
      path: '/services',
      gradient: 'from-slate-600 to-gray-600'
    }
  ];

  // Solutions by Outcome
  const solutions = [
    { icon: Target, name: 'Lead Generation', path: '/solutions/leadgen' },
    { icon: HeadphonesIcon, name: 'Support Deflection', path: '/solutions/support' },
    { icon: DollarSign, name: 'Finance Ops', path: '/solutions/finops' },
    { icon: ShieldCheck, name: 'Trust & Safety', path: '/solutions/trust' },
    { icon: BarChart, name: 'Product Analytics', path: '/solutions/analytics' },
    { icon: FileText, name: 'Content Ops', path: '/solutions/content' }
  ];

  // Featured Case Studies
  const caseStudies = [
    {
      title: 'SaaS signups ↑43%',
      description: 'Decision Platform + Affiliate Hub + Offer Engine',
      link: '/case/saas-signups'
    },
    {
      title: 'E-com CAC −28%',
      description: 'Workflow bundles + Agents for ops',
      link: '/case/ecom-cac'
    },
    {
      title: 'Ops 72h → 6h',
      description: 'Automation Services + playbooks',
      link: '/case/ops-time'
    }
  ];

  // Live Deals (ticker)
  const liveDeals = [
    { brand: 'NordLayer', text: 'Up to 63% off + 3 months free', code: 'SAVE63' },
    { brand: 'Tesco Mobile', text: 'Free EU roaming + phone bundles', code: 'ROAM24' },
    { brand: 'BitDefender', text: 'Family Pack −55%', code: 'FAMILY55' },
    { brand: 'Shopify', text: '$1/month for 3 months', code: 'START1' },
    { brand: 'HubSpot', text: 'CRM free forever + premium trial', code: 'CRM2024' }
  ];

  // Auto-scroll deals
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDealIndex((prev) => (prev + 1) % liveDeals.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [liveDeals.length]);

  // Blog posts
  const blogPosts = [
    { title: 'Agent Benchmarks: ROI in 90 Days', excerpt: 'Real performance data from 500+ deployments', link: '/blog/agent-benchmarks' },
    { title: 'Automation ROI Calculator', excerpt: 'Calculate your potential savings', link: '/blog/automation-roi' },
    { title: 'Affiliate Compliance Guide 2024', excerpt: 'FTC updates and best practices', link: '/blog/affiliate-compliance' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white">
      {/* Schema.org Structured Data */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Findawise",
            "url": "https://www.findawise.com",
            "logo": "https://www.findawise.com/logo.png",
            "subOrganization": companies.map(company => ({
              "@type": "Organization",
              "name": `Findawise ${company.name}`,
              "url": `https://www.findawise.com${company.path}`
            }))
          })
        }}
      />

      {/* Global Navigation - Sticky Glass Mega-menu */}
      <motion.nav 
        className="sticky top-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.button 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              onClick={() => handleNavigate('/')}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur opacity-75 -z-10" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">
                  Findawise
                </h1>
              </div>
            </motion.button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {/* Companies Mega Menu */}
              <div className="relative">
                <motion.button
                  ref={megaButtonRef}
                  className="flex items-center space-x-1 text-white/70 hover:text-white transition-colors duration-300 font-medium"
                  onClick={() => {
                    setMegaMenuOpen(!megaMenuOpen);
                    track('mega_companies_toggle', { open: !megaMenuOpen });
                  }}
                  whileHover={{ scale: 1.05 }}
                  aria-expanded={megaMenuOpen}
                  aria-haspopup="true"
                >
                  <span>Companies</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${megaMenuOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                {/* Mega Menu */}
                <AnimatePresence>
                  {megaMenuOpen && (
                    <motion.div
                      ref={megaMenuRef}
                      className="absolute left-0 top-full mt-2 w-[800px] p-6 rounded-2xl border border-white/10 bg-black/90 backdrop-blur-xl shadow-2xl"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="grid grid-cols-2 gap-4">
                        {companies.map((company, index) => (
                          <motion.button
                            key={company.name}
                            className="group text-left p-4 rounded-xl border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all duration-300"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => {
                              handleNavigate(company.path);
                              track('company_card_click', { name: company.name });
                            }}
                            onMouseEnter={() => setHoveredCompany(company.name)}
                            onMouseLeave={() => setHoveredCompany(null)}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${company.gradient} flex items-center justify-center flex-shrink-0`}>
                                <company.icon className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                                  {company.name}
                                </h3>
                                <p className="text-xs text-white/60 mb-2">{company.subtitle}</p>
                                <p className="text-sm text-white/80 leading-relaxed">{company.oneLiner}</p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {company.useCases.slice(0, 2).map((useCase, i) => (
                                    <span key={i} className="text-xs px-2 py-1 bg-white/10 rounded-full text-white/70">
                                      {useCase}
                                    </span>
                                  ))}
                                </div>
                                <div className="mt-3 text-blue-400 text-sm font-medium flex items-center">
                                  {company.cta}
                                  <ArrowRight className="w-3 h-3 ml-1" />
                                </div>
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Other Nav Items */}
              {['Empire OS', 'Solutions', 'Case Studies', 'Pricing', 'Blog'].map((item, index) => (
                <motion.button
                  key={item}
                  className="text-white/70 hover:text-white transition-colors duration-300 font-medium"
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleNavigate(`/${item.toLowerCase().replace(' ', '-')}`)}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  {item}
                </motion.button>
              ))}
            </div>

            {/* Right Side - Search & CTAs */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Search companies, solutions, docs…"
                  className="w-64 pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-400 transition-colors"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      track('search_submit', { query: e.currentTarget.value });
                    }
                  }}
                />
              </div>
              <motion.button
                className="text-white/70 hover:text-white transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                onClick={() => handleNavigate('/signin')}
              >
                Sign in
              </motion.button>
              <motion.button
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-blue-500/25"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  handleNavigate('/automation');
                  track('hero_pilot_click');
                }}
              >
                Book a 72h Pilot
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="lg:hidden p-2 text-white"
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* FTC Disclosure Line */}
        <div className="hidden lg:block border-t border-white/10 text-xs text-white/60">
          <div className="max-w-7xl mx-auto px-6 py-2">
            Independent research with clear disclosures. We may earn from qualifying purchases.
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/10"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="p-6 space-y-4">
                {companies.map((company) => (
                  <button
                    key={company.name}
                    className="block w-full text-left p-3 rounded-lg border border-white/10 hover:bg-white/5"
                    onClick={() => handleNavigate(company.path)}
                  >
                    <div className="flex items-center space-x-3">
                      <company.icon className="w-5 h-5 text-blue-400" />
                      <span className="font-medium">{company.name}</span>
                    </div>
                  </button>
                ))}
                <div className="pt-4 border-t border-white/10">
                  <button
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-3 rounded-xl font-semibold"
                    onClick={() => handleNavigate('/automation')}
                  >
                    Book a 72h Pilot
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center px-6 pt-20"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Hero Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Main Headline - Exact Copy */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  Findawise is the{' '}
                </span>
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  AI Operating Company
                </span>
                <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  {' '}behind seven specialist businesses—unified by one Empire OS.
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-white/70 leading-relaxed">
                We design, run, and scale end-to-end systems—automation, agents, affiliate growth, decision platforms, and more—so brands ship outcomes faster with provable ROI.
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              <motion.button
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-xl font-semibold text-lg shadow-2xl shadow-blue-500/25 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  handleNavigate('/automation');
                  track('hero_pilot_click');
                }}
              >
                <span>Book a 72h Pilot Build</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                className="border border-white/20 hover:border-white/40 backdrop-blur-xl px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('companies')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span>Explore our Companies</span>
              </motion.button>
            </motion.div>

            {/* Trust Strip */}
            <motion.div
              className="flex flex-wrap gap-6 pt-4 text-white/60"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
            >
              {['Outcome-backed engagements', 'Transparent research & disclosures', 'Global-ready (security, privacy, SLAs)'].map((item, index) => (
                <motion.div
                  key={item}
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + index * 0.1, duration: 0.8 }}
                >
                  <div className="w-1 h-1 bg-blue-400 rounded-full" />
                  <span className="text-sm font-medium">{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 rounded-3xl overflow-hidden bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-white/10">
                <motion.img
                  src="/hero-orbit-background.png"
                  alt="Empire OS - 7 luminous nodes orbiting central system"
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                  initial={shouldReduceMotion ? {} : { scale: 1.1, opacity: 0 }}
                  animate={shouldReduceMotion ? {} : { scale: 1, opacity: 1 }}
                  transition={shouldReduceMotion ? {} : { duration: 1.5, ease: "easeOut" }}
                />
                
                {/* Floating Company Icons */}
                {companies.slice(0, 7).map((company, index) => (
                  <motion.div
                    key={company.name}
                    className="absolute w-12 h-12 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl rounded-xl border border-white/20 flex items-center justify-center cursor-pointer"
                    style={{
                      top: `${20 + (index * 8)}%`,
                      left: `${15 + (index % 2 === 0 ? 70 : 5)}%`,
                    }}
                    animate={shouldReduceMotion ? {} : {
                      y: [0, -10, 0],
                      rotate: [0, 360],
                    }}
                    transition={shouldReduceMotion ? {} : {
                      y: { duration: 3, repeat: Infinity, delay: index * 0.5 },
                      rotate: { duration: 20, repeat: Infinity, ease: "linear" }
                    }}
                    whileHover={{ scale: 1.2 }}
                    onClick={() => handleNavigate(company.path)}
                  >
                    <company.icon className="w-6 h-6 text-white" />
                  </motion.div>
                ))}
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl -z-10" />
            </div>

            {/* Motion Control */}
            <motion.button
              className="absolute top-4 right-4 bg-black/50 backdrop-blur-xl rounded-full p-2 border border-white/20"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsVideoPlaying(!isVideoPlaying)}
            >
              {isVideoPlaying ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <PlayCircle className="w-5 h-5" />
              )}
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* KPI / Credibility Bar */}
      <motion.section
        className="py-12 px-6 border-t border-white/10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold text-white mb-2">&lt; 60 sec</div>
              <div className="text-white/60">Average time-to-decision</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold text-white mb-2">up to 40%</div>
              <div className="text-white/60">Median savings with verified deals</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold text-white mb-2">3–10×</div>
              <div className="text-white/60">Execution speed-up (workflows + agents)</div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Our Companies - Portfolio Grid */}
      <motion.section
        id="companies"
        className="py-20 px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Our Companies
              </span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Each card is a company with its own roadmap, pricing, docs, and deep hooks to Empire OS.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {companies.map((company, index) => (
              <motion.div
                key={company.name}
                className="group relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                onMouseEnter={() => setHoveredCompany(company.name)}
                onMouseLeave={() => setHoveredCompany(null)}
              >
                <motion.div
                  className="relative p-8 rounded-3xl border border-white/10 backdrop-blur-xl overflow-hidden h-full bg-gradient-to-br from-white/5 to-white/0"
                  whileHover={{ y: -10, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <motion.div
                          className={`w-14 h-14 bg-gradient-to-br ${company.gradient} rounded-2xl flex items-center justify-center shadow-lg`}
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.8 }}
                        >
                          <company.icon className="w-7 h-7 text-white" />
                        </motion.div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{company.name}</h3>
                          <p className="text-sm text-white/60 font-medium">{company.subtitle}</p>
                        </div>
                      </div>
                    </div>

                    {/* One-liner */}
                    <p className="text-white/80 mb-6 leading-relaxed text-lg">
                      {company.oneLiner}
                    </p>

                    {/* Use Cases */}
                    <div className="space-y-3 mb-6">
                      {company.useCases.slice(0, 4).map((useCase, i) => (
                        <motion.div
                          key={useCase}
                          className="flex items-center space-x-3"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 + i * 0.1 + 0.5 }}
                          viewport={{ once: true }}
                        >
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                          <span className="text-white/70 text-sm">{useCase}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Value Prop */}
                    <p className="text-blue-300 mb-8 font-medium">
                      {company.value}
                    </p>

                    {/* CTA */}
                    <motion.button
                      className={`w-full bg-gradient-to-r ${company.gradient} hover:shadow-lg hover:shadow-current/25 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        handleNavigate(company.path);
                        track('company_card_click', { name: company.name });
                      }}
                    >
                      <span>{company.cta}</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>

                  {/* Background Icon */}
                  <motion.div
                    className="absolute top-0 right-0 w-32 h-32 opacity-5"
                    animate={{
                      rotate: hoveredCompany === company.name ? 360 : 0,
                      scale: hoveredCompany === company.name ? 1.2 : 1,
                    }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  >
                    <company.icon className="w-full h-full" />
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Empire OS Section */}
      <motion.section
        className="py-20 px-6 border-t border-white/10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Empire OS
              </span>
            </h2>
            <p className="text-2xl text-white/70 mb-8">One backbone, seven frontiers.</p>
            
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
              {[
                { name: 'Offer Engine', icon: Target },
                { name: 'Workflow Runtime', icon: Workflow },
                { name: 'Agent Framework', icon: Bot },
                { name: 'Decision Brain', icon: Brain },
                { name: 'Analytics Fabric', icon: BarChart },
                { name: 'Privacy & Compliance', icon: Shield }
              ].map((pillar, index) => (
                <motion.div
                  key={pillar.name}
                  className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <pillar.icon className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-white font-semibold text-sm">{pillar.name}</h3>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="px-8 py-3 border border-white/20 rounded-xl font-semibold text-white hover:border-white/40 transition-colors"
                whileHover={{ scale: 1.05 }}
                onClick={() => handleNavigate('/empire-os')}
              >
                Explore Empire OS
              </motion.button>
              <motion.button
                className="px-8 py-3 border border-white/20 rounded-xl font-semibold text-white hover:border-white/40 transition-colors"
                whileHover={{ scale: 1.05 }}
                onClick={() => handleNavigate('/security')}
              >
                Read Security & Compliance
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Solutions by Outcome */}
      <motion.section
        className="py-20 px-6 border-t border-white/10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Solutions by Outcome
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <motion.button
                key={solution.name}
                className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl text-left hover:bg-white/10 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={() => {
                  handleNavigate(solution.path);
                  track('solutions_tile_click', { name: solution.name });
                }}
              >
                <solution.icon className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{solution.name}</h3>
                <ArrowRight className="w-5 h-5 text-blue-400" />
              </motion.button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Featured Case Studies */}
      <motion.section
        className="py-20 px-6 border-t border-white/10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Case Studies
              </span>
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <motion.button
                key={study.title}
                className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl text-left hover:bg-white/10 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={() => {
                  handleNavigate(study.link);
                  track('case_study_open', { name: study.title });
                }}
              >
                <h3 className="text-2xl font-bold text-white mb-4">{study.title}</h3>
                <p className="text-white/70 mb-6">{study.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-blue-400 font-semibold">View Case Study</span>
                  <ArrowRight className="w-5 h-5 text-blue-400" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Live Deals Ticker */}
      <motion.section
        className="py-12 px-6 border-t border-white/10 overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Today's Verified Deals</h2>
            <div className="text-sm text-white/60">Auto-updating • Pause on hover</div>
          </div>
          
          <div className="relative overflow-hidden">
            <motion.div
              className="flex space-x-6"
              animate={{ x: `-${currentDealIndex * 300}px` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {liveDeals.map((deal, index) => (
                <motion.div
                  key={`${deal.brand}-${index}`}
                  className="flex-shrink-0 w-80 p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
                  whileHover={{ scale: 1.05 }}
                  onHoverStart={() => {/* Pause auto-scroll */}}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white mb-1">{deal.brand}</h3>
                      <p className="text-white/70 text-sm">{deal.text}</p>
                    </div>
                    <motion.button
                      className="px-4 py-2 bg-blue-600 rounded-lg text-white font-semibold text-sm"
                      whileHover={{ scale: 1.05 }}
                      onClick={() => track('deal_reveal_click', { brand: deal.brand })}
                    >
                      Reveal Code
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Thought Leadership */}
      <motion.section
        className="py-20 px-6 border-t border-white/10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Insights
              </span>
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.button
                key={post.title}
                className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl text-left hover:bg-white/10 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={() => handleNavigate(post.link)}
              >
                <h3 className="text-xl font-bold text-white mb-4">{post.title}</h3>
                <p className="text-white/70 mb-6">{post.excerpt}</p>
                <div className="flex items-center text-blue-400">
                  <span className="font-semibold">Read Article</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </motion.button>
            ))}
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.button
              className="px-8 py-3 border border-white/20 rounded-xl font-semibold text-white hover:border-white/40 transition-colors"
              whileHover={{ scale: 1.05 }}
              onClick={() => handleNavigate('/blog')}
            >
              Read the Blog
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Lead Magnet */}
      <motion.section
        className="py-20 px-6 border-t border-white/10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">Get the Empire Briefing</h2>
            <p className="text-xl text-white/70 mb-8">
              Bi-weekly playbooks, benchmarks & real-world deals. No fluff.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-400 transition-colors"
                required
              />
              <motion.button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.preventDefault();
                  track('newsletter_subscribe');
                }}
              >
                Subscribe
              </motion.button>
            </form>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        className="border-t border-white/10 py-16 px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid lg:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Findawise</h3>
                  <p className="text-xs text-white/60">AI Operating Company</p>
                </div>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                Seven specialist businesses unified by one Empire OS. Delivering measurable outcomes through automation, AI, and intelligent systems.
              </p>
            </div>

            {/* Companies */}
            <div>
              <h4 className="font-semibold text-white mb-4">Companies</h4>
              <div className="space-y-2">
                {companies.slice(0, 4).map((company) => (
                  <button
                    key={company.name}
                    className="block text-white/60 hover:text-white transition-colors text-sm"
                    onClick={() => handleNavigate(company.path)}
                  >
                    {company.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform */}
            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <div className="space-y-2">
                {['Empire OS', 'Security', 'API Docs', 'Status'].map((item) => (
                  <button
                    key={item}
                    className="block text-white/60 hover:text-white transition-colors text-sm"
                    onClick={() => handleNavigate(`/${item.toLowerCase().replace(' ', '-')}`)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <div className="space-y-2">
                {['Case Studies', 'Blog', 'Help Center', 'Contact'].map((item) => (
                  <button
                    key={item}
                    className="block text-white/60 hover:text-white transition-colors text-sm"
                    onClick={() => handleNavigate(`/${item.toLowerCase().replace(' ', '-')}`)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Legal Links */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center">
              <div className="flex flex-wrap gap-6 text-sm text-white/60 mb-6 lg:mb-0">
                {[
                  'About', 'Careers', 'Press', 'Affiliate Disclosure', 
                  'Privacy', 'Terms', 'Cookies', 'Accessibility (WCAG 2.2)'
                ].map((item) => (
                  <button
                    key={item}
                    className="hover:text-white transition-colors"
                    onClick={() => {
                      handleNavigate(`/${item.toLowerCase().replace(/[^a-z0-9]/g, '-')}`);
                      if (item === 'Affiliate Disclosure') {
                        track('cta_footer_disclosure_open');
                      }
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
              
              <div className="text-sm text-white/50">
                © 2024 Findawise Empire. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}