// src/app/layout.tsx
import './globals.css'; // Tailwind or global styles
import React from 'react';
import HeaderBody from './layout/headerbody';
import { ContextStoreProvider } from './api/ContextStore';
import FooterBody from './layout/FooterBody';
import { Toaster } from '@/components/ui/sonner';
import ChatBot from './chatbot';


export const metadata = {
  title: 'Fatafat Sewa',
  description: 'Instant delivery platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <ContextStoreProvider >
          <HeaderBody />
          <main className="flex-1 w-full  mx-auto p-2">{children}</main>
          <FooterBody />
                <ChatBot />
      <Toaster richColors position="top-right" />
        </ContextStoreProvider>
      </body>
    </html>
  );
}
