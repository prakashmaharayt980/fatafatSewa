'use client';

import React, { lazy, Suspense } from 'react';
import Image from 'next/image';
import Imgbanner from './homepage/Imgbanner';
import MetaTagData from './homepage/MetaTagData';
import img1 from '../../public/imgfile/banner4.jpg';
import BasketCardTrading from './homepage/BasketCardTrading';
import SkeltonCard from './homepage/SkeltonCard';

// Lazy-loaded components
const BasketCard = lazy(() => import('./homepage/BasketCard'));
const PopularCategories = lazy(() => import('./homepage/PopularCategories'));
const OfferBanner = lazy(() => import('./homepage/OfferBanner'));
const OurArticles = lazy(() => import('./homepage/OurArticles'));
const CategoryProductSection = lazy(() => import('./homepage/BasketCardwithImage'));
const TwoImageBanner = lazy(() => import('./homepage/Banner2'));
const OneImageBanner = lazy(() => import('./blog/Bannertop'));

const page = () => {
  // Dynamic image source (can be passed as prop or configured dynamically)
  const bannerImage = img1; // Replace with dynamic source if needed (e.g., from API or prop)

  return (
    <div className="mx-auto m-0 p-0 sm:py-1 space-y-4 sm:space-y-4">
      <div className="sm:px-2 md:px-4">
        <Imgbanner />
        <Suspense fallback={<SkeltonCard />}>
          <BasketCardTrading title="New Arrivals" />
        </Suspense>
        <Suspense fallback={<SkeltonCard />}>
          <OneImageBanner />
        </Suspense>

        <Suspense fallback={<SkeltonCard />}>
          <BasketCard title="Laptop of 2025" slug={'laptop-price-in-nepal'} />
        </Suspense>
        <Suspense fallback={<SkeltonCard />}>
          <TwoImageBanner />
        </Suspense>
        <Suspense fallback={<SkeltonCard />}>
          <PopularCategories />
        </Suspense>
        <div className="flex flex-col md:flex-row gap-2 sm:gap-3 w-full m-0 p-0 sm:mx-0 sm:px-0">
          <div className="relative flex justify-end w-full h-96 sm:h-[500px] md:w-1/5 p-4 sm:p-4">
            <div className="border w-full   border-blue-100 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md">

              <Image
                src={bannerImage}
                alt="Banner Image"
                className="rounded-lg object-cover group-hover:scale-105 transition-transform duration-500"
                fill
                quality={100}
                loading="lazy"
                sizes="(max-width: 640px) 150px, (max-width: 768px) 200px, (max-width: 1024px) 250px, (max-width: 1280px) 200px, 180px"
              />
            </div>
          </div>
          <div className="w-full md:w-4/5 m-0 p-0">
            <Suspense fallback={<SkeltonCard />}>
              <CategoryProductSection title="Accessories" slug={'accessories-price-in-nepal'} />
            </Suspense>
          </div>
        </div>
      </div>
      <Suspense fallback={<SkeltonCard />}>
        <OfferBanner />
      </Suspense>
      <div className="sm:px-2 md:px-4">
        <Suspense fallback={<SkeltonCard />}>
          <BasketCard title="Water Pumps of 2025" slug={'water-pump-price-in-nepal'} />
        </Suspense>
        <Suspense fallback={<SkeltonCard />}>
          <OneImageBanner />
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
        <Suspense fallback={<SkeltonCard />}>
          <OneImageBanner />
        </Suspense>
        <Suspense fallback={<SkeltonCard />}>
          <OurArticles blogpage="blog" />
        </Suspense>
        <MetaTagData />
      </div>
    </div>
  );
};

export default page;