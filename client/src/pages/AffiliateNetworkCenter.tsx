import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, DollarSign, TrendingUp, Target, Globe, Zap,
  Link, BarChart3, Activity, Settings, CheckCircle
} from "lucide-react";

interface AffiliateNetworkCenterProps {
  onNavigate: (path: string) => void;
}

const AffiliateNetworkCenter = ({ onNavigate }: AffiliateNetworkCenterProps) => {
  const [affiliateMetrics, setAffiliateMetrics] = useState({
    totalRevenue: 156420,
    activePartners: 847,
    commissionsPaid: 89340,
    conversionRate: 6.8,
    averageCommission: 24.7,
    clicksToday: 15847,
    offersActive: 1247,
    networksConnected: 12
  });

  const affiliateNetworks = [
    {
      name: "Amazon Partners",
      revenue: 45230,
      partners: 234,
      status: "active",
      commission: 8.5,
      path: "/admin/affiliate",
      icon: Globe,
      color: "orange"
    },
    {
      name: "Commission Junction",
      revenue: 38750,
      partners: 189,
      status: "active", 
      commission: 12.3,
      path: "/admin/affiliate",
      icon: Link,
      color: "blue"
    },
    {
      name: "ShareASale Network",
      revenue: 29840,
      partners: 156,
      status: "active",
      commission: 15.2,
      path: "/admin/affiliate",
      icon: Users,
      color: "green"
    },
    {
      name: "ClickBank Marketplace",
      revenue: 24680,
      partners: 143,
      status: "active",
      commission: 25.8,
      path: "/admin/affiliate",
      icon: Target,
      color: "purple"
    },
    {
      name: "Impact Network",
      revenue: 18920,
      partners: 125,
      status: "optimal",
      commission: 18.4,
      path: "/admin/affiliate",
      icon: Activity,
      color: "cyan"
    },
    {
      name: "Direct Partnerships",
      revenue: 12870,
      partners: 89,
      status: "optimal",
      commission: 22.1,
      path: "/admin/affiliate-redirect",
      icon: Zap,
      color: "yellow"
    }
  ];

  const offerCategories = [
    { category: "Software & SaaS", offers: 342, revenue: 67850, conversion: 8.2 },
    { category: "Finance & Investment", offers: 189, revenue: 45320, conversion: 6.4 },
    { category: "Health & Wellness", offers: 234, revenue: 38940, conversion: 7.1 },
    { category: "Travel & Hospitality", offers: 156, revenue: 29670, conversion: 5.8 },
    { category: "Education & Training", offers: 178, revenue: 24580, conversion: 9.3 },
    { category: "Home & Garden", offers: 148, revenue: 18750, conversion: 4.9 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": case "optimal": return "bg-green-500";
      case "warning": return "bg-yellow-500";
      case "critical": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Affiliate Network Center
                </h1>
                <p className="text-gray-400">Multi-network affiliate management and revenue optimization</p>
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
            <TabsTrigger value="overview">Network Overview</TabsTrigger>
            <TabsTrigger value="partners">Partner Management</TabsTrigger>
            <TabsTrigger value="offers">Offer Management</TabsTrigger>
            <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Affiliate Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              <Card className="bg-gray-800/50 border-gray-700 lg:col-span-2">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Revenue</p>
                      <p className="text-2xl font-bold text-green-400">{formatCurrency(affiliateMetrics.totalRevenue)}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700 lg:col-span-2">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Commissions Paid</p>
                      <p className="text-2xl font-bold text-blue-400">{formatCurrency(affiliateMetrics.commissionsPaid)}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Active Partners</p>
                      <p className="text-2xl font-bold text-purple-400">{affiliateMetrics.activePartners}</p>
                    </div>
                    <Users className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Conversion</p>
                      <p className="text-2xl font-bold text-cyan-400">{affiliateMetrics.conversionRate}%</p>
                    </div>
                    <Target className="h-8 w-8 text-cyan-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Avg Commission</p>
                      <p className="text-2xl font-bold text-yellow-400">${affiliateMetrics.averageCommission}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Clicks Today</p>
                      <p className="text-2xl font-bold text-indigo-400">{(affiliateMetrics.clicksToday / 1000).toFixed(1)}K</p>
                    </div>
                    <Activity className="h-8 w-8 text-indigo-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Active Offers</p>
                      <p className="text-2xl font-bold text-pink-400">{affiliateMetrics.offersActive.toLocaleString()}</p>
                    </div>
                    <Zap className="h-8 w-8 text-pink-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Networks</p>
                      <p className="text-2xl font-bold text-orange-400">{affiliateMetrics.networksConnected}</p>
                    </div>
                    <Globe className="h-8 w-8 text-orange-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Affiliate Networks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {affiliateNetworks.map((network, index) => (
                <Card 
                  key={index}
                  className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 cursor-pointer group"
                  onClick={() => onNavigate(network.path)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 bg-gradient-to-r from-${network.color}-500 to-${network.color}-600 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                        <network.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(network.status)}`} />
                        <Badge variant="outline" className="text-xs border-gray-600">
                          {network.status}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-lg text-white group-hover:text-green-400 transition-colors">
                      {network.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-green-400">{formatCurrency(network.revenue)}</span>
                        <span className="text-sm text-blue-400">{network.partners} partners</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Avg Commission</span>
                        <span className="text-yellow-400 font-medium">{network.commission}%</span>
                      </div>
                      <Button 
                        size="sm" 
                        className={`w-full bg-gradient-to-r from-${network.color}-500 to-${network.color}-600 hover:opacity-90`}
                      >
                        Manage Network →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="partners" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Partner Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-16 w-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Affiliate Partner Dashboard</h3>
                  <p className="text-gray-400 mb-4">Manage affiliate partners, track performance, and optimize relationships</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                    <Button 
                      onClick={() => onNavigate("/admin/affiliate")}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Partner Dashboard
                    </Button>
                    <Button 
                      onClick={() => onNavigate("/admin/affiliate-redirect")}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    >
                      <Link className="mr-2 h-4 w-4" />
                      Link Management
                    </Button>
                    <Button 
                      onClick={() => onNavigate("/admin/revenue-split")}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      <DollarSign className="mr-2 h-4 w-4" />
                      Commission Setup
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="offers" className="space-y-6">
            {/* Offer Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offerCategories.map((category, index) => (
                <Card key={index} className="bg-gray-800/50 border-gray-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-white">{category.category}</CardTitle>
                      <Badge variant="outline" className="text-xs border-gray-600">
                        {category.offers} offers
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Revenue</span>
                        <span className="text-green-400 font-bold">{formatCurrency(category.revenue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Conversion</span>
                        <span className="text-blue-400 font-medium">{category.conversion}%</span>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90"
                        onClick={() => onNavigate("/admin/offer-engine")}
                      >
                        Manage Offers
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Affiliate Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Advanced Affiliate Analytics</h3>
                  <p className="text-gray-400 mb-4">Track performance, optimize campaigns, and maximize revenue</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                    <Button 
                      onClick={() => onNavigate("/analytics-intelligence")}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    >
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Performance Analytics
                    </Button>
                    <Button 
                      onClick={() => onNavigate("/admin/funnel")}
                      className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                    >
                      <Target className="mr-2 h-4 w-4" />
                      Conversion Funnels
                    </Button>
                    <Button 
                      onClick={() => onNavigate("/revenue-optimization")}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Revenue Reports
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

export default AffiliateNetworkCenter;