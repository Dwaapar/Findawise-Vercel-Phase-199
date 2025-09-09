import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Activity, Shield, Database, Cpu, Network, 
  Zap, Eye, Target, TrendingUp, BarChart3, Globe,
  Lock, Bot, Sparkles, Code, Settings, Power,
  ChevronRight, Play, Pause, RefreshCw, AlertTriangle,
  CheckCircle, XCircle, Clock, Users, DollarSign,
  Layers, Command, Terminal, Rocket, Crown, Star,
  ArrowRight, Lightning, Infinity, Gem
} from 'lucide-react';

interface FeatureCardProps {
  feature: {
    id: string;
    name: string;
    description: string;
    icon: React.ElementType;
    status: 'operational' | 'enhanced' | 'revolutionary';
    metrics: { label: string; value: string; change?: string }[];
    color: string;
  };
  index: number;
}

function FeatureCard({ feature, index }: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const statusConfig = {
    operational: { badge: 'Operational', color: 'text-green-400', bg: 'bg-green-500/20' },
    enhanced: { badge: 'Enhanced', color: 'text-blue-400', bg: 'bg-blue-500/20' },
    revolutionary: { badge: 'Revolutionary', color: 'text-purple-400', bg: 'bg-purple-500/20' }
  };

  const config = statusConfig[feature.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      {/* Hover Glow Effect */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`absolute -inset-4 rounded-2xl bg-gradient-to-r ${feature.color} opacity-20 blur-xl`}
          />
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        className="relative p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 h-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color}`}>
            <feature.icon className="w-8 h-8 text-white" />
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.color}`}>
            {config.badge}
          </div>
        </div>

        {/* Title & Description */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
            {feature.name}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            {feature.description}
          </p>
        </div>

        {/* Metrics */}
        <div className="space-y-4">
          {feature.metrics.map((metric, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">{metric.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold">{metric.value}</span>
                {metric.change && (
                  <span className="text-green-400 text-xs">{metric.change}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <motion.div
          className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity"
          whileHover={{ x: 5 }}
        >
          <button className="flex items-center gap-2 text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors">
            Explore Details
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function EnterpriseFeatures() {
  const features = [
    {
      id: 'ai-brain',
      name: 'Multi-Provider AI Brain',
      description: 'Advanced language model orchestration with semantic intelligence and real-time learning capabilities.',
      icon: Brain,
      status: 'revolutionary' as const,
      metrics: [
        { label: 'AI Providers', value: '5+', change: '+2 new' },
        { label: 'Queries/sec', value: '1.2K', change: '+15%' },
        { label: 'Accuracy', value: '99.7%', change: '+0.3%' }
      ],
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'database',
      name: 'Enterprise Database',
      description: 'Massive 450+ table architecture with auto-healing performance optimization and real-time synchronization.',
      icon: Database,
      status: 'operational' as const,
      metrics: [
        { label: 'Active Tables', value: '450+' },
        { label: 'Operations/sec', value: '50K' },
        { label: 'Uptime', value: '99.9%' }
      ],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'neural-federation',
      name: 'Neural Federation',
      description: 'Distributed intelligence network with 7+ specialized neurons working in perfect harmony.',
      icon: Network,
      status: 'enhanced' as const,
      metrics: [
        { label: 'Active Neurons', value: '7+' },
        { label: 'Connections', value: '15K+' },
        { label: 'Efficiency', value: '98.5%' }
      ],
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'security',
      name: 'Quantum Security Shield',
      description: 'Bank-grade security with AI-powered threat detection and zero-trust architecture.',
      icon: Shield,
      status: 'operational' as const,
      metrics: [
        { label: 'Threats Blocked', value: '100%' },
        { label: 'Scans/day', value: '24/7' },
        { label: 'Vulnerabilities', value: '0' }
      ],
      color: 'from-red-500 to-orange-500'
    },
    {
      id: 'revenue-engine',
      name: 'Revenue Engine',
      description: 'Autonomous revenue generation with 13+ affiliate networks and AI-optimized conversions.',
      icon: DollarSign,
      status: 'revolutionary' as const,
      metrics: [
        { label: 'Revenue Today', value: '$47.3K', change: '+23%' },
        { label: 'Conversion Rate', value: '12.8%', change: '+5.2%' },
        { label: 'Active Streams', value: '13+' }
      ],
      color: 'from-amber-500 to-orange-500'
    },
    {
      id: 'analytics',
      name: 'Real-time Analytics',
      description: 'Advanced behavioral analytics with predictive insights and automated optimization.',
      icon: BarChart3,
      status: 'enhanced' as const,
      metrics: [
        { label: 'Data Points/sec', value: '2.5K' },
        { label: 'Predictions', value: '95.2%', change: '+2.1%' },
        { label: 'Insights', value: 'Real-time' }
      ],
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 backdrop-blur-sm mb-6">
            <Crown className="w-5 h-5 text-blue-400" />
            <span className="text-blue-300 font-semibold">Enterprise-Grade Features</span>
            <Gem className="w-4 h-4 text-blue-400" />
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Billion-Dollar
            </span>
            <br />
            <span className="text-white">Platform Features</span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Each component designed for enterprise-scale operations with 
            <span className="text-blue-400 font-semibold"> unlimited scalability</span>, 
            <span className="text-purple-400 font-semibold"> AI intelligence</span>, and 
            <span className="text-green-400 font-semibold"> zero downtime</span>.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-20 p-8 rounded-2xl bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl border border-white/20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">450+</div>
              <div className="text-gray-400">Database Tables</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-2">99.9%</div>
              <div className="text-gray-400">System Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400 mb-2">1M+</div>
              <div className="text-gray-400">Concurrent Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-400 mb-2">∞</div>
              <div className="text-gray-400">Scaling Potential</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}