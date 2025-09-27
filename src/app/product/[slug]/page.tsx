"use client";

import React, { useState, useEffect } from "react";
import { Star, ChevronRight } from "lucide-react";
import RemoteServices from "@/app/api/remoteservice";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import ImageGallery from "./ImageGallery";
import ProductInfo from "./ProductInfo";
import MoreDetailsProduct from "./MoreDetailsProduct";
import ReletdProducts from "./ReletedProduct";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useContextCart } from "@/app/checkout/CartContext";
import { useRouter } from "next/navigation";
import { useContextEmi } from "@/app/emi/emiContext";
import { SlugProps } from "@/app/types/PropSlug";
import { CategorySlug, ProductDetails } from "@/app/types/CategoryTypes";

export default function ProductDetailsPage({ params }: SlugProps) {
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [productReleted, setProductReleted] = useState<{
    slug: string;
    outCome: CategorySlug[];
  }>({
    slug: "",
    outCome: [],
  });
  const { addToCart, setIsDrawerOpen } = useContextCart();
  const { setEmiContextInfo } = useContextEmi();
  const slug = React.use(params).slug;
  const { ref: mainProductRef, inView: isMainVisible } = useInView({
    threshold: 0,
    initialInView: true,
    rootMargin: "-200px 0px 0px 0px",
  });

  // Lazy loading for related products
  const { ref: relatedProductsRef, inView: isRelatedVisible } = useInView({
    threshold: 0,
    triggerOnce: true, // Fetch only once when section enters viewport
  });

  const router = useRouter();
  const handlerouter = (path: string) => {
    router.push(path);
  };

  // Fetch product details (not lazy-loaded as it's critical)
  useEffect(() => {
    setLoading(true);
    setError(null);

    RemoteServices.ProductDetailsSlug(slug)
      .then((data: ProductDetails) => {
        setProductDetails(data);
        setSelectedImage(data.image);
        setProductReleted((prev) => ({ ...prev, slug: data.categories[0]?.slug }));
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

  // Lazy load related products when section is in view
  useEffect(() => {
    if (isRelatedVisible && productReleted.slug) {
      RemoteServices.CategoriesSlug(productReleted.slug)
        .then((data) => {
          setProductReleted((prev) => ({ ...prev, outCome: [data] }));
        })
        .catch((err) => {
          console.error("Error fetching related products:", err);
        });
    }
  }, [isRelatedVisible, productReleted.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="animate-pulse">
            <div className="flex items-center space-x-2 mb-6 sm:mb-8">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-4"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-4"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
              <div className="space-y-4">
                <div className="bg-gray-200 rounded-2xl h-80 sm:h-96 lg:h-[500px] animate-pulse"></div>
                <div className="flex space-x-2 justify-center">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-gray-200 rounded-lg h-16 w-16 animate-pulse"></div>
                  ))}
                </div>
              </div>
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
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-red-600 mb-4">
              Error Loading Product
            </h2>
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
      {/* Bottom Premium Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg border-t border-gray-300 transform transition-all duration-300 ${
          !isMainVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-white shadow">
              <Image
                src={selectedImage}
                alt={productDetails?.name || ""}
                fill
                className="object-contain p-1"
              />
            </div>
            <div className="max-w-[200px] hidden sm:block">
              <h3 className="text-sm font-medium truncate">{productDetails?.name}</h3>
              <p className="text-blue-600 font-semibold">
                NPR {productDetails?.discounted_price || productDetails?.price}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className={cn(
                "flex items-center justify-center gap-2 px-4 py-3",
                "rounded-lg font-medium text-sm transition-all duration-200",
                "hover:shadow-md active:transform active:scale-95",
                "bg-[var(--colour-fsP1)] text-white"
              )}
              onClick={() => addToCart(productDetails, 1, true)}
            >
              Add to Cart
            </button>
            {productDetails?.emi_enabled === 1 && (
              <button
                className={cn(
                  "flex items-center justify-center gap-2 px-2 py-2 sm:px-4 sm:py-3",
                  "rounded-lg font-medium text-sm transition-all duration-200",
                  "hover:shadow-md active:transform active:scale-95",
                  "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
                )}
                onClick={() => {
                  setEmiContextInfo((prev) => ({
                    ...prev,
                    product: productDetails,
                  }));
                  localStorage.setItem("recent emi", JSON.stringify(productDetails));
                  handlerouter("/emi/applyemi");
                }}
              >
                Apply EMI
              </button>
            )}
          </div>
        </div>
        <div className="h-[env(safe-area-inset-bottom)]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-1 lg:px-2 py-2 sm:py-2">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto my-3 shadow-lg p-3 rounded-2xl overflow-hidden">
          <nav className="flex items-center space-x-2 text-sm mt-2 mb-6 sm:mb-8 animate-slide-up">
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
          <div ref={mainProductRef} className="grid grid-cols-1 lg:grid-cols-5 mx-auto gap-2 animate-fade-in rounded-2xl">
            <div className="col-span-2">
              <ImageGallery
                product={productDetails}
                selectedColor={selectedColor}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
              />
            </div>
            <div className="col-span-3">
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

          <div className="flex flex-col gap-3 mt-3">
            <label className="text-xl font-semibold text-gray-900 mb-1">Product Highlight</label>
            <div className="flex flex-col gap-3">
              {productDetails.highlights && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                  {productDetails.highlights.split("|").map((highlight, index) => (
                    <div key={`highlight-${index}`} className="flex items-start gap-2">
                      <span className="text-yellow-600 text-lg leading-none">•</span>
                      <span className="text-sm font-medium text-gray-800">{highlight.trim()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-12 animate-slide-up">
          <div className="overflow-hidden transition-all duration-300">
            <MoreDetailsProduct
              productDesciption={productDetails.highlights}
              keyFeatures={productDetails.attributes}
              ReviewsData={productDetails?.reviews}
            />
          </div>
        </div>

        {/* Lazy-Loaded Related Products */}
        <div ref={relatedProductsRef} className="space-y-8 animate-fade-in">
          {isRelatedVisible && productReleted.outCome && productReleted.outCome.length > 0 && (
            <>
              <div className="p-1 transition-all duration-300">
                <ReletdProducts
                  title={`More from ${productDetails.brand.name}`}
                  slug={productDetails.categories[0]?.slug}
                />
              </div>
              <div className="p-1 transition-all duration-300">
                <ReletdProducts
                  title="Customer Also Viewed"
                  slug={"laptop-price-in-nepal"}
                />
              </div>
              <div className="p-1 transition-all duration-300">
                <ReletdProducts
                  title="Products Related to this"
                  slug={"accessories-price-in-nepal"}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}