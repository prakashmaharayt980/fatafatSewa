"use client";

import React, { useState, useEffect } from "react";
import { Star, ShoppingCart, CreditCard, ChevronRight, Shield, Truck, Package2, Gift } from "lucide-react";
import RemoteServices from "@/app/api/remoteservice";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Shippinginfo from "../Shippinginfo";
import BrowserStyleTabs from "../MoreDetailsProduct";
import ImageGallery from "./ImageGallery";
import ProductInfo from "./ProductInfo";

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

interface Props {
  params: Promise<{
    slug: string;
  }>;
}


export default function ProductDetailsPage({ params }: Props) {
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  const slug = React.use(params).slug;

  useEffect(() => {
    setLoading(true);
    setError(null);

    RemoteServices.ProductDetailsSlug(slug)
      .then((data: ProductDetails) => {
        setProductDetails(data);
        setSelectedImage(data.image);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-200 rounded-xl h-96"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-red-600 mb-4">Error Loading Product</h2>
            <p className="text-gray-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!productDetails) return null;

  const renderRating = (rating: number, size = 18) => (
    <div className="flex items-center" aria-label={`${rating} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
          aria-hidden="true"
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto ">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm mb-3 bg-white/60 backdrop-blur-md rounded-full px-6 py-3 border border-gray-200/50">
          <Link href="/" className="text-gray-500 hover:text-blue-600 transition-colors font-medium">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-300" />
          <a
            href={`/category/${productDetails?.categories[0]?.slug}`}
            className="text-gray-500 hover:text-blue-600 transition-colors font-medium"
          >
            {productDetails?.categories[0]?.title}
          </a>
          <ChevronRight className="w-4 h-4 text-gray-300" />
          <span className="text-gray-900 font-semibold">{productDetails?.name}</span>
        </nav>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
          <ImageGallery
            product={productDetails}
            selectedColor={selectedColor}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />
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

        {/* Product Details Tabs */}
        <div className="mt-8">
          <BrowserStyleTabs
            productDesciption={""}
            keyFeatures={productDetails.attributes}
            ReviewsData={productDetails?.reviews}
          />
        </div>
      </div>
    </div>
  );
}