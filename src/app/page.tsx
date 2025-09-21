'use client';

import React, { lazy, Suspense } from 'react';
import Image from 'next/image';
import { ContextStoreProvider, useContextStore } from './api/ContextStore';
import Imgbanner from './homepage/Imgbanner';
import MetaTagData from './homepage/MetaTagData';
import img1 from '../../public/imgfile/banner3.png';
import SkeletonHomepage from './homepage/skeletonHomepage';

// Lazy-loaded components
const BasketCard = lazy(() => import('./homepage/BasketCard'));
const PopularCategories = lazy(() => import('./homepage/PopularCategories'));
const OfferBanner = lazy(() => import('./homepage/OfferBanner'));
const OurArticles = lazy(() => import('./homepage/OurArticles'));
const CategoryProductSection = lazy(() => import('./homepage/BasketCardwithImage'));
const TwoImageBanner = lazy(() => import('./homepage/Banner2'));

// Child component to consume the context
const HomePageContent = () => {
  const { homePageData, loading, error } = useContextStore();

  if (loading) {
    return <SkeletonHomepage />;
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4 md:px-4 text-center text-red-600 m-0 p-0 sm:py-8 sm:px-4">
        Error: {error}
      </div>
    );
  }

  if (!homePageData) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4 md:px-4 text-center text-gray-500 m-0 p-0 sm:py-8 sm:px-4">
        No data available
      </div>
    );
  }

  const { laptops, accessories, waterPumps, categories, laptopitem, droneitem, homeappliance } = homePageData;

  return (
    <div className="mx-auto m-0 p-0 sm:py-3 sm:px-2 md:px-4 space-y-4 sm:space-y-12">
      <Imgbanner />

      {/* New Arrivals - Laptops */}
      {laptops?.[0] && (
        <div className="m-0 p-0 sm:mx-0 sm:px-0">
          <Suspense fallback={<div>Loading New Arrivals...</div>}>
            <BasketCard title="New Arrivals" items={laptops} />
          </Suspense>
        </div>
      )}
      {laptops?.[0] && (
        <div className="m-0 p-0 sm:mx-0 sm:px-0">
          <Suspense fallback={<div>Loading Laptops...</div>}>
            <BasketCard title="Laptop of 2025" items={laptopitem} />
          </Suspense>
        </div>
      )}

      <div className="m-0 p-0 sm:mx-0 sm:px-0">
        <Suspense fallback={<div>Loading Categories...</div>}>
          <PopularCategories categories={categories} />
        </Suspense>
      </div>

      {/* Accessories Section */}
      {accessories?.[0] && (
        <div className="flex flex-col md:flex-row gap-0 sm:gap-4 w-full m-0 p-0 sm:mx-0 sm:px-0">
          <div className="relative w-full md:w-1/4 min-h-[300px] sm:min-h-[400px] m-0 p-0">
            <Image
              src={img1}
              alt="img 1"
              className="object-contain rounded-none sm:rounded"
              fill
              quality={100}
              priority
            />
          </div>
          <div className="w-full md:w-3/4 m-0 p-0">
            <Suspense fallback={<div>Loading Accessories...</div>}>
              <CategoryProductSection title="Accessories" items={accessories} />
            </Suspense>
          </div>
        </div>
      )}

      <div className="m-0 p-0 sm:mx-0 sm:px-0">
        <Suspense fallback={<div>Loading Offer Banner...</div>}>
          <OfferBanner />
        </Suspense>
      </div>

      {/* Water Pumps Section */}
      {waterPumps?.[0] && (
        <div className="m-0 p-0 sm:mx-0 sm:px-0">
          <Suspense fallback={<div>Loading Water Pumps...</div>}>
            <BasketCard title="Water Pumps of 2025" items={waterPumps} />
          </Suspense>
        </div>
      )}
      {waterPumps?.[0] && (
        <div className="m-0 p-0 sm:mx-0 sm:px-0">
          <Suspense fallback={<div>Loading Home Appliances...</div>}>
            <BasketCard title="Home Appliance of 2025" items={homeappliance} />
          </Suspense>
        </div>
      )}
      <div className="m-0 p-0 sm:mx-0 sm:px-0">
        <Suspense fallback={<div>Loading Banner...</div>}>
          <TwoImageBanner />
        </Suspense>
      </div>

      {waterPumps?.[0] && (
        <div className="m-0 p-0 sm:mx-0 sm:px-0">
          <Suspense fallback={<div>Loading Drones...</div>}>
            <BasketCard title="Drone of 2025" items={droneitem} />
          </Suspense>
        </div>
      )}

      <div className="m-0 p-0 sm:mx-0 sm:px-0">
        <Suspense fallback={<div>Loading Articles...</div>}>
          <OurArticles />
        </Suspense>
      </div>

      <MetaTagData />
    </div>
  );
};

// Main Page component with ContextStoreProvider
export default function Page() {
  return (
    <ContextStoreProvider>
      <HomePageContent />
    </ContextStoreProvider>
  );
}