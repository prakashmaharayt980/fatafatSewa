// "use client";
// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { toast } from 'sonner';

// import RemoteServices from '../api/remoteservice';

// import LoginForm from './LoginForm';
// import RegisterForm from './RegisterForm';
// import ForgotPasswordForm from './ForgotPasswordForm';
// import OtpVerificationForm from './OtpVerificationForm';
// import ResetSuccess from './ResetSuccess';
// import EmailSentConfirmation from './EmailSentConformation'

// const AuthPage: React.FC = () => {
//     const router = useRouter();
//     const from = '/';
//     const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot'>('login');
//     const [loginForm, setLoginForm] = useState({
//         email: '',
//         password: '',
//         isLoading: false,
//         error: null as string | null,
//         isGoogleLoading: false,
//     });
//     const [registerForm, setRegisterForm] = useState({
//         name: '',
//         email: '',
//         password: '',
//         confirmPassword: '',
//         address: '',
//         phoneNumber: '',
//         isLoading: false,
//         error: null as string | null,
//     });
//     const [forgotPassword, setForgotPassword] = useState({
//         email: '',
//         isLoading: false,
//         resetSent: false,
//         showOtpVerification: true,
//         otp: '',
//         newPassword: '',
//         confirmNewPassword: '',
//         isVerifyingOtp: false,
//         otpError: null as string | null,
//         resetSuccess: false,
//     });
//     const [togglePassword, setTogglePassword] = useState({
//         loginPassword: false,
//         registerPassword: false,
//         registerConfirmPassword: false,
//         newPassword: false,
//         confirmNewPassword: false,
//     });
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     const handleLogin = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setLoginForm((prev) => ({ ...prev, error: null }));

//         if (!loginForm.email || !loginForm.password) {
//             setLoginForm((prev) => ({ ...prev, error: 'Please fill in all fields' }));
//             return;
//         }

//         if (!emailRegex.test(loginForm.email)) {
//             setLoginForm((prev) => ({ ...prev, error: 'Please enter a valid email address' }));
//             return;
//         }

//         setLoginForm((prev) => ({ ...prev, isLoading: true }));
//         try {
//             const response = await RemoteServices.Login({
//                 email: loginForm.email,
//                 password: loginForm.password,
//             });

//             if (response.status === 200) {
//                 const user = response.data.user;
//                 localStorage.setItem('user', JSON.stringify(user));
//                 localStorage.setItem('token', response.data.access);
//                 localStorage.setItem('refresh_token', response.data.refresh);

//                 toast("Login Successful", {
//                     description: `Welcome back, ${user.name || 'User'}!`,
//                 });

//                 setTimeout(() => {
//                     router.push(from);
//                 }, 1500);
//             }
//         } catch (error) {
//             console.error('Login error:', error);
//             toast("Login Failed", {
//                 description: "Invalid email or password. Please try again.",
//             });
//             setLoginForm((prev) => ({ ...prev, error: 'Invalid email or password. Please try again.' }));
//         } finally {
//             setLoginForm((prev) => ({ ...prev, isLoading: false }));
//         }
//     };

//     const handleRegister = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setRegisterForm((prev) => ({ ...prev, error: null }));

//         if (
//             !registerForm.name ||
//             !registerForm.email ||
//             !registerForm.password ||
//             !registerForm.confirmPassword ||
//             !registerForm.address ||
//             !registerForm.phoneNumber
//         ) {
//             setRegisterForm((prev) => ({ ...prev, error: 'Please fill in all required fields' }));
//             return;
//         }

//         if (!emailRegex.test(registerForm.email)) {
//             setRegisterForm((prev) => ({ ...prev, error: 'Please enter a valid email address' }));
//             return;
//         }

//         if (registerForm.password.length < 8) {
//             setRegisterForm((prev) => ({ ...prev, error: 'Password must be at least 8 characters long' }));
//             return;
//         }

//         if (registerForm.password !== registerForm.confirmPassword) {
//             setRegisterForm((prev) => ({ ...prev, error: 'Passwords do not match' }));
//             return;
//         }

//         setRegisterForm((prev) => ({ ...prev, isLoading: true }));
//         try {
//             const response = await RemoteServices.Register({
//                 email: registerForm.email,
//                 password: registerForm.password,
//                 name: registerForm.name,
//                 address: registerForm.address,
//                 phone_number: registerForm.phoneNumber,
//             });

//             if (response.status === 201) {
//                 toast("Registration Successful", {
//                     description: `Thank you for registering, ${registerForm.name}!`,
//                 });

//                 setRegisterForm({
//                     name: '',
//                     email: '',
//                     password: '',
//                     confirmPassword: '',
//                     address: '',
//                     phoneNumber: '',
//                     isLoading: false,
//                     error: null,
//                 });

//                 setActiveTab('login');
//             }
//         } catch (error: any) {
//             console.error('Registration error:', error);
//             let errorMessage = 'Registration failed. Please try again.';
//             if (error.response?.data?.email) {
//                 errorMessage = `Email error: ${error.response.data.email[0]}`;
//             } else if (error.response?.data?.detail) {
//                 errorMessage = error.response.data.detail;
//             }

//             setRegisterForm((prev) => ({ ...prev, error: errorMessage }));
//             toast("Registration Failed", {
//                 description: "There was a problem creating your account. Please try again.",
//             });
//         } finally {
//             setRegisterForm((prev) => ({ ...prev, isLoading: false }));
//         }
//     };

//     const handleForgotPassword = async (e: React.FormEvent) => {
//         e.preventDefault();

//         if (!forgotPassword.email) {
//             toast("Error", {
//                 description: "Please enter your email address",
//             });
//             return;
//         }

//         if (!emailRegex.test(forgotPassword.email)) {
//             toast("Error", {
//                 description: "Please enter a valid email address",
//             });
//             return;
//         }

//         setForgotPassword((prev) => ({ ...prev, isLoading: true }));
//         try {
//             await RemoteServices.ForgottenPassword({ email: forgotPassword.email });

//             setForgotPassword((prev) => ({ ...prev, resetSent: true, showOtpVerification: true }));
//             toast("OTP Sent", {
//                 description: "Please check your email for the verification code",
//             });
//         } catch (error) {
//             console.error('Password reset error:', error);
//             toast("Request Failed", {
//                 description: "We couldn't process your request. Please try again later.",
//             });
//         } finally {
//             setForgotPassword((prev) => ({ ...prev, isLoading: false }));
//         }
//     };

//     const handleVerifyOtp = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setForgotPassword((prev) => ({ ...prev, otpError: null }));

//         if (!forgotPassword.otp) {
//             setForgotPassword((prev) => ({ ...prev, otpError: 'Please enter the verification code' }));
//             return;
//         }

//         if (!forgotPassword.newPassword) {
//             setForgotPassword((prev) => ({ ...prev, otpError: 'Please enter a new password' }));
//             return;
//         }

//         if (forgotPassword.newPassword.length < 8) {
//             setForgotPassword((prev) => ({ ...prev, otpError: 'Password must be at least 8 characters long' }));
//             return;
//         }

//         if (forgotPassword.newPassword !== forgotPassword.confirmNewPassword) {
//             setForgotPassword((prev) => ({ ...prev, otpError: 'Passwords do not match' }));
//             return;
//         }

//         setForgotPassword((prev) => ({ ...prev, isVerifyingOtp: true }));
//         try {
//             await RemoteServices.VerifyOtp({
//                 email: forgotPassword.email,
//                 otp: forgotPassword.otp,
//                 new_password: forgotPassword.newPassword,
//             });

//             setForgotPassword((prev) => ({
//                 ...prev,
//                 resetSuccess: true,
//                 showOtpVerification: false,
//                 otp: '',
//                 newPassword: '',
//                 confirmNewPassword: '',
//             }));

//             toast("Password Reset Successful", {
//                 description: "Your password has been successfully reset. You can now login with your new password.",
//             });

//             setTimeout(() => {
//                 setActiveTab('login');
//                 setForgotPassword((prev) => ({
//                     ...prev,
//                     resetSent: false,
//                     resetSuccess: false,
//                 }));
//             }, 3000);
//         } catch (error: any) {
//             console.error('OTP verification error:', error);
//             const errorMessage = error.response?.data?.detail || 'Verification failed. Please try again.';
//             setForgotPassword((prev) => ({ ...prev, otpError: errorMessage }));
//             toast("Verification Failed", {
//                 description: "The verification code is invalid or has expired.",
//             });
//         } finally {
//             setForgotPassword((prev) => ({ ...prev, isVerifyingOtp: false }));
//         }
//     };

//     const handleResetPasswordFlow = () => {
//         setForgotPassword({
//             email: '',
//             isLoading: false,
//             resetSent: false,
//             showOtpVerification: false,
//             otp: '',
//             newPassword: '',
//             confirmNewPassword: '',
//             isVerifyingOtp: false,
//             otpError: null,
//             resetSuccess: false,
//         });
//         setActiveTab('login');
//     };

//     const handleGoogleLogin = async (credentialResponse: any) => {
//         setLoginForm((prev) => ({ ...prev, isGoogleLoading: true }));
//         const id_token = credentialResponse.credential;
//         const address = 'http://127.0.0.1:8000/api/';

//         try {
//             const response = await fetch(`${address}account/auth/google/login/`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ id_token }),
//             });

//             const data = await response.json();

//             if (response.ok) {
//                 const user = data.user;
//                 localStorage.setItem('user', JSON.stringify(user));
//                 localStorage.setItem('token', data.access_token);
//                 localStorage.setItem('refresh_token', data.refresh_token);

//                 toast("Login Successful", {
//                     description: `Welcome back, ${user?.name || 'User'}!`,
//                 });

//                 setTimeout(() => {
//                     router.push(from);
//                 }, 1500);
//             } else {
//                 toast("Login Failed", {
//                     description: data?.error || "Something went wrong during sign-in.",
//                 });
//                 setLoginForm((prev) => ({ ...prev, error: data?.error || "Something went wrong during sign-in." }));
//             }
//         } catch (error) {
//             console.error('Google login error:', error);
//             toast("Login Failed", {
//                 description: "Failed to sign in with Google. Please try again.",
//             });
//             setLoginForm((prev) => ({ ...prev, error: 'Failed to sign in with Google. Please try again.' }));
//         } finally {
//             setLoginForm((prev) => ({ ...prev, isGoogleLoading: false }));
//         }
//     };

//     const handlePasswordToggle = (field: keyof typeof togglePassword) => {
//         setTogglePassword((prev) => ({ ...prev, [field]: !prev[field] }));
//     };

//     const renderContent = () => {
//         if (activeTab === 'forgot') {
//             if (forgotPassword.resetSuccess) {
//                 return <ResetSuccess handleResetPasswordFlow={handleResetPasswordFlow} />;
//             } else if (forgotPassword.showOtpVerification) {
//                 return <OtpVerificationForm
//                     forgotPassword={forgotPassword}
//                     setForgotPassword={setForgotPassword}
//                     handleVerifyOtp={handleVerifyOtp}
//                     handleForgotPassword={handleForgotPassword}
//                     togglePassword={togglePassword}
//                     handlePasswordToggle={handlePasswordToggle}
//                 />;
//             } else if (forgotPassword.resetSent) {
//                 return <EmailSentConfirmation
//                     forgotPassword={forgotPassword}
//                     setForgotPassword={setForgotPassword}
//                     handleForgotPassword={handleForgotPassword}
//                     setActiveTab={setActiveTab}
//                 />;
//             } else {
//                 return <ForgotPasswordForm
//                     forgotPassword={forgotPassword}
//                     setForgotPassword={setForgotPassword}
//                     handleForgotPassword={handleForgotPassword}
//                     setActiveTab={setActiveTab}
//                 />;
//             }
//         }

//         return (
//             <div>
//                 <div className="flex bg-gray-100 rounded-lg p-1 mb-8">
//                     <button
//                         onClick={() => setActiveTab('login')}
//                         className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${activeTab === 'login'
//                                 ? 'bg-white text-gray-900 shadow-sm'
//                                 : 'text-gray-500 hover:text-gray-700'
//                             }`}
//                     >
//                         Login
//                     </button>
//                     <button
//                         onClick={() => setActiveTab('register')}
//                         className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${activeTab === 'register'
//                                 ? 'bg-white text-gray-900 shadow-sm'
//                                 : 'text-gray-500 hover:text-gray-700'
//                             }`}
//                     >
//                         Register
//                     </button>
//                 </div>

//                 {activeTab === 'login' ? <LoginForm
//                     loginForm={loginForm}
//                     setLoginForm={setLoginForm}
//                     handleLogin={handleLogin}
//                     setActiveTab={setActiveTab}
//                     togglePassword={togglePassword}
//                     handlePasswordToggle={handlePasswordToggle}
//                     handleGoogleLogin={handleGoogleLogin}
//                 /> : <RegisterForm
//                     registerForm={registerForm}
//                     setRegisterForm={setRegisterForm}
//                     handleRegister={handleRegister}
//                     togglePassword={togglePassword}
//                     handlePasswordToggle={handlePasswordToggle}
//                 />}
//             </div>
//         );
//     };

//     return (
//         <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md p-8 transform transition-all duration-300 scale-100">
//                 <div className="text-center mb-8">
//                     <h2 className="text-2xl font-bold text-gray-900 mb-2">
//                         {activeTab === 'forgot'
//                             ? 'Reset Password'
//                             : activeTab === 'login'
//                                 ? 'Welcome Back'
//                                 : 'Create Account'
//                         }
//                     </h2>
//                     {activeTab !== 'forgot' && (
//                         <p className="text-gray-600">
//                             {activeTab === 'login'
//                                 ? 'Sign in to your account to continue'
//                                 : 'Join us today and get started'
//                             }
//                         </p>
//                     )}
//                 </div>

//                 {renderContent()}
//             </div>
//         </div>
//     );
// };

// export default AuthPage;


import React from 'react'

function page() {
  return (
    <div>page</div>
  )
}

export default page
