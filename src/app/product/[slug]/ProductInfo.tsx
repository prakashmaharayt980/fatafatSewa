import React from "react";
import { Star, ShoppingCart, CreditCard, Truck, Gift, Shield, Pin, Tag, Package2, Info } from "lucide-react";
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
        title: "Warrenty Card",
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
        desc: "contact to cutomer helpline",
    },
];

const PaymentMethodsOptions = [
    { name: "PayPal", img: "/imgfile/paymentMethod3.png" },
    { name: "Esewa", img: "/imgfile/paymentMethod4.png" },

    { name: "Visa", img: "/imgfile/paymentMethod1.svg" },
    { name: "Mastercard", img: "/imgfile/paymentMethod2.svg" },
    { name: "Khalti", img: "/imgfile/paymentMethod6.png" },

]

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
    const discountPercentage = product.price > product.discounted_price ? Math.round(((product.price - product.discounted_price) / product.price) * 100)
        : 0;
    const currentTime = new Date();
    const deliveryDate = new Date(currentTime);
    deliveryDate.setDate(deliveryDate.getDate() + 2);
    const timeLeft = 24 - currentTime.getHours() - currentTime.getMinutes() / 60;

    return (
        <div className="space-y-1">
            {/* Brand and Product Title */}
            <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                    {product?.name} {selectedColor ? `- ${selectedColor}` : ""}
                </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
                {renderRating(product?.average_rating || 3, 16)}
                <span className="text-sm text-gray-500">
                    ({product?.reviews.length} ratings)
                </span>
            </div>

            {/* Price and Delivery */}
            <div className="flex items-center gap-4"></div>
            {/* Price and Delivery */}
            <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-gray-900">
                    {currencyunit}{product?.discounted_price.toLocaleString()}
                </span>
                {true && (
                    <span className="text-lg text-gray-400 line-through">
                        {currencyunit}{originalPrice.toLocaleString()}
                    </span>
                )}
                {true && (
                    <span className="text-sm bg-[var(--colour-fsP2)]/20 py-0.5 rounded-full px-2">
                        &nbsp;{discountPercentage}%&nbsp;OFF&nbsp;
                    </span>
                )}
                <span className="inline-flex items-center  border  gap-2 rounded-full px-1.5 sm:px-2 py-0.5 sm:py-1 text-[12px] sm:text-xs border-gray-200">

                    <Tag className="w-4 h-4 text-blue-500" />

                    <p className="font-bold text-[var(--colour-fsP2)]">{product.brand.name}</p>
                </span>
            </div>

            {/* Express Delivery */}
            <div className="flex flex-col gap-2 mt-2">
                {product.highlights && (
                    <div className="flex items-center gap-2">
                        <span className="bg-gray-200/40 text-[var(--colour-fsP2)]/70 px-2 py-1 rounded-lg text-sm font-medium">
                            {product.highlights}
                        </span>
                    </div>
                )}
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

            {product.variants.length > 0 && (
                <div className="mb-1 ml-1">
                    <h3 className="text-md font-medium text-gray-700 mb-2">Available Colors</h3>
                    <div className="flex gap-2 flex-wrap">
                        {product.variants
                            .filter((variant) => variant.quantity > 0)
                            .map((variant, index) => (
                                <Button
                                    key={index}
                                    onClick={() => handleColourSelect(variant.attributes.Color)}
                                    className={`px-3 py-1 rounded-full transition-all duration-200 ${selectedColor === variant.attributes.Color
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
            <div className="my-3 ml-1">
                <span
                    className={`inline-flex items-center px-2 py-1 rounded-xl text-sm font-medium ${

                        //   product.quantity > 0
                        true
                            ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                        }`}
                >
                    {
                        // product.quantity > 0
                        true

                            ? `In Stock (${product.quantity} available)`
                            : "Out of Stock"}
                </span>
            </div>

            {/* Quantity Selector */}
            {
                // product.quantity > 0
                true
                && (
                    <div className="flex items-center justify-start  gap-4 mb-3">
                        <label htmlFor="quantity" className="text-sm font-medium pl-4 text-gray-700">Quantity</label>
                        <div className="flex items-center border border-gray-200 rounded-2xl shadow-md bg-white">
                            <Button
                                onClick={() => handleQuantityChange(quantity - 1)}
                                disabled={quantity <= 1}
                                className="px-4 py-2 text-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 rounded-l-2xl transition-colors"
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
                                className="w-16 text-center  border-x border-gray-200 py-2 text-lg text-gray-900 focus:outline-none"
                                aria-label="Product quantity"
                            />
                            <Button
                                onClick={() => handleQuantityChange(quantity + 1)}
                                disabled={quantity >= (product.quantity || 0)}
                                className="px-4 py-2 text-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 rounded-r-2xl transition-colors"
                                aria-label="Increase quantity"
                            >
                                +
                            </Button>
                        </div>
                    </div>
                )}

            {/* Purchase Actions */}
            {/* <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
                <Button
                    onClick={handleAddToCart}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow-md hover:from-blue-600 hover:to-blue-800 transition-all rounded-2xl py-3 text-lg flex items-center justify-center gap-2 w-full"
                    disabled={product.quantity === 0}
                >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                </Button>
                <Button
                    onClick={handleBuyNow}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold shadow-md hover:from-green-600 hover:to-green-800 transition-all rounded-2xl py-3 text-lg flex items-center justify-center gap-2 w-full"
                    disabled={product.quantity === 0}
                >
                    <CreditCard className="w-5 h-5" />
                    Buy Now
                </Button>
            </div>
            {product?.emi_enabled === 1 && (
                <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2 shadow-sm mt-3 w-full">
                    <CreditCard className="w-5 h-5 text-yellow-500" />
                    <span className="text-yellow-700 font-medium">EMI Available</span>
                </div>
            )} */}

            <div className="flex justify-center mb-8 w-full">
                <div className="flex space-x-4 bg-white rounded-full w-full p-2   border-none border-slate-200">
                    {[{ name: " Add to cart", Icon: ShoppingCart, onclickAction: handleAddToCart(), extractCn: 'bg-[var(--colour-fsP2)]/20 text-black/70 ', CNname: ' hover:text-black' },
                    { name: "Buy Now", Icon: ShoppingCart, onclickAction: handleAddToCart(), extractCn: 'bg-[var(--colour-fsP2)]/70 text-black/85 hover:text-black', CNname: ' hover:text-black ' },
                    { name: "Emi Available", Icon: CreditCard, onclickAction: handleAddToCart(), extractCn: 'bg-[var(--colour-fsP2)] text-black ', CNname: ' hover:text-black ' },
                    ].map((btn, idx) => {
                        const Icon = btn.Icon;
                        return (
                            <button
                                key={`product-info-btn-${idx}-${btn.name}`}
                                onClick={() => btn.onclickAction}
                                disabled={btn.name !== "Emi Available" && product.quantity === 0}
                                className={`px-3  py-2 hover:bg-[var(--colour-fsP1)]/70 rounded-full transition-all duration-300 text-sm font-medium capitalize ${btn.extractCn}  flex items-center gap-4 shadow-md`}
                            >
                                <span className={cn(
                                    " font-medium items-center pl-2",
                                    btn.CNname
                                )}>{btn.name}</span>
                                <div className=" rounded-full p-1.5 bg-white/30">
                                    <Icon className="w-4 h-4  rounded-full " />
                                </div>


                            </button>
                        )
                    })}
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                {
                    ServicesToClient.map((item, idx) => (
                        <div className="flex items-center gap-2 p-2" key={`service-to-client-${item.title}-${idx}`}>
                            <Image
                                src={item.img}
                                alt={item.alt}
                                className={item.imgClass}
                                width={100}
                                height={100}
                                quality={100}
                            />
                            <div>
                                <p className="text-sm font-medium text-gray-900">{item.title}</p>
                                <p className="text-xs text-gray-500">{item.desc}</p>
                            </div>
                        </div>
                    ))}
            </div>

            {/* Payment Methods */}
            <div className="mt-4 flex flex-row gap-1.5 items-center justify-start px-2">
                <h3 className="text-md font-medium text-gray-700 mb-2 items-center">Payment Methods :</h3>
                <div className="flex flex-row gap-4 items-center">
                    {PaymentMethodsOptions.map((method) => (
                        <div key={method.name} className="flex flex-col items-center ">
                            <Image
                                src={method.img}
                                alt={method.name}
                                width={45}
                                height={30}
                                className="object-contain"
                            />

                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default ProductInfo;
