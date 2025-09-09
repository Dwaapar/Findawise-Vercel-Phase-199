import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Lock, CreditCard, Building, Mail, User, MapPin, Shield, Calendar } from 'lucide-react';

interface CheckoutFlowProps {
  orderSummary: any;
  onComplete: (orderData: any) => void;
}

export function CheckoutFlow({ orderSummary, onComplete }: CheckoutFlowProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Company Information
    companyName: '',
    industry: '',
    companySize: '',
    
    // Contact Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    title: '',
    
    // Billing Address
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    
    // Payment Information
    paymentMethod: 'credit_card',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    
    // Billing Preferences
    billingCycle: 'monthly',
    autoRenew: true,
    
    // Agreements
    acceptTerms: false,
    acceptPrivacy: false,
    acceptCommunications: false
  });

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail',
    'Education', 'Government', 'Non-profit', 'Real Estate', 'Other'
  ];

  const companySizes = [
    '1-10 employees', '11-50 employees', '51-200 employees',
    '201-1000 employees', '1000+ employees'
  ];

  const months = [
    '01', '02', '03', '04', '05', '06',
    '07', '08', '09', '10', '11', '12'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => (currentYear + i).toString());

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return formData.companyName && formData.industry && formData.companySize;
      case 2:
        return formData.firstName && formData.lastName && formData.email && formData.phone;
      case 3:
        return formData.address && formData.city && formData.state && formData.zipCode;
      case 4:
        return formData.cardNumber && formData.expiryMonth && formData.expiryYear && 
               formData.cvv && formData.cardholderName;
      case 5:
        return formData.acceptTerms && formData.acceptPrivacy;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculateTotal = () => {
    const subtotal = orderSummary.totalPrice || 0;
    const tax = subtotal * 0.08; // 8% tax
    return {
      subtotal,
      tax,
      total: subtotal + tax
    };
  };

  const totals = calculateTotal();

  const handleSubmit = () => {
    if (validateStep(5)) {
      const orderData = {
        ...formData,
        orderSummary,
        totals,
        orderDate: new Date().toISOString(),
        orderId: `ORD-${Date.now()}`
      };
      onComplete(orderData);
    }
  };

  const steps = [
    { number: 1, title: 'Company Info', icon: Building },
    { number: 2, title: 'Contact Details', icon: User },
    { number: 3, title: 'Billing Address', icon: MapPin },
    { number: 4, title: 'Payment', icon: CreditCard },
    { number: 5, title: 'Review', icon: Shield }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Complete Your Order</h2>
        <p className="text-gray-300">Secure checkout for your digital asset services</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {steps.map((stepItem, index) => (
          <div key={stepItem.number} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
              step >= stepItem.number
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'border-slate-600 text-slate-400'
            }`}>
              <stepItem.icon className="w-5 h-5" />
            </div>
            <span className={`ml-2 text-sm ${step >= stepItem.number ? 'text-white' : 'text-slate-400'}`}>
              {stepItem.title}
            </span>
            {index < steps.length - 1 && (
              <div className={`w-8 h-0.5 mx-4 ${step > stepItem.number ? 'bg-blue-600' : 'bg-slate-600'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white text-xl">
                Step {step}: {steps[step - 1].title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Company Information */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="companyName" className="text-gray-300">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="industry" className="text-gray-300">Industry *</Label>
                      <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                        <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.map(industry => (
                            <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="companySize" className="text-gray-300">Company Size *</Label>
                      <Select value={formData.companySize} onValueChange={(value) => handleInputChange('companySize', value)}>
                        <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          {companySizes.map(size => (
                            <SelectItem key={size} value={size}>{size}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Contact Information */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-gray-300">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="bg-slate-800 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-gray-300">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="bg-slate-800 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-gray-300">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone" className="text-gray-300">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="bg-slate-800 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="title" className="text-gray-300">Job Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="bg-slate-800 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Billing Address */}
              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address" className="text-gray-300">Street Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-gray-300">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="bg-slate-800 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-gray-300">State/Province *</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className="bg-slate-800 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="zipCode" className="text-gray-300">ZIP/Postal Code *</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        className="bg-slate-800 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="country" className="text-gray-300">Country</Label>
                      <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                        <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="UK">United Kingdom</SelectItem>
                          <SelectItem value="AU">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Payment Information */}
              {step === 4 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardholderName" className="text-gray-300">Cardholder Name *</Label>
                    <Input
                      id="cardholderName"
                      value={formData.cardholderName}
                      onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardNumber" className="text-gray-300">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="expiryMonth" className="text-gray-300">Month *</Label>
                      <Select value={formData.expiryMonth} onValueChange={(value) => handleInputChange('expiryMonth', value)}>
                        <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map(month => (
                            <SelectItem key={month} value={month}>{month}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="expiryYear" className="text-gray-300">Year *</Label>
                      <Select value={formData.expiryYear} onValueChange={(value) => handleInputChange('expiryYear', value)}>
                        <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                          <SelectValue placeholder="YYYY" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map(year => (
                            <SelectItem key={year} value={year}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="cvv" className="text-gray-300">CVV *</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value)}
                        className="bg-slate-800 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-4">
                    <Label className="text-gray-300">Billing Preferences</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="autoRenew"
                          checked={formData.autoRenew}
                          onCheckedChange={(checked) => handleInputChange('autoRenew', checked)}
                        />
                        <label htmlFor="autoRenew" className="text-gray-300 text-sm">
                          Enable auto-renewal
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Review and Agreements */}
              {step === 5 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Review Your Information</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Company:</span>
                        <span className="text-white">{formData.companyName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Contact:</span>
                        <span className="text-white">{formData.firstName} {formData.lastName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email:</span>
                        <span className="text-white">{formData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Payment:</span>
                        <span className="text-white">•••• •••• •••• {formData.cardNumber.slice(-4)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="acceptTerms"
                        checked={formData.acceptTerms}
                        onCheckedChange={(checked) => handleInputChange('acceptTerms', checked)}
                      />
                      <label htmlFor="acceptTerms" className="text-gray-300 text-sm">
                        I agree to the <span className="text-blue-400 underline cursor-pointer">Terms of Service</span> and 
                        understand the service commitments.
                      </label>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="acceptPrivacy"
                        checked={formData.acceptPrivacy}
                        onCheckedChange={(checked) => handleInputChange('acceptPrivacy', checked)}
                      />
                      <label htmlFor="acceptPrivacy" className="text-gray-300 text-sm">
                        I agree to the <span className="text-blue-400 underline cursor-pointer">Privacy Policy</span> and 
                        data processing terms.
                      </label>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="acceptCommunications"
                        checked={formData.acceptCommunications}
                        onCheckedChange={(checked) => handleInputChange('acceptCommunications', checked)}
                      />
                      <label htmlFor="acceptCommunications" className="text-gray-300 text-sm">
                        I would like to receive product updates and promotional communications.
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  onClick={prevStep}
                  variant="outline"
                  disabled={step === 1}
                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  Previous
                </Button>
                {step < 5 ? (
                  <Button
                    onClick={nextStep}
                    disabled={!validateStep(step)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!validateStep(5)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Complete Order
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="bg-slate-900/50 border-slate-700/50 sticky top-6">
            <CardHeader>
              <CardTitle className="text-white">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Services */}
              <div className="space-y-3">
                {orderSummary?.services?.map((service: any, index: number) => (
                  <div key={index} className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">{service.name}</div>
                      <div className="text-gray-400 text-xs">{service.category}</div>
                    </div>
                    <div className="text-white font-semibold">
                      {formatCurrency(service.finalPrice)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-slate-700 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">{formatCurrency(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tax (8%)</span>
                  <span className="text-white">{formatCurrency(totals.tax)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-white">{formatCurrency(totals.total)}</span>
                </div>
              </div>
              
              <div className="text-xs text-gray-400 pt-2">
                <div className="flex items-center mb-2">
                  <Lock className="w-3 h-3 mr-1" />
                  Secure SSL encrypted checkout
                </div>
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formData.billingCycle === 'monthly' ? 'Monthly' : 'Annual'} billing cycle
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}