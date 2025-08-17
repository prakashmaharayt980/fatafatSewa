'use client';

import React from 'react';

export default function SkeletonHomepage() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-2 space-y-12">
      {/* Imgbanner Skeleton */}
      <div className="w-full h-[300px] bg-gray-200 animate-pulse rounded-lg"></div>

      {/* New Arrivals - BasketCard Skeleton */}
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 animate-pulse rounded w-1/4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {Array(4)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="bg-gray-200 animate-pulse h-48 rounded-lg"></div>
            ))}
        </div>
      </div>

      {/* PopularCategories Skeleton */}
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 animate-pulse rounded w-1/4"></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array(8)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="bg-gray-200 animate-pulse h-24 rounded-lg"></div>
            ))}
        </div>
      </div>

      {/* Accessories Section Skeleton */}
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <div className="relative w-full md:w-1/4 min-h-[400px] bg-gray-200 animate-pulse rounded-lg"></div>
        <div className="w-full md:w-3/4 space-y-4">
          <div className="h-6 bg-gray-200 animate-pulse rounded w-1/4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array(6)
              .fill(null)
              .map((_, index) => (
                <div key={index} className="bg-gray-200 animate-pulse h-48 rounded-lg"></div>
              ))}
          </div>
        </div>
      </div>

      {/* OfferBanner Skeleton */}
      <div className="space-y-6">
        <div className="h-6 bg-gray-200 animate-pulse rounded w-1/3"></div>
        <div className="flex flex-col md:flex-row items-end gap-6">
          <div className="w-48 h-48 sm:w-60 sm:h-60 bg-gray-200 animate-pulse rounded-full"></div>
          <div className="flex flex-col gap-4 w-full">
            <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4"></div>
            <div className="flex gap-2">
              {Array(4)
                .fill(null)
                .map((_, index) => (
                  <div key={index} className="w-16 h-16 bg-gray-200 animate-pulse rounded-xl"></div>
                ))}
            </div>
            <div className="h-12 bg-gray-200 animate-pulse rounded w-1/2"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Array(5)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="bg-gray-200 animate-pulse h-32 rounded-2xl"></div>
            ))}
        </div>
      </div>

      {/* Water Pumps Section Skeleton (repeated) */}
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 animate-pulse rounded w-1/4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {Array(4)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="bg-gray-200 animate-pulse h-48 rounded-lg"></div>
            ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 animate-pulse rounded w-1/4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {Array(4)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="bg-gray-200 animate-pulse h-48 rounded-lg"></div>
            ))}
        </div>
      </div>

      {/* OurArticles Skeleton */}
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 animate-pulse rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array(3)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="bg-gray-200 animate-pulse h-64 rounded-lg"></div>
            ))}
        </div>
      </div>
    </div>
  );
}