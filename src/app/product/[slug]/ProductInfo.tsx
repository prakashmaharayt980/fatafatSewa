import React, { useMemo } from "react";
import { Star, ShoppingCart, CreditCard, Truck, Gift, Shield, Pin, Tag, Package2, Info, ArrowRight, Eye, ArrowLeftRight, Package, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductDetails } from "./page";
import Image from "next/image";
import IconTruck from '../../../../public/imgfile/Truckicon.jpg';
import IconWarrenty from '../../../../public/imgfile/warrenty.webp';
import IconReturnPackage from '../../../../public/imgfile/returnpackage.webp';
import IconHelpline247 from '../../../../public/imgfile/Helpline247.png';
import { cn } from "@/lib/utils";
import { useContextCart } from "@/app/checkout/CartContext";
import CheckoutDrawer from "@/app/checkout/CheckoutDrawer";
import { PaymentMethodsOptions } from "@/app/CommonVue/Payment";

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

    const { addToCart, buyNow, items, setIsDrawerOpen, setEmiContextInfo } = useContextCart()

    console.log('Rendering ProductInfo with product:', items);
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
                action: () => addToCart(product, quantity, true), // Function reference
                className: 'bg-blue-700 hover:bg-blue-800 text-white',
            },
            {
                name: 'Apply EMI',
                Icon: CreditCard,
                action: () => setEmiContextInfo(prev => ({
                    ...prev,
                    isDrawerOpen: true,
                    product:product
                })),
                className: 'bg-yellow-600 hover:bg-yellow-700 text-white',
            },
            {
                name: 'Compare',
                Icon: ArrowLeftRight,
                action: () => setIsDrawerOpen(true),
                className: 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300',
            },
        ],
        [product, quantity, addToCart, setEmiContextInfo,setIsDrawerOpen] // Dependencies
    );

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
        <div className="space-y-3 px-5 py-2 bg-white rounded-xl shadow-sm font-faily-blogcontent ">
            <div className="">
                <h1 className="text-2xl md:text-3xl text-gray-900 font-bold ">
                    {product?.name} {selectedColor ? `- ${selectedColor}` : ""}
                </h1>

                <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span>SKU: 12_abc</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                        {renderRating(product?.average_rating || 3)}
                        <span className="text-blue-600 font-medium">4.5</span>
                    </div>
                    <span>•</span>
                    <span>234 reviews</span>
                </div>
            </div>


            <div className="flex items-center gap-2 py-1.5">
                <div className="flex  gap-3 items-center">
                    <span className="text-3xl font-bold text-gray-900">
                        {currencyunit}{product?.discounted_price.toLocaleString()}
                    </span>
                    {true && (
                        <>
                            <span className="text-lg text-gray-400 line-through">
                                {currencyunit}{originalPrice.toLocaleString()}
                            </span>
                            <span className="text-sm bg-green-100 text-green-700 py-1 px-2 rounded font-medium">
                                {discountPercentage}% OFF
                            </span>
                        </>
                    )}
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                    <Tag className="w-3 h-3" />
                    {product.brand.name}
                </div>
            </div>

            {/* EMI Option */}
            <div className="flex items-center gap-4 py-2 px-3 border-b border-gray-200">
                <div className="text-sm text-gray-700">
                    EMI starting from <span className="font-semibold text-blue-600">₹0/month</span>
                </div>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    Apply now →
                </button>
            </div>


            {/* Delivery Info */}
            <div className="flex items-center gap-3 py-2">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                    <Truck className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-sm">
                    <div className="text-gray-700">
                        Estimated delivery: <span className="font-semibold text-gray-900">
                            {deliveryDate.toLocaleDateString(undefined, {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                            })}
                        </span>
                    </div>
                    {timeLeft > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3 text-orange-500" />
                            <span className="text-xs text-orange-600 font-medium">
                                Order within {Math.floor(timeLeft)}h {Math.round((timeLeft % 1) * 60)}m for this date
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* View and Stock Info */}
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">256 recent views</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-orange-500" />
                        <span className="text-sm font-semibold text-orange-700">
                            {/* {product.quantity} */}
                            10 left
                        </span>
                    </div>
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
                    <label htmlFor="quantity" className="text-[16px] font-medium text-gray-700">
                        Quantity :
                    </label>
                    <div className="flex items-center border border-gray-200 rounded-lg mt-1 bg-white shadow-sm">
                        <Button
                            onClick={() => handleQuantityChange(quantity - 1)}
                            disabled={quantity <= 1}
                            className="px-4 py-1 text-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 rounded-l-full"
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


            <div className="flex justify-start gap-3 my-6">
                {AcctionButtons.map((btn, idx) => {
                    const Icon = btn.Icon;
                    return (
                        <Button
                            key={`compact-btn-${idx}`}
                            onClick={btn.action}
                            // disabled={product.quantity === 0}
                            className={cn(
                                "group px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium",
                                "flex items-center gap-2",
                                "focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1",
                                "hover:shadow-sm",
                                btn.className
                            )}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{btn.name}</span>
                        </Button>
                    );
                })}
            </div>

            {/* Express Delivery */}
            <div className="flex flex-col gap-3">
                {product.highlights && (
                    <div className="grid grid-cols-2 gap-4 p-4 ">
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