'use client';

import React from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils'; // Assuming cn is a utility like clsx or cva

import img1 from '../../../public/imgfile/ASUS-AD-JULY.webp'


const TopBanner = () => {
  

  return (
    <div className={cn(
      'w-full flex flex-col max-h-40 sm:flex-row gap-4 sm:gap-2  py-2'
    )}>
      {/* Image 1 */}
      <div
        className={cn(
          'w-full  relative overflow-hidden rounded-lg  cursor-pointer',
          'transition-all duration-300 '
        )}
        // onClick={() => router.push(image1Link)}
      >
        <Image
          src={img1}
            alt={'img 2'}
          width={400}
          height={200}
          className="w-full h-auto object-cover transition-transform duration-300"
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

export default TopBanner;