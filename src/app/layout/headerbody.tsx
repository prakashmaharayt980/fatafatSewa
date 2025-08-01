'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart, User, Heart,  CreditCard, Menu, X, Tag, Calculator, BookType } from 'lucide-react';
import Image from 'next/image';
import imglogo from '../assets/logoimg.png';
import CategorySideDrawer from '../product/category/sidebar';
import { useContextStore } from '../api/ContextStore';
import RemoteServices from '../api/remoteservice';

const HeaderComponent = () => {
    const [search, setSearch] = useState("");
    const { homePageData } = useContextStore()
    const categories = homePageData?.categories || []

    const [searchResults, setSearchResults] = useState([]);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showAccountMenu, setShowAccountMenu] = useState(false);
    const [showCategoryDrawer, setShowCategoryDrawer] = useState(false); // New state for category drawer
    const searchRef = useRef(null);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);

        if (value.trim().length > 2) {
            setIsSearching(true);
            RemoteServices.SerachProducts(value.trim()).then(res=>{
                setSearchResults(res.data || [])
                   setShowSearchDropdown(true);
                setIsSearching(false);
            })
 
        } else {
            setShowSearchDropdown(false);
        }
    };

    const handleProductClick = (id) => {

        setShowSearchDropdown(false);
    };

    // Toggle category drawer
    const toggleCategoryDrawer = (e) => {
        e.stopPropagation()
        setShowCategoryDrawer(prev=>!prev);
    };

    // Close drawer when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showCategoryDrawer && !event.target.closest('.category-drawer') && !event.target.closest('.category-button')) {
                setShowCategoryDrawer(false);
            }
        };
        document.addEventListener('mousedown',(e)=> handleClickOutside(e));
        return () => {
            document.removeEventListener('mousedown', (e)=> handleClickOutside(e));
        };
    }, [showCategoryDrawer]);

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
                .category-drawer {
                    transform: translateX(-100%);
                    transition: transform 0.3s ease-in-out;
                }
                .category-drawer.open {
                    transform: translateX(0);
                }
            `}</style>

            <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
                {/* Main Header */}
                <div className="container mx-auto px-4 py-1">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center space-x-2">
                            <Image
                                src={imglogo}
                                alt="Fatafatsewa Logo"
                                width={130}
                                height={130}
                                priority
                                className="rounded-lg"
                            />
                        </div>

                        {/* Search Bar */}
                        <div className="hidden md:flex items-center flex-1 max-w-2xl mx-4" ref={searchRef}>
                            <div className="relative w-full">
                                <div className="flex rounded-full border border-gray-300 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                                    <input
                                        type="text"
                                        placeholder="Search for a product here"
                                        value={search}
                                        onChange={handleSearchChange}
                                        className="w-full px-6 py-2 bg-transparent border-none focus:outline-none text-sm placeholder-gray-500"
                                    />
                                    <button className="bg-blue-600 text-white px-2 py-1.5 m-1 hover:bg-blue-700 transition-colors rounded-full duration-200 flex items-center justify-center">
                                        <Search className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Search Dropdown */}
                                {showSearchDropdown && (
                                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-80 overflow-y-auto z-50">
                                        {isSearching ? (
                                            <div className="p-4 text-center text-gray-500">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
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

                        {/* Right Icons */}
                        <div className="flex items-center space-x-4">
                            {/* User Account */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowAccountMenu(!showAccountMenu)}
                                    className="flex items-center space-x-1 text-blue-600 border rounded-4xl hover:text-blue-600 transition-colors"
                                >
                                    <User className="h-5 w-5 m-1" />
                                </button>
                                {showAccountMenu && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                        <div className="py-1">
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile</a>
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Orders</a>
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Settings</a>
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Logout</a>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Cart */}
                            <button className="flex items-center space-x-1 text-blue-600 border rounded-4xl hover:text-blue-600 transition-colors relative">
                                <ShoppingCart className="h-5 w-5 m-1" />
                            </button>

                            {/* Mobile Menu Button */}
                            <button
                                className="md:hidden text-gray-700 hover:text-blue-600"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Search */}
                    <div className="md:hidden mt-3">
                        <div className="flex">
                            <input
                                type="text"
                                placeholder="Search for a product here"
                                value={search}
                                onChange={handleSearchChange}
                                className="w-full px-4 py-2 border border-r-0 border-gray-300 rounded-l-md focus:outline-none focus:border-blue-500 text-sm"
                            />
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition-colors">
                                <Search className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Navigation Bar */}
<div className="bg-[var(--colour-bg4)] border-t border-gray-200">
            <div className="container mx-auto ">
                <div className="flex items-center justify-between py-1 ">
                    {/* Categories Drawer Button */}
                    <div className="flex items-center space-x-6 mx-4">
                        <div className="relative">
                            <button
                                onClick={(e)=>toggleCategoryDrawer(e)}
                                className="flex items-center space-x-2 px-4 py-2.5 bg-white rounded-3xl border border-gray-200 shadow-sm text-sm font-medium text-gray-700 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200"
                            >
                                <Menu className="h-4 w-4" />
                                <span>Category</span>
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center space-x-8">
                            <a 
                                href="#" 
                                className="flex items-center space-x-1 px-2 py-2 rounded-full border border-transparent text-sm font-medium text-gray-700 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200"
                            >
                                <Tag className="h-4 w-4 text-red-600" />
                                <span>Brands</span>
                            </a>
                            <a 
                                href="#" 
                                className="flex items-center space-x-2 px-2 py-2 rounded-full border border-transparent text-sm font-medium text-gray-700 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200"
                            >
                                <Calculator className="h-4 w-4 text-green-600" />
                                <span>EMI Calculator</span>
                            </a>
                            <a 
                                href="#" 
                                className="flex items-center space-x-2 px-2 py-2 rounded-full border border-transparent text-sm font-medium text-gray-700 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200"
                            >
                                <BookType className="h-4 w-4 text-blue-600" />
                                <span>Blogs</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

                {/* Category Side Drawer */}
                {/* <div
                    className={`category-drawer fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform ${showCategoryDrawer ? 'open' : ''}`}
                >
                    <div className="flex justify-between items-center p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Categories</h2>
                        <button
                            onClick={toggleCategoryDrawer}
                            className="text-gray-600 hover:text-blue-600"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="p-4">
                        {categories.map((category) => (
                            <a
                                key={category.id}
                                href={`/category/${category.slug}`}
                                className="block py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded-md transition-colors"
                            >
                                {category.title}
                            </a>
                        ))}
                    </div>
                </div> */}

                <CategorySideDrawer
                    categories={categories}
                    showCategoryDrawer={showCategoryDrawer}
                    toggleCategoryDrawer={()=>toggleCategoryDrawer}
                />

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-200">
                        <div className="container mx-auto px-4 py-4">
                            <div className="flex flex-col space-y-3">
                                <a href="#" className="flex items-center space-x-2 py-2 text-gray-700 hover:text-blue-600">
                                    <Menu className="h-4 w-4" />
                                    <span>Categories</span>
                                </a>
                                <a href="#" className="flex items-center space-x-2 py-2 text-gray-700 hover:text-blue-600">
                                    <Tag className="h-4 w-4 text-red-600" />
                                    <span>Brands</span>
                                </a>
                                <a href="#" className="flex items-center space-x-2 py-2 text-gray-700 hover:text-blue-600">
                                          <Calculator className="h-4 w-4 text-green-600" />
                                    <span>EMI Calculator</span>
                                </a>
                                <a href="#" className="flex items-center space-x-2 py-2 text-gray-700 hover:text-blue-600">
                                <BookType className="h-4 w-4 text-blue-600" />
                                    <span>Blogs</span>
                                </a>
                                <a href="#" className="flex items-center space-x-2 py-2 text-gray-700 hover:text-blue-600">
                                    <User className="h-4 w-4" />
                                    <span>Account</span>
                                </a>
                                <a href="#" className="flex items-center space-x-2 py-2 text-gray-700 hover:text-blue-600">
                                    <Heart className="h-4 w-4" />
                                    <span>Wishlist</span>
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </header>
        </>
    );
};

export default HeaderComponent;