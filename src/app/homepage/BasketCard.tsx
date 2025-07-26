'use client';

import React, { useEffect, useRef, useState } from 'react';
import {  CategorySlug, DefaultProductInterface, useContextStore } from '../api/ContextStore';
import Image from 'next/image';
import { CheckCheck, Truck } from 'lucide-react';
import { useRouter } from 'next/navigation';



interface BasketCardProps {
    title?: string;
   items:CategorySlug[]
}

const BasketCard = ({ title, items }: BasketCardProps) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
       const router = useRouter()

    const [activeDot, setActiveDot] = useState(0);
    const itemsPerPage = 5;
    const Datalist=items[0].products.data
    const ItemCatg= items[0].category
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


    return (
        <div className="w-full bg-white">
            {/* Header */}
            <div className="flex items-center justify-between px-3 sm:px-6 py-4 ">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h2>
                <button onClick={()=> router.push(`/product/category/${ItemCatg.slug}`)} className="text-blue-600 text-xs sm:text-sm font-medium hover:text-blue-700 border px-2 py-1 rounded-2xl">
                    View More
                </button>
            </div>
            <hr className=" border-orange-500 mx-5 border-b-2" />
            {/* Product Grid - Horizontal Scroll */}
            <div className="px-2 sm:px-6 py-4">
                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {Datalist.map((product, index) => (
                        <div
                            key={index}
                            onClick={()=> router.push(`/product/${product.slug}`)}
                            className="flex-none w-[160px] sm:w-[200px] snap-start bg-white border border-gray-200 rounded-lg transform transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                        >
                            {/* Product Image Container */}
                            <div className="relative p-2 rounded-t-lg">
                                <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">
                                    {product.emi_enabled ? 'EMI Available' : 'New'}
                                </div>

                                <div className="w-full aspect-square relative rounded">
                      {            product.image &&  <Image
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
                                <h3 className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2 mb-2">
                                    {product.highlights}
                                </h3>

                                {/* Price and Badges */}
                                <div className="space-y-2">
                                    <span className="text-base sm:text-lg font-bold text-gray-900">
                                        Rs {product.discounted_price}
                                    </span>

                                    <div className="flex flex-wrap gap-1">
                                        {product.emi_enabled !== 0 && (
                                            <span className="inline-flex items-center text-[10px] sm:text-xs border rounded-full px-1.5 py-0.5 text-orange-600">
                                                <CheckCheck className="w-3 h-3 mr-0.5" />
                                                EMI
                                            </span>
                                        )}
                                        <span className="inline-flex items-center text-[10px] sm:text-xs border rounded-full px-1.5 py-0.5 text-blue-600">
                                            <Truck className="w-3 h-3 mr-0.5" />
                                            Fatafat
                                        </span>
                                    </div>
                                </div>

                                {/* Rating */}
                                <div className="flex items-center gap-1 mb-2">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className={`w-3 h-3 ${i < Math.floor(product.average_rating)
                                                    ? 'text-yellow-400'
                                                    : 'text-gray-300'
                                                    }`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    {/* <span className="text-xs text-gray-500">({product.reviews.length})</span> */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Interactive Pagination Dots */}
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
            `}</style>
        </div>
    );
};

export default BasketCard;