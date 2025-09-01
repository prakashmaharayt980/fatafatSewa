import React, { useState } from 'react';

export const EMICalculator = ({ principal = 0 }) => {
  const [amount, setAmount] = useState(principal);
  const [rate, setRate] = useState(10);
  const [tenure, setTenure] = useState(12);

  const calculateEMI = () => {
    if (!amount || !rate || !tenure) return 0;
    const monthlyRate = rate / 12 / 100;
    const emi =
      amount *
      monthlyRate *
      Math.pow(1 + monthlyRate, tenure) /
      (Math.pow(1 + monthlyRate, tenure) - 1);
    return emi.toFixed(2);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
      <h3 className="font-bold text-lg mb-4 text-gray-900">EMI Calculator</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Loan Amount ($)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Interest Rate (% per year)</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tenure (months)</label>
          <input
            type="number"
            value={tenure}
            onChange={(e) => setTenure(parseInt(e.target.value))}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="bg-blue-50 p-4 rounded-md">
          <p className="text-lg font-semibold text-blue-700">
            Monthly EMI: ${calculateEMI()}
          </p>
        </div>
      </div>
    </div>
  );
};