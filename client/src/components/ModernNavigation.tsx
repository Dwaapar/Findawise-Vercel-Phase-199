import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { 
  Crown, Menu, X, Home, Brain, Shield, Database,
  Users, BarChart3, Settings, Sparkles, Globe,
  Cpu, Network, Bot, Activity, Command
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ModernNavigation() {
  const [location, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { 
      name: 'Empire Home', 
      path: '/', 
      icon: Crown,
      description: 'Enterprise Command Center'
    },
    { 
      name: 'Empire Dashboard', 
      path: '/empire-dashboard', 
      icon: BarChart3,
      description: 'Business Intelligence Hub'
    },
    {
      name: 'Admin Center',
      path: '/admin/comprehensive',
      icon: Command,
      description: 'Complete System Management'
    },
    { 
      name: 'SaaS Tools', 
      path: '/saas-home', 
      icon: Cpu,
      description: 'Software Intelligence Platform'
    },
    { 
      name: 'Finance Hub', 
      path: '/finance', 
      icon: BarChart3,
      description: 'Financial Intelligence Center'
    },
    { 
      name: 'Health & Wellness', 
      path: '/health', 
      icon: Activity,
      description: 'Wellness Analytics Platform'
    },
    { 
      name: 'Travel Intelligence', 
      path: '/travel', 
      icon: Globe,
      description: 'Global Travel Analytics'
    },
    { 
      name: 'AI Tools Hub', 
      path: '/ai-tools', 
      icon: Brain,
      description: 'Advanced AI Capabilities'
    }
  ];

  const toggleNavigation = () => setIsOpen(!isOpen);
  
  const handleNavigation = (path: string) => {
    setLocation(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Navigation Header */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-950/95 via-blue-950/95 to-purple-950/95 backdrop-blur-xl border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => handleNavigation('/')}
            >
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-white">Findawise Empire</h1>
                <p className="text-xs text-gray-400">Billion-Dollar Intelligence</p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigationItems.slice(0, 4).map((item) => {
                const isActive = location === item.path;
                return (
                  <motion.button
                    key={item.path}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavigation(item.path)}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
                      ${isActive 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }
                    `}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="hidden xl:block">{item.name}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* System Status Indicator */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="font-medium">Systems Operational</span>
              </div>
              
              <Button
                onClick={() => handleNavigation('/admin/comprehensive')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white"
              >
                <Command className="w-4 h-4 mr-2" />
                Admin
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              onClick={toggleNavigation}
              className="lg:hidden p-2"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Mobile Menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed top-16 right-0 bottom-0 w-80 bg-gradient-to-br from-slate-950/98 via-blue-950/98 to-purple-950/98 backdrop-blur-xl border-l border-white/10 z-50 lg:hidden"
            >
              <div className="p-6">
                <div className="space-y-2">
                  {navigationItems.map((item, index) => {
                    const isActive = location === item.path;
                    return (
                      <motion.button
                        key={item.path}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleNavigation(item.path)}
                        className={`
                          w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all
                          ${isActive 
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                          }
                        `}
                      >
                        <item.icon className="w-5 h-5" />
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs opacity-70">{item.description}</div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Mobile System Status */}
                <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2 text-green-400 mb-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="font-semibold">All Systems Operational</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Enterprise infrastructure running at peak performance
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navigation */}
      <div className="h-16" />
    </>
  );
}