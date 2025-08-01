'use client';

import React, { useEffect, useRef, useState } from 'react';
import { CategorySlug, DefaultProductInterface, useContextStore } from '../api/ContextStore';
import Image from 'next/image';
import { CheckCheck, ChevronRight, Truck, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BasketCardProps {
    title?: string;
    items: CategorySlug[]
}

const BasketCard = ({ title, items }: BasketCardProps) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const router = useRouter()

    const [activeDot, setActiveDot] = useState(0);
    const [wishlist, setWishlist] = useState<Set<string>>(new Set());
    const itemsPerPage = 5;
    const Datalist = items[0].products.data
    const ItemCatg = items[0].category
    const totalPages = Math.ceil(Datalist?.length / itemsPerPage);

    const scrollToPosition = (index: number) => {
        if (scrollContainerRef.current) {
            const containerWidth = scrollContainerRef.current.clientWidth;
            scrollContainerRef.current.scrollTo({
                left: containerWidth * index,
                behavior: 'smooth'
            });
            setActiveDot(index);
        }
    };

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const scrollPosition = scrollContainerRef.current.scrollLeft;
            const containerWidth = scrollContainerRef.current.clientWidth;
            const newActiveDot = Math.round(scrollPosition / containerWidth);
            setActiveDot(newActiveDot);
        }
    };

    const toggleWishlist = (e: React.MouseEvent, productSlug: string) => {
        e.stopPropagation();
        setWishlist(prev => {
            const newWishlist = new Set(prev);
            if (newWishlist.has(productSlug)) {
                newWishlist.delete(productSlug);
            } else {
                newWishlist.add(productSlug);
            }
            return newWishlist;
        });
    };

    // Show only first 6 items for mobile grid
    const displayItems = Datalist.slice(0, 6);

    return (
        <div className="w-full bg-white">
            {/* Header */}
            <div className="flex items-center justify-between px-3 sm:px-6 py-4 ">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h2>
                <button onClick={() => router.push(`/product/category/${ItemCatg.slug}`)}
                    style={{
                        backgroundColor: 'var(--btnbg)',
                        color: 'var(--btntext)'
                    }}
                    className=" text-xs flex flex-row items-center gap-2 sm:text-sm font-medium hover:shadow-lg hover:scale-[1.05] border-transparent px-2 py-1 rounded-2xl">
                    <span>  View More </span><ChevronRight className=' w-4 h-4' />
                </button>
            </div>
            <hr className=" border-[var(--colour-border1)] mx-6 border-b-2" />

            {/* Mobile Grid View (2x3) */}
            <div className="block sm:hidden px-1 py-2">
                <div className="grid grid-cols-2 gap-1">
                    {displayItems.map((product, index) => {
                        const originalPrice = parseInt(product.price) || product.discounted_price;
                        const discountPercent = originalPrice > product.discounted_price
                            ? Math.round(((originalPrice - product.discounted_price) / originalPrice) * 100)
                            : 0;

                        return (
                            <div
                                key={index}
                                onClick={() => router.push(`/product/${product.slug}`)}
                                className="bg-white border border-gray-200 rounded-lg cursor-pointer product-card group relative"
                            >
                                {/* Wishlist Heart - Only show on hover */}
                                <button
                                    onClick={(e) => toggleWishlist(e, product.slug)}
                                    className="absolute top-2 right-2 z-10 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200"
                                >
                                    <Heart
                                        className={`w-4 h-4 transition-colors duration-200 ${wishlist.has(product.slug)
                                            ? 'fill-red-500 text-red-500'
                                            : 'text-gray-400 hover:text-red-400'
                                            }`}
                                    />
                                </button>

                                {/* Product Image Container */}
                                <div className="relative p-1 rounded-t-lg">
                                    <div className=" top-1 left-2 py-1 text-xs font-medium rounded flex gap-1">
                                        <span className='bg-[var(--colour-bg1)] py-1 px-2 rounded-xl text-white text-[10px]'>New</span>
                                        {discountPercent > 0 && (
                                            <span className='bg-red-500 py-1 px-2 rounded-xl text-white text-[10px]'>
                                                {discountPercent}% OFF
                                            </span>
                                        )}
                                    </div>

                                    <div className="w-full aspect-square relative rounded">
                                        {product.image && <Image
                                            src={product.image}
                                            alt={product.name}
                                            className="object-cover rounded"
                                            fill
                                            sizes="(max-width: 640px) 150px"
                                        />}
                                    </div>
                                </div>

                                {/* Product Details */}
                                <div className="p-2">
                                    <h3 className="text-xs font-medium text-[var(--colour-text2)] line-clamp-2 mb-2 cursor-pointer group-hover:underline group-hover:text-blue-600 transition-colors duration-200">
                                        {product.highlights !== null ? product.highlights : product.name}
                                    </h3>

                                    {/* Price and Badges */}
                                    <div className="space-y-2">
                                        <span className="text-sm font-bold text-[var(--colour-text1)]">
                                            Rs {product.discounted_price}
                                        </span>

                                        <div className="flex flex-wrap gap-1">
                                            {product.emi_enabled !== 0 && (
                                                <span className="inline-flex items-center text-[9px] border rounded-full px-1 py-0.5 text-[var(--colour-btn2)]">
                                                    <CheckCheck className="w-2.5 h-2.5 mr-0.5" />
                                                    EMI
                                                </span>
                                            )}
                                            <span className="inline-flex items-center text-[9px] border rounded-full px-1 py-0.5 text-[var(--colour-btn1)]">
                                                <Truck className="w-2.5 h-2.5 mr-0.5" />
                                                Fatafat
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Desktop Horizontal Scroll View */}
            <div className="hidden sm:block px-2 sm:px-6 py-4">
                {/* Add extra padding to accommodate scaled items */}
                <div className="pb-4 pt-1  ">
                    <div
                        ref={scrollContainerRef}
                        onScroll={handleScroll}
                        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide "
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {Datalist.map((product, index) => {
                            const originalPrice = parseInt(product.price) || product.discounted_price;
                            const discountPercent = originalPrice > product.discounted_price
                                ? Math.round(((originalPrice - product.discounted_price) / originalPrice) * 100)
                                : 0;

                            const handleCardHover = () => {
                                if (scrollContainerRef.current) {
                                    const card = scrollContainerRef.current.children[index] as HTMLElement;
                                    const containerWidth = scrollContainerRef.current.clientWidth;
                                    const cardLeft = card.offsetLeft;
                                    const scrollLeft = scrollContainerRef.current.scrollLeft;
                                    const cardWidth = card.offsetWidth;

                                    // Calculate if card is partially hidden on the right or left
                                    const isHiddenRight = cardLeft + cardWidth > scrollLeft + containerWidth;
                                    const isHiddenLeft = cardLeft < scrollLeft;

                                    // Adjust scroll position slightly (e.g., 50px) to reveal the card
                                    if (isHiddenRight) {
                                        scrollContainerRef.current.scrollTo({
                                            left: scrollLeft + 50, // Move right by 50px
                                            behavior: 'smooth',
                                        });
                                    } else if (isHiddenLeft) {
                                        scrollContainerRef.current.scrollTo({
                                            left: scrollLeft - 50, // Move left by 50px
                                            behavior: 'smooth',
                                        });
                                    }
                                }
                            }

                            return (
                                <div
                                    key={index}
                                    onMouseMove={handleCardHover}
                                   
                                    onClick={() => router.push(`/product/${product.slug}`)}
                                    className="flex-none  indent-px w-[210px] sm:w-[200px]  bg-[var(--colour-bg4)] border border-transparent rounded-2xl cursor-pointer  hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]   "
                                >
                                    {/* Wishlist Heart - Only show on hover */}
                                    <button
                                        onClick={(e) => toggleWishlist(e, product.slug)}
                                        className="absolute top-3 right-3 z-10 p-2 bg-black/80 backdrop-blur-sm rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200"
                                    >
                                        <Heart
                                            className={`w-5 h-5 transition-colors duration-200 ${wishlist.has(product.slug)
                                                ? 'fill-red-500 text-red-500'
                                                : 'text-gray-400 hover:text-red-400'
                                                }`}
                                        />
                                    </button>

                                    {/* Product Image Container */}
                                    <div className="relative p-1 rounded-t-lg">
                                        <div className=" top-1 left-2  text-xs font-medium rounded flex gap-1">
                                            <span className='bg-[var(--colour-bg1)] py-1 px-3 rounded-xl text-white'>New</span>
                                            {/* {discountPercent > 0 && (
                                                <span className='bg-[var(--colour-bg3)] py-1 px-3 rounded-xl text-white'>
                                                    {discountPercent}% OFF
                                                </span>
                                            )} */}

                                            <span className='bg-[var(--colour-bg3)] py-1 px-3 rounded-xl text-white'>
                                                {discountPercent}% OFF
                                            </span>

                                        </div>

                                        <div className="w-full aspect-square relative rounded">
                                            {product.image && <Image
                                                src={product.image}
                                                alt={product.name}
                                                className="object-cover rounded"
                                                fill
                                                sizes="(max-width: 640px) 150px, (max-width: 1024px) 200px, 250px"
                                            />}
                                        </div>
                                    </div>

                                    {/* Product Details */}
                                    <div className="p-2">
                                        <h3 className="text-xs sm:text-sm font-medium text-[var(--colour-text2)] line-clamp-2 mb-2 cursor-pointer hover:underline hover:text-blue-600 transition-colors duration-200">
                                            {product.highlights !== null ? product.highlights : product.name}
                                        </h3>

                                        {/* Price and Badges */}
                                        <div className="space-y-2">
                                            <div className='flex flex-col'>
                                                <span className="text-base sm:text-sm  text-[var(--colour-text3)] line-through font-light ">
                                                    Rs {product.discounted_price !== null ? product.discounted_price : product.name}
                                                </span>
                                                <span className="text-base sm:text-lg font-bold text-[var(--colour-text1)]">
                                                    Rs {product.discounted_price !== null ? product.discounted_price : product.name}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap gap-1">
                                                {product.emi_enabled !== 0 && (
                                                    <span className="inline-flex items-center text-[10px] sm:text-xs border rounded-full px-1.5 py-0.5 text-[var(--colour-btn2)]">
                                                        <CheckCheck className="w-3 h-3 mr-0.5" />
                                                        EMI
                                                    </span>
                                                )}
                                                <span className="inline-flex items-center text-[10px] sm:text-xs border rounded-full px-1.5 py-0.5 text-[var(--colour-btn1)]">
                                                    <Truck className="w-3 h-3 mr-0.5" />
                                                    Fatafat
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Interactive Pagination Dots - Only for Desktop */}
                <div className="flex justify-center mt-4 gap-2">
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => scrollToPosition(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === activeDot
                                ? 'bg-blue-600 w-4'
                                : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                            aria-label={`Go to page ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            <style jsx>{`
                .snap-x {
                    scroll-snap-type: x mandatory;
                }
                .snap-start {
                    scroll-snap-align: start;
                }
                .scrollbar-hide {
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                  display: none;
                }
                .line-clamp-2 {
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                  overflow: hidden;
                }
                
                .product-card {
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
            `}</style>
        </div>
    );
};

export default BasketCard;