import React, { useState } from "react";
import Image from "next/image";
import { ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductDetails {
  name: string;
  image: string;
  variants: Array<{
    attributes: {
      Color: string;
      image: string;
    };
  }>;
}

interface ImageGalleryProps {
  product?: ProductDetails;
  selectedColor: string;
  selectedImage: string;
  setSelectedImage: (image: string) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  product = {
    name: "Premium Wireless Headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
    variants: [
      { attributes: { Color: "black", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop" } },
      { attributes: { Color: "white", image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop" } },
    ],
  }, 
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
      "https://images.unsplash.com/photo-1564424224651-efa32efb7d0f?w=600&h=600&fit=crop",
    ];
  };

  const currentImages = selectedColor ? getImagesForColor(selectedColor) : [
    product.image,
    "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1564424224651-efa32efb7d0f?w=600&h=600&fit=crop",
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
      <div className="w-full h-full flex flex-col gap-3">
        {/* Main Image Container */}
        <div className="relative group">
          <div className="relative w-full min-w-[400px] min-h-[400px] aspect-square bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
            <Image
              src={selectedImage || currentImages[0]}
              alt={product.name}
              className="w-full h-full object-fill transition-transform duration-300 group-hover:scale-105"
              width={500}
              height={400}
              priority
            />
            <button
              onClick={() => openZoom(currentSelectedIndex)}
              className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-600 hover:text-gray-800 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <ZoomIn size={16} />
            </button>
          </div>
        </div>

        {/* Thumbnail Strip */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide items-center justify-center">
          {currentImages.slice(0, 4).map((image, idx) => (
            <div
              key={`${selectedColor}-${idx}`}
              className={`relative w-16 h-16 cursor-pointer overflow-hidden rounded-md border transition-all duration-200 flex-shrink-0 ${
                selectedImage === image 
                  ? "border-blue-500 ring-1 ring-blue-500/20" 
                  : "border-gray-200 hover:border-gray-300 hover:ring-1 hover:ring-gray-300/20"
              }`}
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image}
                alt={`${product.name} view ${idx + 1}`}
                className="w-full h-full object-contain transition-transform duration-200 hover:scale-110"
                fill
              />
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