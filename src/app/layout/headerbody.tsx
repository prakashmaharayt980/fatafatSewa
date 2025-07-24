'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart, User, Heart, ChevronDown, BookOpen, CreditCard, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import RemoteServices from '@/app/api/remoteservice';
import HeaderSkeleton from './headerSkelton';
import imglogo from '../asscets/logoimg.png'; // Adjust the path as necessary
interface CategoryImage {
    id: number;
    name: string;
    default: string;
    original: string;
    preview: string;
    thumbnail: string;
    is_default: boolean;
}

interface CategoryProduct {
    id: number;
    title: string;
    slug: string;
    parent_id: number | null;
    status: number;
    featured: number;
    order: number;
    image: CategoryImage;
    children: CategoryProduct[];
    created_at?: string;
    updated_at?: string;
    parent_tree?: string;
}

interface SearchResult {
    id: number;
    name: string;
    slug: string;
    price: number;
    image: string;
    discounted_price?: number;
    brand:{
        name:string
    },
    categories:[
        {
        slug:string
        title:string
    }
    ]

}

const HeaderBody = () => {
    const [search, setSearch] = useState("");
    const [categories, setCategories] = useState<CategoryProduct[]>([]);
    const [cartCount] = useState(2);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [loading, setloading] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    useEffect(() => {
        setloading(true);
        RemoteServices.Categories().then((response) => {
            setCategories(response.data);
            console.log("Categories fetched:", response.data);
        }).catch((error) => {
            console.error("Error fetching categories:", error);
        }).finally(() => {
   setloading(false);
        });
    }, []);

    // Close search dropdown when clicking outside
    // useEffect(() => {
    //     const handleClickOutside = (event: MouseEvent) => {
    //         if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
    //             setShowSearchDropdown(false);
    //         }
    //     };

    //     document.addEventListener('mousedown', handleClickOutside);
    //     return () => {
    //         document.removeEventListener('mousedown', handleClickOutside);
    //     };
    // }, []);



    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);

        if (value.trim().length > 2) {
            setIsSearching(true);
            // Debounce search
            setTimeout(() => {
                RemoteServices.SerachProducts(value.trim()).then((response) => {
                    setSearchResults(response.data || []);
                    setShowSearchDropdown(true);
                    setIsSearching(false);
                }).catch((error) => {
                    console.error("Search error:", error);
                    setIsSearching(false);
                });
            }, 300);
        } else {
            setShowSearchDropdown(false);
        }
    };

    const handleProductClick = (id:SearchResult['id']) => {
      console.log('Clicking product:', id); 
       router.push(`/product/${id}`);
    };

  if(loading) return <HeaderSkeleton />;
    return (
        <>
            <style jsx>{`
                /* Custom scrollbar styles */
                .scrollbar-thin::-webkit-scrollbar {
                    width: 6px;
                }
                
                .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
                    background-color: #d1d5db;
                    border-radius: 3px;
                }
                
                .scrollbar-track-gray-100::-webkit-scrollbar-track {
                    background-color: #f3f4f6;
                    border-radius: 3px;
                }
                
                .hover\\:scrollbar-thumb-gray-400:hover::-webkit-scrollbar-thumb {
                    background-color: #9ca3af;
                }
                
                .scrollbar-none::-webkit-scrollbar {
                    display: none;
                }
                
                .scrollbar-none {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
            
            <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
                {/* Top Header */}
                <div className="container mx-auto px-4 py-2">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="relative">
                                <Image
                                    src={imglogo}
                                    alt="Fatafatsewa Logo"
                                    width={130}
                                    height={130}
                                    priority
                                    className="rounded-lg"
                                />
                            </div>
                        </Link>

                        {/* Search Bar - Reduced width */}
                        <div className="hidden md:flex items-center flex-1 max-w-lg mx-4" ref={searchRef}>
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                <Input
                                    type="text"
                                    placeholder="Search products..."
                                    value={search}
                                    onChange={handleSearchChange}
                                    // onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                                    className="w-full pl-10 pr-4 py-2 h-9 rounded-2xl border-gray-300 bg-gray-50 focus:border-black focus:ring-1 focus:ring-white"
                                />

                                {/* Search Dropdown */}
                                {showSearchDropdown && (
                                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-80 overflow-y-auto z-50">
                                        {isSearching ? (
                                            <div className="p-4 text-center text-gray-500">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div>
                                                <p className="mt-2">Searching...</p>
                                            </div>
                                        ) : searchResults.length > 0 ? (
                                            <>
                                                {searchResults.map((product) => 
                                                
                                                (
                                                    <div
                                                        role='button'
                                                        key={product.id}
                                                        onClick={() => handleProductClick(product.id)}
                                                        className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-2 border-gray-100 last:border-b-0"
                                                    >
                                                        {product.image && (
                                                            <div className="w-10 h-10 mr-3 bg-gray-200 rounded-md flex-shrink-0">
                                                                <Image
                                                                    src={product.image}
                                                                    alt={product.name}
                                                                    width={40}
                                                                    height={40}
                                                                    className="w-full h-full object-cover rounded-md   pointer-events-none"
                                                                />
                                                            </div>
                                                        )}
                                                        <div className="flex-1">
                                                          {product.name} in {product.categories[0].title} 
                                                          {product.discounted_price ===product.price ? (
                                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                                {product.price}
                                                            </p>
                                                          ):(
                                                        <span>{product.discounted_price} <span className=' underline'>{`( ${product.price})`}</span> </span>
                                                          )}
                                                        </div>
                                                    </div>
                                                )
                                                
                                                )}
                                            </>
                                        ) : (
                                            <div className="p-4 text-center text-gray-500">
                                                <p>No products found for &quot;{search}&quot;</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Icons */}
                        <div className="flex items-center space-x-1">
                            {/* Blog Button */}
                            <Link href="/blog" className="hidden md:block">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-9 px-3 text-gray-700 hover:bg-gray-100"
                                >
                                    <BookOpen className="h-4 w-4 text-blue-900" />
                                    <span className="ml-1 text-sm">Blog</span>
                                </Button>
                            </Link>

                            {/* EMI Button */}
                            <Link href="/emi" className="hidden md:block">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-9 px-3 text-gray-700 hover:bg-gray-100"
                                >
                                    <CreditCard className="h-4 w-4 text-blue-900" />
                                    <span className="ml-1 text-sm">EMI</span>
                                </Button>
                            </Link>

                            {/* Cart with price */}
                            <Link href="/cart">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="relative h-9 px-3 text-gray-700 hover:bg-gray-100"
                                >
                                    <ShoppingCart className="h-4 w-4 text-blue-900" />
                                    {cartCount > 0 && (
                                        <Badge
                                            variant="destructive"
                                            className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-xs flex items-center justify-center bg-red-500"
                                        >
                                            {cartCount}
                                        </Badge>
                                    )}
                                    <span className="ml-1 text-sm hidden sm:inline">$109.12</span>
                                </Button>
                            </Link>

                            {/* Account Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-9 px-3 text-gray-700 hover:bg-gray-100"
                                    >
                                        <User className="h-4 w-4 text-blue-900" />
                                        <span className="ml-1 text-sm hidden sm:inline">Account</span>
                                        <ChevronDown className="ml-1 h-3 w-3" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                    <DropdownMenuItem>
                                        <Link href="/profile" className="w-full">Profile</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link href="/orders" className="w-full">Orders</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link href="/settings" className="w-full">Settings</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link href="/logout" className="w-full">Logout</Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Wishlist */}
                            <Link href="/wishlist">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-9 w-9 p-0 text-gray-700 hover:bg-gray-100"
                                >
                                    <Heart className="h-4 w-4" />
                                </Button>
                            </Link>

                            {/* Mobile Menu Button */}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="md:hidden h-9 w-9 p-0 text-gray-700 hover:bg-gray-100"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Search Bar */}
                    <div className="md:hidden mt-3" ref={searchRef}>
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            <Input
                                type="text"
                                placeholder="Search products..."
                                value={search}
                                onChange={handleSearchChange}
                                // onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                                className="w-full pl-10 pr-4 py-2 h-9 rounded-2xl border-gray-300 bg-gray-50 focus:border-black focus:ring-1 focus:ring-white"
                            />

                            {/* Mobile Search Dropdown */}
                            {showSearchDropdown && (
                                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-80 overflow-y-auto z-50">
                                    {isSearching ? (
                                        <div className="p-4 text-center text-gray-500">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div>
                                            <p className="mt-2">Searching...</p>
                                        </div>
                                    ) : searchResults.length > 0 ? (
                                        <>
                                            {searchResults.map((product) => (
                                                <div
                                                    key={product.id}
                                                    onClick={() => handleProductClick(product.id)}
                                                    className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                                >
                                                    {/* {product.image && (
                                                        <div className="w-10 h-10 mr-3 bg-gray-200 rounded-md flex-shrink-0">
                                                            <Image
                                                                src={product.image}
                                                                alt={product.name}
                                                                width={40}
                                                                height={40}
                                                                className="w-full h-full object-cover rounded-md"
                                                            />
                                                        </div>
                                                    )} */}
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {product.name}
                                                        </p>
                                                        {product.price && (
                                                            <p className="text-sm text-orange-600 font-semibold">
                                                                ${product.price}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <div className="p-4 text-center text-gray-500">
                                               <p>No products found for &quot;{search}&quot;</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-200">
                        <div className="container mx-auto px-4 py-4">
                            <div className="flex flex-col space-y-2">
                                <Link href="/blog" className="flex items-center py-2 text-gray-700 hover:text-orange-600">
                                    <BookOpen className="h-4 w-4 mr-2" />
                                    Blog
                                </Link>
                                <Link href="/emi" className="flex items-center py-2 text-gray-700 hover:text-orange-600">
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    EMI
                                </Link>
                                <Link href="/profile" className="flex items-center py-2 text-gray-700 hover:text-orange-600">
                                    <User className="h-4 w-4 mr-2" />
                                    Profile
                                </Link>
                                <Link href="/orders" className="flex items-center py-2 text-gray-700 hover:text-orange-600">
                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                    Orders
                                </Link>
                                <Link href="/wishlist" className="flex items-center py-2 text-gray-700 hover:text-orange-600">
                                    <Heart className="h-4 w-4 mr-2" />
                                    Wishlist
                                </Link>

                                {/* Categories Section */}
                                {categories.length > 0 && (
                                    <>
                                        <div className="border-t border-gray-200 pt-4 mt-4">
                                            <h3 className="text-sm font-semibold text-gray-900 mb-3">Categories</h3>
                                            <div className="flex flex-col space-y-2">
                                                {categories.map((category, index) => (
                                                    <Link
                                                        key={`mobile-${category.slug}-${index}`}
                                                        href={`/category/${category.slug}`}
                                                        className="flex items-center py-2 text-gray-700 hover:text-orange-600"
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                    >
                                                        <span className="text-sm">{category.title}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Categories - Responsive Dropdown */}
                <div className="bg-orange-500">
                    <div className="container mx-auto px-2">
                        <div className="hidden md:block">
                            <div className="flex flex-wrap gap-1">
                                {categories.map((category, index) => (
                                    <div key={`${category.slug}-${index}`} className="relative group">
                                        {/* Main Category Button */}
                                        <button className="inline-flex h-10 items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-white hover:text-black transition-all duration-200 hover:bg-white/10 group-hover:bg-white/10">
                                            <span className="truncate max-w-[120px] sm:max-w-[150px] lg:max-w-none">
                                                {category.title}
                                            </span>
                                            {category.children && category.children.length > 0 && (
                                                <ChevronDown className="ml-1 h-3 w-3 transition-transform group-hover:rotate-180 flex-shrink-0" />
                                            )}
                                        </button>

                                        {/* Dropdown Content */}
                                        {category.children && category.children.length > 0 && (
                                            <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out transform translate-y-2 group-hover:translate-y-0 z-50">
                                                <div className="bg-white rounded-2xl shadow-2xl border-0 min-w-[280px] max-w-[320px] sm:min-w-[300px] sm:max-w-[400px] overflow-hidden backdrop-blur-sm">
                                                    {/* Dropdown Arrow */}
                                                    <div className="absolute -top-2 left-6 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100"></div>

                                                    {/* Dropdown Items Container */}
                                                    <div className={`relative bg-white rounded-2xl p-2 ${
                                                        category.children.length > 6 
                                                            ? 'max-h-[420px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400' 
                                                            : ''
                                                    }`}>
                                                        {category.children.map((item, idx) => (
                                                            <Link
                                                                key={`${item.slug}-${idx}`}
                                                                href={`/category/${item.slug}`}
                                                                className="flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 rounded-xl text-sm text-gray-700 transition-all duration-200 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 hover:text-orange-600 hover:shadow-sm group/item"
                                                            >
                                                                {item.image?.default && (
                                                                    <div className="flex-shrink-0">
                                                                        <Image
                                                                            src={item.image.default}
                                                                            width={32}
                                                                            height={32}
                                                                            alt={item.title}
                                                                            className="rounded-xl shadow-sm transition-all duration-200 group-hover/item:scale-105 group-hover/item:shadow-md w-8 h-8 sm:w-9 sm:h-9 object-cover"
                                                                        />
                                                                    </div>
                                                                )}
                                                                <div className="flex-1 min-w-0">
                                                                    <span className="font-medium block group-hover/item:font-semibold transition-all text-xs sm:text-sm leading-tight">
                                                                        {item.title}
                                                                    </span>
                                                                </div>
                                                                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 rotate-270 transition-all duration-200 group-hover/item:text-orange-500 group-hover/item:transform group-hover/item:translate-x-1 flex-shrink-0" />
                                                            </Link>
                                                        ))}
                                                        
                                                        {/* Scroll indicator for long lists */}
                                                        {category.children.length > 6 && (
                                                            <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent h-4 pointer-events-none"></div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {/* Mobile Category Navigation */}
                        <div className="md:hidden">
                            <div className="flex overflow-x-auto scrollbar-none gap-2 py-2 px-1">
                                {categories.map((category, index) => (
                                    <Link
                                        key={`mobile-${category.slug}-${index}`}
                                        href={`/category/${category.slug}`}
                                        className="flex-shrink-0 inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-white hover:text-black transition-all duration-200 hover:bg-white/10 whitespace-nowrap"
                                    >
                                        <span className="text-xs sm:text-sm">{category.title}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default HeaderBody;