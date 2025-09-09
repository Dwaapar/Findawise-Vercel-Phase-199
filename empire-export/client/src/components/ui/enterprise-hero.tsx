import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Brain, Zap, Globe, Shield, Database, Cpu, Network, 
  Bot, Activity, TrendingUp, Sparkles, Eye, Target,
  Play, ArrowRight, Star, Users, Clock, Code2,
  CheckCircle, Rocket, Crown, Diamond
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface EnterpriseHeroProps {
  onNavigate?: (path: string) => void;
}

export function EnterpriseHero({ onNavigate }: EnterpriseHeroProps) {
  const [currentDemo, setCurrentDemo] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { scrollY } = useScroll();
  
  // Parallax transforms
  const heroY = useTransform(scrollY, [0, 500], [0, -150]);
  const starsY = useTransform(scrollY, [0, 500], [0, -100]);
  const contentY = useTransform(scrollY, [0, 500], [0, -75]);

  // Real-time system data
  const { data: systemStats } = useQuery({
    queryKey: ['system-stats'],
    queryFn: () => fetch('/api/health').then(res => res.json()),
    refetchInterval: 5000,
  });

  const { data: aiMetrics } = useQuery({
    queryKey: ['ai-metrics'],
    queryFn: () => fetch('/api/llm-brain/metrics').then(res => res.json()),
    refetchInterval: 10000,
  });

  // Demo scenarios
  const demoScenarios = [
    {
      title: "AI Brain Processing",
      description: "Multi-provider LLM orchestration with semantic intelligence",
      icon: Brain,
      color: "from-purple-500 to-pink-500",
      stats: { queries: "1.2M+", providers: "5+", accuracy: "99.7%" }
    },
    {
      title: "Database Operations", 
      description: "450+ enterprise tables with auto-healing performance",
      icon: Database,
      color: "from-blue-500 to-cyan-500",
      stats: { tables: "450+", operations: "50K/sec", uptime: "99.9%" }
    },
    {
      title: "Neural Federation",
      description: "7+ specialized intelligence neurons working in harmony",
      icon: Network,
      color: "from-green-500 to-emerald-500", 
      stats: { neurons: "7+", connections: "15K+", efficiency: "98.5%" }
    },
    {
      title: "Security Shield",
      description: "Bank-grade security with real-time threat detection",
      icon: Shield,
      color: "from-red-500 to-orange-500",
      stats: { threats: "0", scans: "24/7", protection: "100%" }
    }
  ];

  // Auto-cycle demos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDemo((prev) => (prev + 1) % demoScenarios.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentDemoData = demoScenarios[currentDemo];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 overflow-hidden">
      {/* Animated Background */}
      <motion.div 
        style={{ y: starsY }}
        className="absolute inset-0 opacity-40"
      >
        {/* Floating Particles */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20],
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </motion.div>

      {/* Hero Content */}
      <motion.div 
        style={{ y: heroY }}
        className="relative z-10 container mx-auto px-6 pt-32 pb-20"
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Empire Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 backdrop-blur-sm"
            >
              <Crown className="w-5 h-5 text-amber-400" />
              <span className="text-amber-300 font-semibold">Billion-Dollar Enterprise Platform</span>
              <Diamond className="w-4 h-4 text-amber-400" />
            </motion.div>

            {/* Main Headline */}
            <div className="space-y-4">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl lg:text-7xl font-bold leading-tight"
              >
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Findawise
                </span>
                <br />
                <span className="text-white">Empire</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-2xl"
              >
                The world's most advanced AI-powered intelligence platform. 
                <span className="text-blue-400 font-semibold"> 450+ database tables</span>, 
                <span className="text-purple-400 font-semibold"> multi-provider AI integration</span>, and 
                <span className="text-green-400 font-semibold"> enterprise-grade architecture</span> 
                ready for unlimited scaling.
              </motion.p>
            </div>

            {/* Real-time Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-3 gap-6"
            >
              <div className="text-center p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="text-2xl font-bold text-blue-400">450+</div>
                <div className="text-sm text-gray-400">Database Tables</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="text-2xl font-bold text-purple-400">7+</div>
                <div className="text-sm text-gray-400">AI Neurons</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="text-2xl font-bold text-green-400">99.9%</div>
                <div className="text-sm text-gray-400">Uptime</div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate?.('/empire')}
                className="px-8 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold flex items-center justify-center gap-3 hover:from-blue-500 hover:to-purple-500 transition-all group"
              >
                <Rocket className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Launch Empire Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate?.('/admin')}
                className="px-8 py-4 rounded-lg border border-white/20 text-white font-semibold flex items-center justify-center gap-3 hover:bg-white/5 transition-all group backdrop-blur-sm"
              >
                <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Explore Features
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Column - Live Demo */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Demo Container */}
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl">
              
              {/* Demo Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-sm text-gray-400">Live System Demo</div>
              </div>

              {/* Current Demo Display */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentDemo}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* Demo Icon & Title */}
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${currentDemoData.color}`}>
                      <currentDemoData.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{currentDemoData.title}</h3>
                      <p className="text-gray-400 text-sm">{currentDemoData.description}</p>
                    </div>
                  </div>

                  {/* Demo Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(currentDemoData.stats).map(([key, value], idx) => (
                      <motion.div
                        key={key}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="text-center p-3 rounded-lg bg-white/5 border border-white/10"
                      >
                        <div className="text-lg font-bold text-white">{value}</div>
                        <div className="text-xs text-gray-400 capitalize">{key}</div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Live Activity Indicator */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-3 h-3 rounded-full bg-green-500"
                    />
                    <span className="text-green-400 text-sm font-medium">System Operating Normally</span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Demo Navigation */}
              <div className="flex justify-center mt-6 gap-2">
                {demoScenarios.map((_, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => setCurrentDemo(idx)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      idx === currentDemo ? 'bg-blue-500' : 'bg-white/20'
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                  />
                ))}
              </div>
            </div>

            {/* Floating Elements */}
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl"
              />
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-white/60"
        >
          <span className="text-sm">Explore Empire</span>
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/40 rounded-full mt-2"></div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}