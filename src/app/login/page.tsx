'use client'

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle, Eye, EyeOff, Facebook, Mail, User, Phone, Home, Lock, Key, IdCardLanyard } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { CompanyLogo, PaymentMethodsOptions } from "../CommonVue/Payment";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useContextCart } from "../checkout/CartContext";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const { loginDailog, loginNeed } = useContextCart();
  const [activeSection, setActiveSection] = useState('login');
  const [formData, setFormData] = useState({
    login: { email: '', password: '' },
    register: { name: '', email: '', password: '', confirmPassword: '', phoneNumber: '', address: '' },
    forgot: { email: '' },
    verify: { otpCode: '', newPassword: '', confirmNewPassword: '' },
  });
  const [showPassword, setShowPassword] = useState({
    loginPassword: false,
    registerPassword: false,
    registerConfirmPassword: false,
    verifyNewPassword: false,
    verifyConfirmNewPassword: false,
  });

  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const toggleShowPassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const sectionFields = {
    login: [
      { id: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com', icon: Mail, required: true },
      {
        id: 'password',
        label: 'Password',
        type: 'password',
        placeholder: '••••••••',
        icon: Lock,
        showPasswordToggle: true,
        required: true,
        passwordField: 'loginPassword',
        extra: (
          <div className="flex justify-end mt-2">
            <button
              type="button"
              onClick={() => setActiveSection('forgot')}
              className="text-xs text-blue-500 cursor-pointer  hover:underline transition-colors duration-150"
            >
              Forgot password?
            </button>
          </div>
        ),
      },
    ],
    register: [
      { id: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', icon: User, required: true },
      { id: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com', icon: Mail, required: true },
      {
        id: 'password',
        label: 'Password',
        type: 'password',
        placeholder: '••••••••',
        icon: Lock,
        showPasswordToggle: true,
        required: true,
        passwordField: 'registerPassword',
      },
      {
        id: 'confirmPassword',
        label: 'Confirm Password',
        type: 'password',
        placeholder: '••••••••',
        icon: Lock,
        showPasswordToggle: true,
        required: true,
        passwordField: 'registerConfirmPassword',
      },
      { id: 'phoneNumber', label: 'Phone Number', type: 'tel', placeholder: '(123) 456-7890', icon: Phone },
      { id: 'address', label: 'Address', type: 'text', placeholder: '123 Main St, City', icon: Home },
    ],
    forgot: [
      {
        id: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'you@example.com',
        icon: Mail,
        required: true,
        helperText: "We'll send you a verification code",
      },
    ],
    verify: [
      {
        id: 'otpCode',
        label: 'Verification Code',
        type: 'text',
        placeholder: '123456',
        icon: Key,
        required: true,
        helperText: 'Enter the code sent to your email',
      },
      {
        id: 'newPassword',
        label: 'New Password',
        type: 'password',
        placeholder: '••••••••',
        icon: Lock,
        showPasswordToggle: true,
        required: true,
        passwordField: 'verifyNewPassword',
      },
      {
        id: 'confirmNewPassword',
        label: 'Confirm New Password',
        type: 'password',
        placeholder: '••••••••',
        icon: Lock,
        showPasswordToggle: true,
        required: true,
        passwordField: 'verifyConfirmNewPassword',
      },
    ],
  };

  const sections = {
    login: {
      render: () => (
        <div className="flex flex-col space-y-4">
          <form className="flex flex-col space-y-4">
            {sectionFields.login.map((field) => (
              <div key={field.id} className="relative">
                <Label htmlFor={field.id} className="text-[var(--colour-fsP2)]  my-2" >{field.label}</Label>
                <div className="relative">
                  <Input
                    id={field.id}
                    type={field.showPasswordToggle && showPassword[field.passwordField] ? 'text' : field.type}
                    placeholder={field.placeholder}
                    value={formData.login[field.id]}
                    onChange={(e) => handleInputChange('login', field.id, e.target.value)}
                    required={field.required}
                    className="pl-10 pr-10 h-10 bg-white border-blue-200  border-2 focus:border-0 focus:ring-1 focus:ring-[var(--colour-fsP2)]   text-sm rounded-lg transition-colors duration-150"
                  />
                  {field.icon && (
                    <field.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--colour-fsP2)]" />
                  )}
                  {field.showPasswordToggle && (
                    <button
                      type="button"
                      onClick={() => toggleShowPassword(field.passwordField)}
                      className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-[var(--colour-fsP2)] hover:text-[var(--colour-fsP1)]"
                    >
                      {showPassword[field.passwordField] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                </div>
                {field.extra}
              </div>
            ))}
            <Button
              type="submit"
              className="w-full cursor-pointer h-10 bg-[var(--colour-fsP2)] hover:bg-[var(--colour-fsP1)] text-white text-sm font-medium rounded-lg transition-all duration-150"
            >
              <IdCardLanyard className="w-5 h-5" />
              Sign In
            </Button>
          </form>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="flex-1 h-10 border-blue-200 hover:bg-blue-50 text-gray-600 cursor-pointer text-sm font-medium rounded-lg transition-all duration-150"
            >
              {/* <Image fill src="/google-icon.svg" alt="Google" className="w-4 h-4 mr-2" /> */}
              <Facebook className="w-4 h-4 mr-2 text-[var(--colour-fsP1)]" />
              Sign in with Google
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-10 border-blue-200 hover:bg-blue-50 text-gray-600 cursor-pointer text-sm font-medium rounded-lg transition-all duration-150"
            >
              <Facebook className="w-4 h-4 mr-2 text-[var(--colour-fsP1)]" />
              Sign in with Facebook
            </Button>
          </div>
          <div className="text-center">
            <button
              type="button"
              onClick={() => setActiveSection('register')}
              className="text-xs text-[var(--colour-fsP2)] hover:text-[var(--colour-fsP1)]/80 cursor-pointer hover:underline transition-colors duration-150"
            >
              Don’t have an account? Register
            </button>
          </div>
        </div>
      ),
    },
    register: {
      render: () => (
        <div className="space-y-4">
          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sectionFields.register.map((field, index) => (
                <div key={field.id} className={index < 4 ? 'col-span-1' : 'col-span-1 sm:col-span-2'}>
                  <Label htmlFor={field.id} className="text-[var(--colour-fsP2)]  my-2" >{field.label}</Label>
                  <div className="relative">
                    <Input
                      id={field.id}
                      type={field.showPasswordToggle && showPassword[field.passwordField] ? 'text' : field.type}
                      placeholder={field.placeholder}
                      value={formData.register[field.id]}
                      onChange={(e) => handleInputChange('register', field.id, e.target.value)}
                      required={field.required}
                      className="pl-10 pr-10 h-10 bg-white border-blue-200  border-2 focus:border-0 focus:ring-1 focus:ring-[var(--colour-fsP2)]   text-sm rounded-lg transition-colors duration-150"
                    />
                    {field.icon && (
                      <field.icon className="absolute left-3 top-1/2 cursor-pointer transform -translate-y-1/2 w-4 h-4 text-[var(--colour-fsP2)]" />
                    )}
                    {field.showPasswordToggle && (
                      <button
                        type="button"
                        onClick={() => toggleShowPassword(field.passwordField)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--colour-fsP2)] cursor-pointer hover:text-[var(--colour-fsP1)]"
                      >
                        {showPassword[field.passwordField] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Button
              type="submit"
              className="w-full cursor-pointer h-10 bg-[var(--colour-fsP2)] hover:bg-[var(--colour-fsP1)] text-white text-sm font-medium rounded-lg transition-all duration-150"
            >
              Create Account
            </Button>
          </form>
          <div className="text-center">
            <button
              type="button"
              onClick={() => setActiveSection('login')}
              className="text-xs text-[var(--colour-fsP2)] hover:text-[var(--colour-fsP1)]/80 cursor-pointer hover:underline transition-colors duration-150"
            >
              Already have an account? Login
            </button>
          </div>
        </div>
      ),
    },
    forgot: {
      render: () => (
        <div className="space-y-4">
          <form className="space-y-4">
            {sectionFields.forgot.map((field) => (
              <div key={field.id}>
                <Label htmlFor={field.id} className="text-[var(--colour-fsP2)]  my-2" >{field.label}</Label>
                <div className="relative">
                  <Input
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData.forgot[field.id]}
                    onChange={(e) => handleInputChange('forgot', field.id, e.target.value)}
                    required={field.required}
                    className="pl-10 pr-10 h-10 bg-white border-blue-200  border-2 focus:border-0 focus:ring-1 focus:ring-[var(--colour-fsP2)]   text-sm rounded-lg transition-colors duration-150"

                  />
                  {field.icon && (
                    <field.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--colour-fsP2)]" />
                  )}
                </div>
                {field.helperText && (
                  <p className="mt-1 text-xs text-gray-600">{field.helperText}</p>
                )}
              </div>
            ))}
            <Button
              onClick={() => setActiveSection('emailSent')}
              className="w-full cursor-pointer h-10 bg-[var(--colour-fsP2)] hover:bg-[var(--colour-fsP1)] text-white text-sm font-medium rounded-lg transition-all duration-150"
            >
              Send Verification Code
            </Button>
          </form>
          <div className="flex justify-between text-xs">
            <button
              type="button"
              onClick={() => setActiveSection('login')}
              className="text-gray-600 hover:text-teal-600 hover:underline transition-colors duration-150"
            >
              Back to login
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('register')}
              className="text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-150"
            >
              Register
            </button>
          </div>
        </div>
      ),
    },
    verify: {
      render: () => (
        <div className="space-y-4">
          <form className="space-y-4">
            {sectionFields.verify.map((field) => (
              <div key={field.id}>
                <Label htmlFor={field.id} className="text-[var(--colour-fsP2)]  my-2" >{field.label}</Label>
                <div className="relative">
                  <Input
                    id={field.id}
                    type={field.showPasswordToggle && showPassword[field.passwordField] ? 'text' : field.type}
                    placeholder={field.placeholder}
                    value={formData.verify[field.id]}
                    onChange={(e) => handleInputChange('verify', field.id, e.target.value)}
                    required={field.required}
                          className="pl-10 pr-10 h-10 bg-white border-blue-200  border-2 focus:border-0 focus:ring-1 focus:ring-[var(--colour-fsP2)]   text-sm rounded-lg transition-colors duration-150"
                  />
                  {field.icon && (
                    <field.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--colour-fsP2)]" />
                  )}
                  {field.showPasswordToggle && (
                    <button
                      type="button"
                      onClick={() => toggleShowPassword(field.passwordField)}
                                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--colour-fsP2)] cursor-pointer hover:text-[var(--colour-fsP1)]"
                    >
                      {showPassword[field.passwordField] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                </div>
                {field.helperText && (
                  <p className="mt-1 text-xs text-gray-600">{field.helperText}</p>
                )}
              </div>
            ))}
            <div className="text-xs text-red-600 bg-red-50 p-2 rounded-lg flex items-center">
              <AlertCircle className="h-4 w-4 mr-1.5" />
              Verification failed. Please try again.
            </div>
            <Button
              onClick={() => setActiveSection('login')}
              className="w-full cursor-pointer h-10 bg-[var(--colour-fsP2)] hover:bg-[var(--colour-fsP1)] text-white text-sm font-medium rounded-lg transition-all duration-150"
            >
              Reset Password
            </Button>
          </form>
          <div className="flex justify-between text-xs">
            <button
              type="button"
              onClick={() => setActiveSection('forgot')}
              className="text-gray-600 hover:text-teal-600 hover:underline transition-colors duration-150"
            >
              Try another email
            </button>
            <button
              type="button"
              className="text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-150"
            >
              Resend code
            </button>
          </div>
        </div>
      ),
    },
    emailSent: {
      render: () => (
        <div className="space-y-4 text-center">
          <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-teal-50">
            <CheckCircle className="h-8 w-8 text-teal-600" />
          </div>
          <div>
            <h3 className="text-base font-medium text-gray-900">Check Your Email</h3>
            <p className="mt-1 text-xs text-gray-600">
              We’ve sent a verification code to <strong>your email</strong>
            </p>
          </div>
          <Button
            onClick={() => setActiveSection('verify')}
            className="w-full cursor-pointer h-10 bg-[var(--colour-fsP2)] hover:bg-[var(--colour-fsP1)] text-white text-sm font-medium rounded-lg transition-all duration-150"
          >
            Enter Verification Code
          </Button>
          <div className="flex justify-between text-xs">
            <button
              type="button"
              onClick={() => setActiveSection('login')}
              className="text-gray-600 hover:text-yellow-600 hover:underline cursor-pointer transition-colors duration-150"
            >
              Back to login
            </button>
            <button
              type="button"
              className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer transition-colors duration-150"
            >
              Resend code
            </button>
          </div>
        </div>
      ),
    },
    resetSuccess: {
      render: () => (
        <div className="space-y-4 text-center">
          <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-teal-50">
            <CheckCircle className="h-5 w-5 text-teal-600" />
          </div>
          <div>
            <h3 className="text-base font-medium text-gray-900">Password Reset Successful</h3>
            <p className="mt-1 text-xs text-gray-600">
              Your password has been reset. You can now login.
            </p>
          </div>
          <Button
            onClick={() => setActiveSection('login')}
            className="w-full h-10 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-all duration-150"
          >
            Back to Login
          </Button>
        </div>
      ),
    },
  };

  return (
    <Dialog open={loginDailog} onOpenChange={loginNeed} aria-label="Fatafatsewa Login Dialog">
      <DialogContent className="w-[95%] max-w-[420px] sm:max-w-[480px] min-h-[50vh] max-h-[90vh] bg-gradient-to-b from-white to-teal-50 p-4 sm:p-6 rounded-2xl border border-gray-300 flex flex-col gap-4 overflow-y-auto">
        <DialogHeader className="flex flex-col items-center">
          <DialogTitle hidden>login</DialogTitle>
          <Image
            src={CompanyLogo}
            alt="Fatafatsewa Company Logo"
            width={140}
            height={40}
            className="object-contain w-[120px] sm:w-[140px]"
          />
        </DialogHeader>

        <hr className="border-t border-teal-100" />

        <div className="flex-1 w-full max-w-[380px] mx-auto">
          {sections[activeSection]?.render()}
        </div>

        <DialogFooter style={{
          justifyContent:'center'
        }} >
          <div className="mt-4 flex  justify-center">
            <div className="flex flex-wrap gap-2 sm:justify-center">
              {PaymentMethodsOptions.map((Item, index) => (
                <div
                  key={index}
                  className="flex items-center p-1.5 rounded-md bg-white border border-teal-100 hover:bg-teal-50 transition-all duration-150"
                >
                  <Image
                    src={Item.img}
                    alt={Item.name || "Payment Method Logo"}
                    width={36}
                    height={24}
                    className="object-contain w-[30px] sm:w-[36px]"
                  />
                </div>
              ))}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}