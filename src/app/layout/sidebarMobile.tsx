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
import { useRouter } from 'next/navigation';
import { imglist } from '../CommonVue/Image';
import { cn } from '@/lib/utils';

const MobileSidebar = ({ open, toggleMobileMenu, IsUserLogin, loginNeed, nvaitemlist }) => {
  const router = useRouter();

  const handlerouter = (path: string) => {
    router.push(path);
    toggleMobileMenu();
  };

  return (
    <Sheet open={open} onOpenChange={toggleMobileMenu}>
      <SheetContent
        side="left"
        className="p-0 w-[280px] max-w-[85vw] lg:hidden scrollbar-hide"
      >
        {/* Sidebar */}
        <div className="flex flex-col h-full p-1.5 sm:p-2 bg-white shadow-xl overflow-y-auto overscroll-contain">
          {/* Header */}
          <div className="p-3 sm:p-4 border-b border-blue-100 flex items-center justify-between">
            <div className="h-8 w-32 relative">
              <Image
                src={CompanyLogo}
                alt="Fatafatsewa Logo"
                className="w-auto h-full object-contain"
                fill
              />
            </div>
    
          </div>

          {/* Navigation Links */}
          <nav className="py-2 flex-1">
            <div className="space-y-1">
              {nvaitemlist.map((category, index) => (
                <div key={index} className="border-b border-blue-100 last:border-0">
                  {category.content?.length > 0 ? (
                    <Accordion type="single" collapsible>
                      <AccordionItem value={`item-${index}`}>
                        <AccordionTrigger
                          className="flex items-center justify-between px-3 py-2 hover:bg-blue-50 rounded-lg"
                        >
                          <span className="text-[0.6rem] font-medium text-gray-700 truncate sm:text-[0.7rem]">
                            {category.title}
                          </span>
                   
                        </AccordionTrigger>
                        <AccordionContent className="px-3 pb-2 space-y-3 animate-fade-in">
                          {category.content.map((section, sectionIndex) => (
                            <div key={sectionIndex} className="space-y-2">
                              <h4 className="text-[0.6rem] font-semibold text-blue-600 uppercase tracking-wider truncate sm:text-[0.7rem]">
                                {section.innerTittle}
                              </h4>
                              <div className="grid gap-1">
                                {section.childernlistL?.map((item, itemIndex) => (
                                  <Link
                                    key={itemIndex}
                                    href={item.to}
                                    onClick={toggleMobileMenu}
                                    className="block px-2 py-1.5 text-[0.6rem] text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 truncate sm:text-[0.7rem]"
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
                    <div className="px-3 py-2 flex flex-col gap-2">
                      <button
                        onClick={() => handlerouter('/blog')}
                        className="px-2 py-1.5 min-h-[2rem] rounded-lg text-[0.6rem] items-center font-medium flex flex-row transition-all duration-300 bg-white text-gray-700 border border-blue-100 hover:bg-blue-50 hover:text-blue-600 sm:px-3 sm:text-[0.7rem]"
                      >
                        <Image
                          src={imglist.blog}
                          alt="blog icon"
                          height={16}
                          width={16}
                          priority
                          className="mr-2 sm:h-5 sm:w-5"
                        />
                        <span className="truncate">Blog</span>
                      </button>
                      <button
                        onClick={() => handlerouter('/emi')}
                        className="px-2 py-1.5 min-h-[2rem] rounded-lg text-[0.6rem] items-center font-medium flex flex-row transition-all duration-300 bg-white text-gray-700 border border-blue-100 hover:bg-blue-50 hover:text-blue-600 sm:px-3 sm:text-[0.7rem]"
                      >
                        <Image
                          src={imglist.emiCalcultorIocn}
                          alt="emi calculator icon"
                          height={16}
                          width={16}
                          priority
                          className="mr-2 sm:h-5 sm:w-5"
                        />
                        <span className="truncate">EMI Calculator</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* Bottom Section */}
          <div className="sticky bottom-0 p-3 bg-white border-t border-blue-100 sm:p-4">
            <div className="flex flex-col space-y-3">
              {IsUserLogin ? (
                <Button
                  onClick={loginNeed}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white text-[0.6rem] font-medium rounded-lg sm:text-[0.7rem]"
                >
                  Login / Register
                </Button>
              ) : (
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <Link
                    href="/wishlist"
                    onClick={toggleMobileMenu}
                    className="flex items-center justify-center px-2 py-1.5 text-[0.6rem] text-gray-700 bg-white border border-blue-100 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 sm:px-3 sm:text-[0.7rem]"
                  >
                    <Heart className="w-4 h-4 mr-1.5 text-blue-500 sm:w-5 sm:h-5" />
                    <span className="truncate">Wishlist</span>
                  </Link>
                  <Link
                    href="/cart"
                    onClick={toggleMobileMenu}
                    className="flex items-center justify-center px-2 py-1.5 text-[0.6rem] text-gray-700 bg-white border border-blue-100 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 sm:px-3 sm:text-[0.7rem]"
                  >
                    <ShoppingCart className="w-4 h-4 mr-1.5 text-blue-500 sm:w-5 sm:h-5" />
                    <span className="truncate">Cart</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 0.3s ease-out;
          }
        `}</style>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;