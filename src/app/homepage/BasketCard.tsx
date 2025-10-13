'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
import useSWR from 'swr';
import ProductCard from '../product/ProductCard';
import { cn } from '@/lib/utils';
import { CategorySlug } from '../types/CategoryTypes';
import RemoteServices from '../api/remoteservice';

interface BasketCardProps {
  title?: string;
  slug: string;
}

const fetcher = async (slug: string) => {
  const response = await RemoteServices.CategoriesSlug(slug);

  return response;
};

const BasketCard = ({ title, slug }: BasketCardProps) => {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [windowWidth, setWindowWidth] = useState(0);
  const [activeDot, setActiveDot] = useState(0);

  // Fetch data with SWR
  const { data: productList, error } = useSWR<CategorySlug>(
    inView ? slug : null,
    fetcher,
    {
      dedupingInterval: 60000,
      revalidateOnFocus: false,
    }
  );

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Loading state
  if (!productList && inView) {
    return (
      <div ref={ref} className="w-full bg-white">
        <div className="flex items-center justify-between p-4">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <hr className="mx-2 border-b-2 border-gray-200" />
        <div className="p-4">
          <div className="flex gap-4 overflow-x-hidden">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="flex-shrink-0 w-[calc(16.666%-6px)]">
                <div className="bg-white rounded-lg p-2">
                  <div className="w-full h-40 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="mt-2 h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="mt-2 h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                  <div className="mt-2 h-6 w-1/3 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div ref={ref} className="w-full bg-white text-red-600 text-center p-4">
        Error loading products: {error.message}
      </div>
    );
  }

  // No data yet
  if (!productList) {
    return <div ref={ref} className="min-h-[200px] bg-white" />;
  }

  // Empty products
  const products = productList?.products?.data || [];
  if (!products.length) {
    return (
      <div ref={ref} className="w-full bg-white text-gray-600 text-center p-4">
        No products found for this category.
      </div>
    );
  }

  // Responsive items per page
  const isMobile = windowWidth < 640;
  const itemsPerPage = isMobile ? 2 : 6;
  const totalPages = Math.ceil(products.length / itemsPerPage) || 1;

  // Scroll to specific page
  const scrollToPage = (pageIndex: number) => {
    if (scrollContainerRef.current) {
      const itemWidth = scrollContainerRef.current.children[0]?.getBoundingClientRect().width || 0;
      const gap = isMobile ? 16 : 8;
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
    <div ref={ref} className="w-full bg-white overflow-visible">
      <div className={cn('flex items-center justify-between py-1', 'px-3 sm:px-6')}>
        <h2 className={cn('text-lg font-bold text-gray-900', 'sm:text-xl')}>
          {title || productList.category.title}
        </h2>
        <button
          onClick={() => router.push(`/product/category/${productList.category.slug}`)}
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

      <hr className={cn('mx-2 border-b-2 border-orange-500')} />

      <div className={cn('py-2 pb-2', 'px-2 sm:px-6')}>
        <div
          ref={scrollContainerRef}
          className={cn(
            'flex overflow-x-auto overflow-y-visible scrollbar-hide',
            'gap-4 sm:gap-2'
          )}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            scrollBehavior: 'smooth',
          }}
        >
          {products.map((product, index) => (
            <div
              key={`${product.slug}-${index}`}
              className={cn('flex-shrink-0', 'w-[calc(50%-8px)] sm:w-[calc(16.666%-6px)]')}
            >
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-1 gap-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all duration-300 cursor-pointer',
                  index === activeDot ? 'bg-blue-600 w-4' : 'bg-gray-300 hover:bg-gray-400'
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