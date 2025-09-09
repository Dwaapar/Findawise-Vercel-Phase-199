import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Bot, Zap, TrendingUp, Users, Target, ArrowRight, Play,
  CheckCircle, Sparkles, Brain, Network, Crown, Star
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface DigitalAssetHeroProps {
  onNavigate?: (path: string) => void;
}

export function DigitalAssetHero({ onNavigate }: DigitalAssetHeroProps) {
  const [currentService, setCurrentService] = useState(0);
  const { scrollY } = useScroll();
  
  // Parallax transforms
  const heroY = useTransform(scrollY, [0, 500], [0, -150]);
  const contentY = useTransform(scrollY, [0, 500], [0, -75]);

  // Real-time metrics
  const { data: systemStats } = useQuery({
    queryKey: ['business-metrics'],
    queryFn: () => fetch('/api/analytics/business-metrics').then(res => res.json()),
    refetchInterval: 5000,
  });

  // Service highlights
  const serviceHighlights = [
    {
      title: "Intelligent Process Automation",
      description: "Enterprise-grade AI agents that automate complex workflows with self-learning capabilities",
      icon: Bot,
      color: "from-purple-500 to-pink-500",
      metrics: { efficiency: "85% boost", accuracy: "99.5%", scale: "Fortune 500" }
    },
    {
      title: "Advanced Analytics Platform", 
      description: "Real-time insights and predictive models powered by enterprise AI infrastructure",
      icon: Brain,
      color: "from-blue-500 to-cyan-500",
      metrics: { insights: "Real-time", models: "100+", roi: "4.9x return" }
    },
    {
      title: "Strategic Partnerships",
      description: "Enterprise alliance management with performance tracking and optimization",
      icon: Network,
      color: "from-green-500 to-emerald-500",
      metrics: { partners: "Global", network: "Verified", growth: "Scalable" }
    },
    {
      title: "Industry Solutions",
      description: "Vertical-specific AI applications for finance, healthcare, manufacturing, and more",
      icon: Sparkles,
      color: "from-orange-500 to-red-500",
      metrics: { industries: "15+", compliance: "SOC 2", support: "24/7" }
    }
  ];

  // Auto-cycle services
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentService((prev) => (prev + 1) % serviceHighlights.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentHighlight = serviceHighlights[currentService];
  const Icon = currentHighlight.icon;

  return (
    <motion.section 
      style={{ y: heroY }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden backdrop-blur-sm"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            animate={{
              x: [0, Math.random() * 1000],
              y: [0, Math.random() * 1000],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div 
            style={{ y: contentY }}
            className="space-y-8"
          >
            {/* Company Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 
                         border border-purple-500/30 rounded-full px-6 py-3 backdrop-blur-sm"
            >
              <img src="/attached_assets/generated_images/Professional_Findawise_Empire_logo_387a5b48.png" alt="Findawise Empire" className="w-8 h-8" />
              <span className="text-lg font-bold">Findawise Empire</span>
              <Star className="w-5 h-5 text-yellow-400" />
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
                Digital Asset Excellence
                <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 
                               bg-clip-text text-transparent">
                  For Enterprise Success
                </span>
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 leading-relaxed">
                The ultimate platform for <strong className="text-white">Agentic AI</strong>, <strong className="text-white">Affiliate Services</strong>, and 
                comprehensive <strong className="text-white">Neuron Solutions</strong>. Transform your business with 
                world-class <strong className="text-white">digital assets</strong> that drive real results.
              </p>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {["SOC 2 Compliant", "99.9% Uptime", "Enterprise Security"].map((trust, index) => (
                <div 
                  key={trust}
                  className="flex items-center space-x-2 bg-white/5 border border-white/10 
                           rounded-lg px-3 py-2 backdrop-blur-sm"
                >
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium">{trust}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <button
                onClick={() => onNavigate?.('/showcase')}
                className="group relative bg-gradient-to-r from-purple-600 to-pink-600 
                         text-white px-8 py-4 rounded-xl font-semibold text-lg
                         hover:from-purple-700 hover:to-pink-700 transition-all duration-300
                         shadow-lg hover:shadow-purple-500/25"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              
              <button
                onClick={() => onNavigate?.('/showcase')}
                className="group flex items-center justify-center space-x-2 border-2 border-white/20 
                         text-white px-8 py-4 rounded-xl font-semibold text-lg
                         hover:bg-white/10 hover:border-white/30 transition-all duration-300"
              >
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </button>
            </motion.div>

            {/* Platform Features */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  Enterprise
                </div>
                <div className="text-sm text-gray-400">Grade Platform</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  24/7
                </div>
                <div className="text-sm text-gray-400">Expert Support</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  Global
                </div>
                <div className="text-sm text-gray-400">Reach & Scale</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Interactive Service Demo */}
          <motion.div
            style={{ y: contentY }}
            className="relative"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentService}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 
                         rounded-2xl p-8 backdrop-blur-sm space-y-6"
              >
                {/* Service Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${currentHighlight.color} 
                               flex items-center justify-center mb-6`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Service Details */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-white">
                    {currentHighlight.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {currentHighlight.description}
                  </p>
                </div>

                {/* Service Metrics */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                  {Object.entries(currentHighlight.metrics).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-lg font-bold text-white">{value}</div>
                      <div className="text-xs text-gray-400 capitalize">{key}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Service Navigation Dots */}
            <div className="flex justify-center space-x-2 mt-6">
              {serviceHighlights.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentService(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentService 
                      ? 'bg-purple-400 w-8' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}