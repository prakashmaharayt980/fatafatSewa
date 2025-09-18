'use client'

import React, { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import { Upload, Eye, Pencil, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import creditcardicon from '../../../../public/svgfile/creditcardicon.svg';
import downpaymenticon from '../../../../public/svgfile/payementiconcash.svg';
import addcreditcard from '../../../../public/svgfile/creditcardplus.svg';
import chnagecreditcard from '../../../../public/svgfile/creditcardchnage.png';
import bankIcon from '../../../../public/svgfile/bankicon.png';
import { useContextEmi } from '../emiContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import CreditCard from './RenderCreditCard';


const ApplyEmiProcess = () => {
  const { emiContextInfo, setEmiContextInfo, AvailablebankProvider } = useContextEmi();
  const [NoCreditCard, setNoCreditCard] = useState(false);
  const [currentstep, setcurrentstep] = useState(0);
  const product = emiContextInfo.product;
  const [previews, setPreviews] = useState({});

  useEffect(() => {
    const newPreviews = {};
    const files = emiContextInfo.files;
    ['citizenshipFile', 'granterDocument'].forEach((docGroup) => {
      Object.keys(files[docGroup]).forEach((key) => {
        const file = files[docGroup][key];
        if (file) {
          const previewKey = `${docGroup === 'granterDocument' ? 'granter' : 'citizenship'}-${key}`;
          newPreviews[previewKey] = URL.createObjectURL(file);
        }
      });
    });
    if (files.bankStatement) newPreviews.bankStatement = URL.createObjectURL(files.bankStatement);
    if (files.userSignature) newPreviews.userSignature = URL.createObjectURL(files.userSignature);
    setPreviews(newPreviews);

    return () => {
      Object.values(newPreviews).forEach(URL.revokeObjectURL);
    };
  }, [emiContextInfo.files]);

  const handleInputChange = (e, section) => {
    const { name, value } = e.target;
    setEmiContextInfo((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value,
      },
    }));
  };

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setEmiContextInfo((prev) => ({
      ...prev,
      bankinfo: {
        ...prev.bankinfo,
        creditCardNumber: formatted,
      },
    }));
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2, 4);
    setEmiContextInfo((prev) => ({
      ...prev,
      bankinfo: {
        ...prev.bankinfo,
        expiryDate: value,
      },
    }));
  };

  const handleDobChange = (e, section) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4) + '-' + value.slice(4);
    if (value.length > 7) value = value.slice(0, 7) + '-' + value.slice(7, 9);
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (value.length === 10 && !regex.test(value)) {
      return; // Prevent invalid date format
    }
    setEmiContextInfo((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        dob: value,
      },
    }));
  };

  const handleBankSelect = (section, name, value) => {
    setEmiContextInfo((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value,
      },
      interestRate: AvailablebankProvider.find((b) => b.name === value)?.rate || 10,
    }));
  };

  const handleFileChange = (e, docType, isGranter = false) => {
    const file = e.target.files[0];
    if (!file) return;
    if (docType === 'userSignature') {
      setEmiContextInfo((prev) => ({
        ...prev,
        files: {
          ...prev.files,
          userSignature: file,
        },
      }));
    } else if (docType === 'bankStatement') {
      setEmiContextInfo((prev) => ({
        ...prev,
        files: {
          ...prev.files,
          bankStatement: file,
        },
      }));
    } else {
      setEmiContextInfo((prev) => ({
        ...prev,
        files: {
          ...prev.files,
          [isGranter ? 'granterDocument' : 'citizenshipFile']: {
            ...prev.files[isGranter ? 'granterDocument' : 'citizenshipFile'],
            [docType]: file,
          },
        },
      }));
    }
  };

  const handleContinue = () => {
    setcurrentstep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setcurrentstep((prev) => Math.max(prev - 1, 0));
  };

  const handleOptionSelect = (option) => {
    setEmiContextInfo((prev) => ({
      ...prev,
      hasCreditCard: option === 'creditCard' ? 'yes' : option === 'makeCard' ? 'make' : 'no',
      emiCalculation: {
        ...prev.emiCalculation,
        downPayment: option === 'downPayment' ? 40 : 0,
      },
    }));
    setcurrentstep(1);
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
    const monthlyRate = (emiContextInfo.interestRate || 10) / 100 / 12;
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
  }, [product?.price, emiContextInfo.emiCalculation.downPayment, emiContextInfo.interestRate]);

  const formSections = {
    creditCard: [
      {
        title: "Credit Card Details",
        sectionKey: "bankinfo",
        step: 1,
        fields: [

          {
            label: "Card Holder Name",
            name: "cardHolderName",
            value: emiContextInfo.bankinfo.cardHolderName || '',
            onChange: (e) => handleInputChange(e, "bankinfo"),
            placeholder: "Card Holder Name",
          },

          [
            {
              label: "Bank Name",
              name: "creditCardProvider",
              value: emiContextInfo.bankinfo.creditCardProvider || '',
              onChange: (e) => handleBankSelect("bankinfo", "creditCardProvider", e.target.value),
              type: "select",
            },

            {
              label: "Card Number",
              name: "creditCardNumber",
              value: emiContextInfo.bankinfo.creditCardNumber || '',
              onChange: handleCardNumberChange,
              placeholder: "1234 5678 9012 3456",
              maxLength: 19,
            },

          ],
          [
            {
              label: "Expiry Date",
              name: "expiryDate",
              value: emiContextInfo.bankinfo.expiryDate || '',
              onChange: handleExpiryChange,
              placeholder: "MM/YY",
              maxLength: 5,
            },
            {
              label: "Credit Card Limit",
              name: "cardLimit",
              value: emiContextInfo.bankinfo.cardLimit || '',
              onChange: (e) => handleInputChange(e, "bankinfo"),
              placeholder: "Enter card limit",
            },
          ],
        ],
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
            placeholder: " user name ",
            maxLength: 50,
          },
          [
            {
              label: "Email",
              name: "email",
              value: emiContextInfo.userInfo.email || '',
              onChange: (e) => handleInputChange(e, "userInfo"),
              placeholder: " email",
            },
            {
              label: "Phone Number",
              name: "phone",
              value: emiContextInfo.userInfo.phone || '',
              onChange: (e) => handleInputChange(e, "userInfo"),
              placeholder: "Enter phone number",
            },
          ],
          [
            {
              label: "Date of Birth",
              name: "dob",
              value: emiContextInfo.userInfo.dob || '',
              onChange: (e) => handleDobChange(e, "userInfo"),
              placeholder: "YYYY-MM-DD",
              maxLength: 10,
            },
            {
              label: "Salary Amount",
              name: "salaryAmount",
              value: emiContextInfo.userInfo.salaryAmount || '',
              onChange: (e) => handleInputChange(e, "userInfo"),
              placeholder: "Enter salary amount",
            },
          ],
          [
            {
              label: "Marriage Status",
              name: "marriageStatus",
              value: emiContextInfo.userInfo.marriageStatus || '',
              onChange: (e) => handleInputChange(e, "userInfo"),
              type: "select",
              options: ['Single', 'Married', 'Divorced', 'Widowed'],
            },
            {
              label: "Gender",
              name: " gender",
              value: emiContextInfo.userInfo.gender || '',
              onChange: (e) => handleInputChange(e, "userInfo"),
              type: "select",
              options: ['Male', 'Female', 'Other'],
            },
          ],
          [
            {
              label: "Address",
              name: "address",
              value: emiContextInfo.userInfo.address || '',
              onChange: (e) => handleInputChange(e, "userInfo"),
              placeholder: "Enter address",
              maxLength: 100,
            },
            {
              label: "National ID Number",
              name: "nationalID",
              value: emiContextInfo.userInfo.nationalID || '',
              onChange: (e) => handleInputChange(e, "userInfo"),
              placeholder: "Enter citizen number",
            },
          ],
        ],
      },
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
            placeholder: " Enter user Name",
            maxLength: 50,
          },
          [
            {
              label: "Email",
              name: "email",
              value: emiContextInfo.userInfo.email || '',
              onChange: (e) => handleInputChange(e, "userInfo"),
              placeholder: " Enter user email",
            },
            {
              label: "Phone Number",
              name: "phone",
              value: emiContextInfo.userInfo.phone || '',
              onChange: (e) => handleInputChange(e, "userInfo"),
              placeholder: " Enter phone number",
            },
          ],
          [
            {
              label: "Date of Birth",
              name: "dob",
              value: emiContextInfo.userInfo.dob || '',
              onChange: (e) => handleDobChange(e, "userInfo"),
              placeholder: "YYYY-MM-DD",
              maxLength: 10,
            },
            {
              label: "Salary Amount",
              name: "salaryAmount",
              value: emiContextInfo.userInfo.salaryAmount || '',
              onChange: (e) => handleInputChange(e, "userInfo"),
              placeholder: "Enter salary amount",
            },
          ],
          [
            {
              label: "Marriage Status",
              name: "marriageStatus",
              value: emiContextInfo.userInfo.marriageStatus || '',
              onChange: (e) => handleInputChange(e, "userInfo"),
              type: "select",
              options: ['Single', 'Married', 'Divorced', 'Widowed'],
            },
            {
              label: "Gender",
              name: "gender",
              value: emiContextInfo.userInfo.gender || '',
              onChange: (e) => handleInputChange(e, "userInfo"),
              type: "select",
              options: ['Male', 'Female', 'Other'],
            },
          ],
          [
            {
              label: "Address",
              name: "address",
              value: emiContextInfo.userInfo.address || '',
              onChange: (e) => handleInputChange(e, "userInfo"),
              placeholder: "Enter address",
              maxLength: 100,
            },
            {
              label: "National ID Number",
              name: "nationalID",
              value: emiContextInfo.userInfo.nationalID || '',
              onChange: (e) => handleInputChange(e, "userInfo"),
              placeholder: "Enter citizen number",
            },
          ],
        ],
        additionalContent: (
          <div>
            <div className="mb-6 p-4 bg-blue-100 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Down Payment Amount</h3>
              <p className="text-2xl font-bold text-blue-600">Rs {emiData.downPayment.toFixed(2)}</p>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Required Documents</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {['ppphoto', 'front', 'back', 'bankStatement'].map((docType) => {
                const isBankStatement = docType === 'bankStatement';
                const file = isBankStatement ? emiContextInfo.files.bankStatement : emiContextInfo.files.citizenshipFile[docType];
                const label = isBankStatement ? 'Bank Statement' : docType === 'ppphoto' ? 'Passport Photo' : `Citizenship ${docType.charAt(0).toUpperCase() + docType.slice(1)}`;
                const previewKey = isBankStatement ? 'bankStatement' : `citizenship-${docType}`;
                return (
                  <div key={docType} className="relative group text-center">
                    <input
                      type="file"
                      id={previewKey}
                      onChange={(e) => handleFileChange(e, docType)}
                      className="hidden"
                    />
                    <label htmlFor={previewKey} className="cursor-pointer block">
                      {file ? (
                        <div className="h-40 flex items-center justify-center">
                          <Image
                            src={previews[previewKey]}
                            alt={label}
                            width={200}
                            height={200}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="rounded mx-auto group-hover:opacity-70 transition-opacity max-h-40 object-contain"
                            priority={docType === 'ppphoto'}
                          />
                        </div>
                      ) : (
                        <div className="h-40 flex items-center justify-center bg-gray-100 rounded border-2 border-dashed border-gray-300 mx-auto">
                          <Upload className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </label>
                    <p className="text-base font-medium text-gray-700 mt-2">{label}</p>
                    {file && (
                      <div className="absolute w-full inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="text-blue-600 hover:text-blue-800 mr-4">
                              <Eye size={24} />
                            </Button>

                          </DialogTrigger>
                          <DialogContent className="w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] p-0 border-none bg-transparent">
                            <div className="relative w-full h-auto max-h-[80vh] rounded-lg overflow-hidden shadow-2xl">
                              <Image
                                src={previews[previewKey]}
                                alt={label}
                                width={1200}
                                height={800}
                                sizes="100vw"
                                className="w-full h-auto object-contain rounded-lg"
                                priority
                                quality={100}
                              />
                            </div>

                          </DialogContent>
                          <Label htmlFor={previewKey} className="cursor-pointer text-blue-600 hover:text-blue-800">
                            <Pencil size={20} />
                          </Label>
                        </Dialog>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ),
      },
      {
        title: "Guarantor Information",
        sectionKey: "granterPersonalDetails",
        step: 2,
        fields: [
          {
            label: "Guarantors Full Name",
            name: "name",
            value: emiContextInfo.granterPersonalDetails.name || '',
            onChange: (e) => handleInputChange(e, "granterPersonalDetails"),
            placeholder: " Enter Gurantor name",
          },
          [
            {
              label: "Marriage Status",
              name: "marriageStatus",
              value: emiContextInfo.granterPersonalDetails.marriageStatus || '',
              onChange: (e) => handleInputChange(e, "granterPersonalDetails"),
              type: "select",
              options: ['Single', 'Married', 'Divorced', 'Widowed'],
            },
            {
              label: "Gender",
              name: "gender",
              value: emiContextInfo.granterPersonalDetails.gender || '',
              onChange: (e) => handleInputChange(e, "granterPersonalDetails"),
              type: "select",
              options: ['Male', 'Female', 'Other'],
            },
          ],
          [
            {
              label: "Phone Number",
              name: "phone",
              value: emiContextInfo.granterPersonalDetails.phone || '',
              onChange: (e) => handleInputChange(e, "granterPersonalDetails"),
              placeholder: "Enter Phone Number",
            },
            {
              label: "Citizenship Number",
              name: "nationalID",
              value: emiContextInfo.granterPersonalDetails.nationalID || '',
              onChange: (e) => handleInputChange(e, "granterPersonalDetails"),
              placeholder: "Enter citizenship number",
            },
          ],
          {
            label: "Address",
            name: "address",
            value: emiContextInfo.granterPersonalDetails.address || '',
            onChange: (e) => handleInputChange(e, "granterPersonalDetails"),
            placeholder: " Enter Address",
            maxLength: 100,
          },
        ],
        additionalContent: (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Required Documents</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {['ppphoto', 'front', 'back'].map((docType) => {
                const file = emiContextInfo.files.granterDocument[docType];
                const label = docType === 'ppphoto' ? 'Passport Photo' : `Citizenship ${docType.charAt(0).toUpperCase() + docType.slice(1)}`;
                const previewKey = `granter-${docType}`;
                return (
                  <div key={docType} className="relative group text-center">
                    <input
                      type="file"
                      id={previewKey}
                      onChange={(e) => handleFileChange(e, docType, true)}
                      className="hidden"
                    />
                    <label htmlFor={previewKey} className="cursor-pointer block">
                      {file ? (
                        <div className="h-40 flex items-center justify-center">
                          <Image
                            src={previews[previewKey]}
                            alt={label}
                            width={150}
                            height={150}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="rounded mx-auto group-hover:opacity-70 transition-opacity max-h-40 object-contain"
                            priority={docType === 'ppphoto'}
                          />
                        </div>
                      ) : (
                        <div className="h-40 flex items-center justify-center bg-gray-100 rounded border-2 border-dashed border-gray-300 mx-auto">
                          <Upload className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </label>
                    <p className="text-base font-medium text-gray-700 mt-2">{label}</p>
                    {file && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Dialog>
                          <DialogTrigger asChild>
                            <button className="text-blue-600 hover:text-blue-800 mr-4">
                              <Eye size={24} />
                            </button>

                          </DialogTrigger>
                          <DialogContent className="w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] p-0 border-none bg-transparent">
                            <div className="relative w-full h-auto max-h-[80vh] rounded-lg overflow-hidden shadow-2xl">
                              <Image
                                src={previews[previewKey]}
                                alt={label}
                                width={1200}
                                height={800}
                                sizes="100vw"
                                className="w-full h-auto object-contain rounded-lg"
                                priority
                                quality={100}
                              />
                            </div>

                          </DialogContent>
                          <label htmlFor={previewKey} className="cursor-pointer text-blue-600 hover:text-blue-800">
                            <Pencil size={20} />
                          </label>
                        </Dialog>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ),
      },
    ],
    makeCard: [
      {
        title: "Personal and Bank Details",
        sectionKey: "bankinfo",
        step: 1,
        fields: [

          [
            {
              label: "Date of Birth",
              name: "dob",
              value: emiContextInfo.bankinfo.dob || '',
              onChange: (e) => handleDobChange(e, "bankinfo"),
              placeholder: "YYYY-MM-DD",
              maxLength: 10,
            },
            {
              label: "Salary Amount",
              name: "salaryAmount",
              value: emiContextInfo.bankinfo.salaryAmount || '',
              onChange: (e) => handleInputChange(e, "bankinfo"),
              placeholder: "Enter salary amount",
            },
          ],
          [
            {
              label: "Marriage Status",
              name: "marriageStatus",
              value: emiContextInfo.bankinfo.marriageStatus || '',
              onChange: (e) => handleInputChange(e, "bankinfo"),
              type: "select",
              options: ['Single', 'Married', 'Divorced', 'Widowed'],
            },
            {
              label: "Gender",
              name: "gender",
              value: emiContextInfo.bankinfo.gender || '',
              onChange: (e) => handleInputChange(e, "bankinfo"),
              type: "select",
              options: ['Male', 'Female', 'Other'],
            },
          ],
          [
            {
              label: "Bank Name",
              name: "bankname",
              value: emiContextInfo.bankinfo.bankname || '',
              onChange: (e) => handleBankSelect("bankinfo", "bankname", e.target.value),
              type: "select",
            },
            {
              label: "Account Number",
              name: "accountNumber",
              value: emiContextInfo.bankinfo.accountNumber || '',
              onChange: (e) => handleInputChange(e, "bankinfo"),
              placeholder: "Enter account number",
            },
          ],
        ],
      },
      {
        title: "Citizenship Documents",
        sectionKey: "files",
        step: 2,
        fields: [],
        additionalContent: (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Required Documents</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {['ppphoto', 'front', 'back', 'bankStatement'].map((docType) => {
                const isBankStatement = docType === 'bankStatement';
                const file = isBankStatement ? emiContextInfo.files.bankStatement : emiContextInfo.files.citizenshipFile[docType];
                const label = isBankStatement ? 'Bank Statement' : docType === 'ppphoto' ? 'Passport Photo' : `Citizenship ${docType.charAt(0).toUpperCase() + docType.slice(1)}`;
                const previewKey = isBankStatement ? 'bankStatement' : `citizenship-${docType}`;
                return (
                  <div key={docType} className="relative group text-center">
                    <input
                      type="file"
                      id={previewKey}
                      onChange={(e) => handleFileChange(e, docType)}
                      className="hidden"
                    />
                    <label htmlFor={previewKey} className="cursor-pointer block">
                      {file ? (
                        <div className="h-40 flex items-center justify-center">
                          <Image
                            src={previews[previewKey]}
                            alt={label}
                            width={150}
                            height={150}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="rounded mx-auto group-hover:opacity-70 transition-opacity max-h-40 object-contain"
                            priority={docType === 'ppphoto'}
                          />
                        </div>
                      ) : (
                        <div className="h-40 flex items-center justify-center bg-gray-100 rounded border-2 border-dashed border-gray-300 mx-auto">
                          <Upload className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </label>
                    <p className="text-base font-medium text-gray-700 mt-2">{label}</p>
                    {file && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Dialog>
                          <DialogTrigger asChild>
                            <button className="text-blue-600 hover:text-blue-800 mr-4">
                              <Eye size={24} />
                            </button>

                          </DialogTrigger>
                          <DialogContent className="w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] p-0 border-none bg-transparent">
                            <div className="relative w-full h-auto max-h-[80vh] rounded-lg overflow-hidden shadow-2xl">
                              <Image
                                src={previews[previewKey]}
                                alt={label}
                                width={1200}
                                height={800}
                                sizes="100vw"
                                className="w-full h-auto object-contain rounded-lg"
                                priority
                                quality={100}
                              />
                            </div>

                          </DialogContent>
                          <label htmlFor={previewKey} className="cursor-pointer text-blue-600 hover:text-blue-800">
                            <Pencil size={20} />
                          </label>
                        </Dialog>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ),
      },
    ],
  };

  const selectedOption = emiContextInfo.hasCreditCard === 'yes' ? 'creditCard' : emiContextInfo.hasCreditCard === 'make' ? 'makeCard' : 'downPayment';
  const currentFormSection = currentstep > 0 && currentstep < 3 ? formSections[selectedOption]?.find((section) => section.step === currentstep) : null;

  const renderReview = () => {
    const { userInfo, bankinfo, granterPersonalDetails, files, hasCreditCard, emiCalculation } = emiContextInfo;

    return (
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-8 mt-2">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">Review Your Information</h2>
        <div className="space-y-8 p-4 md:p-6 rounded-lg text-base font-sans">
          <section>
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">User Information</h3>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm md:text-base text-gray-900">{userInfo.name || 'N/A'}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm md:text-base text-gray-900">{userInfo.email || 'N/A'}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                <dd className="mt-1 text-sm md:text-base text-gray-900">{userInfo.phone || 'N/A'}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                <dd className="mt-1 text-sm md:text-base text-gray-900">{userInfo.dob || 'N/A'}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Salary Amount</dt>
                <dd className="mt-1 text-sm md:text-base text-gray-900">{userInfo.salaryAmount || 'N/A'}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Marriage Status</dt>
                <dd className="mt-1 text-sm md:text-base text-gray-900">{userInfo.marriageStatus || 'N/A'}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Gender</dt>
                <dd className="mt-1 text-sm md:text-base text-gray-900">{userInfo.gender || 'N/A'}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="mt-1 text-sm md:text-base text-gray-900">{userInfo.address || 'N/A'}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">National ID Number</dt>
                <dd className="mt-1 text-sm md:text-base text-gray-900">{userInfo.nationalID || 'N/A'}</dd>
              </div>
            </dl>
          </section>

          {hasCreditCard === 'yes' && (
            <section>
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Credit Card Details</h3>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Card Number</dt>
                  <dd className="mt-1 text-sm md:text-base text-gray-900">{bankinfo.creditCardNumber || 'N/A'}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Card Holder Name</dt>
                  <dd className="mt-1 text-sm md:text-base text-gray-900">{bankinfo.cardHolderName || 'N/A'}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Card Provider</dt>
                  <dd className="mt-1 text-sm md:text-base text-gray-900">{bankinfo.creditCardProvider || 'N/A'}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Expiry Date</dt>
                  <dd className="mt-1 text-sm md:text-base text-gray-900">{bankinfo.expiryDate || 'N/A'}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Credit Card Limit</dt>
                  <dd className="mt-1 text-sm md:text-base text-gray-900">{bankinfo.cardLimit || 'N/A'}</dd>
                </div>
              </dl>
            </section>
          )}

          {hasCreditCard === 'make' && (
            <section>
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Bank Details</h3>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">User Name</dt>
                  <dd className="mt-1 text-sm md:text-base text-gray-900">{bankinfo.accountHolderName || 'N/A'}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                  <dd className="mt-1 text-sm md:text-base text-gray-900">{bankinfo.dob || 'N/A'}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Salary Amount</dt>
                  <dd className="mt-1 text-sm md:text-base text-gray-900">{bankinfo.salaryAmount || 'N/A'}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Bank Name</dt>
                  <dd className="mt-1 text-sm md:text-base text-gray-900">{bankinfo.bankname || 'N/A'}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Account Number</dt>
                  <dd className="mt-1 text-sm md:text-base text-gray-900">{bankinfo.accountNumber || 'N/A'}</dd>
                </div>
              </dl>
            </section>
          )}

          {hasCreditCard === 'no' && (
            <section>
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Guarantor Information</h3>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm md:text-base text-gray-900">{granterPersonalDetails.name || 'N/A'}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Marriage Status</dt>
                  <dd className="mt-1 text-sm md:text-base text-gray-900">{granterPersonalDetails.marriageStatus || 'N/A'}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Gender</dt>
                  <dd className="mt-1 text-sm md:text-base text-gray-900">{granterPersonalDetails.gender || 'N/A'}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                  <dd className="mt-1 text-sm md:text-base text-gray-900">{granterPersonalDetails.phone || 'N/A'}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Citizenship Number</dt>
                  <dd className="mt-1 text-sm md:text-base text-gray-900">{granterPersonalDetails.nationalID || 'N/A'}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Address</dt>
                  <dd className="mt-1 text-sm md:text-base text-gray-900">{granterPersonalDetails.address || 'N/A'}</dd>
                </div>
              </dl>
            </section>
          )}

          <section>
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['ppphoto', 'front', 'back', 'bankStatement'].map((docType) => {
                const isBankStatement = docType === 'bankStatement';
                const file = isBankStatement ? files.bankStatement : files.citizenshipFile[docType];
                const label = isBankStatement ? 'Bank Statement' : docType === 'ppphoto' ? 'Passport Photo' : `Citizenship ${docType.charAt(0).toUpperCase() + docType.slice(1)}`;
                const previewKey = isBankStatement ? 'bankStatement' : `citizenship-${docType}`;
                return (
                  <div key={docType} className="text-center">
                    <dt className="text-sm font-medium text-gray-500 mb-2">{label}</dt>
                    {file ? (
                      <div className="h-40 flex items-center justify-center">
                        <Image
                          src={previews[previewKey]}
                          alt={label}
                          width={150}
                          height={150}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="max-h-40 object-contain mx-auto"
                          priority={docType === 'ppphoto'}
                        />
                      </div>
                    ) : (
                      <p className="text-sm md:text-base text-gray-900">Not uploaded</p>
                    )}
                  </div>
                );
              })}
            </div>
            {hasCreditCard === 'no' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {['ppphoto', 'front', 'back'].map((docType) => {
                  const file = files.granterDocument[docType];
                  const label = `Guarantor ${docType === 'ppphoto' ? 'Passport Photo' : `Citizenship ${docType.charAt(0).toUpperCase() + docType.slice(1)}`}`;
                  const previewKey = `granter-${docType}`;
                  return (
                    <div key={docType} className="text-center">
                      <dt className="text-sm font-medium text-gray-500 mb-2">{label}</dt>
                      {file ? (
                        <div className="h-40 flex items-center justify-center">
                          <Image
                            src={previews[previewKey]}
                            alt={label}
                            width={150}
                            height={150}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="max-h-40 object-contain mx-auto"
                            priority={docType === 'ppphoto'}
                          />
                        </div>
                      ) : (
                        <p className="text-sm md:text-base text-gray-900">Not uploaded</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="pb-4">
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">EMI Calculation</h3>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Down Payment</dt>
                <dd className="mt-1 text-sm md:text-base text-gray-900">Rs {emiCalculation.downPayment || 0}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Monthly EMI</dt>
                <dd className="mt-1 text-sm md:text-base text-gray-900">Rs {emiData.monthlyEMI.toFixed(2)}</dd>
              </div>
            </dl>
          </section>

          <section className="text-right mt-8">
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 text-left">Signature</h3>
            <div className="relative group inline-block max-w-xs">
              <input
                type="file"
                id="userSignature"
                onChange={(e) => handleFileChange(e, 'userSignature')}
                className="hidden"
              />
              <label htmlFor="userSignature" className="cursor-pointer block">
                {files.userSignature ? (
                  <div className="h-20 flex items-center justify-end">
                    <Image
                      src={previews.userSignature}
                      alt="User Signature"
                      width={150}
                      height={75}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="max-h-20 object-contain group-hover:opacity-70 transition-opacity"
                    />
                  </div>
                ) : (
                  <div className="h-20 flex items-center justify-center bg-gray-100 rounded border-2 border-dashed border-gray-300 w-40 ml-auto">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </label>
              {files.userSignature && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="text-blue-600 hover:text-blue-800 mr-4">
                        <Eye size={24} />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <Image
                        src={previews.userSignature}
                        alt="User Signature"
                        width={600}
                        height={300}
                        className="w-full h-auto rounded"
                        priority
                      />
                    </DialogContent>
                  </Dialog>
                  <label htmlFor="userSignature" className="cursor-pointer text-blue-600 hover:text-blue-800">
                    <Pencil size={24} />
                  </label>
                </div>
              )}
            </div>
          </section>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors text-base font-medium"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => console.log('Submit:', emiContextInfo)}
              className="px-8 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-base"
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
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Left Sidebar */}
        <div className="w-full md:w-80">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-gray-600 text-sm font-medium mb-4">Product Summary</h3>
            <div className="mb-1">
              <div className="relative aspect-square p-1 sm:p-2 w-full max-w-[280px] sm:max-w-[360px] mx-auto">
                <Image
                  src={product?.image || '/placeholder.png'}
                  alt={product?.name || 'Product'}
                  width={360}
                  height={360}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
            <div className="flex items-center space-x-4 md:space-x-8">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentstep <= 0 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  1
                </div>
                <span className="ml-2 text-sm text-gray-600 hidden md:block">Start</span>
              </div>
              <div className="flex-1 h-1 bg-yellow-400 mx-2 md:mx-4"></div>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentstep >= 1 && currentstep < 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  2
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900 hidden md:block">Details</span>
              </div>
              <div className="flex-1 h-1 bg-yellow-400 mx-2 md:mx-4"></div>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentstep === 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  3
                </div>
                <span className="ml-2 text-sm text-gray-600 hidden md:block">Submit</span>
              </div>
            </div>
          </div>

          {currentstep === 0 ? (
            <div className="bg-white rounded-lg items-center gap-4 mx-auto justify-center flex flex-col shadow-sm p-4 md:p-8 min-h-[400px] mb-4">
              {!NoCreditCard ? (
                <>
                  <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Do you have Credit Card</h2>
                  <div className="flex flex-col md:flex-row gap-4 justify-center w-full mx-auto">
                    <Button
                      onClick={() => handleOptionSelect('creditCard')}
                      className="flex items-center justify-center cursor-pointer gap-3 py-6 max-w-sm bg-[var(--colour-fsP2)] text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                    >
                      <div className="rounded-full border p-1 bg-white">
                        <Image src={creditcardicon} alt="apply with credit card" height={20} width={20} />
                      </div>
                      <span>Yes, I have Credit Card</span>
                    </Button>
                    <Button
                      onClick={() => setNoCreditCard(true)}
                      className="flex items-center justify-center gap-3 py-6 max-w-sm bg-[var(--colour-fsP1)] text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                    >
                      <div className="rounded-full border p-1 bg-white">
                        <Image src={downpaymenticon} alt="down payment" height={20} width={20} />
                      </div>
                      <span>No, I dont have Credit Card</span>
                    </Button>
                  </div>
                </>
              ) : (
                <div>
                  <div className="flex flex-row items-center justify-center mb-8 gap-3">
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-800 ">Choose an Option -</h2>
                    <button
                      onClick={() => setNoCreditCard(false)}
                      className="flex items-center justify-center cursor-pointer max-w-sm font-medium"
                    >
                      <div className="gap-3 flex-1">
                        <Image src={chnagecreditcard} alt="Back" height={70} width={40} priority />
                      </div>
                      <span className="text-gray-800">Back</span>
                    </button>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4 justify-center w-full mx-auto">
                    <Button
                      onClick={() => handleOptionSelect('downPayment')}
                      className="flex items-center justify-center cursor-pointer gap-3 py-6 max-w-sm bg-[var(--colour-fsP2)] text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                    >
                      <div className="rounded-full border p-1 bg-white">
                        <Image src={downpaymenticon} alt="down payment" height={20} width={20} />
                      </div>
                      <span>40 % Down Payment</span>
                    </Button>
                    <Button
                      onClick={() => handleOptionSelect('makeCard')}
                      className="flex items-center justify-center gap-3 py-6 max-w-sm bg-[var(--colour-fsP1)] text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                    >
                      <div className="rounded-full border p-1 bg-white">
                        <Image src={addcreditcard} alt="make credit card" height={20} width={20} priority />
                      </div>
                      <span>Apply with citizen document</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : currentstep === 3 ? (
            renderReview()
          ) : (
            currentFormSection && (
              <div className="bg-white rounded-lg shadow-sm p-4 md:p-8 mt-2">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">{currentFormSection.title}</h2>
                <div className="space-y-6 text-base font-sans">
                  <div className='flex flex-row'>
                    <div className='credit card'>
                      <Image src="/svgfile/creditCardUi.svg" alt="make credit card" height={500} width={400} priority />
                    </div>
                    {currentFormSection.fields.map((field, fieldIndex) => (
                      <div key={fieldIndex}>




                        {Array.isArray(field) ? (
                          <div className="  gap-4">
                            {field.map((subField, subIndex) => (
                              <div key={subIndex}>
                                <Label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                                  {subField.label}
                                  {subField.label.includes('Card Number') ||
                                    subField.label.includes('Expiry Date') ||
                                    subField.label.includes('Credit Card Limit') ||
                                    subField.label.includes('Address') ||
                                    subField.label.includes('Citizen Number') ||
                                    subField.label.includes('Account Number') ||
                                    subField.label.includes('Date of Birth') ? (
                                    <span className="ml-1 text-gray-400">ⓘ</span>
                                  ) : null}
                                </Label>
                                {subField.type === 'select' ? (


                                  <Select value={subField.value} onValueChange={(value) => subField.onChange({ target: { value } })}>
                                    <SelectTrigger
                                      className=" w-full  px-4  py-2.5  text-base  font-sans  font-medium  text-gray-900  bg-white  border  border-gray-200  rounded-lg    transition-all  duration-200 "
                                    >
                                      <SelectValue
                                        placeholder={
                                          <span className=" text-base">{`Select ${subField.label}`}</span>
                                        }
                                      />
                                    </SelectTrigger>
                                    <SelectContent
                                      className=" bg-white   border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto z-[1000] font-sans text-base "
                                    >
                                      {subField.options ? (
                                        subField.options.map((option) => (
                                          <SelectItem
                                            key={option}
                                            value={option}
                                            className=" px-4  py-2  cursor-pointer  hover:bg-blue-50  hover:text-blue-700  focus:bg-blue-100  focus:text-blue-700  transition-colors  duration-150"
                                          >
                                            {option}
                                          </SelectItem>
                                        ))
                                      ) : (
                                        AvailablebankProvider.map((bank) => (
                                          <SelectItem
                                            key={bank.id}
                                            value={bank.name}
                                            className=" px-4  py-2  cursor-pointer  hover:bg-blue-50  hover:text-blue-700  focus:bg-blue-100  focus:text-blue-700  transition-colors  duration-150"
                                          >
                                            {bank.name}
                                          </SelectItem>
                                        ))
                                      )}
                                    </SelectContent>
                                  </Select>


                                ) : (


                                  <div className="relative">
                                    {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--colour-fsP2)]/60" /> */}
                                    <Image src={bankIcon} className="absolute  top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--colour-fsP2)]/60" alt="down payment" height={20} width={20} />

                                    <Input
                                      type="text"
                                      name={subField.name}
                                      value={subField.value}
                                      onChange={subField.onChange}
                                      placeholder={subField.placeholder}
                                      maxLength={subField.maxLength}
                                      className="w-full px-3 py-4 border-2 border-[var(--colour-fsP2)]/20 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-transparent text-base"
                                    />
                                  </div>

                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div>
                            <Label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                              {field.label}
                              <span className="ml-1 text-gray-400">ⓘ</span>
                            </Label>
                            <div className="relative">
                              {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--colour-fsP2)]/60" /> */}
                              <Image src={creditcardicon} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--colour-fsP2)]/60" alt="down payment" height={20} width={20} />

                              <Input
                                type="text"
                                name={field.name}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder={field.placeholder}
                                maxLength={field.maxLength}
                                className="w-full pl-10 pr-3 py-2 border-2 border-[var(--colour-fsP2)]/20 rounded-md text-[var(--colour-fsP2)]/60 font-medium font-mono focus:outline-none focus:ring-offset-transparent focus:ring-blue-200 focus:border-transparent text-2xl"
                              />
                            </div>
                          </div>
                        )}

                      </div>
                    ))}



                  </div>
                  {currentFormSection.additionalContent}
                  <div className="flex justify-end space-x-4 pt-6">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors text-base font-medium"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleContinue}
                      className="px-8 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-base"
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
};

export default ApplyEmiProcess;

update ui 
and make code in way of order format based on real likfe example 

like gender , then marrage status ,the based on value then input value 
in card also , bank 
ask user on what should ask first 


and i habe credit card if 

if credit card open then only show img else no need 

and also input filed with icon 

no need to change ui , but make layout well na dresponsive

