'use client';

import React from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils'; // Assuming cn is a utility like clsx or cva

import img1 from '../../../public/imgfile/banner1.jpeg'
import img2 from '../../../public/imgfile/banner2.jpeg'

const TwoImageBanner = () => {
  

  return (
    <div className={cn(
      'w-full flex flex-col sm:flex-row gap-4 sm:gap-2 px-4 sm:px-6 py-4'
    )}>
      {/* Image 1 */}
      <div
        className={cn(
          'w-full sm:w-1/2 relative overflow-hidden rounded-lg group cursor-pointer',
          'transition-all duration-300 hover:shadow-lg'
        )}
        // onClick={() => router.push(image1Link)}
      >
        <Image
          src={img1}
            alt={'img 2'}
          width={600}
          height={300}
          className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
          priority
        />
      </div>

      {/* Image 2 */}
      <div
        className={cn(
          'w-full sm:w-1/2 relative overflow-hidden rounded-lg group cursor-pointer',
          'transition-all duration-300 hover:shadow-lg'
        )}
        // onClick={() => router.push(image2Link)}
      >
        <Image
      src={img2}
          alt={'img 2'}
          width={600}
          height={300}
          className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
          priority
        />
      </div>

      <style jsx>{`
        .group:hover .image {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default TwoImageBanner;