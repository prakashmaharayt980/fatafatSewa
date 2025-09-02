'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload, User, Building2, FileText, Check, ChevronRight, CreditCard, ChevronLeft, Send } from 'lucide-react';
import { EmiContextInfoIF, useContextCart } from './CartContext';


export default function EmiDrawer() {
  const { emiContextInfo, setEmiContextInfo, EMICalculator } = useContextCart();
  const { product } = emiContextInfo
  const [currentStep, setCurrentStep] = useState(1);






  if (product === null) return;



  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileKey: keyof EmiContextInfoIF['files']) => {
    const file = e.target.files?.[0] || null;
    setEmiContextInfo((prev) => ({
      ...prev,
      files: { ...prev.files, [fileKey]: file },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const monthlyEMI = EMICalculator(product.price || 0, emiContextInfo.emiTenure);
    const submissionData = {
      ...emiContextInfo,
      product: product.name,
      monthlyEMI,
    };
    console.log('EMI Application:', submissionData);
    alert('EMI Application Submitted! Our team will contact you within 30 minutes.');
    setEmiContextInfo((prev) => ({ ...prev, isDrawerOpen: false }));
  };

  const steps = [
    { id: 1, title: 'Professional Info', icon: User, color: 'bg-blue-500' },
    { id: 2, title: 'Bank Info', icon: Building2, color: 'bg-yellow-500' },
    { id: 3, title: 'EMI Terms', icon: FileText, color: 'bg-blue-600' }
  ];

  const handleInputChange = (field, value) => {
    setEmiContextInfo(prev => ({ ...prev, [field]: value }));
  };



  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };



  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-8">
              <Label className="text-sm font-medium text-gray-700 mb-2 block ">Full Name</Label>
              <Input
                value={emiContextInfo.userInfo.name}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="border-gray-300 focus:ring-gray-200 focus:border-none  focus:outline-none outline-none"
                placeholder="Enter your full name "
              />
            </div>
            <div className="col-span-4">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Phone</Label>
              <Input
                type="tel"
                value={emiContextInfo.userInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="border-gray-300 focus:ring-gray-200 focus:border-none  focus:outline-none outline-none"
                placeholder="Phone number"
              />
            </div>
            <div className="col-span-7">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Email Address</Label>
              <Input
                type="email"
                value={emiContextInfo.userInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="border-gray-300 focus:ring-gray-200 focus:border-none  focus:outline-none outline-none"
                placeholder="Enter your email"
              />
            </div>
            <div className="col-span-5">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Occupation</Label>

              <Input
                value={emiContextInfo.userInfo.occupation}
                onChange={(value) => handleInputChange('occupation', value)}
                className="border-gray-300 focus:ring-gray-200 focus:border-none  focus:outline-none outline-none"
                placeholder="Occuptions"
              />
            </div>
            <div className="col-span-6 ga">

              <Label className="text-sm font-medium text-gray-700">Gender</Label>
              <Select onValueChange={(value) => handleInputChange('occupation', value)}

              >
                <SelectTrigger className="border-gray-300 focus:ring-gray-200 focus:border-none w-full mt-2  focus:outline-none outline-none">
                  <SelectValue placeholder="Select your GEnder" />
                </SelectTrigger>
                <SelectContent className="border-gray-300 bg-blue-50 focus:ring-gray-200 focus:border-none w-full  ">
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="FeMale">FeMale</SelectItem>

                </SelectContent>
              </Select>
            </div>
            <div className="col-span-6">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">{`DOB (B.S)`}</Label>
              <Input
                value={emiContextInfo.userInfo.dob}
                onChange={(e) => handleInputChange('dob', e.target.value)}
                className="border-gray-300 w-full focus:ring-gray-200 focus:border-none  focus:outline-none outline-none"
                placeholder="Enter.dob name"
                type='date'
              />
            </div>
            <div className="col-span-12">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Address</Label>
              <Textarea
                value={emiContextInfo.userInfo.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="border-gray-300 focus:ring-gray-200 focus:border-none  focus:outline-none outline-none"
                placeholder="Enter your full address"
                rows={3}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-3">

            <div>
              <Label className="text-sm font-medium text-gray-700">Do you have a credit card?</Label>
              <Select onValueChange={(value) => handleInputChange('hasCreditCard', value)}>
                <SelectTrigger className="border-gray-300 w-full focus:ring-gray-200 focus:border-none focus:outline-none outline-none">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent className="border-gray-300 bg-blue-50 focus:ring-gray-200 focus:border-none w-full">
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Conditional Rendering Based on Credit Card Selection */}
            {emiContextInfo.hasCreditCard === 'yes' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Credit Card Provider</Label>
                  <Select onValueChange={(value) => handleInputChange('creditCardProvider', value)}>
                    <SelectTrigger className="border-gray-300 w-full focus:ring-gray-200 focus:border-none focus:outline-none outline-none">
                      <SelectValue placeholder="Select your card provider" />
                    </SelectTrigger>
                    <SelectContent className="border-gray-300 bg-blue-50 focus:ring-gray-200 focus:border-none w-full">
                      <SelectItem value="visa">Visa</SelectItem>
                      <SelectItem value="mastercard">Mastercard</SelectItem>
                      <SelectItem value="amex">American Express</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Credit Card Number</Label>
                  <Input
                    value={emiContextInfo.bankinfo.creditCardNumber}
                    onChange={(e) => handleInputChange('creditCardNumber', e.target.value)}
                    className="border-gray-300 focus:ring-gray-200 focus:border-none focus:outline-none outline-none"
                    placeholder="Enter credit card number"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Card Holder Name</Label>
                  <Input
                    value={emiContextInfo.bankinfo.cardHolderName}
                    onChange={(e) => handleInputChange('cardHolderName', e.target.value)}
                    className="border-gray-300 focus:ring-gray-200 focus:border-none focus:outline-none outline-none"
                    placeholder="Name as per credit card"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Expiry Date</Label>
                  <Input
                    value={emiContextInfo.bankinfo.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    className="border-gray-300 focus:ring-gray-200 focus:border-none focus:outline-none outline-none"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Credit Card Statement</Label>
                  <div className="mt-1 border-2 border-dashed border-yellow-300 rounded-lg p-4 hover:border-yellow-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => handleFileChange(e, 'creditCardStatement')}
                      className="hidden"
                      id="creditCardStatement"
                    />
                    <label htmlFor="creditCardStatement" className="cursor-pointer flex items-center justify-center gap-2 text-gray-600">
                      <Upload className="h-5 w-5 text-yellow-500" />

                    </label>
                  </div>
                </div>
              </div>
            ) : emiContextInfo.hasCreditCard === 'no' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Bank Name</Label>
                    <Select onValueChange={(value) => handleInputChange('bankName', value)}>
                      <SelectTrigger className="border-gray-300 w-full focus:ring-gray-200 focus:border-none focus:outline-none outline-none">
                        <SelectValue placeholder="Select your bank" />
                      </SelectTrigger>
                      <SelectContent className="border-gray-300 bg-blue-50 focus:ring-gray-200 focus:border-none w-full">
                        <SelectItem value="nabil">Nabil Bank</SelectItem>
                        <SelectItem value="nica">NIC Asia Bank</SelectItem>
                        <SelectItem value="everest">Everest Bank</SelectItem>
                        <SelectItem value="standard">Standard Chartered</SelectItem>
                        <SelectItem value="himalayan">Himalayan Bank</SelectItem>
                        <SelectItem value="global">Global IME Bank</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Account Number</Label>
                    <Input
                      value={emiContextInfo.bankinfo.accountNumber}
                      onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                      className="border-gray-300 focus:ring-gray-200 focus:border-none focus:outline-none outline-none"
                      placeholder="Enter account number"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Account Holder Name</Label>
                    <Input
                      value={emiContextInfo.bankinfo.accountHolderName}
                      onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                      className="border-gray-300 focus:ring-gray-200 focus:border-none focus:outline-none outline-none"
                      placeholder="Name as per bank account"
                    />
                  </div>
                  
                </div>
                <div className="space-y-4">

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Bank Statement</Label>
                    <div className="mt-1 border-2 border-dashed border-yellow-300 rounded-lg p-4 hover:border-yellow-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => handleFileChange(e, 'bankStatement')}
                        className="hidden"
                        id="bankStatement"
                      />
                      <label htmlFor="bankStatement" className="cursor-pointer flex items-center justify-center gap-2 text-gray-600">
                        <Upload className="h-5 w-5 text-yellow-500" />
                       
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">

            <div className="bg-blue-50 flex felx-cols justify-between px-4 py-2 rounded-lg border border-blue-200">

              <p className="text-blue-700 text-sm">Original Price: NPR 1,89,900</p>
              <p className="text-gray-700 text-sm">Pay Per Month: NPR 1,000</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">


              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">EMI Tenure</Label>
                <Select onValueChange={(value) => handleInputChange('emiTenure', value)}>
                  <SelectTrigger className="border-gray-300 w-full focus:ring-gray-200 focus:border-none focus:outline-none outline-none">
                    <SelectValue placeholder="Select  Duration " />
                  </SelectTrigger>
                  <SelectContent className="border-gray-300 bg-blue-50 focus:ring-gray-200 focus:border-none w-full">
                    <SelectItem value="6">6 Months</SelectItem>
                    <SelectItem value="9">9 Months</SelectItem>
                    <SelectItem value="12">12 Months</SelectItem>
                    <SelectItem value="18">18 Months</SelectItem>
                    <SelectItem value="24">24 Months</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">Down Payment</Label>
                <Input
                  value={emiContextInfo.downPayment}
                  onChange={(e) => handleInputChange('downPayment', e.target.value)}
                  className="border-gray-300 focus:ring-gray-200 focus:border-none  focus:outline-none outline-none"
                  placeholder="Enter down payment amount"
                />
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">Important Terms:</h4>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• Processing fee: 2% of loan amount</li>
                <li>• Interest rate: 18-24% per annum</li>
                <li>• Late payment penalty: 2% per month</li>
                <li>• Minimum down payment: 20% of product price</li>
              </ul>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="terms" className="border-gray-300 focus:ring-gray-200 focus:border-none  focus:outline-none outline-none" />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the terms and conditions. I understand that this is a legally binding agreement and all information provided is accurate.
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };




  return (
    <Drawer open={emiContextInfo.isDrawerOpen}
      onOpenChange={(open) => setEmiContextInfo(prev => ({ ...prev, isDrawerOpen: open }))}>
      <DrawerContent className="max-h-[50vh] max-w-5xl mx-auto border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">

        <DrawerHeader className="text-center  m-0 p-0 items-center ">
          <DrawerTitle className="flex items-center justify-center gap-2 m-0 p-0 text-xl text-[var(--colour-fsP2)] font-semibold">
            <CreditCard className="w-5 h-5 text-[var(--colour-fsP1)]" />
            <span className=' items-center'>       Apply for EMI </span> : {product.name.slice(0, 40).concat('.....')}
          </DrawerTitle>
        </DrawerHeader>
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-center space-x-1 text-sm">
              {steps.map((step, index) => {
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;

                return (
                  <div key={step.id} className="flex items-center">
                    <span className={`${isCompleted ? 'text-green-600 font-medium' :
                      isActive ? 'text-blue-600 font-semibold' :
                        'text-gray-500'
                      }`}>
                      {step.title}
                    </span>
                    {index < steps.length - 1 && (
                      <span className="text-gray-400 mx-2">/</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="px-6 py-6 overflow-y-auto flex-1">
          {renderStepContent()}
        </div>
        <div className="bg-white rounded-lg shadow-sm px-6">

          <div className="flex justify-between items-center">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors">
              <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                <ChevronLeft className="w-4 h-4" />
              </div>
              Previous
            </button>
            {currentStep < 3 ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 font-medium shadow-lg hover:shadow-xl transition-all duration-200">
                Next Step
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <ChevronRight className="w-3 h-3" />
                </div>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center  gap-3 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 font-medium shadow-lg hover:shadow-xl transition-all duration-200">
                Submit Application
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}