import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Activity, Shield, Database, Cpu, Network, 
  Zap, Eye, Target, TrendingUp, BarChart3, Globe,
  Lock, Bot, Sparkles, Code, Settings, Power,
  ChevronRight, Play, Pause, RefreshCw, AlertTriangle,
  CheckCircle, XCircle, Clock, Users, DollarSign,
  Menu, X, Home, Crown, Rocket, Star, Search,
  Command, Terminal, Layers
} from 'lucide-react';
import { useLocation } from 'wouter';

interface NavigationItem {
  id: string;
  name: string;
  path: string;
  icon: React.ElementType;
  description?: string;
  category: 'main' | 'admin' | 'neuron' | 'tools';
  status?: 'active' | 'beta' | 'new';
}

const navigationItems: NavigationItem[] = [
  // Main Navigation
  { id: 'home', name: 'Home', path: '/', icon: Home, category: 'main' },
  { id: 'empire', name: 'Empire Dashboard', path: '/empire', icon: Crown, category: 'main', status: 'active' },
  { id: 'admin', name: 'Admin Center', path: '/admin', icon: Command, category: 'main' },
  
  // Admin Features
  { id: 'ai-dashboard', name: 'AI Control Center', path: '/admin/ai-dashboard', icon: Brain, category: 'admin', status: 'active' },
  { id: 'analytics', name: 'Analytics Hub', path: '/admin/analytics', icon: BarChart3, category: 'admin' },
  { id: 'security', name: 'Security Center', path: '/admin/security', icon: Shield, category: 'admin' },
  { id: 'federation', name: 'Neural Federation', path: '/admin/neuron-federation', icon: Network, category: 'admin' },
  { id: 'vector-search', name: 'Vector Search', path: '/admin/vector-search', icon: Search, category: 'admin', status: 'beta' },
  { id: 'revenue', name: 'Revenue Engine', path: '/admin/revenue-split', icon: DollarSign, category: 'admin' },
  
  // Specialized Neurons
  { id: 'finance', name: 'Finance Neuron', path: '/finance', icon: TrendingUp, category: 'neuron', status: 'active' },
  { id: 'health', name: 'Health Neuron', path: '/health', icon: Activity, category: 'neuron', status: 'active' },
  { id: 'travel', name: 'Travel Neuron', path: '/travel', icon: Globe, category: 'neuron', status: 'active' },
  { id: 'ai-tools', name: 'AI Tools Neuron', path: '/ai-tools', icon: Bot, category: 'neuron', status: 'active' },
  { id: 'security-neuron', name: 'Security Neuron', path: '/security', icon: Lock, category: 'neuron', status: 'active' },
  
  // Tools & Utilities
  { id: 'storefront', name: 'Digital Storefront', path: '/store', icon: Sparkles, category: 'tools', status: 'new' },
  { id: 'codex', name: 'Code Audit', path: '/admin/codex-audit', icon: Code, category: 'tools' },
  { id: 'deployment', name: 'Deployment Center', path: '/admin/deployment-dashboard', icon: Rocket, category: 'tools' },
];

interface ModernNavigationProps {
  className?: string;
}

export function ModernNavigation({ className = '' }: ModernNavigationProps) {
  const [location, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('main');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter items based on search and category
  const filteredItems = navigationItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'main', name: 'Main', icon: Home },
    { id: 'admin', name: 'Admin', icon: Settings },
    { id: 'neuron', name: 'Neurons', icon: Brain },
    { id: 'tools', name: 'Tools', icon: Layers },
  ];

  // Close on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    const configs = {
      active: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Active' },
      beta: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Beta' },
      new: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'New' },
    };
    
    const config = configs[status as keyof typeof configs];
    if (!config) return null;

    return (
      <span className={`px-2 py-1 text-xs rounded-full ${config.bg} ${config.text} font-medium`}>
        {config.label}
      </span>
    );
  };

  return (
    <>
      {/* Navigation Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-6 right-6 z-50 p-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:from-blue-500 hover:to-purple-500 transition-all ${className}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Navigation Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Navigation Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-gradient-to-br from-slate-950/95 via-blue-950/95 to-purple-950/95 backdrop-blur-xl border-l border-white/20 z-45 overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Empire Navigation</h2>
                    <p className="text-sm text-gray-400">450+ features at your command</p>
                  </div>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search features..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Category Filters */}
              <div className="p-4 border-b border-white/10">
                <div className="flex gap-2 overflow-x-auto">
                  {categories.map((category) => (
                    <motion.button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-2 transition-all ${
                        activeCategory === category.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <category.icon className="w-4 h-4" />
                      {category.name}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {filteredItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    onClick={() => setLocation(item.path)}
                    className={`w-full p-4 rounded-lg text-left transition-all group hover:bg-white/10 ${
                      location === item.path ? 'bg-blue-600/20 border border-blue-500/30' : 'bg-white/5'
                    }`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg transition-all ${
                          location === item.path 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white/10 text-gray-400 group-hover:bg-white/20 group-hover:text-white'
                        }`}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium text-white group-hover:text-blue-400 transition-colors">
                            {item.name}
                          </div>
                          {item.description && (
                            <div className="text-sm text-gray-400">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(item.status)}
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-white/10">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-green-400">99.9%</div>
                    <div className="text-xs text-gray-400">Uptime</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-400">450+</div>
                    <div className="text-xs text-gray-400">Tables</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-400">7+</div>
                    <div className="text-xs text-gray-400">Neurons</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}