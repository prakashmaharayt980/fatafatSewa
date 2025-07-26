import React from 'react';
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  MapPin,
  Phone,
  MoveRight,
  FlagTriangleRight,
  ChevronRight,
  X
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
  ]

  const Information = [
    { title: "About Us", url: "#" },
    { title: "Term and Conditions", url: "#" },
    { title: "Privacy Policy", url: "#" },
    { title: "Return and Refund Policy", url: "#" },
    { title: "Pickup Policy", url: "#" },
    { title: "Exchange Policy", url: "#" },
    { title: "Exit Policy", url: "#" },
    { title: "Franchising Institute", url: "#" }
  ]
  const QuickLinks = [
    { title: "News With Us", url: "#" },
    { title: "Internship Program", url: "#" },
    { title: "Buy Tell & Purchase", url: "#" },
    { title: "Payment Partner", url: "#" },
    { title: "Help and Contact", url: "#" },
    { title: "List your Product", url: "#" }
  ]





  return (
    <footer className="bg-white border-t border-gray-200 flex flex-col items-center justify-evenly">
      {/* Top Section - Outlet Information */}
      <div className="bg-blue-200 w-full  p-3 ">
        <div className=" mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3  gap-8 justify-between items-center">
            {/* Kathmandu Outlet 1 */}
            {outlets.map((outlet, index) => (
              <div key={index} className="flex items-center flex-col ">
                <div className='flex flex-row  gap-2 items-center text-center'>
                  <h3 className="text-lg font-semibold text-gray-800 ">{outlet.name}</h3>
                  <ChevronRight className="w-5 h-5 text-white mb-1 border-transparent rounded-3xl bg-blue-700 m-2 '" />
                </div>
                <p className="text-gray-600 flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>{outlet.address}</span>
                </p>
                <p className="text-gray-600 flex items-center space-x-2 mt-1">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span>{outlet.phone}</span>
                </p>
              </div>
            ))}


          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12  max-w-7xl">
        <div className="mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">

            {/* Logo and Social Media */}
            <div className="md:col-span-1  rounded-lg  flex flex-col items-center ml-1">
              <div className="mb-4 mt-2">
                <Image
                  src={`/imgfile/footerlogo.png`}
                  alt="Logo"
                  width={300}
                  height={300}
                  className="rounded-lg"
                />
              </div>
              <p className="  text-gray-600 text-center text-[8px] mt-1 font-semibold ">
                Nepal Leading Online Shopping platform<br />
                Making Quality Products Accessible to All
              </p>

              <div className="mb-4">
                <h4 className="font-semibold text-black text-center text-base mt-1">Do Follows Us</h4>
                <div className="flex space-x-3">
                  {
                    Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} >

                        <Image
                          src={`/imgfile/socialmedia${index + 1}.png`}
                          alt={`Social Icon ${index + 1}`}
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>





            {/* Banking Partners */}
            <div className="md:col-span-1 ml-1">
              <h3 className="font-semibold text-gray-800 mb-4 ">Informations</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {Information.map((link, index) => (
                  <li key={index}>
                    <a href={link.url} className="hover:text-blue-600">{link.title}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-1 ml-1">
              <h3 className="font-semibold text-gray-800 mb-4 ">Quicklinks</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {QuickLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link.url} className="hover:text-blue-600">{link.title}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-1">
              <h3 className="font-semibold text-gray-800 mb-4 text-center">Banking Partners</h3>
              <div className="grid grid-cols-2 gap-2 place-items-center">
                {
                  Array.from({ length: 12 }).map((_, index) => (
                    <div key={index} className="flex justify-center items-center ">
                      <Image
                        src={`/imgfile/bankingPartners${index + 1}.png`}
                        alt={`Bank ${index + 1}`}
                        width={100}
                        height={50}
                        className="object-contain hover:scale-105 transition-transform"
                      />
                    </div>
                  ))
                }
              </div>
            </div>

            {/* Payment Methods */}
            <div className="md:col-span-1 justify-center items-center">
              <h3 className="font-semibold text-gray-800 mb-4 text-center">Payment Methods</h3>
              <div className="flex flex-col items-center space-y-3">
                {
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex justify-center items-center">
                      <Image
                        src={`/imgfile/paymentMethod${index + 1}.png`}
                        alt={`Payment Method ${index + 1}`}
                        width={100}
                        height={30}
                        className="object-contain hover:scale-105 transition-transform"
                      />
                    </div>
                  ))
                }
                <div className="flex justify-center items-center gap-2 place-item-center">
                  <Image
                    src={`/imgfile/paymentMethod4.png`}
                    alt={`Payment Method 4`}
                    width={80}
                    height={30}
                    className="object-contain hover:scale-105 transition-transform"
                  />
                  <Image
                    src={`/imgfile/paymentMethod5.png`}
                    alt={`Payment Method 5`}
                    width={80}
                    height={30}
                    className="object-contain hover:scale-105 transition-transform"
                  />
                </div>
              </div>
            </div>

            {/* Insurance Through */}
            <div className="md:col-span-1">
              <h3 className="font-semibold text-gray-800 mb-4 text-center">Insurance Through</h3>
              <div className="flex flex-col items-center space-y-3">

                <div className="bg-gray-50 p-3 rounded text-center">
                  <Image
                    src={`/imgfile/insurancepartner1.png`}
                    alt={`Insurance }`}
                    width={100}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <div className="bg-gray-50 p-3 rounded text-center">
                  <h3 className="font-semibold text-gray-800 mb-4 text-center">Finance Partner</h3>
                  <Image
                    src={`/imgfile/insurancepartner2.png`}
                    alt={`Insurance }`}
                    width={100}
                    height={40}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="bg-gray-50 py-4 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">
            © 2024 UC Sewa. All rights reserved. | Powered by UC Global Service Provider
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterBody;