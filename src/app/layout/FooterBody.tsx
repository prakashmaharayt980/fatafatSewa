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
    { src: "/imgfile/paymentMethod1.svg", alt: "eSewa" },
    { src: "/imgfile/paymentMethod2.svg", alt: "Khalti" },
    { src: "/imgfile/paymentMethod4.png", alt: "Payment Method 4" },
    { src: "/imgfile/paymentMethod3.png", alt: "Payment Method 3" },
    { src: "/imgfile/paymentMethod6.png", alt: "Payment Method 6" },
  ];

  const playStoreImages = [
    { src: "/imgfile/google-play.svg", alt: "Google Play Store 1", url: "#" },
    { src: "/imgfile/app-store.svg", alt: "Google Play Store 2", url: "#" },
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-100 font-[Inter,sans-serif]">
      {/* Main Footer Content */}
      <div className="py-4 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Logo, Social Media, and Payment Methods */}
          <div className="lg:col-span-2">
            <div className="mb-2">
              <Image
                src="/imgfile/footerlogo.png"
                alt="Logo"
                width={100}
                height={100}
                className="rounded-md object-contain"
              />
            </div>
            <p className="text-gray-600 text-sm font-normal leading-relaxed max-w-xs">
              Nepal&apos;s Leading Online Shopping Platform<br />
              Making Quality Products Accessible to All
            </p>
            <div className="mt-2">
              <h4 className="font-semibold text-gray-800 text-base">Follow Us</h4>
              <div className="flex gap-2 mt-1 border-b border-gray-100 pb-1">
                {socialIcons.map(({ Icon, url }, index) => (
                  <a
                    key={index}
                    href={url}
                    className="text-gray-600 hover:text-blue-600 transition-transform transform hover:scale-105"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
              {/* Payment Methods */}
              <div className="flex gap-2 mt-2 flex-wrap justify-start">
                {paymentMethods.map((method, index) => (
                  <div
                    key={index}
                    className="flex justify-center items-center bg-white rounded-md shadow-sm p-1 hover:shadow transition-shadow"
                  >
                    <Image
                      src={method.src}
                      alt={method.alt}
                      width={40}
                      height={20}
                      className="object-contain"
                      quality={100}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Information */}
          <div>
            <h3 className="font-semibold text-gray-800 text-base mb-1">Information</h3>
            <ul className="space-y-0.5 text-sm font-normal text-gray-600">
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
            <h3 className="font-semibold text-gray-800 text-base mb-1">Quick Links</h3>
            <ul className="space-y-0.5 text-sm font-normal text-gray-600">
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

          {/* Kathmandu Outlet */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-base font-bold text-gray-800 tracking-tight">Kathmandu Outlet</h3>
              <ChevronRight className="w-4 h-4 bg-blue-50 text-blue-900 rounded-full p-0.5" />
            </div>
            <p className="text-gray-600 flex items-center mt-2 gap-2 text-sm font-normal">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Sitapaila - 14, Kathmandu</span>
            </p>
            <p className="text-gray-600 flex items-center gap-2 mt-2 text-sm font-normal">
              <Phone className="w-4 h-4 text-blue-600" />
              <span>01-1010101, 9812083182</span>
            </p>
            {/* Google Play Store Images */}
            <div className="flex gap-2 mt-3 flex-wrap justify-center">
              {playStoreImages.map((image, index) => (
                <a
                  key={index}
                  href={image.url}
                  className="flex justify-center items-center bg-white rounded-md shadow-sm p-1 hover:shadow transition-shadow"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={90}
                    height={30}
                    className="object-contain"
                    quality={100}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="bg-gray-100 py-2 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm font-normal text-gray-600">
            © 2025 UC Sewa. All rights reserved. | Powered by FatafatSewa
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterBody;