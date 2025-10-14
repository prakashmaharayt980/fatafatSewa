'use client'
import React, { useEffect, useState } from 'react';
import { RotateCcw, Star,ShoppingBasket, Search, Scale } from 'lucide-react';
import Image from 'next/image';
import { useContextCart } from '@/app/checkout/CartContext';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import RemoteServices from '@/app/api/remoteservice';
import { ProductDetails } from '@/app/types/CategoryTypes';
import IconRenderer from '@/app/CommonVue/CustomIconImg';

export default function ProductCompare() {
    const { compareItems, addToCompare, setCompareItems,addToCart } = useContextCart() || {};
    const [searchQuery, setSearchQuery] = useState('');
    const [selectItems, setSelectItems] = useState<ProductDetails[]>([]);
    const [compareProductList, setCompareProductList] = useState<{
        leftProduct: ProductDetails | null;
        rightProduct: ProductDetails | null;
        searchSide: string;
        searchDialog: boolean;
    }>({
        leftProduct: null,
        rightProduct: null,
        searchSide: '',
        searchDialog: false,
    });

    // Update compare products based on compareItems
    useEffect(() => {
        if (!compareItems) {
            setCompareProductList(prev => ({
                ...prev,
                leftProduct: null,
                rightProduct: null,
            }));
            return;
        }

        if (compareItems.length === 1) {
            setCompareProductList(prev => ({
                ...prev,
                leftProduct: compareItems[0] || null,
                rightProduct: null,
            }));
        } else if (compareItems.length === 2) {
            setCompareProductList(prev => ({
                ...prev,
                leftProduct: compareItems[0] || null,
                rightProduct: compareItems[1] || null,
            }));
        } else {
            setCompareProductList(prev => ({
                ...prev,
                leftProduct: null,
                rightProduct: null,
            }));
        }
    }, [compareItems]);

    // Search products when query changes
    useEffect(() => {
        if (searchQuery.trim()) {
            RemoteServices.SerachProducts(searchQuery.trim())
                .then((res) => {
                    setSelectItems(Array.isArray(res?.data) ? res.data : []);
                })
                .catch((e) => {
                    console.error('Search error:', e);
                    setSelectItems([]);
                });
        } else {
            setSelectItems([]);
        }
    }, [searchQuery]);

    // Open drawer when searchSide changes
    useEffect(() => {
        if (compareProductList.searchSide) {
            setCompareProductList(prev => ({ ...prev, searchDialog: true }));
        }
    }, [compareProductList.searchSide]);

    // Handle product selection from search results
    const handleProductSelect = (product: ProductDetails | null) => {
        if (!product || !addToCompare || !setCompareItems) {
            console.error('Invalid product or context methods');
            return;
        }

        try {
            // Check if product already exists in compareItems
            const existing = compareItems?.find((i) => i?.id === product.id);
            if (existing) {
                // If product exists, do nothing (as per addToCompare logic)
                setCompareProductList(prev => ({
                    ...prev,
                    searchDialog: false,
                    searchSide: '',
                }));
                setSearchQuery('');
                setSelectItems([]);
                return;
            }

            // If adding a new product, ensure only two products are kept
            if (compareItems?.length >= 2) {
                // Replace based on searchSide
                const newCompareItems =
                    compareProductList.searchSide === 'left'
                        ? [product, compareItems[1] || null].filter(Boolean)
                        : [compareItems[0] || null, product].filter(Boolean);
                // Clear current compareItems and add new ones
                setCompareItems([]); // Reset to avoid duplicates
                newCompareItems.forEach((item) => {
                    if (item) addToCompare(item);
                });
            } else {
                // Add normally if less than 2 items
                addToCompare(product);
            }

            setCompareProductList(prev => ({
                ...prev,
                searchDialog: false,
                searchSide: '',
            }));
            setSearchQuery('');
            setSelectItems([]);
        } catch (error) {
            console.error('Error adding to compare:', error);
        }
    };

    const ProductCard = ({ product, side }: { product: ProductDetails | null; side: string }) => {
        if (!product) {
            return (
                <div className="flex-1 flex flex-col justify-center items-center p-4">
                    <div className="text-gray-500 text-lg">No product selected</div>
                    <button
                        onClick={() => setCompareProductList(prev => ({ ...prev, searchSide: side }))}
                        className="mt-4 px-4 py-2 flex items-center gap-2 text-[var(--colour-fsP2)] rounded-full text-sm font-medium hover:text-[var(--colour-fsP1)] transition-all shadow-lg hover:shadow-xl"
                    >
                        <ShoppingBasket className="w-5 h-5" />
                        Select Product
                    </button>
                </div>
            );
        }



        return (
            <div className="flex-1 relative">
                <div className="flex flex-col justify-center items-center space-y-2 p-4 transition-all duration-300">
        

                    <div className="relative mb-1 rounded-2xl overflow-hidden w-56 h-56 bg-gradient-to-br from-gray-100 to-gray-200 aspect-square">
                        <Image
                            src={product.image || '/placeholder-image.jpg'}
                            alt={product.name || 'Product'}
                            fill
                            className="w-full h-full object-contain transition-transform duration-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-[var(--colour-fsP2)]">
                            {product.name || 'Unnamed Product'}
                        </h2>

                  <div className='flex flex-row gap-3'>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < Math.floor(product.average_rating || 0)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-gray-600 font-medium">
                                {product.average_rating?.toFixed(1) || '0.0'} (
                                {(Array.isArray(product.reviews) ? product.reviews.length : 0).toLocaleString()} reviews)
                            </span>
                        </div>

                        <div className="flex items-baseline gap-2">
                            <span className="text-xl font-bold text-gray-900">
                                Rs {product.price || 0}
                            </span>
                            <span className="text-gray-500">/unit</span>
                        </div>
                  </div>

     
                        <div className="  p-2 ">
                            <div className="">
                                <h3 className="text-xl font-semibold text-gray-900 mb-1">Full Specifications</h3>
                                <div
                                    className={`overflow-hidden transition-all duration-300 `}
                                >
                                    {Object.entries(product.attributes).map(([key, value], index) => (
                                        <div
                                            key={index}
                                            className="px-4 py-3 flex items-start gap-4 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center gap-2 min-w-36">
                                                <IconRenderer iconKey={key} size={20} color="#1967b3" />
                                                <h4 className="font-medium text-sm text-gray-900">{key}</h4>
                                            </div>
                                            <p className="text-gray-600 text-sm flex-1">{value}</p>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </div>

                   <div className='flex flex-row  gap-4'>
                         <button 
                         onClick={()=>addToCart(product)}
                         className="w-full max-w-sm  cursor-pointer mt-2 py-2 bg-[var(--colour-fsP1)] text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                            <ShoppingBasket className="w-5 h-5" />
                            Add to Cart
                        </button>
                         <button 
                            onClick={() => setCompareProductList(prev => ({ ...prev, searchSide: side }))}
                         className="w-full max-w-sm cursor-pointer mt-2 py-2 bg-[var(--colour-fsP2)] text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                           <RotateCcw className="w-5 h-5" />
                        Change
                        </button>
                   </div>
                    </div>
                </div>
            </div>
        );
    };

    // Handle null context
    if (!compareItems || !addToCompare || !setCompareItems) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
                <div className="max-w-7xl mx-auto mb-1">
                    <div className="text-center space-y-2">
                        <h1 className="text-xl font-bold text-[var(--colour-fsP2)]">Compare Products</h1>
                        <p className="text-gray-600 text-base">
                            Find the perfect product by comparing features side by side
                        </p>
                    </div>
                </div>
                <div className="text-center text-gray-500 text-lg mt-8">
                    Error: Comparison functionality is unavailable
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen  p-4">
            <div className="max-w-7xl mx-auto mb-1">
                <div className="text-center space-y-2">
                    <h1 className="text-xl font-bold text-[var(--colour-fsP2)]">Compare Products</h1>
                    <p className="text-gray-600 text-base">
                        Find the perfect product by comparing features side by side
                    </p>
                </div>
            </div>

            {compareItems.length === 0 ? (
                <div className="text-center text-gray-500 text-lg mt-8">
                    No products selected for comparison
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <ProductCard product={compareProductList.leftProduct} side="left" />
                        <div className="flex items-center justify-center lg:my-auto">
                            <div className="bg-[var(--colour-fsP2)] flex flex-row gap-3 items-center text-white font-bold text-base px-6 py-3 rounded-full shadow-lg">
                                
                                <Scale className='w-6 h-6 '/>
                            
                            </div>
                        </div>
                        <ProductCard product={compareProductList.rightProduct} side="right" />
                    </div>
                </div>
            )}

            <Drawer
                open={compareProductList.searchDialog}
                onOpenChange={(open) =>
                    setCompareProductList(prev => ({ ...prev, searchDialog: open }))
                }
            >
                <DrawerContent className="max-h-[85vh] min-h-[50vh] sm:min-h-[60vh] max-w-6xl mx-auto bg-white border-0 shadow-xl">
                    <DrawerHeader className="text-center m-0 p-0 items-center border-b-gray-200 border-b">
                        <DrawerTitle className="flex items-center justify-center gap-1 sm:gap-2 m-0 p-0 text-base sm:text-xl text-[var(--colour-fsP2)] font-semibold">
                            <ShoppingBasket className="w-4 sm:w-5 h-4 sm:h-5 text-[var(--colour-fsP1)] mb-1 sm:mb-2" />
                            <span className="items-center mb-1 sm:mb-2">Select Product to Compare</span>
                        </DrawerTitle>
                    </DrawerHeader>
                    <div className="p-2 sm:p-4 overflow-y-auto">
                        <div className="mb-2 sm:mb-4">
                            <div className="flex rounded-full border border-gray-300 bg-gray-50 hover:bg-white hover:border-blue-300 transition-all duration-200 overflow-hidden focus-within:ring-2 focus-within:ring-blue-200">
                                <input
                                    type="text"
                                    value={searchQuery || ''}
                                    onChange={(e) => setSearchQuery(e.target.value || '')}
                                    placeholder="Search for a product..."
                                    className="w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-transparent border-none focus:outline-none text-xs sm:text-sm placeholder-gray-500"
                                />
                                <button className="bg-blue-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 m-0.5 hover:bg-blue-700 transition-colors rounded-full duration-200 flex items-center justify-center">
                                    <Search className="w-3 sm:w-4 h-3 sm:h-4" />
                                </button>
                            </div>
                            {selectItems.length > 0 ? (
                                <div className="mt-2 max-h-48 sm:max-h-56 overflow-auto bg-white border border-gray-200 rounded-md shadow-sm">
                                    {selectItems.map((product) => (
                                        <div
                                            key={product?.id || Math.random()} // Fallback key for safety
                                            className="flex items-center p-1.5 sm:p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                                            onClick={() => handleProductSelect(product)}
                                        >
                                            {product?.image ? (
                                                <img
                                                    src={product.image}
                                                    alt={product.name || 'Product'}
                                                    className="w-6 sm:w-8 h-6 sm:h-8 object-contain rounded mr-2 sm:mr-3 border border-gray-100"
                                                />
                                            ) : (
                                                <div className="w-6 sm:w-8 h-6 sm:h-8 bg-gray-200 rounded mr-2 sm:mr-3" />
                                            )}
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900 text-xs sm:text-sm">
                                                    {product.name || 'Unnamed Product'}
                                                </p>
                                                <p className="text-[10px] sm:text-xs text-gray-600">
                                                    Rs. {product.price || 0}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                searchQuery.trim() && (
                                    <div className="mt-2 text-center text-gray-500 text-sm">
                                        No products found
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
}