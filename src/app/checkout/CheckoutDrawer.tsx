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


const CheckoutDrawer = () => {
  const {
    items,
    updateQuantity,
    isDrawerOpen,
    setIsDrawerOpen,
    calculateSubtotal,
    removeFromCart,

 processedToCheckout
  } = useContextCart();


  const subtotal = calculateSubtotal();



  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}  >
      <DrawerContent className="max-h-[40vh] max-w-5xl mx-auto border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <DrawerHeader className="text-center border-b border-gray-200 m-0 p-0 items-center py-1">
          <DrawerTitle className="flex items-center justify-center gap-2 text-xl text-[var(--colour-fsP2)] font-semibold">
            <ShoppingCart className="w-5 h-5 text-[var(--colour-fsP1)]" />
            Cart
          </DrawerTitle>
        </DrawerHeader>

        <div className="px-6 py-4 overflow-y-auto flex-1">
          {/* Cart Items */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Items</h3>
            {items.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-3 px-1">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 bg-gray-50 rounded-md flex items-center justify-center text-xl">
                        <Image
                          src={item.image || '/placeholder.png'}
                          alt={item.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-xs text-gray-500">${item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ">
                      <div className="flex items-center border rounded-md overflow-hidden border-gray-200">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-gray-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium border-x">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-gray-50"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>


        </div>

        <div className="w-full bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-left flex flex-row gap-4  items-center">
              <div className="text-xl text-[var(--colour-fsP1)] font-medium">Total &nbsp; :</div>
              <div className="text-xl font-bold text-[var(--colour-fsP2)]">Rs. {subtotal.toFixed(2)}</div>
            </div>
            <div className="flex gap-3">

              <button
                onClick={processedToCheckout}

                className={`px-6 py-2 font-medium rounded-lg flex items-center gap-2 transition-colors bg-[var(--colour-fsP1)] text-white hover:bg-blue-700 `}
              >
                Proced To Checkout     <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CheckoutDrawer;