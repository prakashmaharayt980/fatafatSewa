'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import RemoteServices from './remoteservice';

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

export interface CategorySlug {
  category: {
    slug: string;
    parent_tree: string | null;
  };
  products: {
    data: Array<{
      slug: string;
      highlights: string;
      emi_enabled: number;
      image: string;
      discounted_price: number;
      price: string;
      average_rating: number;
      name: string;
      
    }>;
  };
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

  newArrivals: ProductTrending[];
  laptops: CategorySlug[];
  accessories: CategorySlug[];
  waterPumps: CategorySlug[];
  blogContent: Array<[{
    author: string;
    content: string;
    slug: string;
    title: string;
    created_at: Date;
    id: number
  }]>
    homeappliance: CategorySlug[],
      laptopitem: CategorySlug[],
          droneitem: CategorySlug[]

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          categoriesRes,
          laptopRes,
          accessoriesRes,
          waterPumpRes,
          homeappliance,
          trendingRes,
          blogsRes,
          laptopitem,
          droneitem

        ] = await Promise.all([
          RemoteServices.Categories(),
          RemoteServices.CategoriesSlug('mobile-price-in-nepal'),
          RemoteServices.CategoriesSlug('accessories-price-in-nepal'),
          RemoteServices.CategoriesSlug('water-pump-price-in-nepal'),
          RemoteServices.CategoriesSlug('macbook-price-in-nepal'),
          RemoteServices.ProductTranding(),
          RemoteServices.BlogsAll(),
            RemoteServices.CategoriesSlug('laptop-price-in-nepal'),
            RemoteServices.CategoriesSlug('drone-price-in-nepal'),
        ]);

        setHomePageData({
          categories: categoriesRes.data,
          newArrivals: trendingRes.data,
          laptops: [laptopRes],
          accessories: [accessoriesRes],
          waterPumps: [waterPumpRes],
          blogContent: [blogsRes],
          homeappliance:[homeappliance],
          laptopitem:[laptopitem],
          droneitem:[droneitem]

        });

        console.log('cat Data:', categoriesRes.data);
      } catch (e) {
        setError('Failed to fetch data. Please try again later. ');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      // Cleanup if RemoteServices supports cancellation
    };
  }, []);

  return (
    <ContextStoreContext.Provider value={{ loading, error, homePageData }}>
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