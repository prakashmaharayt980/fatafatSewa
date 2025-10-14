'use client'

import React from 'react';

const ProgressBar = ({ currentstep }) => {
  return (
    <div className="bg-gradient-to-b from-white to-blue-50 py-4 sm:py-6">
      <div className="flex items-center justify-center mb-6 sm:mb-8 max-w-[95%] sm:max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 sm:space-x-8 w-full">
          {/* Step 1: Start */}
          <div className="flex items-center">
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-150 ${
                currentstep <= 0
                  ? 'bg-blue-600 text-white'
                  : 'bg-yellow-50 border border-blue-100 text-gray-700 hover:scale-110'
              }`}
            >
              1
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700 hidden lg:block">Start</span>
          </div>
          <div
            className={`flex-1 h-1.5 rounded-full ${
              currentstep >= 1 ? 'bg-blue-600' : 'bg-blue-200'
            } mr-1`}
          ></div>

          {/* Step 2: Details */}
          <div className="flex items-center">
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-150 ${
                currentstep >= 1 && currentstep < 3
                  ? 'bg-blue-600 text-white'
                  : 'bg-yellow-50 border border-blue-100 text-gray-700 hover:scale-110'
              }`}
            >
              2
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700 hidden lg:block">Details</span>
          </div>
          <div
            className={`flex-1 h-1.5 rounded-full ${
              currentstep === 3 ? 'bg-blue-600' : 'bg-blue-200'
            } mr-1`}
          ></div>

          {/* Step 3: Submit */}
          <div className="flex items-center">
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-150 ${
                currentstep === 3
                  ? 'bg-blue-600 text-white'
                  : 'bg-yellow-50 border border-blue-100 text-gray-700 hover:scale-110'
              }`}
            >
              3
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700 hidden lg:block">Submit</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;