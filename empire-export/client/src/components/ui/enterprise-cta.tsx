import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { 
  Rocket, Crown, Star, ArrowRight, Download, 
  Play, ExternalLink, Code2, Github, Zap,
  Shield, Database, Brain, CheckCircle,
  Sparkles, Gem, Trophy, Target
} from 'lucide-react';

interface ActionButtonProps {
  variant: 'primary' | 'secondary' | 'outline';
  icon: React.ElementType;
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
}

function ActionButton({ variant, icon: Icon, children, onClick, href, className = '' }: ActionButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 shadow-lg hover:shadow-blue-500/25',
    secondary: 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-500 hover:to-emerald-500 shadow-lg hover:shadow-green-500/25',
    outline: 'border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40 backdrop-blur-sm'
  };

  const Component = href ? 'a' : 'button';
  const props = href ? { href, target: '_blank', rel: 'noopener noreferrer' } : { onClick };

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="group"
    >
      <Component
        {...props}
        className={`
          inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg
          transition-all duration-300 ${variants[variant]} ${className}
        `}
      >
        <Icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
        {children}
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Component>
    </motion.div>
  );
}

interface EnterpriseCtaProps {
  onNavigate?: (path: string) => void;
}

export function EnterpriseCta({ onNavigate }: EnterpriseCtaProps) {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  const platformFeatures = [
    { icon: Database, label: '450+ Tables', color: 'text-blue-400' },
    { icon: Brain, label: 'Multi-AI', color: 'text-purple-400' },
    { icon: Shield, label: 'Bank Security', color: 'text-red-400' },
    { icon: Zap, label: 'Real-time', color: 'text-yellow-400' },
  ];

  const achievements = [
    'Enterprise-grade architecture',
    'Billion-dollar scalability',
    'Zero-downtime deployment',
    'AI-powered optimization',
    'Multi-region ready',
    'Infinite scaling potential'
  ];

  return (
    <section className="relative py-20 px-6 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/30 via-purple-950/30 to-slate-950/30" />
        
        {/* Animated Particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 backdrop-blur-sm mb-8"
        >
          <Trophy className="w-5 h-5 text-amber-400" />
          <span className="text-amber-300 font-semibold">Ready for Local Deployment</span>
          <Crown className="w-5 h-5 text-amber-400" />
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Your Empire
            </span>
            <br />
            <span className="text-white">Awaits Deployment</span>
          </h2>
          
          <p className="text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Complete billion-dollar platform ready for local deployment. 
            <span className="text-blue-400 font-semibold"> Zero configuration needed</span> - 
            just add your API keys and watch your empire scale infinitely.
          </p>
        </motion.div>

        {/* Platform Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-6 mb-12"
        >
          {platformFeatures.map((feature, index) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              onMouseEnter={() => setHoveredFeature(feature.label)}
              onMouseLeave={() => setHoveredFeature(null)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all cursor-pointer group"
            >
              <feature.icon className={`w-5 h-5 ${feature.color} group-hover:scale-110 transition-transform`} />
              <span className="text-white font-medium">{feature.label}</span>
              {hoveredFeature === feature.label && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2 h-2 rounded-full bg-green-400"
                />
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
        >
          <ActionButton
            variant="primary"
            icon={Rocket}
            onClick={() => onNavigate?.('/empire')}
          >
            Launch Empire Dashboard
          </ActionButton>
          
          <ActionButton
            variant="secondary"
            icon={Download}
            onClick={() => window.open('/api/export/complete-package', '_blank')}
          >
            Download Complete Package
          </ActionButton>
          
          <ActionButton
            variant="outline"
            icon={Code2}
            onClick={() => onNavigate?.('/admin')}
          >
            Explore Admin Panel
          </ActionButton>
        </motion.div>

        {/* Achievement Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12"
        >
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
            >
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
              <span className="text-gray-300 font-medium">{achievement}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Final Stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="p-8 rounded-2xl bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">100%</div>
              <div className="text-gray-400 text-sm">Export Ready</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">0</div>
              <div className="text-gray-400 text-sm">Configuration Needed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">∞</div>
              <div className="text-gray-400 text-sm">Scale Potential</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-400 mb-2">$1B+</div>
              <div className="text-gray-400 text-sm">Enterprise Value</div>
            </div>
          </div>
        </motion.div>

        {/* Deployment Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-400">
            Complete with Docker setup, environment templates, API documentation, and automated deployment scripts.
            <br />
            <span className="text-blue-400 font-semibold">Your billion-dollar empire is ready to conquer the digital world.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}