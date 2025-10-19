import React, { useMemo } from "react";
import { ArrowLeftRight, ShoppingBag, CreditCardIcon, Scale } from "lucide-react";


import Image from "next/image";
import { cn } from "@/lib/utils";
import { useContextCart } from "@/app/checkout/CartContext";
import { PaymentMethodsOptions } from "@/app/CommonVue/Payment";
import { useRouter } from "next/navigation";
import { useContextEmi } from "@/app/emi/emiContext";
import { ProductDetails } from "@/app/types/CategoryTypes";


interface ProductInfoProps {
    product: ProductDetails;
    selectedColor: string;
    setSelectedColor: (color: string) => void;
    selectedImage: string;
    setSelectedImage: (image: string) => void;
    quantity: number;
    setQuantity: (qty: number) => void;
    renderRating: (rating: number, size?: number) => React.ReactElement;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
    product,
    selectedColor,
    setSelectedColor,

    setSelectedImage,
    quantity,

    renderRating,
}) => {
    const { addToCart, items, addToCompare,compareItems } = useContextCart();
    const { setEmiContextInfo } = useContextEmi();
    const router = useRouter();

    const handlerouter = (path: string) => {
        router.push(path);
    };



    const handleColourSelect = (color: string) => {
        setSelectedColor(color);
        const variant = product.variants.find((v) => v.attributes.Color.toLowerCase() === color.toLowerCase());
        if (variant) {
            setSelectedImage(variant.attributes.image || product.image);
        }
    };

    const AcctionButtons = useMemo(
        () => [
            {
                name: 'Add to Cart',
                Icon: ShoppingBag,
                action: () => addToCart(product, quantity, true),
                className: 'bg-[var(--colour-fsP1)] text-white',
            },
            {
                name: 'Apply EMI',
                Icon: CreditCardIcon,
                action: () => {
                    setEmiContextInfo((prev) => ({
                        ...prev,
                        product: product,
                    }));
                    localStorage.setItem('recent emi', JSON.stringify(product));
                    handlerouter('/emi/applyemi');
                },
                className: 'bg-[var(--colour-fsP2)] text-white',
            },
            {
                name: 'Compare',
                Icon: Scale,
                action: () => {
                    addToCompare(product)
           
                    handlerouter('/product/productCompare')
                },
                className: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200',
            },
        ],
        [product, quantity, addToCart, setEmiContextInfo,addToCompare]
    );

    const currencyunit = "Rs. ";
    const originalPrice = product.price;
    const discountPercentage = product.price > product.discounted_price
        ? Math.round(((product.price - product.discounted_price) / product.price) * 100)
        : 0;

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6 sm:p-6 bg-white ">
            {/* Product Title and Metadata */}
            <div className="space-y-3">
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
                    {product?.name} {selectedColor ? `- ${selectedColor}` : ""}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        {renderRating(product?.average_rating || 3, 16)}
                        <span className="font-medium text-gray-900">4.5</span>
                        <span className="text-gray-500">(234 reviews)</span>
                    </div>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-500 font-medium">SKU: 12_abc</span>
                </div>
            </div>

            {/* Pricing Section */}
            <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-gray-900">
                        {currencyunit}{product?.discounted_price.toLocaleString()}
                    </span>
                    {discountPercentage > 0 && (
                        <>
                            <span className="text-lg text-gray-400 line-through">
                                {currencyunit}{originalPrice.toLocaleString()}
                            </span>
                            <span className="text-sm font-medium px-2 py-1 bg-green-50 text-green-600 rounded-full">
                                {discountPercentage}% OFF
                            </span>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">EMI available from</span>
                    <span className="font-semibold text-indigo-600">Rs. {Math.floor(product?.discounted_price / 12)}/month</span>
                </div>
            </div>

            {/* Color Selector */}
            {product.variants.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-700">Color</h3>
                    <div className="flex flex-wrap gap-2">
                        {product.variants
                            .filter((variant) => variant.quantity > 0)
                            .map((variant, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleColourSelect(variant.attributes.Color)}
                                    className={cn(
                                        "p-2 sm:px-4 sm:py-2 rounded-full cursor-pointer text-xs sm:text-sm font-medium transition-all duration-200",
                                        "ring-1 ring-gray-200",
                                        selectedColor === variant.attributes.Color
                                            ? "bg-gray-900 text-white ring-gray-900"
                                            : "bg-white text-gray-700 hover:bg-gray-50"
                                    )}
                                >
                                    {variant.attributes.Color}
                                </button>
                            ))}
                    </div>
                </div>
            )}


            {/* Action Buttons */}
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
                {AcctionButtons.map((btn, idx) => {
                    const Icon = btn.Icon
                    return (
                        <button
                            key={`action-btn-${idx}`}
                            onClick={btn.action}
                            className={cn(
                                "flex items-center justify-center gap-2 p-2 sm:px-4 sm:py-3 cursor-pointer",
                                "rounded-lg font-medium text-xs sm:text-sm transition-all duration-200",
                                "hover:shadow-md active:transform active:scale-95",
                                btn.className
                            )}
                        >
                            {/* <div className="w-5 h-5 relative">
                            <Image
                                src={btn.Icon}
                                alt={btn.name}
                                fill
                                className="object-contain"
                                // sizes="20px"
                            />
                        </div> */}
                            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>{btn.name}</span>
                        </button>
                    )
                })}
            </div>



            {/* Payment Methods */}
            <div className="space-y-3 ">
                <h3 className="text-sm font-medium text-gray-700">Accepted Payment Methods</h3>
                <div className="flex flex-wrap gap-2">
                    {PaymentMethodsOptions.map((method) => (
                        <div
                            key={method.name}
                            className="p-2 bg-gray-50 rounded-lg transition-transform hover:scale-105"
                            title={method.name}
                        >
                            <Image
                                src={method.img}
                                alt={method.name}
                                width={40}
                                height={24}
                                className="object-contain opacity-80 hover:opacity-100"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductInfo;