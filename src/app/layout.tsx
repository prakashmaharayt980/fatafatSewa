// src/app/layout.tsx
import './globals.css'; // Tailwind or global styles
import React from 'react';
import HeaderBody from './layout/headerbody';
import { ContextStoreProvider } from './api/ContextStore';
import FooterBody from './layout/FooterBody';


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
          <main className="flex-1 w-full max-w-7xl mx-auto p-2">{children}</main>
          <FooterBody />

        </ContextStoreProvider>
      </body>
    </html>
  );
}
