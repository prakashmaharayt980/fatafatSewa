
import React from "react";
import Image from "next/image";
import { ProductDetails } from "./page";

interface ImageGalleryProps {
  product: ProductDetails;
  selectedColor: string;
  selectedImage: string;
  setSelectedImage: (image: string) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ product, selectedColor, selectedImage, setSelectedImage }) => {
  const getImagesForColor = (color: string) => {
    const variant = product.variants.find((v) => v.attributes.Color.toLowerCase() === color.toLowerCase());
    return [variant?.attributes.image || product.image];
  };

  const currentImages = selectedColor ? getImagesForColor(selectedColor) : [product.image];

  return (
    <div className="w-full max-w-[500px] mx-auto lg:mx-0">
      {/* Main Image */}
      <div className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden group cursor-crosshair">
        <Image
          src={selectedImage || currentImages[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          width={600}
          height={600}
          priority
        />
      </div>

      {/* Thumbnail Grid */}
      <div className="grid grid-cols-4 gap-1 mt-2">
        {currentImages.slice(0, 4).map((image, idx) => (
          <div
            key={`${selectedColor}-${idx}`}
            className={`aspect-square cursor-pointer overflow-hidden transition-all duration-300 group ${
              selectedImage === image ? "ring-2 ring-blue-500 ring-offset-1" : "hover:ring-2 hover:ring-gray-300"
            }`}
            onClick={() => setSelectedImage(image)}
          >
            <Image
              src={image}
              alt={`${product.name} view ${idx + 1}`}
              className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
              width={120}
              height={120}
            />
          </div>
        ))}
      </div>

      {/* Image Count Indicator */}
      {currentImages.length > 1 && (
        <div className="flex justify-center mt-2">
          <div className="flex space-x-0.5">
            {currentImages.slice(0, 4).map((_, idx) => (
              <div
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  selectedImage === currentImages[idx] ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
