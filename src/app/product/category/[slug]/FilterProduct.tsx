import React, { useState, useEffect } from 'react';
import { CategorySlug } from '@/app/types/CategoryTypes';
import { cn } from '@/lib/utils';
import MobileProductFilters from './MobileProductFilters';
import DesktopProductFilters from './DesktopProductFilter' // Fixed typo: 'DesktopProductFilter' -> 'DesktopProductFilters'
import { Cpu, Monitor, HardDrive, MemoryStick, PcCase, Banknote } from 'lucide-react';

// Custom hook for shared logic
const useProductFilters = (categoryslug) => {
  const [filters, setFilters] = useState({
    processorType: '',
    brand: '',
    laptopRamSize: '',
    screenSize: '',
    storageCapacity: '',
    priceRange: [0, 2000],
    laptops: true
  });

  const [sortBy, setSortBy] = useState('Recommended');
  const [currentPage, setCurrentPage] = useState(categoryslug.meta.current_page | 1);
  const [dropdownOpen, setDropdownOpen] = useState({
    processorType: false,
    brand: false,
    laptopRamSize: false,
    screenSize: false,
    storageCapacity: false,
    priceRange: false,
    sort: false
  });

  const filterConfigs = [
    {
      name: 'processorType',
      label: 'Processor',
      options: ['Core i5', 'Core i7', 'Core i9', 'Ryzen 5', 'Ryzen 7'],
      icon: Cpu
    },
    {
      name: 'brand',
      label: 'Brand',
      options: ['HP', 'Dell', 'Apple', 'Lenovo', 'ASUS', 'Acer'],
      icon: PcCase
    },
    {
      name: 'laptopRamSize',
      label: 'RAM',
      options: ['8GB', '16GB', '32GB', '64GB'],
      icon: MemoryStick
    },
    {
      name: 'screenSize',
      label: 'Screen Size',
      options: ['13"', '14"', '15"', '16"', '17"'],
      icon: Monitor
    },
    {
      name: 'storageCapacity',
      label: 'Storage',
      options: ['256GB', '512GB', '1TB', '2TB'],
      icon: HardDrive
    },
    {
      name: 'priceRange',
      label: 'Price Range',
      options: [
        { label: 'All ($0 - $2000)', value: [0, 2000] },
        { label: '$0 - $500', value: [0, 500] },
        { label: '$500 - $1000', value: [500, 1000] },
        { label: '$1000 - $1500', value: [1000, 1500] },
        { label: '$1500 - $2000', value: [1500, 2000] }
      ],
      isPrice: true,
      icon: Banknote
    },
    {
      name: 'sort',
      label: 'Sort By',
      options: ['Recommended', 'Price: High to Low', 'Price: Low to High', 'New Arrivals', 'Best Rated'],
      alignRight: true
    }
  ];

  const toggleDropdown = (filterName) => {
    setDropdownOpen(prev => ({
      processorType: filterName === 'processorType' ? !prev.processorType : false,
      brand: filterName === 'brand' ? !prev.brand : false,
      laptopRamSize: filterName === 'laptopRamSize' ? !prev.laptopRamSize : false,
      screenSize: filterName === 'screenSize' ? !prev.screenSize : false,
      storageCapacity: filterName === 'storageCapacity' ? !prev.storageCapacity : false,
      priceRange: filterName === 'priceRange' ? !prev.priceRange : false,
      sort: filterName === 'sort' ? !prev.sort : false
    }));
  };

  const selectFilter = (filterType, value, e) => {
    e.stopPropagation();
    if (filterType === 'sort') {
      setSortBy(value);
    } else if (filterType === 'priceRange') {
      setFilters(prev => ({ ...prev, priceRange: value }));
    } else {
      setFilters(prev => ({ ...prev, [filterType]: value }));
    }
    toggleDropdown(filterType);
  };

  const getPriceLabel = (range) => {
    const option = filterConfigs
      .find(config => config.name === 'priceRange')
      .options.find(o => typeof o !== 'string' && o.value && o.value[0] === range[0] && o.value[1] === range[1]);
    return option ? option.label : `$${range[0]} - $${range[1]}`;
  };

  return { filters, sortBy, currentPage, setCurrentPage, dropdownOpen, filterConfigs, toggleDropdown, selectFilter, getPriceLabel };
};

const ProductFilters = ({ categoryslug }) => {
  console.log('data', categoryslug);
  const { filters, sortBy, currentPage, setCurrentPage, dropdownOpen, filterConfigs, toggleDropdown, selectFilter, getPriceLabel } = useProductFilters(categoryslug);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (categoryslug === null) {
    return <p className="text-center text-gray-500 text-lg font-medium">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans ">
      {isMobile ? (
        <MobileProductFilters
          categoryslug={categoryslug}
          filters={filters}
          sortBy={sortBy}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          dropdownOpen={dropdownOpen}
          filterConfigs={filterConfigs}
          toggleDropdown={toggleDropdown}
          selectFilter={selectFilter}
          getPriceLabel={getPriceLabel}
        />
      ) : (
        <DesktopProductFilters
          categoryslug={categoryslug}
          filters={filters}
          sortBy={sortBy}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          dropdownOpen={dropdownOpen}
          filterConfigs={filterConfigs}
          toggleDropdown={toggleDropdown}
          selectFilter={selectFilter}
          getPriceLabel={getPriceLabel}
        />
      )}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProductFilters;