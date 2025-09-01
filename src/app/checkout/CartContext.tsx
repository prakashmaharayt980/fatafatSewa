'use client';
import React, { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';
import { ProductDetails } from '../product/[slug]/page';

interface CartContextType {
  items: Array<ProductDetails>;
  addToCart: (product: ProductDetails, quantity?: number, openDrawer?: boolean) => void;
  buyNow: (product: ProductDetails) => void;
  updateQuantity: (id: number, change: number) => void;
  removeFromCart: (id: number) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  toggleDrawer: () => void;
  calculateSubtotal: () => number;
  setItems: (items: ProductDetails[]) => void;
  processedToCheckout: () => void;
  handlesubmit: () => void;
  finalCheckout: boolean;
  setOrderSuccess: Dispatch<SetStateAction<boolean>>; // Fixed type
  
  orderSuccess: boolean; // Renamed for consistency
}

const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  buyNow: () => {},
  updateQuantity: () => {},
  removeFromCart: () => {},
  isDrawerOpen: false,
  setIsDrawerOpen: () => {},
  toggleDrawer: () => {},
  calculateSubtotal: () => 0,
  setItems: () => {},
  processedToCheckout: () => {},
  finalCheckout: false,
  setOrderSuccess: () => {}, // Default to empty function
  orderSuccess: false, 
  handlesubmit: ()=>{}, 
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Array<ProductDetails>>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [finalCheckout, setFinalCheckout] = useState<boolean>(false);
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false); // Renamed for consistency

  const addToCart = (product: ProductDetails, quantity: number = 1, openDrawer: boolean = false) => {
    console.log('addToCart called:', { product, quantity, openDrawer });
    if (!product?.id || !product?.name || !product?.price) {
      console.error('Invalid product data:', product);
      throw new Error('Product must have id, name, and price');
    }

    if (quantity <= 0) {
      console.warn('Invalid quantity:', quantity);
      return;
    }

    const maxQuantity = 10;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        const newQuantity = Math.min(existing.quantity + quantity, maxQuantity);
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: newQuantity } : i
        );
      }
      if (quantity > maxQuantity) {
        console.warn('Quantity exceeds max:', quantity, maxQuantity);
        return prev;
      }
      return [...prev, { ...product, quantity: Math.min(quantity, maxQuantity) }];
    });

    if (openDrawer) {
    
      setIsDrawerOpen(true);
    }
  };

  const buyNow = (product: ProductDetails) => {
    console.log('buyNow called:', product);
    if (!product?.id || !product?.name || !product?.price) {
      console.error('Invalid product data:', product);
      throw new Error('Product must have id, name, and price');
    }
    setItems([{ ...product, quantity: 1 }]);
    console.log('Setting isDrawerOpen to true');
    setIsDrawerOpen(true);
  };

  const updateQuantity = (id: number, change: number) => {
    console.log('updateQuantity called:', { id, change });
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (!item) return prev;
      const maxQuantity = 10;
      const newQuantity = Math.max(0, Math.min(item.quantity + change, maxQuantity));
      return prev
        .map((i) => (i.id === id ? { ...i, quantity: newQuantity } : i))
        .filter((i) => i.quantity > 0);
    });
  };

  const removeFromCart = (id: number) => {
    console.log('removeFromCart called:', id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const toggleDrawer = () => {
    console.log('toggleDrawer called, current isDrawerOpen:', isDrawerOpen);
    setIsDrawerOpen((prev) => !prev);
  };

  const processedToCheckout = () => {
    setFinalCheckout((prev) => !prev);
    setIsDrawerOpen(false);

  };

  const handlesubmit=() =>{
        setFinalCheckout(false);
    setIsDrawerOpen(false);
    setOrderSuccess((prev) => !prev);
  }

const EMICalacultor =()=>{
  
}

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        buyNow,
        updateQuantity,
        removeFromCart,
        isDrawerOpen,
        setIsDrawerOpen,
        toggleDrawer,
        calculateSubtotal,
        setItems,
        processedToCheckout, // Renamed for consistency
        finalCheckout, // Renamed for consistency
        setOrderSuccess, // Renamed and fixed
        orderSuccess,
      handlesubmit
        // Renamed for consistency
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useContextCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useContextCart must be used within a CartProvider');
  }
  return context;
};