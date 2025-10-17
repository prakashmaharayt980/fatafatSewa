'use client';

import React from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { formatDate } from '../CommonVue/datetime';
import { imglist } from '../CommonVue/Image';


import { bloginfointerface } from '../types/Blogtypes';

interface FeaturedPageProps {
    articles: bloginfointerface['data'];
}

const FeaturedPage = ({ articles }: FeaturedPageProps) => {
    const router = useRouter();

    const handleBlogDetails = (slug: string) => {
        router.push(`/blog/blogDetails/${slug}`);
    };

    // Take only first 5 articles


    return (
        <div className="w-full bg-white overflow-visible  my-8">
            {/* Header */}
            <div className="relative">
                <h2 className="text-xl font-bold text-gray-900 font-serif heading-title relative inline-block  px-4 mb-2">
                    Featured Articles
                </h2>
            </div>


            <div className=" px-2">
                <div className="flex overflow-x-auto scrollbar-hide gap-2 ">
                    {articles.map((article) => (
                        <div
                            key={article.id}
                            className="flex-shrink-0 w-[calc(50%-8px)] sm:w-[calc(20%-6px)]  group cursor-pointer  transition-all duration-300 rounded-lg hover:translate-y-2 hover:shadow-xl mb-2 sm:mb-4 border border-gray-100 hover:border-gray-200"
                            onClick={() => handleBlogDetails(article.slug)}
                            style={{
                                boxShadow: `0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)`,
                                background: `linear-gradient(145deg, #ffffff 0%, #f9fafb 100%) `
                            }}
                        >
                            {/* Image Container */}
                            <div className="relative overflow-hidden rounded-t-lg bg-gray-50">
                                <div className="aspect-w-16  h-46 relative">
                                    <Image
                                        src={imglist.urlimg2}
                                        alt={article.title}
                                        className="object-cover h-full w-full transition-transform duration-500 "
                                        fill
                                    />
                                    {/* <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" /> */}
                                </div>
                                {/* Category Tag */}
                                <div className="absolute top-2 left-2">
                                    <span className="px-3 py-1 bg-white/90 rounded-full text-xs font-semibold text-[var(--colour-fsP2)]">
                                        {article.category || 'Featured'}
                                    </span>
                                </div>
                            </div>

                            {/* Content Container */}
                            <div className="p-2 bg-white rounded-b-lg">



                                <div className="flex flex-row gap-2 items-center">

                                    <span className="text-xs font-medium text-gray-900">
                                        {article.author || 'Unknown Author'}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {formatDate(article.created_at)}
                                    </span>

                                </div>

                                <h3 className="font-bold text-gray-900 text-sm  line-clamp-2 group-hover:text-[var(--colour-fsP2)] transition-colors duration-200">
                                    {article.title}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                    scroll-behavior: smooth;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                
            `}</style>
        </div>
    );
};

export default FeaturedPage;