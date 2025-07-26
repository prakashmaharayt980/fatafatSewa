import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const OfferBanner = () => {
  return (
    <div className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          Limited Time Offer: Get 20% Off Your First Purchase!
        </h2>
        <p className="text-lg text-indigo-100 mb-6">
          Use code <span className="font-semibold">FIRST20</span> at checkout. Shop now and save big!
        </p>
        <Button
          className={cn(
            "bg-white text-indigo-600 hover:bg-indigo-50",
            "text-base font-semibold px-6 py-3 rounded-full"
          )}
        >
          Shop Now
        </Button>
      </div>
    </div>
  );
};

export default OfferBanner;