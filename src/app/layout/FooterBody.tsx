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
      name: "Kathmandu Outlet",
      address: "Sitapaila - 14, Kathmandu",
      phone: "01-1010101, 9812083182"
    },
    {
      name: "Kathmandu Outlet",
      address: "Sitapaila - 14, Kathmandu",
      phone: "01-1010101, 9812083182"
    }
  ];

  const Information = [
    { title: "About Us", url: "#" },
    { title: "Term and Conditions", url: "#" },
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
    { title: "Buy Tell & Purchase", url: "#" },
    { title: "Payment Partner", url: "#" },
    { title: "Help and Contact", url: "#" },
    { title: "List your Product", url: "#" }
  ];

  const socialIcons = [
    { Icon: Facebook, url: "#" },
    { Icon: Twitter, url: "#" },
    { Icon: Instagram, url: "#" },
    { Icon: Youtube, url: "#" },
    { Icon: Linkedin, url: "#" },
  ];

  return (
    <footer className="bg-white border-t  border-gray-200">
      {/* Top Section - Outlet Information */}
      <div className="bg-blue-800 w-full py-4 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {outlets.map((outlet, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold">{outlet.name}</h3>
                  <ChevronRight className="w-4 h-4 bg-white text-blue-800 rounded-full" />
                </div>
                <p className="text-gray-300 flex items-center gap-2 mt-1 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{outlet.address}</span>
                </p>
                <p className="text-gray-300 flex items-center gap-2 mt-1 text-sm">
                  <Phone className="w-4 h-4" />
                  <span>{outlet.phone}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="bg-white py-6 sm:max-md:px-4 max-w-7xl mx-auto px-2">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {/* Logo and Social Media */}
          <div className="md:col-span-1 flex flex-col items-start">
            <div className="mb-2">
              <Image
                src="/imgfile/footerlogo.png"
                alt="Logo"
                width={150}
                height={150}
                className="rounded-lg object-contain"
              />
            </div>
            <p className="text-gray-600  text-[9px] font-medium">
              Nepal's Leading Online Shopping Platform<br />
              Making Quality Products Accessible to All
            </p>
            <div className="mt-3">
              <h4 className="font-semibold text-gray-800 text-center text-sm">Follow Us</h4>
              <div className="flex gap-2 mt-2">
                {socialIcons.map(({ Icon, url }, index) => (
                  <a key={index} href={url} className="hover:scale-110 transition-transform text-gray-600 hover:text-blue-600">
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Information */}
          <div className="md:col-span-1">
            <h3 className="font-semibold text-gray-800 mb-2 text-xl">Information</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              {Information.map((link, index) => (
                <li key={index}>
                  <a href={link.url} className="hover:text-blue-600 transition-colors">{link.title}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="font-semibold text-gray-800 mb-2 text-xl">Quick Links</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              {QuickLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.url} className="hover:text-blue-600 transition-colors">{link.title}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Banking Partners */}
          <div className="md:col-span-1">
            <h3 className="font-semibold text-gray-800 mb-2 text-xl text-center">Banking Partners</h3>
            <div className="grid grid-cols-2 gap-1">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="flex justify-center items-center text-center  p-0 m-0">
                  <Image
                    src={`/imgfile/bankingPartners${index + 1}.png`}
                    alt={`Bank ${index + 1}`}
                    width={100}
                    height={50}
                    className="object-cover hover:scale-105 transition-transform"
                  />
                </div>
              ))}
            </div>
          </div>




          {/* Payment Methods */}
          <div className="md:col-span-1">
            <h3 className="font-semibold text-gray-800 text-xl text-center">Payment Methods</h3>
            <div className="grid grid-cols-2  gap-2">
              {/* {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex justify-center">
                  <Image
                    src={`/imgfile/paymentMethod${index + 1}.png`}
                    alt={`Payment Method ${index + 1}`}
                    width={70}
                    height={20}
                    className="object-contain hover:scale-105 transition-transform"
                  />
                </div>
              ))} */}
              <div className="flex justify-center">
                <Image
                  src={`/imgfile/esewa.png`}
                  alt={`Payment Method `}
                  width={70}
                  height={20}
                  className="object-contain hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex justify-center">
                <Image
                  src={`/imgfile/khalti.webp`}
                  alt={`Payment Method `}
                  width={70}
                  height={20}
                  className="object-contain hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex justify-center">
                <Image
                  src={`/imgfile/paymentMethod4.png`}
                  alt={`Payment Method `}
                  width={70}
                  height={20}
                  className="object-contain hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex justify-center">
                <Image
              src={`/imgfile/paymentMethod3.png`}
                  alt={`Payment Method `}
                  width={70}
                  height={20}
                  className="object-contain hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex justify-center">
                <Image
              src={`/imgfile/paymentMethod6.png`}
                  alt={`Payment Method `}
                  width={70}
                  height={20}
                  className="object-contain hover:scale-105 transition-transform"
                />
              </div>

            </div>


          </div>
          {/* Insurance Through */}
          <div className="md:col-span-1 bg-white">
            <h3 className="font-semibold text-gray-800 mb-2 text-xl text-center">Insurance Through</h3>
            <div className="flex flex-col items-center  text-center gap-2">
              <div className="p-2 rounded text-center">
                <Image
                  src="/imgfile/insurancepartner1.png"
                  alt="Insurance"
                  width={100}
                  height={50}
                  className="object-contain"
                  quality={100}
                />
              </div>
              <div className="p-2 rounded text-center">
                <h3 className="font-semibold text-gray-800 mb-2 text-xl text-center">Finance Partner</h3>
                <Image
                  src="/imgfile/insurancepartner2.png"
                  alt="Finance Partner"
                  width={80}
                  height={30}
                  quality={100}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div >

      {/* Bottom Copyright */}
      <div className="bg-white py-3 border-t border-gray-200" >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-600">
            © 2025 UC Sewa. All rights reserved. | Powered by FatafatSewa
          </p>
        </div>
      </div >
    </footer >
  );
};

export default FooterBody;