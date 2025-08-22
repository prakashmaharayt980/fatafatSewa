'use client'
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import Link from 'next/link';
import nvaitemlist from './navitem.json';

const NavBar = () => {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [hoverTimeout, setHoverTimeout] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navRef = useRef(null);

    // Memoize and validate navigation data to prevent unnecessary re-renders
    const validatedNavItems = useMemo(() => {
        if (!Array.isArray(nvaitemlist)) {
            console.warn('Navigation items should be an array');
            return [];
        }

        return nvaitemlist.filter((item, index) => {
            if (!item || typeof item !== 'object') {
                console.warn(`Invalid navigation item at index ${index}:`, item);
                return false;
            }
            
            if (!item.title || typeof item.title !== 'string') {
                console.warn(`Missing or invalid title at index ${index}:`, item);
                return false;
            }

            // Validate content structure if it exists
            if (item.content && Array.isArray(item.content)) {
                item.content = item.content.filter((contentItem, contentIndex) => {
                    if (!contentItem || typeof contentItem !== 'object') {
                        console.warn(`Invalid content item at ${index}-${contentIndex}:`, contentItem);
                        return false;
                    }
                    
                    if (!contentItem.innerTittle) {
                        console.warn(`Missing innerTittle at ${index}-${contentIndex}:`, contentItem);
                        return false;
                    }

                    // Validate and filter children
                    if (contentItem.childernlistL && Array.isArray(contentItem.childernlistL)) {
                        contentItem.childernlistL = contentItem.childernlistL.filter((child, childIndex) => {
                            if (!child || typeof child !== 'object') {
                                console.warn(`Invalid child item at ${index}-${contentIndex}-${childIndex}:`, child);
                                return false;
                            }
                            
                            if (!child.title || !child.to) {
                                console.warn(`Missing title or 'to' property at ${index}-${contentIndex}-${childIndex}:`, child);
                                return false;
                            }
                            
                            return true;
                        });
                    } else {
                        contentItem.childernlistL = [];
                    }
                    
                    return true;
                });
            } else {
                item.content = [];
            }
            
            return true;
        });
    }, []);

    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => {
            if (hoverTimeout) clearTimeout(hoverTimeout);
        };
    }, [hoverTimeout]);

    // Handle click outside for mobile menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setMobileMenuOpen(false);
            }
        };

        if (mobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [mobileMenuOpen]);

    // Optimized hover handlers with useCallback
    const handleMouseEnter =(e, index) => {
     
        e.stopPropagation();
        
        if (hoverTimeout) clearTimeout(hoverTimeout);
        const timeout = setTimeout(() => {
            setActiveDropdown(index);
        }, 100);
        setHoverTimeout(timeout);
    }

    const handleMouseLeave = (e) => {
     
        e.stopPropagation();
        
        if (hoverTimeout) clearTimeout(hoverTimeout);
        const timeout = setTimeout(() => {
            setActiveDropdown(null);
        }, 200);
        setHoverTimeout(timeout);
    }

    // Memoized helper functions
    const getGridColumns = useMemo(() => (contentLength) => {
        if (contentLength <= 2) return 'grid-cols-1 sm:grid-cols-2';
        if (contentLength <= 4) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
        if (contentLength <= 6) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
    }, []);

    const getDropdownWidth = useMemo(() => (category) => {
        const contentLength = category.content?.length || 0;
        const maxChildren = Math.max(
            ...(category.content?.map(item => item.childernlistL?.length || 0) || [0])
        );
        
        if (contentLength <= 2 && maxChildren <= 5) return 'w-[400px]';
        if (contentLength <= 3 && maxChildren <= 8) return 'w-[600px]';
        if (contentLength <= 4) return 'w-[800px]';
        return 'w-[95vw] max-w-6xl';
    }, []);

    // Optimized children rendering with proper loop handling
    const renderChildrenItems = useCallback((children, categoryIndex, innerIndex) => {
        if (!Array.isArray(children) || children.length === 0) {
            return <div className="text-sm text-gray-400 italic">No items available</div>;
        }

        // Create unique keys and handle large lists efficiently
        const renderItem = (child, index) => {
            const uniqueKey = `child-${categoryIndex}-${innerIndex}-${index}-${child.title.replace(/\s+/g, '-').toLowerCase()}`;
            
            return (
                <Link 
                    key={uniqueKey} 
                    href={child.to || '#'} 
                    className="px-2 py-1.5 text-sm text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-sm transition-colors duration-150"
                >
                    {child.title}
                </Link>
            );
        };

        // For many items, split into columns
        if (children.length > 8) {
            const midpoint = Math.ceil(children.length / 2);
            const leftColumn = children.slice(0, midpoint);
            const rightColumn = children.slice(midpoint);

            return (
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <div className="flex flex-col gap-1">
                        {leftColumn.map(renderItem)}
                    </div>
                    <div className="flex flex-col gap-1">
                        {rightColumn.map((child, index) => renderItem(child, index + midpoint))}
                    </div>
                </div>
            );
        }

        // For fewer items, single column
        return (
            <div className="flex flex-col gap-1">
                {children.map(renderItem)}
            </div>
        );
    }, []);

    // Helper to get safe navigation link
    const getSafeNavLink = useCallback((category) => {
        if (!category.content || !Array.isArray(category.content) || category.content.length === 0) {
            return '/';
        }
        
        const firstContent = category.content[0];
        if (!firstContent.childernlistL || !Array.isArray(firstContent.childernlistL) || firstContent.childernlistL.length === 0) {
            return '/';
        }
        
        return firstContent.childernlistL[0]?.to || '/';
    }, []);

    // Split navigation items for different screen sizes
    const { primaryItems, secondaryItems } = useMemo(() => {
        return {
            primaryItems: validatedNavItems.slice(0, 4),
            secondaryItems: validatedNavItems.slice(4)
        };
    }, [validatedNavItems]);

    // Handle mobile menu toggle
    const toggleMobileMenu = useCallback(() => {
        setMobileMenuOpen(prev => !prev);
    }, []);

    const closeMobileMenu = useCallback(() => {
        setMobileMenuOpen(false);
    }, []);

    // Early return if no valid navigation items
    if (!validatedNavItems.length) {
        return (
            <nav className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-md">
                <div className="container mx-auto px-4 py-4">
                    <div className="text-white text-center">Navigation items not available</div>
                </div>
            </nav>
        );
    }

    return (
        <nav ref={navRef} className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-md relative z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Desktop Navbar - Loop through all items */}
                <div className="hidden lg:flex items-center justify-center py-2 gap-0.5">
                    {validatedNavItems.map((category, categoryIndex) => {
                        const uniqueKey = `desktop-${categoryIndex}-${category.title.replace(/\s+/g, '-').toLowerCase()}`;
                        const hasContent = Array.isArray(category.content) && category.content.length > 0;
                        
                        return (
                            <div
                                key={uniqueKey}
                                className="relative"
                                onMouseEnter={(e) => handleMouseEnter(e, categoryIndex)}
                                onMouseLeave={handleMouseLeave}
                            >
                                {hasContent ? (
                                    <>
                                        <button className="flex items-center gap-0.5 rounded-lg px-3 py-1.5 text-sm font-medium text-white hover:bg-white/10 transition-all duration-200 group">
                                            <span className="truncate max-w-[160px]">
                                                {category.title}
                                            </span>
                                            <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${activeDropdown === categoryIndex ? 'rotate-180' : ''}`} />
                                        </button>
                                        
                                        {activeDropdown === categoryIndex && (
                                            <div
                                                className={`absolute top-full left-0 bg-white rounded-lg mt-1 mx-1 shadow-xl border border-gray-200 p-3 max-h-[80vh] overflow-y-auto ${getDropdownWidth(category)}`}
                                                onMouseEnter={(e) => handleMouseEnter(e, categoryIndex)}
                                                onMouseLeave={handleMouseLeave}
                                            >
                                                <div className={`grid ${getGridColumns(category.content.length)} gap-3`}>
                                                    {category.content.map((innerItem, innerIndex) => {
                                                        const innerKey = `inner-${categoryIndex}-${innerIndex}-${innerItem.innerTittle?.replace(/\s+/g, '-').toLowerCase()}`;
                                                        
                                                        return (
                                                            <div key={innerKey} className="space-y-2">
                                                                <h3 className="text-sm font-semibold text-orange-600 border-b border-orange-100 pb-1 mb-2">
                                                                    {innerItem.innerTittle || 'Untitled Section'}
                                                                </h3>
                                                                <div className="flex flex-col gap-0.5">
                                                                    {innerItem.childernlistL?.map((child, childIndex) => (
                                                                        <Link
                                                                            key={`child-${categoryIndex}-${innerIndex}-${childIndex}`}
                                                                            href={child.to || '#'}
                                                                            className="px-1.5 py-1 text-sm text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-sm transition-colors duration-150"
                                                                        >
                                                                            {child.title}
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        href={getSafeNavLink(category)}
                                        className="flex items-center rounded-lg px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 border border-white/20 transition-all duration-200"
                                    >
                                        <span className="truncate max-w-[160px]">
                                            {category.title}
                                        </span>
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Tablet Navbar - Loop through primary items */}
                <div className="hidden md:flex lg:hidden items-center justify-between py-2">
                    <div className="flex items-center gap-1 overflow-x-auto flex-1 px-1">
                        {primaryItems.map((category, index) => {
                            return (
                                <Link
                                    key={index}
                                    href={getSafeNavLink(category)}
                                    className="flex-shrink-0 rounded-lg px-2 py-1.5 text-sm font-medium text-white hover:bg-white/10 transition-colors duration-200 whitespace-nowrap"
                                >
                                    {category.title}
                                </Link>
                            );
                        })}
                    </div>
                    
                    {/* Secondary items in dropdown for tablet */}
                    {secondaryItems.length > 0 && (
                        <div className="relative">
                            <button className="ml-2 flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors duration-200">
                                More <ChevronDown className="h-4 w-4" />
                            </button>
                            <div className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
                                {secondaryItems.map((category, index) => {
                                    const moreKey = `tablet-more-${index}-${category.title.replace(/\s+/g, '-').toLowerCase()}`;
                                    
                                    return (
                                        <Link
                                            key={moreKey}
                                            href={getSafeNavLink(category)}
                                            className="block px-4 py-2 text-sm text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded transition-colors duration-200"
                                        >
                                            {category.title}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile Navbar - Loop with truncated display */}
                <div className="md:hidden py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 overflow-x-auto flex-1">
                            {validatedNavItems.slice(0, 2).map((category, index) => {
                                const mobileKey = `mobile-${index}-${category.title.replace(/\s+/g, '-').toLowerCase()}`;
                                
                                return (
                                    <Link
                                        key={mobileKey}
                                        href={getSafeNavLink(category)}
                                        className="flex-shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium text-white hover:bg-white/10 transition-colors duration-200 whitespace-nowrap"
                                    >
                                        {category.title}
                                    </Link>
                                );
                            })}
                        </div>
                        
                        <button
                            onClick={toggleMobileMenu}
                            className="ml-3 flex items-center justify-center w-8 h-8 rounded-lg text-white hover:bg-white/10 transition-colors duration-200"
                            aria-label="Toggle menu"
                            aria-expanded={mobileMenuOpen}
                        >
                            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>

                    {/* Mobile Dropdown Menu - Complete loop structure */}
                    {mobileMenuOpen && (
                        <div className="absolute left-0 right-0 top-full bg-white shadow-lg border-t border-gray-200 max-h-[70vh] overflow-y-auto z-40">
                            <div className="py-2">
                                {validatedNavItems.map((category, categoryIndex) => {
                                    const mobileDropdownKey = `mobile-dropdown-${categoryIndex}-${category.title.replace(/\s+/g, '-').toLowerCase()}`;
                                    const hasContent = Array.isArray(category.content) && category.content.length > 0;
                                    
                                    return (
                                        <div key={mobileDropdownKey}>
                                            {hasContent ? (
                                                <div className="border-b border-gray-100 last:border-b-0">
                                                    <div className="px-4 py-2 bg-gray-50 text-sm font-semibold text-orange-600">
                                                        {category.title}
                                                    </div>
                                                    {category.content.map((innerItem, innerIndex) => {
                                                        const mobileInnerKey = `mobile-inner-${categoryIndex}-${innerIndex}-${innerItem.innerTittle?.replace(/\s+/g, '-').toLowerCase()}`;
                                                        
                                                        return (
                                                            <div key={mobileInnerKey} className="px-6 py-2">
                                                                <div className="text-xs font-medium text-gray-500 mb-1">
                                                                    {innerItem.innerTittle || 'Untitled Section'}
                                                                </div>
                                                                {Array.isArray(innerItem.childernlistL) && innerItem.childernlistL.map((child, childIndex) => {
                                                                    const mobileChildKey = `mobile-child-${categoryIndex}-${innerIndex}-${childIndex}-${child.title?.replace(/\s+/g, '-').toLowerCase()}`;
                                                                    
                                                                    return (
                                                                        <Link
                                                                            key={mobileChildKey}
                                                                            href={child.to || '#'}
                                                                            className="block px-2 py-1 text-sm text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded transition-colors duration-200"
                                                                            onClick={closeMobileMenu}
                                                                        >
                                                                            {child.title}
                                                                        </Link>
                                                                    );
                                                                })}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <Link
                                                    href={getSafeNavLink(category)}
                                                    className="block px-4 py-3 text-sm text-gray-600 hover:text-orange-500 hover:bg-orange-50 border-b border-gray-100 last:border-b-0 transition-colors duration-200"
                                                    onClick={closeMobileMenu}
                                                >
                                                    {category.title}
                                                </Link>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;