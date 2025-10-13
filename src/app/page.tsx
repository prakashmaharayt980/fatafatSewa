'use client';

import React, { lazy, Suspense } from 'react';
import Image from 'next/image';

import Imgbanner from './homepage/Imgbanner';
import MetaTagData from './homepage/MetaTagData';
import img1 from '../../public/imgfile/mobileverticalbanner.jpeg';

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
    <div className="mx-auto m-0 p-0 sm:py-1  space-y-4 sm:space-y-4">
      <div className='sm:px-2 md:px-4'>
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
          <div className="relative w-full md:w-1/4 min-h-[200px]  m-0 p-4 ">
            <div className='border  h-full w-full border-gray-300 rounded-2xl overflow-hidden' style={{
              boxShadow: `
                    0 1px 3px rgba(0, 0, 0, 0.1),
                    0 1px 2px rgba(0, 0, 0, 0.06)
                `,
              background: `
                    linear-gradient(145deg, #ffffff 0%, #f9fafb 100%)
                `
            }}>
              <Image
                src={img1}
                alt="img 1"
                className="object-cover h-full  w-full rounded-none sm:rounded"

                height={100}
                width={100}
                quality={100}
                priority
              />
            </div>
          </div>
          <div className="w-full md:w-3/4 m-0 p-0">
            <Suspense fallback={<SkeltonCard />}>
              <CategoryProductSection title="Accessories" slug={'accessories-price-in-nepal'} />
            </Suspense>
          </div>
        </div>
      </div>
      <Suspense fallback={<SkeltonCard />}>
        <OfferBanner />
      </Suspense>

      <div className='sm:px-2 md:px-4'>



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
    </div>
  );
};

// Main Page component with ContextStoreProvider
export default page