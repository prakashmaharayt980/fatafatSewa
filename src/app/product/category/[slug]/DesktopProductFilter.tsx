import React from 'react';
import { ChevronDown } from 'lucide-react';
import ProductCard from '../../ProductCard';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const DesktopProductFilters = ({ categoryslug, filters, sortBy, currentPage, setCurrentPage, dropdownOpen, filterConfigs, toggleDropdown, selectFilter, getPriceLabel }) => {
  const totalPages = categoryslug.meta.total;

  const generatePaginationItems = () => {
    const items = [];
    const showPages = 3;
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    const endPage = Math.min(totalPages, startPage + showPages - 1);

    if (endPage - startPage < showPages - 1) {
      startPage = Math.max(1, endPage - showPages + 1);
    }

    if (startPage > 1) {
      items.push(
        <PaginationItem key="start-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>
      );
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
              'rounded-full w-10 h-10 flex items-center justify-center text-sm font-medium transition-all duration-300',
              currentPage === page
                ? 'bg-blue-100 text-blue-600 border-blue-200'
                : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-blue-100'
            )}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      items.push(
        <PaginationItem key="end-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto px-4">
        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-3 mb-4 pb-3 border-b border-blue-100 pt-6">
          {filterConfigs.map(config => (
            <div key={config.name} className={cn('relative', config.alignRight && 'ml-auto')}>
              <DropdownMenu
                open={dropdownOpen[config.name]}
                onOpenChange={() => toggleDropdown(config.name)}
              >
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-blue-100 rounded-lg text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all duration-300 min-w-[120px] truncate"
                  >
                    {config.icon && <config.icon size={16} className="text-blue-500" />}
                    <span className="text-sm font-medium truncate">
                      {config.name === 'sort'
                        ? `Sort By: ${sortBy}`
                        : config.name === 'priceRange'
                          ? getPriceLabel(filters.priceRange)
                          : filters[config.name] || config.label}
                    </span>
                    <ChevronDown
                      size={16}
                      className={cn('transition-transform duration-300 shrink-0', dropdownOpen[config.name] ? 'rotate-180' : '')}
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48 bg-white border border-blue-100 rounded-lg shadow-sm"
                  align={config.alignRight ? 'end' : 'start'}
                  side="bottom"
                >
                  {config.options.map(option => (
                    <DropdownMenuItem
                      key={typeof option === 'string' ? option : option.label}
                      onClick={(e) => selectFilter(config.name, config.isPrice ? option.value : option, e)}
                      className={cn(
                        'text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600 px-3 py-1.5 truncate',
                        {
                          'bg-blue-50 text-blue-600':
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
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
          {categoryslug.data &&
            categoryslug.data.map((product, index) => (
              <div key={`${product.slug}-${index}`} className={cn('flex-shrink-0')}>
                <ProductCard product={product} index={index} />
              </div>
            ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-10 pt-8 border-t-2 border-blue-100">
            <Pagination>
              <PaginationContent className="flex-wrap justify-center">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(prev => Math.max(prev - 1, 1));
                    }}
                    className={cn(
                      'rounded-full px-4 py-2 text-sm font-medium transition-all duration-300',
                      currentPage === 1
                        ? 'pointer-events-none opacity-50 bg-gray-100 text-gray-500'
                        : 'bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 border border-blue-100'
                    )}
                  >
                    ← Previous
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
                      'rounded-full px-4 py-2 text-sm font-medium transition-all duration-300',
                      currentPage === totalPages
                        ? 'pointer-events-none opacity-50 bg-gray-100 text-gray-500'
                        : 'bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 border border-blue-100'
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
    </div>
  );
};

export default DesktopProductFilters;