// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';

// interface ForgotPasswordFormProps {
//   forgotPassword: {
//     email: string;
//     isLoading: boolean;
//   };
//   setForgotPassword: (form: ForgotPasswordFormProps['forgotPassword']) => void;
//   handleForgotPassword: (e: React.FormEvent) => void;
//   setActiveTab: (tab: 'login' | 'register' | 'forgot') => void;
// }

// const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
//   forgotPassword,
//   setForgotPassword,
//   handleForgotPassword,
//   setActiveTab,
// }) => {
//   return (
//     <form onSubmit={handleForgotPassword} className="space-y-6">
//       <div>
//         <Label htmlFor="forgot-email" className="font-medium text-gray-700">
//           Email Address
//         </Label>
//         <Input
//           id="forgot-email"
//           type="email"
//           value={forgotPassword.email}
//           onChange={(e) => setForgotPassword({ ...forgotPassword, email: e.target.value })}
//           placeholder="you@example.com"
//           className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
//           required
//         />
//         <p className="text-sm text-gray-500 mt-2">
//           We'll send you a verification code to reset your password
//         </p>
//       </div>

//       <Button
//         type="submit"
//         className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
//         disabled={forgotPassword.isLoading}
//       >
//         {forgotPassword.isLoading ? 'Sending...' : 'Send Verification Code'}
//       </Button>

//       <div className="text-center">
//         <button
//           type="button"
//           onClick={() => setActiveTab('login')}
//           className="text-sm text-gray-600 hover:text-blue-600"
//         >
//           Back to login
//         </button>
//       </div>
//     </form>
//   );
// };

// export default ForgotPasswordForm;


import React from 'react'

function ForgotPasswordForm() {
  return (
    <div>ForgotPasswordForm</div>
  )
}

export default ForgotPasswordForm