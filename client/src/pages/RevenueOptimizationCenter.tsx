import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, TrendingUp, Target, Zap, Users, BarChart3,
  ShoppingCart, CreditCard, Percent, ArrowUp, ArrowDown
} from "lucide-react";

interface RevenueOptimizationCenterProps {
  onNavigate: (path: string) => void;
}

const RevenueOptimizationCenter = ({ onNavigate }: RevenueOptimizationCenterProps) => {
  const [revenueMetrics, setRevenueMetrics] = useState({
    dailyRevenue: 284750,
    monthlyRevenue: 7832400,
    revenueGrowth: 23.7,
    conversionRate: 4.2,
    avgOrderValue: 147.50,
    activeOffers: 1247,
    affiliateCommissions: 89340,
    profitMargin: 68.4
  });

  const revenueStreams = [
    {
      name: "Affiliate Networks",
      revenue: 156420,
      growth: 18.3,
      status: "optimal",
      path: "/affiliate-networks",
      icon: Users,
      color: "green"
    },
    {
      name: "Direct Sales",
      revenue: 98750,
      growth: 12.7,
      status: "optimal", 
      path: "/admin/storefront",
      icon: ShoppingCart,
      color: "blue"
    },
    {
      name: "Subscription Revenue",
      revenue: 67890,
      growth: 31.2,
      status: "optimal",
      path: "/admin/revenue-split",
      icon: CreditCard,
      color: "purple"
    },
    {
      name: "Digital Products",
      revenue: 45320,
      growth: 8.9,
      status: "good",
      path: "/admin/offer-engine", 
      icon: Zap,
      color: "yellow"
    },
    {
      name: "Commission Splits", 
      revenue: 29840,
      growth: 15.4,
      status: "optimal",
      path: "/admin/revenue-split",
      icon: Percent,
      color: "indigo"
    },
    {
      name: "Premium Services",
      revenue: 18760,
      growth: 22.1,
      status: "optimal",
      path: "/offers",
      icon: Target,
      color: "cyan"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal": return "bg-green-500";
      case "good": return "bg-yellow-500";
      case "warning": return "bg-orange-500";
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
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Revenue Optimization Center
                </h1>
                <p className="text-gray-400">Multi-vertical revenue management and optimization</p>
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
            <TabsTrigger value="overview">Revenue Overview</TabsTrigger>
            <TabsTrigger value="streams">Revenue Streams</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Revenue Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              <Card className="bg-gray-800/50 border-gray-700 lg:col-span-2">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Daily Revenue</p>
                      <p className="text-2xl font-bold text-green-400">{formatCurrency(revenueMetrics.dailyRevenue)}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700 lg:col-span-2">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Monthly Revenue</p>
                      <p className="text-2xl font-bold text-blue-400">{formatCurrency(revenueMetrics.monthlyRevenue)}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Growth</p>
                      <p className="text-2xl font-bold text-purple-400">{revenueMetrics.revenueGrowth}%</p>
                    </div>
                    <ArrowUp className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Conversion</p>
                      <p className="text-2xl font-bold text-yellow-400">{revenueMetrics.conversionRate}%</p>
                    </div>
                    <Target className="h-8 w-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">AOV</p>
                      <p className="text-2xl font-bold text-indigo-400">${revenueMetrics.avgOrderValue}</p>
                    </div>
                    <ShoppingCart className="h-8 w-8 text-indigo-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Active Offers</p>
                      <p className="text-2xl font-bold text-cyan-400">{revenueMetrics.activeOffers.toLocaleString()}</p>
                    </div>
                    <Zap className="h-8 w-8 text-cyan-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Commissions</p>
                      <p className="text-2xl font-bold text-orange-400">{formatCurrency(revenueMetrics.affiliateCommissions)}</p>
                    </div>
                    <Users className="h-8 w-8 text-orange-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Profit Margin</p>
                      <p className="text-2xl font-bold text-pink-400">{revenueMetrics.profitMargin}%</p>
                    </div>
                    <Percent className="h-8 w-8 text-pink-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Streams Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {revenueStreams.map((stream, index) => (
                <Card 
                  key={index}
                  className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 cursor-pointer group"
                  onClick={() => onNavigate(stream.path)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 bg-gradient-to-r from-${stream.color}-500 to-${stream.color}-600 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                        <stream.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(stream.status)}`} />
                        <Badge variant="outline" className="text-xs border-gray-600">
                          {stream.status}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-lg text-white group-hover:text-green-400 transition-colors">
                      {stream.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-green-400">{formatCurrency(stream.revenue)}</span>
                        <div className="flex items-center text-sm">
                          <ArrowUp className="h-4 w-4 text-green-400 mr-1" />
                          <span className="text-green-400">{stream.growth}%</span>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className={`w-full bg-gradient-to-r from-${stream.color}-500 to-${stream.color}-600 hover:opacity-90`}
                      >
                        Optimize →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="streams" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Revenue Stream Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="h-16 w-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Multi-Channel Revenue Management</h3>
                  <p className="text-gray-400 mb-4">Manage and optimize all revenue streams from one dashboard</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                    <Button 
                      onClick={() => onNavigate("/admin/offer-engine")}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      Offer Engine
                    </Button>
                    <Button 
                      onClick={() => onNavigate("/admin/affiliate")}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    >
                      Affiliate Networks
                    </Button>
                    <Button 
                      onClick={() => onNavigate("/admin/revenue-split")}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      Revenue Splits
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="optimization" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Revenue Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Target className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">AI-Powered Revenue Optimization</h3>
                  <p className="text-gray-400 mb-4">Optimize conversion rates and maximize revenue potential</p>
                  <Button 
                    onClick={() => onNavigate("/admin/funnel")}
                    className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                  >
                    Access Optimization Tools
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Revenue Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Advanced Revenue Analytics</h3>
                  <p className="text-gray-400 mb-4">Deep insights into revenue performance and trends</p>
                  <Button 
                    onClick={() => onNavigate("/analytics-intelligence")}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    Access Revenue Analytics
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

export default RevenueOptimizationCenter;