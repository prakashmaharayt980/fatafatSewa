import React, { useState, useEffect, useCallback } from 'react';
import { Shield, CreditCard, Truck, Tag, ShieldCheck, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import Image from 'next/image';


export const ImagesListBanner = [
    {
        name: 'iPhone 16 Series EMI Plans',
        default: "https://fatafatsewa.com/storage/media/9919/iPhone-16-Series-in-EMI-Plans.jpg",
        original: "https://fatafatsewa.com/storage/media/9919/iPhone-16-Series-in-EMI-Plans.jpg",
        preview: "https://fatafatsewa.com/storage/media/9919/iPhone-16-Series-in-EMI-Plans.jpg",
        thumbnail: 'https://fatafatsewa.com/storage/media/9919/iPhone-16-Series-in-EMI-Plans.jpg',
        is_default: true,
    },
    {
        name: 'Samsung Banner',
        default: "https://fatafatsewa.com/storage/media/9772/conversions/Samung-Banner-thumb.jpg",
        original: "https://fatafatsewa.com/storage/media/9772/conversions/Samung-Banner-thumb.jpg",
        preview: "https://fatafatsewa.com/storage/media/9772/conversions/Samung-Banner-thumb.jpg",
        thumbnail: 'https://fatafatsewa.com/storage/media/9772/conversions/Samung-Banner-thumb.jpg',
        is_default: true,
    },
    {
        name: 'iPhone Deal',
        default: "https://fatafatsewa.com/storage/media/9771/conversions/iPhone-Deal-thumb.jpg",
        original: "https://fatafatsewa.com/storage/media/9771/conversions/iPhone-Deal-thumb.jpg",
        preview: "https://fatafatsewa.com/storage/media/9771/conversions/iPhone-Deal-thumb.jpg",
        thumbnail: 'https://fatafatsewa.com/storage/media/9771/conversions/iPhone-Deal-thumb.jpg',
        is_default: false,
    },
];

const features = [
    {
        icon: ShieldCheck,
        title: "Genuine Products",
        description: "24 months warranty",
        bgColor: "from-emerald-50 to-emerald-100",
        iconColor: "text-emerald-600",
        borderColor: "border-emerald-200"
    },
    {
        icon: CreditCard,
        title: "EMI Available",
        description: "3-12 months",
        bgColor: "from-amber-50 to-amber-100",
        iconColor: "text-amber-600",
        borderColor: "border-amber-200"
    },
    {
        icon: Shield,
        title: "Secure Payments",
        description: "100% protected",
        bgColor: "from-blue-50 to-blue-100",
        iconColor: "text-blue-600",
        borderColor: "border-blue-200"
    },
    {
        icon: Truck,
        title: "Quick Delivery",
        description: "Same day delivery",
        bgColor: "from-purple-50 to-purple-100",
        iconColor: "text-purple-600",
        borderColor: "border-purple-200"
    },
    {
        icon: Tag,
        title: "Top Brands",
        description: "Premium quality",
        bgColor: "from-rose-50 to-rose-100",
        iconColor: "text-rose-600",
        borderColor: "border-rose-200"
    }
];

const Imgbanner = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [images] = useState(ImagesListBanner);
    const [imageLoading, setImageLoading] = useState(true);

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

    const goToSlide = useCallback((index) => {
        setCurrentIndex(index);
    }, []);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
            if (e.key === ' ') {
                e.preventDefault();
                setIsAutoPlaying(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextSlide, prevSlide]);

    // Auto-play functionality
    useEffect(() => {
        if (!isAutoPlaying || images.length === 0) return;

        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, nextSlide, images.length]);

    if (images.length === 0) {
        return (
            <div className="w-full h-60 sm:h-80 bg-gradient-to-r from-gray-100 to-gray-200 rounded-none sm:rounded-2xl animate-pulse flex items-center justify-center">
                <div className="text-gray-400">Loading...</div>
            </div>
        );
    }

    return (
        <div className="w-full bg-gradient-to-br from-gray-50 to-white overflow-hidden m-0 p-0 sm:px-4">
            {/* Main Banner Section */}
            <div className="flex flex-col lg:flex-row gap-0 sm:gap-6 mb-2 sm:mb-8">
                {/* Main Carousel */}
                <div className="flex-1">
                    <div
                        className="relative group"
                        onMouseEnter={() => setIsAutoPlaying(false)}
                        onMouseLeave={() => setIsAutoPlaying(true)}
                    >
                        {/* Image Container with Enhanced Styling */}
                        <div className="relative h-48 sm:h-80 md:h-96 lg:h-[28rem] rounded-none sm:rounded-2xl overflow-hidden">
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
                                            fill
                                            className="w-full h-full object-cover transition-transform duration-700"
                                            onLoad={() => setImageLoading(false)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Dots Indicator */}
                        <div className="flex justify-center space-x-2 py-2 sm:py-3 bg-gray-50" role="tablist">
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
                    </div>
                </div>

                {/* Side Images - Hidden on Mobile */}
                <div className="hidden lg:flex lg:w-80 lg:flex-col gap-4">
                    {images.slice(1, 3).map((image, index) => (
                        <div key={index} className="relative group cursor-pointer flex-1">
                            <div className="relative h-48 rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-gray-100 to-gray-200">
                                <Image
                                    src={image.default}
                                    alt={image.name}
                                    className="w-full h-full object-cover transition-transform duration-500"
                                    onClick={() => goToSlide(index + 1)}
                                    fill
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute bottom-3 left-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <p className="text-sm font-medium drop-shadow-lg">{image.name}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Features Section - Mobile Optimized */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4 border border-gray-300 rounded-xl shadow bg-gray-50 py-3 px-2 sm:py-4 sm:px-2 md:px-8 m-0">
                {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                        <div
                            key={index}
                            className="flex flex-col sm:flex-row items-center sm:gap-3 p-1 text-center sm:text-left"
                        >
                            <div className="flex items-center justify-center rounded-full w-8 h-8 sm:w-10 sm:h-10 mb-1 sm:mb-0">
                                <Icon className={`w-4 h-4 sm:w-6 sm:h-6 ${feature.iconColor}`} absoluteStrokeWidth={true} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h4 className="font-semibold text-xs sm:text-sm text-gray-800 leading-tight">{feature.title}</h4>
                                <p className="text-xs text-gray-500 leading-tight hidden sm:block">{feature.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Imgbanner;