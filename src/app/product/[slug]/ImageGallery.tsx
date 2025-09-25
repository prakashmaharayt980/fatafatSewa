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



  return (
    <>
      <div className="w-full h-full max-w-lg flex flex-col gap-3 sm:gap-1 justify-center ">
        {/* Main Image Container */}

        <div className="relative w-full aspect-square   bg-gradient-to-br from-gray-50 to-white overflow-hidden  group">
          {/* <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors duration-300" /> */}
          <Image
            src={selectedImage}
            alt={product.name}
            className="w-full h-full object-contain transition-all rounded duration-500  "
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 60vw"
            quality={90}
            priority
          />
          {/* <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-xl" /> */}
        </div>
        {/* Thumbnail Strip */}
        <div className="flex gap-3  overflow-x-auto scrollbar-hide items-center justify-center p-2">
          {currentImages.slice(0, 4).map((image, idx) => (
            <div
              key={`${selectedColor}-${idx}`}
              className={`relative w-16 h-16  cursor-pointer overflow-hidden rounded-lg transition-all duration-300 flex-shrink-0 group/thumb 
                ${selectedImage === image
                  ? "ring-1 ring-[var(--colour-fsP2)] ring-offset-1"
                  : ''
                }`}
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image}
                alt={`${product.name} view ${idx + 1}`}
                className="w-full h-full object-cover transition-all duration-300 group-hover/thumb:scale-105"
                fill
                quality={85}
                sizes="(max-width: 640px) 32px, 40px"
              />

            </div>
          ))}
        </div>
      </div>

    </>
  );
};

export default ImageGallery;