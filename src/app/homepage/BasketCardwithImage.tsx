'use client';

import React, { useState, useEffect, useRef } from 'react';

import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ProductCard from '../product/ProductCard';
import { cn } from '@/lib/utils'; // Assuming cn is a utility like clsx or cva
import { CategorySlug } from '../types/CategoryTypes';

interface BasketCardProps {
    title?: string;
    items: CategorySlug[];
}

const BasketCard = ({ title, items }: BasketCardProps) => {
    const router = useRouter();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeDot, setActiveDot] = useState(0);
    const [windowWidth, setWindowWidth] = useState(0);

    const Datalist = items[0]?.products.data || [];
    const ItemCatg = items[0]?.category;

    // Handle window resize for responsive behavior
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        
        handleResize(); // Set initial width
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Responsive items per page
    const isMobile = windowWidth < 640;
    const itemsPerPage = isMobile ? 2 : 4; // 2 items on mobile, 4 on desktop
    const totalPages = Math.ceil(Datalist.length / itemsPerPage);

    // Scroll to specific page
    const scrollToPage = (pageIndex: number) => {
        if (scrollContainerRef.current) {
            const itemWidth = scrollContainerRef.current.children[0]?.getBoundingClientRect().width || 0;
            const gap = isMobile ? 16 : 8; // 16px gap on mobile, 8px on desktop
            const scrollDistance = pageIndex * itemsPerPage * (itemWidth + gap);
            
            scrollContainerRef.current.scrollTo({
                left: scrollDistance,
                behavior: 'smooth',
            });
            setActiveDot(pageIndex);
        }
    };

    // Handle dot click
    const handleDotClick = (index: number) => {
        scrollToPage(index);
    };

    return (
        <div className="w-full bg-white overflow-visible"> {/* Added overflow-visible to parent */}
            {/* Header */}
            <div className={cn(
                'flex items-center justify-between py-4',
                'px-3 sm:px-6'
            )}>
                <h2 className={cn(
                    'text-lg font-bold text-gray-900',
                    'sm:text-xl'
                )}>{title}</h2>
                <button
                    onClick={() => router.push(`/product/category/${ItemCatg?.slug}`)}
                    className={cn(
                        'flex items-center gap-2 rounded-2xl border-transparent text-xs font-medium',
                        'px-2 py-1 text-blue-600 hover:text-blue-700',
                        'sm:text-sm sm:px-4 sm:py-2'
                    )}
                >
                    <span>View More</span>
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>

            <hr className={cn(
                '  mx-2 border-b-2 border-orange-500'
            )} />

            {/* Product Grid - Horizontal Scroll */}
            <div className={cn(
                'py-4 pb-8', // Added extra bottom padding for hover effects
                'px-2 sm:px-6'
            )}>
                <div
                    ref={scrollContainerRef}
                    className={cn(
                        'flex overflow-x-auto overflow-y-visible scrollbar-hide', // Changed to overflow-y-visible
                        'gap-4 sm:gap-2' // 16px gap on mobile, 8px on desktop
                    )}
                    style={{ 
                        scrollbarWidth: 'none', 
                        msOverflowStyle: 'none',
                        scrollBehavior: 'smooth'
                    }}
                >
                    {Datalist.map((product, index) => (
                        <div
                            key={`${product.slug}-${index}`}
                            className={cn(
                                'flex-shrink-0',
                                // Mobile: each item takes ~45% width (2 items visible with gap)
                                // Desktop: each item takes ~25% width minus gap adjustment (4 items visible)
                                'w-[calc(50%-8px)] sm:w-[calc(25%-6px)]'
                            )}
                        >
                            <ProductCard product={product} index={index} />
                        </div>
                    ))}
                </div>

                {/* Pagination Dots - Only show if more than one page */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-4 gap-2">
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handleDotClick(index)}
                                className={cn(
                                    'w-2 h-2 rounded-full transition-all duration-300 cursor-pointer',
                                    index === activeDot 
                                        ? 'bg-blue-600 w-4' 
                                        : 'bg-gray-300 hover:bg-gray-400'
                                )}
                                aria-label={`Go to page ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            <style jsx>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                    scroll-behavior: smooth;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide::-webkit-scrollbar-horizontal {
                    display: none;
                }
                .scrollbar-hide::-webkit-scrollbar-vertical {
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