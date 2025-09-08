import React, { useState, useRef } from 'react';

import Image from 'next/image';



const SubCategoriesItems = () => {

    const categories =[
        {
            id:1,
            title:'laptop',
            image:{
                default:'https://fatafatsewa.com/storage/media/1641/apr-pod-banner-min.png'
            }
        }
    ]
  
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
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-6 sm:py-12">

      <div className="mb-2">
        <div className="flex items-center justify-center mb-6">
          <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-blue-500 to-blue-500"></div>
                    <h2 className="px-3 sm:px-6 text-lg sm:text-2xl font-bold text-gray-900">Mobile Phone</h2>
          <div className="flex-1 h-1 bg-gradient-to-l from-transparent via-blue-500 to-blue-500"></div>
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
                    <div className="flex gap-2 sm:gap-4 lg:gap-6">
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className="flex-none w-[70px] sm:w-[100px] lg:w-[140px] snap-start
                                    group relative bg-white rounded-lg sm:rounded-2xl p-2 sm:p-4 
                                    transition-all duration-300 ease-out
                                    hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
                                    hover:-translate-y-1
                                    border border-gray-100 hover:border-orange-200"
                                role="button"
                                tabIndex={0}
                            >
                                <div className="relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto mb-1 sm:mb-3">
                                    <Image
                                        src={category.image.default}
                                        alt={category.title}
                                        layout="fill"
                                        className="rounded-lg sm:rounded-xl object-cover transition-transform duration-300 
                                            group-hover:scale-110"
                                        loading="lazy"
                                    />
                                </div>

                                <h3 className="text-xs sm:text-sm font-medium text-gray-700 
                                    group-hover:text-orange-600 text-center
                                    transition-colors duration-300 leading-tight">
                                    {category.title}
                                </h3>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Interactive Dots */}
            <div className="flex justify-center space-x-1 sm:space-x-2 mt-2 sm:mt-4">
                {Array.from({ length: Math.ceil(categories.length / 7) }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => scrollTo(index)}
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                            activeSlide === index 
                                ? 'bg-orange-500 w-3 sm:w-4' 
                                : 'bg-gray-300'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Background Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-16 h-16 sm:w-32 sm:h-32 bg-orange-100 rounded-full opacity-20 blur-xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-12 h-12 sm:w-24 sm:h-24 bg-orange-200 rounded-full opacity-30 blur-lg"></div>
            </div>
        </div>
    );
};

export default SubCategoriesItems;