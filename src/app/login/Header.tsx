import Link from 'next/link';

interface HeaderProps {
  activeTab: 'login' | 'register' | 'forgot';
  forgotPassword: {
    showOtpVerification: boolean;
  };
}

const Header: React.FC<HeaderProps> = ({ activeTab, forgotPassword }) => {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <Link href="/" className="flex justify-center items-center text-2xl font-bold text-blue-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 mr-2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        FatafatSewa
      </Link>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {activeTab === 'login' && 'Welcome Back'}
        {activeTab === 'register' && 'Create an Account'}
        {activeTab === 'forgot' &&
          (forgotPassword.showOtpVerification ? 'Verify Your Identity' : 'Reset Your Password')}
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        {activeTab === 'login' && 'Sign in to your account or create a new one'}
        {activeTab === 'register' && 'Fill in your details to get started'}
        {activeTab === 'forgot' &&
          (forgotPassword.showOtpVerification
            ? 'Enter the verification code sent to your email'
            : 'Enter your email to receive reset instructions')}
      </p>
    </div>
  );
};

export default Header;