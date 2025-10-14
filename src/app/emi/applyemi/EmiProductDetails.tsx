'use client'

import Image from 'next/image';
import React from 'react';

export default function EmiProductDetails({ emiData, product }) {
  return (
    <div className="w-full lg:w-80 flex-shrink-0">
      <div className="bg-white rounded-xl border border-blue-100 shadow-sm p-4 sm:p-6">
        <h3 className="text-base font-medium text-gray-700 mb-4">Product Summary</h3>
        <div className="mb-4">
          <div className="relative aspect-square p-2  flex items-center justify-center w-full max-w-[200px] sm:max-w-[280px] mx-auto">
            <Image
              src={product.image || ''}
              alt={product.name || 'product summary'}
              width={280}
              height={280}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="w-full h-full object-contain transition-transform duration-150 hover:scale-105 rounded-md"
              priority
            />
          </div>
          <div className="text-sm text-gray-600 mt-2 text-center">{product?.name}</div>
          <div className="text-xl font-semibold text-[var(--colour-fsP2)] mt-1 text-center">Rs {product?.price || 0}</div>
        </div>
        <div className="border-t border-blue-100 pt-4">
          <h4 className="text-base font-medium text-gray-700 mb-3">EMI Details</h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly EMI from</span>
              <span className="font-medium text-[var(--colour-fsP2)]">
                Rs. {(emiData.paymentpermonth.toFixed(2) === 0 ? product.price / emiData.tenure : emiData.paymentpermonth.toFixed(2))}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tenure</span>
              <span className="font-medium text-[var(--colour-fsP2)]">{emiData.tenure === 0 ? '12-36 months' : `${emiData.tenure} months`}</span>
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500 space-y-1.5">
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">•</span> Processing fee: 2% of loan amount
            </div>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">•</span> Documentation charges may apply
            </div>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">•</span> EMI amount may vary based on final approval
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}