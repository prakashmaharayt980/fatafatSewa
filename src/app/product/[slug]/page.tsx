"use client";

import React, { useState, useEffect } from "react";
import { Star, ShoppingCart, CreditCard, ChevronRight, Shield, Truck, Package2, Gift } from "lucide-react";
import RemoteServices from "@/app/api/remoteservice";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Shippinginfo from "../Shippinginfo";
import BrowserStyleTabs from "../MoreDetailsProduct";

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
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

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

  const handleAddToCart = () => {
    // Add to cart logic
  };

  const handleBuyNow = () => {
    // Buy now logic
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (productDetails && newQuantity > 0 && newQuantity <= productDetails.quantity) {
      setQuantity(newQuantity);
    }
  };

  const handleColourSelect = (color: string) => {
    setSelectedColor(color);
    const variant = productDetails?.variants.find((v) => v.attributes.Color.toLowerCase() === color.toLowerCase());
    if (variant) {
      setSelectedImage(variant.attributes.image || productDetails?.image || "");
    }
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - target.left) / target.width;
    const y = (e.clientY - target.top) / target.height;
    setZoomPos({ x: Math.min(Math.max(x, 0), 1), y: Math.min(Math.max(y, 0), 1) });
  };

  const currencyunit = "Rs. ";

  if (!productDetails) return null;

  const originalPrice = productDetails.price; // Using original price from the data
  const discountPercentage = productDetails.discountcampaign
    ? Math.round((productDetails.discountcampaign.discount_value / originalPrice) * 100)
    : 0;
  const currentTime = new Date(); // Current time: 07:46 PM +0545, Aug 26, 2025
  const deliveryDate = new Date(currentTime);
  deliveryDate.setDate(deliveryDate.getDate() + 2); // Assuming 2-day delivery
  const timeLeft = 24 - currentTime.getHours() + (46 - currentTime.getMinutes()) / 60; // Hours left until next day

  const ZOOM_FACTOR = 2.5;
  const ZOOM_SIZE = 200;

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div
              className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 shadow-md"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
            >
              <Image
                src={selectedImage || productDetails?.image}
                alt={productDetails?.name}
                className="w-full h-full object-contain p-4 transition-transform duration-200"
                width={600}
                height={600}
                priority
              />
              {isZoomed && (
                <div
                  className="absolute top-0 right-[-260px] w-[250px] h-[250px] rounded-lg overflow-hidden border border-gray-200 shadow-lg"
                  style={{
                    backgroundImage: `url(${selectedImage || productDetails?.image})`,
                    backgroundSize: `${600 * ZOOM_FACTOR}px ${600 * ZOOM_FACTOR}px`,
                    backgroundPosition: `${-zoomPos.x * (600 * ZOOM_FACTOR - ZOOM_SIZE)}px ${
                      -zoomPos.y * (600 * ZOOM_FACTOR - ZOOM_SIZE)
                    }px`,
                  }}
                />
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {productDetails?.variants
                .filter((variant) => variant.quantity > 0)
                .map((variant, idx) => (
                  <div
                    key={idx}
                    className={`cursor-pointer rounded-lg overflow-hidden bg-gray-50 border-2 transition-all duration-200 ${
                      selectedColor === variant.attributes.Color ? "border-blue-500 shadow-sm" : "border-transparent"
                    }`}
                    onClick={() => handleColourSelect(variant.attributes.Color)}
                  >
                    <Image
                      src={variant.attributes.image || productDetails.image}
                      alt={variant.attributes.Color}
                      className="w-full h-full object-contain p-2 hover:scale-105 transition-transform duration-200"
                      width={100}
                      height={100}
                    />
                  </div>
                ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-1">
            {/* Brand and Product Title */}
            <div className="flex items-center gap-2">
     
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                {productDetails?.name} {selectedColor ? `- ${selectedColor}` : ""}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              {renderRating(productDetails?.average_rating || 0, 16)}
              <span className="text-sm text-gray-500">
                ({productDetails?.reviews.length} ratings)
              </span>
            </div>

            {/* Price and Delivery */}
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-gray-900">
                {currencyunit}{productDetails?.discounted_price.toLocaleString()}
              </span>
              {
              // originalPrice > productDetails.discounted_price
              true
              && (
                <span className="text-lg text-gray-400 line-through">
                  {currencyunit}{originalPrice.toLocaleString()}
                </span>
              )}
              {true
              // discountPercentage > 0 
              &&
              
              (
                <span className="text-sm bg-[var(--colour-fsP1)]/70  py-1 rounded-full px-2">
                  {discountPercentage}% OFF
                </span>
              )}
            <span
              className="inline-flex items-center border rounded-full px-1.5 sm:px-2 py-0.5 sm:py-1 text-[12px] sm:text-xs border-gray-200 "
            >
              <Gift className="mr-0.5 sm:mr-1 h-3 w-3 sm:h-3 z-10 sm:w-3 px-2" />
              <p className="text-white">Special Offer</p>
            </span>
            </div>

            {/* Express Delivery */}
            {/* Product Highlights & Delivery Estimate */}
            <div className="flex flex-col gap-2 mt-2">
              {/* Highlights */}
              {productDetails.highlights && (
              <div className="flex items-center gap-2">
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-medium">
                {productDetails.highlights}
                </span>
              </div>
              )}
              {/* Estimated Delivery */}
              <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-700">
                Estimated Delivery:&nbsp;
                <span className="font-semibold">
                {deliveryDate.toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
                </span>
                {timeLeft > 0 && (
                <span className="ml-2 text-xs text-gray-500">
                  (Order within {Math.floor(timeLeft)}h {Math.round((timeLeft % 1) * 60)}m)
                </span>
                )}
              </span>
              </div>
            </div>

            {/* Color Selection */}
            {productDetails.variants.length > 0 && (
              <div>
                <h3 className="text-md font-medium text-gray-700 mb-2">Available Colors</h3>
                <div className="flex gap-2 flex-wrap">
                  {productDetails.variants
                    .filter((variant) => variant.quantity > 0)
                    .map((variant, index) => (
                      <Button
                        key={index}
                        onClick={() => handleColourSelect(variant.attributes.Color)}
                        className={`px-3 py-1 rounded-full transition-all duration-200 ${
                          selectedColor === variant.attributes.Color
                            ? "bg-blue-600 text-white border-blue-600 shadow-md"
                            : "bg-gray-100 text-gray-700 border-gray-100 hover:bg-blue-100 hover:border-blue-200"
                        }`}
                      >
                        {variant.attributes.Color}
                      </Button>
                    ))}
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div className="mt-2">
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                  productDetails.quantity > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}
              >
                {productDetails.quantity > 0
                  ? `In Stock (${productDetails.quantity} available)`
                  : "Out of Stock"}
              </span>
            </div>

            {/* Quantity Selector */}
            {productDetails.quantity > 0 && (
              <div className="flex items-center gap-4">
                <label htmlFor="quantity" className="text-sm font-medium text-gray-700">Quantity</label>
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    max={productDetails.quantity || 0}
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10) || 1)}
                    className="w-12 text-center border-x border-gray-200 py-1 text-gray-900"
                    aria-label="Product quantity"
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= (productDetails.quantity || 0)}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Purchase Actions */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 hover:shadow-md transition-all"
                  size="lg"
                  disabled={productDetails.quantity === 0}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  onClick={handleBuyNow}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md transition-all"
                  size="lg"
                  disabled={productDetails.quantity === 0}
                >
                  Buy Now
                </Button>
              </div>
              {productDetails?.emi_enabled === 1 && (
                <Button
                  variant="outline"
                  className="w-full border-gray-200 hover:bg-gray-50 hover:shadow-sm transition-all"
                  size="lg"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  EMI Available
                </Button>
              )}
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <Shield className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Genuine Product</p>
                  <p className="text-xs text-gray-500">100% Authentic</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <Truck className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Free Delivery</p>
                  <p className="text-xs text-gray-500">Orders above Rs. 999</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <Package2 className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Easy Returns</p>
                  <p className="text-xs text-gray-500">7 Days Return Policy</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <Gift className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Special Offers</p>
                  <p className="text-xs text-gray-500">Festival Discounts</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-8">
          <BrowserStyleTabs
            productDesciption={productDetails?.highlights}
            keyFeatures={productDetails.attributes}
            ReviewsData={productDetails?.reviews}
          />
        </div>
      </div>
    </div>
  );
}