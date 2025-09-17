// src/context/EmiContext.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
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
}

interface BankInfo {
  expiryDate: string;
  cardHolderName: string;
  creditCardNumber: string;
  accountHolderName: string;
  accountNumber: string;
  bankname: string;
  creditCardProvider: string;
  cardLimit: number;
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
    emiTenure: number;
    downPayment: number;
  };
  hasCreditCard: string;
  bankinfo: BankInfo;
  granterPersonalDetails: GranterPersonalDetails;
}

interface EmiContextType {
  emiContextInfo: EmiContextState;
  setEmiContextInfo: Dispatch<SetStateAction<EmiContextState>>;
}

const STORAGE_KEY = "emiContextInfo";

const defaultState: EmiContextState = {
  userInfo: {
    name: "",
    email: "",
    phone: "",
    occupation: "",
    gender: "",
    dob: "",
    address: "",
    nationalID: 0,
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
  },
  product: null,
  emiCalculation: {
    monthlyEmi: 0,
    emiTenure: 0,
    downPayment: 0,
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
    cardLimit: 0,
  },
  granterPersonalDetails: {
    name: "",
    email: "",
    phone: "",
    occupation: "",
    gender: "",
    dob: "",
    address: "",
    grandfathername: "",
    nationalID: 0,
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

  // Save to localStorage whenever state changes (excluding files)
  useEffect(() => {
    const { files, ...rest } = emiContextInfo; // omit File objects
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
  }, [emiContextInfo]);

  return (
    <EmiContext.Provider value={{ emiContextInfo, setEmiContextInfo }}>
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
