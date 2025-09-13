import React, { useState } from 'react';
import { ChevronDown, X, Heart, Cpu } from 'lucide-react';
import { CategorySlug } from '@/app/types/CategoryTypes';
import ProductCard from '../../ProductCard';
import { cn } from '@/lib/utils';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const ProductFilters = ({ categoryslug }) => {
  console.log('data', categoryslug)
  const [filters, setFilters] = useState({
    processorType: '',
    brand: '',
    laptopRamSize: '',
    laptops: true
  });

  const [sortBy, setSortBy] = useState('Recommended');
  const [currentPage, setCurrentPage] = useState(categoryslug.meta.current_page | 1);
  const [dropdownOpen, setDropdownOpen] = useState({
    processorType: false,
    brand: false,
    laptopRamSize: false,
    sort: false
  });

  const sortOptions = [
    'Recommended',
    'Price: High to Low',
    'Price: Low to High',
    'New Arrivals',
    'Best Rated'
  ];

  const processorTypes = ['Core i5', 'Core i7', 'Core i9', 'Ryzen 5', 'Ryzen 7'];
  const brands = ['HP', 'Dell', 'Apple', 'Lenovo', 'ASUS', 'Acer'];
  const ramSizes = ['8GB', '16GB', '32GB', '64GB'];

  const toggleDropdown = (filterName) => {
    setDropdownOpen(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  const selectFilter = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setDropdownOpen(prev => ({ ...prev, [filterType]: false }));
  };

  const removeFilter = (filterType) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: filterType === 'laptops' ? false : ''
    }));
  };

 

  if (categoryslug === null) {
    <p>loading</p>
  }

  const totalPages =categoryslug.meta.total

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
            className={`border border-gray-300 transition-colors ${currentPage === page ? 'bg-[var(--colour-fsP2)] text-white' : 'text-black hover:bg-gray-100'}`}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      items.push(
        <PaginationItem key="end-ellipsis" >
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    return items;
  };
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6">


          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-3 mb-4 border-t border-gray-300 pt-4">

            {/* Processor Type Filter */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('processorType')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:border-blue-300 hover:bg-blue-50/30 transition-colors"
              >
                <Cpu size={16} className="text-blue-500" />
                <span className="text-sm">Processor Type</span>
                <ChevronDown size={16} className={`transition-transform ${dropdownOpen.processorType ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen.processorType && (
                <div className="absolute top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {processorTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => selectFilter('processorType', type)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Brand Filter */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('brand')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:border-blue-300 hover:bg-blue-50/30 transition-colors"
              >
                <span className="text-sm">Brand</span>
                <ChevronDown size={16} className={`transition-transform ${dropdownOpen.brand ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen.brand && (
                <div className="absolute top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {brands.map(brand => (
                    <button
                      key={brand}
                      onClick={() => selectFilter('brand', brand)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Laptop Ram Size Filter */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('laptopRamSize')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:border-blue-300 hover:bg-blue-50/30 transition-colors"
              >
                <span className="text-sm">Laptop Ram Size</span>
                <ChevronDown size={16} className={`transition-transform ${dropdownOpen.laptopRamSize ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen.laptopRamSize && (
                <div className="absolute top-full mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {ramSizes.map(size => (
                    <button
                      key={size}
                      onClick={() => selectFilter('laptopRamSize', size)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort By */}
            <div className="relative ml-auto">
              <button
                onClick={() => toggleDropdown('sort')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:border-gray-300 transition-colors"
              >
                <span className="text-sm">Sort By: {sortBy}</span>
                <ChevronDown size={16} className={`transition-transform ${dropdownOpen.sort ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen.sort && (
                <div className="absolute top-full mt-1 right-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {sortOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => {
                        setSortBy(option);
                        setDropdownOpen(prev => ({ ...prev, sort: false }));
                      }}
                      className={`w-full text-left px-4 py-2 text-sm first:rounded-t-lg last:rounded-b-lg transition-colors ${sortBy === option
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {filters.processorType && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100/60 text-blue-700 rounded-full text-sm border border-blue-200/50">
                Processor Type: {filters.processorType}
                <button
                  onClick={() => removeFilter('processorType')}
                  className="hover:bg-blue-200/50 rounded-full p-0.5"
                >
                  <X size={14} />
                </button>
              </span>
            )}

            {filters.brand && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100/60 text-yellow-700 rounded-full text-sm border border-yellow-200/50">
                Brand: {filters.brand}
                <button
                  onClick={() => removeFilter('brand')}
                  className="hover:bg-yellow-200/50 rounded-full p-0.5"
                >
                  <X size={14} />
                </button>
              </span>
            )}

            {filters.laptopRamSize && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100/60 text-blue-700 rounded-full text-sm border border-blue-200/50">
                RAM: {filters.laptopRamSize}
                <button
                  onClick={() => removeFilter('laptopRamSize')}
                  className="hover:bg-blue-200/50 rounded-full p-0.5"
                >
                  <X size={14} />
                </button>
              </span>
            )}

            {filters.laptops && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm border border-gray-200">
                Laptops
                <button
                  onClick={() => removeFilter('laptops')}
                  className="hover:bg-gray-200 rounded-full p-0.5"
                >
                  <X size={14} />
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
          {categoryslug.data && categoryslug.data.map((product, index) => (
            <div
              key={`${product.slug}-${index}`}
              className={cn(
                'flex-shrink-0',


              )}
            >
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>

            {totalPages > 1 && (
              <div className="mt-8 pt-6 border-t-2 border-gray-300">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(prev => Math.max(prev - 1, 1));
                        }}
                        className={`border border-gray-300 transition-colors ${currentPage === totalPages ? 'pointer-events-none opacity-50' : 'text-[var(--colour-fsP1)] hover:text-[var(--colour-fsP2)]'}`}
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
                        className={`border border-gray-300 transition-colors ${currentPage === totalPages ? 'pointer-events-none opacity-50' : 'text-[var(--colour-fsP1)] hover:text-[var(--colour-fsP2)]'}`}
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

export default ProductFilters;