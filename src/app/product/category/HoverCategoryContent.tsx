'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { ScrollArea } from '@/components/ui/scroll-area';

interface HoverCategoryContentProps {
  isSidebarOpen: boolean;
  selectedCategory: {
    label: string;
    image: string;
    subcategories: {
      label: string;
      href: string;
    }[];
  } | null;
}

export default function HoverCategoryContent({
  isSidebarOpen,
  selectedCategory,
}: HoverCategoryContentProps) {
  if (!isSidebarOpen || !selectedCategory) return null;

  return (
    <div className="absolute left-full top-0 z-50 flex h-full w-[360px] bg-white shadow-lg transition-all duration-200 ease-in-out">
      {/* Image Container */}
      <div className="relative w-[150px] shrink-0 border-r border-gray-200">
        <Image
          src={selectedCategory.image}
          alt={selectedCategory.label}
          layout="fill"
          objectFit="cover"
        />
      </div>

      {/* Subcategories */}
      <ScrollArea className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {selectedCategory.subcategories.map((sub, index) => (
            <Link
              key={index}
              href={sub.href}
              className="group flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <span>{sub.label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
