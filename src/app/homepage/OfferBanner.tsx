import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import productimg from '../../../public/imgfile/product1.webp';
import { useEffect, useState } from "react";

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
    <div className="w-full bg-gradient-to-br from-[var(--colour-bg1)] via-[var(--colour-text3)] to-[var(--colour-text2)] py-16 px-4 sm:px-6 lg:px-8 font-poppins">
      <div className="max-w-6xl mx-auto relative">
        {/* Image and Grouped Column in Row */}
        <div className="flex flex-col md:flex-row justify-center items-end mb-5 gap-8">
          <Image
            src={productimg}
            alt="Apple Product"
            width={300}
            height={300}
            priority
            className="object-cover object-center transition-transform duration-300 hover:scale-110"
          />
          <div className="flex flex-col items-start gap-6">
            {/* Title */}
            <div className="mb-1">
              <h2 className="text-4xl md:text-4xl font-extrabold text-white drop-shadow-lg">
                Apple Shopping Event
              </h2>
              <p className="text-xl text-blue-100 max-w-xl mx-auto leading-relaxed">
                Hurry and get discounts on all Apple devices up to 20%
              </p>
            </div>

            {/* Countdown Timer with Border */}
            <div className="flex justify-center items-center gap-4 mb-2">
              <div className="bg-white/90 backdrop-blur-md text-indigo-800 font-semibold text-sm px-4 py-3 rounded-xl shadow-md hover:shadow-lg transition-shadow border-2 border-white">
                <div className="text-2xl">{timeLeft.days}</div>
                <div className="text-xs uppercase opacity-80">Days</div>
              </div>
              <div className="bg-white/90 backdrop-blur-md text-indigo-800 font-semibold text-sm px-4 py-3 rounded-xl shadow-md hover:shadow-lg transition-shadow border-2 border-white">
                <div className="text-2xl">{timeLeft.hours}</div>
                <div className="text-xs uppercase opacity-80">Hours</div>
              </div>
              <div className="bg-white/90 backdrop-blur-md text-indigo-800 font-semibold text-sm px-4 py-3 rounded-xl shadow-md hover:shadow-lg transition-shadow border-2 border-white">
                <div className="text-2xl">{timeLeft.minutes}</div>
                <div className="text-xs uppercase opacity-80">Minutes</div>
              </div>
              <div className="bg-white/90 backdrop-blur-md text-indigo-800 font-semibold text-sm px-4 py-3 rounded-xl shadow-md hover:shadow-lg transition-shadow border-2 border-white">
                <div className="text-2xl">{timeLeft.seconds}</div>
                <div className="text-xs uppercase opacity-80">Seconds</div>
              </div>
            </div>

            {/* CTA Button */}
            <div>
              <Button
                className={cn(
                  "bg-white text-indigo-700 hover:bg-gray-100 hover:scale-105",
                  "text-lg font-bold px-10 py-4 rounded-full shadow-xl",
                  "transition-all duration-300 transform hover:shadow-xl"
                )}
              >
                Go Shopping
              </Button>
            </div>
          </div>
        </div>

        {/* Product Cards with INR */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white/90 backdrop-blur-md p-2 rounded-2xl items-center text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <p className="text-yellow-500 text-sm">★★★★★</p>
            <p className="text-indigo-800 font-semibold text-base">iPad Mini</p>
            <p className="text-indigo-800 font-bold text-sm">Rs. 49,800</p>
          </div>
          <div className="bg-white/90 backdrop-blur-md p-2 rounded-2xl items-center text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <p className="text-yellow-500 text-sm">★★★★★</p>
            <p className="text-indigo-800 font-semibold text-base">Apple Watch</p>
            <p className="text-indigo-800 font-bold text-sm">Rs. 66,317</p>
          </div>
          <div className="bg-white/90 backdrop-blur-md p-2 rounded-2xl items-center text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <p className="text-yellow-500 text-sm">★★★★★</p>
            <p className="text-indigo-800 font-semibold text-base">MacBook</p>
            <p className="text-indigo-800 font-bold text-sm">Rs. 82,917</p>
          </div>
          <div className="bg-white/90 backdrop-blur-md p-2 rounded-2xl items-center text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <p className="text-yellow-500 text-sm">★★★★★</p>
            <p className="text-indigo-800 font-semibold text-base">iPhone 14</p>
            <p className="text-indigo-800 font-bold text-sm">Rs. 66,317</p>
          </div>
          <div className="bg-white/90 backdrop-blur-md p-2 rounded-2xl items-center text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <p className="text-yellow-500 text-sm">★★★★★</p>
            <p className="text-indigo-800 font-semibold text-base">iMac 24</p>
            <p className="text-indigo-800 font-bold text-sm">Rs. 107,767</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferBanner;