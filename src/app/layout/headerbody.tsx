'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart, User, Heart, Menu, X, ChevronDown, User2Icon } from 'lucide-react';
import Image from 'next/image';
import imglogo from '../assets/logoimg.png';

import RemoteServices from '../api/remoteservice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

import NavBar from './NavBar';

import { useContextCart } from '../checkout/CartContext';

const HeaderComponent = () => {
    const { IsUserLogin, loginNeed,setIsDrawerOpen } = useContextCart()

    const router = useRouter();
    const searchRef = useRef(null);

    // Consolidated state object
    const [state, setState] = useState({
        search: "",
        searchResults: [],
        showSearchDropdown: false,
        isSearching: false,
        isMobileMenuOpen: false,
        showAccountMenu: false,
        showCategoryDrawer: false,
        mobileSearchVisible: false,
        activeTab: 'home' // for mobile navigation
    });

    // Helper function to update state
    const updateState = (updates) => {
        setState(prev => ({ ...prev, ...updates }));
    };

    // Search functionality
    const handleSearchChange = async (e) => {
        const value = e.target.value;
        updateState({ search: value });

        if (value.trim().length > 2) {
            updateState({ isSearching: true, showSearchDropdown: true });

            try {
                const res = await RemoteServices.SerachProducts(value.trim());
                updateState({
                    searchResults: res.data || [],
                    isSearching: false
                });
            } catch (error) {
                console.error('Search error:', error);
                updateState({
                    searchResults: [],
                    isSearching: false
                });
            }
        } else {
            updateState({ showSearchDropdown: false, searchResults: [] });
        }
    };

    const handleProductClick = (slug) => {
        console.log('Navigating to product:', slug)
        router.push(`/product/${slug}`);
        updateState({ showSearchDropdown: false, mobileSearchVisible: false });


    };

    const handleroute = (path) => {
        router.push(path);
        updateState({ isMobileMenuOpen: false });
    };



    const toggleMobileSearch = () => {
        updateState({
            mobileSearchVisible: !state.mobileSearchVisible,
            search: "",
            searchResults: [],
            showSearchDropdown: false
        });
    };

    const toggleMobileMenu = () => {
        updateState({ isMobileMenuOpen: !state.isMobileMenuOpen });
    };

    const toggleAccountMenu = () => {
        updateState({ showAccountMenu: !state.showAccountMenu });
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Close search dropdown
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                updateState({ showSearchDropdown: false });
            }

            // Close category drawer
            if (state.showCategoryDrawer &&
                !event.target.closest('.category-drawer') &&
                !event.target.closest('.category-button')) {
                updateState({ showCategoryDrawer: false });
            }

            // Close account menu
            if (!event.target.closest('.account-menu')) {
                updateState({ showAccountMenu: false });
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [state.showCategoryDrawer]);

    // Search Results Component
    const SearchResults = ({ isMobile = false }) => (
        <div className={cn(
            "absolute bg-white border border-gray-200 rounded-lg shadow-lg mt-2 max-h-80 overflow-y-auto z-51",

        )}>
            {state.isSearching ? (
                <div className="p-6 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p>Searching...</p>
                </div>
            ) : state.searchResults.length > 0 ? (
                <div className="divide-y divide-gray-100">
                    {state.searchResults.map((product) => (
                        <div
                            key={product.id}
                            onClick={() => handleProductClick(product.slug)}
                            className="flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                            {product.image && (
                                <div className="w-12 h-12 mr-3 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {product.name}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    in {product.categories?.[0]?.title}
                                </p>
                                <div className="flex items-center space-x-2 mt-1">
                                    <span className="text-sm font-semibold text-blue-600">
                                        Rs .{product.discounted_price}
                                    </span>
                                    {product.discounted_price !== product.price && (
                                        <span className="text-xs text-gray-500 line-through">
                                            Rs .{product.price}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-6 text-center text-gray-500">
                    <Search className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No products found for &lsquo;{state.search}&lsquo;</p>
                </div>
            )}
        </div>
    );

    return (
        <>
            <style jsx>{`
                .scrollbar-none::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-none {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

            <header className="sticky top-0 z-40 w-full bg-white shadow-sm">
                {/* Main Header */}
                <div className="border-b border-gray-100">
                    <div className="container mx-auto px-2 sm:px-4 lg:px-6">
                        <div className="flex items-center justify-between h-14 sm:h-16">
                            {/* Logo */}
                            <div
                                className="flex items-center space-x-2 cursor-pointer flex-shrink-0"
                                onClick={() => handleroute('/')}
                            >
                                <Image
                                    src={imglogo}
                                    alt="Fatafatsewa Logo"
                                    width={100}
                                    height={32}
                                    priority
                                    className="rounded-lg w-auto h-6 sm:h-8"
                                />
                            </div>

                            {/* Desktop Search Bar */}
                            <div className="hidden md:flex items-center flex-1 max-w-xl mx-4" ref={searchRef}>
                                <div className="relative w-full">
                                    <div className="flex rounded-full border border-gray-300 bg-gray-50 hover:bg-white hover:border-blue-300 transition-all duration-200 overflow-hidden focus-within:ring-2 focus-within:ring-blue-200">
                                        <input
                                            type="text"
                                            placeholder="Search products, brands..."
                                            value={state.search}
                                            onChange={handleSearchChange}
                                            className="w-full px-4 py-2 bg-transparent border-none focus:outline-none text-sm placeholder-gray-500"
                                        />
                                        <button className="bg-blue-600 text-white px-3 py-1.5 m-0.5 hover:bg-blue-700 transition-colors rounded-full duration-200 flex items-center justify-center">
                                            <Search className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Desktop Search Results */}
                                    {state.showSearchDropdown && <SearchResults />}
                                </div>
                            </div>

                            {/* Right Icons */}
                            <div className="flex items-center space-x-1.5 sm:space-x-2">

                                <button
                                    onClick={toggleMobileSearch}
                                    className="md:hidden p-1.5 rounded-full border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all"
                                >
                                    <Search className="h-4 w-4" />
                                </button>


                                {
                                    IsUserLogin ? (
                                        <button

                                            onClick={loginNeed}

                                            className={`px-2.5  py-1.5 bg-[var(--colour-fsP2)] rounded-full transition-all duration-300 text-sm font-semibold capitalize text-white flex items-center gap-4 shadow-sm `}
                                        >
                                            <span className={" font-medium  items-center pl-2"}>Login</span>
                                            <div className=" rounded-full p-1.5 bg-gray-200">
                                                <User2Icon className="w-4 h-4  rounded-full text-[var(--colour-fsP1)]   " />
                                            </div>


                                        </button>
                                    ) :

                                        (<>
                                            <div className="relative account-menu">
                                                <button
                                                    onClick={toggleAccountMenu}
                                                    className="hidden sm:flex items-center space-x-1 p-1.5 rounded-full border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all"
                                                >
                                                    <User className="h-4 w-4" />
                                                    <ChevronDown className="h-3 w-3" />
                                                </button>

                                                {/* Account Dropdown */}
                                                {state.showAccountMenu && (
                                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                                        <div className="py-2">
                                                            <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile</Link>
                                                            <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Orders</Link>
                                                            <Link href="/wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Wishlist</Link>
                                                            <hr className="my-1" />
                                                            <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Logout</button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>


                                            <button
                                                onClick={() => setIsDrawerOpen(true)}
                                                className="relative p-1.5 rounded-full border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all"
                                            >
                                                <ShoppingCart className="h-4 w-4" />
                                                {/* Cart badge */}
                                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                                    3
                                                </span>
                                            </button>

                                            <button
                                                onClick={() => handleroute('/wishlist')}
                                                className="relative p-1.5 rounded-full border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all"
                                            >
                                                <Heart className="h-4 w-4" />

                                            </button>
                                        </>)
                                }







                                {/* Mobile Menu Toggle */}
                                <button
                                    onClick={toggleMobileMenu}
                                    className="sm:hidden p-1.5 rounded-full border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all"
                                >
                                    {state.isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                {state.mobileSearchVisible && (
                    <div className="md:hidden border-b border-gray-200 bg-gray-50">
                        <div className="container mx-auto px-2 py-2">
                            <div className="relative" ref={searchRef}>
                                <div className="flex rounded-lg border border-gray-300 bg-white overflow-hidden">
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={state.search}
                                        onChange={handleSearchChange}
                                        className="w-full px-3 py-2 bg-transparent border-none focus:outline-none text-sm"
                                        autoFocus
                                    />
                                    <button
                                        onClick={toggleMobileSearch}
                                        className="px-3 py-2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Mobile Search Results */}
                                {state.showSearchDropdown && <SearchResults isMobile={true} />}
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Bar - Desktop Only */}
                <NavBar />
            </header>
        </>
    );
};

export default HeaderComponent;