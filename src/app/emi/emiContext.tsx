// src/context/EmiContext.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
  useMemo,
} from "react";
import { ProductDetails } from "../product/[slug]/page";

interface UserInfo {
  name: string;
  email: string;
  phone: string;
  occupation: string;
  gender: string;
  dob: string;
  address: string;
  nationalID: number;
  marriageStatus: string;
  userpartnerName: string;

}

interface DocumentFiles {
  front: File | null;
  back: File | null;
  ppphoto: File | null;
}

interface EmiFiles {
  citizenshipFile: DocumentFiles;
  creditCardStatement: File | null;
  bankStatement: File | null;
  granterDocument: DocumentFiles;
  userSignature: File | null
}

interface BankInfo {
  expiryDate: string;
  cardHolderName: string;
  creditCardNumber: string;
  accountHolderName: string;
  accountNumber: string;
  bankname: string;
  creditCardProvider: string;
  bankbranch: string;
  cardLimit: number;
  salaryAmount: number;
}

interface GranterPersonalDetails extends UserInfo {
  grandfathername: string;
}

export interface EmiContextState {
  userInfo: UserInfo;
  isDrawerOpen: boolean;
  files: EmiFiles;
  product: ProductDetails | null;
  emiCalculation: {
    monthlyEmi: number;
    duration: number;
    downPayment: number;
    interestRate:number;  };
  hasCreditCard: string;
  bankinfo: BankInfo;
  granterPersonalDetails: GranterPersonalDetails;

}

interface EmiContextType {
  emiContextInfo: EmiContextState;
  setEmiContextInfo: Dispatch<SetStateAction<EmiContextState>>;
  AvailablebankProvider: Array<{
    id: string;
    name: string;
    rate: number;
    img: string;
  }>
}

const STORAGE_KEY = "emiContextInfo";

const defaultState: EmiContextState = {
  userInfo: {
    name: "",
    email: "",
    phone: "",
    occupation: "",
    gender: "Male",
    dob: "",
    address: "",
    nationalID: 0,
    marriageStatus: 'Single',
    userpartnerName: '',


  },
  isDrawerOpen: false,
  files: {
    citizenshipFile: {
      front: null,
      back: null,
      ppphoto: null,
    },
    creditCardStatement: null,
    bankStatement: null,
    granterDocument: {
      front: null,
      back: null,
      ppphoto: null,
    },
    userSignature: null
  },
  product: null,
  emiCalculation: {
    monthlyEmi: 0,
    duration: 12,
    downPayment: 0,
    interestRate: 12,
    
    
  },
  hasCreditCard: "no",
  bankinfo: {
    expiryDate: "",
    cardHolderName: "",
    creditCardNumber: "",
    accountHolderName: "",
    accountNumber: "",
    bankname: "",
    creditCardProvider: "",
    bankbranch: "",
    cardLimit: 0,
    salaryAmount: 0
  },
  granterPersonalDetails: {
    name: "",
    email: "",
    phone: "",
    occupation: "",
    gender: "Male",
    dob: "",
    address: "",
    grandfathername: "",
    nationalID: 0,
    marriageStatus: 'Single',
    userpartnerName: '',

  },

};

const EmiContext = createContext<EmiContextType | undefined>(undefined);

export const EmiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage (excluding files)
  const [emiContextInfo, setEmiContextInfo] = useState<EmiContextState>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          return { ...defaultState, ...parsed };
        }
      } catch (err) {
        console.error("Failed to parse EMI context from localStorage:", err);
      }
    }
    return defaultState;
  });

  const AvailablebankProvider = useMemo(
    () => [
      { id: 'nabil', name: 'Nabil Bank', rate: 11.5, img: '/imgfile/bankingPartners7.png' },
      { id: 'global', name: 'Global IME Bank', rate: 12, img: '/imgfile/bankingPartners1.png' },
      { id: 'nmb', name: 'NMB Bank', rate: 11.75, img: '/imgfile/bankingPartners3.png' },
      { id: 'siddhartha', name: 'Siddhartha Bank', rate: 12.25, img: '/imgfile/bankingPartners9.png' },
      { id: 'NicAsia', name: 'Nic Asia Bank', rate: 12.25, img: '/imgfile/bankingPartners11.png' },
      { id: 'hbl', name: 'Himalayan Bank', rate: 12.25, img: '/imgfile/bankingPartners10.png' },
      { id: 'sanimabank', name: 'Sanima Bank', rate: 12.25, img: '/imgfile/bankingPartners8.png' },
      { id: 'kumari', name: 'Kumari Bank', rate: 12.25, img: '/imgfile/bankingPartners6.png' },
    ],
    []
  );

  // Save to localStorage whenever state changes (excluding files)
  useEffect(() => {
    const { files, ...rest } = emiContextInfo; // omit File objects
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
  }, [emiContextInfo]);

  return (
    <EmiContext.Provider value={{ emiContextInfo, setEmiContextInfo, AvailablebankProvider }}>
      {children}
    </EmiContext.Provider>
  );
};

export const useContextEmi = (): EmiContextType => {
  const context = useContext(EmiContext);
  if (!context) {
    throw new Error("useContextEmi must be used within an EmiProvider");
  }
  return context;
};
