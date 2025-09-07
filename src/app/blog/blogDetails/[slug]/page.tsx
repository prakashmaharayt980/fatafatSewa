'use client';

import RemoteServices from '@/app/api/remoteservice';
import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import ParsedContent from '@/app/product/ParsedContent';
import { CompanyLogo } from '@/app/CommonVue/Payment';
import { SlugProps } from '@/app/types/PropSlug';
import { formatDate, stripHtml } from '@/app/CommonVue/datetime';
import { bloginfointerface } from '@/app/types/Blogtypes';
import { useRouter } from 'next/navigation';


export default function BlogDetail({ params }: SlugProps) {
  const { slug } = use(params); // Simplified destructuring
  const [blogContent, setBlogContent] = useState<bloginfointerface['data'][0] | null>(null);
  const [blogInfo, setBlogInfo] = useState<bloginfointerface | null>(null);
  const router =useRouter()

  useEffect(() => {
    // Fetch blog content by slug
    RemoteServices.BlogSlug(slug).then((res) => {
      setBlogContent(res.data);
    });

    // Fetch all blogs
    RemoteServices.BlogsAll().then((res) => {
      setBlogInfo(res);
    });
  }, [slug]);

  // Loading state
  if (!blogContent || !blogInfo) {
    return (
            <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--colour-fsP2)]"></div>
            <p className="mt-4 text-gray-600 font-serif">Loading articles...</p>
          </div>
    );
  }

    const handleblogdetails=(slug:string)=>{
    router.push(`/blog/blogDetails/${slug}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Blog Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          {blogContent.title}
        </h1>
        <div className="flex flex-wrap items-center text-gray-600 mb-4 gap-2">
          <span>{blogContent.author}</span>
          <span className="mx-2">•</span>
          <span>{formatDate(blogContent.created_at)}</span>
          {blogContent.readTime && (
            <>
              <span className="mx-2">•</span>
              <span>{blogContent.readTime}</span>
            </>
          )}
          {blogContent.category && (
            <>
              <span className="mx-2">•</span>
              <span className="text-blue-600">{blogContent.category}</span>
            </>
          )}
        </div>
        <div className="relative w-full h-96 mb-6">
          <Image
            src={CompanyLogo}
            alt={blogContent.title}
            fill
            className="object-contain rounded-lg"
            priority // Added for faster loading of header image
          />
        </div>
      </div>

      {/* Blog Content */}
      <div className="max-w-5xl mx-auto mb-8">
        <ParsedContent description={blogContent.content} />
      </div>

      {/* Related Articles Section */}
      <div className="w-full py-8">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-center mb-6">
            <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-blue-500 to-blue-500"></div>
            <h2 className="px-6 text-2xl font-bold text-gray-900">Read More Article</h2>
            <div className="flex-1 h-1 bg-gradient-to-l from-transparent via-blue-500 to-blue-500"></div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4  cursor-pointer">
          {blogInfo.data?.slice(0,5).map((article) => (
            <div
              key={article.id}
              onClick={()=>handleblogdetails(article.slug)}
              className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              {/* Article Image */}
              <div className="relative w-full h-44">
                <Image
                  src={article.image || CompanyLogo}
                  alt={article.title}
                  fill
                  className={`object-${article.image ? 'cover' : 'contain'} rounded-t-lg ${!article.image && 'bg-gray-50'}`}
                />
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
        {blogInfo.data?.length === 0 && (
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-600 mb-2">No Articles Available</h3>
            <p className="text-gray-500 text-sm">Check back soon for new content!</p>
          </div>
        )}
      </div>
    </div>
  );
}