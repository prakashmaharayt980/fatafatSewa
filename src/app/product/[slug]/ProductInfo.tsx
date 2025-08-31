import React from "react";
import { Star, ShoppingCart, CreditCard, Truck, Gift, Shield, Pin, Tag, Package2, Info, ArrowRight, Eye, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductDetails } from "./page";
import Image from "next/image";
import IconTruck from '../../../../public/imgfile/Truckicon.jpg';
import IconWarrenty from '../../../../public/imgfile/warrenty.webp';
import IconReturnPackage from '../../../../public/imgfile/returnpackage.webp';
import IconHelpline247 from '../../../../public/imgfile/Helpline247.png';
import { cn } from "@/lib/utils";

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

const ServicesToClient = [
    {
        img: IconWarrenty,
        alt: "warranty",
        imgClass: "w-10 h-8 bg-transparent",
        title: "Warranty Card",
        desc: "100% Authentic",
    },
    {
        img: IconTruck,
        alt: "truck",
        imgClass: "w-8 h-8 bg-transparent",
        title: "Free Delivery",
        desc: "Orders above Rs. 999",
    },
    {
        img: IconReturnPackage,
        alt: "return package",
        imgClass: "w-10 h-10 bg-transparent",
        title: "Easy Returns",
        desc: "7 Days Return Policy",
    },
    {
        img: IconHelpline247,
        alt: "helpline",
        imgClass: "w-10 h-10 bg-transparent",
        title: "Services 24/7",
        desc: "Contact Customer Helpline",
    },
];

const PaymentMethodsOptions = [
    { name: "PayPal", img: "/imgfile/paymentMethod3.png" },
    { name: "Esewa", img: "/imgfile/paymentMethod4.png" },
    { name: "Visa", img: "/imgfile/paymentMethod1.svg" },
    { name: "Mastercard", img: "/imgfile/paymentMethod2.svg" },
    { name: "Khalti", img: "/imgfile/paymentMethod6.png" },
];

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
    const handleAddToCart = () => {
        // Add to cart logic
    };

    const handleBuyNow = () => {
        // Buy now logic
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

    const currencyunit = "Rs. ";
    const originalPrice = product.price;
    const discountPercentage = product.price > product.discounted_price
        ? Math.round(((product.price - product.discounted_price) / product.price) * 100)
        : 0;
    const currentTime = new Date();
    const deliveryDate = new Date(currentTime);
    deliveryDate.setDate(deliveryDate.getDate() + 2);
    const timeLeft = 24 - currentTime.getHours() - currentTime.getMinutes() / 60;

    return (
        <div className="space-y-3 px-5 py-2 bg-white rounded-xl shadow-sm font-sans">
            {/* Brand and Product Title */}
            <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
                    {product?.name} {selectedColor ? `- ${selectedColor}` : ""}
                </h1>
            </div>

            {/* Rating and SKU */}
            <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">SKU: 12_abc</span>
                {renderRating(product?.average_rating || 3, 16)}
                {/* <span className="text-sm text-gray-500">
                    ({product?.reviews.length} ratings)
                </span> */}
                <span className="text-sm text-blue-600">4.5 reviews</span>
            </div>

            {/* Price and Discount */}
            <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-800">
                    {currencyunit}{product?.discounted_price.toLocaleString()}
                </span>
                {true && (
                    <>
                        <span className="text-lg text-gray-400 line-through">
                            {currencyunit}{originalPrice.toLocaleString()}
                        </span>
                        <span className="text-sm bg-yellow-100 text-yellow-800 py-1 px-3 rounded-full font-medium">
                            {discountPercentage}% OFF
                        </span>
                    </>
                )}
                {/* <span className="inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs border border-gray-200">
                    <Tag className="w-4 h-4 text-blue-500" />
                    <p className="font-bold  text-blue-600">{product.brand.name}</p>
                </span> */}
            </div>

            {/* EMI Option */}
            <div className="flex items-center gap-3  py-1  ">
                <span className="text-sm font-medium text-gray-700">
                    EMI from <span className="font-semibold text-lg text-blue-600">Rs. 0/mo</span>
                </span>
                <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200 transition-colors">
                    <p className="font-medium">Apply now</p>
                    <ArrowRight className="h-4 w-4 ml-1" />
                </span>
            </div>

            {/* Delivery Info */}
            <div className="flex items-center gap-2  ">
                <Truck className="w-5 h-5 text-blue-500" />
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

            {/* View and Stock Info */}
   <div className="flex flex-col gap-1 bg-blue-50 py-1 px-3 rounded-lg border border-blue-100 shadow-sm text-[var(--colour-fsP2)]/70">
    <div className="flex items-center gap-2 font-semibold">
        <Eye className="h-4 w-4 " />
        <span className="text-sm ">
            Viewed by 256 users in last 24 hours <br/>
                    Only {product.quantity} left in stock
        </span>
    </div>
   
</div>

            {/* Color Selector */}
            {product.variants.length > 0 && (
                <div className="mt-3">
                    <h3 className="text-md font-medium text-gray-700 mb-2">Select Color:</h3>
                    <div className="flex gap-2 flex-wrap">
                        {product.variants
                            .filter((variant) => variant.quantity > 0)
                            .map((variant, index) => (
                                <Button
                                    key={index}
                                    onClick={() => handleColourSelect(variant.attributes.Color)}
                                    className={cn(
                                        "px-4 py-2 rounded-lg transition-all duration-200 text-sm",
                                        selectedColor === variant.attributes.Color
                                            ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                            : "bg-gray-100 text-gray-700 border-gray-100 hover:bg-blue-100 hover:border-blue-200"
                                    )}
                                >
                                    {variant.attributes.Color}
                                </Button>
                            ))}
                    </div>
                </div>
            )}

            {/* Quantity Selector */}
            {true && (
                <div className="flex items-center gap-4">
                    <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                        Quantity
                    </label>
                    <div className="flex items-center border border-gray-200 rounded-lg mt-1 bg-white shadow-sm">
                        <Button
                            onClick={() => handleQuantityChange(quantity - 1)}
                            disabled={quantity <= 1}
                            className="px-4 py-2 text-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 rounded-l-full"
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
                            className="w-16 text-center border-x border-gray-200 py-2 text-lg text-gray-800 focus:outline-none"
                            aria-label="Product quantity"
                        />
                        <Button
                            onClick={() => handleQuantityChange(quantity + 1)}
                            disabled={quantity >= (product.quantity || 0)}
                            className="px-4 py-2 text-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 rounded-r-full"
                            aria-label="Increase quantity"
                        >
                            +
                        </Button>
                    </div>
                </div>
            )}

            {/* Purchase Actions */}
            {/* <div className="flex justify-start gap-3 mt-6">
                <div className="flex space-x-2 bg-gray-50 rounded-lg p-2 w-full max-w-md">
                    {[
                        { name: "Add to Cart", Icon: ShoppingCart, action: handleAddToCart, className: "bg-[var(--colour-fsP1)] text-white hover:bg-blue-200" },
                        { name: "Buy Now", Icon: CreditCard, action: handleBuyNow, className: " bg-[var(--colour-fsP2)] text-white hover:bg-blue-700" },
                        { name: " ", Icon: ArrowLeftRight, action: handleBuyNow, className: " bg-blue-100 text-white hover:bg-blue-700" },
                    ].map((btn, idx) => {
                        const Icon = btn.Icon;
                        return (
                            <Button
                                key={`product-info-btn-${idx}-${btn.name}`}
                                onClick={btn.action}
                                disabled={product.quantity === 0}
                                className={cn(
                                    "flex-1 py-4 px-4 rounded-lg transition-all  duration-300 text-lg font-medium capitalize",
                                    btn.className,
                                    "flex items-center justify-center gap-3"
                                )}
                            >
                                <span>{btn.name}</span>
                                <Icon className="w-5 h-5" />
                            </Button>
                        );
                    })}
                </div>
            </div> */}
            
        <div className="flex justify-start gap-4 my-2">
          {[
            { 
              name: "Add to Cart", 
              Icon: ShoppingCart, 
              action: handleAddToCart, 
              className: "bg-[var(--colour-fsP1)] hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5" 
            },
            { 
              name: "Apply Emi", 
              Icon: CreditCard, 
              action: handleBuyNow, 
              className: "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5" 
            },
            { 
              name: "Compare", 
              Icon: ArrowLeftRight, 
              action: handleBuyNow, 
              className: "bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 shadow-md hover:shadow-lg transform hover:-translate-y-0.5" 
            },
          ].map((btn, idx) => {
            const Icon = btn.Icon;
            return (
              <Button
                key={`product-info-btn-${idx}-${btn.name}`}
                onClick={btn.action}
                disabled={product.quantity === 0}
                className={cn(
                  "group relative overflow-hidden px-10 py-4 rounded-xl transition-all duration-300 text-base font-semibold min-w-[180px]",
                  "flex items-center justify-center gap-3",
                  "focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                  "disabled:transform-none disabled:shadow-none",
                  btn.className
                )}
              >
                
             
                <span className="relative z-10 ">{btn.name}</span>
                   <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              </Button>
            );
          })}
        </div>

            {/* Express Delivery */}
            <div className="flex flex-col gap-3">
                {product.highlights && (
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-lg text-sm font-medium shadow-sm">
                        {product.highlights}
                    </span>
                )}
            </div>

            {/* Services to Client */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                {ServicesToClient.map((item, idx) => (
                    <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg shadow-sm" key={`service-to-client-${item.title}-${idx}`}>
                        <Image
                            src={item.img}
                            alt={item.alt}
                            className={item.imgClass}
                            width={40}
                            height={40}
                            quality={100}
                        />
                        <div>
                            <p className="text-sm font-medium text-gray-800">{item.title}</p>
                            <p className="text-xs text-gray-600">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Payment Methods */}
            <div className="mt-6 flex flex-row gap-3 items-center">
                <h3 className="text-md font-medium text-gray-700 mb-3">Payment Methods:</h3>
                <div className="flex flex-wrap gap-3">
                    {PaymentMethodsOptions.map((method) => (
                        <div key={method.name} className="flex flex-col items-center">
                            <Image
                                src={method.img}
                                alt={method.name}
                                width={50}
                                height={30}
                                className="object-center "
                            />

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductInfo;