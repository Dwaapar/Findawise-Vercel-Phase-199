import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, TrendingUp, Activity, Eye, Database, Zap,
  Users, Target, PieChart, LineChart, Brain, Globe
} from "lucide-react";

interface AnalyticsIntelligenceHubProps {
  onNavigate: (path: string) => void;
}

const AnalyticsIntelligenceHub = ({ onNavigate }: AnalyticsIntelligenceHubProps) => {
  const [analyticsMetrics, setAnalyticsMetrics] = useState({
    realTimeEvents: 98432,
    dailyActiveUsers: 47683,
    conversionRate: 4.2,
    sessionDuration: 8.7,
    bounceRate: 23.1,
    revenuePerVisitor: 12.45,
    pageViews: 284750,
    uniqueVisitors: 89340
  });

  const analyticsModules = [
    {
      name: "Real-time Analytics",
      description: "Live user behavior and engagement tracking",
      events: "98.4K/day",
      status: "active",
      path: "/admin/cross-device",
      icon: Activity,
      color: "green"
    },
    {
      name: "Cross-Device Analytics",
      description: "Multi-device user journey analysis",
      events: "47.6K users",
      status: "active", 
      path: "/admin/cross-device",
      icon: Globe,
      color: "blue"
    },
    {
      name: "Neural Profiling",
      description: "AI-powered user behavior prediction",
      events: "89.3K profiles",
      status: "active",
      path: "/admin/neural-profile",
      icon: Brain,
      color: "purple"
    },
    {
      name: "Session Intelligence",
      description: "Deep session analysis and optimization",
      events: "8.7min avg",
      status: "active",
      path: "/admin/sessions",
      icon: Users,
      color: "cyan"
    },
    {
      name: "Conversion Analytics",
      description: "Funnel analysis and conversion optimization",
      events: "4.2% rate",
      status: "optimal",
      path: "/admin/funnel",
      icon: Target,
      color: "yellow"
    },
    {
      name: "Performance Monitoring",
      description: "System performance and uptime tracking",
      events: "99.9% uptime",
      status: "optimal",
      path: "/analytics-intelligence",
      icon: Zap,
      color: "indigo"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": case "optimal": return "bg-green-500";
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
              <div className="p-2 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Analytics Intelligence Hub
                </h1>
                <p className="text-gray-400">Real-time analytics, performance monitoring, and business intelligence</p>
              </div>
            </div>
            <Button 
              onClick={() => onNavigate("/enterprise-command")}
              variant="outline"
              className="border-gray-600 hover:bg-gray-800"
            >
              ← Command Center
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="overview">Analytics Overview</TabsTrigger>
            <TabsTrigger value="realtime">Real-time Data</TabsTrigger>
            <TabsTrigger value="intelligence">AI Intelligence</TabsTrigger>
            <TabsTrigger value="reporting">Advanced Reporting</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Analytics Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              <Card className="bg-gray-800/50 border-gray-700 lg:col-span-2">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Real-time Events</p>
                      <p className="text-2xl font-bold text-green-400">{(analyticsMetrics.realTimeEvents / 1000).toFixed(1)}K</p>
                    </div>
                    <Activity className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700 lg:col-span-2">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Daily Active Users</p>
                      <p className="text-2xl font-bold text-blue-400">{(analyticsMetrics.dailyActiveUsers / 1000).toFixed(1)}K</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Conversion</p>
                      <p className="text-2xl font-bold text-purple-400">{analyticsMetrics.conversionRate}%</p>
                    </div>
                    <Target className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Session Time</p>
                      <p className="text-2xl font-bold text-cyan-400">{analyticsMetrics.sessionDuration}m</p>
                    </div>
                    <Eye className="h-8 w-8 text-cyan-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Bounce Rate</p>
                      <p className="text-2xl font-bold text-yellow-400">{analyticsMetrics.bounceRate}%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">RPV</p>
                      <p className="text-2xl font-bold text-indigo-400">${analyticsMetrics.revenuePerVisitor}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-indigo-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Page Views</p>
                      <p className="text-2xl font-bold text-pink-400">{(analyticsMetrics.pageViews / 1000).toFixed(1)}K</p>
                    </div>
                    <PieChart className="h-8 w-8 text-pink-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Unique Visitors</p>
                      <p className="text-2xl font-bold text-orange-400">{(analyticsMetrics.uniqueVisitors / 1000).toFixed(1)}K</p>
                    </div>
                    <Globe className="h-8 w-8 text-orange-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Analytics Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analyticsModules.map((module, index) => (
                <Card 
                  key={index}
                  className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 cursor-pointer group"
                  onClick={() => onNavigate(module.path)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 bg-gradient-to-r from-${module.color}-500 to-${module.color}-600 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                        <module.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(module.status)}`} />
                        <Badge variant="outline" className="text-xs border-gray-600">
                          {module.status}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-lg text-white group-hover:text-yellow-400 transition-colors">
                      {module.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 mb-3 text-sm">{module.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-400">{module.events}</span>
                      <Button 
                        size="sm" 
                        className={`bg-gradient-to-r from-${module.color}-500 to-${module.color}-600 hover:opacity-90`}
                      >
                        Analyze →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="realtime" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Real-time Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Activity className="h-16 w-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Live User Activity</h3>
                  <p className="text-gray-400 mb-4">Monitor user behavior and engagement in real-time</p>
                  <Button 
                    onClick={() => onNavigate("/admin/cross-device")}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    View Real-time Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="intelligence" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">AI-Powered Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Brain className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Neural Profiling & Predictions</h3>
                  <p className="text-gray-400 mb-4">AI-powered user behavior analysis and prediction models</p>
                  <Button 
                    onClick={() => onNavigate("/admin/neural-profile")}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    Access AI Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reporting" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Advanced Reporting</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <LineChart className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Custom Analytics Reports</h3>
                  <p className="text-gray-400 mb-4">Generate detailed reports and export analytics data</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                    <Button 
                      onClick={() => onNavigate("/admin/cross-device")}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    >
                      Cross-Device Reports
                    </Button>
                    <Button 
                      onClick={() => onNavigate("/admin/sessions")}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      Session Reports
                    </Button>
                    <Button 
                      onClick={() => onNavigate("/admin/funnel")}
                      className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                    >
                      Funnel Analysis
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AnalyticsIntelligenceHub;