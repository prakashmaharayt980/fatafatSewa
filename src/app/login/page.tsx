'use client'

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,

} from "@/components/ui/dialog";
import { AlertCircle, CheckCircle, Eye, EyeOff, Facebook, Mail, User, Phone, Home, Lock, Key, GoalIcon } from 'lucide-react';
import Image from 'next/image';
import { useContextStore } from "../api/ContextStore";
import { useState } from 'react';
import { CompanyLogo, PaymentMethodsOptions } from "../CommonVue/Payment";
import { DialogTitle } from "@radix-ui/react-dialog";

const MaterialInput = ({
  id,
  type = 'text',
  label,
  value,
  onChange,
  icon: Icon,
  showPasswordToggle = false,
  error = false,
  helperText = '',
  required = false
}) => {
  const [focusedField, setFocusedField] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const isFocused = focusedField === id;
  const hasValue = value && value.length > 0;
  const isFloating = isFocused || hasValue;

  return (
    <div className="relative">
      <div className={`relative border rounded-lg transition-all duration-200 bg-white ${error
        ? 'border-red-500'
        : isFocused
          ? 'border-blue-500'
          : 'border-gray-200 hover:border-gray-300'
        }`}>
        {Icon && (
          <Icon className={`absolute left-3 top-3 w-4 h-4 transition-colors duration-200 ${error
            ? 'text-red-500'
            : isFocused
              ? 'text-blue-500'
              : 'text-gray-400'
            }`} />
        )}
        <input
          id={id}
          type={showPasswordToggle && showPassword ? 'text' : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocusedField(id)}
          onBlur={() => setFocusedField('')}
          required={required}
          className={`w-full h-11 bg-transparent rounded-lg transition-all duration-200 border-0 focus:outline-none text-sm
            ${Icon ? 'pl-10' : 'pl-4'} ${showPasswordToggle ? 'pr-10' : 'pr-4'} 
            ${isFloating ? 'pt-5 pb-2' : 'pt-3 pb-3'}`}
        />
        <label
          htmlFor={id}
          className={`absolute left-4 transition-all duration-200 pointer-events-none bg-white px-1
            ${Icon ? 'ml-6' : ''}
            ${error ? 'text-red-500' : isFocused ? 'text-blue-500' : 'text-gray-500'}
            ${isFloating
              ? 'top-1 text-xs font-medium'
              : 'top-3 text-sm'
            }`}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute right-3 top-3.5 transition-colors duration-200 ${error ? 'text-red-500' : 'text-gray-400 hover:text-gray-500'
              }`}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {helperText && (
        <p className={`text-xs mt-1.5 ml-4 ${error ? 'text-red-500' : 'text-gray-500'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default function LoginPage() {
  const { loginDailog, loginNeed } = useContextStore();
  const [activeSection, setActiveSection] = useState('login');
  const [formData, setFormData] = useState({
    login: { email: '', password: '' },
    register: { name: '', email: '', password: '', confirmPassword: '', phoneNumber: '', address: '' },
    forgot: { email: '' },
    verify: { otpCode: '', newPassword: '', confirmNewPassword: '' },
  });

  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
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
        extra: (
          <div className="flex items-center justify-end mt-1.5">
            <button
              type="button"
              onClick={() => setActiveSection('forgot')}
              className="text-xs text-blue-500 hover:underline"
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
      },
      {
        id: 'confirmPassword',
        label: 'Confirm Password',
        type: 'password',
        placeholder: '••••••••',
        icon: Lock,
        showPasswordToggle: true,
        required: true,
      },
      { id: 'phoneNumber', label: 'Phone Number', type: 'tel', placeholder: '(123) 456-7890', icon: Phone },
      { id: 'address', label: 'Address', type: 'text', placeholder: '123 Main St, City, State, ZIP', icon: Home },
    ],
    forgot: [
      {
        id: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'you@example.com',
        icon: Mail,
        required: true,
        helperText: "We'll send you a verification code to reset your password",
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
        helperText: 'Enter the verification code sent to your email',
      },
      {
        id: 'newPassword',
        label: 'New Password',
        type: 'password',
        placeholder: '••••••••',
        icon: Lock,
        showPasswordToggle: true,
        required: true,
      },
      {
        id: 'confirmNewPassword',
        label: 'Confirm New Password',
        type: 'password',
        placeholder: '••••••••',
        icon: Lock,
        showPasswordToggle: true,
        required: true,
      },
    ],
  };

  const sections = {
    login: {
      render: () => (
        <div className="flex flex-col justify-end space-y-3 h-full">
          <form className="flex flex-col space-y-3 ">



            {sectionFields.login.map((field) => (
              <div key={field.id}>
                <MaterialInput
                  id={field.id}
                  type={field.type}
                  label={field.label}
                  value={formData.login[field.id]}
                  onChange={(value) => handleInputChange('login', field.id, value)}
                  icon={field.icon}
                  showPasswordToggle={field.showPasswordToggle}
                  required={field.required}

                />
                {field.extra}
              </div>
            ))}
            <Button
              type="submit"
              className="w-full h-11 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-all"
            >
              Sign in
            </Button>
          </form>
          <div className="flex flex-row justify-between gap-4">
            <Button
              variant="outline"
              className="flex-1 h-11 flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-all"
            >
              <GoalIcon size={16} />
              Sign in with Google
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-11 flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-all"
            >
              <Facebook size={16} color="#1877F2" />
              Sign in with Facebook
            </Button>
          </div>
          <div className="text-center">
            <button
              type="button"
              onClick={() => setActiveSection('register')}
              className="text-xs text-blue-500 hover:underline"
            >
              Don&lsquo;t have an account? Register
            </button>
          </div>
        </div>
      ),
    },
    register: {
      render: () => (
        <div className="space-y-4">
          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sectionFields.register.map((field, index) => (
                <div key={field.id} className={index < 2 ? '' : index < 4 ? 'col-span-1' : 'col-span-2'}>
                  <MaterialInput
                    id={field.id}
                    type={field.type}
                    label={field.label}
                    value={formData.register[field.id]}
                    onChange={(value) => handleInputChange('register', field.id, value)}
                    icon={field.icon}
                    showPasswordToggle={field.showPasswordToggle}
                    required={field.required}

                  />
                </div>
              ))}
            </div>
            {/* <div className="text-xs text-red-500 bg-red-50 p-2 rounded-lg flex items-start">
              <AlertCircle className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
              <span>Please fill in all required fields</span>
            </div> */}
            <Button
              type="submit"
              className="w-full h-11 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-all"
            >
              Create account
            </Button>
          </form>
          <div className="text-center">
            <button
              type="button"
              onClick={() => setActiveSection('login')}
              className="text-xs text-blue-500 hover:underline"
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
                <MaterialInput
                  id={field.id}
                  type={field.type}
                  label={field.label}
                  value={formData.forgot[field.id]}
                  onChange={(value) => handleInputChange('forgot', field.id, value)}
                  icon={field.icon}
                  required={field.required}

                  helperText={field.helperText}
                />
              </div>
            ))}
            <Button
              // type="submit"
              
               onClick={() => setActiveSection('emailSent')}
              className="w-full h-11 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-all"
            >
              Send Verification Code
            </Button>
          </form>
          <div className="flex justify-between text-xs">
            <button
              type="button"
              onClick={() => setActiveSection('login')}
              className="text-gray-600 hover:text-blue-500"
            >
              Back to login
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('register')}
              className="text-blue-500 hover:underline"
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
                <MaterialInput
                  id={field.id}
                  type={field.type}
                  label={field.label}
                  value={formData.verify[field.id]}
                  onChange={(value) => handleInputChange('verify', field.id, value)}
                  icon={field.icon}
                  showPasswordToggle={field.showPasswordToggle}
                  required={field.required}

                  helperText={field.helperText}
                />
              </div>
            ))}
            <div className="text-xs text-red-500 bg-red-50 p-2 rounded-lg flex items-start">
              <AlertCircle className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
              <span>Verification failed. Please try again.</span>
            </div>
            <Button
              // type="submit"
                       onClick={() => setActiveSection('login')}
              className="w-full h-11 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-all"
            >
              Reset Password
            </Button>
          </form>
          <div className="flex justify-between text-xs">
            <button
              type="button"
              onClick={() => setActiveSection('forgot')}
              className="text-gray-600 hover:text-blue-500"
            >
              Try another email
            </button>
            <button
              type="button"
              className="text-blue-500 hover:underline"
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
          <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-green-100">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-base font-medium text-gray-900">Check your email</h3>
            <p className="mt-1.5 text-xs text-gray-500">
              We&lsquo;ve sent a verification code to <strong>your email</strong>
            </p>
          </div>
          <Button
            onClick={() => setActiveSection('verify')}
            className="w-full h-11 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-all"
          >
            Enter verification code
          </Button>
          <div className="flex justify-between text-xs">
            <button
              type="button"
              onClick={() => setActiveSection('login')}
              className="text-gray-600 hover:text-blue-500"
            >
              Back to login
            </button>
            <button
              type="button"
              className="text-blue-500 hover:underline"
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
          <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-green-100">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-base font-medium text-gray-900">Password Reset Successful</h3>
            <p className="mt-1.5 text-xs text-gray-500">
              Your password has been successfully reset. You can now login with your new password.
            </p>
          </div>
          <Button
            onClick={() => setActiveSection('login')}
            className="w-full h-11 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-all"
          >
            Back to login
          </Button>
        </div>
      ),
    },
  };

  return (
    <Dialog open={loginDailog} onOpenChange={loginNeed} aria-label="Fatafatsewa Login Dialog">
      <DialogContent className="sm:mx-auto sm:w-full sm:max-w-lg min-h-[60vh] max-h-[93vh] bg-white px-4 sm:px-8 py-6 shadow-md sm:rounded-2xl border border-gray-200 flex flex-col gap-6 overflow-y-auto ">
        <DialogHeader className="flex flex-col items-center">
          <DialogTitle hidden>login</DialogTitle>
          <Image
            src={CompanyLogo}
            alt="Fatafatsewa Company Logo"
            width={180}
            height={50}
            className="object-contain"
          />
        </DialogHeader>

        <hr className="border-t border-gray-300 w-full" />

        <div className="flex-1 w-full max-w-md mx-auto">
          {sections[activeSection]?.render()}
        </div>

        <DialogFooter>
          <div className="mt-6">
            <div className="flex flex-row flex-wrap gap-3 justify-center">
              {PaymentMethodsOptions.map((Item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-white p-2 rounded-lg hover:shadow-md hover:scale-105 transition-all duration-200"
                >
                  <Image
                    src={Item.img}
                    alt={Item.name || "Payment Method Logo"}
                    width={50}
                    height={30}
                    className="object-contain"
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

