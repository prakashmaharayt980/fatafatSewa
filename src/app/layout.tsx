// src/app/layout.tsx
import './globals.css'; // Tailwind or global styles
import React from 'react';
import HeaderBody from './layout/headerbody';


export const metadata = {
  title: 'Fatafat Sewa',
  description: 'Instant delivery platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <HeaderBody />
        <main className="flex-1 w-full max-w-5xl mx-auto p-4">{children}</main>
        <footer className="w-full bg-gray-800 text-gray-200 p-4 text-center mt-auto">
          &copy; {new Date().getFullYear()} Fatafat Sewa. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
