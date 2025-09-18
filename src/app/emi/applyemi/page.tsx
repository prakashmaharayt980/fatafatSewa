'use client'

import React, { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import { Upload, Eye, Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import creditcardicon from '../../../../public/svgfile/creditcardicon.svg';
import downpaymenticon from '../../../../public/svgfile/payementiconcash.svg';
import addcreditcard from '../../../../public/svgfile/creditcardplus.svg';
import chnagecreditcard from '../../../../public/svgfile/creditcardchnage.png';

import { useContextEmi } from '../emiContext';

import CreditCardComponent from './CreditCardform';
import BuyerPersonalInfo from './BuyerPersonalInfo';
import { Label } from '@/components/ui/label';
import RenderReview from './ReviewApplyEmiDoc';
// import CreditCard from './RenderCreditCard';

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

  const handleFileDelete = (docType, isGranter = false) => {
    setEmiContextInfo((prev) => {
      const newPreviews = { ...previews };
      const key = docType === 'bankStatement' ? 'bankStatement' : `${isGranter ? 'granter' : 'citizenship'}-${docType}`;
      delete newPreviews[key]; // Optionally revoke: URL.revokeObjectURL(previews[key]);
      return {
        ...prev,
        files: {
          ...prev.files,
          [docType === 'bankStatement' ? 'bankStatement' : isGranter ? 'granterDocument' : 'citizenshipFile']: {
            ...prev.files[docType === 'bankStatement' ? 'bankStatement' : isGranter ? 'granterDocument' : 'citizenshipFile'],
            [docType]: null,
          },
        },
      };
    });
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
          // Standard order: Card Number first, then Expiry, then Name, then Provider, then Limit
          {
            label: "Bank Name",
            name: "creditCardProvider",
            value: emiContextInfo.bankinfo.creditCardProvider,
            onChange: (e) => handleBankSelect("bankinfo", "creditCardProvider", e.target.value),
            type: "select",
            svgicon: '/svgfile/bank.svg',
            extenduserinfo: '',
          },
          {
            label: "Card Holder Name",
            name: "cardHolderName",
            value: emiContextInfo.bankinfo.cardHolderName,
            onChange: (e) => handleInputChange(e, "bankinfo"),
            placeholder: "Card Holder Name",
            svgicon: '/svgfile/menperson.svg',
            extenduserinfo: '',
          },
          {
            label: "Card Number",
            name: "creditCardNumber",
            value: emiContextInfo.bankinfo.creditCardNumber,
            onChange: handleCardNumberChange,
            placeholder: "1234 5678 9012 3456",
            maxLength: 19,
            svgicon: '/svgfile/creditcardicon.svg',
            extenduserinfo: '',
          },



          {
            label: "Expiry Date",
            name: "expiryDate",
            value: emiContextInfo.bankinfo.expiryDate,
            onChange: handleExpiryChange,
            placeholder: "MM/YY",
            maxLength: 5,
            svgicon: '/svgfile/creditcardicon.svg',
            extenduserinfo: '',
          },
          {
            label: " Card Limit",
            name: "cardLimit",
            value: emiContextInfo.bankinfo.cardLimit,
            onChange: (e) => handleInputChange(e, "bankinfo"),
            placeholder: "Card Limit",
            svgicon: '/svgfile/creditcardicon.svg',
            extenduserinfo: '',
          },



        ],
      },
      {
        title: "Personal Details",
        sectionKey: "userInfo",
        step: 2,
        fields: [
          // Standard order: Name, DOB, Gender, Marriage Status, Email, Phone, National ID, Address, Salary
          {
            label: "User Name",
            name: "name",
            value: emiContextInfo.userInfo.name,
            onChange: (e) => handleInputChange(e, "userInfo"),
            placeholder: "Enter user name",
            maxLength: 50,
            svgicon: '/svgfile/menperson.svg',
            extenduserinfo: '',
          },
          {
            label: "Email",
            name: "email",
            value: emiContextInfo.userInfo.email,
            onChange: (e) => handleInputChange(e, "userInfo"),
            placeholder: "Enter email",
            svgicon: '/svgfile/emailsvg.svg',
            extenduserinfo: '',
          },

          {
            label: "Gender",
            name: "gender",
            value: emiContextInfo.userInfo.gender,
            onChange: (e) => handleInputChange(e, "userInfo"),
            type: "select",
            options: ['Male', 'Female', 'Other'],
            svgicon: emiContextInfo.userInfo.gender === 'Male' ? '/svgfile/menperson.svg' : '/svgfile/creditcardicon.svg',
            extenduserinfo: '',
          },
          {
            label: "Marriage Status",
            name: "marriageStatus",
            value: emiContextInfo.userInfo.marriageStatus,
            onChange: (e) => handleInputChange(e, "userInfo"),
            type: "select",
            options: ['Single', 'Married', 'Divorced', 'Widowed'],
            svgicon: emiContextInfo.userInfo.gender === 'Male' ? '/svgfile/menperson.svg' : '/svgfile/creditcardicon.svg',
            extenduserinfo: '',
          },
          {
            label: emiContextInfo.userInfo.gender === "Male" ? "Wife Name" : "Husband Name",
            name: "userpartnerName",
            value: emiContextInfo.userInfo.userpartnerName,
            onChange: (e) => handleInputChange(e, "userInfo"),
            extenduserinfo: emiContextInfo.userInfo.marriageStatus === 'Single' ? 'hidden' : '',

            svgicon: emiContextInfo.userInfo.gender === 'Male' ? '/svgfile/menperson.svg' : '/svgfile/creditcardicon.svg',
          },

          {
            label: "Phone Number",
            name: "phone",
            value: emiContextInfo.userInfo.phone,
            onChange: (e) => handleInputChange(e, "userInfo"),
            placeholder: "Enter phone number",
            svgicon: '/svgfile/phoneIcon.png',
            extenduserinfo: '',
          },
          {
            label: "National ID Number",
            name: "nationalID",
            value: emiContextInfo.userInfo.nationalID,
            onChange: (e) => handleInputChange(e, "userInfo"),
            placeholder: "Enter national ID number",
            svgicon: '/svgfile/idcardicon2.png',
            extenduserinfo: '',
          },
          {
            label: "Address",
            name: "address",
            value: emiContextInfo.userInfo.address,
            onChange: (e) => handleInputChange(e, "userInfo"),
            placeholder: "Enter address",
            maxLength: 100,
            svgicon: '/svgfile/homeaddressicon.png',
            extenduserinfo: '',
          },
          {
            label: "Salary Amount",
            name: "salaryAmount",
            value: emiContextInfo.bankinfo.salaryAmount,
            onChange: (e) => handleInputChange(e, "bankinfo"),
            placeholder: "Enter salary amount",
            svgicon: '/svgfile/moneycashicon.png',
            extenduserinfo: '',
          },
        ],
      },
    ],
    downPayment: [
      {
        title: "Personal Details",
        sectionKey: "userInfo",
        step: 1,
        fields: [
          // Standard order: Name, DOB, Gender, Marriage Status, Email, Phone, National ID, Address, Salary
          {
            label: "User Name",
            name: "name",
            value: emiContextInfo.userInfo.name,
            onChange: (e) => handleInputChange(e, "userInfo"),
            placeholder: "Enter user name",
            maxLength: 50,
            svgicon: '/svgfile/menperson.svg',
            extenduserinfo: '',
          },
          {
            label: "Email",
            name: "email",
            value: emiContextInfo.userInfo.email,
            onChange: (e) => handleInputChange(e, "userInfo"),
            placeholder: "Enter email",
            svgicon: '/svgfile/emailsvg.svg',
            extenduserinfo: '',
          },

          {
            label: "Gender",
            name: "gender",
            value: emiContextInfo.userInfo.gender,
            onChange: (e) => handleInputChange(e, "userInfo"),
            type: "select",
            options: ['Male', 'Female', 'Other'],
            svgicon: emiContextInfo.userInfo.gender === 'Male' ? '/svgfile/menperson.svg' : '/svgfile/creditcardicon.svg',
            extenduserinfo: '',
          },
          {
            label: "Marriage Status",
            name: "marriageStatus",
            value: emiContextInfo.userInfo.marriageStatus,
            onChange: (e) => handleInputChange(e, "userInfo"),
            type: "select",
            options: ['Single', 'Married', 'Divorced', 'Widowed'],
            svgicon: emiContextInfo.userInfo.gender === 'Male' ? '/svgfile/menperson.svg' : '/svgfile/creditcardicon.svg',
            extenduserinfo: '',
          },
          {
            label: emiContextInfo.userInfo.gender === "Male" ? "Wife Name" : "Husband Name",
            name: "userpartnerName",
            value: emiContextInfo.userInfo.userpartnerName,
            onChange: (e) => handleInputChange(e, "userInfo"),
            extenduserinfo: emiContextInfo.userInfo.marriageStatus === 'Single' ? ' hidden ' : '',

            svgicon: emiContextInfo.userInfo.gender === 'Male' ? '/svgfile/menperson.svg' : '/svgfile/creditcardicon.svg',
          },

          {
            label: "Phone Number",
            name: "phone",
            value: emiContextInfo.userInfo.phone,
            onChange: (e) => handleInputChange(e, "userInfo"),
            placeholder: "Enter phone number",
            svgicon: '/svgfile/phoneIcon.png',
            extenduserinfo: '',
          },
          {
            label: "National ID Number",
            name: "nationalID",
            value: emiContextInfo.userInfo.nationalID,
            onChange: (e) => handleInputChange(e, "userInfo"),
            placeholder: "Enter national ID number",
            svgicon: '/svgfile/idcardicon2.png',
            extenduserinfo: '',
          },
          {
            label: "Address",
            name: "address",
            value: emiContextInfo.userInfo.address,
            onChange: (e) => handleInputChange(e, "userInfo"),
            placeholder: "Enter address",
            maxLength: 100,
            svgicon: '/svgfile/homeaddressicon.png',
            extenduserinfo: '',
          },
          {
            label: "Salary Amount",
            name: "salaryAmount",
            value: emiContextInfo.bankinfo.salaryAmount,
            onChange: (e) => handleInputChange(e, "bankinfo"),
            placeholder: "Enter salary amount",
            svgicon: '/svgfile/moneycashicon.png',
            extenduserinfo: '',
          },
        ],
        additionalContent: (
          <div className="mt-6">
            <div className="mb-6 p-4 bg-blue-100 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Down Payment Amount</h3>

              <div className='flex flex-row gap-3 items-center'>
                <Image
                  src={'/svgfile/pichatpayment.svg'}
                  className="h-14 w-14 text-[var(--colour-fsP2)]/60"
                  alt={' upload document'}
                  height={80}
                  width={80}
                />
                <p className="text-2xl font-bold text-blue-600">Rs {emiData.downPayment.toFixed(2)}</p>
              </div>
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
                        <div className="h-40 flex items-center  border-blue-950 rounded-lg shadow-sm shadow-gray-700/30  justify-center">
                          <Image
                            src={previews[previewKey]}
                            alt={label}
                            width={200}
                            height={200}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="rounded  mx-auto group-hover:opacity-70 transition-opacity max-h-40 object-contain"
                            priority={docType === 'ppphoto'}
                          />
                        </div>
                      ) : (
                        <div className="h-40 flex items-center justify-center bg-gray-100 rounded border-2 border-dashed border-gray-300 mx-auto">
                          <Image
                            src={'/svgfile/uploaddocumenticon.svg'}
                            className="h-14 w-14 text-[var(--colour-fsP2)]/60"
                            alt={' upload document'}
                            height={80}
                            width={80}
                            priority
                          />
                        </div>
                      )}
                    </label>
                    {/* <p className="text-base font-medium text-gray-700 mt-2">{label}</p> */}
                    <Label className="block text-sm font-medium text-gray-700 mt-1">
                      {label}
                    </Label>
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
                          <Button
                            onClick={() => document.getElementById(previewKey).click()}
                            className="cursor-pointer text-blue-600 hover:text-blue-800 mr-2"
                          >
                            <Pencil size={20} />
                          </Button>
                          <Button
                            onClick={() => handleFileDelete(docType, isBankStatement ? false : false)}
                            className="cursor-pointer text-blue-600 hover:text-blue-800"
                          >
                            <Trash size={20} />
                          </Button>

                        </Dialog>
                      </div>
                    )}
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
          // Standard order: Name, Gender, Marriage Status, DOB (if needed, but based on code), Phone, National ID, Address
          {
            label: "Guarantors Full Name",
            name: "name",
            value: emiContextInfo.granterPersonalDetails.name,
            onChange: (e) => handleInputChange(e, "granterPersonalDetails"),
            placeholder: "Enter Guarantor name",
            svgicon: '/svgfile/menperson.svg',
            extenduserinfo: '',
          },
          {
            label: "Phone Number",
            name: "phone",
            value: emiContextInfo.granterPersonalDetails.phone,
            onChange: (e) => handleInputChange(e, "granterPersonalDetails"),
            placeholder: "Enter Phone Number",
            svgicon: '/svgfile/phoneIcon.png',
            extenduserinfo: '',
          },
          {
            label: "Gender",
            name: "gender",
            value: emiContextInfo.granterPersonalDetails.gender,
            onChange: (e) => handleInputChange(e, "granterPersonalDetails"),
            type: "select",
            options: ['Male', 'Female'],
            svgicon: emiContextInfo.granterPersonalDetails.gender === 'Male' ? '/svgfile/menperson.svg' : '/svgfile/creditcardicon.svg',
            extenduserinfo: '',
          },
          {
            label: "Marriage Status",
            name: "marriageStatus",
            value: emiContextInfo.granterPersonalDetails.marriageStatus,
            onChange: (e) => handleInputChange(e, "granterPersonalDetails"),
            type: "select",
            options: ['Single', 'Married', 'Divorced', 'Widowed'],
            svgicon: emiContextInfo.granterPersonalDetails.gender === 'Male' ? '/svgfile/menperson.svg' : '/svgfile/creditcardicon.svg',
            extenduserinfo: '',
          },

          {
            label: emiContextInfo.granterPersonalDetails.gender === "Male" ? "Wife Name" : "Husband Name",
            name: "userpartnerName",
            value: emiContextInfo.granterPersonalDetails.userpartnerName,
            onChange: (e) => handleInputChange(e, "granterPersonalDetails"),
            extenduserinfo: emiContextInfo.granterPersonalDetails.marriageStatus === 'Single' ? 'hidden' : '',

            svgicon: emiContextInfo.granterPersonalDetails.gender === 'Male' ? '/svgfile/menperson.svg' : '/svgfile/creditcardicon.svg',

          },

          {
            label: "Citizenship Number",
            name: "nationalID",
            value: emiContextInfo.granterPersonalDetails.nationalID,
            onChange: (e) => handleInputChange(e, "granterPersonalDetails"),
            placeholder: "Enter citizenship number",
            svgicon: '/svgfile/idcardicon2.png',
            extenduserinfo: '',
          },
          {
            label: "Address",
            name: "address",
            value: emiContextInfo.granterPersonalDetails.address,
            onChange: (e) => handleInputChange(e, "granterPersonalDetails"),
            placeholder: "Enter Address",
            maxLength: 100,
            svgicon: '/svgfile/homeaddressicon.png',
            extenduserinfo: '',
          },
        ],
        additionalContent: (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Required Documents</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {['ppphoto', 'front', 'back'].map((docType) => {
                const isBankStatement = docType === 'bankStatement';
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
                          <Image
                            src={'/svgfile/uploaddocumenticon.svg'}
                            className="h-14 w-14 text-[var(--colour-fsP2)]/60"
                            alt={' upload document'}
                            height={80}
                            width={80}
                          />
                        </div>
                      )}
                    </label>
                    {/* <p className="text-base font-medium text-gray-700 mt-2">{label}</p> */}
                    <Label className="block text-sm font-medium text-gray-700 mt-2">
                      {label}
                    </Label>
                    {file && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
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

                          <Button
                            onClick={() => document.getElementById(previewKey).click()}
                            className="cursor-pointer text-blue-600 hover:text-blue-800 mr-2"
                          >
                            <Pencil size={20} />
                          </Button>
                          <Button
                            onClick={() => handleFileDelete(docType, isBankStatement ? false : false)}
                            className="cursor-pointer text-blue-600 hover:text-blue-800"
                          >
                            <Trash size={20} />
                          </Button>
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


          {
            label: "Gender",
            name: "gender",
            value: emiContextInfo.userInfo.gender,
            onChange: (e) => handleInputChange(e, "userInfo"),
            type: "select",
            options: ['Male', 'Female', 'Other'],
            svgicon: emiContextInfo.userInfo.gender === 'Male' ? '/svgfile/menperson.svg' : '/svgfile/creditcardicon.svg',
            extenduserinfo: '',
          },
          {
            label: "Marriage Status",
            name: "marriageStatus",
            value: emiContextInfo.userInfo.marriageStatus,
            onChange: (e) => handleInputChange(e, "userInfo"),
            type: "select",
            options: ['Single', 'Married', 'Divorced', 'Widowed'],
            svgicon: emiContextInfo.userInfo.gender === 'Male' ? '/svgfile/menperson.svg' : '/svgfile/creditcardicon.svg',
            extenduserinfo: '',
          },
          {
            label: emiContextInfo.userInfo.gender === "Male" ? "Wife Name" : "Husband Name",
            name: "userpartnerName",
            value: emiContextInfo.userInfo.userpartnerName,
            onChange: (e) => handleInputChange(e, "userInfo"),
            extenduserinfo: emiContextInfo.userInfo.marriageStatus === 'Single' ? ' hidden ' : '',

            svgicon: emiContextInfo.userInfo.gender === 'Male' ? '/svgfile/menperson.svg' : '/svgfile/creditcardicon.svg',
          },
          {
            label: "Salary Amount",
            name: "salaryAmount",
            value: emiContextInfo.bankinfo.salaryAmount,
            onChange: (e) => handleInputChange(e, "bankinfo"),
            placeholder: "Enter salary amount",
            svgicon: '/svgfile/moneycashicon.png',
            extenduserinfo: '',
          },
          {
            label: "Bank Name",
            name: "bankname",
            value: emiContextInfo.bankinfo.bankname,
            onChange: (e) => handleBankSelect("bankinfo", "bankname", e.target.value),
            type: "select",
            svgicon: '/svgfile/bank.svg',
            extenduserinfo: '',
          },
          {
            label: "Account Number",
            name: "accountNumber",
            value: emiContextInfo.bankinfo.accountNumber,
            onChange: (e) => handleInputChange(e, "bankinfo"),
            placeholder: "Enter account number",
            svgicon: '/svgfile/idcardicon2.png',
            extenduserinfo: '',
          },
          {
            label: "Address",
            name: "address",
            value: emiContextInfo.userInfo.address,
            onChange: (e) => handleInputChange(e, "userInfo"),
            placeholder: "Enter address",
            maxLength: 100,
            svgicon: '/svgfile/homeaddressicon.png',
            extenduserinfo: '',
          },
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
                          <Image
                            src={'/svgfile/uploaddocumenticon.svg'}
                            className="h-14 w-14 text-[var(--colour-fsP2)]/60"
                            alt={' upload document'}
                            height={80}
                            width={80}
                          />
                        </div>
                      )}
                    </label>
                    {/* <p className="block text-sm font-medium text-gray-700 mb-2"></p> */}
                    <Label className="block text-sm font-medium text-gray-700 mt-2">
                      {label}
                    </Label>
                    {file && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
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
                                className="w-full h-auto  object-contain rounded-lg"
                                priority
                                quality={100}
                              />
                            </div>
                          </DialogContent>


                          <Button
                            onClick={() => document.getElementById(previewKey).click()}
                            className="cursor-pointer text-blue-600 hover:text-blue-800 mr-2"
                          >
                            <Pencil size={20} />
                          </Button>
                          <Button
                            onClick={() => handleFileDelete(docType, isBankStatement ? false : false)}
                            className="cursor-pointer text-blue-600 hover:text-blue-800"
                          >
                            <Trash size={20} />
                          </Button>
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


  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-gray-600 text-sm font-medium mb-4">Product Summary</h3>
            <div className="mb-1">
              <div className="relative aspect-square p-1 sm:p-2 w-full max-w-[280px] sm:max-w-[360px] mx-auto">
                <Image
                  src={product.image || ''}
                  alt={product.name || ''}
                  width={360}
                  height={360}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="w-full h-full object-contain transition-transform duration-300 hover:scale-105 rounded-md"
                  priority
                />
              </div>
              <div className="text-gray-500 text-sm mb-1">{product?.name}</div>
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
            <div className="flex items-center space-x-4 lg:space-x-8 w-full max-w-4xl">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentstep <= 0 ? 'bg-[var(--colour-fsP2)] text-white' : 'bg-gray-200 text-gray-600'}`}>
                  1
                </div>
                <span className="ml-2 text-sm text-gray-600 hidden lg:block">Start</span>
              </div>
              <div className={`flex-1 h-1 ${(currentstep >= 1) ? 'bg-[var(--colour-fsP1)]' : "bg-gray-300"}  mx-0 `}></div>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentstep >= 1 && currentstep < 3 ? 'bg-[var(--colour-fsP2)] text-white' : 'bg-gray-200 text-gray-600'}`}>
                  2
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900 hidden lg:block">Details</span>
              </div>
              <div className={`flex-1 h-1 ${currentstep === 3 ? 'bg-[var(--colour-fsP1)]' : "bg-gray-300"}  mx-0 `}></div>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentstep === 3 ? 'bg-[var(--colour-fsP2)] text-white' : 'bg-gray-200 text-gray-600'}`}>
                  3
                </div>
                <span className="ml-2 text-sm text-gray-600 hidden lg:block">Submit</span>
              </div>
            </div>
          </div>

          {currentstep === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-8 min-h-[400px] mb-4 flex flex-col items-center justify-center">
              {!NoCreditCard ? (
                <>
                  <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 text-center">Do you have Credit Card</h2>
                  <div className="flex flex-col md:flex-row gap-4 justify-center w-full max-w-2xl">
                    <Button
                      onClick={() => handleOptionSelect('creditCard')}
                      className="flex items-center justify-center gap-3 py-6 flex-1 max-w-sm bg-[var(--colour-fsP2)] text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                    >
                      <div className="rounded-full border p-1 bg-white">
                        <Image src={creditcardicon} alt="apply with credit card" height={20} width={20} />
                      </div>
                      <span>Yes, I have Credit Card</span>
                    </Button>
                    <Button
                      onClick={() => setNoCreditCard(true)}
                      className="flex items-center justify-center gap-3 py-6 flex-1 max-w-sm bg-[var(--colour-fsP1)] text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                    >
                      <div className="rounded-full border p-1 bg-white">
                        <Image src={downpaymenticon} alt="down payment" height={20} width={20} />
                      </div>
                      <span>No, I dont have Credit Card</span>
                    </Button>
                  </div>
                </>
              ) : (
                <div className="w-full">
                  <div className="flex flex-col sm:flex-row items-center justify-center mb-8 gap-3">
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Choose an Option -</h2>
                    <button
                      onClick={() => setNoCreditCard(false)}
                      className="flex items-center justify-center font-medium"
                    >
                      <div className="gap-3 flex">
                        <Image src={chnagecreditcard} alt="Back" height={70} width={40} priority />
                      </div>
                      <span className="text-gray-800">Back</span>
                    </button>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4 justify-center w-full max-w-2xl mx-auto">
                    <Button
                      onClick={() => handleOptionSelect('downPayment')}
                      className="flex items-center justify-center gap-3 py-6 flex-1 max-w-sm bg-[var(--colour-fsP2)] text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                    >
                      <div className="rounded-full border p-1 bg-white">
                        <Image src={downpaymenticon} alt="down payment" height={20} width={20} />
                      </div>
                      <span>40 % Down Payment</span>
                    </Button>
                    <Button
                      onClick={() => handleOptionSelect('makeCard')}
                      className="flex items-center justify-center gap-3 py-6 flex-1 max-w-sm bg-[var(--colour-fsP1)] text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
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
            <RenderReview
              emiData={emiData}
              handleFileChange={handleFileChange}
              handleFileDelete={handleFileDelete}
              handleBack={handleBack}
              previews={previews}

            />
          ) : (
            currentFormSection && (
              <div className="bg-white rounded-lg shadow-sm p-4 md:p-8 mt-2">
                <h2 className="text-xl md:text-xl font-medium text-[var(--colour-fsP2)] mb-1">{currentFormSection.title}</h2>
                <div className="space-y-6 text-base font-sans">


                  {currentFormSection.sectionKey === "bankinfo" && currentFormSection.title === "Credit Card Details" &&
                    <CreditCardComponent cardinfofield={currentFormSection} />
                  }
                  {(currentFormSection.sectionKey === "userInfo" || currentFormSection.sectionKey === "granterPersonalDetails" || currentFormSection.title === "Personal and Bank Details") &&
                    <BuyerPersonalInfo cardinfofield={currentFormSection} />
                  }
                  {currentFormSection.additionalContent}
                  <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4 pt-6">
                    <Button
                      type="button"
                      onClick={handleBack}

                      className="px-6 text-gray-600 hover:text-gray-800 transition-colors text-base font-medium w-full sm:w-auto"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={handleContinue}
                      className="px-6 bg-blue-900 text-white hover:bg-[var(--colour-fsP1)] "

                    >
                      Continue
                    </Button>
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