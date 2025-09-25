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

const MobileSidebar = ({ open, toggleMobileMenu, IsUserLogin, loginNeed, nvaitemlist }) => {
  const router = useRouter()

  const handlerouter = (path: string) => {
    router.push(path)
    toggleMobileMenu()
  }
  return (
    <Sheet open={open} onOpenChange={toggleMobileMenu}>
      <SheetContent side="left" className="p-0 w-[300px] lg:hidden">
        {/* Sidebar */}
        <div className="flex flex-col h-full p-3 bg-white shadow-xl overflow-y-auto">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className='h-8 w-32 relative'>
              <Image
                src={CompanyLogo}
                alt="Fatafatsewa Logo"
                className="w-auto h-full"
                fill
              />
            </div>

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
                          <span className="text-sm font-medium text-[var(--colour-fsP2)]">
                            {category.title}
                          </span>

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
                    <div className="px-4 py-2 flex flex-col gap-2">



                      <button

                        onClick={() => handlerouter('/blog')}
                        className={`px-3 py-2 gap-1 w-full rounded-full text-sm items-center font-medium flex flex-row transition-all bg-white text-gray-700 border border-gray-300 hover:bg-gray-50`}
                      >

                        <Image
                          src={imglist.blog}
                          alt='blog icon'
                          height={20}
                          width={20}
                          priority
                        />
                        <span className={" font-medium items-center "}>Blog</span>
                      </button>
                      <button

                        onClick={() => handlerouter('/emi')}

                        className={`px-3 py-2 gap-1 rounded-full w-full text-sm items-center font-medium flex flex-row transition-all bg-white text-gray-700 border border-gray-300 hover:bg-gray-50`}
                      >
                        <Image
                          src={imglist.emiCalcultorIocn}
                          alt='blog icon'
                          height={20}
                          width={20}
                          priority
                        />
                        <span className={" font-medium items-center "}>Emi Calcultor</span>



                      </button>
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