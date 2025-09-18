import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Eye, Pencil, Trash, User, FileText, CreditCard, UserCheck, Calculator } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useContextEmi } from "../emiContext";

interface RenderReviewProps {
    emiData: {
        downPayment: number;
        monthlyEMI: number;
    };
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, docType: string) => void;
    handleFileDelete: (docType: string, isGranter?: boolean) => void;
    handleBack: () => void;
    previews: { [key: string]: string };
}

const RenderReview: React.FC<RenderReviewProps> = ({
    emiData,
    handleFileChange,
    handleFileDelete,
    handleBack,
    previews,
}) => {
    const { emiContextInfo } = useContextEmi();
    const { userInfo, bankinfo, granterPersonalDetails, files, hasCreditCard, emiCalculation } = emiContextInfo;

    return (
        <div className="max-w-4xl mx-auto bg-white shadow-xl border border-gray-200">
            {/* Document Header */}
            {/* <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold mb-1">Loan Application Review</h1>
            <p className="text-blue-100 text-sm">Document ID: LA-{new Date().getTime()}</p>
            <p className="text-blue-100 text-sm">Date: {new Date().toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <FileText size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div> */}

            <div className="p-4">
                {/* Applicant Profile Section with Photo */}
                <section className="mb-4 border-gray-200 pb-4">
                    <div className="grid grid-cols-5">
                        {/* User Photo */}
                        <div className=" col-span-1">
                            <div className="flex flex-col justify-center items-center align-middle">
                                <div className="w-32 h-32 bg-gray-100 border border-gray-300 rounded overflow-hidden">
                                    {files.citizenshipFile?.ppphoto ? (
                                        <Image
                                            src={previews['citizenship-ppphoto']}
                                            alt="Applicant Photo"
                                            width={100}
                                            height={100}
                                            className="w-full h-full object-cover"
                                            priority
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                            <Image
                                                src={'/svgfile/menperson.svg'}
                                                className="h-32 w-32 text-[var(--colour-fsP2)]/60"
                                                alt={'user Profile'}
                                                height={30}
                                                width={30}
                                            />
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 text-center">Photo</p>
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div className=" col-span-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Image
                                    src={'/svgfile/menperson.svg'}
                                    className="h-8 w-8 text-[var(--colour-fsP2)]/60"
                                    alt={'user Profile'}
                                    height={30}
                                    width={30}
                                />
                                <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
                            </div>

                            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                <div>
                                    <dt className="text-xs font-medium text-gray-600 uppercase">Full Name</dt>
                                    <dd className="text-sm font-medium text-gray-900  border-gray-300 pb-1">{userInfo.name}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs font-medium text-gray-600 uppercase">Email Address</dt>
                                    <dd className="text-sm font-medium text-gray-900  border-gray-300 pb-1">{userInfo.email}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs font-medium text-gray-600 uppercase">Phone Number</dt>
                                    <dd className="text-sm font-medium text-gray-900  border-gray-300 pb-1">{userInfo.phone}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs font-medium text-gray-600 uppercase">Date of Birth</dt>
                                    <dd className="text-sm font-medium text-gray-900  border-gray-300 pb-1">{userInfo.dob}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs font-medium text-gray-600 uppercase">National ID</dt>
                                    <dd className="text-sm font-medium text-gray-900  border-gray-300 pb-1">{userInfo.nationalID}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs font-medium text-gray-600 uppercase">Gender</dt>
                                    <dd className="text-sm font-medium text-gray-900  border-gray-300 pb-1">{userInfo.gender}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs font-medium text-gray-600 uppercase">Marriage Status</dt>
                                    <dd className="text-sm font-medium text-gray-900  border-gray-300 pb-1">{userInfo.marriageStatus}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs font-medium text-gray-600 uppercase">Salary Amount</dt>
                                    <dd className="text-sm font-medium text-gray-900  border-gray-300 pb-1">Rs. {bankinfo.salaryAmount}</dd>
                                </div>
                            </div>

                            <div className="mt-2">
                                <dt className="text-xs font-medium text-gray-600 uppercase">Address</dt>
                                <dd className="text-sm font-medium text-gray-900  border-gray-300 pb-1">{userInfo.address}</dd>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Credit Card Details */}
                {hasCreditCard === 'yes' && (
                    <section className="mb-2 grid grid-cols-5 border-gray-200 pb-4">
                        <div className="col-span-1"></div>

                        <div className="col-span-4">

                            <div className="flex items-center gap-2 mb-3">
                                <Image
                                    src={'/svgfile/creditcardicon.svg'}
                                    className="h-8 w-8 text-[var(--colour-fsP2)]/60"
                                    alt={'user Profile'}
                                    height={30}
                                    width={30}
                                />
                                <h2 className="text-lg font-bold text-gray-900">Credit Card Information</h2>
                            </div>

                            <div className="bg-gray-50 p-3 rounded">
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                    <div>
                                        <dt className="text-xs font-medium text-gray-600 uppercase">Card Number</dt>
                                        <dd className="text-sm font-medium text-gray-900 border-b border-dotted border-gray-300 pb-1">**** **** **** {bankinfo.creditCardNumber?.slice(-4)}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-medium text-gray-600 uppercase">Card Holder Name</dt>
                                        <dd className="text-sm font-medium text-gray-900 border-b border-dotted border-gray-300 pb-1">{bankinfo.cardHolderName}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-medium text-gray-600 uppercase">Card Provider</dt>
                                        <dd className="text-sm font-medium text-gray-900 border-b border-dotted border-gray-300 pb-1">{bankinfo.creditCardProvider}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-medium text-gray-600 uppercase">Expiry Date</dt>
                                        <dd className="text-sm font-medium text-gray-900 border-b border-dotted border-gray-300 pb-1">{bankinfo.expiryDate}</dd>
                                    </div>
                                    <div className="col-span-2">
                                        <dt className="text-xs font-medium text-gray-600 uppercase">Credit Limit</dt>
                                        <dd className="text-sm font-medium text-gray-900 border-b border-dotted border-gray-300 pb-1">Rs. {bankinfo.cardLimit}</dd>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Bank Details */}
                {hasCreditCard === 'make' && (
                    <section className="mb-2 grid grid-cols-5   border-gray-200 pb-4">
                        <div className=" col-span-1"></div>
                        <div className="col-span-4">
                            <div className="flex items-center gap-2 mb-2">
                                <CreditCard className="text-blue-600" size={18} />
                                <h2 className="text-lg font-bold text-gray-900">Banking Information</h2>
                            </div>

                            <div className="bg-gray-50  rounded">
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                    <div>
                                        <dt className="text-xs font-medium text-gray-600 uppercase">Account Holder Name</dt>
                                        <dd className="text-sm font-medium text-gray-900  border-gray-300 pb-1">{bankinfo.accountHolderName}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-medium text-gray-600 uppercase">Bank Name</dt>
                                        <dd className="text-sm font-medium text-gray-900  border-gray-300 pb-1">{bankinfo.bankname}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-medium text-gray-600 uppercase">Account Number</dt>
                                        <dd className="text-sm font-medium text-gray-900  border-gray-300 pb-1">{bankinfo.accountNumber}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-medium text-gray-600 uppercase">Salary Amount</dt>
                                        <dd className="text-sm font-medium text-gray-900  border-gray-300 pb-1">Rs. {bankinfo.salaryAmount}</dd>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Guarantor Information */}
                {hasCreditCard === 'no' && (
                    <section className="mb-2 border-b grid grid-cols-5 border-gray-200 pb-4">
                               {/* Guarantor Photo */}
                            {/* <div className=" col-span-1">
                                <div className="w-20 h-24 bg-gray-100 border border-gray-300 rounded overflow-hidden">
                                    {files.granterDocument?.ppphoto ? (
                          
                                                     <Image
                                           src={previews['granter-ppphoto']}
                                            alt="Guarantor Photo"
                                            width={100}
                                            height={100}
                                            className="w-full h-full object-cover"
                                            priority
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                            <UserCheck size={24} className="text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1 text-center">Guarantor</p>
                            </div> */}

                                 <div className=" col-span-1">
                            <div className="flex flex-col justify-center items-center align-middle">
                                <div className="w-32 h-32 bg-gray-100 border border-gray-300 rounded overflow-hidden">
                                    {files.granterDocument?.ppphoto ? (
                          
                                                     <Image
                                           src={previews['granter-ppphoto']}
                                            alt="Guarantor Photo"
                                            width={100}
                                            height={100}
                                            className="w-full h-full object-cover"
                                            priority
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                            <Image
                                                src={'/svgfile/menperson.svg'}
                                                className="h-32 w-32 text-[var(--colour-fsP2)]/60"
                                                  alt="Guarantor Photo"
                                                height={30}
                                                width={30}
                                            />
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 text-center">Guarantor</p>
                            </div>
                        </div>

                            {/* Guarantor Details */}
                            <div className="col-span-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Image
                                        src={'/svgfile/menperson.svg'}
                                        className="h-8 w-8 text-[var(--colour-fsP2)]/60"
                                        alt={'user Profile'}
                                        height={30}
                                        width={30}
                                    />
                                    <h2 className="text-lg font-bold text-gray-900">Guarantor Information</h2>
                                </div>

                                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                    <div>
                                        <dt className="text-xs font-medium text-gray-600 uppercase">Full Name</dt>
                                        <dd className="text-sm font-medium text-gray-900  border-gray-300 pb-1">{granterPersonalDetails.name}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-medium text-gray-600 uppercase">Phone Number</dt>
                                        <dd className="text-sm font-medium text-gray-900  border-gray-300 pb-1">{granterPersonalDetails.phone}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-medium text-gray-600 uppercase">Citizenship Number</dt>
                                        <dd className="text-sm font-medium text-gray-900  border-gray-300 pb-1">{granterPersonalDetails.nationalID}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-medium text-gray-600 uppercase">Gender</dt>
                                        <dd className="text-sm font-medium text-gray-900  border-gray-300 pb-1">{granterPersonalDetails.gender}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-medium text-gray-600 uppercase">Marriage Status</dt>
                                        <dd className="text-sm font-medium text-gray-900  border-gray-300 pb-1">{granterPersonalDetails.marriageStatus}</dd>
                                    </div>
                                </div>

                                <div className="mt-2">
                                    <dt className="text-xs font-medium text-gray-600 uppercase">Address</dt>
                                    <dd className="text-sm font-medium text-gray-900 border-b border-dotted border-gray-300 pb-1">{granterPersonalDetails.address}</dd>
                                </div>
                            </div>
                    </section>
                )}

                {/* EMI Calculation */}
                <section className="mb-6 border-b grid grid-cols-5 border-gray-200 pb-4">
                    <div className="col-span-1"></div>
                    <div className="col-span-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Calculator className="text-blue-600" size={18} />
                            <h2 className="text-lg font-bold text-gray-900">EMI Calculation Details</h2>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 p-3 rounded">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <dt className="text-xs font-medium text-blue-600 uppercase mb-1">Down Payment</dt>
                                    <dd className="text-xl font-bold text-blue-800">Rs. {emiCalculation.downPayment || 0}</dd>
                                </div>
                                <div className="text-center">
                                    <dt className="text-xs font-medium text-blue-600 uppercase mb-1">Monthly EMI</dt>
                                    <dd className="text-xl font-bold text-blue-800">Rs. {emiData.monthlyEMI.toFixed(2)}</dd>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="text-center">
                                <dt className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">Down Payment</dt>
                                <dd className="text-3xl font-bold text-blue-800">Rs. {emiCalculation.downPayment || 0}</dd>
                            </div>
                            <div className="text-center">
                                <dt className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">Monthly EMI</dt>
                                <dd className="text-3xl font-bold text-blue-800">Rs. {emiData.monthlyEMI.toFixed(2)}</dd>
                            </div>
                        </div>
                    </div>

                </section>

                {/* Supporting Documents */}
                <section className="mb-6 border-b border-gray-200 pb-4">
                    <div className="flex items-center gap-2 mb-3">
                        <FileText className="text-blue-600" size={18} />
                        <h2 className="text-lg font-bold text-gray-900">Supporting Documents</h2>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                        {['front', 'back', 'bankStatement'].map((docType) => {
                            const isBankStatement = docType === 'bankStatement';
                            const file = isBankStatement ? files.bankStatement : files.citizenshipFile[docType];
                            const label = isBankStatement ? 'Bank Statement' : `Citizenship ${docType.charAt(0).toUpperCase() + docType.slice(1)}`;
                            const previewKey = isBankStatement ? 'bankStatement' : `citizenship-${docType}`;

                            return (
                                <div key={docType} className="text-center border border-gray-200 rounded p-2">
                                    <dt className="text-xs font-medium text-gray-600 uppercase mb-2">{label}</dt>
                                    {file ? (
                                        <div className="h-16 flex items-center justify-center mb-1">
                                            <Image
                                                src={previews[previewKey]}
                                                alt={label}
                                                width={60}
                                                height={60}
                                                className="max-h-16 object-contain rounded"
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-16 flex items-center justify-center mb-1 bg-gray-50 rounded">
                                            <FileText size={20} className="text-gray-400" />
                                        </div>
                                    )}
                                    <p className="text-xs text-gray-500">{file ? 'Uploaded' : 'Not uploaded'}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Guarantor Documents */}
                    {hasCreditCard === 'no' && (
                        <div className="mt-4">
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Guarantor Documents</h3>
                            <div className="grid grid-cols-4 gap-3">
                                {['front', 'back'].map((docType) => {
                                    const file = files.granterDocument[docType];
                                    const label = `Guarantor Citizenship ${docType.charAt(0).toUpperCase() + docType.slice(1)}`;
                                    const previewKey = `granter-${docType}`;

                                    return (
                                        <div key={docType} className="text-center border border-gray-200 rounded p-2">
                                            <dt className="text-xs font-medium text-gray-600 uppercase mb-2">{label}</dt>
                                            {file ? (
                                                <div className="h-16 flex items-center justify-center mb-1">
                                                    <Image
                                                        src={previews[previewKey]}
                                                        alt={label}
                                                        width={60}
                                                        height={60}
                                                        className="max-h-16 object-contain rounded"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="h-16 flex items-center justify-center mb-1 bg-gray-50 rounded">
                                                    <FileText size={20} className="text-gray-400" />
                                                </div>
                                            )}
                                            <p className="text-xs text-gray-500">{file ? 'Uploaded' : 'Not uploaded'}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </section>

                {/* Signature Section */}
                <section className="mb-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-800 mb-1">Declaration</h3>
                            <p className="text-xs text-gray-600 max-w-md leading-relaxed">
                                I hereby declare that all the information provided above is true and accurate to the best of my knowledge.
                                I understand that any false information may result in the rejection of my application.
                            </p>
                        </div>

                        <div className="text-center ml-4">
                            <Label className="text-xs font-medium text-gray-600 uppercase mb-2 block">
                                Applicant Signature
                            </Label>

                            <div className="relative group inline-block">
                                <input
                                    type="file"
                                    id="userSignature"
                                    onChange={(e) => handleFileChange(e, 'userSignature')}
                                    className="hidden"
                                />

                                <div className="border border-dashed border-gray-300 rounded p-2 bg-gray-50 w-32 h-16 flex items-center justify-center">
                                    {files.userSignature ? (
                                        <div className="relative">
                                            <Image
                                                src={previews.userSignature}
                                                alt="Signature"
                                                width={120}
                                                height={40}
                                                className="max-h-12 object-contain group-hover:opacity-70 transition-opacity"
                                            />

                                            {/* Hover overlay with actions */}
                                            <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 rounded">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button size="sm" variant="outline" className="bg-white/90 p-1">
                                                            <Eye size={12} />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-lg">
                                                        <Image
                                                            src={previews.userSignature}
                                                            alt="Signature Preview"
                                                            width={400}
                                                            height={150}
                                                            className="w-full h-auto rounded"
                                                        />
                                                    </DialogContent>
                                                </Dialog>

                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => document.getElementById('userSignature').click()}
                                                    className="bg-white/90 p-1"
                                                >
                                                    <Pencil size={12} />
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleFileDelete('userSignature')}
                                                    className="bg-white/90 text-red-600 p-1"
                                                >
                                                    <Trash size={12} />
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <label htmlFor="userSignature" className="cursor-pointer flex flex-col items-center gap-1">
                                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                <Pencil size={14} className="text-gray-500" />
                                            </div>
                                            <span className="text-xs text-gray-500">Sign</span>
                                        </label>
                                    )}
                                </div>

                                <div className="mt-1 text-center">
                                    <div className="border-t border-gray-400 w-28 mx-auto"></div>
                                    <p className="text-xs text-gray-500 mt-1">Date: {new Date().toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <Button
                        type="button"
                        onClick={handleBack}
                        variant="outline"
                        className="px-4 py-2 text-gray-600 border-gray-300 hover:bg-gray-50 text-sm"
                    >
                        ← Back to Edit
                    </Button>

                    <Button
                        type="button"
                        onClick={() => console.log('Submit:', emiContextInfo)}
                        className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 font-medium text-sm"
                    >
                        Submit Application
                    </Button>
                </div>
            </div>

            {/* Document Footer */}
            <div className="bg-gray-100 border-t border-gray-200 p-2 text-center text-xs text-gray-600">
                <p>This is a computer-generated document. Please verify all information before submission.</p>
                <p className="mt-1">For assistance, contact our support team at support@loanservice.com</p>
            </div>
        </div>
    );
};

export default RenderReview;