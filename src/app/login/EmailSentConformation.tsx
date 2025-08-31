import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface EmailSentConfirmationProps {
  forgotPassword: {
    email: string;
  };
  setForgotPassword: (form: EmailSentConfirmationProps['forgotPassword']) => void;
  handleForgotPassword: (e: React.FormEvent) => void;
  setActiveTab: (tab: 'login' | 'register' | 'forgot') => void;
}

const EmailSentConfirmation: React.FC<EmailSentConfirmationProps> = ({
  forgotPassword,
  setForgotPassword,
  handleForgotPassword,
  setActiveTab,
}) => {
  return (
    <div className="text-center space-y-4">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
        <CheckCircle className="h-6 w-6 text-green-600" />
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-900">Check your email</h3>
        <p className="mt-1 text-sm text-gray-500">
          We've sent a verification code to <strong>{forgotPassword.email}</strong>
        </p>
      </div>
      <Button
        onClick={() => setForgotPassword({ ...forgotPassword, showOtpVerification: true })}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
      >
        Enter verification code
      </Button>
      <div className="flex justify-between text-sm">
        <button
          type="button"
          onClick={() => {
            setForgotPassword({ ...forgotPassword, resetSent: false, email: '' });
            setActiveTab('login');
          }}
          className="text-gray-600 hover:text-blue-600"
        >
          Back to login
        </button>
        <button
          type="button"
          onClick={() => handleForgotPassword(new Event('click') as any)}
          className="text-blue-600 hover:underline"
        >
          Resend code
        </button>
      </div>
    </div>
  );
};

export default EmailSentConfirmation;