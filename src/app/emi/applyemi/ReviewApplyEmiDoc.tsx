'use client'

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Eye, Pencil, Trash, FileText, CreditCard } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useContextEmi } from '../emiContext';

interface RenderReviewProps {
  emiData: any;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, docType: string) => void;
  handleFileDelete: (docType: string, isGranter?: boolean) => void;
  handleBack: () => void;
  previews: { [key: string]: string };
}

interface InfoItem {
  label: string;
  value: string | number;
}

const RenderReview: React.FC<RenderReviewProps> = ({
  emiData,
  handleFileChange,
  handleFileDelete,
  handleBack,
  previews,
}) => {
  const { emiContextInfo, setEmiContextInfo } = useContextEmi();
  const { userInfo, bankinfo, granterPersonalDetails, files, hasCreditCard, emiCalculation } = emiContextInfo;

  // Define personal information fields
  const personalInfoFields: InfoItem[] = [
    { label: 'Full Name', value: userInfo.name },
    { label: 'Email Address', value: userInfo.email },
    { label: 'Phone Number', value: userInfo.phone },
    { label: 'Date of Birth', value: userInfo.dob },
    { label: 'National ID', value: userInfo.nationalID },
    { label: 'Gender', value: userInfo.gender },
    { label: 'Marriage Status', value: userInfo.marriageStatus },
    { label: 'Salary Amount', value: `Rs. ${bankinfo.salaryAmount}` },
    { label: 'Address', value: userInfo.address },
  ];

  // Define credit card information fields
  const creditCardFields: InfoItem[] = hasCreditCard === 'yes' ? [
    { label: 'Card Number', value: `**** **** **** ${bankinfo.creditCardNumber?.slice(-4)}` },
    { label: 'Card Holder Name', value: bankinfo.cardHolderName },
    { label: 'Card Provider', value: bankinfo.bankname },
    { label: 'Expiry Date', value: bankinfo.expiryDate },
    { label: 'Credit Limit', value: `Rs. ${bankinfo.cardLimit}` },
  ] : [];

  // Define bank information fields
  const bankInfoFields: InfoItem[] = hasCreditCard === 'make' ? [
    { label: 'Account Holder Name', value: userInfo.name },
    { label: 'Bank Name', value: bankinfo.bankname },
    { label: 'Account Number', value: bankinfo.accountNumber },
    { label: 'Salary Amount', value: `Rs. ${bankinfo.salaryAmount}` },
  ] : [];

  // Define guarantor information fields
  const guarantorFields: InfoItem[] = hasCreditCard === 'no' ? [
    { label: 'Full Name', value: granterPersonalDetails.name },
    { label: 'Phone Number', value: granterPersonalDetails.phone },
    { label: 'Citizenship Number', value: granterPersonalDetails.nationalID },
    { label: 'Gender', value: granterPersonalDetails.gender },
    { label: 'Marriage Status', value: granterPersonalDetails.marriageStatus },
    { label: 'Address', value: granterPersonalDetails.address },
  ] : [];

  // Define document fields
  const documentFields = [
    { docType: 'front', label: 'Citizenship Front', isBankStatement: false },
    { docType: 'back', label: 'Citizenship Back', isBankStatement: false },
    { docType: 'bankStatement', label: 'Bank Statement', isBankStatement: true },
  ];

  // Define guarantor document fields
  const guarantorDocumentFields = hasCreditCard === 'no' ? [
    { docType: 'front', label: 'Guarantor Citizenship Front' },
    { docType: 'back', label: 'Guarantor Citizenship Back' },
  ] : [];

  // Define EMI calculation fields
  const emiFields: InfoItem[] = [
    { label: 'Down Payment', value: `Rs. ${emiData.downPayment || 0}` },
    { label: 'Duration', value: `${emiData.tenure} months` },
    { label: 'Finance Amount', value: `Rs. ${emiData.financeAmount}` },
    { label: 'Product Amount', value: `Rs. ${emiData.principal}` },
  ];

  const handlesignture = () => {
    setEmiContextInfo((prev) => ({
      ...prev,
      files: {
        ...prev.files,
        userSignature: null
      },
    }));
  };

  return (
    <div className="bg-gradient-to-b from-white to-blue-50 py-4 sm:py-6 min-h-screen">
      <div className="max-w-[95%] sm:max-w-4xl mx-auto bg-white rounded-xl border border-blue-100 shadow-sm flex flex-col">
        <div className="p-4 sm:p-6 flex-grow">
          {/* Applicant Profile Section */}
          <section className="mb-6 border-b border-blue-100 pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              <div className="col-span-1 flex justify-center sm:justify-start">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-yellow-50 border border-blue-100 rounded-lg overflow-hidden">
                    {files.citizenshipFile?.ppphoto ? (
                      <Image
                        src={previews['citizenship-ppphoto'] || ''}
                        alt="Applicant Photo"
                        width={128}
                        height={128}
                        className="w-full h-full object-cover transition-transform duration-150 hover:scale-105"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-yellow-50">
                        <Image
                          src="/svgfile/menperson.svg"
                          alt="User Profile"
                          width={48}
                          height={48}
                          className="h-12 w-12 text-blue-600"
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Photo</p>
                </div>
              </div>
              <div className="col-span-1 sm:col-span-4">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-6 w-6 text-[var(--colour-fsP2)]" />
                  <h2 className="text-base font-medium text-gray-700">Personal Information</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {personalInfoFields.map((field, index) => (
                    <div key={index} className={field.label === 'Address' ? 'sm:col-span-2' : ''}>
                      <dt className="text-xs font-medium text-gray-600 uppercase">{field.label}</dt>
                      <dd className="text-sm font-medium text-gray-900 border-b border-blue-200 pb-1">{field.value}</dd>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Credit Card Details */}
          {hasCreditCard === 'yes' && (
            <section className="mb-6 border-b border-blue-100 pb-6">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                <div className="col-span-1"></div>
                <div className="col-span-1 sm:col-span-4">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="h-6 w-6 text-[var(--colour-fsP2)]" />
                    <h2 className="text-base font-medium text-gray-700">Credit Card Information</h2>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-blue-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {creditCardFields.map((field, index) => (
                        <div key={index} className={field.label === 'Credit Limit' ? 'sm:col-span-2' : ''}>
                          <dt className="text-xs font-medium text-gray-600 uppercase">{field.label}</dt>
                          <dd className="text-sm font-medium text-gray-900 border-b border-blue-200 pb-1">{field.value}</dd>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Bank Details */}
          {hasCreditCard === 'make' && (
            <section className="mb-6 border-b border-blue-100 pb-6">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                <div className="col-span-1"></div>
                <div className="col-span-1 sm:col-span-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Image
                      src="/svgfile/bank.svg"
                      alt="Bank icon"
                      width={24}
                      height={24}
                      className="h-6 w-6 text-blue-600"
                    />
                    <h2 className="text-base font-medium text-gray-700">Banking Information</h2>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-blue-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {bankInfoFields.map((field, index) => (
                        <div key={index}>
                          <dt className="text-xs font-medium text-gray-600 uppercase">{field.label}</dt>
                          <dd className="text-sm font-medium text-gray-900 border-b border-blue-200 pb-1">{field.value}</dd>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Guarantor Information */}
          {hasCreditCard === 'no' && (
            <section className="mb-6 border-b border-blue-100 pb-6">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                <div className="col-span-1 order-1 sm:order-2 flex justify-center sm:justify-start">
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 sm:w-32 sm:h-32  border border-blue-100 rounded-lg overflow-hidden">
                      {files.granterDocument?.ppphoto ? (
                        <Image
                          src={previews['granter-ppphoto'] || ''}
                          alt="Guarantor Photo"
                          width={128}
                          height={128}
                          className="w-full h-full object-cover transition-transform duration-150 hover:scale-105"
                          priority
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center ">
                          <Image
                            src="/svgfile/menperson.svg"
                            alt="Guarantor Photo"
                            width={48}
                            height={48}
                            className="h-12 w-12 text-blue-600"
                          />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-2">Guarantor</p>
                  </div>
                </div>
                <div className="col-span-1 sm:col-span-4 order-2 sm:order-1">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-6 w-6 text-[var(--colour-fsP2)]" />
                    <h2 className="text-base font-medium text-gray-700">Guarantor Information</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {guarantorFields.map((field, index) => (
                      <div key={index} className={field.label === 'Address' ? 'sm:col-span-2' : ''}>
                        <dt className="text-xs font-medium text-gray-600 uppercase">{field.label}</dt>
                        <dd className="text-sm font-medium text-gray-900 border-b border-blue-200 pb-1">{field.value}</dd>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* EMI Calculation */}
          <section className="mb-6 border-b border-blue-100 pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              <div className={`col-span-1 hidden sm:block ${hasCreditCard === 'no' ? 'hidden' : ''}`}></div>
              <div className={`col-span-1 ${hasCreditCard === 'no' ? 'sm:col-span-5' : 'sm:col-span-4'}`}>
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="h-6 w-6 text-[var(--colour-fsP2)]" />
                  <h2 className="text-base font-medium text-gray-700">EMI Calculation Details</h2>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border border-blue-100">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {emiFields.map((field, index) => (
                      <div key={index} className="text-center">
                        <dt className="text-xs font-medium text-gray-600 uppercase">{field.label}</dt>
                        <dd className="text-sm font-medium text-gray-900 pb-1">{field.value}</dd>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Supporting Documents */}
          <section className="mb-6 border-b border-blue-100 pb-6 grid grid-cols-1 sm:grid-cols-5 gap-4">
            <div className={`col-span-1 ${hasCreditCard === 'no' ? 'hidden' : ''}`}></div>
            <div className={`col-span-1 ${hasCreditCard === 'no' ? 'sm:col-span-5' : 'sm:col-span-4'}`}>
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/svgfile/uploaddocumenticon.svg"
                  alt="Document icon"
                  width={24}
                  height={24}
                  className="h-6 w-6 text-blue-600"
                />
                <h2 className="text-base font-medium text-gray-700">Documents</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {documentFields.map(({ docType, label, isBankStatement }) => {
                  const file = isBankStatement ? files.bankStatement : files.citizenshipFile[docType];
                  const previewKey = isBankStatement ? 'bankStatement' : `citizenship-${docType}`;
                  return (
                    <div key={docType} className="text-center group relative">
                      <dt className="text-xs font-medium text-gray-600 uppercase mb-2">{label}</dt>
                      <div className="h-40 flex p-2 items-center  rounded-lg border border-blue-100 justify-center">
                        {file ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <div className="cursor-pointer">
                                <Image
                                  src={previews[previewKey] || ''}
                                  alt={label}
                                  width={200}
                                  height={200}
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                  className="rounded-lg max-h-36 object-contain transition-transform duration-150 group-hover:scale-105"
                                  loading="lazy"
                                />
                              </div>
                            </DialogTrigger>
                            <DialogContent className="w-[95%] sm:max-w-4xl max-h-[90vh] p-0 bg-white border border-blue-100 rounded-xl shadow-sm overflow-hidden">
                              <div className="flex items-center justify-between p-4 border-b border-blue-100 bg-white">
                                <h3 className="text-base font-medium text-gray-700">{label}</h3>
                              </div>
                              <div className="flex items-center justify-center p-4 sm:p-6 bg-white min-h-[300px] sm:min-h-[400px]">
                                <Image
                                  src={previews[previewKey] || ''}
                                  alt={label}
                                  width={1200}
                                  height={800}
                                  sizes="100vw"
                                  className="max-w-full max-h-[70vh] object-contain rounded-lg border border-blue-100 shadow-sm"
                                  quality={100}
                                  loading="lazy"
                                />
                              </div>
                              <div className="flex justify-center gap-3 p-4 border-t border-blue-100 bg-white">
                                <Button
                                  onClick={() => document.getElementById(previewKey)?.click()}
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-2 cursor-pointer border-blue-200 text-blue hover:border-blue-300 hover:text-blue-700 transition-all duration-150"
                                >
                                  <Pencil size={16} />
                                  Replace
                                </Button>
                                <Button
                                  onClick={() => handleFileDelete(docType)}
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-2 cursor-pointer border-blue-200 text-blue-600 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-150"
                                >
                                  <Trash size={16} />
                                  Delete
                                </Button>
                              </div>
                              <input
                                type="file"
                                id={previewKey}
                                onChange={(e) => handleFileChange(e, docType)}
                                className="hidden"
                              />
                            </DialogContent>
                          </Dialog>
                        ) : (
                          <Image
                            src="/svgfile/uploaddocumenticon.svg"
                            alt="Document icon"
                            width={48}
                            height={48}
                            className="h-12 w-12 text-blue-600"
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Guarantor Documents */}
              {hasCreditCard === 'no' && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Guarantor Documents</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {guarantorDocumentFields.map(({ docType, label }) => {
                      const file = files.granterDocument[docType];
                      const previewKey = `granter-${docType}`;
                      return (
                        <div key={docType} className="text-center group relative">
                          <dt className="text-xs font-medium text-gray-600 uppercase mb-2">{label}</dt>
                          <div className="h-40 flex p-2 items-center  rounded-lg border border-blue-100 justify-center">
                            {file ? (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <div className="cursor-pointer">
                                    <Image
                                      src={previews[previewKey] || ''}
                                      alt={label}
                                      width={200}
                                      height={200}
                                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                      className="rounded-lg max-h-36 object-contain transition-transform duration-150 group-hover:scale-105"
                                      loading="lazy"
                                    />
                                  </div>
                                </DialogTrigger>
                                <DialogContent className="w-[95%] sm:max-w-4xl max-h-[90vh] p-0 bg-white border border-blue-100 rounded-xl shadow-sm overflow-hidden">
                                  <div className="flex items-center justify-between p-4 border-b border-blue-100 bg-white">
                                    <h3 className="text-base font-medium text-gray-700">{label}</h3>
                                  </div>
                                  <div className="flex items-center justify-center p-4 sm:p-6 bg-white min-h-[300px] sm:min-h-[400px]">
                                    <Image
                                      src={previews[previewKey] || ''}
                                      alt={label}
                                      width={1200}
                                      height={800}
                                      sizes="100vw"
                                      className="max-w-full max-h-[70vh] object-contain rounded-lg border border-blue-100 shadow-sm"
                                      quality={100}
                                      loading="lazy"
                                    />
                                  </div>
                                  <div className="flex justify-center gap-3 p-4 border-t border-blue-100 bg-white">
                                    <Button
                                      onClick={() => document.getElementById(previewKey)?.click()}
                                      variant="outline"
                                      size="sm"
                                      className="flex items-center gap-2 border-blue-200 text-blue-600 hover:bg-yellow-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-150"
                                    >
                                      <Pencil size={16} />
                                      Replace
                                    </Button>
                                    <Button
                                      onClick={() => handleFileDelete(docType, true)}
                                      variant="outline"
                                      size="sm"
                                      className="flex items-center gap-2 border-blue-200 text-blue-600 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-150"
                                    >
                                      <Trash size={16} />
                                      Delete
                                    </Button>
                                  </div>
                     
                                </DialogContent>
                              </Dialog>
                            ) : (
                              <Image
                                src="/svgfile/uploaddocumenticon.svg"
                                alt="Document icon"
                                width={48}
                                height={48}
                                className="h-12 w-12 text-blue-600"
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Signature Section */}
          <section className="mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              <div className="col-span-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Declaration</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  I hereby declare that all the information provided above is true and accurate to the best of my knowledge.
                  I understand that any false information may result in the rejection of my application.
                </p>
              </div>
              <div className="text-center sm:col-span-1">
                <Label className="text-xs font-medium text-gray-600 uppercase mb-2 block">Applicant Signature</Label>
                <div className="relative group inline-block cursor-pointer">
                  <input
                    type="file"
                    id="userSignature"
                    onChange={(e) => handleFileChange(e, 'userSignature')}
                    className="hidden"
                  />
                  <div className="border border-dashed border-blue-200 rounded-lg p-2  w-32 h-16 flex items-center justify-center">
                    {files.userSignature ? (
                      <div className="relative">
                        <Image
                          src={previews.userSignature || ''}
                          alt="Signature"
                          width={120}
                          height={40}
                          className="max-h-12 object-contain transition-transform duration-150 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-black/10 rounded-lg">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-1 text-[var(--colour-fsP2)] cursor-pointer hover:text-blue-700 hover:bg-yellow-50"
                              >
                                <Eye size={12} />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="w-[95%] sm:max-w-4xl max-h-[90vh] p-0 bg-white border border-blue-100 rounded-xl shadow-sm overflow-hidden">
                              <div className="flex items-center justify-between p-4 border-b border-blue-100 bg-white">
                                <h3 className="text-base font-medium text-gray-700">Signature Preview</h3>
                              </div>
                              <div className="flex items-center justify-center p-4 sm:p-6 bg-white min-h-[300px] sm:min-h-[400px]">
                                <Image
                                  src={previews.userSignature || ''}
                                  alt="Signature Preview"
                                  width={1200}
                                  height={800}
                                  sizes="100vw"
                                  className="max-w-full max-h-[70vh] object-contain rounded-lg border border-blue-100 shadow-sm"
                                  quality={100}
                                  loading="lazy"
                                />
                              </div>
                              <div className="flex justify-center gap-3 p-4 border-t border-blue-100 bg-white">
                                <Button
                                  onClick={() => document.getElementById('userSignature')?.click()}
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-2 cursor-pointer  border-blue-200 text-blue-600 hover:bg-yellow-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-150"
                                >
                                  <Pencil size={16} />
                                  Replace
                                </Button>
                                <Button
                                  onClick={() => handlesignture()}
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-2 cursor-pointer border-blue-200 text-blue-600 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-150"
                                >
                                  <Trash size={16} />
                                  Delete
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => document.getElementById('userSignature')?.click()}
                            className="p-1 text-blue-600 cursor-pointer  hover:text-blue-700 hover:bg-yellow-50"
                          >
                            <Pencil size={12} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlesignture()}
                            className="p-1 text-blue-600 cursor-pointer hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash size={12} />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <label htmlFor="userSignature" className="cursor-pointer flex flex-col items-center gap-1">
                        <div className="w-8 h-8  rounded-full flex items-center justify-center">
                          <Pencil size={20} className="text-[var(--colour-fsP2)]" />
                        </div>
                        <span className="text-xs text-gray-600">Sign</span>
                      </label>
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <div className="border-t border-blue-200 w-28 mx-auto"></div>
                    <p className="text-xs text-gray-600 mt-1">Date: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-blue-100">
            <Button
              type="button"
              onClick={handleBack}
              variant="outline"
              className="w-full sm:w-auto px-4 cursor-pointer py-2 border-blue-200 text-blue-600 hover:bg-yellow-50 hover:border-blue-300 hover:text-blue-700 text-sm font-medium transition-all duration-150 focus:ring-1 focus:ring-blue-600"
            >
              Back to Edit
            </Button>
            <Button
              type="button"
              onClick={() => console.log('Submit:', emiContextInfo)}
              className="w-full sm:w-auto px-6 cursor-pointer py-2 bg-[var(--colour-fsP2)] text-white hover:bg-[var(--colour-fsP1)] text-sm font-medium rounded-lg transition-all duration-150 focus:ring-1 focus:ring-blue-600"
            >
              Submit Application
            </Button>
          </div>
        </div>

        <div className="bg-yellow-50 border-t border-blue-100 p-3 text-center text-xs text-gray-600">
          <p>This is a computer-generated document. Please verify all information before submission.</p>
        </div>
      </div>
    </div>
  );
};

export default RenderReview;