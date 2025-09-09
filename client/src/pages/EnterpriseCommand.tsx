import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, Brain, Shield, TrendingUp, Database, 
  Globe, Zap, Settings, Users, MessageSquare,
  BarChart3, DollarSign, Lock, Cpu, Network
} from "lucide-react";

interface CommandCenterProps {
  onNavigate: (path: string) => void;
}

const EnterpriseCommand = ({ onNavigate }: CommandCenterProps) => {
  const [systemHealth, setSystemHealth] = useState({
    ai: "optimal",
    federation: "optimal", 
    security: "optimal",
    revenue: "optimal",
    analytics: "optimal",
    content: "optimal"
  });

  const [realTimeMetrics, setRealTimeMetrics] = useState({
    activeNeurons: 47,
    dailyRevenue: 284750,
    securityThreats: 0,
    contentGenerated: 1847,
    analyticsEvents: 98432,
    federationNodes: 12
  });

  useEffect(() => {
    // Real-time metrics updates
    const interval = setInterval(() => {
      setRealTimeMetrics(prev => ({
        ...prev,
        analyticsEvents: prev.analyticsEvents + Math.floor(Math.random() * 100),
        contentGenerated: prev.contentGenerated + Math.floor(Math.random() * 5)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const commandCenters = [
    {
      title: "AI Intelligence Center",
      description: "Vector search, semantic graphs, LLM orchestration",
      icon: Brain,
      path: "/ai-intelligence",
      status: systemHealth.ai,
      metrics: "47 AI Models Active",
      gradient: "from-purple-500 to-indigo-600"
    },
    {
      title: "Federation Control",
      description: "Multi-region deployment, neuron federation",
      icon: Globe,
      path: "/federation-control", 
      status: systemHealth.federation,
      metrics: "12 Global Nodes",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      title: "Revenue Optimization",
      description: "Affiliate networks, offer engines, profit forecasting",
      icon: DollarSign,
      path: "/revenue-optimization",
      status: systemHealth.revenue,
      metrics: "$284.7K Daily Revenue",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      title: "Security Control",
      description: "Enterprise security, compliance, threat detection",
      icon: Shield,
      path: "/security-control",
      status: systemHealth.security,
      metrics: "Zero Active Threats",
      gradient: "from-red-500 to-orange-600"
    },
    {
      title: "Analytics Intelligence",
      description: "Real-time analytics, performance monitoring",
      icon: BarChart3,
      path: "/analytics-intelligence",
      status: systemHealth.analytics,
      metrics: "98.4K Events/Day",
      gradient: "from-yellow-500 to-amber-600"
    },
    {
      title: "Content Automation",
      description: "Content generation, marketing automation",
      icon: Zap,
      path: "/content-automation",
      status: systemHealth.content,
      metrics: "1.8K Content Pieces",
      gradient: "from-pink-500 to-rose-600"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal": return "bg-green-500";
      case "warning": return "bg-yellow-500";
      case "critical": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Enterprise Command Center
                </h1>
                <p className="text-gray-400">Centralized control for your billion-dollar empire</p>
              </div>
            </div>
            <Button 
              onClick={() => onNavigate("/empire")}
              variant="outline"
              className="border-gray-600 hover:bg-gray-800"
            >
              Back to Empire
            </Button>
          </div>
        </div>
      </div>

      {/* Real-time Metrics Dashboard */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Neurons</p>
                  <p className="text-2xl font-bold text-blue-400">{realTimeMetrics.activeNeurons}</p>
                </div>
                <Cpu className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Daily Revenue</p>
                  <p className="text-2xl font-bold text-green-400">${(realTimeMetrics.dailyRevenue / 1000).toFixed(1)}K</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Security Status</p>
                  <p className="text-2xl font-bold text-green-400">{realTimeMetrics.securityThreats}</p>
                </div>
                <Shield className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Content Generated</p>
                  <p className="text-2xl font-bold text-yellow-400">{realTimeMetrics.contentGenerated.toLocaleString()}</p>
                </div>
                <Zap className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Analytics Events</p>
                  <p className="text-2xl font-bold text-purple-400">{(realTimeMetrics.analyticsEvents / 1000).toFixed(1)}K</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Federation Nodes</p>
                  <p className="text-2xl font-bold text-cyan-400">{realTimeMetrics.federationNodes}</p>
                </div>
                <Network className="h-8 w-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Command Centers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {commandCenters.map((center, index) => (
            <Card 
              key={index}
              className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 cursor-pointer group"
              onClick={() => onNavigate(center.path)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-3 bg-gradient-to-r ${center.gradient} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    <center.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(center.status)}`} />
                    <Badge variant="outline" className="text-xs border-gray-600">
                      {center.status}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-xl text-white group-hover:text-blue-400 transition-colors">
                  {center.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">{center.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-400">{center.metrics}</span>
                  <Button 
                    size="sm" 
                    className={`bg-gradient-to-r ${center.gradient} hover:opacity-90`}
                  >
                    Manage →
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  onClick={() => onNavigate("/admin/empire-launchpad")}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <Activity className="mr-2 h-4 w-4" />
                  System Health
                </Button>
                <Button 
                  onClick={() => onNavigate("/admin/api-keys")}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  API Management
                </Button>
                <Button 
                  onClick={() => onNavigate("/admin/notifications")}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Notifications
                </Button>
                <Button 
                  onClick={() => onNavigate("/deployment-orchestration")}
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                >
                  <Database className="mr-2 h-4 w-4" />
                  Deployment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseCommand;