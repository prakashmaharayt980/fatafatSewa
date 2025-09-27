'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import imglogo from '../assets/logoimg.png';
import { formatDate, stripHtml } from '../CommonVue/datetime';
import { useInView } from 'react-intersection-observer';
import useSWR from 'swr';
import RemoteServices from '../api/remoteservice';

interface BlogContent {
  blogpage: string;
}

// Fetcher function for SWR
const fetcher = async () => {
  const res = await RemoteServices.BlogsAll(); // Await the API call

  return res.data; // Return the data directly
};

const OurArticles = ({ blogpage }: BlogContent) => {
  const router = useRouter();
  const { ref, inView } = useInView({
    triggerOnce: true, // Fetch only once when the component enters the viewport
    threshold: 0.1, // Trigger when 10% of the component is visible
  });

  // Use SWR for data fetching
  const { data: blogContent, error, isLoading } = useSWR(
    inView && blogpage ? blogpage : null, // Only fetch when in view and blogpage is valid
    fetcher,
    {
      revalidateOnFocus: false, // Disable revalidation on focus
      revalidateOnReconnect: true, // Revalidate on reconnect
      dedupingInterval: 60000, // Dedupe requests within 60 seconds
    }
  );

  // Handle loading state
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-600 mb-2">Loading Articles...</h3>
      </div>
    );
  }

  // Handle error state
  if (error) {
    console.error('SWR Error:', error); // Debug log for error
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-600 mb-2">Failed to Load Articles</h3>
        <p className="text-gray-500 text-sm">Please try again later.</p>
      </div>
    );
  }

  // Handle empty state
  const visibleArticles = Array.isArray(blogContent) ? blogContent : [];

  return (
    <div className="mx-auto px-4 py-8" ref={ref}>
      {/* Header Section */}
      <div className="mb-2">
        <div className="flex items-center justify-center mb-6">
          <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-blue-500 to-blue-500"></div>
          <h2 className="px-6 text-2xl font-bold text-gray-900">Our Articles</h2>
          <div className="flex-1 h-1 bg-gradient-to-l from-transparent via-blue-500 to-blue-500"></div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {visibleArticles.slice(0,8).map((article) => (
          <div
            key={article.id}
            className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            {/* Article Image */}
            <div className="relative">
              {article.image ? (
                <Image
                  src={article.image}
                  alt={article.title}
                  width={300}
                  height={180}
                  className="w-full h-44 object-cover"
                  loading="lazy"
                />
              ) : (
                <Image
                  src={imglogo}
                  alt="Fatafatsewa Logo"
                  width={300}
                  height={180}
                  className="w-full h-44 object-contain bg-gray-50"
                  loading="lazy"
                />
              )}
            </div>

            {/* Article Content */}
            <div className="p-4">
              {/* Title */}
              <h3 className="font-serif text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
                {article.title}
              </h3>

              {/* Author and Date */}
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="text-blue-600 font-medium uppercase tracking-wide">
                  {article.author}
                </span>
                <span className="text-gray-500">
                  {formatDate(article.created_at)}
                </span>
              </div>

              {/* Content Preview */}
              <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                {stripHtml(article.content).length > 100
                  ? `${stripHtml(article.content).substring(0, 100)}...`
                  : stripHtml(article.content)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* No Articles Message */}
      {visibleArticles.length === 0 && (
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-gray-600 mb-2">No Articles Available</h3>
          <p className="text-gray-500 text-sm">Check back soon for new content!</p>
        </div>
      )}
    </div>
  );
};

export default OurArticles;