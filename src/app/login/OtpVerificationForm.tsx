// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { AlertCircle, Eye, EyeOff } from 'lucide-react';

// interface OtpVerificationFormProps {
//   forgotPassword: {
//     email: string;
//     otp: string;
//     newPassword: string;
//     confirmNewPassword: string;
//     isVerifyingOtp: boolean;
//     otpError: string | null;
//   };
//   setForgotPassword: (form: OtpVerificationFormProps['forgotPassword']) => void;
//   handleVerifyOtp: (e: React.FormEvent) => void;
//   handleForgotPassword: (e: React.FormEvent) => void;
//   togglePassword: { newPassword: boolean; confirmNewPassword: boolean };
//   handlePasswordToggle: (field: keyof OtpVerificationFormProps['togglePassword']) => void;
// }

// const OtpVerificationForm: React.FC<OtpVerificationFormProps> = ({
//   forgotPassword,
//   setForgotPassword,
//   handleVerifyOtp,
//   handleForgotPassword,
//   togglePassword,
//   handlePasswordToggle,
// }) => {
//   return (
//     <form onSubmit={handleVerifyOtp} className="space-y-6">
//       <div>
//         <Label htmlFor="otp-code" className="font-medium text-gray-700">
//           Verification Code
//         </Label>
//         <Input
//           id="otp-code"
//           type="text"
//           value={forgotPassword.otp}
//           onChange={(e) => setForgotPassword({ ...forgotPassword, otp: e.target.value })}
//           placeholder="123456"
//           className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
//           required
//         />
//         <p className="text-sm text-gray-500 mt-2">
//           Enter the verification code sent to {forgotPassword.email}
//         </p>
//       </div>

//       <div>
//         <Label htmlFor="new-password" className="font-medium text-gray-700">
//           New Password
//         </Label>
//         <div className="relative">
//           <Input
//             id="new-password"
//             type={togglePassword.newPassword ? 'text' : 'password'}
//             value={forgotPassword.newPassword}
//             onChange={(e) => setForgotPassword({ ...forgotPassword, newPassword: e.target.value })}
//             placeholder="••••••••"
//             className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
//             required
//           />
//           <button
//             type="button"
//             onClick={() => handlePasswordToggle('newPassword')}
//             className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//           >
//             {togglePassword.newPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//           </button>
//         </div>
//       </div>

//       <div>
//         <Label htmlFor="confirm-new-password" className="font-medium text-gray-700">
//           Confirm New Password
//         </Label>
//         <div className="relative">
//           <Input
//             id="confirm-new-password"
//             type={togglePassword.confirmNewPassword ? 'text' : 'password'}
//             value={forgotPassword.confirmNewPassword}
//             onChange={(e) => setForgotPassword({ ...forgotPassword, confirmNewPassword: e.target.value })}
//             placeholder="••••••••"
//             className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
//             required
//           />
//           <button
//             type="button"
//             onClick={() => handlePasswordToggle('confirmNewPassword')}
//             className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//           >
//             {togglePassword.confirmNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//           </button>
//         </div>
//       </div>

//       {forgotPassword.otpError && (
//         <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md flex items-start">
//           <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
//           <span>{forgotPassword.otpError}</span>
//         </div>
//       )}

//       <Button
//         type="submit"
//         className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
//         disabled={forgotPassword.isVerifyingOtp}
//       >
//         {forgotPassword.isVerifyingOtp ? 'Verifying...' : 'Reset Password'}
//       </Button>

//       <div className="flex justify-between text-sm">
//         <button
//           type="button"
//           onClick={() => setForgotPassword({ ...forgotPassword, showOtpVerification: false, resetSent: false })}
//           className="text-gray-600 hover:text-blue-600"
//         >
//           Try another email
//         </button>
//         <button
//           type="button"
//           onClick={() => handleForgotPassword(new Event('click') as any)}
//           className="text-blue-600 hover:underline"
//         >
//           Resend code
//         </button>
//       </div>
//     </form>
//   );
// };

// export default OtpVerificationForm;

import React from 'react'

function OtpVerificationForm() {
  return (
    <div>OtpVerificationForm</div>
  )
}

export default OtpVerificationForm