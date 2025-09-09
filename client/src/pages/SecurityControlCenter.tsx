import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, Lock, Eye, AlertTriangle, Key, Server,
  Users, Activity, Zap, CheckCircle, XCircle
} from "lucide-react";

interface SecurityControlCenterProps {
  onNavigate: (path: string) => void;
}

const SecurityControlCenter = ({ onNavigate }: SecurityControlCenterProps) => {
  const [securityMetrics, setSecurityMetrics] = useState({
    threatLevel: "low",
    activeSessions: 3847,
    blockedAttacks: 127,
    complianceScore: 98.7,
    securityEvents: 24569,
    activeMonitors: 45,
    vulnerabilities: 0,
    lastScan: "2 hours ago"
  });

  const securitySystems = [
    {
      name: "Enterprise Security Manager",
      status: "active",
      threats: 0,
      lastCheck: "1 min ago",
      path: "/admin/compliance",
      icon: Shield,
      color: "green"
    },
    {
      name: "API Key Management",
      status: "active", 
      threats: 0,
      lastCheck: "30 sec ago",
      path: "/admin/api-keys",
      icon: Key,
      color: "blue"
    },
    {
      name: "Session Security",
      status: "active",
      threats: 0,
      lastCheck: "45 sec ago", 
      path: "/admin/sessions",
      icon: Users,
      color: "purple"
    },
    {
      name: "Real-time Monitoring",
      status: "active",
      threats: 0,
      lastCheck: "15 sec ago",
      path: "/security-control",
      icon: Eye,
      color: "cyan"
    },
    {
      name: "Compliance Engine",
      status: "active",
      threats: 0,
      lastCheck: "2 min ago",
      path: "/admin/compliance",
      icon: CheckCircle,
      color: "emerald"
    },
    {
      name: "Threat Detection",
      status: "active",
      threats: 0, 
      lastCheck: "30 sec ago",
      path: "/security-tools",
      icon: AlertTriangle,
      color: "orange"
    }
  ];

  const complianceStandards = [
    { name: "GDPR", status: "compliant", score: 100 },
    { name: "SOC 2", status: "compliant", score: 98.5 },
    { name: "ISO 27001", status: "compliant", score: 97.2 },
    { name: "CCPA", status: "compliant", score: 99.1 },
    { name: "HIPAA", status: "compliant", score: 96.8 },
    { name: "PCI DSS", status: "compliant", score: 98.9 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": case "compliant": return "bg-green-500";
      case "warning": return "bg-yellow-500";
      case "critical": return "bg-red-500";
      case "maintenance": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case "low": return "text-green-400";
      case "medium": return "text-yellow-400";
      case "high": return "text-orange-400";
      case "critical": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  Security Control Center
                </h1>
                <p className="text-gray-400">Enterprise security, compliance, and threat management</p>
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
            <TabsTrigger value="overview">Security Overview</TabsTrigger>
            <TabsTrigger value="monitoring">Real-time Monitoring</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="management">Security Management</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Security Status Banner */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-500/20 rounded-full">
                      <CheckCircle className="h-8 w-8 text-green-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Security Status: All Clear</h2>
                      <p className="text-gray-400">Last security scan: {securityMetrics.lastScan}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${getThreatLevelColor(securityMetrics.threatLevel)}`}>
                      {securityMetrics.threatLevel.toUpperCase()}
                    </div>
                    <p className="text-gray-400">Threat Level</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              <Card className="bg-gray-800/50 border-gray-700 lg:col-span-2">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Active Sessions</p>
                      <p className="text-2xl font-bold text-blue-400">{securityMetrics.activeSessions.toLocaleString()}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700 lg:col-span-2">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Blocked Attacks</p>
                      <p className="text-2xl font-bold text-red-400">{securityMetrics.blockedAttacks}</p>
                    </div>
                    <Shield className="h-8 w-8 text-red-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Compliance</p>
                      <p className="text-2xl font-bold text-green-400">{securityMetrics.complianceScore}%</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Security Events</p>
                      <p className="text-2xl font-bold text-purple-400">{(securityMetrics.securityEvents / 1000).toFixed(1)}K</p>
                    </div>
                    <Activity className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Active Monitors</p>
                      <p className="text-2xl font-bold text-cyan-400">{securityMetrics.activeMonitors}</p>
                    </div>
                    <Eye className="h-8 w-8 text-cyan-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Vulnerabilities</p>
                      <p className="text-2xl font-bold text-green-400">{securityMetrics.vulnerabilities}</p>
                    </div>
                    <Lock className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Security Systems Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {securitySystems.map((system, index) => (
                <Card 
                  key={index}
                  className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 cursor-pointer group"
                  onClick={() => onNavigate(system.path)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 bg-gradient-to-r from-${system.color}-500 to-${system.color}-600 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                        <system.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(system.status)}`} />
                        <Badge variant="outline" className="text-xs border-gray-600">
                          {system.status}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-lg text-white group-hover:text-red-400 transition-colors">
                      {system.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Threats Detected</span>
                        <span className="text-green-400 font-medium">{system.threats}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Last Check</span>
                        <span className="text-blue-400">{system.lastCheck}</span>
                      </div>
                      <Button 
                        size="sm" 
                        className={`w-full bg-gradient-to-r from-${system.color}-500 to-${system.color}-600 hover:opacity-90`}
                      >
                        Monitor →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Real-time Security Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Eye className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">24/7 Security Monitoring</h3>
                  <p className="text-gray-400 mb-4">Monitor all security events and threats in real-time</p>
                  <Button 
                    onClick={() => onNavigate("/security-dashboard")}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                  >
                    Access Security Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            {/* Compliance Standards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {complianceStandards.map((standard, index) => (
                <Card key={index} className="bg-gray-800/50 border-gray-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-white">{standard.name}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(standard.status)}`} />
                        <Badge variant="outline" className="text-xs border-gray-600">
                          {standard.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Compliance Score</span>
                        <span className="text-green-400 font-bold">{standard.score}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${standard.score}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="management" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Security Management Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => onNavigate("/admin/api-keys")}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    <Key className="mr-2 h-4 w-4" />
                    API Keys
                  </Button>
                  <Button 
                    onClick={() => onNavigate("/admin/sessions")}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Sessions
                  </Button>
                  <Button 
                    onClick={() => onNavigate("/admin/compliance")}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Compliance
                  </Button>
                  <Button 
                    onClick={() => onNavigate("/security-tools")}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Threat Tools
                  </Button>
                  <Button 
                    onClick={() => onNavigate("/security-dashboard")}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Monitoring
                  </Button>
                  <Button 
                    onClick={() => onNavigate("/privacy")}
                    className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800"
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Privacy
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SecurityControlCenter;