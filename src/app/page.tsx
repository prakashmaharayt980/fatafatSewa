import React from "react";
import HeaderBody from "./layout/headerbody";


const Footer: React.FC = () => (
    <footer className="w-full bg-gray-800 text-gray-200 p-4 text-center mt-auto">
        &copy; {new Date().getFullYear()} Fatafat Sewa. All rights reserved.
    </footer>
);

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
    <div className="flex flex-col min-h-screen">
        <HeaderBody />
        <main className="flex-1 w-full max-w-5xl mx-auto p-4">{children}</main>
        <Footer />
    </div>
);

export default Layout;