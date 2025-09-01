import React, { useState } from 'react';

export const ApplyForEMI = ({ product }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('EMI Application:', { name, email, phone, product });
    alert('EMI Application Submitted!');
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
      <h3 className="font-bold text-lg mb-4 text-gray-900">Apply for EMI on {product.name}</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 text-white py-3 rounded-full font-semibold shadow-md hover:bg-green-700 transition-all"
        >
          Submit Application
        </button>
      </div>
    </div>
  );
};