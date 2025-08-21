'use client';

import React, { useState } from 'react';
import { Star, ShoppingCart, Heart, ArrowRight, Play, Users, Trophy, Zap, Smartphone, Laptop, Headphones, Camera, Watch, Shield, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import Image from 'next/image';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  isNew?: boolean;
  isFeatured?: boolean;
  rating?: number;
  reviews?: number;
  brand?: string;
  specifications?: string[];
  warranty?: string;
  inStock?: boolean;
  discount?: number;
}

export interface BrandSeries {
  id: string;
  name: string;
  description: string;
  image: string;
  products: Product[];
  launchDate: string;
  isLatest?: boolean;
  totalProducts?: number;
}

export interface BrandInfo {
  name: string;
  tagline: string;
  description: string;
  foundedYear: number;
  heroImage: string;
  logo: string;
  specialties: string[];
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  cta: string;
  ctaLink: string;
}


const page: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Mock data - replace with your actual data
  const brandInfo: BrandInfo = {
    name: 'FataFatSewa',
    tagline: 'Premium Electronics & Technology',
    description: 'Your trusted destination for cutting-edge electronics, premium gadgets, and innovative technology solutions.',
    foundedYear: 2020,
    heroImage: 'https://images.pexels.com/photos/3965548/pexels-photo-3965548.jpeg?auto=compress&cs=tinysrgb&w=1600',
    logo: 'https://images.pexels.com/photos/6292/blue-pattern-J.jpg?auto=compress&cs=tinysrgb&w=200',
    specialties: ['Smartphones', 'Laptops', 'Audio Devices', 'Smart Watches', 'Cameras', 'Gaming']
  };

  const banners: Banner[] = [
    {
      id: '1',
      title: 'Latest Electronics 2024',
      subtitle: 'Discover cutting-edge technology at unbeatable prices',
      image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=1600',
      cta: 'Shop Now',
      ctaLink: '#products'
    }
  ];

  const products: Product[] = [
    {
      id: '1',
      name: 'iPhone 15 Pro Max',
      category: 'smartphones',
      price: 1199,
      originalPrice: 1299,
      image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=500',
      description: 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system',
      isNew: true,
      isFeatured: true,
      rating: 4.8,
      reviews: 324,
      brand: 'Apple',
      specifications: ['A17 Pro Chip', '256GB Storage', '48MP Camera', '5G Ready'],
      warranty: '1 Year Apple Warranty',
      inStock: true,
      discount: 8
    },
    {
      id: '2',
      name: 'MacBook Pro 16" M3',
      category: 'laptops',
      price: 2499,
      originalPrice: 2699,
      image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=500',
      description: 'Powerful MacBook Pro with M3 chip, perfect for professionals and creators',
      isFeatured: true,
      rating: 4.9,
      reviews: 189,
      brand: 'Apple',
      specifications: ['M3 Pro Chip', '512GB SSD', '18GB RAM', 'Liquid Retina XDR'],
      warranty: '1 Year Apple Warranty',
      inStock: true,
      discount: 7
    },
    {
      id: '3',
      name: 'Sony WH-1000XM5',
      category: 'audio',
      price: 399,
      originalPrice: 449,
      image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500',
      description: 'Industry-leading noise canceling wireless headphones with premium sound',
      rating: 4.7,
      reviews: 456,
      brand: 'Sony',
      specifications: ['30hr Battery', 'Active Noise Canceling', 'Hi-Res Audio', 'Quick Charge'],
      warranty: '2 Year Sony Warranty',
      inStock: true,
      discount: 11
    },
    {
      id: '4',
      name: 'Samsung Galaxy S24 Ultra',
      category: 'smartphones',
      price: 1299,
      image: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=500',
      description: 'Premium Android flagship with S Pen, advanced AI features, and pro cameras',
      isNew: true,
      rating: 4.6,
      reviews: 278,
      brand: 'Samsung',
      specifications: ['Snapdragon 8 Gen 3', '512GB Storage', '200MP Camera', 'S Pen Included'],
      warranty: '1 Year Samsung Warranty',
      inStock: true
    },
    {
      id: '5',
      name: 'Apple Watch Series 9',
      category: 'wearables',
      price: 429,
      originalPrice: 499,
      image: 'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=500',
      description: 'Advanced smartwatch with health monitoring and fitness tracking',
      rating: 4.8,
      reviews: 167,
      brand: 'Apple',
      specifications: ['S9 Chip', 'Always-On Display', 'ECG & Blood Oxygen', 'Water Resistant'],
      warranty: '1 Year Apple Warranty',
      inStock: true,
      discount: 14
    },
    {
      id: '6',
      name: 'Dell XPS 13 Plus',
      category: 'laptops',
      price: 1299,
      originalPrice: 1499,
      image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=500',
      description: 'Ultra-portable laptop with stunning OLED display and premium build quality',
      isFeatured: true,
      rating: 4.5,
      reviews: 234,
      brand: 'Dell',
      specifications: ['Intel i7-1360P', '16GB RAM', '512GB SSD', '13.4" OLED Display'],
      warranty: '1 Year Dell Warranty',
      inStock: true,
      discount: 13
    },
    {
      id: '7',
      name: 'Canon EOS R6 Mark II',
      category: 'cameras',
      price: 2499,
      image: 'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=500',
      description: 'Professional mirrorless camera with advanced autofocus and 4K video',
      rating: 4.9,
      reviews: 145,
      brand: 'Canon',
      specifications: ['24.2MP Full Frame', '4K 60p Video', 'Dual Pixel CMOS AF', 'In-Body Stabilization'],
      warranty: '1 Year Canon Warranty',
      inStock: true
    },
    {
      id: '8',
      name: 'JBL Charge 5',
      category: 'audio',
      price: 179,
      originalPrice: 199,
      image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=500',
      description: 'Portable Bluetooth speaker with powerful bass and long battery life',
      rating: 4.6,
      reviews: 892,
      brand: 'JBL',
      specifications: ['20hr Playtime', 'IP67 Waterproof', 'PartyBoost', 'Power Bank Function'],
      warranty: '1 Year JBL Warranty',
      inStock: true,
      discount: 10
    }
  ];

  const latestSeries: BrandSeries[] = [
    {
      id: '1',
      name: 'Premium Mobile Collection',
      description: 'Latest flagship smartphones with cutting-edge technology, premium design, and advanced camera systems.',
      image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800',
      products: products.slice(0, 3),
      launchDate: '2024-01-15',
      isLatest: true,
      totalProducts: 12
    },
    {
      id: '2',
      name: 'Professional Computing',
      description: 'High-performance laptops and workstations designed for professionals, creators, and power users.',
      image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=800',
      products: products.slice(3, 6),
      launchDate: '2023-11-20',
      totalProducts: 8
    },
    {
      id: '3',
      name: 'Audio Excellence',
      description: 'Premium audio devices including headphones, speakers, and sound systems for audiophiles.',
      image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
      products: products.slice(6, 8),
      launchDate: '2023-10-10',
      totalProducts: 15
    }
  ];

  const categories = [
    { id: 'all', name: 'All Products', icon: null },
    { id: 'smartphones', name: 'Smartphones', icon: Smartphone },
    { id: 'laptops', name: 'Laptops', icon: Laptop },
    { id: 'audio', name: 'Audio', icon: Headphones },
    { id: 'cameras', name: 'Cameras', icon: Camera },
    { id: 'wearables', name: 'Wearables', icon: Watch }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const toggleFavorite = (productId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <Image
                          fill
            src={brandInfo.heroImage}
            alt="Hero background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
        <div className="relative z-10 flex items-center justify-center h-full text-center text-white px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
              {brandInfo.name}
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in-up animation-delay-200">
              {brandInfo.tagline}
            </p>
            <p className="text-lg mb-10 max-w-2xl mx-auto animate-fade-in-up animation-delay-400">
              {brandInfo.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-600">
              <Button size="lg" className="bg-white text-black hover:bg-gray-100 px-8 py-4 text-lg">
                Shop Electronics
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg">
                <Play className="mr-2 h-5 w-5" />
                View Catalog
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Stats */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">4+</h3>
              <p className="text-gray-600">Years of Service</p>
            </div>
            <div className="p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">50K+</h3>
              <p className="text-gray-600">Happy Customers</p>
            </div>
            <div className="p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">1000+</h3>
              <p className="text-gray-600">Products Available</p>
            </div>
            <div className="p-6">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">4.8</h3>
              <p className="text-gray-600">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Series Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Product Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our comprehensive range of premium electronics and technology products
            </p>
          </div>

          <div className="space-y-20">
            {latestSeries.map((series, index) => (
              <div key={series.id} className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}>
                <div className="lg:w-1/2">
                  <Image
                          fill
                    src={series.image}
                    alt={series.name}
                    className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                  />
                </div>
                <div className="lg:w-1/2">
                  <div className="max-w-lg">
                    {series.isLatest && (
                      <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                        Featured Category
                      </Badge>
                    )}
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                      {series.name}
                    </h3>
                    <p className="text-lg text-gray-600 mb-8">
                      {series.description}
                    </p>
                    <div className="flex items-center gap-4 mb-6">
                      <Badge variant="outline" className="text-sm">
                        {series.totalProducts}+ Products
                      </Badge>
                      <Badge variant="outline" className="text-sm">
                        Premium Quality
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      {series.products.slice(0, 3).map((product) => (
                        <div key={product.id} className="text-center">
                          <Image
                          fill
                            src={product.image}
                            alt={product.name}
                            className="w-full h-24 object-cover rounded-lg mb-2"
                          />
                          <p className="text-xs text-gray-700 truncate">{product.name}</p>
                          <p className="text-xs text-blue-600 font-semibold">${product.price}</p>
                        </div>
                      ))}
                    </div>
                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      View All Products
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Premium Electronics
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover the latest smartphones, laptops, audio devices, and more from top brands
            </p>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="capitalize flex items-center gap-2"
                >
                  {IconComponent && <IconComponent className="h-4 w-4" />}
                  {category.name}
                </Button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative overflow-hidden">
                  <Image
                  fill
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {product.isNew && (
                      <Badge className="bg-green-500 hover:bg-green-600">New</Badge>
                    )}
                    {product.isFeatured && (
                      <Badge className="bg-blue-500 hover:bg-blue-600">Featured</Badge>
                    )}
                    {product.discount && (
                      <Badge className="bg-red-500 hover:bg-red-600">{product.discount}% OFF</Badge>
                    )}
                  </div>
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-4 right-4 p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all"
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        favorites.has(product.id) ? 'text-red-500 fill-current' : 'text-gray-600'
                      }`}
                    />
                  </button>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <Button className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  {product.brand && (
                    <p className="text-sm text-blue-600 font-medium mb-2">{product.brand}</p>
                  )}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                  
                  {product.specifications && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {product.specifications.slice(0, 2).map((spec, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.rating && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex">{renderStars(product.rating)}</div>
                      <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {product.inStock ? (
                        <Badge className="bg-green-100 text-green-800">In Stock</Badge>
                      ) : (
                        <Badge variant="destructive">Out of Stock</Badge>
                      )}
                    </div>
                  </div>

                  {product.warranty && (
                    <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                      <Shield className="h-4 w-4" />
                      <span>{product.warranty}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="px-8">
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose FataFatSewa?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to providing the best electronics shopping experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick and reliable delivery across the country</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Warranty Protection</h3>
              <p className="text-gray-600">Comprehensive warranty on all products</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Quality</h3>
              <p className="text-gray-600">Only authentic products from trusted brands</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibent text-gray-900 mb-2">Expert Support</h3>
              <p className="text-gray-600">Dedicated customer support team</p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                About FataFatSewa
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Since {brandInfo.foundedYear}, FataFatSewa has been Nepal's trusted destination for premium electronics. 
                We specialize in bringing the latest technology and authentic products to our customers at competitive prices.
              </p>
              <div className="space-y-4">
                {brandInfo.specialties.map((specialty, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${
                      index % 3 === 0 ? 'bg-blue-500' : 
                      index % 3 === 1 ? 'bg-green-500' : 'bg-purple-500'
                    }`}></div>
                    <span className="text-lg">{specialty}</span>
                  </div>
                ))}
              </div>
              <Button size="lg" className="mt-8 bg-white text-black hover:bg-gray-100">
                Visit Our Store
              </Button>
            </div>
            <div className="relative">
              <Image
                src="https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Electronics store"
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                fill
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-600 opacity-20 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Get Latest Deals
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Subscribe to get notifications about new products, exclusive discounts, and tech news
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-lg text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4">
              Get Deals
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default page;