'use client'

import Image from 'next/image';
import React, { Dispatch, SetStateAction } from 'react';
import { useContextCart } from './CartContext';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CheckoutProduct {
  setsubmittedvaluelist: Dispatch<SetStateAction<CheckoutProduct['submittedvaluelist']>>;
  submittedvaluelist: {
    promoCode: string;
    totalpayment: number;
    appliedPromo: { code: string; discount: number } | null;
  };
  handleApplyPromo: () => void;
}

export default function CheckoutProduct({
  setsubmittedvaluelist,
  submittedvaluelist,
  handleApplyPromo,
}: CheckoutProduct) {
  const { items } = useContextCart();

  if (!items || items.length === 0) {
    return (
      <div className="bg-gradient-to-b from-white to-blue-50 py-4 sm:py-6">
        <Card className="w-full lg:w-96 max-w-[95%] sm:max-w-4xl mx-auto shadow-sm border-blue-100 rounded-xl overflow-hidden">
          <CardHeader className="p-4 sm:p-6">
            <h3 className="text-base font-medium text-gray-700">Product Summary</h3>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 text-center text-gray-600 text-sm">
            No items in cart
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate totals
  const subtotal = items.reduce((sum, product) => {
    const effectivePrice = product.discounted_price < product.price ? product.discounted_price : product.price;
    const quantity = product.quantity || 1;
    return sum + effectivePrice * quantity;
  }, 0);

  // Promo discount (10% for "SAVE10")
  const promoDiscount = submittedvaluelist.appliedPromo ? subtotal * 0.1 : 0;
  const taxRate = 0.13;
  const tax = (subtotal - promoDiscount) * taxRate;
  const totalPayable = subtotal - promoDiscount + tax;

  return (
    <div className="bg-gradient-to-b from-white to-blue-50 ">
      <Card className="w-full  mx-auto shadow-sm border-blue-100 rounded-xl overflow-hidden">
        <CardHeader className="  mb-0 h-fit flex justify-between items-center">
          <h3 className="text-base font-medium text-gray-700">Order Summary</h3>
          <Badge variant="secondary" className="text-sm bg-blue-50 text-[var(--colour-fsP2)] border-blue-200">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </Badge>
        </CardHeader>

        <CardContent className="p-2 sm:p-4 space-y-3">
          {/* Products List */}
          <div className="max-h-[40vh] overflow-y-auto space-y-3 pr-2 rounded-lg">
            {items.map((product, index) => {
              const effectivePrice = product.discounted_price < product.price ? product.discounted_price : product.price;
              const quantity = product.quantity || 1;
              const itemTotal = effectivePrice * quantity;

              return (
                <div
                  key={product.id || index}
                  className="flex flex-col gap-2 sm:gap-4 pb-3 border-b border-blue-100 last:border-b-0"
                >
                  <div className="relative w-16 h-16 sm:w-32 sm:h-32 flex-shrink-0  overflow-hidden">
                    <Image
                      src={product.image || '/placeholder-image.jpg'}
                      alt={product.name || 'Product'}
                      fill
                      sizes="(max-width: 768px) 100vw, 20vw"
                      className="object-contain p-1 transition-transform duration-150 hover:scale-105"
                    />
                  </div>
                  <div className="flex justify-end px-3 flex-col min-w-0  ">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">{product.name || 'Unnamed Product'}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-semibold text-[var(--colour-fsP2)] ">Rs {effectivePrice.toFixed(2)}</span>
                      {product.discounted_price < product.price && (
                        <span className="text-xs text-gray-500 line-through">Rs {product.price.toFixed(2)}</span>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-600">Qty: {quantity}</span>
                      <span className="text-sm font-medium text-gray-700">Rs {itemTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

       

          {/* Promo Code Section */}
          <div className="mt-2">
            {submittedvaluelist.appliedPromo ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                <Badge className="text-sm font-medium bg-green-100 text-green-600 border-green-200">
                  {submittedvaluelist.appliedPromo.code} applied
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setsubmittedvaluelist((prev) => ({ ...prev, promoCode: '', appliedPromo: null }))}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-150"
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div className="relative flex gap-2 items-center">
                <Input
                  value={submittedvaluelist.promoCode}
                  onChange={(e) => setsubmittedvaluelist((prev) => ({ ...prev, promoCode: e.target.value }))}
                  placeholder="Enter Promo Code"
                  className="text-sm bg-white border-blue-200 text-gray-700 placeholder-gray-400 focus:ring-1 focus:ring-blue-600 focus:border-blue-600 rounded-lg"
                />
                <Button
                  onClick={handleApplyPromo}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-all duration-150 focus:ring-1 focus:ring-blue-600"
                >
                  Apply
                </Button>
              </div>
            )}
          </div>

          <Separator className="my-3 bg-blue-100" />

          {/* Price Breakdown */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-gray-900">Rs {subtotal.toFixed(2)}</span>
            </div>
            {submittedvaluelist.appliedPromo && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-green-600">Promo Discount ({submittedvaluelist.appliedPromo.discount}%)</span>
                <span className="font-medium text-green-600">- Rs {promoDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Tax (13%)</span>
              <span className="font-medium text-gray-900">Rs {tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center sm:hidden bg-blue-50 rounded-lg  text-sm">
              <span className="font-bold text-gray-900">Total Payable</span>
              <span className="font-bold text-[var(--colour-fsP2)] ">Rs {totalPayable.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>

        {/* Savings Badge */}
        {submittedvaluelist.appliedPromo && (
          <CardFooter className="p-3 bg-gradient-to-r from-green-50 to-yellow-50 rounded-lg mt-2 border border-blue-100">
            <p className="text-sm text-green-600 font-medium text-center w-full">
              🎉 You saved Rs {promoDiscount.toFixed(2)}!
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}