'use client'

import React, { useState, useEffect, useMemo } from 'react';
import Bannertop from './Bannertop';
import RemoteServices from '../api/remoteservice';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import { imglist } from '../CommonVue/Image';
import { Search, Calendar, User, Facebook, Twitter, Instagram, Youtube, Linkedin, Scale } from 'lucide-react';
import ProductCard from '../product/ProductCard';
import dataproduct from './testjpsnblog.json'
import BlogProductCard from './BlogProduct';

function BlogHeaderPage() {
  const trendingItems = useMemo(
    () => [
      { id: 1, url: '#', title: 'iPhone 17 review: Skip the Pro get this instead', excerpt: 'hello' },
      { id: 2, url: '#', title: 'Vivo Pad 5e launched with Snapdragon 8s Gen 3 and a 144Hz display', excerpt: 'hello' },
      { id: 3, url: '#', title: 'Honor X7d with Snapdragon 685 chip lands in Nepal at a ridiculous price', excerpt: 'hello' },
    ],
    []
  );

  const [trandingblog, settrandingblog] = useState(null);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isSlidingIn, setIsSlidingIn] = useState(true);

  useEffect(() => {
    if (trendingItems.length === 0) return;

    const interval = setInterval(() => {
      setIsSlidingIn(false);
      setTimeout(() => {
        setCurrentTextIndex((prev) => (prev + 1) % trendingItems.length);
        setIsSlidingIn(true);
      }, 800);
    }, 5000);

    return () => clearInterval(interval);
  }, [trendingItems]);

  useEffect(() => {
    const fetchblog = async () => {
      try {
        const response = await RemoteServices.BlogsAll();
        settrandingblog(response);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };
    fetchblog();
  }, []);

  const { topItems, remainingItems } = useMemo(() => {
    const data = trandingblog?.data || [];
    return {
      topItems: data.slice(0, 3),
      remainingItems: data.slice(3, 5),
    };
  }, [trandingblog]);
  const socialIcons = [
    { Icon: Facebook, url: '#', color: 'hover:text-blue-600', followers: '10K' },
    { Icon: Twitter, url: '#', color: 'hover:text-sky-500', followers: '8K' },
    { Icon: Instagram, url: '#', color: 'hover:text-pink-600', followers: '15K' },
    { Icon: Youtube, url: '#', color: 'hover:text-red-600', followers: '20K' },
    { Icon: Linkedin, url: '#', color: 'hover:text-blue-700', followers: '5K' },
  ];

  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  if (trandingblog === null) {
    return <div className="text-center py-8 text-gray-600 text-sm">No news available</div>;
  }

  return (
    <div className="bg-gradient-to-b max-w-7xl mx-auto from-white px-2 to-blue-50 min-h-screen">
      <Bannertop />
      <div className="w-full mx-auto">
        <div className="border-none shadow-none m-0 p-0 overflow-hidden">
          <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 h-full bg-gradient-to-r from-blue-50 to-blue-50">
            <h2 className="text-xl font-bold text-[var(--colour-fsP2)] font-serif heading-title relative inline-block px-4 mb-2">
              Trending Articles
            </h2>
            <div className="flex-1 overflow-hidden">
              {trendingItems.length > 0 ? (
                <div
                  className={`w-full truncate transition-all duration-500 ease-in-out ${isSlidingIn
                    ? 'transform translate-x-0 opacity-100'
                    : 'transform -translate-x-full opacity-0'
                    }`}
                  key={currentTextIndex}
                >
                  <a
                    href={trendingItems[currentTextIndex].url}
                    className="text-sm sm:text-base font-medium text-gray-600 hover:text-gray-700 transition-colors duration-150 truncate"
                  >
                    {trendingItems[currentTextIndex].title}
                  </a>
                </div>
              ) : (
                <p className="text-sm text-gray-600">No trending news available.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* img with content */}
      <div className='grid grid-cols-5 gap-4'>
        <div ref={ref} className=" col-span-4">
          {inView ? (
            <div className="space-y-4">
              {/* Top 3 Grid - 3 columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {topItems.map((item) => (
                  <div
                    key={item.id}
                    className="overflow-hidden border-none cursor-pointer border-[var(--colour-fsP2)]/50 rounded-xl shadow-sm hover:shadow-md hover:bg-[var(--colour-fsP1)]/10 transition-all duration-150"
                  >
                    <div className="relative overflow-hidden">
                      <div className="relative overflow-hidden h-56">
                        <Image
                          src={item.image || imglist.urlimg2}
                          alt={item.title}
                          className="w-full h-full object-fill transition-transform duration-500 group-hover:scale-105"
                          fill
                          quality={100}
                        />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-yellow-50 to-transparent  via-white px-3 py-3">
                        <h3 className="text-base font-semibold text-[var(--colour-fsP2)]/60 line-clamp-2">
                          <a
                            href={`/news/${item.slug}`}
                            className="hover:text-black/70 transition-colors duration-150"
                          >
                            {item.title}
                          </a>
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom 2 Grid - 2 columns */}
              {remainingItems.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {remainingItems.map((item) => (
                    <div
                      key={item.id}
                      className="overflow-hidden border-none cursor-pointer  border-[var(--colour-fsP2)]/50 rounded-xl shadow-sm hover:shadow-md hover:bg-[var(--colour-fsP1)]/10 transition-all duration-150"
                    >
                      <div className="relative h-48 sm:h-56 overflow-hidden">
                        <Image
                          src={item.image || imglist.urlimg2}
                          alt={item.title}
                          fill
                          loading="lazy"
                          className="w-full h-full object-fill transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-yellow-50 to-transparent  via-white px-3 py-3">
                          <h3 className="text-base font-semibold text-[var(--colour-fsP2)]/60 line-clamp-2">
                            <a
                              href={`/news/${item.slug}`}
                              className="hover:text-black/70 transition-colors duration-150"
                            >
                              {item.title}
                            </a>
                          </h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Top 3 Grid Placeholder */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array.from({ length: Math.min(topItems.length || 3, 3) }).map((_, index) => (
                  <div
                    key={index}
                    className="overflow-hidden border border-[var(--colour-fsP2)]/20 rounded-xl shadow-sm bg-gray-200 animate-pulse"
                  >
                    <div className="relative h-56" />
                  </div>
                ))}
              </div>
              {/* Bottom 2 Grid Placeholder */}
              {remainingItems.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: Math.min(remainingItems.length, 2) }).map((_, index) => (
                    <div
                      key={index}
                      className="overflow-hidden border border-[var(--colour-fsP2)]/20 rounded-xl shadow-sm bg-gray-200 animate-pulse"
                    >
                      <div className="relative h-48 sm:h-56" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="col-span-1">
          <div className="flex flex-col items-start bg-[var(--colour-fsP2)]/10 rounded-xl p-4">
            <h4 className="text-[var(--colour-fsP2)] font-semibold text-lg mb-3 text-center lg:text-left">
              Follow Us
            </h4>
            <div className="flex flex-row gap-4 justify-between w-full">
              {socialIcons.map(({ Icon, url, color, followers }, index) => (
                <a
                  key={index}
                  href={url}
                  className={`flex flex-col items-center  text-gray-600 ${color} transition-all duration-300 hover:-translate-y-1 hover:scale-105`}
                >
                  {/* <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-xl">
                    <Icon className="w-4 h-4" />
                  </div> */}
                  <Icon className="w-5 h-5" />
                  <span className="text-xs text-gray-600 mt-1">{followers}</span>
                </a>
              ))}
            </div>
            <button
              onClick={() => console.log('Compare clicked')}
              className="mt-4 bg-[var(--colour-fsP2)] text-white rounded-full px-4 py-2 flex items-center gap-2 hover:bg-[var(--colour-fsP1)]/80 transition-all duration-150 focus:ring-1 focus:ring-[var(--colour-fsP1)] w-full justify-center"
              aria-label="Compare items"
            >
              <Scale className="w-4 h-4" />
              Compare Product
            </button>

            <div>
              
            </div>
          </div>
         
        </div>
      </div>
    </div>
  );
}

export default BlogHeaderPage;