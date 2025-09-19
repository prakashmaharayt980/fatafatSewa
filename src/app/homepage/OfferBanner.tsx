import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import productimg from '../../../public/imgfile/product1.webp';
import iphoneImg from '../../../public/imgfile/iphone-14.webp';
import { useEffect, useState } from "react";
import { ArrowRight, Clock } from "lucide-react";

const OfferBanner = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 208,
    hours: 15,
    minutes: 46,
    seconds: 12,
  });

  // Dummy timestamp (e.g., 30 days from now for demo)
  const dummyEndTimestamp = new Date("2025-08-30T20:09:00+0545").getTime();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = dummyEndTimestamp - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [dummyEndTimestamp]);

  return (
    <div className="w-full border-t-4 bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 border-[var(--colour-fsP2)] shadow-md py-16 px-4 sm:px-6 lg:px-8 font-inter">
      {/* Alternative color schemes you can try:
         1. "bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100"
         2. "bg-gradient-to-br from-blue-50 via-white to-indigo-50"
         3. "bg-gradient-to-br from-orange-50 via-white to-amber-50" 
      */}
      <div className="max-w-7xl mx-auto relative">
        {/* Image and Grouped Column in Row */}
        <div className="flex flex-col md:flex-row justify-center items-center mb-12 gap-12">
          <Image
            src={productimg}
            alt="Apple Product"
            width={400}
            height={400}
            
            className="object-contain object-center rounded-lg shadow-sm"
            loading="lazy"
          />
          <div className="flex flex-col items-start gap-8">
            {/* Title */}
            <div className="mb-1">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                Apple Shopping Event
              </h2>
              <p className="text-lg md:text-lg text-gray-600 max-w-lg leading-relaxed mt-3 font-medium">
                Save up to 20% on all Apple devices – limited time only!
              </p>
            </div>

            <div className="w-full max-w-md">
              <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-center gap-4">
                  <Clock className="w-6 h-6 text-orange-500 animate-spin-slow" />
                  <div className="flex gap-2">
                    {["hours", "minutes", "seconds"].map((unit) => (
                      <div key={unit} className="flex items-center">
                        <div className="flex gap-1">
                          {String(timeLeft[unit]).padStart(2, "0").split("").map((digit, i) => (
                            <div
                              key={i}
                              className="w-8 h-10 flex items-center justify-center bg-orange-50 border-2 border-orange-200 rounded-lg text-xl font-bold text-orange-600"
                            >
                              {digit}
                            </div>
                          ))}
                        </div>
                        {unit !== "seconds" && (
                          <span className="mx-1 text-2xl font-bold text-orange-400">:</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

             <Button
                className={cn(
                  "bg-[var(--colour-fsP1)]  px-16 py-6 text-white items-center hover:from-blue-700 hover:to-indigo-700",
                  "text-lg font-semibold rounded-full shadow-sm",
                  "transition-all duration-300 hover:shadow-xl focus:ring-4 focus:ring-blue-300/50"
                )}
              >
               <span> Shop Now</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
          </div>
        </div>

        {/* Product Cards with Light Shadow, No Border */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
          {[
            { name: "iPad Mini", price: "Rs. 49,800", img: iphoneImg },
            { name: "Apple Watch", price: "Rs. 66,317", img: iphoneImg },
            { name: "MacBook", price: "Rs. 82,917", img: iphoneImg },
            { name: "iPhone 14", price: "Rs. 66,317", img: iphoneImg },
            { name: "iMac 24", price: "Rs. 107,767", img: iphoneImg },
          ].map((product, index) => (
            <div
              key={index}
              className="bg-white/90 backdrop-blur-lg flex flex-row items-center p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <Image
                src={product.img}
                alt={product.name}
                width={80}
                height={80}
                className="object-contain rounded-md mr-4"
                loading="lazy"
              />
              <div className="flex flex-col justify-center">
                <p className="text-yellow-500 text-sm mb-1 font-medium">★★★★★</p>
                <p className="text-gray-900 font-semibold text-base leading-tight">{product.name}</p>
                <p className="text-gray-900 font-bold text-sm">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OfferBanner;