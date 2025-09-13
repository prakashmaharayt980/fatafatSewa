"use client";

import React, { useState, useEffect } from "react";
import { Star, ChevronRight } from "lucide-react";
import RemoteServices from "@/app/api/remoteservice";

import Link from "next/link";

import ImageGallery from "./ImageGallery";
import ProductInfo from "./ProductInfo";
import MoreDetailsProduct from "./MoreDetailsProduct";
import BasketCard from "@/app/homepage/BasketCard";


import { SlugProps } from "@/app/types/PropSlug";
import { CategorySlug } from "@/app/types/CategoryTypes";
import ReletdProducts from "./ReletedProduct";

// ProductDetails interface based on API response
export interface ProductDetails {
  id: number;
  name: string;
  slug: string;
  price: number;
  pre_order: number;
  pre_order_price: number | null;
  quantity: number;
  discounted_price: number;
  emi_enabled: number;
  brand: {
    id: number;
    name: string;
    slug: string;
    status: string;
    brand_image: {
      full: string;
      thumb: string;
    };
  };
  image: string;
  reviews: [];
  highlights: string;
  attributes: Record<string, string>;
  average_rating: number;
  categories: Array<{
    id: number;
    title: string;
    slug: string;
    image: {
      full: string;
      thumb: string;
      preview: string;
    };
  }>;
  variants: Array<{
    id: number;
    product_id: number;
    quantity: number;
    price: number;
    attributes: {
      Color: string;
      image?: string; // Optional image per variant
    };
    created_at: string;
    updated_at: string;
  }>;
  discountcampaign: {
    id: number;
    product_id: number;
    discount_type: number;
    discount_value: number;
    campaign_id: number;
    created_at: string;
    updated_at: string;
    campaign: {
      id: number;
      title: string;
      slug: string;
      start_date: string;
      end_date: string;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
      is_active: boolean;
    };
  } | null;
}




export default function ProductDetailsPage({ params }: SlugProps) {
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [ProductReleted, setProductReleted] = useState<{
    slug: string;
    outCome:CategorySlug[]
  }> ({
    slug: '',
    outCome:[]
  })
  const slug = React.use(params).slug;

  useEffect(() => {
    setLoading(true);
    setError(null);

    RemoteServices.ProductDetailsSlug(slug)
      .then((data: ProductDetails) => {
        setProductDetails(data);
        setSelectedImage(data.image);
        setProductReleted(prev => ({ ...prev, slug: data.categories[0]?.slug }))
        if (data.variants.length > 0) {
          setSelectedColor(data.variants[0].attributes.Color);
          setSelectedImage(data.variants[0].attributes.image || data.image);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load product details");
        setLoading(false);
        console.error("Error fetching product:", err);
      });


  }, [slug]);

  useEffect(() => {
    if(ProductReleted.slug){
      RemoteServices.CategoriesSlug(ProductReleted.slug).then((data) => {
        console.log("Categories data:", data);
        setProductReleted(prev => ({ ...prev, outCome: [data] }))
      })
    }
  }, [ProductReleted.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="animate-pulse">
            {/* Breadcrumb Skeleton */}
            <div className="flex items-center space-x-2 mb-6 sm:mb-8">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-4"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-4"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
              {/* Image Gallery Skeleton */}
              <div className="space-y-4">
                <div className="bg-gray-200 rounded-2xl h-80 sm:h-96 lg:h-[500px] animate-pulse"></div>
                <div className="flex space-x-2 justify-center">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-gray-200 rounded-lg h-16 w-16 animate-pulse"></div>
                  ))}
                </div>
              </div>
              
              {/* Product Info Skeleton */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-12 bg-gray-200 rounded-lg w-full animate-pulse"></div>
                  <div className="h-12 bg-gray-200 rounded-lg w-full animate-pulse"></div>
                  <div className="h-12 bg-gray-200 rounded-lg w-full animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12 animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-red-600 mb-4">Error Loading Product</h2>
            <p className="text-gray-500 text-lg mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-medium hover:scale-105"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!productDetails) return null;

  const renderRating = (rating: number, size = 12) => (
    <div className="flex items-center space-x-1" aria-label={`${rating} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className={`transition-all duration-200 ${
            i < rating 
              ? "text-yellow-400 fill-yellow-400 drop-shadow-sm" 
              : "text-gray-300 hover:text-yellow-200"
          }`}
          aria-hidden="true"
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto  px-4 sm:px-1 lg:px-2 py-2 sm:py-2">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm mb-6 sm:mb-8 animate-slide-up">
          <Link 
            href="/" 
            className="text-gray-500 hover:text-blue-600 transition-all duration-200 font-medium hover:scale-105"
          >
            Home
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-300 transition-transform duration-200" />
          <Link
            href={`/category/${productDetails?.categories[0]?.slug}`}
            className="text-gray-500 hover:text-blue-600 transition-all duration-200 font-medium hover:scale-105"
          >
            {productDetails?.categories[0]?.title}
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-300 transition-transform duration-200" />
          <span className="text-gray-900 font-semibold truncate max-w-xs sm:max-w-none">
            {productDetails?.name}
          </span>
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 mb-12 animate-fade-in">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
              <ImageGallery
                product={productDetails}
                selectedColor={selectedColor}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
              />
            </div>
          </div>
          
          {/* Product Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-all duration-300">
              <ProductInfo
                product={productDetails}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                quantity={quantity}
                setQuantity={setQuantity}
                renderRating={renderRating}
              />
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-12 animate-slide-up">
          <div className=" overflow-hidden  transition-all duration-300">
            <MoreDetailsProduct
              productDesciption={productDetails.highlights}
              keyFeatures={productDetails.attributes}
              ReviewsData={productDetails?.reviews}
            />
          </div>
        </div>

        {/* Related Products */}
        {ProductReleted.outCome && ProductReleted.outCome.length > 0 && (
          <div className="space-y-8 animate-fade-in">
            <div className=" p-1   transition-all duration-300">
              <ReletdProducts 
                title={`More from ${productDetails.brand.name}`} 
                items={ProductReleted.outCome} 
              />
            </div>
            
            <div className=" p-1   transition-all duration-300">
              <ReletdProducts 
                title="Customer Also Viewed" 
                items={ProductReleted.outCome} 
              />
            </div>
            
            <div className=" p-1   transition-all duration-300">
              <ReletdProducts 
                title="Products Related to this" 
                items={ProductReleted.outCome} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}