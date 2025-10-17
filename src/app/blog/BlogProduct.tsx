import { cn } from "@/lib/utils";
import { CheckCheck, Heart, Truck } from "lucide-react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
const BlogProductCard = ({ product, index: _index }: { product: any, index: number }) => {
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
   

            {/* Product Image Container */}
            <div className="relative ">
             

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


            <div className=" font-family-all">
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

             
            </div>
            
        </div>
    );
};

export default BlogProductCard;