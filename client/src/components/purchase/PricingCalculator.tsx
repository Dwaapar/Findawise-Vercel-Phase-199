import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingUp, DollarSign, Clock, Users, Zap, ArrowRight } from 'lucide-react';

interface PricingCalculatorProps {
  selectedServices?: any[];
  onCalculationComplete?: (calculation: any) => void;
}

export function PricingCalculator({ selectedServices = [], onCalculationComplete }: PricingCalculatorProps) {
  const [companySize, setCompanySize] = useState([50]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([100000]);
  const [automationPercentage, setAutomationPercentage] = useState([60]);
  const [calculationResult, setCalculationResult] = useState<any>(null);

  const calculateROI = () => {
    const employees = companySize[0];
    const revenue = monthlyRevenue[0];
    const automation = automationPercentage[0];
    
    // Base calculations
    const avgSalaryPerHour = 75; // Average loaded cost per hour
    const hoursPerMonth = 160; // Average working hours per month
    const efficiencyGain = automation / 100;
    
    // Calculate savings
    const hoursSavedPerEmployee = hoursPerMonth * 0.3 * efficiencyGain; // 30% of time can be automated
    const totalHoursSaved = hoursSavedPerEmployee * employees;
    const monthlySavings = totalHoursSaved * avgSalaryPerHour;
    const yearlySavings = monthlySavings * 12;
    
    // Calculate service costs
    const serviceCosts = selectedServices.reduce((total, service) => total + service.finalPrice, 0);
    const yearlyServiceCost = serviceCosts * 12;
    
    // ROI calculations
    const netSavings = yearlySavings - yearlyServiceCost;
    const roiPercentage = yearlyServiceCost > 0 ? ((netSavings / yearlyServiceCost) * 100) : 0;
    const paybackMonths = serviceCosts > 0 ? (serviceCosts / (monthlySavings - serviceCosts)) : 0;
    
    // Revenue impact calculations
    const revenueIncrease = revenue * 0.15 * efficiencyGain; // 15% potential revenue increase
    const monthlyRevenueImpact = revenueIncrease;
    const yearlyRevenueImpact = monthlyRevenueImpact * 12;
    
    // Productivity metrics
    const productivityIncrease = automation * 0.8; // 80% of automation target achieved
    const qualityImprovement = automation * 0.6; // 60% quality improvement correlation
    
    const result = {
      costSavings: {
        monthly: monthlySavings,
        yearly: yearlySavings,
        hoursSaved: totalHoursSaved
      },
      serviceCosts: {
        monthly: serviceCosts,
        yearly: yearlyServiceCost
      },
      roi: {
        percentage: roiPercentage,
        netSavings: netSavings,
        paybackMonths: Math.max(paybackMonths, 0)
      },
      revenueImpact: {
        monthly: monthlyRevenueImpact,
        yearly: yearlyRevenueImpact
      },
      productivity: {
        increase: productivityIncrease,
        qualityImprovement: qualityImprovement,
        efficiencyGain: automation
      },
      assumptions: {
        employees,
        avgHourlyRate: avgSalaryPerHour,
        hoursPerMonth,
        automationTarget: automation
      }
    };
    
    setCalculationResult(result);
    onCalculationComplete?.(result);
    
    return result;
  };

  useEffect(() => {
    calculateROI();
  }, [companySize, monthlyRevenue, automationPercentage, selectedServices]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getCompanySizeLabel = (size: number) => {
    if (size <= 10) return 'Startup';
    if (size <= 50) return 'Small Business';
    if (size <= 200) return 'Mid-Market';
    if (size <= 1000) return 'Enterprise';
    return 'Large Enterprise';
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Calculator className="w-8 h-8 text-blue-400 mr-3" />
          <h2 className="text-3xl font-bold text-white">ROI Calculator</h2>
        </div>
        <p className="text-gray-300">Calculate your expected return on investment with our platform</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Parameters */}
        <div className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-400" />
                Company Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Company Size */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-gray-300 font-medium">Number of Employees</label>
                  <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">
                    {companySize[0]} • {getCompanySizeLabel(companySize[0])}
                  </Badge>
                </div>
                <Slider
                  value={companySize}
                  onValueChange={setCompanySize}
                  max={2000}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1</span>
                  <span>2000+</span>
                </div>
              </div>

              {/* Monthly Revenue */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-gray-300 font-medium">Monthly Revenue</label>
                  <Badge className="bg-green-600/20 text-green-400 border-green-500/30">
                    {formatCurrency(monthlyRevenue[0])}
                  </Badge>
                </div>
                <Slider
                  value={monthlyRevenue}
                  onValueChange={setMonthlyRevenue}
                  max={10000000}
                  min={10000}
                  step={10000}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>$10K</span>
                  <span>$10M+</span>
                </div>
              </div>

              {/* Automation Target */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-gray-300 font-medium">Automation Target</label>
                  <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30">
                    {automationPercentage[0]}%
                  </Badge>
                </div>
                <Slider
                  value={automationPercentage}
                  onValueChange={setAutomationPercentage}
                  max={90}
                  min={10}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>10%</span>
                  <span>90%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Services Summary */}
          {selectedServices.length > 0 && (
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Selected Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedServices.map((service, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">{service.name}</div>
                        <div className="text-sm text-gray-400">{service.category}</div>
                      </div>
                      <div className="text-blue-400 font-semibold">
                        {formatCurrency(service.finalPrice)}/mo
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-slate-700 pt-3 mt-3">
                    <div className="flex items-center justify-between">
                      <div className="text-white font-bold">Total Monthly Cost</div>
                      <div className="text-xl font-bold text-white">
                        {formatCurrency(selectedServices.reduce((total, service) => total + service.finalPrice, 0))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results */}
        <div className="space-y-6">
          {calculationResult && (
            <>
              {/* ROI Overview */}
              <Card className="bg-gradient-to-br from-green-950/30 to-emerald-950/30 border-green-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                    ROI Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400">
                        {Math.round(calculationResult.roi.percentage)}%
                      </div>
                      <div className="text-sm text-gray-400">Annual ROI</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400">
                        {Math.round(calculationResult.roi.paybackMonths)}
                      </div>
                      <div className="text-sm text-gray-400">Payback (Months)</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cost Savings */}
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-blue-400" />
                    Cost Savings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xl font-bold text-white">
                        {formatCurrency(calculationResult.costSavings.monthly)}
                      </div>
                      <div className="text-sm text-gray-400">Monthly Savings</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-white">
                        {formatCurrency(calculationResult.costSavings.yearly)}
                      </div>
                      <div className="text-sm text-gray-400">Annual Savings</div>
                    </div>
                  </div>
                  <div className="text-center pt-2 border-t border-slate-700">
                    <div className="text-lg font-semibold text-green-400">
                      {Math.round(calculationResult.costSavings.hoursSaved)} hours saved/month
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Impact */}
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-purple-400" />
                    Performance Impact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xl font-bold text-purple-400">
                        +{Math.round(calculationResult.productivity.increase)}%
                      </div>
                      <div className="text-sm text-gray-400">Productivity Boost</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-purple-400">
                        +{Math.round(calculationResult.productivity.qualityImprovement)}%
                      </div>
                      <div className="text-sm text-gray-400">Quality Improvement</div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-700">
                    <div className="text-lg font-semibold text-white">
                      Potential Revenue Increase: {formatCurrency(calculationResult.revenueImpact.yearly)}/year
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Summary */}
              <Card className="bg-gradient-to-br from-blue-950/30 to-purple-950/30 border-blue-700/50">
                <CardContent className="p-6">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2">Net Annual Benefit</h3>
                    <div className="text-4xl font-bold text-green-400 mb-4">
                      {formatCurrency(calculationResult.roi.netSavings)}
                    </div>
                    <p className="text-gray-300 text-sm">
                      Based on {calculationResult.assumptions.employees} employees with {calculationResult.assumptions.automationTarget}% automation target
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* Action Button */}
      {onCalculationComplete && (
        <div className="mt-8 text-center">
          <Button 
            onClick={() => onCalculationComplete(calculationResult)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-300 group"
          >
            Proceed with This Configuration
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      )}
    </div>
  );
}