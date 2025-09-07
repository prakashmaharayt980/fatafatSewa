'use client';

import React from 'react';

import Image from 'next/image';
import { useContextStore } from './api/ContextStore';
import Imgbanner from './homepage/Imgbanner';
import BasketCard from './homepage/BasketCard';
import PopularCategories from './homepage/PopularCategories';
import OfferBanner from './homepage/OfferBanner';
import OurArticles from './homepage/OurArticles';
import SkeletonHomepage from './homepage/skeletonHomepage';
import CategoryProductSection from './homepage/BasketCardwithImage';
import TwoImageBanner from './homepage/Banner2';
import img1 from '../../public/imgfile/banner3.png'
import MetaTagData from './homepage/MetaTagData';
export default function Page() {
  const { homePageData, loading, error } = useContextStore();

  if (loading) {
    return (
   <SkeletonHomepage/>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4  md:px-4 text-center text-red-600 m-0 p-0 sm:py-8 sm:px-4">
        Error: {error}
      </div>
    );
  }

  if (!homePageData) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4  md:px-4 text-center text-gray-500 m-0 p-0 sm:py-8 sm:px-4">
        No data available
      </div>
    );
  }

  const { laptops, accessories, waterPumps ,categories,   laptopitem,
          droneitem ,homeappliance } = homePageData;

  return (
    <div className="mx-auto m-0 p-0 sm:py-3 sm:px-2 md:px-4 space-y-4 sm:space-y-12">
      <Imgbanner />

      {/* New Arrivals - Laptops */}
      {laptops?.[0] && (
        <div className="m-0 p-0 sm:mx-0 sm:px-0">
          <BasketCard title="New Arrivals" items={laptops} />
        </div>
      )}
      {laptops?.[0] && (
        <div className="m-0 p-0 sm:mx-0 sm:px-0">
          <BasketCard title="Laptop of 2025" items={laptopitem} />
        </div>
      )}

      <div className="m-0 p-0 sm:mx-0 sm:px-0">
        <PopularCategories categories={categories} />
      </div>

      {/* Accessories Section */}
      {accessories?.[0] && (
        <div className="flex flex-col md:flex-row gap-0 sm:gap-4 w-full m-0 p-0 sm:mx-0 sm:px-0">
          <div className="relative w-full md:w-1/4 min-h-[300px] sm:min-h-[400px] m-0 p-0">
            <Image
              src={img1}
              alt={'img 1'}
              className="object-contain rounded-none sm:rounded"
              fill
              quality={100}
              priority
            />
          </div>
          <div className="w-full md:w-3/4 m-0 p-0">
                 <CategoryProductSection 
     title="Accessories" items={accessories}
      />
          </div>
        </div>
      )}

 

      <div className="m-0 p-0 sm:mx-0 sm:px-0">
        <OfferBanner />
      </div>

      {/* Water Pumps Section */}
      {waterPumps?.[0] && (
        <div className="m-0 p-0 sm:mx-0 sm:px-0">
          <BasketCard title="Water Pumps of 2025" items={waterPumps} />
        </div>
      )}
      {waterPumps?.[0] && (
        <div className="m-0 p-0 sm:mx-0 sm:px-0">
          <BasketCard title="Home Appliance of 2025" items={homeappliance} />
        </div>
      )}
      <div className="m-0 p-0 sm:mx-0 sm:px-0">
        <TwoImageBanner/>
      </div>


      {waterPumps?.[0] && (
        <div className="m-0 p-0 sm:mx-0 sm:px-0">
          <BasketCard title="Drone of 2025" items={droneitem} />
        </div>
      )}

      <div className="m-0 p-0 sm:mx-0 sm:px-0">
        <OurArticles />
      </div>

      <MetaTagData />
    </div>
  );
}