import React, { useMemo } from "react";
import { ShoppingCart, CreditCard, ArrowLeftRight, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductDetails } from "./page";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useContextCart } from "@/app/checkout/CartContext";
import { PaymentMethodsOptions } from "@/app/CommonVue/Payment";
import { useRouter } from "next/navigation";
import { useContextEmi } from "@/app/emi/emiContext";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";

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
    selectedImage,
    setSelectedImage,
    quantity,
    setQuantity,
    renderRating,
}) => {
    const { addToCart, buyNow, items, setIsDrawerOpen } = useContextCart();
    const { setEmiContextInfo } = useContextEmi();
    const router = useRouter();

    const handlerouter = (path: string) => {
        router.push(path);
    };

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity > 0 && newQuantity <= product.quantity) {
            setQuantity(newQuantity);
        }
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
                Icon: ShoppingCart,
                action: () => addToCart(product, quantity, true),
                className: 'bg-indigo-600 hover:bg-indigo-700 text-white',
            },
            {
                name: 'Apply EMI',
                Icon: CreditCard,
                action: () => {
                    setEmiContextInfo((prev) => ({
                        ...prev,
                        product: product,
                    }));
                    localStorage.setItem('recent emi', JSON.stringify(product));
                    handlerouter('/emi/applyemi');
                },
                className: 'bg-yellow-600 hover:bg-yellow-700 text-white',
            },
            {
                name: 'Compare',
                Icon: ArrowLeftRight,
                action: () => setIsDrawerOpen(true),
                className: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200',
            },
        ],
        [product, quantity, addToCart, setEmiContextInfo, setIsDrawerOpen]
    );

    const currencyunit = "Rs. ";
    const originalPrice = product.price;
    const discountPercentage = product.price > product.discounted_price
        ? Math.round(((product.price - product.discounted_price) / product.price) * 100)
        : 0;

    return (
        <div className="w-full max-w-2xl mx-auto space-y-1 p-1 bg-white   duration-300 font-sans">
            {/* Product Title and Metadata */}
            <div className="">
                <div className="flex items-center gap-3">

                    <h1 className="text-xl sm:text-3xl font-[600] text-gray-900 ">
                        {product?.name} {selectedColor ? `- ${selectedColor}` : ""}
                    </h1>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-medium">SKU: 12_abc</span>
                    <span className="hidden sm:inline">|</span>
                    <div className="flex items-center gap-1">
                        {renderRating(product?.average_rating || 3, 16)}
                        <span className="text-indigo-600 font-medium">4.5</span>
                    </div>
                    <span className="hidden sm:inline">|</span>
                    <span className="text-sm">234 reviews</span>
                </div>
            </div>

            {/* Pricing Section */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-1">
                <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-xl font-[500] text-gray-900">
                        {currencyunit}{product?.discounted_price.toLocaleString()}
                    </span>
                    {

                        // discountPercentage > 0 && 
                        (
                            <>
                                <span className="text-xl text-gray-400 line-through">
                                    {currencyunit}{originalPrice.toLocaleString()}
                                </span>
                                <sub>                  <span className="text-lg text-[var(--colour-fsP2)] font-[500] "
                                >
                                    {discountPercentage}% OFF
                                </span></sub>

                            </>
                        )}
                </div>
            </div>

            {/* EMI Option */}
            <div className="flex flex-row items-center gap-3 ">
                <div className="text-sm text-gray-700">
                    EMI starting from <span className="font-semibold text-indigo-600">RS 0/month</span>
                </div>
            </div>

            {/* Color Selector */}
            {product.variants.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-md font-semibold text-gray-900 mb-1">Select Color</h3>
                    <div className="flex flex-wrap gap-2">
                        {product.variants
                            .filter((variant) => variant.quantity > 0)
                            .map((variant, index) => (

                                     <Button

                                key={index}
                                    onClick={() => handleColourSelect(variant.attributes.Color)}
                                            className={cn(
                                            " rounded-lg text-sm font-medium transition-all duration-200",
                                            "hover:scale-105 hover:shadow-md",
                                            selectedColor === variant.attributes.Color
                                                ? "bg-[var(--colour-fsP2)] text-white border-[var(--colour-fsP2)] shadow-lg scale-105"
                                                : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-indigo-100 hover:border-indigo-200"
                                        )}
                                    >
                                        {variant.attributes.Color}
                                    </Button>

                            ))}
                    </div>
                </div>
            )}

            {/* Quantity Selector */}
            {/* {true && (
                <div className="flex flex-col gap-3 mt-4">
                    <label htmlFor="quantity" className="text-md font-semibold text-gray-900">
                        Quantity
                    </label>
                    <div className="flex items-center border border-gray-200 rounded-lg bg-white shadow-sm w-fit">
                        <Button
                            onClick={() => handleQuantityChange(quantity - 1)}
                            disabled={quantity <= 1}
                            className="px-4 py-2 text-xl text-gray-600 hover:bg-gray-100 disabled:opacity-50 rounded-l-lg transition-all duration-200"
                            aria-label="Decrease quantity"
                        >
                            -
                        </Button>
                        <input
                            id="quantity"
                            type="number"
                            min="1"
                            max={product.quantity || 0}
                            value={quantity}
                            onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10) || 1)}
                            className="w-16 text-center border-x border-gray-200 py-2 text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-none"
                            aria-label="Product quantity"
                        />
                        <Button
                            onClick={() => handleQuantityChange(quantity + 1)}
                            disabled={quantity >= (product.quantity || 0)}
                            className="px-4 py-2 text-xl text-gray-600 hover:bg-gray-100 disabled:opacity-50 rounded-r-lg transition-all duration-200"
                            aria-label="Increase quantity"
                        >
                            +
                        </Button>
                    </div>
                </div>
            )} */}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 my-6">
                {AcctionButtons.map((btn, idx) => {
                    const Icon = btn.Icon;
                    return (
                        <Button
                            key={`compact-btn-${idx}`}
                            onClick={btn.action}
                            className={cn(
                                "group px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium",
                                "flex items-center justify-center gap-2",
                                "focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1",
                                "hover:shadow-lg hover:scale-105",
                                btn.className
                            )}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{btn.name}</span>
                        </Button>
                    );
                })}
            </div>

            {/* Express Delivery (Unchanged) */}
            {/* <div className="flex flex-col gap-3">
                {product.highlights && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                        {product.highlights.split('|').map((highlight, index) => (
                            <div key={`highlight-${index}`} className="flex items-start gap-2">
                                <span className="text-yellow-600 text-lg leading-none">•</span>
                                <span className="text-sm font-medium text-gray-800">
                                    {highlight.trim()}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div> */}

            {/* Payment Methods (Unchanged) */}
            <div className="mt-6">
                <h3 className="text-sm sm:text-md font-medium text-gray-700 mb-3">Payment Methods:</h3>
                <div className="flex flex-wrap gap-3">
                    {PaymentMethodsOptions.map((method) => (
                        <div key={method.name} className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105">
                            <Image
                                src={method.img}
                                alt={method.name}
                                width={50}
                                height={30}
                                className="object-center"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductInfo;