'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import RemoteServices from './remoteservice';
import { usePathname } from 'next/navigation';
import { CategorySlug } from '../types/CategoryTypes';

// Define interfaces
export interface imagesArray {
  name: string;
  default: string;
  original: string;
  preview: string;
  thumbnail: string;
  is_default: boolean;
}

export interface DefaultProductInterface {
  id: number;
  title: string;
  slug: string;
  parent_id: number | null;
  parent_tree: string | null;
  children: DefaultProductInterface[] | null;
  image: imagesArray;
  created_at?: string;
  updated_at?: string;
}

export interface ProductTrending {
  image: string;
  slug: string;
  price: string;
  originalPrice: string;
  discounted_price: number;
  name: string;
  reviews: string[];
  emi_enabled?: number;
  average_rating: number;
  highlights: string;
}





export interface HomePageData {
  categories: Array<{
    id: number;
    title: string;
    slug: string;
    parent_id: number | null;
    parent_tree: string | null;
    children: HomePageData['categories'];
    image: {
      name: string;
      default: string;
      original: string;
      preview: string;
      thumbnail: string;
      is_default: boolean;
    }

    created_at?: string;
    updated_at?: string;
  }>;


  blogContent: Array<[{
    author: string;
    content: string;
    slug: string;
    title: string;
    created_at: Date;
    id: number
  }]>

}

interface ContextStoreContextType {
  loading: boolean;
  error: string | null;
  homePageData: HomePageData | null;
 


}

const ContextStoreContext = createContext<ContextStoreContextType>({
  loading: true,
  error: null,
  homePageData: null,


});

export const ContextStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [homePageData, setHomePageData] = useState<HomePageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pathname=usePathname()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          categoriesRes,

          blogsRes,
       

        ] = await Promise.all([
          RemoteServices.Categories(),
  
          RemoteServices.BlogsAll().then(res=>res.data),
 
        ]);

        setHomePageData({
          categories: categoriesRes.data,

          blogContent: [blogsRes],
    


        });


      } catch (e) {
        setError('Failed to fetch data. Please try again later. ');
      } finally {
        setLoading(false);
      }
    };
   
    if(pathname ==='/' && homePageData ===null){
  fetchData();
    }
  

    return () => {
      // Cleanup if RemoteServices supports cancellation
    };
  }, [homePageData,pathname]);



  return (
    <ContextStoreContext.Provider value={{ loading, error, homePageData,  }}>
      {children}
    </ContextStoreContext.Provider>
  );
};

export const useContextStore = () => {
  const context = useContext(ContextStoreContext);
  if (!context) {
    throw new Error('useContextStore must be used within a ContextStoreProvider');
  }
  return context;
};