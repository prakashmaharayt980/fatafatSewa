import { CheckCheck, Heart, Truck } from "lucide-react";
import Image from "next/image";

const ProductCard = ({ product, index }: { product: any, index: number }) => {
    const originalPrice = parseInt(product.price) || product.discounted_price;
    const discountPercent = originalPrice > product.discounted_price
        ? Math.round(((originalPrice - product.discounted_price) / originalPrice) * 100)
        : 0;

    return (
        <div
            key={index}
            className="group relative cursor-pointer rounded-xl bg-white 
                       transition-all duration-300 overflow-hidden
                       hover:translate-y-3 mb-4 "
            style={{
                
                boxShadow: `
                    0 -2px 8px rgba(107, 114, 128, 0.06),
                    0 4px 12px rgba(107, 114, 128, 0.08),
                    0 2px 6px rgba(107, 114, 128, 0.06),
                    inset 0 1px 0 rgba(255, 255, 255, 0.7),
                    inset 0 -1px 0 rgba(107, 114, 128, 0.1)
                `,
                background: `
                    linear-gradient(145deg, #ffffff 0%, #f9fafb 100%),
                    linear-gradient(45deg, transparent 49%, rgba(107, 114, 128, 0.02) 50%, transparent 51%),
                    linear-gradient(-45deg, transparent 49%, rgba(107, 114, 128, 0.02) 50%, transparent 51%)
                `,
                backgroundSize: 'cover, 12px 12px, 12px 12px'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `
                    0 -4px 15px rgba(107, 114, 128, 0.1),
                    0 12px 30px rgba(107, 114, 128, 0.15),
                    0 6px 20px rgba(107, 114, 128, 0.1),
                    inset 0 2px 0 rgba(255, 255, 255, 0.8),
                    inset 0 -2px 0 rgba(107, 114, 128, 0.15)
                `;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = `
                    0 -2px 8px rgba(107, 114, 128, 0.06),
                    0 4px 12px rgba(107, 114, 128, 0.08),
                    0 2px 6px rgba(107, 114, 128, 0.06),
                    inset 0 1px 0 rgba(255, 255, 255, 0.7),
                    inset 0 -1px 0 rgba(107, 114, 128, 0.1)
                `;
            }}
        >
            {/* Wishlist Heart */}
            <button
                className="absolute right-2 top-2 z-20 rounded-full p-1.5 
                          transition-all duration-200 hover:scale-110"
                style={{
                    background: 'linear-gradient(145deg, #ffffff, #f3f4f6)',
                    boxShadow: '0 2px 6px rgba(107, 114, 128, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                }}
                // onMouseEnter={(e) => {
                //     e.currentTarget.style.boxShadow = '0 3px 10px rgba(107, 114, 128, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.9)';
                // }}
                // onMouseLeave={(e) => {
                //     e.currentTarget.style.boxShadow = '0 2px 6px rgba(107, 114, 128, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)';
                // }}
            >
                <Heart
                    className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${true
                        ? 'fill-[var(--colour-fsP1)] text-[var(--colour-fsP1)]'
                        : 'text-gray-400 hover:text-red-400'
                    }`}
                />
            </button>

            {/* Product Image Container */}
            <div className="relative p-2 sm:p-3">
                {/* Badges */}
                <div className="absolute left-2 top-2 pb-2 sm:left-3 sm:top-3 flex gap-1 text-[10px] sm:text-xs font-medium z-10">
                    <span 
                        className="rounded-lg px-2 py-0.5 text-white shadow-sm bg-[var(--colour-fsP2)]"
      
                    >
                        New
                    </span>
                    {true
                    
                    // discountPercent > 0 
                    && (
                        <span 
                            className="rounded-lg px-2 py-0.5 text-white bg-green-700 shadow-sm"
         
                        >
                            {discountPercent}% OFF
                        </span>
                    )}
                </div>

                {/* Image */}
                <div 
                    className="relative aspect-square w-full rounded-lg overflow-hidden"
                    style={{
                        background: 'linear-gradient(145deg, #f9fafb, #f3f4f6)',
                        // boxShadow: 'inset 0 2px 4px rgba(107, 114, 128, 0.1)'
                    }}
                >
                    {product.image && (
                        <Image
                            src={product.image}
                            alt={product.name}
                            className="rounded-lg object-cover group-hover:scale-105 transition-transform duration-500"
                            fill
                            sizes="(max-width: 640px) 150px, (max-width: 768px) 200px, (max-width: 1024px) 250px, (max-width: 1280px) 200px, 180px"
                        />
                    )}
                </div>
            </div>

            {/* Product Details */}
            <div className="p-2 sm:p-3 pt-1  font-family-all">
                {/* Product Title */}
                <h3 className="mb-2 line-clamp-2 text-xs sm:text-sm font-medium text-[var(--colour-text2)] transition-colors duration-200 group-hover:text-[var(--colour-fsP2)] leading-tight">
                    {product.highlights !== null ? product.highlights : product.name}
                </h3>

                {/* Price Section */}
                <div className="mb-3">
                    {
                    // originalPrice > product.discounted_price 
                    true
                     && 
                    
                    (
                        <span className="text-xs sm:text-sm font-light text-[var(--colour-text3)] line-through">
                            Rs {originalPrice.toLocaleString()}
                        </span>
                    )}
                    <div className="flex items-center justify-between">
                        <span className="text-sm sm:text-lg font-bold text-[var(--colour-text1)]">
                            Rs {product.discounted_price.toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Feature Badges */}
                <div className="flex flex-wrap justify-between gap-1 sm:gap-1.5 mb-3">
                    {product.emi_enabled !== 0 && (
                        <span 
                            className="inline-flex items-center border rounded-full px-1.5 sm:px-2 border-[var(--colour-fsP1)] bg-transparent py-0.5 sm:py-1 text-[9px] sm:text-xs text-white"

                        >
                            <CheckCheck className="mr-0.5 sm:mr-1 h-2.5 w-2.5 text-[var(--colour-fsP1)] sm:h-3  sm:w-3" />
                            <p className="text-gray-700">EMI</p>
                        </span>
                    )}
                    <span 
                        className="inline-flex items-center border rounded-full px-1.5 sm:px-2 py-0.5 sm:py-1 text-[9px] sm:text-xs border-[var(--colour-fsP2)] bg-transparent"
   
                    >
                        <Truck className="mr-0.5 sm:mr-1 h-2.5 w-2.5 sm:h-3 sm:w-3 text-[var(--colour-fsP2)]" />
                          <p className="text-gray-700">Fatafat Delivery</p>
         
                    </span>
                </div>

                {/* Action Button */}
                {/* <button 
                    className="w-full text-white text-xs sm:text-sm font-medium py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                        background: 'linear-gradient(145deg, var(--colour-bg1, #3b82f6), #2563eb)',
                        boxShadow: '0 3px 8px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                        border: '1px solid rgba(37, 99, 235, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
                        e.currentTarget.style.background = 'linear-gradient(145deg, #2563eb, #1d4ed8)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 3px 8px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                        e.currentTarget.style.background = 'linear-gradient(145deg, var(--colour-bg1, #3b82f6), #2563eb)';
                    }}
                >
                    Add to Cart
                </button> */}
            </div>
        </div>
    );
};

export default ProductCard;