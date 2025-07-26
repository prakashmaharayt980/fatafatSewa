'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {  Shield, CreditCard, Truck, TagIcon, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { imagesArray } from '../api/ContextStore';

export const ImagesListBanner = [
    {
        name: 'Sample Image 1',
        default: "https://fatafatsewa.com/storage/media/9919/iPhone-16-Series-in-EMI-Plans.jpg",
        original: "https://fatafatsewa.com/storage/media/9919/iPhone-16-Series-in-EMI-Plans.jpg",
        preview: "https://fatafatsewa.com/storage/media/9919/iPhone-16-Series-in-EMI-Plans.jpg",
        thumbnail: 'https://fatafatsewa.com/storage/media/9919/iPhone-16-Series-in-EMI-Plans.jpg',
        is_default: true,
    },
    {
        name: 'Sample Image 2',
        default: "https://fatafatsewa.com/storage/media/9772/conversions/Samung-Banner-thumb.jpg",
        original: "https://fatafatsewa.com/storage/media/9772/conversions/Samung-Banner-thumb.jpg",
        preview: "https://fatafatsewa.com/storage/media/9772/conversions/Samung-Banner-thumb.jpg",
        thumbnail: 'https://fatafatsewa.com/storage/media/9772/conversions/Samung-Banner-thumb.jpg',
        is_default: true,
    },
    {
        name: 'Sample Image 3',
        default: "https://fatafatsewa.com/storage/media/9771/conversions/iPhone-Deal-thumb.jpg",
        original: "https://fatafatsewa.com/storage/media/9771/conversions/iPhone-Deal-thumb.jpg",
        preview: "https://fatafatsewa.com/storage/media/9771/conversions/iPhone-Deal-thumb.jpg",
        thumbnail: 'https://fatafatsewa.com/storage/media/9771/conversions/iPhone-Deal-thumb.jpg',
        is_default: false,
    },
]

const features = [
    {
        icon: ShieldCheck,
        title: "Genuine Products",
        description: "24 months",
        bgColor: "bg-green-100",
        iconColor: "text-green-600"
    },
    {
        icon: CreditCard,
        title: "EMI Available",
        description: "3-12 months",
        bgColor: "bg-yellow-100",
        iconColor: "text-yellow-600"
    },
    {
        icon: Shield,
        title: "Payments",
        description: "Secured",
        bgColor: "bg-blue-100",
        iconColor: "text-blue-600"
    },
    {
        icon: Truck,
        title: "Quick Delivery",
        description: "One day delivery",
        bgColor: "bg-green-100",
        iconColor: "text-green-600"
    },
    {
        icon: TagIcon,
        title: "Brands",
        description: "Top Brands",
        bgColor: "bg-pink-950",
        iconColor: "text-pink-950"
    }
];

const Imgbanner = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    //   const { categories } = useContextStore();
    const [images, setImages] = useState<imagesArray[]>(ImagesListBanner);



    // useEffect(() => {
    //     if (categories && categories.length > 0) {
    //     const firstCategory = categories[0];
    //     if (firstCategory.image && firstCategory.image.length > 0) {
    //         setImages(firstCategory.image);
    //     }
    //     }
    // }, [categories]);

    // Memoize slide navigation functions
    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    }, [images.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    }, [images.length]);

    const goToSlide = useCallback((index: number) => {
        setCurrentIndex(index);
    }, []);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextSlide, prevSlide]);

    // Auto-play functionality
    useEffect(() => {
        if (!isAutoPlaying || images.length === 0) return;

        const interval = setInterval(nextSlide, 4000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, nextSlide, images.length]);

    if (images.length === 0) {
        return null; // Or a loading state
    }

    return (
        <div className="w-full  bg-white overflow-hidden">
            <div
                className="relative group"
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
            >
                {/* Image Container */}
                <div className="relative h-72 md:h-[18rem] lg:h-[18rem] rounded-xl overflow-hidden">
                    <div
                        className="flex transition-transform duration-700 ease-out h-full"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        role="region"
                        aria-label="Image carousel"
                    >
                        {images.map((image, index) => (
                            <div
                                key={`${image.name}-${index}`}
                                className="w-full flex-shrink-0 relative"
                                aria-hidden={currentIndex !== index}
                            >
                                <Image
                                    src={image.default}
                                    alt={image.name}
                                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                                    fill
                                    priority={index === currentIndex}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                                    quality={90}
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent">
                                    <div className="p-4">
                                        <h3 className="text-xl md:text-2xl font-semibold text-white">
                                            {image.name}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Arrows */}
                {/* <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button> */}
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center space-x-2 py-3 bg-gray-50" role="tablist">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentIndex
                                ? 'bg-blue-600 scale-125'
                                : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                        aria-selected={index === currentIndex}
                        role="tab"
                    />
                ))}
            </div>

            {/* Features Section */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-gray-50 py-4 px-2 md:px-8">
                {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                        <div
                            key={index}
                            className="flex items-center gap-3 "
                        >
                            <div
                                className={`flex items-center justify-center rounded-full w-10 h-10 `}
                            >
                                <Icon className={`w-6 h-6 ${feature.iconColor}`} absoluteStrokeWidth={true} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm text-gray-800">{feature.title}</h4>
                                <p className="text-xs text-gray-500">{feature.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Imgbanner;