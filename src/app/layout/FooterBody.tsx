import React from 'react';
import {
  MapPin,

  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,

  PhoneCall,
  Mail,

} from 'lucide-react';
import Image from 'next/image';

const FooterBody = () => {
  const QuickLinks = [
    { title: "About Us", url: "#" },
    { title: "Contact Us", url: "#" },
    { title: "Terms & Conditions", url: "#" },
    { title: "Privacy Policy", url: "#" },
    { title: "Return Policy", url: "#" },
    
  ];

  const Categories = [
    { title: "Laptops", url: "#" },
    { title: "Mobile Phone", url: "#" },
    { title: "Accessories", url: "#" },
    { title: "Office Parts", url: "#" },
    { title: "Emi Payment ", url: "#" },
 
  ];

  const ContactInfo = [
    { title: "Sitapaila Road-14, Kathmandu, Nepal", icon: MapPin },
    { title: "+977 9828757575", icon: PhoneCall },
    { title: "info@fatafatsewa.com", icon: Mail },

  ];

  const socialIcons = [
    { Icon: Facebook, url: "#", color: "hover:text-blue-600" },
    { Icon: Twitter, url: "#", color: "hover:text-sky-500" },
    { Icon: Instagram, url: "#", color: "hover:text-pink-600" },
    { Icon: Youtube, url: "#", color: "hover:text-red-600" },
    { Icon: Linkedin, url: "#", color: "hover:text-blue-700" },
  ];

  const paymentMethods = [
    { src: "/imgfile/paymentMethod1.svg", alt: "eSewa" },
    { src: "/imgfile/paymentMethod2.svg", alt: "Khalti" },
    { src: "/imgfile/paymentMethod4.png", alt: "Payment Method 4" },
    { src: "/imgfile/paymentMethod3.png", alt: "Payment Method 3" },
    { src: "/imgfile/paymentMethod6.png", alt: "Payment Method 6" },
  ];

  const playStoreImages = [
    { src: "/imgfile/google-play.svg", alt: "Google Play Store", url: "#" },
    { src: "/imgfile/app-store.svg", alt: "App Store", url: "#" },
  ];



  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200 font-[Inter,sans-serif]">
      {/* Features Section */}


      {/* Main Footer Content */}
      <div className="py-4 max-w-7xl mt-2 mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-2 items-center flex justify-center  ">
              <Image
                src="/imgfile/footerlogo.png"
                alt="FatafatSewa Logo"
                width={140}
                height={60}
                className="rounded-md object-contain"
              />
            </div>
            <p className="text-gray-600 text-sm font-light  mb-2 max-w-md">
              Nepal&lsquo;s Leading Online Shopping Platform<br />
              Making Quality Products Accessible to All
            </p>

            {/* Social Media */}
            <div className="mb-6 mt-3">
              <h4 className=" text-[var(--colour-fsP2)] font-semibold text-lg mb-1">Follow Us</h4>
              <div className="flex gap-3">
                {socialIcons.map(({ Icon, url, color }, index) => (
                  <a
                    key={index}
                    href={url}
                    className={`w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 ${color} transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1`}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>


          </div>



          {/* Quick Links */}
          <div>
            <h3 className="font-semibold  text-[var(--colour-fsP2)] text-xl mb-3 relative">
              Quick Links

            </h3>
            <ul className="space-y-1">
              {QuickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.url}
                    className="text-gray-600  hover:text-[var(--colour-fsP1)] transition-colors duration-200 font-light flex items-center group"
                  >

                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-[var(--colour-fsP2)] text-xl mb-3 relative">
              Categories

            </h3>
            <ul className="space-y-2">
              {Categories.map((category, index) => (
                <li key={index}>
                  <a
                    href={category.url}
                    className="text-gray-600  hover:text-[var(--colour-fsP1)] transition-colors duration-200 font-light flex items-center group"
                  >

                    {category.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold  text-[var(--colour-fsP2)] text-xl mb-3 relative">
              Contact Info

            </h3>
            <ul className="space-y-2">
              {ContactInfo.map((info, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <info.icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-600 text-base font-light">{info.title}</span>
                </li>
              ))}
            </ul>

          </div>


 
        </div>
      </div>

      <div className='py-2 max-w-7xl mx-auto px-4 sm:px-6 flex flex-row items-center gap-3 justify-between'>
        {/* Payment Methods */}
        <div className=''>
          <h4 className="font-bold text-[var(--colour-fsP2)] text-lg mb-4">Payment Methods</h4>
          <div className="flex gap-3 flex-wrap">
            {paymentMethods.map((method, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-3 hover:shadow-lg transition-shadow duration-300"
              >
                <Image
                  src={method.src}
                  alt={method.alt}
                  width={50}
                  height={30}
                  className="object-contain"
                  quality={100}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col  items-start justify-between gap-4 mt-7">
          <p className="text-gray-600 text-sm">Subscribe to get special offers and updates</p>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 sm:w-64 px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300"
            />
            <button className="bg-[var(--colour-fsP1)] text-white px-5 py-2 rounded-md font-medium transition-colors text-sm">
              Subscribe
            </button>
          </div>
        </div>
        {/* App Store Links */}
        <div className="mt-1">
          <h4 className="font-semibold text-[var(--colour-fsP2)] text-base mb-4">Download Our App</h4>
          <div className="flex gap-3 flex-row ">
            {playStoreImages.map((image, index) => (
              <a
                key={index}
                href={image.url}
                className="block bg-black rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={120}
                  height={40}
                  className="object-contain"
                  quality={100}
                />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[var(--colour-fsP2)] text-white py-3 mt-1 ">
        <div className=" max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <p className="text-xs sm:text-sm">
              © 2025 FatafatSewa. All rights reserved.
            </p>
            <div className="flex gap-4 text-xs sm:text-sm">
              <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </div>


    </footer>
  );
};

export default FooterBody;