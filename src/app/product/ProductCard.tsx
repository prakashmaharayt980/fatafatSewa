import { cn } from "@/lib/utils";
import { CheckCheck, Heart, Truck } from "lucide-react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
const ProductCard = ({ product, index: _index }: { product: any, index: number }) => {
    const router = useRouter();

    // Early return if product or ID is missing
    if (!product || !product.id) {
        console.warn('Invalid product data:', product);
        return null;
    }

    const originalPrice = parseInt(product.price) || product.discounted_price;
    const discountPercent = originalPrice > product.discounted_price
        ? Math.round(((originalPrice - product.discounted_price) / originalPrice) * 100)
        : 0;

    const handleProductClick = () => {
        if (!product.id) {
            console.warn('Cannot navigate - missing product ID');
            return;
        }
        router.push(`/product/${product.slug}`);
    };

    return (
        <div
            onClick={handleProductClick}
            className="group relative cursor-pointer rounded-lg sm:rounded-xl bg-white transition-all duration-300 overflow-hidden hover:translate-y-2 hover:shadow-xl mb-2 sm:mb-4 border border-gray-100 hover:border-gray-200"
            style={{
                boxShadow: `
                    0 1px 3px rgba(0, 0, 0, 0.1),
                    0 1px 2px rgba(0, 0, 0, 0.06)
                `,
                background: `
                    linear-gradient(145deg, #ffffff 0%, #f9fafb 100%)
                `
            }}
        >
            {/* Wishlist Heart */}
            <button
                className="absolute right-2 top-2 z-20 rounded-full p-1.5 sm:p-2
                          transition-all duration-200 hover:scale-110 bg-white/80 backdrop-blur-sm
                          shadow-sm hover:shadow-md"
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
                <div className="absolute left-2 top-2 sm:left-3 sm:top-3 flex gap-1 text-[10px] sm:text-xs font-medium z-10">
                    <span 
                        className="rounded-md px-1.5 py-0.5 text-white shadow-sm bg-[var(--colour-fsP2)]"
                    >
                        New
                    </span>
                    {discountPercent > 0 && (
                        <span 
                            className="rounded-md px-1.5 py-0.5 text-white bg-green-600 shadow-sm"
                        >
                            {discountPercent}% OFF
                        </span>
                    )}
                </div>

                <div 
                    className="relative aspect-square w-full rounded-lg overflow-hidden bg-gray-50"
                >
                    {product.image && (
                        <Image
                            src={product.image}
                            alt={product.name}
                            className="rounded-lg object-cover group-hover:scale-105 transition-transform duration-500"
                            fill
                            priority={true}
                            sizes="(max-width: 640px) 150px, (max-width: 768px) 200px, (max-width: 1024px) 250px, (max-width: 1280px) 200px, 180px"
                        />
                    )}
                </div>
            </div>


            <div className="p-2 sm:p-3 pt-1 font-family-all">
                <h3 className={cn(
                    "line-clamp-2 text-xs sm:text-sm font-medium text-[var(--colour-text2)]",
                    "transition-colors duration-200 group-hover:text-[var(--colour-fsP2)]",
                    "leading-tight mb-2"
                )}>
                    {product.highlights !== null ? product.highlights : product.name}
                </h3>

                {/* Price Section */}
                <div className="mb-3">
                    {originalPrice > product.discounted_price && (
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
                <div className="flex flex-wrap justify-between gap-1 sm:gap-1.5 mb-2">
                    {product.emi_enabled !== 0 && (
                        <span 
                            className="inline-flex items-center border rounded-full px-1.5 sm:px-2 
                                     border-[var(--colour-fsP1)] bg-transparent py-0.5 sm:py-1 
                                     text-[9px] sm:text-xs text-gray-700"
                        >
                            <CheckCheck className="mr-0.5 sm:mr-1 h-2.5 w-2.5 text-[var(--colour-fsP1)] sm:h-3 sm:w-3" />
                            <span>EMI</span>
                        </span>
                    )}
                    <span 
                        className="inline-flex items-center border rounded-full px-1.5 sm:px-2 py-0.5 sm:py-1 
                                 text-[9px] sm:text-xs border-[var(--colour-fsP2)] bg-transparent text-gray-700"
                    >
                        <Truck className="mr-0.5 sm:mr-1 h-2.5 w-2.5 sm:h-3 sm:w-3 text-[var(--colour-fsP2)]" />
                        <span>Fatafat Delivery</span>
                    </span>
                </div>
            </div>
            
        </div>
    );
};

export default ProductCard;