import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface ResetSuccessProps {
  handleResetPasswordFlow: () => void;
}

const ResetSuccess: React.FC<ResetSuccessProps> = ({ handleResetPasswordFlow }) => {
  return (
    <div className="text-center space-y-4">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
        <CheckCircle className="h-6 w-6 text-green-600" />
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-900">Password Reset Successful</h3>
        <p className="mt-1 text-sm text-gray-500">
          Your password has been successfully reset. You can now login with your new password.
        </p>
      </div>
      <Button
        onClick={handleResetPasswordFlow}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
      >
        Back to login
      </Button>
    </div>
  );
};

export default ResetSuccess;