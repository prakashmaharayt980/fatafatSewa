import React, { useState, useEffect, useCallback } from 'react';
import { Shield, CreditCard, Truck, Tag, ShieldCheck } from 'lucide-react';
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
        default: "https://fatafatsewa.com/storage/media/1641/apr-pod-banner-min.png",
        original: "https://fatafatsewa.com/storage/media/1641/apr-pod-banner-min.png",
        preview: "https://fatafatsewa.com/storage/media/1641/apr-pod-banner-min.png",
        thumbnail: 'https://fatafatsewa.com/storage/media/1641/apr-pod-banner-min.png',
        is_default: false,
    },
    {
        name: 'Special Offer',
        default: "https://fatafatsewa.com/storage/media/1642/watch-min.png",
        original: "https://fatafatsewa.com/storage/media/1642/watch-min.png",
        preview: "https://fatafatsewa.com/storage/media/1642/watch-min.png",
        thumbnail: 'https://fatafatsewa.com/storage/media/1642/watch-min.png',
        is_default: false,
    },
];

const TopBanner = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [images] = useState(ImagesListBanner);
    const [imageLoading, setImageLoading] = useState(true);

    
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

    return (
        <div className="w-full bg-gradient-to-br from-gray-50 to-white overflow-hidden m-0 p-0 sm:px-4">
            {/* Main Banner Section */}
            <div className="flex flex-col lg:flex-row gap-0 sm:gap-6 mb-2 sm:mb-8">
                {/* Main Carousel - 50% width */}
                <div className="flex-1 ">
                    <div
                        className="relative group"
                        onMouseEnter={() => setIsAutoPlaying(false)}
                        onMouseLeave={() => setIsAutoPlaying(true)}
                    >
                        {/* Image Container with Enhanced Styling */}
                        <div className="relative h-50 sm:h-52 md:h-56  rounded-none sm:rounded-2xl overflow-hidden">
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
                                            className="w-full h-full object-fill transition-transform duration-700"
                                            onLoad={() => setImageLoading(false)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                      
                       
                    </div>
                </div>

          
            </div>
        </div>
    );
};

export default TopBanner;