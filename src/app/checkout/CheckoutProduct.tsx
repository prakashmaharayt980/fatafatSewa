'use client';
import Image from 'next/image';
import React from 'react';
import { useContextCart } from './CartContext';

export default function CheckoutProduct() {
    const { items } = useContextCart();

    if (!items || items.length === 0) {
        return (
            <div className="w-full lg:w-80 flex-shrink-0">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h3 className="text-gray-600 text-sm font-medium mb-4">Product Summary</h3>
                    <div className="text-center text-gray-500">No items in cart</div>
                </div>
            </div>
        );
    }

    if (items.length === 1) {
        const product = items[0];
        const effectivePrice = product.discounted_price < product.price ? product.discounted_price : product.price;
        const emiAvailable = product.emi_enabled === 1;
        const monthlyEMI = emiAvailable ? Math.ceil(effectivePrice / 12) : 0;

        return (
            <div className="w-full  flex-shrink-0">
                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                    <h3 className="text-gray-800 text-lg font-semibold mb-4">Product Summary</h3>
                    <div className="space-y-4">
                        <div className="relative aspect-square p-2 w-full max-w-[300px] max-h-[250px] mx-auto bg-gray-50 rounded-lg">
                            <Image
                                src={product.image || '/placeholder-image.jpg'}
                                alt={product.name || 'Product'}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                                priority
                            />
                        </div>
                        <div>

                            <h1 className="text-lg  font-semibold text-[var(--colour-fsP2)] tracking-tight">
                                {product.name || 'Unnamed Product'}
                            </h1>
                            <div className="flex items-center gap-2">

                                <span className="text-lg font-bold text-[var(--colour-fsP1)]">
                                    Rs {effectivePrice.toFixed(2)}
                                </span>
                                {product.discounted_price < product.price && (
                                    <div className="text-lg text-gray-500 line-through">Rs {product.price.toFixed(2)}</div>
                                )}
                            </div>
                            {product.quantity && (
                                <div className="text-sm text-gray-600 mt-1">Quantity: {product.quantity}</div>
                            )}
                        </div>
                        {product.highlights && (
                            <div className="flex flex-col gap-3 mt-1">
                                <label className="text-xl font-semibold text-gray-900 mb-1">Product Highlight</label>
                                <div className="flex flex-col gap-3">
                                    {product.highlights && (
                                        <div className="grid grid-cols-1  gap-3 p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                                            {product.highlights.split("|").map((highlight, index) => (
                                                <div key={`highlight-${index}`} className="flex items-start gap-2">
                                                    <span className="text-yellow-600 text-lg leading-none">•</span>
                                                    <span className="text-sm font-medium text-gray-800">{highlight.trim()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        );
    }

    // Multiple items
    return (
        <div className="w-full  flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
                <h3 className="text-gray-800 text-lg font-semibold mb-4">Product Summary ({items.length} items)</h3>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {items.map((product, index) => {
                        const effectivePrice = product.discounted_price < product.price ? product.discounted_price : product.price;
                        return (
                            <div key={product.id || index} className="flex gap-4 py-4 border-b last:border-b-0">
                                <div className="relative w-20 h-20 flex-shrink-0">
                                    <Image
                                        src={product.image || '/placeholder-image.jpg'}
                                        alt={product.name || 'Product'}
                                        fill
                                        className="object-contain rounded-md"
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="text-gray-900 font-medium mb-1">{product.name || 'Unnamed Product'}</div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-lg font-semibold text-blue-600">Rs {effectivePrice.toFixed(2)}</div>
                                        {product.discounted_price < product.price && (
                                            <div className="text-sm text-gray-500 line-through">Rs {product.price.toFixed(2)}</div>
                                        )}
                                    </div>
                                    {product.quantity && (
                                        <div className="text-sm text-gray-600">Quantity: {product.quantity}</div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}