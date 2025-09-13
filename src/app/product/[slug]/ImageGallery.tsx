import React, { useState } from "react";
import Image from "next/image";
import { ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductDetails } from "./page";



interface ImageGalleryProps {
  product: ProductDetails;
  selectedColor: string;
  selectedImage: string;
  setSelectedImage: (image: string) => void;
}


const ImageGallery: React.FC<ImageGalleryProps> = ({
  product,
  selectedColor,
  selectedImage,
  setSelectedImage
}) => {
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomImageIndex, setZoomImageIndex] = useState(0);

  const getImagesForColor = (color: string) => {
    const variant = product.variants.find((v) => v.attributes.Color.toLowerCase() === color.toLowerCase());
    return [
      variant?.attributes.image || product.image,
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop",
   
    ];
  };

  const currentImages = selectedColor ? getImagesForColor(selectedColor) : [
    product.image,
    "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop",

  ];

  const openZoom = (imageIndex: number) => {
    setZoomImageIndex(imageIndex);
    setIsZoomOpen(true);
  };

  const closeZoom = () => {
    setIsZoomOpen(false);
  };

  const nextImage = () => {
    setZoomImageIndex((prev) => (prev + 1) % currentImages.length);
  };

  const prevImage = () => {
    setZoomImageIndex((prev) => (prev - 1 + currentImages.length) % currentImages.length);
  };

  const currentSelectedIndex = currentImages.indexOf(selectedImage || currentImages[0]);

  return (
    <>
      <div className="w-full h-full flex flex-col gap-3 sm:gap-1">
        {/* Main Image Container */}
        <div className="relative group">
          <div className="relative w-full h-80 sm:h-96 lg:h-[500px] xl:h-[600px] bg-gradient-to-br from-gray-50 to-white  overflow-hidden">
            <Image
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
              priority
            />
            <button
              onClick={() => openZoom(currentSelectedIndex)}
              className="absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-600 hover:text-gray-900 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg backdrop-blur-sm"
            >
              <ZoomIn size={18} />
            </button>
            {/* Image overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>
        
        {/* Thumbnail Strip */}
        <div className="flex gap-2 my-2 sm:gap-3 overflow-x-auto scrollbar-hide items-center justify-center px-2">
          {currentImages.slice(0, 4).map((image, idx) => (
            <div
              key={`${selectedColor}-${idx}`}
              className={`relative w-14 border-gray-200 h-14 sm:w-16 sm:h-16 cursor-pointer overflow-hidden rounded-lg border-2 transition-all duration-300 flex-shrink-0 group/thumb ${
                selectedImage === image
                  ? " "
                  : " hover:border-blue-300 hover:ring-1 hover:ring-blue-300/20 "
              }`}
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image}
                alt={`${product.name} view ${idx + 1}`}
                className="w-full h-full object-cover transition-all duration-300 group-hover/thumb:scale-110"
                fill
                sizes="(max-width: 640px) 56px, 64px"
              />
              {/* Thumbnail overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Zoom Modal */}
      {isZoomOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl max-h-[80vh] flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={closeZoom}
              className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-800 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
            >
              <X size={20} />
            </button>

            {/* Navigation Buttons */}
            {currentImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Zoomed Image */}
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={currentImages[zoomImageIndex]}
                alt={`${product.name} - Zoomed view`}
                className="max-w-full max-h-full object-contain rounded-md"
                width={600}
                height={600}
              />
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/80 text-gray-800 px-3 py-1 rounded-full text-xs">
              {zoomImageIndex + 1} / {currentImages.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;