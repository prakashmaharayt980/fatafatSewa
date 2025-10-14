'use client';

import React, { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from 'react';
import { ProductDetails } from '../types/CategoryTypes';

// Define interfaces
interface UserInfo {
  name: string;
  email: string;
  phone: string;
  occupation: string;
  gender: string;
  dob: string;
  address: string;
}

interface EmiContextInfoIF {
  userInfo: UserInfo;
  isDrawerOpen: boolean;
  files: {
    citizenshipFile: File | null;
    photoFiles: File[];
    creditCardStatement: File | null;
    bankStatement: File | null;
  };
  emiTenure: string;
  product: ProductDetails | null;
  downPayment: number | null;
  monthlyEMI: number | null;
  hasCreditCard: string;
  bankinfo: {
    expiryDate: string;
    cardHolderName: string;
    creditCardNumber: string;
    accountHolderName: string;
    accountNumber: string;
    bankname: string;
    creditCardProvider: string;
  };
}

interface EmiCalculatorInter {
  productselected: ProductDetails | null;
  emirequiredinfo: {
    bank: string;
    eachCollectionDuration: number;
    Downpayment: number;
    cardmethodOptions: {
      visa: number;
      master: number;
      esewa: number;
    };
  };
  isEmiCalcltorOpen: boolean;
}

interface CartContextType {
  items: Array<ProductDetails>;
  compareItems:Array<ProductDetails>;
  addToCart: (product: ProductDetails, quantity?: number, openDrawer?: boolean) => void;
  addToCompare: (product: ProductDetails) => void;
  buyNow: (product: ProductDetails) => void;
  updateQuantity: (id: number, change: number) => void;
  removeFromCart: (id: number) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  toggleDrawer: () => void;
  calculateSubtotal: () => number;
  setItems: (items: ProductDetails[]) => void;
  setCompareItems: (items: ProductDetails[]) => void;
  processedToCheckout: () => void;
  finalCheckout: boolean;
  setFinalCheckout: Dispatch<SetStateAction<boolean>>;
  setOrderSuccess: Dispatch<SetStateAction<boolean>>;
  orderSuccess: boolean;
  emiContextInfo: EmiContextInfoIF;
  setEmiContextInfo: Dispatch<SetStateAction<EmiContextInfoIF>>;
  EMICalculator: (price: number, tenure: string, downPayment?: number) => number;
  emicalclatorinfo: EmiCalculatorInter;
  setemicalclatorinfo: Dispatch<SetStateAction<EmiCalculatorInter>>;
  IsUserLogin: boolean;
  loginDailog: boolean;
  loginNeed: () => void;
  WishListInfo: {
    isDrawerOpen: boolean;
    productList: ProductDetails[];
  };
  setWishListInfo: Dispatch<SetStateAction<CartContextType['WishListInfo']>>;
  getRecentEmiProduct: () => ProductDetails | null;
}

const CartContext = createContext<CartContextType>({
  items: [],
  compareItems:[],
  addToCart: () => {},
  addToCompare: () => {},
  buyNow: () => {},
  updateQuantity: () => {},
  removeFromCart: () => {},
  isDrawerOpen: false,
  setIsDrawerOpen: () => {},
  toggleDrawer: () => {},
  calculateSubtotal: () => 0,
  setItems: () => {},
  setCompareItems: () => {},
  processedToCheckout: () => {},
  finalCheckout: false,
  setOrderSuccess: () => {},
  orderSuccess: false,
  emiContextInfo: {
    userInfo: {
      name: '',
      email: '',
      phone: '',
      occupation: '',
      gender: '',
      dob: '',
      address: '',
    },
    isDrawerOpen: false,
    files: {
      citizenshipFile: null,
      photoFiles: [],
      creditCardStatement: null,
      bankStatement: null,
    },
    emiTenure: '',
    product: null,
    downPayment: null,
    monthlyEMI: null,
    hasCreditCard: 'no',
    bankinfo: {
      expiryDate: '',
      cardHolderName: '',
      creditCardNumber: '',
      accountHolderName: '',
      accountNumber: '',
      bankname: '',
      creditCardProvider: '',
    },
  },
  setEmiContextInfo: () => {},
  EMICalculator: () => 0,
  emicalclatorinfo: {
    productselected: null,
    emirequiredinfo: {
      bank: '',
      eachCollectionDuration: 0,
      Downpayment: 0,
      cardmethodOptions: {
        visa: 10,
        master: 10,
        esewa: 10,
      },
    },
    isEmiCalcltorOpen: false,
  },
  setemicalclatorinfo: () => {},
  IsUserLogin: false,
  loginDailog: false,
  loginNeed: () => {},
  WishListInfo: {
    isDrawerOpen: false,
    productList: [],
  },
  setWishListInfo: () => {},
  getRecentEmiProduct: () => null,
  setFinalCheckout: () => {},
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getRecentEmiProduct = (): ProductDetails | null => {
    if (typeof window === 'undefined') return null;
    try {
      const storedProduct = localStorage.getItem('recent emi');
      return storedProduct ? JSON.parse(storedProduct) : null;
    } catch (error) {
      console.error('Error parsing recentEmi from localStorage:', error);
      return null;
    }
  };

  const [items, setItems] = useState<Array<ProductDetails>>([]);
  const [compareItems, setCompareItems] = useState<Array<ProductDetails>>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [finalCheckout, setFinalCheckout] = useState<boolean>(false);
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);
  const [IsUserLogin, setIsUserLogin] = useState<boolean>(true);
  const [loginDailog, setloginDailog] = useState<boolean>(false);
  const [emiContextInfo, setEmiContextInfo] = useState<EmiContextInfoIF>({
    userInfo: {
      name: '',
      email: '',
      phone: '',
      occupation: '',
      gender: '',
      dob: '',
      address: '',
    },
    isDrawerOpen: false,
    files: {
      citizenshipFile: null,
      photoFiles: [],
      creditCardStatement: null,
      bankStatement: null,
    },
    emiTenure: '',
    product: null,
    downPayment: null,
    monthlyEMI: null,
    hasCreditCard: 'no',
    bankinfo: {
      expiryDate: '',
      cardHolderName: '',
      creditCardNumber: '',
      accountHolderName: '',
      accountNumber: '',
      bankname: '',
      creditCardProvider: '',
    },
  });
  const [emicalclatorinfo, setemicalclatorinfo] = useState<EmiCalculatorInter>({
    productselected: null,
    emirequiredinfo: {
      bank: '',
      eachCollectionDuration: 0,
      Downpayment: 0,
      cardmethodOptions: {
        visa: 10,
        master: 10,
        esewa: 10,
      },
    },
    isEmiCalcltorOpen: false,
  });
  const [WishListInfo, setWishListInfo] = useState<CartContextType['WishListInfo']>({
    isDrawerOpen: false,
    productList: [],
  });

  // Load cart items from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const storedItems = localStorage.getItem('cartItems');
      if (storedItems) {
        setItems(JSON.parse(storedItems));
      }
    } catch (error) {
      console.error('Error loading cart items from localStorage:', error);
    }

    // Load recent EMI product
    const recentProduct = getRecentEmiProduct();
    if (recentProduct) {
      setEmiContextInfo((prev) => ({
        ...prev,
        product: recentProduct,
      }));
    }
  }, []);

  // Sync cart items to localStorage whenever items change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('cartItems', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart items to localStorage:', error);
    }
  }, [items]);

  const addToCart = (product: ProductDetails, quantity: number = 1, openDrawer: boolean = false) => {
    if (!product?.id || !product?.name || !product?.price) {

      throw new Error('Product must have id, name, and price');
    }

    if (quantity <= 0) {

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
  const addToCompare = (product: ProductDetails) => {
    if (!product?.id || !product?.name || !product?.price) {
      throw new Error('Product must have id, name, and price');
    }
    setCompareItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return ;

      return [...prev, { ...product, }];
    });


  };

  const buyNow = (product: ProductDetails) => {
    if (!product?.id || !product?.name || !product?.price) {
      console.error('Invalid product data:', product);
      throw new Error('Product must have id, name, and price');
    }
    setItems([{ ...product, quantity: 1 }]);
    setIsDrawerOpen(true);
  };

  const updateQuantity = (id: number, change: number) => {
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
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  const processedToCheckout = () => {
    setIsDrawerOpen(false);
  };

  const EMICalculator = (price: number, tenure: string, downPayment: number = 0): number => {
    const tenureMonths = parseInt(tenure, 10);
    if (!price || isNaN(tenureMonths) || ![6, 9, 12, 18].includes(tenureMonths)) {
      console.warn('Invalid EMI inputs:', { price, tenure, downPayment });
      return 0;
    }
    const remainingAmount = price - downPayment;
    return remainingAmount > 0 ? Math.round(remainingAmount / tenureMonths) : 0;
  };

  const loginNeed = () => {
    setloginDailog((prev) => !prev);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        compareItems,
        setCompareItems,
        addToCompare,
        buyNow,
        updateQuantity,
        removeFromCart,
        isDrawerOpen,
        setIsDrawerOpen,
        toggleDrawer,
        calculateSubtotal,
        setItems,
        processedToCheckout,
        finalCheckout,
        setOrderSuccess,
        orderSuccess,
        emiContextInfo,
        setEmiContextInfo,
        EMICalculator,
        emicalclatorinfo,
        setemicalclatorinfo,
        IsUserLogin,
        loginNeed,
        loginDailog,
        WishListInfo,
        setWishListInfo,
        getRecentEmiProduct,
        setFinalCheckout,
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