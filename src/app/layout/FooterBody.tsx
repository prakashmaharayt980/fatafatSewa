import React from 'react';
import {
  MapPin,
  Phone,
  ChevronRight,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
} from 'lucide-react';
import Image from 'next/image';

const FooterBody = () => {
  const outlets = [
    {
      name: "Kathmandu Outlet",
      address: "Sitapaila - 14, Kathmandu",
      phone: "01-1010101, 9812083182"
    },
    {
      name: "Pokhara Outlet",
      address: "Lakeside - 6, Pokhara",
      phone: "01-2020202, 9812083183"
    },
    {
      name: "Chitwan Outlet",
      address: "Bharatpur - 10, Chitwan",
      phone: "01-3030303, 9812083184"
    }
  ];

  const Information = [
    { title: "About Us", url: "#" },
    { title: "Terms and Conditions", url: "#" },
    { title: "Privacy Policy", url: "#" },
    { title: "Return and Refund Policy", url: "#" },
    { title: "Pickup Policy", url: "#" },
    { title: "Exchange Policy", url: "#" },
    { title: "Exit Policy", url: "#" },
    { title: "Franchising Institute", url: "#" }
  ];

  const QuickLinks = [
    { title: "News With Us", url: "#" },
    { title: "Internship Program", url: "#" },
    { title: "Buy, Sell & Purchase", url: "#" },
    { title: "Payment Partner", url: "#" },
    { title: "Help and Contact", url: "#" },
    { title: "List Your Product", url: "#" }
  ];

  const socialIcons = [
    { Icon: Facebook, url: "#" },
    { Icon: Twitter, url: "#" },
    { Icon: Instagram, url: "#" },
    { Icon: Youtube, url: "#" },
    { Icon: Linkedin, url: "#" },
  ];

  const paymentMethods = [
    { src: "/imgfile/esewa.png", alt: "eSewa" },
    { src: "/imgfile/khalti.webp", alt: "Khalti" },
    { src: "/imgfile/paymentMethod4.png", alt: "Payment Method 4" },
    { src: "/imgfile/paymentMethod3.png", alt: "Payment Method 3" },
    { src: "/imgfile/paymentMethod6.png", alt: "Payment Method 6" },
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-100 font-sans">
      {/* Top Section - Outlet Information */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 w-full py-4 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {outlets.map((outlet, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-base font-bold tracking-tight">{outlet.name}</h3>
                  <ChevronRight className="w-4 h-4 bg-white text-blue-900 rounded-full p-0.5" />
                </div>
                <p className="text-gray-200 flex items-center gap-1 text-xs">
                  <MapPin className="w-4 h-4" />
                  <span>{outlet.address}</span>
                </p>
                <p className="text-gray-200 flex items-center gap-1 mt-1 text-xs">
                  <Phone className="w-4 h-4" />
                  <span>{outlet.phone}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-6 max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Logo, Social Media, and Payment Methods */}
          <div className="lg:col-span-2">
            <div className="mb-2">
              <Image
                src="/imgfile/footerlogo.png"
                alt="Logo"
                width={120}
                height={120}
                className="rounded-md object-contain"
              />
            </div>
            <p className="text-gray-600 text-xs leading-relaxed max-w-xs">
              Nepal&apos;s Leading Online Shopping Platform<br />
              Making Quality Products Accessible to All
            </p>
            <div className="mt-3">
              <h4 className="font-semibold text-gray-800 text-sm">Follow Us</h4>
              <div className="flex gap-3 mt-2 border-b border-gray-100 pb-2">
                {socialIcons.map(({ Icon, url }, index) => (
                  <a
                    key={index}
                    href={url}
                    className="text-gray-600 hover:text-blue-600 transition-transform transform hover:scale-105"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
              {/* Payment Methods */}
              <div className="flex flex-row gap-2 mt-3 flex-wrap justify-start">
                {paymentMethods.map((method, index) => (
                  <div
                    key={index}
                    className="flex justify-center items-center bg-white rounded-md shadow-sm p-2 hover:shadow transition-shadow"
                  >
                    <Image
                      src={method.src}
                      alt={method.alt}
                      width={60}
                      height={20}
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Information */}
          <div>
            <h3 className="font-semibold text-gray-800 text-base mb-2">Information</h3>
            <ul className="space-y-1 text-xs text-gray-600">
              {Information.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.url}
                    className="hover:text-blue-600 transition-colors duration-200"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-800 text-base mb-2">Quick Links</h3>
            <ul className="space-y-1 text-xs text-gray-600">
              {QuickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.url}
                    className="hover:text-blue-600 transition-colors duration-200"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="bg-gray-100 py-2 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-600">
            © 2025 UC Sewa. All rights reserved. | Powered by FatafatSewa
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterBody;