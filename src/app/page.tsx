'use client';

import React from 'react';

import Image from 'next/image';
import { useContextStore } from './api/ContextStore';
import Imgbanner, { ImagesListBanner } from './homepage/Imgbanner';
import BasketCard from './homepage/BasketCard';
import PopularCategories from './homepage/PopularCategories';
import OfferBanner from './homepage/OfferBanner';
import OurArticles from './homepage/OurArticles';

export default function Page() {
  const { homePageData, loading, error } = useContextStore();

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 text-center text-gray-600">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 text-center text-red-600">
        Error: {error}
      </div>
    );
  }

  if (!homePageData) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 text-center text-gray-500">
        No data available
      </div>
    );
  }

  const { laptops, accessories, waterPumps ,categories} = homePageData;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-12">
      <Imgbanner />

      {/* New Arrivals - Laptops */}
      {laptops?.[0] && (
        <BasketCard title="New Arrivals" items={laptops} />
      )}

      <PopularCategories categories={categories} />

      {/* Accessories Section */}
      {accessories?.[0] && (
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="relative w-full md:w-1/4 min-h-[400px]">
            <Image
              src={ImagesListBanner[2].default}
              alt={ImagesListBanner[2].name}
              className="object-contain rounded"
              fill
              quality={100}
              priority
            />
          </div>
          <div className="w-full md:w-3/4">
            <BasketCard title="Accessories" items={accessories} />
          </div>
        </div>
      )}

      <OfferBanner />

      {/* Water Pumps Section */}
      {waterPumps?.[0] && (
        <BasketCard title="Water Pumps" items={waterPumps} />
      )}
      {waterPumps?.[0] && (
        <BasketCard title="Water Pumps" items={waterPumps} />
      )}

      <OurArticles />
    </div>
  );
}