"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useContextCart } from "../checkout/CartContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { CreditCard, Search } from "lucide-react";
import RemoteServices from "../api/remoteservice";
import emptyboxIcon from '../../../public/svgfile/emptybox.png'

export default function ProductEMIUI({ chooseProduct }) {
  const [selectedColor, setSelectedColor] = useState<string>("");

  const [selectItems, setSelectItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { emicalclatorinfo, setemicalclatorinfo } = useContextCart();
  const product = emicalclatorinfo.productselected;

  // Dummy storage values


  // Filter available variants (quantity > 0)
  const availableVariants = product?.variants?.filter((variant) => variant.quantity > 0) || [];

  // Get unique colors and storage options
  const uniqueColors = Array.from(new Set(availableVariants.map((v) => v.attributes.Color)));

  // Fetch products based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      RemoteServices.SerachProducts(searchQuery.trim())
        .then((res) => {
          setSelectItems(res.data);
        })
        .catch((e) => console.log("error", e));
    } else {
      setSelectItems([]);
    }
  }, [searchQuery]);

  const handleProductSelect = (product) => {
    setemicalclatorinfo((prev) => ({
      ...prev,
      productselected: product,
      isEmiCalcltorOpen: false, // Close drawer after selecting product
    }));
    setSearchQuery("");
    setSelectItems([]);
  };

  return (
    <div className="w-full max-w-7xl mx-auto my-0 p-1 sm:p-2 bg-white">
      {/* Drawer for Product Search */}
      <Drawer
        open={emicalclatorinfo.isEmiCalcltorOpen}
        onOpenChange={(open) => setemicalclatorinfo((prev) => ({ ...prev, isEmiCalcltorOpen: open }))}
      >
        <DrawerContent className="max-h-[85vh] min-h-[60vh] max-w-6xl mx-auto bg-white border-0 shadow-xl">
          <DrawerHeader className="text-center m-0 p-0 items-center border-b-gray-200 border-b">
            <DrawerTitle className="flex items-center justify-center gap-2 m-0 p-0 text-xl text-[var(--colour-fsP2)] font-semibold">
              <CreditCard className="w-5 h-5 text-[var(--colour-fsP1)] mb-2" />
              <span className="items-center mb-2">EMI Calculator - Select Product</span>
            </DrawerTitle>
          </DrawerHeader>
          <div className="p-4 overflow-y-auto">
            <div className="mb-4">
              <div className="flex rounded-full border border-gray-300 bg-gray-50 hover:bg-white hover:border-blue-300 transition-all duration-200 overflow-hidden focus-within:ring-2 focus-within:ring-blue-200">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a product..."
                  className="w-full px-4 py-2 bg-transparent border-none focus:outline-none text-sm placeholder-gray-500"
                />
                <button className="bg-blue-600 text-white px-3 py-1.5 m-0.5 hover:bg-blue-700 transition-colors rounded-full duration-200 flex items-center justify-center">
                  <Search className="w-4 h-4" />
                </button>
              </div>
              {selectItems.length > 0 && (
                <div className="mt-2 max-h-56 overflow-auto bg-white border border-gray-200 rounded-md shadow-sm">
                  {selectItems.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                      onClick={() => handleProductSelect(product)}
                    >
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-8 h-8 object-contain rounded mr-3 border border-gray-100"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                        <p className="text-xs text-gray-600">Rs. {product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Main Content */}
      {product ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 items-center sm:gap-2">
          {/* Product Image */}
          <div className="relative aspect-square p-1 sm:p-2 w-full max-w-[280px] sm:max-w-[360px] mx-auto">
            <Image
              src={product.image || "/fallback-image.jpg"}
              alt={product.name || "Product Image"}
              width={360}
              height={360}
              className="w-full h-full object-contain transition-transform duration-300 hover:scale-105 rounded-md"
              priority
              placeholder="blur"
              blurDataURL="/placeholder-image.jpg"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-2 sm:space-y-3 p-1 sm:p-2 flex justify-end flex-col">
            <div>
              <label className="block text-3xl capitalize font-medium text-[var(--colour-fsP2)] mb-2">
                {product.name}
              </label>
            </div>

            {/* Color Selection */}
            {uniqueColors.length > 0 &&
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1 sm:mb-2">Select Color:</h3>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {uniqueColors.map((color) => (
                    <Button
                      key={color}
                      onClick={() => {
                        setSelectedColor(color);

                        chooseProduct(color);
                      }}
                      aria-label={`Select color ${color}`}
                      aria-selected={selectedColor === color}
                      className={cn(
                        "relative px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200",
                        selectedColor === color
                          ? "px-6 bg-blue-900 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-blue-50 hover:shadow-sm",
                        "focus:outline-none focus:ring-2 focus:ring-blue-400"
                      )}
                    >
                      {color}
                      {selectedColor === color && (
                        <span className="relative bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                          ✓
                        </span>
                      )}
                    </Button>
                  ))}
                </div>

              </div>}

            <div className="mt-6 cursor-pointer">
              <Button className="px-6 bg-blue-900/50  text-white w-full max-w-md justify-end flex" onClick={() => setemicalclatorinfo((prev) => ({ ...prev, isEmiCalcltorOpen: true }))}>
                <div className="relative w-7 h-7">
                  <Image
                    src={emptyboxIcon}
                    alt="Change product icon"
                    width={32}
                    height={32}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    priority
                    quality={100}
                  />
                </div>         Change Product
              </Button>
            </div>


          </div>
        </div>
      ) : (


     

        <div className="mt-6">
        <Button
          className={cn(
            "w-full text-2xl  min-h-[200px] mx-auto border-2 border-dashed border-gray-400 bg-white text-gray-700 py-3 rounded-lg  font-semibold",
            "hover:bg-gray-50 hover:border-gray-500 transition-all duration-300",
            "focus:outline-none ",
            "flex items-center justify-center gap-2 group"
          )}
          onClick={() => setemicalclatorinfo((prev) => ({ ...prev, isEmiCalcltorOpen: true }))}
        >
          <div className="relative w-16 h-16">
            <Image
              src={emptyboxIcon}
              alt="Change product icon"
              width={50}
              height={50}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
              priority
              quality={100}
            />
          </div>
          <span className="font-family-math text-[#1a67b0]">Select Product</span>
        </Button>
      </div>
      )}
    </div>
  );
}