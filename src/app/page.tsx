'use client';

import React, { lazy, Suspense } from 'react';
import Image from 'next/image';

import Imgbanner from './homepage/Imgbanner';
import MetaTagData from './homepage/MetaTagData';
import img1 from '../../public/imgfile/banner3.png';

import BasketCardTrading from './homepage/BasketCardTrading';
import SkeltonCard from './homepage/SkeltonCard';


// Lazy-loaded components
const BasketCard = lazy(() => import('./homepage/BasketCard'));
const PopularCategories = lazy(() => import('./homepage/PopularCategories'));
const OfferBanner = lazy(() => import('./homepage/OfferBanner'));
const OurArticles = lazy(() => import('./homepage/OurArticles'));
const CategoryProductSection = lazy(() => import('./homepage/BasketCardwithImage'));
const TwoImageBanner = lazy(() => import('./homepage/Banner2'));



// Child component to consume the context
const page = () => {


 

  return (
    <div className="mx-auto m-0 p-0 sm:py-3 sm:px-2 md:px-4 space-y-4 sm:space-y-12">
      <Imgbanner />

      <Suspense fallback={<SkeltonCard />}>
        <BasketCardTrading title="New Arrivals" />
      </Suspense>
      <Suspense fallback={<SkeltonCard />}>
        <BasketCard title="Laptop of 2025" slug={'laptop-price-in-nepal'} />
      </Suspense>

      <Suspense fallback={<SkeltonCard />}>
        <PopularCategories />
      </Suspense>

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
          <Suspense fallback={<SkeltonCard />}>
            <CategoryProductSection title="Accessories" slug={'accessories-price-in-nepal'} />
          </Suspense>
        </div>
      </div>

      <Suspense fallback={<SkeltonCard />}>
        <OfferBanner />
      </Suspense>

      <Suspense fallback={<SkeltonCard />}>
        <BasketCard title="Water Pumps of 2025" slug={'water-pump-price-in-nepal'} />
      </Suspense>

      <Suspense fallback={<SkeltonCard />}>
        <BasketCard title="Home Appliance of 2025" slug={'macbook-price-in-nepal'} />
      </Suspense>


      <Suspense fallback={<SkeltonCard />}>
        <TwoImageBanner />
      </Suspense>

      <Suspense fallback={<SkeltonCard />}>
        <BasketCard title="Drone of 2025" slug={'drone-price-in-nepal'} />
      </Suspense>

      <Suspense fallback={<SkeltonCard />}>x
        <OurArticles blogpage='blog' />
      </Suspense>


      <MetaTagData />
    </div>
  );
};

// Main Page component with ContextStoreProvider
export default  page