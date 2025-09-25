import React, { useState } from 'react';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { X, ChevronDown, Heart, ShoppingCart } from 'lucide-react';


import Link from 'next/link';
import Image from 'next/image';
import { CompanyLogo } from '../CommonVue/Payment';

const MobileSidebar = ({ open, toggleMobileMenu, IsUserLogin, loginNeed, nvaitemlist }) => {
  return (
    <Sheet open={open} onOpenChange={toggleMobileMenu}>
      <SheetContent side="left" className="p-0 w-[300px] lg:hidden">
        {/* Sidebar */}
        <div className="flex flex-col h-full bg-white shadow-xl overflow-y-auto">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <Image
              src={CompanyLogo}
              alt="Fatafatsewa Logo"
              className="w-auto h-6"
              fill
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation Links */}
          <nav className="py-2 flex-1">
            <div className="space-y-1">
              {nvaitemlist.map((category, index) => (
                <div key={index} className="border-b border-gray-100 last:border-0">
                  {category.content?.length > 0 ? (
                    <Accordion type="single" collapsible>
                      <AccordionItem value={`item-${index}`}>
                        <AccordionTrigger className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                          <span className="text-sm font-medium text-gray-900">
                            {category.title}
                          </span>
                          <ChevronDown className="w-4 h-4 text-gray-500 transition-transform group-open:rotate-180" />
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-3 space-y-4">
                          {category.content.map((section, sectionIndex) => (
                            <div key={sectionIndex} className="space-y-2">
                              <h4 className="text-xs font-semibold text-orange-600 uppercase tracking-wider">
                                {section.innerTittle}
                              </h4>
                              <div className="grid gap-1">
                                {section.childernlistL?.map((item, itemIndex) => (
                                  <Link
                                    key={itemIndex}
                                    href={item.to}
                                    onClick={toggleMobileMenu}
                                    className="block px-2 py-1.5 text-sm text-gray-600 hover:text-orange-500 rounded-md"
                                  >
                                    {item.title}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ) : (
                    <div className="px-4 py-2">
                      <Link
                        href={category.to || '/blog'}
                        onClick={toggleMobileMenu}
                        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100"
                      >
                        {category.title === 'Blog' && (
                          <Image
                            src={CompanyLogo}
                            alt="blog icon"
                            className="h-4 w-4"
                            fill
                          />
                        )}
                        <span>{category.title}</span>
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* Bottom Section */}
          <div className="sticky bottom-0 p-4 bg-white border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              {IsUserLogin ? (
                <Button
                  onClick={loginNeed}
                  className="w-full bg-[var(--colour-fsP2)] hover:bg-[var(--colour-fsP1)] text-white text-sm font-medium"
                >
                  Login / Register
                </Button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/wishlist"
                    onClick={toggleMobileMenu}
                    className="flex items-center justify-center px-3 py-2 text-sm text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Wishlist
                  </Link>
                  <Link
                    href="/cart"
                    onClick={toggleMobileMenu}
                    className="flex items-center justify-center px-3 py-2 text-sm text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Cart
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;