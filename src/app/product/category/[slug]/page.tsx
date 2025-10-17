'use client'

import React, { use, useEffect, useState } from 'react';
import TopBanner from './TopBanner';


import RemoteServices from '@/app/api/remoteservice';
import { SlugProps } from '@/app/types/PropSlug';
import { CategorySlug } from '@/app/types/CategoryTypes';
import ParsedContent from '../../ParsedContent';
import ProductFilters from './FilterProduct';

const CategoryPage = ({ params }: SlugProps) => {
  const paramsResolved = use(params); // Unwrap the params Promise
  const { slug } = paramsResolved;
  const [categorySlugData, setCategorySlugData] = useState<CategorySlug | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError('Invalid category slug');
      return;
    }

    RemoteServices.CategoriesSlug(slug)
      .then(res => {
        setCategorySlugData(res); // Use res.data to match CategorySlug interface
        console.log('Category slug data:', res);
      })
      .catch(err => {
        console.error('Error fetching category:', err);
        setError('Failed to load category data');
      });
  }, [slug]);

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h3 className="text-xl font-semibold text-red-600">{error}</h3>
        <p className="text-gray-500">Please try again or select a different category.</p>
      </div>
    );
  }

  if (!categorySlugData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <div className="animate-pulse text-gray-500">Loading category...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-4 px-2  sm:px-4 sm:py-8">
      <TopBanner />


      
      <ProductFilters categoryslug={categorySlugData.products} />
      <ParsedContent description={categorySlugData.category.description} />
    </div>
  );
};

export default CategoryPage;