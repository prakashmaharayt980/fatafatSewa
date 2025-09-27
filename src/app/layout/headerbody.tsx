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
import nvaitemlist from './navitem.json';
import { useContextCart } from '../checkout/CartContext';
import MobileSidebar from './sidebarMobile';


const HeaderComponent = () => {
    const { IsUserLogin, loginNeed, setIsDrawerOpen, setWishListInfo } = useContextCart()

    const router = useRouter();
    const searchRef = useRef(null);
    const [searchTimeout, setSearchTimeout] = useState(null);

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

    const handleSearchChange = async (e) => {
        e.stopPropagation();
        const value = e.target.value;
        updateState({ search: value });

        // Clear any existing timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        // Check if the value has at least 3 characters (including spaces)
        if (value.length > 2) {
            updateState({ isSearching: true, showSearchDropdown: true });

            // Set new timeout
            const timeoutId = setTimeout(async () => {
                try {
                    // Send the raw value with spaces to the API
                    const res = await RemoteServices.SerachProducts(value);
                    updateState({
                        searchResults: res.data || [],
                        isSearching: false
                    });
                } catch (error) {
                    updateState({
                        searchResults: [],
                        isSearching: false
                    });
                }
            }, 500);

            setSearchTimeout(timeoutId);
        } else {
            updateState({ showSearchDropdown: false, searchResults: [] });
        }
    };

    const handleProductClick = (slug: string, e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();

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


        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [state.showCategoryDrawer]);

    // Search Results Component
    const SearchResults = ({ isMobile: _isMobile = false }) => (
        <div className={cn(
            "absolute bg-white border w-full sm:min-w-xl border-gray-200 rounded-lg shadow-lg mt-2 max-h-80 overflow-y-auto z-52",

        )}>
            {state.isSearching ? (
                <div className="p-6 text-center w-full sm:min-w-xl text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p>Searching...</p>
                </div>
            ) : state.searchResults.length > 0 ? (
                <div className="divide-y divide-gray-100">
                    {state.searchResults.map((product) => (
                        <div
                            key={product.id}
                            onClick={(e) => handleProductClick(product.slug, e)}
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
            <header className="sticky top-0 z-40 w-full bg-white shadow-sm border-b border-gray-100">
                {/* Main Header */}
                <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
                    <div className="flex items-center justify-between h-14 sm:h-16 lg:h-18">
                        {/* Logo */}
                        <div
                            className="flex items-center space-x-2 cursor-pointer flex-shrink-0"
                            onClick={() => handleroute('/')}
                        >
                            <Image
                                src={imglogo}
                                alt="Fatafatsewa Logo"
                                width={120}
                                height={40}
                                priority
                                className="rounded-lg w-auto h-7 sm:h-8 lg:h-9 transition-transform duration-200 hover:scale-105"
                            />
                        </div>

                        {/* Desktop Search Bar */}
                        <div className="hidden lg:flex items-center flex-1 max-w-2xl mx-6" ref={searchRef}>
                            <div className="relative w-full">
                                <div className="flex rounded-full border border-gray-300 bg-gray-50 hover:bg-white hover:border-blue-300 transition-all duration-200 overflow-hidden focus-within:ring-2 focus-within:ring-blue-200 focus-within:border-blue-500">
                                    <input
                                        type="text"
                                        placeholder="Search products, brands..."
                                        value={state.search}
                                        onChange={handleSearchChange}
                                        className="w-full px-4 py-2.5 bg-transparent border-none focus:outline-none text-sm placeholder-gray-500"
                                        onKeyDown={(e) => {
                                            if (e.key === ' ') {
                                                e.stopPropagation(); // Prevent space key from being intercepted
                                            }
                                        }}
                                    />
                                    <button className="bg-blue-600 text-white px-4 py-2.5 m-0.5 hover:bg-blue-700 transition-colors rounded-full duration-200 flex items-center justify-center">
                                        <Search className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Desktop Search Results */}
                                {state.showSearchDropdown && <SearchResults />}
                            </div>
                        </div>

                        {/* Right Icons */}
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <button
                                onClick={toggleMobileSearch}
                                className="lg:hidden p-2 rounded-full border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200"
                            >
                                <Search className="h-4 w-4" />
                            </button>


                            {IsUserLogin ? (
                                <button
                                    onClick={loginNeed}
                                    className="px-2.5 py-1.5 bg-[var(--colour-fsP2)] rounded-full transition-all duration-300 text-sm font-semibold capitalize text-white flex items-center gap-4 shadow-sm"
                                >
                                    <span className="font-medium items-center pl-2">Login</span>
                                    <div className="rounded-full p-1.5 bg-gray-200">
                                        <User2Icon className="w-4 h-4 rounded-full text-[var(--colour-fsP1)]" />
                                    </div>
                                </button>
                            ) : (
                                <>
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
                                        onClick={() => setWishListInfo(prev => ({ ...prev, isDrawerOpen: true }))}
                                        className="relative p-1.5 rounded-full border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all"
                                    >
                                        <Heart className="h-4 w-4" />
                                    </button>
                                </>
                            )}







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



                <MobileSidebar
                    open={state.isMobileMenuOpen}
                    toggleMobileMenu={toggleMobileMenu}
                    IsUserLogin={IsUserLogin}
                    loginNeed={loginNeed}
                    nvaitemlist={nvaitemlist}
                />

                {/* Mobile Search Bar */}
                {state.mobileSearchVisible && (
                    <div className="lg:hidden border-b w-full border-gray-200 bg-gray-50">
                        <div className="max-w-7xl w-full mx-auto px-2 sm:px-4 py-3">
                            <div className="relative" ref={searchRef}>
                                <div className="flex rounded-lg border border-gray-300 bg-white overflow-hidden shadow-sm">
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={state.search}
                                        onChange={handleSearchChange}
                                        className="w-full px-4 py-3 bg-transparent border-none focus:outline-none text-sm"
                                        autoFocus
                                    />
                                    <button
                                        onClick={toggleMobileSearch}
                                        className="px-4 py-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
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