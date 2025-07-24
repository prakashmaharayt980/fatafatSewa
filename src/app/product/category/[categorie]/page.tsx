'use client'

import { Eye, Heart, ShoppingCart, Star } from 'lucide-react'
import React from 'react'

export default function page() {
  return (
    <div>  <div className="group relative">
            <div className="bg-white rounded-2xl p-1 shadow-lg border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300">
              <div className="relative overflow-hidden rounded-xl">
                {/* Product Image */}
                <div className="aspect-square bg-gray-200 flex items-center justify-center relative group-hover:scale-105 transition-transform duration-300">
                  <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center">
                    <div className="w-24 h-24 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-3xl">📱</span>
                    </div>
                  </div>
                  
                  {/* Floating Action Buttons */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                    <button className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors duration-200 hover:scale-110">
                      <Heart className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors duration-200 hover:scale-110">
                      <Eye className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                  
                  {/* Sale Badge */}
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -25%
                  </div>
                </div>
                
                {/* Quick Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-base font-medium mb-1 text-gray-700">Premium Smartphone</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex text-orange-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs text-gray-300">(128 reviews)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-semibold text-white">$599</span>
                      <span className="text-xs text-gray-400 line-through ml-2">$799</span>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs transition-colors duration-200 flex items-center gap-1">
                      <ShoppingCart className="w-3 h-3" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div></div>
  )
}
