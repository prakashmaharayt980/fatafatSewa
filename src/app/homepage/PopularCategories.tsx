import React, { useState, useRef } from 'react';
import { HomePageData } from '../api/ContextStore';
import Image from 'next/image';

interface PopularCategoriesProps {
    categories: HomePageData['categories'];
}

const PopularCategories = ({ categories }: PopularCategoriesProps) => {
  
    const [activeSlide, setActiveSlide] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollTo = (index: number) => {
        if (scrollContainerRef.current) {
            const containerWidth = scrollContainerRef.current.offsetWidth;
            scrollContainerRef.current.scrollTo({
                left: containerWidth * index,
                behavior: 'smooth'
            });
            setActiveSlide(index);
        }
    };

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const scrollPosition = scrollContainerRef.current.scrollLeft;
            const containerWidth = scrollContainerRef.current.offsetWidth;
            const newActiveSlide = Math.round(scrollPosition / containerWidth);
            setActiveSlide(newActiveSlide);
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-12">
            {/* Header Section */}
              <div className="mb-8 w-full">
        <div className="flex items-center justify-center mb-6 w-full">
          <div className="flex-1 h-1 bg-[var(--colour-border2)]"></div>
          <h2 className="px-6 text-2xl font-bold text-gray-900">Popular Categories  </h2>
          <div className="flex-1 h-1 bg-[var(--colour-border2)]"></div>
        </div>
      </div>

            {/* Categories Scroll Container */}
            <div className="relative">
                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
                    style={{ scrollSnapType: 'x mandatory' }}
                >
                    <div className="flex gap-4 lg:gap-6">
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className="flex-none w-[140px] snap-start
                                    group relative bg-white rounded-2xl p-4 
                                    transition-all duration-300 ease-out
                                    hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
                                    hover:-translate-y-1
                                    border border-gray-100 hover:border-orange-200"
                                role="button"
                                tabIndex={0}
                            >
                                <div className="relative w-12 h-12 mx-auto mb-3">

                                    <Image
                                        src={category.image.default}

                                        alt={category.title}
                                        layout="fill"
                                        className="rounded-xl object-cover transition-transform duration-300 
                            group-hover:scale-110"
                                        loading="lazy"

                                    />
                                </div>

                                <h3 className="text-sm font-medium text-gray-700 
                    group-hover:text-orange-600 text-center
                    transition-colors duration-300">
                                    {category.title}
                                </h3>


                            </div>
                        ))}
                    </div>
                </div>

             
            </div>

            {/* Interactive Dots */}
            <div className="flex justify-center space-x-2 mt-4">
                {Array.from({ length: Math.ceil(categories.length / 7) }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => scrollTo(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${activeSlide === index ? 'bg-orange-500 w-4' : 'bg-gray-300'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Background Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-orange-100 rounded-full opacity-20 blur-xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-orange-200 rounded-full opacity-30 blur-lg"></div>
            </div>
        </div>
    );
};

export default PopularCategories;