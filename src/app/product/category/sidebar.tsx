'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronRight, ChevronDown } from 'lucide-react';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

import imglogo from '@/app/assets/logoimg.png';
import { cn } from '@/lib/utils';
import { HomePageData } from '@/app/api/ContextStore';

interface CategorySideDrawerProps {
  categories: HomePageData['categories'];
  showCategoryDrawer: boolean;
  toggleCategoryDrawer: () => void;
}

const CategorySideDrawer = ({
  categories,
  showCategoryDrawer,
  toggleCategoryDrawer,
}: CategorySideDrawerProps) => {
  const router = useRouter();
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [openCategory, setOpenCategory] = useState<number | null>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const categoryRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number; height: number } | null>(null);

  const handleHoverEnter = (id: number) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setHoveredCategory(id);
 
  };

  const handleHoverLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setHoveredCategory(null);

    }, 120);
  };

  const handleClickCategory = (id: number, slug: string, hasChildren: boolean, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent backdrop click from closing sidebar
    if (hasChildren) {
      setOpenCategory(openCategory === id ? null : id);
     
    } else {
      router.push(`/category/${slug}`);
      toggleCategoryDrawer();
    }
  };

  const navigateToCategory = (slug: string) => {
    router.push(`/category/${slug}`);
    toggleCategoryDrawer();
  };

  const handleSidebarMouseLeave = (event: React.MouseEvent) => {
    if (window.innerWidth < 768) return; // Skip for mobile
    const sidebarEl = sidebarRef.current;
    if (!sidebarEl || !dropdownPosition) return;

    const sidebarRect = sidebarEl.getBoundingClientRect();
    const totalWidth = sidebarRect.width + 280; // Sidebar + dropdown width
    const mouseX = event.clientX;

    if (mouseX > sidebarRect.left + totalWidth) {
      toggleCategoryDrawer();
      
    }
  };

  useEffect(() => {
    const handlePageMouseLeave = (event: MouseEvent) => {
      if (window.innerWidth < 768) return; 
      if (event.clientY <= 0) {
        toggleCategoryDrawer();

      }
    };

    document.addEventListener('mouseleave', handlePageMouseLeave);
    return () => document.removeEventListener('mouseleave', handlePageMouseLeave);
  }, [toggleCategoryDrawer]);

  useEffect(() => {
 
    if (hoveredCategory !== null) {
      const categoryEl = categoryRefs.current.get(hoveredCategory);
      if (categoryEl) {
        const rect = categoryEl.getBoundingClientRect();
        const drawerWidth = window.innerWidth < 640 ? window.innerWidth : 288; // sm:w-72 = 288px
        const leftPosition = rect.right < drawerWidth ? rect.right + 10 : drawerWidth - 280 - 10; // 280px = dropdown width
        setDropdownPosition({
          top: 10, // Fixed top as requested
          left: leftPosition,
          height: rect.height,
        });
        console.log(`Dropdown position for category ${hoveredCategory}:`, { top: 10, left: leftPosition, height: rect.height }); // Debug
      }
    } else {
      setDropdownPosition(null);
    }
  }, [hoveredCategory]);

  return (
    <>
      {showCategoryDrawer && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={toggleCategoryDrawer}
        />
      )}

      <div
        ref={sidebarRef}
        className={cn(
          'fixed top-0 left-0 h-full w-screen sm:w-72 z-50 bg-[var(--colour-bg4)] border-r border-gray-200 rounded-2xl ',
          'transform transition-all duration-300 ease-in-out',
          showCategoryDrawer ? 'translate-x-0' : '-translate-x-full'
        )}
        onMouseLeave={handleSidebarMouseLeave}
      >
        {/* Header */}
        <div className="sticky top-0 flex justify-center items-center p-2 m-1 rounded-3xl border border-gray-200 bg-white z-[60]">
          <div className="flex items-center gap-3">
            <Image
              src={imglogo}
              alt="Fatafatsewa Logo"
              width={120}
              height={120}
              priority
              className="rounded-lg"
            />
 
          </div>
        </div>

        {/* Categories and Children */}
        <ScrollArea
          className={cn(
            'h-[calc(100vh-80px)] w-full scroll-smooth',
            '[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-500'
          )}
        >
          <div className="p-4 space-y-2">
            {categories.length === 0 ? (
              <p className="text-sm text-gray-500">No categories available</p>
            ) : (
              categories.map((cat) => {
                const hasChildren = cat.children?.length > 0;
                const imageSrc = cat.image?.default || cat.image?.thumbnail || imglogo;
                const isHovered = hoveredCategory === cat.id;
                const isOpen = openCategory === cat.id;

                return (
                  <div
                    key={cat.id}
                    className="relative group overflow-visible"
                    ref={(el) => {
                      if (el) categoryRefs.current.set(cat.id, el);
                      else categoryRefs.current.delete(cat.id);
                    }}
                    onMouseEnter={() => handleHoverEnter(cat.id)}
                    onMouseLeave={handleHoverLeave}
                  >
                    <div
                      className={cn(
                        'w-full p-3 rounded-lg transition ',
                        'md:hover:bg-white',
                        isHovered && dropdownPosition ? 'bg-white' : ''
                      )}
                      onClick={(e) => handleClickCategory(cat.id, cat.slug, hasChildren, e)}
                    >
                      <div className="flex items-center">
                        <Image
                          src={imageSrc}
                          alt={cat.title}
                          width={32}
                          height={32}
                          className="rounded-md object-cover mr-3"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800 truncate">{cat.title}</p>
                          {hasChildren && (
                            <p className="text-xs text-gray-500">{cat.children.length} subcategories</p>
                          )}
                        </div>
                        {hasChildren && (
                          <>
                            <ChevronDown
                              className={cn(
                                'w-5 h-5 text-gray-500 transition-transform duration-200',
                                isOpen && 'rotate-180',
                                'md:hidden'
                              )}
                            />
                            <ChevronRight
                              className={cn(
                                'w-5 h-5 text-gray-500 hidden md:block',
                                isHovered && 'translate-x-1'
                              )}
                            />
                          </>
                        )}
                      </div>
                    </div>

                    {hasChildren && isOpen && (
                      <div className="relative w-full bg-white md:hidden">
                        {cat.children.length === 0 ? (
                          <p className="pl-10 pr-4 py-2 text-sm text-gray-500">No subcategories</p>
                        ) : (
                          <div className="pl-10 pr-4 py-2">
                            {cat.children.map((child) => (
                              <div
                                key={child.id}
                                onClick={() => navigateToCategory(child.slug)}
                                className="flex items-center gap-3 py-2 hover:bg-gray-50 cursor-pointer transition text-sm text-gray-700"
                              >
                                <Image
                                  src={child.image?.default || imglogo}
                                  alt={child.title}
                                  width={28}
                                  height={28}
                                  className="rounded-md object-cover"
                                />
                                <span className="truncate">{child.title}</span>
                              </div>
                            ))}
                            <div className="pt-2">
                              <button
                                onClick={() => navigateToCategory(cat.slug)}
                                className="text-gray-600 hover:text-gray-800 text-sm font-medium transition flex items-center gap-1"
                              >
                                All in {cat.title}
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {hasChildren && isHovered && dropdownPosition && (
                      <div
                        className="fixed w-[280px]  bg-[var(--colour-bg4)] border rounded-2xl border-gray-200 z-[70] transition-opacity duration-200 md:block hidden"
                        style={{
                          top: `50px`,
                          left: `${dropdownPosition.left}px`,
                          minHeight: `${dropdownPosition.height}px`,
                        }}
                      >
                        <div className="px-4 py-3 border m-2 rounded-2xl bg-white  border-gray-300 text-sm font-semibold text-gray-800">
                          {cat.title}
                        </div>
                        {cat.children.length === 0 ? (
                          <p className="px-4 py-2 text-sm text-gray-500">No subcategories</p>
                        ) : (
                          <ScrollArea
                            className={cn(
                              ' scroll-smooth ',
                              '[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-500',
                              cat.children.length >=7 ? 'h-[calc(100vh-200px)] ':'h-fit'
                            )}
                          >
                            <div className="px-4 py-2">
                              {cat.children.map((child) => (
                                <div
                                  key={child.id}
                                  onClick={() => navigateToCategory(child.slug)}
                                  className="flex items-center gap-3 py-2 hover:bg-gray-100 cursor-pointer transition text-sm text-gray-700"
                                >
                                  <Image
                                    src={child.image?.default || imglogo}
                                    alt={child.title}
                                    width={28}
                                    height={28}
                                    className="rounded-md object-cover"
                                  />
                                  <span className="truncate">{child.title}</span>
                                </div>
                              ))}
                              <div className="pt-2">
                                <button
                                  onClick={() => navigateToCategory(cat.slug)}
                                  className="text-gray-600 hover:text-gray-800 text-sm font-medium transition flex items-center gap-1"
                                >
                                  All in {cat.title}
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </ScrollArea>
                        )}
                      </div>
                    )}
                    <Separator className="my-2 last:hidden bg-gray-200" />
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );
};

export default CategorySideDrawer;