'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, ShoppingCart, Star, Truck, Shield, MessageCircleQuestionMark } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import ChatBot from '@/app/chatbot'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import Image from 'next/image'

interface CategorySlug {
  name: string;
  description: string;
  slug: string;
  image: Array<{
    name: string;
    url: string;
    id: number;
  }>;
  products: Array<{
    id: number;
    name: string;
    hightlight: string;
    slug: string;
    price: number;
    discounted_price: number;
    quantity: number;
    emi_enabled: boolean;
    wishlisted: boolean;
    imageurl: string;
  }>;
  filteredproductkeyword?: string[];
  Brand: Array<{
    id: number;
    name: string;
    slug: string;
    imageurl: string;
    products: Array<{
      id: number;
      name: string;
      hightlight: string;
      slug: string;
      price: number;
      discounted_price: number;
      quantity: number;
      emi_enabled: boolean;
      wishlisted: boolean;
      imageurl: string;
    }>;
  }>;
  children: Array<{
    id: number;
    name: string;
    slug: string;
    imageurl: string;
    products: Array<{
      id: number;
      name: string;
      hightlight: string;
      slug: string;
      price: number;
      discounted_price: number;
      quantity: number;
      emi_enabled: boolean;
      wishlisted: boolean;
      imageurl: string;
    }>;
  }>;
}

const mockCategoryData: CategorySlug = {
  name: "Electronics & Accessories",
  description: "<p>Discover the latest in technology with our premium collection of electronics and accessories. From cutting-edge headphones to innovative gadgets, find everything you need to stay connected and entertained.</p>",
  slug: "electronics-accessories",
  image: [
    {
      id: 1,
      name: "Category Hero",
      url: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=600&fit=crop"
    },
    {
      id: 2,
      name: "Category Hero",
      url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop"
    },
    {
      id: 3,
      name: "Category Hero",
      url: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop"
    }
  ],
  products: [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      hightlight: "<p>Crystal clear sound with active noise cancellation</p>",
      slug: "premium-wireless-headphones",
      price: 15999,
      discounted_price: 12999,
      quantity: 50,
      emi_enabled: true,
      wishlisted: false,
      imageurl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      name: "Smart Fitness Watch",
      hightlight: "<p>Track your health with advanced sensors</p>",
      slug: "smart-fitness-watch",
      price: 8999,
      discounted_price: 7499,
      quantity: 30,
      emi_enabled: true,
      wishlisted: true,
      imageurl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      name: "Professional Camera",
      hightlight: "<p>Capture memories in stunning 4K quality</p>",
      slug: "professional-camera",
      price: 45999,
      discounted_price: 39999,
      quantity: 15,
      emi_enabled: true,
      wishlisted: false,
      imageurl: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop"
    },
    {
      id: 4,
      name: "Gaming Mechanical Keyboard",
      hightlight: "<p>RGB backlit with mechanical switches</p>",
      slug: "gaming-keyboard",
      price: 6999,
      discounted_price: 5499,
      quantity: 25,
      emi_enabled: false,
      wishlisted: false,
      imageurl: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop"
    },
    {
      id: 5,
      name: "Wireless Charging Pad",
      hightlight: "<p>Fast wireless charging for all devices</p>",
      slug: "wireless-charging-pad",
      price: 2999,
      discounted_price: 2299,
      quantity: 100,
      emi_enabled: false,
      wishlisted: true,
      imageurl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop"
    },
    {
      id: 6,
      name: "Bluetooth Speaker",
      hightlight: "<p>Portable speaker with 360-degree sound</p>",
      slug: "bluetooth-speaker",
      price: 4999,
      discounted_price: 3999,
      quantity: 40,
      emi_enabled: false,
      wishlisted: false,
      imageurl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop"
    }
  ],
  Brand: [
    {
      id: 1,
      name: "Apple",
      slug: "apple",
      imageurl: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
      products: [
        {
          id: 1,
          name: "iPhone 14 Pro",
          hightlight: "<p>Latest model with A16 chip</p>",
          slug: "iphone-14-pro",
          price: 99999,
          discounted_price: 89999,
          quantity: 10,
          emi_enabled: true,
          wishlisted: false,
          imageurl: "https://images.unsplash.com/photo-1590658165737-15a047b1dd19?w=400&h=300&fit=crop"
        },
        {
          id: 2,
          name: "MacBook Pro 16",
          hightlight: "<p>Powerful laptop with M1 chip</p>",
          slug: "macbook-pro-16",
          price: 199999,
          discounted_price: 179999,
          quantity: 5,
          emi_enabled: true,
          wishlisted: true,
          imageurl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop"
        }
      ]
    },
    {
      id: 2,
      name: "Samsung",
      slug: "samsung",
      imageurl: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
      products: []
    },
    {
      id: 3,
      name: "Sony",
      slug: "sony",
      imageurl: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg",
      products: [
        {
          id: 3,
          name: "Sony WH-1000XM4",
          hightlight: "<p>Industry-leading noise cancellation</p>",
          slug: "sony-wh-1000xm4",
          price: 29999,
          discounted_price: 24999,
          quantity: 20,
          emi_enabled: true,
          wishlisted: false,
          imageurl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop"
        }
      ]
    }
  ],
  children: [
    {
      id: 1,
      name: "Audio",
      slug: "audio",
      imageurl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop",
      products: [
        {
          id: 7,
          name: "Premium Earbuds",
          hightlight: "<p>True wireless with noise cancellation</p>",
          slug: "premium-earbuds",
          price: 9999,
          discounted_price: 7999,
          quantity: 35,
          emi_enabled: true,
          wishlisted: false,
          imageurl: "https://images.unsplash.com/photo-1590658165737-15a047b1dd19?w=400&h=300&fit=crop"
        }
      ]
    },
    {
      id: 2,
      name: "Smart Devices",
      slug: "smart-devices",
      imageurl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop",
      products: [
        {
          id: 8,
          name: "Smart Home Hub",
          hightlight: "<p>Control all your smart devices</p>",
          slug: "smart-home-hub",
          price: 12999,
          discounted_price: 10999,
          quantity: 20,
          emi_enabled: true,
          wishlisted: true,
          imageurl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop"
        }
      ]
    },
    {
      id: 3,
      name: "Gaming",
      slug: "gaming",
      imageurl: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=200&h=200&fit=crop",
      products: [
        {
          id: 9,
          name: "Gaming Mouse",
          hightlight: "<p>High precision optical gaming mouse</p>",
          slug: "gaming-mouse",
          price: 3999,
          discounted_price: 2999,
          quantity: 60,
          emi_enabled: false,
          wishlisted: false,
          imageurl: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=300&fit=crop"
        }
      ]
    }
  ],
  filteredproductkeyword: [
    "wireless",
    "noise cancellation",
    "smart",
    "gaming",
    "premium"
  ]
};

export default function CategoryPageWithChatbot() {
  const [data] = useState<CategorySlug>(mockCategoryData);
  const [filteredProducts, setFilteredProducts] = useState(data.products);
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string }[]>([
    { sender: 'bot', text: 'Just ask me!' }
  ]);
  const [chatOpen, setChatOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [heroImgIdx, setHeroImgIdx] = useState(0);
  const [imgAnimating, setImgAnimating] = useState(false);

  const [priceRange, setPriceRange] = useState([0, 100000])
  const minPrice = 0
  const maxPrice = 100000
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculateDiscount = (price: number, discountedPrice: number) => {
    return Math.round(((price - discountedPrice) / price) * 100);
  };

  const handleChatSubmit = () => {
    if (!userInput.trim()) return;

    const newMessages = [...chatMessages, { sender: 'user', text: userInput }];
    setChatMessages(newMessages);

    // Simple filtering logic based on user input
    const query = userInput.toLowerCase();
    const allProducts = [
      ...data.products,
      ...data.Brand.flatMap(brand => brand.products),
      ...data.children.flatMap(child => child.products)
    ];

    const filtered = allProducts.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.hightlight.toLowerCase().includes(query)
    );

    setFilteredProducts(filtered.length > 0 ? filtered : data.products);
    setChatMessages([...newMessages, {
      sender: 'bot',
      text: filtered.length > 0
        ? `Found ${filtered.length} products matching "${userInput}"!`
        : `No products found for "${userInput}". Showing all products.`
    }]);
    setUserInput('');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setImgAnimating(true);
      setTimeout(() => {
        setHeroImgIdx((prev) => (prev + 1) % data.image.length);
        setImgAnimating(false);
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImgIdx, data.image.length]);

  const ProductCard = ({ product }: { product: any }) => (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-background to-muted/30 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 animate-fade-in">
      <div className="relative overflow-hidden">
        <div className="aspect-square overflow-hidden">
          <img
            src={product.imageurl || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {product.discounted_price < product.price && (
          <div className="absolute top-4 left-4 animate-scale-in">
            <Badge className="bg-gradient-to-r from-sale to-sale/80 text-white font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
              {calculateDiscount(product.price, product.discounted_price)}% OFF
            </Badge>
          </div>
        )}
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-4 right-4 backdrop-blur-sm bg-white/10 border-white/20 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-white/20"
        >
          <Heart className="h-4 w-4" />
        </Button>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            variant="secondary"
            className="backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
          >
            Quick View
          </Button>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg leading-tight text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
            {product.name}
          </h3>
          {product.hightlight && (
            <div
              className="text-sm text-muted-foreground prose prose-sm max-w-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2"
              dangerouslySetInnerHTML={{ __html: product.hightlight }}
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-4 w-4 fill-warning text-warning group-hover:scale-110 transition-transform duration-200"
                style={{ transitionDelay: `${i * 50}ms` }}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">(4.8)</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-foreground bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {formatPrice(product.discounted_price)}
            </span>
            {product.discounted_price < product.price && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          {product.emi_enabled && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span>EMI from ₹{Math.round(product.discounted_price / 12)}/month</span>
            </div>
          )}
        </div>
        <div className="flex gap-3 pt-2">
          <Button
            size="lg"
            className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative">
      {/* Hero Section */}
      <div className="py-8 bg-[var(--colour-bg4)] overflow-hidden px-10">
        <div className="container mx-auto px-4 bg-[var(--colour-bg4)]">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1 text-inherit">
              <h1 className="text-3xl lg:text-4xl font-bold italic mb-4 text-foreground">
                {data.name}
              </h1>
              <div
                className="text-muted-foreground mb-6 max-w-2xl prose prose-sm"
                dangerouslySetInnerHTML={{ __html: data.description }}
              />
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="inline-flex items-center gap-1 px-4 py-1 border rounded-full text-[var(--colour-btn1)]">
                  <Truck className="w-4 h-4 mr-0.5" />
                  Free Shipping
                </div>
                <div className="inline-flex items-center gap-1 px-4 py-1 border rounded-full text-[var(--colour-btn1)]">
                  <Shield className="h-4 w-4" />
                  1 Year Warranty
                </div>
              </div>
            </div>
            {data.image.length > 0 && (
              <div className="w-full lg:w-80 h-64 lg:h-80 flex flex-col items-center justify-center relative">
                <img
                  key={heroImgIdx}
                  src={data.image[heroImgIdx].url}
                  alt={data.image[heroImgIdx].name}
                  className={
                    "w-full h-full object-cover rounded-lg transition-all duration-300 ease-in-out " +
                    (imgAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100")
                  }
                  style={{ position: "absolute", inset: 0 }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* key word to filter */}
      <div className="container flex flex-row mx-auto   w-full justify-center gap-4 mb-8">
        {
          data.filteredproductkeyword.map((keyword, index) => (
            <div key={index} className="relative  cursor-pointer text-black border-none rounded-2xl hover:scale-105 bg-[var(--colour-bg4)] top-4 left-4 ">
              <Badge className="  font-bold px-3 py-1 rounded-full shadow-lg ">
                {keyword}
              </Badge>
            </div>
          ))

        }
      </div>

      {/* brand */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-foreground">Brands</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.Brand.map((brand) => (
            <Card key={brand.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="flex flex-col items-center text-center">
                <Image
                  src={brand.imageurl}
                  alt={brand.name}
                  className="w-full h-32 object-contain mb-4"
                  width={128}
                  height={128}
                />
                <h3 className="text-lg font-semibold text-foreground">{brand.name}</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {brand.products.length} products
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* <div className="w-full  p-6 bg-white items-center  rounded-lg shadow-md">
      
        <div className="space-y-4 max-w-md mx-auto">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={minPrice}
            max={maxPrice}
            step={100}
            className="w-full bg-gray-200 rounded-lg h-2 text-amber-500"
            
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>
      </div> */}

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>




    </div>
  );
}