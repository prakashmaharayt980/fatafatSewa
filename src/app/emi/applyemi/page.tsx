'use client'

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import creditcardicon from '../../../../public/svgfile/creditcardicon.svg';
import downpaymenticon from '../../../../public/svgfile/payementiconcash.svg';
import addcreditcard from '../../../../public/svgfile/creditcardplus.svg';
import chnagecreditcard from '../../../../public/svgfile/creditcardchnage.png';
import { useContextEmi } from '../emiContext';

const ApplyEmiProcess = () => {
  const { emiContextInfo, setEmiContextInfo } = useContextEmi();
  const [NoCreditCard, setNoCreditCard] = useState(false)
  const [currentstep, setcurrentstep] = useState(0)
  const product = emiContextInfo.product;



  const handleInputChange = (e, section) => {
    const { name, value } = e.target;
    setEmiContextInfo(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value
      }
    }));
  };

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setEmiContextInfo(prev => ({
      ...prev,
      bankinfo: {
        ...prev.bankinfo,
        creditCardNumber: formatted
      }
    }));
  };

  const handleFileChange = (e, docType, isGranter = false) => {
    const file = e.target.files[0];
    setEmiContextInfo(prev => ({
      ...prev,
      files: {
        ...prev.files,
        [isGranter ? 'granterDocument' : 'citizenshipFile']: {
          ...prev.files[isGranter ? 'granterDocument' : 'citizenshipFile'],
          [docType]: file
        }
      }
    }));
  };

  const handleContinue = () => {
    setcurrentstep(Math.min((currentstep || 1) + 1, 3))
  };

  const handleBack = () => {

    setcurrentstep(Math.min((currentstep || 1) - 1, 3))
  };

  const handleOptionSelect = (option) => {
    setEmiContextInfo(prev => ({
      ...prev,
      hasCreditCard: option === 'creditCard' ? 'yes' : option === 'makeCard' ? 'make' : 'no',
      emiCalculation: {
        ...prev.emiCalculation,
        downPayment: option === 'downPayment' ? 40 : 0
      },

    }));
       setcurrentstep(1)
  };

  const emiData = useMemo(() => {
    if (!product?.price || product.price <= 0) {
      return {
        downPayment: 0,
        loanAmount: 0,
        monthlyEMI: 0,
        totalInterest: 0,
        totalPayment: 0,
      };
    }

    const downPaymentAmount = emiContextInfo.emiCalculation.downPayment === 40 ? product.price * 0.4 : 0;
    const loanAmount = product.price - downPaymentAmount;
    const monthlyRate = 10 / 100 / 12;
    const numberOfPayments = 9;

    const emi =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const totalPayment = emi * numberOfPayments;
    const totalInterest = totalPayment - loanAmount;

    return {
      downPayment: downPaymentAmount,
      loanAmount,
      monthlyEMI: emi,
      totalInterest,
      totalPayment,
    };
  }, [product?.price, emiContextInfo.emiCalculation.downPayment]);

  const formSections = {
    creditCard: [
      {
        title: "Credit Card Details",
        sectionKey: "bankinfo",
        step: 1,
        fields: [
          {
            label: "Card Number",
            name: "creditCardNumber",
            value: emiContextInfo.bankinfo.creditCardNumber || '',
            onChange: handleCardNumberChange,
            placeholder: "1234 5678 9012 3456",
            maxLength: 19
          },
          [
            {
              label: "Card Holder Name",
              name: "cardHolderName",
              value: emiContextInfo.bankinfo.cardHolderName || '',
              onChange: (e) => handleInputChange(e, "bankinfo"),
              placeholder: ""
            },
            {
              label: "Card Provider",
              name: "creditCardProvider",
              value: emiContextInfo.bankinfo.creditCardProvider || '',
              onChange: (e) => handleInputChange(e, "bankinfo"),
              placeholder: ""
            }
          ],
          [
            {
              label: "Expiry Date",
              name: "expiryDate",
              value: emiContextInfo.bankinfo.expiryDate || '',
              onChange: (e) => handleInputChange(e, "bankinfo"),
              placeholder: "MM/YY",
              maxLength: 5
            },
            {
              label: "Credit Card Limit",
              name: "cardLimit",
              value: emiContextInfo.bankinfo.cardLimit || '',
              onChange: (e) => handleInputChange(e, "bankinfo"),
              placeholder: "Enter card limit"
            }
          ]
        ]
      },
      {
        title: "Personal Details",
        sectionKey: "userInfo",
        step: 2,
        fields: [
          {
            label: "User Name",
            name: "name",
            value: emiContextInfo.userInfo.name || '',
            onChange: (e) => handleInputChange(e, "userInfo"),
            placeholder: "",
            maxLength: 50
          },
          [
            {
              label: "Email",
              name: "email",
              value: emiContextInfo.userInfo.email || '',
              onChange: (e) => handleInputChange(e, "userInfo"),
              placeholder: ""
            },
            {
              label: "Phone Number",
              name: "phone",
              value: emiContextInfo.userInfo.phone || '',
              onChange: (e) => handleInputChange(e, "userInfo"),
              placeholder: ""
            }
          ],
          [
            {
              label: "Address",
              name: "address",
              value: emiContextInfo.userInfo.address || '',
              onChange: (e) => handleInputChange(e, "userInfo"),
              placeholder: "",
              maxLength: 100
            },
            {
              label: "Citizen Number",
              name: "nationalID",
              value: emiContextInfo.userInfo.nationalID || '',
              onChange: (e) => handleInputChange(e, "userInfo"),
              placeholder: "Enter citizen number"
            }
          ]
        ]
      }
    ],
    downPayment: [
      {
        title: "Personal Details",
        sectionKey: "userInfo",
        step: 1,
        fields: [
          {
            label: "User Name",
            name: "name",
            value: emiContextInfo.userInfo.name || '',
            onChange: (e) => handleInputChange(e, "userInfo"),
            placeholder: "",
            maxLength: 50
          },
          [
            {
              label: "Email",
              name: "email",
              value: emiContextInfo.userInfo.email || '',
              onChange: (e) => handleInputChange(e, "userInfo"),
              placeholder: ""
            },
            {
              label: "Phone Number",
              name: "phone",
              value: emiContextInfo.userInfo.phone || '',
              onChange: (e) => handleInputChange(e, "userInfo"),
              placeholder: ""
            }
          ],
          [
            {
              label: "Address",
              name: "address",
              value: emiContextInfo.userInfo.address || '',
              onChange: (e) => handleInputChange(e, "userInfo"),
              placeholder: "",
              maxLength: 100
            },
            {
              label: "Citizen Number",
              name: "nationalID",
              value: emiContextInfo.userInfo.nationalID || '',
              onChange: (e) => handleInputChange(e, "userInfo"),
              placeholder: "Enter citizen number"
            }
          ]
        ],
        additionalContent: (
          <div className="mt-6">
            <h3 className="text-gray-700 font-medium mb-4">Required Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['ppphoto', 'front', 'back'].map((docType) => {
                const file = emiContextInfo.files.citizenshipFile[docType];
                const label = docType === 'ppphoto' ? 'Passport Photo' : `Citizenship ${docType.charAt(0).toUpperCase() + docType.slice(1)}`;
                return (
                  <div key={docType} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                    <input
                      type="file"
                      id={`citizenship-${docType}`}
                      onChange={(e) => handleFileChange(e, docType)}
                      className="hidden"
                    />
                    <label htmlFor={`citizenship-${docType}`} className="cursor-pointer">
                      <div className="flex flex-col items-center">
                        <Upload className="w-8 h-8 text-gray-400 mb-3" />
                        <span className="text-gray-600 font-medium">
                          {file ? file.name : label}
                        </span>
                      </div>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        )
      },
      {
        title: "Guarantor Information",
        sectionKey: "granterPersonalDetails",
        step: 2,
        fields: [
          [
            {
              label: "Guarantors Full Name",
              name: "name",
              value: emiContextInfo.granterPersonalDetails.name || '',
              onChange: (e) => handleInputChange(e, "granterPersonalDetails"),
              placeholder: ""
            },
            {
              label: "Address",
              name: "address",
              value: emiContextInfo.granterPersonalDetails.address || '',
              onChange: (e) => handleInputChange(e, "granterPersonalDetails"),
              placeholder: ""
            }
          ],
          [
            {
              label: "Phone Number",
              name: "phone",
              value: emiContextInfo.granterPersonalDetails.phone || '',
              onChange: (e) => handleInputChange(e, "granterPersonalDetails"),
              placeholder: ""
            },
            {
              label: "Citizenship Number",
              name: "nationalID",
              value: emiContextInfo.granterPersonalDetails.nationalID || '',
              onChange: (e) => handleInputChange(e, "granterPersonalDetails"),
              placeholder: "Enter citizenship number"
            }
          ]
        ],
        additionalContent: (
          <div className="mt-6">
            <h3 className="text-gray-700 font-medium mb-4">Required Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['ppphoto', 'front', 'back'].map((docType) => {
                const file = emiContextInfo.files.granterDocument[docType];
                const label = docType === 'ppphoto' ? 'Passport Photo' : `Citizenship ${docType.charAt(0).toUpperCase() + docType.slice(1)}`;
                return (
                  <div key={docType} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                    <input
                      type="file"
                      id={`granter-${docType}`}
                      onChange={(e) => handleFileChange(e, docType, true)}
                      className="hidden"
                    />
                    <label htmlFor={`granter-${docType}`} className="cursor-pointer">
                      <div className="flex flex-col items-center">
                        <Upload className="w-8 h-8 text-gray-400 mb-3" />
                        <span className="text-gray-600 font-medium">
                          {file ? file.name : label}
                        </span>
                      </div>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        )
      }
    ],
    makeCard: [
      {
        title: "Bank Details",
        sectionKey: "bankinfo",
        step: 1,
        fields: [
          {
            label: "Card Number",
            name: "creditCardNumber",
            value: emiContextInfo.bankinfo.creditCardNumber || '',
            onChange: handleCardNumberChange,
            placeholder: "1234 5678 9012 3456",
            maxLength: 19
          },
          [
            {
              label: "Account Holder Name",
              name: "accountHolderName",
              value: emiContextInfo.bankinfo.accountHolderName || '',
              onChange: (e) => handleInputChange(e, "bankinfo"),
              placeholder: ""
            },
            {
              label: "Bank Name",
              name: "bankname",
              value: emiContextInfo.bankinfo.bankname || '',
              onChange: (e) => handleInputChange(e, "bankinfo"),
              placeholder: ""
            }
          ],
          [
            {
              label: "Account Number",
              name: "accountNumber",
              value: emiContextInfo.bankinfo.accountNumber || '',
              onChange: (e) => handleInputChange(e, "bankinfo"),
              placeholder: "Enter account number"
            },
            {
              label: "Credit Card Limit",
              name: "cardLimit",
              value: emiContextInfo.bankinfo.cardLimit || '',
              onChange: (e) => handleInputChange(e, "bankinfo"),
              placeholder: "Enter card limit"
            }
          ]
        ]
      },
      {
        title: "Citizenship Documents",
        sectionKey: "files",
        step: 2,
        fields: [],
        additionalContent: (
          <div className="mt-6">
            <h3 className="text-gray-700 font-medium mb-4">Required Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['ppphoto', 'front', 'back'].map((docType) => {
                const file = emiContextInfo.files.citizenshipFile[docType];
                const label = docType === 'ppphoto' ? 'Passport Photo' : `Citizenship ${docType.charAt(0).toUpperCase() + docType.slice(1)}`;
                return (
                  <div key={docType} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                    <input
                      type="file"
                      id={`citizenship-${docType}`}
                      onChange={(e) => handleFileChange(e, docType)}
                      className="hidden"
                    />
                    <label htmlFor={`citizenship-${docType}`} className="cursor-pointer">
                      <div className="flex flex-col items-center">
                        <Upload className="w-8 h-8 text-gray-400 mb-3" />
                        <span className="text-gray-600 font-medium">
                          {file ? file.name : label}
                        </span>
                      </div>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        )
      }
    ]
  };


  const selectedOption = emiContextInfo.hasCreditCard === 'yes' ? 'creditCard' : emiContextInfo.hasCreditCard === 'make' ? 'makeCard' : 'downPayment';
  const currentFormSection = currentstep > 0 && currentstep < 3 ? formSections[selectedOption]?.find(section => section.step === currentstep) : null;

  const renderReview = () => {
    const { userInfo, bankinfo, granterPersonalDetails, files, hasCreditCard, emiCalculation } = emiContextInfo;

    return (
      <div className="bg-white rounded-lg shadow-sm p-8 mt-2">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Review Your Information</h2>
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-medium text-gray-800 mb-2">User Information</h3>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{userInfo.name || 'N/A'}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{userInfo.email || 'N/A'}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                <dd className="mt-1 text-sm text-gray-900">{userInfo.phone || 'N/A'}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="mt-1 text-sm text-gray-900">{userInfo.address || 'N/A'}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Citizen Number</dt>
                <dd className="mt-1 text-sm text-gray-900">{userInfo.nationalID || 'N/A'}</dd>
              </div>
            </dl>
          </section>

          {hasCreditCard === 'yes' && (
            <section>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Credit Card Details</h3>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Card Number</dt>
                  <dd className="mt-1 text-sm text-gray-900">{bankinfo.creditCardNumber || 'N/A'}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Card Holder Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{bankinfo.cardHolderName || 'N/A'}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Card Provider</dt>
                  <dd className="mt-1 text-sm text-gray-900">{bankinfo.creditCardProvider || 'N/A'}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Expiry Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">{bankinfo.expiryDate || 'N/A'}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Credit Card Limit</dt>
                  <dd className="mt-1 text-sm text-gray-900">{bankinfo.cardLimit || 'N/A'}</dd>
                </div>
              </dl>
            </section>
          )}

          {hasCreditCard === 'make' && (
            <section>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Bank Details</h3>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Card Number</dt>
                  <dd className="mt-1 text-sm text-gray-900">{bankinfo.creditCardNumber || 'N/A'}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Account Holder Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{bankinfo.accountHolderName || 'N/A'}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Bank Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{bankinfo.bankname || 'N/A'}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Account Number</dt>
                  <dd className="mt-1 text-sm text-gray-900">{bankinfo.accountNumber || 'N/A'}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Credit Card Limit</dt>
                  <dd className="mt-1 text-sm text-gray-900">{bankinfo.cardLimit || 'N/A'}</dd>
                </div>
              </dl>
            </section>
          )}

          {hasCreditCard === 'no' && (
            <section>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Guarantor Information</h3>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{granterPersonalDetails.name || 'N/A'}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Address</dt>
                  <dd className="mt-1 text-sm text-gray-900">{granterPersonalDetails.address || 'N/A'}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                  <dd className="mt-1 text-sm text-gray-900">{granterPersonalDetails.phone || 'N/A'}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Citizenship Number</dt>
                  <dd className="mt-1 text-sm text-gray-900">{granterPersonalDetails.nationalID || 'N/A'}</dd>
                </div>
              </dl>
            </section>
          )}

          <section>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Documents</h3>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Passport Photo</dt>
                <dd className="mt-1 text-sm text-gray-900">{files.citizenshipFile.ppphoto?.name || 'Not uploaded'}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Citizenship Front</dt>
                <dd className="mt-1 text-sm text-gray-900">{files.citizenshipFile.front?.name || 'Not uploaded'}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Citizenship Back</dt>
                <dd className="mt-1 text-sm text-gray-900">{files.citizenshipFile.back?.name || 'Not uploaded'}</dd>
              </div>
              {hasCreditCard === 'no' && (
                <>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Guarantor Passport Photo</dt>
                    <dd className="mt-1 text-sm text-gray-900">{files.granterDocument.ppphoto?.name || 'Not uploaded'}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Guarantor Citizenship Front</dt>
                    <dd className="mt-1 text-sm text-gray-900">{files.granterDocument.front?.name || 'Not uploaded'}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Guarantor Citizenship Back</dt>
                    <dd className="mt-1 text-sm text-gray-900">{files.granterDocument.back?.name || 'Not uploaded'}</dd>
                  </div>
                </>
              )}
            </dl>
          </section>

          <section>
            <h3 className="text-lg font-medium text-gray-800 mb-2">EMI Calculation</h3>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Down Payment</dt>
                <dd className="mt-1 text-sm text-gray-900">Rs {emiCalculation.downPayment || 0}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Monthly EMI</dt>
                <dd className="mt-1 text-sm text-gray-900">Rs {emiData.monthlyEMI.toFixed(2)}</dd>
              </div>
            </dl>
          </section>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => console.log('Submit:', emiContextInfo)}
              className="px-8 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto flex gap-8">
        {/* Left Sidebar */}
        <div className="w-80">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-gray-600 text-sm font-medium mb-4">Product Summary</h3>
            <div className="mb-1">
              <div className="relative aspect-square p-1 sm:p-2 w-full max-w-[280px] sm:max-w-[360px] mx-auto">
                <Image
                  src={product?.image || '/placeholder.png'}
                  alt={product?.name || 'Product'}
                  width={360}
                  height={360}
                  className="w-full h-full object-contain transition-transform duration-300 hover:scale-105 rounded-md"
                  priority
                />
              </div>
              <div className="text-gray-500 text-sm mb-1">{product?.name || 'N/A'}</div>
              <div className="text-2xl font-semibold text-blue-600">Rs {product?.price || 0}</div>
            </div>
            <div className="border-t pt-4">
              <h4 className="text-gray-700 font-medium mb-3">EMI Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly EMI from</span>
                  <span className="font-medium">Rs. {emiData.monthlyEMI.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tenure</span>
                  <span className="font-medium">9 months</span>
                </div>

              </div>
              <div className="mt-4 text-xs text-gray-500 space-y-1">
                <div>• Processing fee: 2% of loan amount</div>
                <div>• Documentation charges may apply</div>
                <div>• EMI amount may vary based on final approval</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentstep <= 0 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  1
                </div>
                <span className="ml-2 text-sm text-gray-600">Start</span>
              </div>
              <div className="flex-1 h-1 bg-yellow-400 mx-4"></div>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentstep >= 1 && currentstep < 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  2
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900">Details</span>
              </div>
              <div className="flex-1 h-1 bg-yellow-400 mx-4"></div>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentstep === 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  3
                </div>
                <span className="ml-2 text-sm text-gray-600">Submit</span>
              </div>
            </div>
          </div>

          {currentstep === 0 ? (
            <div className="bg-white rounded-lg items-center gap-4 mx-auto justify-center flex flex-col shadow-sm p-8 min-h-[400px] mb-4">

              {!NoCreditCard ? <>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Do you have Credit Card</h2>
                <div className="flex flex-row gap-4 justify-center w-full mx-auto">
                  <Button
                    onClick={() => handleOptionSelect('creditCard')}
                    className="flex items-center justify-center cursor-pointer gap-3 py-6 max-w-sm bg-[var(--colour-fsP2)] text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                  >
                    <div className='rounded-full border p-1 bg-white'>
                      <Image
                        src={creditcardicon}
                        alt='apply with credit card'
                        height={20}
                        width={20}
                      />
                    </div>
                    <span>Yes,I have Credit Card</span>
                  </Button>
                  <Button
                    onClick={() => setNoCreditCard(true)}
                    className="flex items-center justify-center gap-3 py-6 max-w-sm bg-[var(--colour-fsP1)] text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                  >
                    <div className='rounded-full border p-1 bg-white'>
                      <Image
                        src={downpaymenticon}
                        alt='down payment'
                        height={20}
                        width={20}
                      />
                    </div>
                    <span>No , I dont have Credit Card</span>
                  </Button>

                </div>
              </>
                :
                <div>
                  <div className='flex flex-row items-center justify-center mb-8 gap-3'>
                    <h2 className="text-2xl font-semibold text-gray-800 ">Choose an Option Card -</h2>
                    <button
                      onClick={() => setNoCreditCard(false)}
                      className="flex items-center justify-center cursor-pointer  max-w-sm  font-medium "
                    >
                      <div className='gap-3 flex-1'>
                        <Image
                          src={chnagecreditcard}
                          alt='Back'
                          height={70}
                          width={40}
                          priority
                        />
                      </div>
                      <span className=' text-gray-800'>Back </span>
                    </button>
                  </div>
                  <div className="flex flex-row gap-4 justify-center w-full mx-auto">
                    <Button
                      onClick={() => handleOptionSelect('creditCard')}
                      className="flex items-center justify-center cursor-pointer gap-3 py-6 max-w-sm bg-[var(--colour-fsP2)] text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                    >
                      <div className='rounded-full border p-1 bg-white'>
                        <Image
                          src={creditcardicon}
                          alt='apply with credit card'
                          height={20}
                          width={20}
                        />
                      </div>
                      <span>40 % Down Payment</span>
                    </Button>

                    <Button
                      onClick={() => handleOptionSelect('makeCard')}
                      className="flex items-center justify-center gap-3 py-6 max-w-sm bg-[var(--colour-fsP1)] text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                    >
                      <div className='rounded-full border p-1 bg-white'>
                        <Image
                          src={addcreditcard}
                          alt='make credit card'
                          height={20}
                          width={20}
                          priority
                        />
                      </div>
                      <span>Apply with citizen document</span>
                    </Button>
                  </div>
                </div>
              }

            </div>
          ) : currentstep === 3 ? (
            renderReview()
          ) : (
            currentFormSection && (
              <div className="bg-white rounded-lg shadow-sm p-8 mt-2">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">{currentFormSection.title}</h2>
                <div className="space-y-6">
                  {currentFormSection.fields.map((field, fieldIndex) => (
                    <div key={fieldIndex}>
                      {Array.isArray(field) ? (
                        <div className="grid grid-cols-2 gap-4">
                          {field.map((subField, subIndex) => (
                            <div key={subIndex}>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                {subField.label}
                                {subField.label.includes('Card Number') || subField.label.includes('Expiry Date') || subField.label.includes('Credit Card Limit') || subField.label.includes('Address') || subField.label.includes('Citizen Number') || subField.label.includes('Account Number') ? (
                                  <span className="ml-1 text-gray-400">ⓘ</span>
                                ) : null}
                              </label>
                              <input
                                type="text"
                                name={subField.name}
                                value={subField.value}
                                onChange={subField.onChange}
                                placeholder={subField.placeholder}
                                maxLength={subField.maxLength}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {field.label}
                            <span className="ml-1 text-gray-400">ⓘ</span>
                          </label>
                          <input
                            type="text"
                            name={field.name}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder={field.placeholder}
                            maxLength={field.maxLength}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                  {currentFormSection.additionalContent}
                  <div className="flex justify-end space-x-4 pt-6">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleContinue}
                      className="px-8 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default ApplyEmiProcess