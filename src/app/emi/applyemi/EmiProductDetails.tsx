
'use client'
import Image from 'next/image'
import React from 'react'


export default function EmiProductDetails({emiData,product}) {

  return (
    <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-gray-600 text-sm font-medium mb-4">Product Summary</h3>
            <div className="mb-1">
              <div className="relative aspect-square p-1 sm:p-2 w-full max-w-[280px] sm:max-w-[360px] mx-auto">
                <Image
                  src={product.image  || ''}
                  alt={product.name || 'product summary'}
                  width={360}
                  height={360}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="w-full h-full object-contain transition-transform duration-300 hover:scale-105 rounded-md"
                  priority
                />
              </div>
              <div className="text-gray-500 text-sm mb-1">{product?.name}</div>
              <div className="text-2xl font-semibold text-blue-600">Rs {product?.price || 0}</div>
            </div>
            <div className="border-t pt-4">
              <h4 className="text-gray-700 font-medium mb-3">EMI Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly EMI from</span>
                  <span className="font-medium">Rs. {emiData.paymentpermonth.toFixed(2)===0 ? product.price/emiData.tenure :emiData.paymentpermonth.toFixed(2) }</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tenure</span>
                  <span className="font-medium">{emiData.tenure === 0 ? '12-36 months':`${emiData.tenure} months`}</span>
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-500 space-y-1">
                <div>• Processing fee: 2% of loan amount</div>
                <div>• Documentation charges may apply</div>
                <div>• EMI amount may vary based on final approval</div>
              </div>
            </div>
          </div>
        </div>
  )
}
