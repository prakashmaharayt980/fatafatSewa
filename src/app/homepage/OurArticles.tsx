'use client';

import React from 'react';
import { useContextStore } from '../api/ContextStore';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import imglogo from '../assets/logoimg.png';

const OurArticles = () => {
  const { homePageData } = useContextStore();
  const { blogContent } = homePageData;
  const router = useRouter();
  const allArticles = blogContent && blogContent.length > 0 ? blogContent[0] : [];
  const visibleArticles = allArticles.slice(0, 8); // Fixed to 8 articles

  const stripHtml = (html) => {
    if (!html) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const images = tempDiv.querySelectorAll('img');
    images.forEach(img => img.remove());
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="mx-auto px-4 py-8 ">
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
        {visibleArticles.map((article) => (
          <div
            key={article.id}
            className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300  overflow-hidden"
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
                />
              ) : (
                <Image
                  src={imglogo}
                  alt="Fatafatsewa Logo"
                  width={300}
                  height={180}
                  className="w-full h-44 object-contain bg-gray-50"
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
              <p className="text-gray-700 text-sm leading-relaxed line-clamp-3 ">
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