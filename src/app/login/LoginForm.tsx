// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { AlertCircle, Eye, EyeOff } from 'lucide-react';
// import { cn } from '@/lib/utils';

// interface LoginFormProps {
//   loginForm: {
//     email: string;
//     password: string;
//     isLoading: boolean;
//     error: string | null;
//     isGoogleLoading: boolean;
//   };
//   setLoginForm: (form: LoginFormProps['loginForm']) => void;
//   handleLogin: (e: React.FormEvent) => void;
//   setActiveTab: (tab: 'login' | 'register' | 'forgot') => void;
//   togglePassword: { loginPassword: boolean };
//   handlePasswordToggle: (field: keyof LoginFormProps['togglePassword']) => void;
//   handleGoogleLogin: (credentialResponse: any) => void;
// }

// const LoginForm: React.FC<LoginFormProps> = ({
//   loginForm,
//   setLoginForm,
//   handleLogin,
//   setActiveTab,
//   togglePassword,
//   handlePasswordToggle,
//   handleGoogleLogin,
// }) => {
//   return (
//     <form onSubmit={handleLogin} className="space-y-6">
//       <div>
//         <Label htmlFor="email" className="font-medium text-gray-700">
//           Email
//         </Label>
//         <Input
//           id="email"
//           type="email"
//           value={loginForm.email}
//           onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
//           placeholder="you@example.com"
//           className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
//           required
//         />
//       </div>

//       <div>
//         <div className="flex items-center justify-between">
//           <Label htmlFor="password" className="font-medium text-gray-700">
//             Password
//           </Label>
//           <button
//             type="button"
//             onClick={() => setActiveTab('forgot')}
//             className="text-sm text-blue-600 hover:underline"
//           >
//             Forgot password?
//           </button>
//         </div>
//         <div className="relative">
//           <Input
//             id="password"
//             type={togglePassword.loginPassword ? 'text' : 'password'}
//             value={loginForm.password}
//             onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
//             placeholder="••••••••"
//             className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
//             required
//           />
//           <button
//             type="button"
//             onClick={() => handlePasswordToggle('loginPassword')}
//             className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//           >
//             {togglePassword.loginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//           </button>
//         </div>
//       </div>

//       {loginForm.error && (
//         <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md flex items-start">
//           <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
//           <span>{loginForm.error}</span>
//         </div>
//       )}

//       <Button
//         type="submit"
//         className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
//         disabled={loginForm.isLoading}
//       >
//         {loginForm.isLoading ? 'Signing in...' : 'Sign in'}
//       </Button>
//       {/* <GoogleLoginButton
//         onGoogleLogin={handleGoogleLogin}
//         isLoading={loginForm.isGoogleLoading}
//       /> */}
//     </form>
//   );
// };

// export default LoginForm;

import React from 'react'

function LoginForm() {
  return (
    <div>LoginForm</div>
  )
}

export default LoginForm