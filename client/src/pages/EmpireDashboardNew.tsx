import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { 
  Crown,
  TrendingUp,
  Users,
  DollarSign,
  Shield,
  Zap,
  Globe,
  Brain,
  Target,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  RefreshCw,
  Settings,
  Bell,
  Activity,
  PieChart,
  LineChart,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  Heart,
  Plane,
  Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EmpireHeader from "@/components/enterprise/EmpireHeader";

interface EmpireDashboardProps {
  onNavigate: (path: string) => void;
}

export default function EmpireDashboard({ onNavigate }: EmpireDashboardProps) {
  const [timeRange, setTimeRange] = useState("24h");
  const [isRealTimeMode, setIsRealTimeMode] = useState(true);

  // Fetch dashboard data
  const { data: dashboardData, isLoading, refetch } = useQuery({
    queryKey: ["/api/analytics/overview"],
    enabled: true,
    refetchInterval: isRealTimeMode ? 30000 : false
  });

  const { data: revenueData } = useQuery({
    queryKey: ["/api/analytics/revenue", timeRange],
    enabled: true
  });

  const { data: systemHealth } = useQuery({
    queryKey: ["/api/admin/system/health"],
    enabled: true,
    refetchInterval: 60000
  });

  // Mock data for demo
  const mockData = {
    totalRevenue: 2847329,
    monthlyGrowth: 34.7,
    activeUsers: 89432,
    conversionRate: 12.4,
    systemUptime: 99.99,
    threatsPrevented: 1247,
    aiOptimizations: 156,
    globalReach: 47
  };

  const revenueStreams = [
    { name: "Affiliate Networks", value: 847329, percentage: 29.8, change: +12.4, color: "text-blue-400" },
    { name: "Digital Products", value: 623847, percentage: 21.9, change: +8.7, color: "text-green-400" },
    { name: "SaaS Solutions", value: 456892, percentage: 16.0, change: +15.3, color: "text-purple-400" },
    { name: "AI Services", value: 334567, percentage: 11.7, change: +23.8, color: "text-yellow-400" },
    { name: "Consulting", value: 289234, percentage: 10.2, change: +6.2, color: "text-pink-400" },
    { name: "Other", value: 295460, percentage: 10.4, change: -2.1, color: "text-gray-400" }
  ];

  const systemMetrics = [
    { 
      label: "API Response Time", 
      value: "127ms", 
      status: "excellent", 
      icon: Activity,
      trend: -5.2 
    },
    { 
      label: "Database Performance", 
      value: "99.8%", 
      status: "good", 
      icon: BarChart3,
      trend: +2.1 
    },
    { 
      label: "Security Score", 
      value: "A+", 
      status: "excellent", 
      icon: Shield,
      trend: +0.3 
    },
    { 
      label: "AI Processing", 
      value: "94.2%", 
      status: "good", 
      icon: Brain,
      trend: +7.8 
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "text-green-400 bg-green-400/10";
      case "good": return "text-blue-400 bg-blue-400/10";
      case "warning": return "text-yellow-400 bg-yellow-400/10";
      case "critical": return "text-red-400 bg-red-400/10";
      default: return "text-gray-400 bg-gray-400/10";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <EmpireHeader onNavigate={onNavigate} currentPath="/empire" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <Crown className="h-8 w-8 text-yellow-400 inline mr-3" />
              Empire Command Center
            </h1>
            <p className="text-gray-400">
              Real-time overview of your digital empire operations
            </p>
          </motion.div>

          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32 bg-white/5 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/10">
                <SelectItem value="1h">1 Hour</SelectItem>
                <SelectItem value="24h">24 Hours</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="border-white/10 hover:bg-white/5"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRealTimeMode(!isRealTimeMode)}
              className={`border-white/10 hover:bg-white/5 ${
                isRealTimeMode ? 'bg-green-500/20 text-green-400' : ''
              }`}
            >
              <Activity className="h-4 w-4 mr-2" />
              {isRealTimeMode ? 'Live' : 'Paused'}
            </Button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:border-green-400/30 transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400 mb-1">
                  ${mockData.totalRevenue.toLocaleString()}
                </div>
                <div className="flex items-center text-sm">
                  <ArrowUpRight className="h-4 w-4 text-green-400 mr-1" />
                  <span className="text-green-400">+{mockData.monthlyGrowth}%</span>
                  <span className="text-gray-400 ml-2">vs last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:border-blue-400/30 transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Active Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {mockData.activeUsers.toLocaleString()}
                </div>
                <div className="flex items-center text-sm">
                  <ArrowUpRight className="h-4 w-4 text-blue-400 mr-1" />
                  <span className="text-blue-400">+18.2%</span>
                  <span className="text-gray-400 ml-2">vs last week</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:border-purple-400/30 transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  Conversion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-400 mb-1">
                  {mockData.conversionRate}%
                </div>
                <div className="flex items-center text-sm">
                  <ArrowUpRight className="h-4 w-4 text-purple-400 mr-1" />
                  <span className="text-purple-400">+2.4%</span>
                  <span className="text-gray-400 ml-2">vs baseline</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:border-yellow-400/30 transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  System Uptime
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-400 mb-1">
                  {mockData.systemUptime}%
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-400 mr-1" />
                  <span className="text-green-400">Operational</span>
                  <span className="text-gray-400 ml-2">47 days</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Dashboard Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/10">
              Overview
            </TabsTrigger>
            <TabsTrigger value="revenue" className="data-[state=active]:bg-white/10">
              Revenue
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-white/10">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-white/10">
              System
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* COMPLETE EMPIRE FEATURE ACCESS - ALL PAGES INCLUDED */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Crown className="h-7 w-7 mr-3 text-yellow-400" />
                Complete Empire Access - ALL Features & Functions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {/* CORE NEURON VERTICALS */}
                <Card className="bg-gradient-to-br from-emerald-950/60 to-green-950/40 border-emerald-700/30 hover:border-emerald-500/50 transition-colors">
                  <CardContent className="p-4">
                    <DollarSign className="h-8 w-8 text-emerald-400 mb-2" />
                    <h3 className="font-bold text-white text-sm mb-2">💰 Finance Empire</h3>
                    <div className="space-y-1">
                      <Button onClick={() => onNavigate("/finance")} variant="ghost" size="sm" className="w-full justify-start text-emerald-200 hover:bg-emerald-500/20 text-xs h-7">Finance Hub</Button>
                      <Button onClick={() => onNavigate("/finance/quiz")} variant="ghost" size="sm" className="w-full justify-start text-emerald-200 hover:bg-emerald-500/20 text-xs h-7">Finance Quiz</Button>
                      <Button onClick={() => onNavigate("/finance/calculator")} variant="ghost" size="sm" className="w-full justify-start text-emerald-200 hover:bg-emerald-500/20 text-xs h-7">Calculators</Button>
                      <Button onClick={() => onNavigate("/investment-calculator")} variant="ghost" size="sm" className="w-full justify-start text-emerald-200 hover:bg-emerald-500/20 text-xs h-7">Investment Calc</Button>
                      <Button onClick={() => onNavigate("/budgeting-bootcamp")} variant="ghost" size="sm" className="w-full justify-start text-emerald-200 hover:bg-emerald-500/20 text-xs h-7">Budget Bootcamp</Button>
                      <Button onClick={() => onNavigate("/retirement-readiness-quiz")} variant="ghost" size="sm" className="w-full justify-start text-emerald-200 hover:bg-emerald-500/20 text-xs h-7">Retirement Quiz</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-pink-950/60 to-rose-950/40 border-pink-700/30 hover:border-pink-500/50 transition-colors">
                  <CardContent className="p-4">
                    <Heart className="h-8 w-8 text-pink-400 mb-2" />
                    <h3 className="font-bold text-white text-sm mb-2">🌸 Health & Wellness</h3>
                    <div className="space-y-1">
                      <Button onClick={() => onNavigate("/health")} variant="ghost" size="sm" className="w-full justify-start text-pink-200 hover:bg-pink-500/20 text-xs h-7">Wellness Hub</Button>
                      <Button onClick={() => onNavigate("/fitness-transformation-quiz")} variant="ghost" size="sm" className="w-full justify-start text-pink-200 hover:bg-pink-500/20 text-xs h-7">Fitness Quiz</Button>
                      <Button onClick={() => onNavigate("/meditation-timer")} variant="ghost" size="sm" className="w-full justify-start text-pink-200 hover:bg-pink-500/20 text-xs h-7">Meditation Timer</Button>
                      <Button onClick={() => onNavigate("/anxiety-relief-toolkit")} variant="ghost" size="sm" className="w-full justify-start text-pink-200 hover:bg-pink-500/20 text-xs h-7">Anxiety Relief</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-950/60 to-indigo-950/40 border-blue-700/30 hover:border-blue-500/50 transition-colors">
                  <CardContent className="p-4">
                    <Shield className="h-8 w-8 text-blue-400 mb-2" />
                    <h3 className="font-bold text-white text-sm mb-2">🛡️ Security Empire</h3>
                    <div className="space-y-1">
                      <Button onClick={() => onNavigate("/security")} variant="ghost" size="sm" className="w-full justify-start text-blue-200 hover:bg-blue-500/20 text-xs h-7">Security Hub</Button>
                      <Button onClick={() => onNavigate("/security-dashboard")} variant="ghost" size="sm" className="w-full justify-start text-blue-200 hover:bg-blue-500/20 text-xs h-7">Security Dashboard</Button>
                      <Button onClick={() => onNavigate("/security-tools")} variant="ghost" size="sm" className="w-full justify-start text-blue-200 hover:bg-blue-500/20 text-xs h-7">Security Tools</Button>
                      <Button onClick={() => onNavigate("/home-security-assessment")} variant="ghost" size="sm" className="w-full justify-start text-blue-200 hover:bg-blue-500/20 text-xs h-7">Security Assessment</Button>
                      <Button onClick={() => onNavigate("/smart-home-optimizer")} variant="ghost" size="sm" className="w-full justify-start text-blue-200 hover:bg-blue-500/20 text-xs h-7">Smart Home</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-cyan-950/60 to-blue-950/40 border-cyan-700/30 hover:border-cyan-500/50 transition-colors">
                  <CardContent className="p-4">
                    <Plane className="h-8 w-8 text-cyan-400 mb-2" />
                    <h3 className="font-bold text-white text-sm mb-2">✈️ Travel Intelligence</h3>
                    <div className="space-y-1">
                      <Button onClick={() => onNavigate("/travel")} variant="ghost" size="sm" className="w-full justify-start text-cyan-200 hover:bg-cyan-500/20 text-xs h-7">Travel Hub</Button>
                      <Button onClick={() => onNavigate("/travel-planning-assistant")} variant="ghost" size="sm" className="w-full justify-start text-cyan-200 hover:bg-cyan-500/20 text-xs h-7">Trip Planner</Button>
                      <Button onClick={() => onNavigate("/destinations")} variant="ghost" size="sm" className="w-full justify-start text-cyan-200 hover:bg-cyan-500/20 text-xs h-7">Destinations</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-950/60 to-indigo-950/40 border-purple-700/30 hover:border-purple-500/50 transition-colors">
                  <CardContent className="p-4">
                    <Brain className="h-8 w-8 text-purple-400 mb-2" />
                    <h3 className="font-bold text-white text-sm mb-2">🧠 AI Intelligence</h3>
                    <div className="space-y-1">
                      <Button onClick={() => onNavigate("/ai-tools")} variant="ghost" size="sm" className="w-full justify-start text-purple-200 hover:bg-purple-500/20 text-xs h-7">AI Tools Directory</Button>
                      <Button onClick={() => onNavigate("/artificial-intelligence")} variant="ghost" size="sm" className="w-full justify-start text-purple-200 hover:bg-purple-500/20 text-xs h-7">AI Hub</Button>
                      <Button onClick={() => onNavigate("/machine-learning")} variant="ghost" size="sm" className="w-full justify-start text-purple-200 hover:bg-purple-500/20 text-xs h-7">ML Tools</Button>
                      <Button onClick={() => onNavigate("/automation")} variant="ghost" size="sm" className="w-full justify-start text-purple-200 hover:bg-purple-500/20 text-xs h-7">Automation</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-950/60 to-yellow-950/40 border-orange-700/30 hover:border-orange-500/50 transition-colors">
                  <CardContent className="p-4">
                    <Settings className="h-8 w-8 text-orange-400 mb-2" />
                    <h3 className="font-bold text-white text-sm mb-2">⚙️ SaaS Intelligence</h3>
                    <div className="space-y-1">
                      <Button onClick={() => onNavigate("/saas")} variant="ghost" size="sm" className="w-full justify-start text-orange-200 hover:bg-orange-500/20 text-xs h-7">SaaS Directory</Button>
                      <Button onClick={() => onNavigate("/software")} variant="ghost" size="sm" className="w-full justify-start text-orange-200 hover:bg-orange-500/20 text-xs h-7">Software Hub</Button>
                      <Button onClick={() => onNavigate("/productivity")} variant="ghost" size="sm" className="w-full justify-start text-orange-200 hover:bg-orange-500/20 text-xs h-7">Productivity</Button>
                      <Button onClick={() => onNavigate("/tools-directory")} variant="ghost" size="sm" className="w-full justify-start text-orange-200 hover:bg-orange-500/20 text-xs h-7">Tools Directory</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* REVENUE & MONETIZATION */}
                <Card className="bg-gradient-to-br from-yellow-950/60 to-amber-950/40 border-yellow-700/30 hover:border-yellow-500/50 transition-colors">
                  <CardContent className="p-4">
                    <Target className="h-8 w-8 text-yellow-400 mb-2" />
                    <h3 className="font-bold text-white text-sm mb-2">🎯 Revenue Systems</h3>
                    <div className="space-y-1">
                      <Button onClick={() => onNavigate("/offers")} variant="ghost" size="sm" className="w-full justify-start text-yellow-200 hover:bg-yellow-500/20 text-xs h-7">Offer Engine</Button>
                      <Button onClick={() => onNavigate("/admin/offer-engine")} variant="ghost" size="sm" className="w-full justify-start text-yellow-200 hover:bg-yellow-500/20 text-xs h-7">Offer Admin</Button>
                      <Button onClick={() => onNavigate("/admin/offer-feed")} variant="ghost" size="sm" className="w-full justify-start text-yellow-200 hover:bg-yellow-500/20 text-xs h-7">Offer Feed</Button>
                      <Button onClick={() => onNavigate("/admin/revenue-split")} variant="ghost" size="sm" className="w-full justify-start text-yellow-200 hover:bg-yellow-500/20 text-xs h-7">Revenue Split</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* ADMIN & MANAGEMENT */}
                <Card className="bg-gradient-to-br from-red-950/60 to-pink-950/40 border-red-700/30 hover:border-red-500/50 transition-colors">
                  <CardContent className="p-4">
                    <Crown className="h-8 w-8 text-red-400 mb-2" />
                    <h3 className="font-bold text-white text-sm mb-2">👑 Empire Admin</h3>
                    <div className="space-y-1">
                      <Button onClick={() => onNavigate("/admin")} variant="ghost" size="sm" className="w-full justify-start text-red-200 hover:bg-red-500/20 text-xs h-7">Admin Dashboard</Button>
                      <Button onClick={() => onNavigate("/admin/ai")} variant="ghost" size="sm" className="w-full justify-start text-red-200 hover:bg-red-500/20 text-xs h-7">AI Admin</Button>
                      <Button onClick={() => onNavigate("/admin/neural-profile")} variant="ghost" size="sm" className="w-full justify-start text-red-200 hover:bg-red-500/20 text-xs h-7">Neural Profiles</Button>
                      <Button onClick={() => onNavigate("/admin/compliance")} variant="ghost" size="sm" className="w-full justify-start text-red-200 hover:bg-red-500/20 text-xs h-7">Compliance</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* ANALYTICS & INTELLIGENCE */}
                <Card className="bg-gradient-to-br from-violet-950/60 to-purple-950/40 border-violet-700/30 hover:border-violet-500/50 transition-colors">
                  <CardContent className="p-4">
                    <BarChart3 className="h-8 w-8 text-violet-400 mb-2" />
                    <h3 className="font-bold text-white text-sm mb-2">📊 Analytics Hub</h3>
                    <div className="space-y-1">
                      <Button onClick={() => onNavigate("/admin/experiments")} variant="ghost" size="sm" className="w-full justify-start text-violet-200 hover:bg-violet-500/20 text-xs h-7">A/B Experiments</Button>
                      <Button onClick={() => onNavigate("/admin/cross-device")} variant="ghost" size="sm" className="w-full justify-start text-violet-200 hover:bg-violet-500/20 text-xs h-7">Cross-Device</Button>
                      <Button onClick={() => onNavigate("/admin/sessions")} variant="ghost" size="sm" className="w-full justify-start text-violet-200 hover:bg-violet-500/20 text-xs h-7">Sessions</Button>
                      <Button onClick={() => onNavigate("/admin/leads")} variant="ghost" size="sm" className="w-full justify-start text-violet-200 hover:bg-violet-500/20 text-xs h-7">Leads Dashboard</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* AI SYSTEMS */}
                <Card className="bg-gradient-to-br from-teal-950/60 to-cyan-950/40 border-teal-700/30 hover:border-teal-500/50 transition-colors">
                  <CardContent className="p-4">
                    <Cpu className="h-8 w-8 text-teal-400 mb-2" />
                    <h3 className="font-bold text-white text-sm mb-2">🤖 Advanced AI</h3>
                    <div className="space-y-1">
                      <Button onClick={() => onNavigate("/admin/ai-native-os")} variant="ghost" size="sm" className="w-full justify-start text-teal-200 hover:bg-teal-500/20 text-xs h-7">AI Native OS</Button>
                      <Button onClick={() => onNavigate("/admin/rlhf-brain")} variant="ghost" size="sm" className="w-full justify-start text-teal-200 hover:bg-teal-500/20 text-xs h-7">RLHF Brain</Button>
                      <Button onClick={() => onNavigate("/admin/vector-search")} variant="ghost" size="sm" className="w-full justify-start text-teal-200 hover:bg-teal-500/20 text-xs h-7">Vector Search</Button>
                      <Button onClick={() => onNavigate("/admin/funnel")} variant="ghost" size="sm" className="w-full justify-start text-teal-200 hover:bg-teal-500/20 text-xs h-7">Smart Funnels</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* COMMUNICATION */}
                <Card className="bg-gradient-to-br from-indigo-950/60 to-blue-950/40 border-indigo-700/30 hover:border-indigo-500/50 transition-colors">
                  <CardContent className="p-4">
                    <Bell className="h-8 w-8 text-indigo-400 mb-2" />
                    <h3 className="font-bold text-white text-sm mb-2">🔔 Communication</h3>
                    <div className="space-y-1">
                      <Button onClick={() => onNavigate("/admin/notifications")} variant="ghost" size="sm" className="w-full justify-start text-indigo-200 hover:bg-indigo-500/20 text-xs h-7">Notifications</Button>
                      <Button onClick={() => onNavigate("/admin/interactive-modules")} variant="ghost" size="sm" className="w-full justify-start text-indigo-200 hover:bg-indigo-500/20 text-xs h-7">Interactive Modules</Button>
                      <Button onClick={() => onNavigate("/privacy")} variant="ghost" size="sm" className="w-full justify-start text-indigo-200 hover:bg-indigo-500/20 text-xs h-7">Privacy Settings</Button>
                      <Button onClick={() => onNavigate("/career-transition-guide")} variant="ghost" size="sm" className="w-full justify-start text-indigo-200 hover:bg-indigo-500/20 text-xs h-7">Career Guide</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Streams */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card className="bg-white/5 backdrop-blur-xl border-white/10 h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <PieChart className="h-5 w-5 mr-2 text-green-400" />
                      Revenue Streams
                    </CardTitle>
                    <CardDescription>
                      Breakdown by source over the last 30 days
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {revenueStreams.map((stream, index) => (
                        <motion.div
                          key={stream.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.1 * index }}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full bg-current ${stream.color}`} />
                            <div>
                              <div className="text-sm font-medium text-white">
                                {stream.name}
                              </div>
                              <div className="text-xs text-gray-400">
                                ${stream.value.toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-white">
                              {stream.percentage}%
                            </div>
                            <div className={`text-xs flex items-center ${
                              stream.change > 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {stream.change > 0 ? (
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                              ) : (
                                <ArrowDownRight className="h-3 w-3 mr-1" />
                              )}
                              {Math.abs(stream.change)}%
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* System Health */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Card className="bg-white/5 backdrop-blur-xl border-white/10 h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-blue-400" />
                      System Health
                    </CardTitle>
                    <CardDescription>
                      Real-time performance metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {systemMetrics.map((metric, index) => (
                        <motion.div
                          key={metric.label}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.1 * index }}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${getStatusColor(metric.status)}`}>
                              <metric.icon className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white">
                                {metric.label}
                              </div>
                              <div className="text-xs text-gray-400">
                                Last updated: 2m ago
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-white">
                              {metric.value}
                            </div>
                            <div className={`text-xs flex items-center ${
                              metric.trend > 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {metric.trend > 0 ? (
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                              ) : (
                                <ArrowDownRight className="h-3 w-3 mr-1" />
                              )}
                              {Math.abs(metric.trend)}%
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Common empire management tasks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button
                      onClick={() => onNavigate("/revenue")}
                      className="h-20 flex flex-col items-center justify-center space-y-2 bg-white/5 hover:bg-white/10 border border-white/10"
                    >
                      <TrendingUp className="h-6 w-6 text-green-400" />
                      <span className="text-xs">Revenue</span>
                    </Button>
                    <Button
                      onClick={() => onNavigate("/security")}
                      className="h-20 flex flex-col items-center justify-center space-y-2 bg-white/5 hover:bg-white/10 border border-white/10"
                    >
                      <Shield className="h-6 w-6 text-blue-400" />
                      <span className="text-xs">Security</span>
                    </Button>
                    <Button
                      onClick={() => onNavigate("/ai-center")}
                      className="h-20 flex flex-col items-center justify-center space-y-2 bg-white/5 hover:bg-white/10 border border-white/10"
                    >
                      <Brain className="h-6 w-6 text-purple-400" />
                      <span className="text-xs">AI Center</span>
                    </Button>
                    <Button
                      onClick={() => onNavigate("/markets")}
                      className="h-20 flex flex-col items-center justify-center space-y-2 bg-white/5 hover:bg-white/10 border border-white/10"
                    >
                      <Globe className="h-6 w-6 text-yellow-400" />
                      <span className="text-xs">Markets</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Other tab contents would go here */}
          <TabsContent value="revenue">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardContent className="p-8 text-center">
                <TrendingUp className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Revenue Analytics</h3>
                <p className="text-gray-400">Detailed revenue analytics coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardContent className="p-8 text-center">
                <BarChart3 className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Advanced Analytics</h3>
                <p className="text-gray-400">Deep analytics dashboard coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardContent className="p-8 text-center">
                <Settings className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">System Management</h3>
                <p className="text-gray-400">System administration panel coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}