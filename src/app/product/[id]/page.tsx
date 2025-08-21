"use client"

import React, { useState, useEffect, use } from 'react';
import { Star, ShoppingCart,  ShoppingBag, CreditCard } from 'lucide-react';
import RemoteServices from '@/app/api/remoteservice';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Shippinginfo from '../Shippinginfo';

import BrowserStyleTabs from '../MoreDetailsProduct';

// ProductDetails interface based on your provided structure
export interface ProductDetails {
  id: number;
  slug: string;
  short_description: string;
  description: string;
  sku: string;
  name: string
  brand_id: number;
  vendor_id: number | null;
  quantity: number;
  highlights: string;
  product_video_url: string | null;
  is_featured: number;
  emi_enabled: number;
  attribute_class_id: number;
  attributes: {
    attribute_class_id: number;
    product_attributes: Record<string, string>;
  };
  variant_attributes?: {
    Color?: string[];
    "Available Colors"?: string[];
  } | null;
  warranty_description: string | null;
  average_rating: number;
  discounted_price: number;
  image_urls: Array<{
    name: string;
    default: string;
    original: string;
    preview: string;
    thumbnail: string;
    is_default: boolean;
  }>;
  media: Array<{
    id: number;
    model_type: string;
    model_id: number;
    uuid: string;
    collection_name: string;
    name: string;
    file_name: string;
    mime_type: string;
    disk: string;
    conversions_disk: string;
    size: number;

    custom_properties: {
      color?: string;
      is_default?: boolean;
    };
    generated_conversions: {
      preview: boolean;
      thumbnail?: boolean;
    };

    order_column: number;
    created_at: string;
    updated_at: string;
    original_url: string;
    preview_url: string;
  }>;
  reviews: string[];
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
  product_image: {
    full: string;
    thumb: string;
  };
}

interface Props {
  params: Promise<{
    id: string
  }>
}

export default function ProductDetailsPage({ params }: Props) {
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [gallery, setgallery] = useState({
    selectedIndex: 0,
    zoom: false,
    zoomPos: { x: 0, y: 0 }
  })
  const [quantity, setQuantity] = useState<number>(1);
  const { id } = use(params);



  useEffect(() => {
    setLoading(true);
    setError(null);

    RemoteServices.ProductId(id)
      .then((data: ProductDetails) => {
        console.log('re', data);
        setProductDetails(data);
        setSelectedImage(data.image_urls.find(img => img.is_default)?.thumbnail || data.product_image.full);
        if (data.variant_attributes !== null) {
          setSelectedColor(data.variant_attributes?.Color?.[0] || data.variant_attributes?.['Available Colors'][0] || '');
        }
        setCurrentImageIndex(data.image_urls.findIndex(img => img.is_default) || 0);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load product details');
        setLoading(false);
        console.error('Error fetching product:', err);
      });
  }, [id]);



  if (loading) {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
              <div className="bg-gray-300 rounded-2xl h-96"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-20 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
    );
  }

  if (error) {
    return (
          <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-xl text-red-600 mb-4">Error Loading Product</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
    );
  }

  const handleAddToCart = () => {

  }

  const handleBuyNow = () => {

  }

  const handleQuantityChange = (newQuantity: number) => {
    if (productDetails && newQuantity > 0 && newQuantity <= productDetails.quantity) {
      setQuantity(newQuantity);
    }
  };

  const handlecolourselect = (color: string) => {
    setSelectedColor(color);
    if (productDetails?.image_urls) {
      const index = productDetails.image_urls.findIndex(imgclr => imgclr.name.toLowerCase().includes(color.toLowerCase()))
      if (index !== -1) {
        const img = productDetails.image_urls[index].thumbnail;
        setSelectedImage(img);
      }
    } else {
      setSelectedImage(productDetails?.image_urls[0].thumbnail || '');
    }
  };

  const handleZoom = (zoomed: boolean) => setgallery(s => ({
    ...s, zoom: zoomed
  }));

  const handleZoomMove = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    const y = Math.min(Math.max((e.clientY - rect.top) / rect.height, 0), 1);
    setgallery(s => ({
      ...s, zoomPos: { x, y }
    }));
  };

  const currencyunit = 'Rs. '

  if (!productDetails) return null;

  const originalPrice = productDetails.discounted_price + (productDetails.discountcampaign?.discount_value || 0);

  const zoomVisible = gallery.zoom;
  const zoomPos = gallery.zoomPos;
  const ZOOM = 2.2; // Magnification multiplier
  const ZOOM_SIZE = 260

  const handleSubmitReview = () => {

  }
  const renderRating = (rating: number, size = 18) => (
    <div className="flex items-center" aria-label={`${rating} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
          aria-hidden="true"
        />
      ))}
    </div>
  )


  return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Image Section */}
          <div
            className="relative w-full aspect-square rounded-lg max-h-[600px] overflow-hidden group bg-white shadow-sm"
            tabIndex={0}
            aria-label="Product image zoom"
            style={{ outline: "none" }}
            onMouseEnter={() => handleZoom(true)}
            onMouseLeave={() => handleZoom(false)}
            onMouseMove={zoomVisible ? handleZoomMove : undefined}
          >
            {/* Main image */}
            <Image
              src={selectedImage}
              alt={productDetails.name}
              className={`object-contain w-full  h-full transition-transform duration-200 ${zoomVisible ? "scale-110 cursor-zoom-out" : "scale-100 cursor-zoom-in"}`}
              style={{ pointerEvents: "none", userSelect: "none", borderRadius: "1rem" }}
              fill
            />
            {/* Magnifier */}
            {zoomVisible && (
              <div
                className="absolute border-2 border-blue-400 shadow-lg rounded-lg pointer-events-none z-20"
                style={{
                  width: ZOOM_SIZE,
                  height: ZOOM_SIZE,
                  left: `calc(${zoomPos.x * 100}% - ${ZOOM_SIZE / 2}px)`,
                  top: `calc(${zoomPos.y * 100}% - ${ZOOM_SIZE / 2}px)`,
                  background: `url('${selectedImage}') no-repeat`,
                  backgroundSize: `${ZOOM * 100}% ${ZOOM * 100}%`,
                  backgroundPosition: `${zoomPos.x * 100}% ${zoomPos.y * 100}%`,
                  opacity: 0.97,
                  transition: 'background-position 0.07s',
                  boxShadow: "0 0 16px rgba(0,0,0,0.18)"
                }}
              />
            )}

          </div>

          {/* Product Details Section */}
          <div className="space-y-3">
            {/* Product Title & Rating */}
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 ">{productDetails.name}</h1>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < Math.floor(productDetails.average_rating) ? 'fill-current' : ''}`} />
                    ))}
                  </div>
                  <span className="text-gray-600 text-sm">
                    {productDetails.average_rating} ({productDetails.reviews.length} reviews)
                  </span>
                </div>
                <span className="text-gray-400">|</span>
                <span className="text-sm text-gray-600">SKU: {productDetails.sku}</span>
              </div>
            </div>
            <p className="text-gray-700 ">
              {productDetails.highlights}
            </p>
            <div className="flex items-end gap-3 mb-1">
              <span className="text-2xl font-bold text-gray-900">
                {currencyunit}{productDetails.discounted_price.toLocaleString()}
              </span>
              {productDetails.discountcampaign && (productDetails.discounted_price !== originalPrice) && (
                <span className="text-xl text-gray-500 line-through">
                  {currencyunit}{originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            {productDetails.discountcampaign?.campaign && (
              <p className="text-sm text-red-600 font-medium">
                🔥 {productDetails.discountcampaign.campaign.title} - Save {currencyunit}{productDetails.discountcampaign.discount_value}
              </p>
            )}



            {/* Available Colors */}
            { productDetails.variant_attributes?.['Available Colors'] && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Available Colors</h3>
                <div className="flex gap-3 flex-wrap">
                  {productDetails?.variant_attributes?.['Available Colors']?.map((color, index) => (
                    <Button
                      key={index}
                      onClick={() => handlecolourselect(color)}
                      className={`px-3 py-1 m-0 rounded-4xl border  transition-all duration-200 ${selectedColor === color
                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-green-800 hover:text-white hover:border-gray-400'
                        }`}
                    >
                      {color}
                    </Button>


                  ))}
                </div>
              </div>
            )
          }


            {/* Stock Status */}
            <div className={`mb-6 mt-4 ${productDetails.quantity > 0 ? '' : 'item-center text-center  '}`}>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full  font-medium ${productDetails.quantity > 0 ? 'bg-green-100 text-green-800 text-xs ' : 'bg-red-100 text-red-800 text-xl'
                  }`}
              >
                {productDetails.quantity > 0
                  ? `In Stock (${productDetails.quantity} available)`
                  : 'Out of Stock'}
              </span>


            </div>

            {productDetails.quantity > 0 && (
              <div className="mb-6 ml-2">
                <div className="flex items-center gap-3 mb-2">
                  <label htmlFor="quantity" className="text-sm font-medium">Quantity</label>
                  <div className="flex items-center">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
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
                      onChange={e => handleQuantityChange(parseInt(e.target.value, 10) || 1)}
                      className="w-16 px-3 py-2 border-t border-b border-gray-300 text-center text-gray-900"
                      aria-label="Product quantity"
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= (productDetails.quantity || 0)}
                      className="px-3 py-2 border border-gray-300 rounded-r-md bg-gray-50 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}



            {/* Action Buttons Section */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-2">
                <Button
                  onClick={handleAddToCart}

                  className="flex-1 gap-2 hover:bg-gray-300"
                  size="lg"
                  aria-label="Add to cart"
                >
                  <ShoppingCart size={20} aria-hidden="true" />
                  Add to Cart
                </Button>
                <Button
                  onClick={handleBuyNow}

                  className="flex-1 gap-2  hover:bg-gray-300"
                  size="lg"
                  aria-label="Buy now"
                >
                  <ShoppingBag size={20} aria-hidden="true" className='text-green-900' />

                  <span className='text-green-900'>   Buy Now</span>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className={`flex-1 gap-2 text-red-600 border-transparent hover:bg-gray-300`}

                  aria-label="Add to wishlist"
                >
                  <CreditCard
                    size={20}
                    className={""}
                    aria-hidden="true"
                  />
                  <span className='text-blue-900'>  With EMI</span>
                </Button>
              </div>
              <Shippinginfo />
            </div>
          </div>
        </div>

        <BrowserStyleTabs productDesciption={productDetails.description} 
        keyFeatures={productDetails.attributes.product_attributes}
         ReviewsData={productDetails.reviews} />

       
      </div>
  );
}