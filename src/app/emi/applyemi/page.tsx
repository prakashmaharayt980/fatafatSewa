'use client'

import React, { useMemo, useState, useEffect, use } from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';


import creditcardicon from '../../../../public/svgfile/creditcardicon.svg';
import downpaymenticon from '../../../../public/svgfile/payementiconcash.svg';
import addcreditcard from '../../../../public/svgfile/creditcardplus.svg';
// import chnagecreditcard from '../../../../public/svgfile/creditcardchnage.png';

import { useContextEmi } from '../emiContext';

import CreditCardComponent from './CreditCardform';
import BuyerPersonalInfo from './BuyerPersonalInfo';


import RenderReview from './ReviewApplyEmiDoc';
import ProgressBar from './ProgressBar';
import EmiProductDetails from './EmiProductDetails';
import DocumentUpload from './DocumentUpload';




const ApplyEmiProcess = () => {
  const { emiContextInfo, setEmiContextInfo, AvailablebankProvider, emiCalculation } = useContextEmi();
  const [NoCreditCard, setNoCreditCard] = useState(false);
  const [currentstep, setcurrentstep] = useState(0);
  const product = emiContextInfo.product;
  const emiCalc = emiContextInfo.emiCalculation;
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
    // if (files.bankStatement) newPreviews.bankStatement = URL.createObjectURL(files.bankStatement);
    // if (files.userSignature) newPreviews.userSignature = URL.createObjectURL(files.userSignature);
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
    setcurrentstep((prev) => Math.min(prev + 1, 4));
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
        downPayment: option === 'downPayment' ? 40 : prev.emiCalculation.downPayment,

      },
    }));
    setcurrentstep(1);
  };


  const tumerOptions = useMemo(() => {
    const tumer = AvailablebankProvider.find(bank => bank.name === emiContextInfo.bankinfo.bankname)?.tenureOptions
    console.log('tumer', tumer);
    return tumer || [];
  }, [emiContextInfo.bankinfo.bankname, AvailablebankProvider])



  const emiData = useMemo(() => emiCalculation(
    product.price === null ? 0 : product.price,
    emiCalc.duration,
    emiCalc.downPayment,
    emiContextInfo.bankinfo.bankname
  ), [product.price, emiCalc.duration, emiCalc.downPayment, emiContextInfo.bankinfo.bankname, emiCalculation])
  const emiConditionFields = [
    {
      label: "Down Payment Amount",
      name: "downPayment",
      value: emiData.downPayment,
      onChange: (e) => handleInputChange(e, "emiCalculation"),
      svgicon: '/svgfile/moneycashicon.png',
      extenduserinfo: '',
      placeholder: 'Enter down payment amount',
      maxvalue: product.price
    },
    {
      label: "Bank",
      name: "bankname",
      value: emiContextInfo.bankinfo.bankname,
      onChange: (e) => handleBankSelect("bankinfo", "bankname", e.target.value),
      type: "select",
      placeholder: "Select Bank",

      svgicon: '/svgfile/monthicon.png',
      extenduserinfo: '',
    },
    {
      label: "Duration (months)",
      name: "duration",
      value: emiCalc.duration,
      onChange: (e) => handleInputChange(e, "emiCalculation"),
      placeholder: "Select Duration",
      type: "select",
      options: tumerOptions,
      svgicon: '/svgfile/monthicon.png',
      extenduserinfo: '',
    },
    {
      label: "Finance Amount",
      name: "financeAmount",
      value: emiData.financeAmount,
      onChange: () => { },
      svgicon: '/svgfile/moneycashicon.png',
      extenduserinfo: '',
    },

  ];

  const personalDetailsInfolist = [
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
      options: ['Single', 'Married'],
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

  ]

  const creditCardDetailsInfo = [
    // Standard order: Card Number first, then Expiry, then Name, then Provider, then Limit
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
  ]

  const bankdetailsInfo = [
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
      label: "Bank Branch",
      name: "bankbranch",
      value: emiContextInfo.bankinfo.bankbranch,
      onChange: (e) => handleInputChange(e, "bankinfo"),
      placeholder: "Enter Bank Branch",
      svgicon: '/svgfile/bank.svg',
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

  ]
  const granterPersonalDetails = [
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
      options: ['Single', 'Married'],
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
  ]


  const formSections = {
    creditCard: [

      {
        title: "Credit Card Details",
        sectionKey: "bankinfo",
        step: 1,
        fields: creditCardDetailsInfo,
        additionalContent: (<></>),
      },
      {
        title: "Personal Details",
        sectionKey: "userInfo",
        step: 2,
        fields: personalDetailsInfolist,
        additionalContent: (<></>),
      },
      {
        title: "EMI Conditions",
        sectionKey: "emiCalculation",
        step: 3,
        fields: emiConditionFields,
        additionalContent: (<></>),
      },
    ],
    downPayment: [

      {
        title: "Personal Details",
        sectionKey: "userInfo",
        step: 1,
        fields: personalDetailsInfolist,
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
                <p className="text-2xl font-bold text-blue-600">Rs {emiData.downPayment}</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Required Documents</h3>
            <DocumentUpload
              docTypes={['ppphoto', 'front', 'back']}
              isGranter={false}
              files={emiContextInfo.files}
              previews={previews}
              handleFileChange={handleFileChange}
              handleFileDelete={handleFileDelete}
            />
          </div>
        )
      },
      {
        title: "Guarantor Information",
        sectionKey: "granterPersonalDetails",
        step: 2,
        fields: granterPersonalDetails,
        additionalContent: (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Required Documents</h3>
            <DocumentUpload
              docTypes={['ppphoto', 'front', 'back']}
              isGranter={true}
              files={emiContextInfo.files}
              previews={previews}
              handleFileChange={handleFileChange}
              handleFileDelete={handleFileDelete}
            />
          </div>
        ),
      },
      {
        title: "EMI Conditions",
        sectionKey: "emiCalculation",
        step: 3,
        fields: emiConditionFields,
        additionalContent: (<></>),
      },
    ],
    makeCard: [

      {
        title: "Personal Details",
        sectionKey: "userInfo",
        step: 1,
        fields: personalDetailsInfolist,
        additionalContent: (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Required Documents</h3>
            <DocumentUpload
              docTypes={['ppphoto', 'front', 'back']}
              isGranter={false}
              files={emiContextInfo.files}
              previews={previews}
              handleFileChange={handleFileChange}
              handleFileDelete={handleFileDelete}
            />
          </div>
        ),
      },
      {
        title: "Bank Details",
        sectionKey: "bankinfo",
        step: 2,
        fields: bankdetailsInfo,
        additionalContent: (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Required Documents</h3>
            <DocumentUpload
              docTypes={['bankStatement']}
              isGranter={false}
              files={emiContextInfo.files}
              previews={previews}
              handleFileChange={handleFileChange}
              handleFileDelete={handleFileDelete}
            />
          </div>
        ),
      },
      {
        title: "EMI Conditions",
        sectionKey: "emiCalculation",
        step: 3,
        fields: emiConditionFields,
        additionalContent: (<></>),
      },
    ],
  };

  const selectedOption = emiContextInfo.hasCreditCard === 'yes' ? 'creditCard' : emiContextInfo.hasCreditCard === 'make' ? 'makeCard' : 'downPayment';
  const currentFormSection = currentstep > 0 && currentstep < 4 ? formSections[selectedOption]?.find((section) => section.step === currentstep) : null;


  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar */}
        {product !== null &&
          <EmiProductDetails emiData={emiData} product={product} />
        }


        {/* Main Content */}
        <div className="flex-1">
          <ProgressBar currentstep={currentstep} />

          {currentstep === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-8 min-h-[400px] mb-4 flex flex-col items-center justify-center">
              {!NoCreditCard ? (
                <>
                  <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 text-center">Do you have Credit Card</h2>
                  <div className="flex flex-col md:flex-row gap-4 justify-center w-full max-w-2xl">
                    <Button
                      onClick={() => handleOptionSelect('creditCard')}
                      className="flex items-center cursor-pointer justify-center gap-3 py-6 flex-1 max-w-sm bg-[var(--colour-fsP2)] text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                    >
                      <div className="rounded-full border p-1 bg-white">
                        <Image src={creditcardicon} alt="apply with credit card" height={20} width={20} />
                      </div>
                      <span>Yes, I have Credit Card</span>
                    </Button>
                    <Button
                      onClick={() => setNoCreditCard(true)}
                      className="flex items-center cursor-pointer justify-center gap-3 py-6 flex-1 max-w-sm bg-[var(--colour-fsP1)] text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
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
                      className="flex items-center justify-center font-medium cursor-pointer"
                    >
                      {/* <div className="gap-3 flex">
                        <Image src={chnagecreditcard} alt="Back" height={70} width={40} priority />
                      </div> */}
                      <span className="text-gray-800">Back</span>
                    </button>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4 justify-center w-full max-w-2xl mx-auto">
                    <Button
                      onClick={() => handleOptionSelect('downPayment')}
                      className="flex items-center cursor-pointer justify-center gap-3 py-6 flex-1 max-w-sm bg-[var(--colour-fsP2)] text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                    >
                      <div className="rounded-full border p-1 bg-white">
                        <Image src={downpaymenticon} alt="down payment" height={20} width={20} />
                      </div>
                      <span>40 % Down Payment</span>
                    </Button>
                    <Button
                      onClick={() => handleOptionSelect('makeCard')}
                      className="flex items-center cursor-pointer justify-center gap-3 py-6 flex-1 max-w-sm bg-[var(--colour-fsP1)] text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
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
          ) : currentstep === 4 ? (
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
                  {(() => {
                    if (currentFormSection.sectionKey === "bankinfo" && currentFormSection.title === "Credit Card Details") {
                      return <CreditCardComponent cardinfofield={currentFormSection} />;
                    } else if (currentFormSection.sectionKey === "userInfo" || currentFormSection.sectionKey === "granterPersonalDetails" || currentFormSection.sectionKey === "emiCalculation" || currentFormSection.sectionKey === "bankinfo") {
                      return <BuyerPersonalInfo cardinfofield={currentFormSection} />;
                    }
                    return null;
                  })()}
                  {currentFormSection.additionalContent}
                  <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4 pt-6">
                    <Button
                      type="button"
                      onClick={handleBack}

                      className="px-6 text-gray-600 cursor-pointer hover:text-gray-800 transition-colors text-base font-medium w-full sm:w-auto"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={handleContinue}
                      className="px-6 bg-blue-900 cursor-pointer text-white hover:bg-[var(--colour-fsP1)] "

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