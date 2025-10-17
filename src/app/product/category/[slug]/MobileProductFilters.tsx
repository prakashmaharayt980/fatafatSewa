import React from 'react';
import { ChevronDown, X, Filter } from 'lucide-react';
import ProductCard from '../../ProductCard';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const MobileProductFilters = ({ categoryslug, filters, sortBy, currentPage, setCurrentPage, dropdownOpen, filterConfigs, toggleDropdown, selectFilter, getPriceLabel }) => {
  const totalPages = categoryslug.meta.total;

  const generatePaginationItems = () => {
    const items = [];
    const showPages = 1;
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    const endPage = Math.min(totalPages, startPage + showPages - 1);

    if (endPage - startPage < showPages - 1) {
      startPage = Math.max(1, endPage - showPages + 1);
    }

    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <PaginationItem key={page}>
          <PaginationLink
            href="#"
            isActive={currentPage === page}
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage(page);
            }}
            className={cn(
              'rounded-lg flex items-center justify-center font-medium transition-all duration-300 w-6 h-6 text-[0.6rem] hover:bg-blue-200 hover:shadow-md sm:w-7 sm:h-7 sm:text-[0.7rem]',
              currentPage === page
                ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 border-blue-200'
                : 'bg-white text-gray-700 hover:text-blue-600 border border-blue-100'
            )}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="p-1.5 sm:p-2">
      <div className="">
        {/* Mobile Filter Drawer */}
        <div className=" items-center hidden justify-start mb-3">
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex items-center gap-1 px-1.5 py-1 min-h-[2rem] bg-white border border-blue-100 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-sm transition-all duration-300 hover:scale-105 sm:px-2 sm:py-1.5">
                <Filter size={14} className="text-blue-500 sm:size-16" />
                <span className="text-[0.6rem] font-medium leading-tight truncate sm:text-[0.7rem]">Filters</span>
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className=" px-2 pb-[calc(0.75rem+env(safe-area-inset-bottom))] bg-white border-l border-blue-100 overflow-y-auto overscroll-contain scrollbar-hide sm:px-3"
            >
              <SheetHeader className="flex flex-row items-center justify-between mb-2 sm:mb-3">
                <SheetTitle className="text-sm font-semibold text-gray-800 truncate sm:text-base">Filters</SheetTitle>
        
              </SheetHeader>
              <div className="space-y-1.5 sm:space-y-2">
                {filterConfigs.map(config => (
                  <div key={config.name} className="w-full">
                    <button
                      onClick={() => toggleDropdown(config.name)}
                      className="flex items-center gap-1.5 px-1.5 py-0.75 min-h-[2rem] bg-white border border-blue-100 rounded-lg text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all duration-300 w-full justify-between text-[0.6rem] font-semibold leading-tight shadow-sm hover:scale-105 sm:px-2 sm:py-1 sm:text-[0.7rem]"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        {config.icon && <config.icon size={10} className="text-blue-500 hover:text-blue-600 sm:size-12" />}
                        <span className="truncate">
                          {config.name === 'sort'
                            ? `Sort By: ${sortBy}`
                            : config.name === 'priceRange'
                              ? getPriceLabel(filters.priceRange)
                              : filters[config.name] || config.label}
                        </span>
                      </div>
                      <ChevronDown
                        size={10}
                        className={cn('transition-transform duration-300 shrink-0', dropdownOpen[config.name] ? 'rotate-180' : '', 'sm:size-12')}
                      />
                    </button>
                    {dropdownOpen[config.name] && (
                      <ul className="mt-1 w-full bg-white border border-blue-100 rounded-lg shadow-sm animate-fade-in">
                        {config.options.map(option => (
                          <li
                            key={typeof option === 'string' ? option : option.label}
                            onClick={(e) => selectFilter(config.name, config.isPrice ? option.value : option, e)}
                            className={cn(
                              'px-1.5 py-1.5 text-[0.6rem] text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-all duration-300 truncate sm:px-2 sm:text-[0.7rem]',
                              {
                                'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600':
                                  config.name === 'sort'
                                    ? sortBy === option
                                    : config.name === 'priceRange'
                                      ? filters.priceRange[0] === option.value?.[0] &&
                                        filters.priceRange[1] === option.value?.[1]
                                      : filters[config.name] === option
                              }
                            )}
                          >
                            {typeof option === 'string' ? option : option.label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-1 w-full sm:gap-1.5">
          {categoryslug.data &&
            categoryslug.data.map((product, index) => (
              <div
                key={`${product.slug}-${index}`}
                className={cn('flex-shrink-0 transition-all duration-300 hover:scale-105 max-w-[calc(50vw-0.75rem)]')}
              >
                <ProductCard product={product} index={index} />
              </div>
            ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-3 pt-3 border-t-2 border-blue-100 sm:mt-4 sm:pt-4">
            <Pagination>
              <PaginationContent className="flex-wrap justify-center gap-0.5 sm:gap-1">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(prev => Math.max(prev - 1, 1));
                    }}
                    className={cn(
                      'rounded-lg font-medium transition-all duration-300 px-1.5 py-0.75 text-[0.6rem] hover:bg-blue-200 hover:shadow-md sm:px-2 sm:py-1 sm:text-[0.7rem]',
                      currentPage === 1
                        ? 'pointer-events-none opacity-50 bg-gray-100 text-gray-500'
                        : 'bg-white text-blue-600 hover:text-blue-700 border border-blue-100'
                    )}
                  >
                    ← Prev
                  </PaginationPrevious>
                </PaginationItem>
                {generatePaginationItems()}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(prev => Math.min(prev + 1, totalPages));
                    }}
                    className={cn(
                      'rounded-lg font-medium transition-all duration-300 px-1.5 py-0.75 text-[0.6rem] hover:bg-blue-200 hover:shadow-md sm:px-2 sm:py-1 sm:text-[0.7rem]',
                      currentPage === totalPages
                        ? 'pointer-events-none opacity-50 bg-gray-100 text-gray-500'
                        : 'bg-white text-blue-600 hover:text-blue-700 border border-blue-100'
                    )}
                  >
                    Next →
                  </PaginationNext>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default MobileProductFilters;