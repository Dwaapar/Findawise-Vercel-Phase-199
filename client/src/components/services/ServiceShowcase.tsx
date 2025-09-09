import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, Users, Cog, ArrowRight, Sparkles, Target,
  TrendingUp, Shield, Zap, Brain
} from 'lucide-react';

export function ServiceShowcase() {
  const services = [
    {
      id: 'agentic-ai',
      title: 'Agentic AI & Automation',
      subtitle: 'Complete Workflow Automation',
      description: 'We automate your entire business with intelligent AI agents that work 24/7.',
      icon: Bot,
      color: 'from-purple-600 to-pink-600',
      bgColor: 'from-purple-600/10 to-pink-600/10',
      borderColor: 'border-purple-500/30',
      features: [
        'Custom AI agent workflows',
        'Data analysis on your behalf', 
        'Complete process automation',
        '24/7 intelligent monitoring'
      ],
      cta: 'Automate Now',
      path: '/services/agentic-ai'
    },
    {
      id: 'affiliate',
      title: 'Affiliate Services',
      subtitle: 'Brand Partnerships & Revenue',
      description: 'Premium affiliate services and brand partnerships that generate consistent revenue.',
      icon: Users,
      color: 'from-green-600 to-emerald-600',
      bgColor: 'from-green-600/10 to-emerald-600/10',
      borderColor: 'border-green-500/30',
      features: [
        'Brand partnership brokerage',
        'Affiliate program management',
        'Revenue optimization',
        'Partnership analytics'
      ],
      cta: 'Join Network',
      path: '/services/affiliate'
    },
    {
      id: 'neuron-services',
      title: 'Neuron Services',
      subtitle: 'Specialized Business Tools',
      description: 'Comprehensive suite of specialized services for every business vertical and need.',
      icon: Cog,
      color: 'from-blue-600 to-cyan-600',
      bgColor: 'from-blue-600/10 to-cyan-600/10',
      borderColor: 'border-blue-500/30',
      features: [
        'Resume & document services',
        'Finance & calculation tools',
        'Health & wellness modules',
        'Custom business solutions'
      ],
      cta: 'Browse Services',
      path: '/services/neurons'
    }
  ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-6 mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 
                         border border-purple-500/30 rounded-full px-6 py-2 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium">Our Service Categories</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-bold text-white">
            Everything Your Business
            <span className="block bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Needs to Thrive
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            From complete automation to specialized tools, we provide digital assets 
            that transform your business operations and drive real results.
          </p>
        </motion.div>

        {/* Service Cards Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => {
            const Icon = service.icon;
            
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`group relative bg-gradient-to-br ${service.bgColor} 
                           border ${service.borderColor} rounded-2xl p-8 backdrop-blur-sm
                           hover:scale-105 transition-all duration-300 cursor-pointer
                           hover:shadow-2xl hover:shadow-purple-500/10`}
              >
                {/* Service Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${service.color} 
                               flex items-center justify-center mb-6 group-hover:scale-110 
                               transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Service Content */}
                <div className="space-y-4 mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {service.title}
                    </h3>
                    <p className="text-sm text-purple-300 font-medium">
                      {service.subtitle}
                    </p>
                  </div>
                  
                  <p className="text-gray-300 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.color}`} />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button className={`w-full bg-gradient-to-r ${service.color} text-white 
                                  py-3 px-6 rounded-xl font-semibold
                                  hover:shadow-lg transition-all duration-300
                                  flex items-center justify-center space-x-2
                                  group-hover:shadow-lg`}>
                  <span>{service.cta}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Hover Effects */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/5 to-pink-600/5 
                               opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-purple-600/10 to-pink-600/10 
                     border border-purple-500/30 rounded-2xl p-12 backdrop-blur-sm"
        >
          <div className="space-y-6">
            <div className="flex justify-center space-x-4 text-4xl">
              <Brain className="text-purple-400" />
              <Zap className="text-yellow-400" />
              <Target className="text-green-400" />
            </div>
            
            <h3 className="text-3xl font-bold text-white">
              Ready to Transform Your Business?
            </h3>
            
            <p className="text-gray-300 max-w-2xl mx-auto">
              Join thousands of businesses that have automated their operations and 
              scaled their revenue with our digital asset services.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white 
                               px-8 py-4 rounded-xl font-semibold text-lg
                               hover:from-purple-700 hover:to-pink-700 transition-all duration-300
                               shadow-lg hover:shadow-purple-500/25">
                Get Started Today
              </button>
              
              <button className="border-2 border-white/20 text-white px-8 py-4 rounded-xl 
                               font-semibold text-lg hover:bg-white/10 hover:border-white/30 
                               transition-all duration-300">
                Schedule Consultation
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}