'use client';
import React from 'react';
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import {
  Drawer,

  DrawerContent,

  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

import { useContextCart } from './CartContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';


const CheckoutDrawer = () => {
  const {
    items,
    updateQuantity,
    isDrawerOpen,
    setIsDrawerOpen,
    calculateSubtotal,
    removeFromCart,


  } = useContextCart();
  const router = useRouter();


  const subtotal = calculateSubtotal();

  const handlerouter = () => {
    router.push('/checkout');
    setIsDrawerOpen(false);
  }



  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}  >
      <DrawerContent className="max-h-[40vh] max-w-5xl mx-auto border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <DrawerHeader className="text-center border-b border-gray-200 m-0 p-0 items-center py-1">
          <DrawerTitle className="flex items-center justify-center gap-1 sm:gap-2 text-lg sm:text-xl text-[var(--colour-fsP2)] font-semibold">
            <ShoppingCart className="w-4 sm:w-5 h-4 sm:h-5 text-[var(--colour-fsP1)]" />
            Cart
          </DrawerTitle>
        </DrawerHeader>

        <div className="px-2 sm:px-6 py-2 sm:py-4 overflow-y-auto flex-1">
          {/* Cart Items */}
          <div className="mb-3 sm:mb-6">
            <h3 className="font-medium text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Items</h3>
            {items.length === 0 ? (
              <div className="text-center py-4 sm:py-6 text-gray-500 text-sm">
                <ShoppingCart className="w-6 sm:w-8 h-6 sm:h-8 mx-auto mb-2 text-gray-400" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2 sm:py-3 px-0 sm:px-1">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-md flex items-center justify-center">
                        <Image
                          src={item.image || '/placeholder.png'}
                          alt={item.name}
                          width={48}
                          height={48}
                          className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-xs sm:text-sm">{item.name}</h4>
                        <p className="text-[10px] sm:text-xs text-gray-500">${item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <div className="flex items-center border rounded-md overflow-hidden border-gray-200">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-6 sm:w-7 h-6 sm:h-7 flex items-center justify-center hover:bg-gray-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-2 sm:w-3 h-2 sm:h-3" />
                        </button>
                        <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-medium border-x">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-6 sm:w-7 h-6 sm:h-7 flex items-center justify-center hover:bg-gray-50"
                        >
                          <Plus className="w-2 sm:w-3 h-2 sm:h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-6 sm:w-7 h-6 sm:h-7 flex items-center justify-center text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-2 sm:w-3 h-2 sm:h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>


        </div>

        <div className="w-full bg-white border-t border-gray-200 px-3 sm:px-6 py-2 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="text-left flex flex-row gap-2 sm:gap-4 items-center">
              <div className="text-base sm:text-xl text-[var(--colour-fsP1)] font-medium">Total:</div>
              <div className="text-base sm:text-xl font-bold text-[var(--colour-fsP2)]">Rs. {subtotal.toFixed(2)}</div>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={handlerouter}
                className="px-3 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base font-medium rounded-lg flex items-center gap-1 sm:gap-2 transition-colors bg-[var(--colour-fsP1)] text-white hover:bg-blue-700"
              >
                Proceed To Checkout <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4" />
              </button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CheckoutDrawer;