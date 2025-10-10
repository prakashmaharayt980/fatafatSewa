'use client';
import Image from 'next/image';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { useContextCart } from './CartContext';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

import { Divider, TextField } from '@mui/material';

interface CheckoutProduct{
    setsubmittedvaluelist:Dispatch<SetStateAction<CheckoutProduct['submittedvaluelist']>>;
    submittedvaluelist:{
        promoCode:string,
        totalpayment:number,
        appliedPromo:{ code: string, discount:number }
    };
    handleApplyPromo:()=>void;

}


export default function CheckoutProduct({setsubmittedvaluelist,submittedvaluelist,handleApplyPromo}:CheckoutProduct) {
       const { items } = useContextCart();

 
 
  

    if (!items || items.length === 0) {
        return (
            <Card className="w-full lg:w-96 shadow-lg border-none rounded-xl overflow-hidden">
                <CardHeader className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900">Product Summary</h3>
                </CardHeader>
                <CardContent className="p-4 text-center text-gray-500">
                    No items in cart
                </CardContent>
            </Card>
        );
    }

    // Calculate totals
    const subtotal = items.reduce((sum, product) => {
        const effectivePrice = product.discounted_price < product.price ? product.discounted_price : product.price;
        const quantity = product.quantity || 1;
        return sum + effectivePrice * quantity;
    }, 0);

    // Promo discount (10% for "SAVE10")
    const promoDiscount = submittedvaluelist.appliedPromo? subtotal * 0.1 : 0;
    const taxRate = 0.13;
    const tax = (subtotal - promoDiscount) * taxRate;
    const totalPayable = subtotal - promoDiscount + tax;



    return (
        <div className="w-full ">
            <Card className="shadow-lg border-none rounded-xl overflow-hidden">
                <CardHeader className="p-4 mb-0 h-fit flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
                    <Badge variant="secondary" className="text-sm">
                        {items.length} {items.length === 1 ? 'item' : 'items'}
                    </Badge>
                </CardHeader>

                <CardContent className="p-2 space-y-2">
                    {/* Products List */}
                    <div className="max-h-[40vh] overflow-y-auto space-y-3 pr-2 shadow-sm rounded">
                        {items.map((product, index) => {
                            const effectivePrice = product.discounted_price < product.price ? product.discounted_price : product.price;
                            const quantity = product.quantity || 1;
                            const itemTotal = effectivePrice * quantity;

                            return (
                                <div key={product.id || index} className="flex gap-3 pb-3 border-b border-gray-100 last:border-b-0">
                                    <div className="relative w-16 h-16 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                                        <Image
                                            src={product.image || '/placeholder-image.jpg'}
                                            alt={product.name || 'Product'}
                                            fill
                                            className="object-contain p-1"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 line-clamp-2">{product.name || 'Unnamed Product'}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-sm font-semibold text-blue-600">Rs {effectivePrice.toFixed(2)}</span>
                                            {product.discounted_price < product.price && (
                                                <span className="text-xs text-gray-400 line-through">Rs {product.price.toFixed(2)}</span>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-xs text-gray-500">Qty: {quantity}</span>
                                            <span className="text-sm font-medium text-gray-700">Rs {itemTotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <Separator className="my-2" />

                    {/* Promo Code Section */}
                    <div className="bg-gray-50 rounded-lg p-2">
                        {submittedvaluelist.appliedPromo ? (
                            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                                <Badge  className="text-sm font-medium">
                                    {submittedvaluelist.appliedPromo.code} applied
                                </Badge>
                                <Button variant="ghost" size="sm" onClick={()=>setsubmittedvaluelist(pev=>({...pev,promoCode:'',appliedPromo:null}))} className="text-red-500 hover:text-red-700">
                                    Remove
                                </Button>
                            </div>
                        ) : (
                            <div className="relative flex gap-2 items-center">

                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Promo Code"
                                    placeholder="Enter Promo code"
                                    value={submittedvaluelist.promoCode}
                                    onChange={(e) => setsubmittedvaluelist(pev=>({...pev,promoCode:e.target.value}))}
                                    variant="outlined"
                                    className="bg-white"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '4px',
                                            '&:hover fieldset': { borderColor: '#1967b3' },
                                            '&.Mui-focused fieldset': { borderColor: '#1967b3' },
                                        },
                                        '& .MuiInputLabel-root': { fontSize: '0.85rem', color: '#1967b3' },
                                        '& .MuiInputLabel-root.Mui-focused': { color: '#1967b3' },
                                    }}
                                />
                                <Button
                                    onClick={handleApplyPromo}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg"
                                >
                                    Apply
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* <Separator className="my-2" /> */}
                    <Divider className='h-0.5 '/>

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
                        {/* <div className="flex justify-between items-center bg-blue-50 rounded-lg p-3 text-sm">
                            <span className="font-bold text-gray-900">Total Payable</span>
                            <span className="font-bold text-blue-600">Rs {totalPayable.toFixed(2)}</span>
                        </div> */}
                    </div>
                </CardContent>

                {/* Savings Badge */}
                {submittedvaluelist.appliedPromo && (
                    <CardFooter className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg mt-2">
                        <p className="text-sm text-green-700 font-semibold text-center w-full">
                            🎉 You saved Rs {promoDiscount.toFixed(2)}!
                        </p>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}