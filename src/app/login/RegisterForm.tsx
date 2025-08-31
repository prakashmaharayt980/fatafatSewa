import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RegisterFormProps {
  registerForm: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    address: string;
    phoneNumber: string;
    isLoading: boolean;
    error: string | null;
  };
  setRegisterForm: (form: RegisterFormProps['registerForm']) => void;
  handleRegister: (e: React.FormEvent) => void;
  togglePassword: { registerPassword: boolean; registerConfirmPassword: boolean };
  handlePasswordToggle: (field: keyof RegisterFormProps['togglePassword']) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  registerForm,
  setRegisterForm,
  handleRegister,
  togglePassword,
  handlePasswordToggle,
}) => {
  return (
    <form onSubmit={handleRegister} className="space-y-6">
      <div>
        <Label htmlFor="name" className="font-medium text-gray-700">
          Full Name
        </Label>
        <Input
          id="name"
          type="text"
          value={registerForm.name}
          onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
          placeholder="John Doe"
          className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <Label htmlFor="register-email" className="font-medium text-gray-700">
          Email
        </Label>
        <Input
          id="register-email"
          type="email"
          value={registerForm.email}
          onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
          placeholder="you@example.com"
          className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="register-password" className="font-medium text-gray-700">
            Password
          </Label>
          <div className="relative">
            <Input
              id="register-password"
              type={togglePassword.registerPassword ? 'text' : 'password'}
              value={registerForm.password}
              onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
              placeholder="••••••••"
              className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => handlePasswordToggle('registerPassword')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {togglePassword.registerPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <Label htmlFor="confirm-password" className="font-medium text-gray-700">
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="confirm-password"
              type={togglePassword.registerConfirmPassword ? 'text' : 'password'}
              value={registerForm.confirmPassword}
              onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
              placeholder="••••••••"
              className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => handlePasswordToggle('registerConfirmPassword')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {togglePassword.registerConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="phone-number" className="font-medium text-gray-700">
          Phone Number
        </Label>
        <Input
          id="phone-number"
          type="tel"
          value={registerForm.phoneNumber}
          onChange={(e) => setRegisterForm({ ...registerForm, phoneNumber: e.target.value })}
          placeholder="(123) 456-7890"
          className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <Label htmlFor="address" className="font-medium text-gray-700">
          Address
        </Label>
        <Input
          id="address"
          type="text"
          value={registerForm.address}
          onChange={(e) => setRegisterForm({ ...registerForm, address: e.target.value })}
          placeholder="123 Main St, City, State, ZIP"
          className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      {registerForm.error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md flex items-start">
          <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
          <span>{registerForm.error}</span>
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
        disabled={registerForm.isLoading}
      >
        {registerForm.isLoading ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  );
};

export default RegisterForm;