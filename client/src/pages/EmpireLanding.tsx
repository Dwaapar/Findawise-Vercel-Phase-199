import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  Crown, Shield, Zap, TrendingUp, Globe, Brain, Target, Rocket, Star, 
  ChevronRight, Play, BarChart3, Users, DollarSign, Lock, Code, 
  Database, Cloud, Cpu, Network, Settings, Monitor, Award, CheckCircle,
  ArrowRight, Lightbulb, FileText, MessageSquare, Mail, Phone
} from "lucide-react";
import { EnhancedCard } from "@/components/ui/enhanced-card";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import EmpireHeader from "@/components/enterprise/EmpireHeader";

interface EmpireLandingProps {
  onNavigate: (path: string) => void;
}

export default function EmpireLanding({ onNavigate }: EmpireLandingProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.3]);

  const empireCapabilities = [
    {
      icon: Crown,
      title: "Enterprise Command Center",
      description: "Centralized control over all business operations, analytics, and strategic initiatives with real-time monitoring and decision support.",
      gradient: "from-yellow-400 to-yellow-600",
      features: ["Real-time Operations Dashboard", "Strategic Planning Tools", "Resource Management", "Performance Analytics"]
    },
    {
      icon: Brain,
      title: "AI-Powered Intelligence",
      description: "Advanced artificial intelligence systems that provide automated decision-making, predictive analytics, and intelligent process optimization.",
      gradient: "from-purple-400 to-purple-600",
      features: ["Machine Learning Models", "Predictive Analytics", "Automated Decision Making", "Intelligent Recommendations"]
    },
    {
      icon: Shield,
      title: "Enterprise Security Framework",
      description: "Comprehensive security infrastructure with advanced threat detection, compliance management, and data protection protocols.",
      gradient: "from-blue-400 to-blue-600",
      features: ["Multi-layer Security", "Compliance Management", "Threat Detection", "Data Encryption"]
    },
    {
      icon: TrendingUp,
      title: "Growth Optimization Engine",
      description: "Sophisticated growth strategies powered by data analytics, market intelligence, and automated optimization systems.",
      gradient: "from-green-400 to-green-600",
      features: ["Growth Analytics", "Market Intelligence", "Conversion Optimization", "Performance Tracking"]
    }
  ];

  const platformModules = [
    {
      name: "AI & Machine Learning",
      icon: Brain,
      description: "Advanced AI capabilities for automation and intelligence",
      capabilities: ["Natural Language Processing", "Computer Vision", "Predictive Modeling", "Automated Workflows"]
    },
    {
      name: "Business Intelligence",
      icon: BarChart3,
      description: "Comprehensive analytics and reporting platform",
      capabilities: ["Real-time Dashboards", "Custom Reports", "Data Visualization", "Performance Metrics"]
    },
    {
      name: "Security & Compliance",
      icon: Shield,
      description: "Enterprise-grade security and compliance management",
      capabilities: ["Identity Management", "Access Control", "Audit Trails", "Compliance Monitoring"]
    },
    {
      name: "Integration Hub",
      icon: Network,
      description: "Seamless integration with existing systems and platforms",
      capabilities: ["API Management", "Data Synchronization", "Workflow Integration", "System Connectivity"]
    }
  ];

  const serviceVerticals = [
    {
      title: "Financial Services",
      icon: DollarSign,
      description: "Specialized solutions for financial institutions",
      solutions: ["Risk Management Systems", "Compliance Automation", "Fraud Detection", "Portfolio Management"]
    },
    {
      title: "Healthcare Solutions",
      icon: Shield,
      description: "HIPAA-compliant healthcare technology platforms",
      solutions: ["Patient Management", "Medical Records", "Telehealth Platforms", "Healthcare Analytics"]
    },
    {
      title: "Manufacturing Excellence",
      icon: Settings,
      description: "Industry 4.0 solutions for modern manufacturing",
      solutions: ["Supply Chain Management", "Quality Control", "Production Optimization", "IoT Integration"]
    },
    {
      title: "Retail & E-commerce",
      icon: Target,
      description: "Comprehensive retail and e-commerce solutions",
      solutions: ["Customer Experience", "Inventory Management", "Sales Analytics", "Digital Commerce"]
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <EmpireHeader onNavigate={onNavigate} currentPath="/" />

      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center"
        style={{ y, opacity }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
          
          {/* Floating Particles */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400/30 rounded-full"
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              }}
              animate={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-600/20 to-yellow-400/20 
                         border border-yellow-500/30 rounded-full px-6 py-3 backdrop-blur-sm"
            >
              <Crown className="w-6 h-6 text-yellow-400" />
              <span className="text-lg font-bold">Enterprise Digital Empire</span>
              <Star className="w-5 h-5 text-yellow-400" />
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold leading-tight">
                Build Your Digital
                <span className="block bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 
                               bg-clip-text text-transparent">
                  Empire
                </span>
              </h1>
              <p className="text-xl sm:text-2xl lg:text-3xl text-gray-300 leading-relaxed max-w-4xl mx-auto">
                The ultimate enterprise platform combining <span className="text-yellow-400 font-semibold">AI intelligence</span>, 
                <span className="text-blue-400 font-semibold"> advanced analytics</span>, and 
                <span className="text-green-400 font-semibold"> comprehensive business solutions</span> to create 
                your digital transformation success story.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <EnhancedButton
                variant="gradient"
                size="xl"
                onClick={() => onNavigate('/empire-dashboard')}
                glow
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
              >
                <span className="flex items-center">
                  <Crown className="mr-3 w-6 h-6" />
                  Launch Empire Dashboard
                  <ArrowRight className="ml-3 w-6 h-6" />
                </span>
              </EnhancedButton>
              
              <EnhancedButton
                variant="outline"
                size="xl"
                className="border-2 border-white/30 text-white hover:bg-white/10"
              >
                <span className="flex items-center">
                  <Play className="mr-3 w-6 h-6" />
                  Watch Platform Demo
                </span>
              </EnhancedButton>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16"
            >
              {[
                { label: "Enterprise Grade", icon: Award },
                { label: "24/7 Support", icon: Shield },
                { label: "Global Scale", icon: Globe },
                { label: "AI Powered", icon: Brain }
              ].map((item, index) => (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-gray-800 to-gray-700 
                                  rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <item.icon className="w-8 h-8 text-yellow-400" />
                  </div>
                  <div className="text-sm font-medium text-gray-300">{item.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Empire Capabilities Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-4xl font-bold text-white">Empire Capabilities</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Comprehensive enterprise solutions designed to empower your organization with cutting-edge technology
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {empireCapabilities.map((capability, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <EnhancedCard variant="glass-dark" hover className="h-full p-8 group">
                  <div className="space-y-6">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${capability.gradient} p-3 group-hover:scale-110 transition-transform duration-300`}>
                      <capability.icon className="w-full h-full text-white" />
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-semibold text-white mb-3">{capability.title}</h3>
                      <p className="text-gray-400 mb-4">{capability.description}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-white mb-2">Core Features:</h4>
                      <ul className="space-y-2">
                        {capability.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-300">
                            <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <button className="flex items-center text-yellow-400 hover:text-yellow-300 font-medium group-hover:translate-x-1 transition-transform">
                      Explore capabilities <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </EnhancedCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Modules Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-4xl font-bold text-white">Platform Modules</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Modular architecture that adapts to your specific business requirements
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {platformModules.map((module, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <EnhancedCard variant="glass-dark" hover className="h-full p-6 group">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-yellow-600 to-yellow-500 p-2.5 group-hover:scale-110 transition-transform duration-300">
                      <module.icon className="w-full h-full text-white" />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white">{module.name}</h3>
                    <p className="text-gray-400 text-sm">{module.description}</p>
                    
                    <ul className="space-y-1">
                      {module.capabilities.map((capability, idx) => (
                        <li key={idx} className="flex items-center text-xs text-gray-300">
                          <Lightbulb className="w-3 h-3 text-yellow-400 mr-2 flex-shrink-0" />
                          {capability}
                        </li>
                      ))}
                    </ul>
                  </div>
                </EnhancedCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Verticals Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-4xl font-bold text-white">Industry Solutions</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Specialized solutions tailored for specific industry requirements and regulations
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {serviceVerticals.map((vertical, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <EnhancedCard variant="glass-dark" hover className="h-full p-6 group">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 p-2.5">
                        <vertical.icon className="w-full h-full text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">{vertical.title}</h3>
                    </div>
                    
                    <p className="text-gray-400">{vertical.description}</p>
                    
                    <div>
                      <h4 className="font-semibold text-white mb-2">Specialized Solutions:</h4>
                      <ul className="space-y-1">
                        {vertical.solutions.map((solution, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-300">
                            <CheckCircle className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                            {solution}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </EnhancedCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 text-black">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold">Ready to Build Your Digital Empire?</h2>
            <p className="text-xl max-w-2xl mx-auto opacity-90">
              Transform your organization with enterprise-grade digital solutions. 
              Start your journey to digital excellence today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <EnhancedButton 
                variant="enterprise"
                size="lg"
                onClick={() => onNavigate('/empire-dashboard')}
                className="px-8 py-4 bg-black text-white hover:bg-gray-900"
              >
                <span className="flex items-center">
                  <Crown className="mr-2 w-5 h-5" />
                  Access Empire Platform
                </span>
              </EnhancedButton>
              
              <EnhancedButton 
                variant="outline" 
                size="lg"
                className="px-8 py-4 border-black/30 text-black hover:bg-black/10"
              >
                <span className="flex items-center">
                  <MessageSquare className="mr-2 w-5 h-5" />
                  Schedule Consultation
                </span>
              </EnhancedButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-black border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <Crown className="w-8 h-8 text-yellow-400" />
                <h3 className="text-xl font-bold text-white">Findawise Empire</h3>
              </div>
              <p className="text-gray-400 max-w-md mb-4">
                Build your digital empire with comprehensive enterprise solutions that drive innovation, 
                efficiency, and sustainable growth.
              </p>
              <div className="text-sm text-gray-500">
                Empowering digital transformation across industries worldwide
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">AI Intelligence</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Business Analytics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security Framework</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integration Hub</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Empire</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Findawise Empire. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  );
}