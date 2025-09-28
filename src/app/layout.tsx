// src/app/layout.tsx
import './globals.css'; // Tailwind or global styles
import React from 'react';
import HeaderBody from './layout/headerbody';

import FooterBody from './layout/FooterBody';
import { Toaster } from '@/components/ui/sonner';
import ChatBot from './chatbot';
import { CartProvider } from './checkout/CartContext';
import CheckoutDrawer from './checkout/CheckoutDrawer';

import CheckoutSuccess from './checkout/CheckoutSucess';

import LoginPage from './login/page';
import WishList from './emi/Wishlist';

import { Inter } from 'next/font/google'
import { EmiProvider } from './emi/emiContext';
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'Fatafat Sewa',
  description: 'Instant delivery platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="flex flex-col min-h-screen">

        <CartProvider>
          <HeaderBody />
          <main className="flex-1 w-full  mx-auto ">
            <EmiProvider>
              {children}
            </EmiProvider>


          </main>
          <FooterBody />
          <ChatBot />
          <Toaster richColors position="top-right" />
          <CheckoutDrawer />
         
          <CheckoutSuccess />

          <LoginPage />

          <WishList />
        </CartProvider>
      </body>
    </html>
  );
}
