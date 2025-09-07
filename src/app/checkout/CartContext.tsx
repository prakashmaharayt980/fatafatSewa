'use client';
import React, { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';
import { ProductDetails } from '../product/[slug]/page';



interface UserInfo {
  name: string;
  email: string;
  phone: string;
  occupation: string,
  gender: string,
  dob: string,
  address: string
}

export interface EmiContextInfoIF {
  userInfo: UserInfo;
  isDrawerOpen: boolean;
  files: {
    citizenshipFile: File | null;
    photoFiles: File[] | null;
    creditCardStatement: null,
    bankStatement: null
  };
  emiTenure: string;
  product: ProductDetails | null; // Made nullable to match default
  downPayment: number | null; // Added for EMI calculator
  monthlyEMI: number | null; // Added for displaying calculated EMI
  hasCreditCard: string;
  bankinfo: {
    expiryDate: string;
    cardHolderName: string;
    creditCardNumber: string;
    accountHolderName: string;
    accountNumber: string;
    bankname: string;
    creditCardProvider: string;
  }

}

interface EmiCalacutorinter {
  productselected: ProductDetails;
  emirequiredinfo: {
    bank: string;
    eachCollectionDuration: number;
    Downpayment: number;
    cardmethodOptions: {
      visa: number;
      master: number;
      esewa: number;
    }

  };
  isEmiCalcltorOpen: boolean

}

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
  setOrderSuccess: Dispatch<SetStateAction<boolean>>;
  orderSuccess: boolean;
  emiContextInfo: EmiContextInfoIF;
  setEmiContextInfo: Dispatch<SetStateAction<EmiContextInfoIF>>;
  EMICalculator: (price: number, tenure: string, downPayment?: number) => number;
  emicalclatorinfo: EmiCalacutorinter,
  setemicalclatorinfo: Dispatch<SetStateAction<EmiCalacutorinter>>;
  IsUserLogin: boolean;
  loginDailog: boolean;
  loginNeed: () => void;
  WishListInfo: {
    isDrawerOpen: boolean,
    productList: ProductDetails[],
  };
  setWishListInfo:Dispatch<SetStateAction<CartContextType['WishListInfo']>>;

}

const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => { },
  buyNow: () => { },
  updateQuantity: () => { },
  removeFromCart: () => { },
  isDrawerOpen: false,
  setIsDrawerOpen: () => { },
  toggleDrawer: () => { },
  calculateSubtotal: () => 0,
  setItems: () => { },
  processedToCheckout: () => { },
  finalCheckout: false,
  setOrderSuccess: () => { },
  orderSuccess: false,
  handlesubmit: () => { },
  emiContextInfo: {
    userInfo: {
      name: '',
      email: '',
      phone: '',
      occupation: '',
      gender: '',
      dob: null,
      address: ''
    },
    isDrawerOpen: false,
    files: {
      citizenshipFile: null,
      photoFiles: null,
      creditCardStatement: null,
      bankStatement: null
    },
    emiTenure: '',
    product: null,
    downPayment: null,
    monthlyEMI: null,
    hasCreditCard: '',
    bankinfo: {
      expiryDate: '',
      cardHolderName: '',
      creditCardNumber: '',
      accountHolderName: '',
      accountNumber: '',
      bankname: '',
      creditCardProvider: ''
    }

  },
  setEmiContextInfo: () => { },
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
      }

    },
    isEmiCalcltorOpen: false
  },
  setemicalclatorinfo: () => { },
  IsUserLogin: false,
  loginDailog: false,
  loginNeed: () => { },
  WishListInfo: {
    isDrawerOpen: false,
    productList: null
  },
  setWishListInfo:()=>{}
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Array<ProductDetails>>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [finalCheckout, setFinalCheckout] = useState<boolean>(false);
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);
  const [emiContextInfo, setEmiContextInfo] = useState<EmiContextInfoIF>({

    userInfo: {
      name: '',
      email: '',
      phone: '',
      occupation: '',
      gender: '',
      dob: null,
      address: ''
    },
    isDrawerOpen: false,
    files: {
      citizenshipFile: null,
      photoFiles: null,
      creditCardStatement: null,
      bankStatement: null
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
      creditCardProvider: ''
    }

  });
  const [IsUserLogin, setIsUserLogin] = useState(false)
  const [loginDailog, setloginDailog] = useState(false)

  const [emicalclatorinfo, setemicalclatorinfo] = useState<EmiCalacutorinter>({
    productselected: null,
    emirequiredinfo: {
      bank: '',
      eachCollectionDuration: 0,
      Downpayment: 0,
      cardmethodOptions: {
        visa: 10,
        master: 10,
        esewa: 10,
      }

    },
    isEmiCalcltorOpen: false
  })

  const [WishListInfo, setWishListInfo] = useState<CartContextType['WishListInfo']>({
    isDrawerOpen: false,
    productList: null,

  })


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

    setIsDrawerOpen((prev) => !prev);
  };

  const processedToCheckout = () => {
    setFinalCheckout((prev) => !prev);
    setIsDrawerOpen(false);
  };

  const handlesubmit = () => {
    setFinalCheckout(false);
    setIsDrawerOpen(false);
    setOrderSuccess(true);
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
    setloginDailog(prev => !prev)
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
        processedToCheckout,
        finalCheckout,
        setOrderSuccess,
        orderSuccess,
        handlesubmit,
        emiContextInfo,
        setEmiContextInfo,
        EMICalculator,
        emicalclatorinfo, setemicalclatorinfo,
        IsUserLogin, loginNeed, loginDailog,WishListInfo,setWishListInfo
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