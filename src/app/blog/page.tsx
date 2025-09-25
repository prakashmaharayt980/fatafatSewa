'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { Search, Calendar, User, Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react';
import FeaturedPage from './FeaturedPage';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from '@/components/ui/pagination';
import RemoteServices from '../api/remoteservice';
import Image from 'next/image';
import { CompanyLogo } from '../CommonVue/Payment';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { formatDate, stripHtml } from '../CommonVue/datetime';
import { bloginfointerface } from '../types/Blogtypes';
import BlogHeader from './BlogHeader';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import iconlist, { imglist } from '../CommonVue/Image';
import { Button } from '@/components/ui/button';



const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [bloginfo, setBloginfo] = useState<bloginfointerface | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter()

  const categories = ["All", "Mobile Phone", "Laptops", "Office Parts", "Accessories", "Finicails", "Community"];



  const fetchBlogs = async (page: number, category: string, search: string) => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page,
        category: category === 'All' ? undefined : category,
        search: search || undefined,
      };
      const response = await RemoteServices.BlogsAll();
      setBloginfo(response);
    } catch (err) {
      setError('Failed to fetch articles. Please try again later.');
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(currentPage, selectedCategory, searchTerm);
  }, [currentPage, selectedCategory, searchTerm]);

  const filteredArticles = bloginfo?.data?.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stripHtml(article.content).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const totalPages = bloginfo?.meta?.last_page || 1;
  const featuredArticle = filteredArticles[0];
  const regularArticles = filteredArticles.slice(1, 3);
  const regularArticleswithimg = filteredArticles.slice(6, 11);
  const regularArticleswithimgHroizental = filteredArticles.slice(7, 9);
  const regularArticleswithimgHroizentalrev = filteredArticles.slice(9, 10);
  const lastarticlesup = filteredArticles.slice(10, 14);
  const lastarticlesdown = filteredArticles.slice(14);

  const handleblogdetails = (slug: string) => {
    router.push(`/blog/blogDetails/${slug}`)
  }

  const FeaturedArticle = ({ article }) => (
    <article className=" border-gray-300 pb-6 mb-1 cursor-pointer" onClick={() => handleblogdetails(article.slug)}>

      <h1 className="text-3xl  font-bold text-[var(--colour-fsP2)] leading-tight mb-2 font-serif">
        {article.title}
      </h1>
      <div className="flex items-center text-sm text-gray-600 mb-2 font-medium">
        <span className="mr-4">By {article.author}</span>
        <span className="mr-4">|</span>
        <span>{formatDate(article.created_at)}</span>
      </div>
      <p className="text-lg leading-relaxed text-gray-800 mb-2 font-serif">
        {stripHtml(article.content).length > 300
          ? `${stripHtml(article.content).substring(0, 350)}...`
          : stripHtml(article.content)}
      </p>
      <button className="text-blue-700 text-sm font-semibold hover:underline">
        Continue Reading →
      </button>
    </article>
  );



  const Topbanner = ({ article }) => (
    <article className="border-gray-300   cursor-pointer" onClick={() => handleblogdetails(article.slug)}>
      <div className=" relative overflow-hidden h-56 ">
        <Image
          src={imglist.urlimg2}
          alt={article.title}

          className="w-full h-full  object-fill transition-transform duration-500 group-hover:scale-105"
          fill
          quality={100}
        />

      </div>

      <div className='flex flex-row items-center gap-3 mt-2'>
        <Avatar>
          <AvatarImage src={iconlist.meniconimg} alt={article.title} />
        </Avatar>
        <div className='flex flex-col'>
          <h3 className={cn(
            "font-bold text-[var(--colour-fsP2)] leading-tight mb-1 font-serif hover:text-blue-700 cursor-pointer  transition-colors duration-200",

          )}>
            {article.title}
          </h3>
          <div className={cn(
            "flex items-center  text-gray-500  text-xs",

          )}>
            <span className="mr-3">{article.author || 'Unknown Author'}</span>
            <span className="mr-3">•</span>
            <span>{formatDate(article.created_at)}</span>
          </div>
        </div>
      </div>

    </article>
  );
  const ArticleCardImg = ({ article }) => (
    <article className="border-gray-300   cursor-pointer" onClick={() => handleblogdetails(article.slug)}>
      <div className=" relative overflow-hidden rounded-xl p-4">
        <Image
          src={'https://fatafatsewa.com/storage/media/1641/apr-pod-banner-min.png'}
          alt={article.title}
          width={100}
          height={100}
          className="w-full object-contain rounded-lg overflow-hidden h-40 md:h-56 "
        
        />

      </div>
      <div className='flex flex-col justify-center text-center gap-1'>

        <h3 className={cn(
          "font-bold text-[var(--colour-fsP2)] text-2xl leading-tight mb-1 font-serif hover:text-blue-700 cursor-pointer  transition-colors duration-200",

        )}>
          {article.title}
        </h3>
        <div className={cn(
          "flex items-center justify-center  text-gray-500  text-xs",

        )}>
          <span className="mr-3">{article.author || 'Unknown Author'}</span>
          <span className="mr-3">•</span>
          <span>{formatDate(article.created_at)}</span>
        </div>
        <p className="text-gray-700 text-start px-2 leading-relaxed font-serif text-base">
          {stripHtml(article.content).length > 200
            ? `${stripHtml(article.content).substring(0, 200)}...`
            : stripHtml(article.content)}
        </p>
      </div>
    </article>
  );



  const ArticlecardImgHorizontal = ({ article, }) => (
    <article className="border-gray-300 pb-4 mb-1 group cursor-pointer" onClick={() => handleblogdetails(article.slug)}>
      <div className={cn(
        "flex  gap-4",

      )}>
        <div className="w-1/3 flex-shrink-0">
          <div className="relative overflow-hidden p-3 rounded-lg  transition-all duration-300 h-24">
            <Image
              src={imglist.urlimg2}
              alt={article.title}

              className="w-full h-full object-conver transition-transform duration-500"
              fill
            />

          </div>
        </div>
        <div className="w-2/3 flex flex-col justify-between">

          <h3 className="font-bold text-[var(--colour-fsP2)] leading-tight mb-1 font-serif hover:text-blue-700 cursor-pointer text-sm  transition-colors duration-200">
            {article.title}
          </h3>
          <p className="text-gray-700 leading-relaxed font-serif text-xs md:text-base mb-1 flex-grow">
            {stripHtml(article.content).length > 100
              ? `${stripHtml(article.content).substring(0, 100)}...`
              : stripHtml(article.content)}
          </p>
          <div className="flex items-center text-xs text-[var(--colour-fsP1)] mt-auto">
            <span className="mr-3">{article.author || 'Unknown Author'}</span>
            <span className="mr-3">•</span>
            <span>{formatDate(article.created_at)}</span>
          </div>
        </div>
      </div>
    </article>
  );

  const generatePaginationItems = () => {
    const items = [];
    const showPages = 3;
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    const endPage = Math.min(totalPages, startPage + showPages - 1);

    if (endPage - startPage < showPages - 1) {
      startPage = Math.max(1, endPage - showPages + 1);
    }

    if (startPage > 1) {
      items.push(
        <PaginationItem key="start-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <PaginationItem key={page}>
          <PaginationLink
            href="#"
            isActive={currentPage === page}
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage(page);
            }}
            className={`border border-gray-300 transition-colors ${currentPage === page ? 'bg-[var(--colour-fsP2)] text-white' : 'text-black hover:bg-gray-100'}`}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      items.push(
        <PaginationItem key="end-ellipsis" >
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    return items;
  };

  const socialIcons = [
    { Icon: Facebook, url: "#", color: "hover:text-blue-600" },
    { Icon: Twitter, url: "#", color: "hover:text-sky-500" },
    { Icon: Instagram, url: "#", color: "hover:text-pink-600" },
    { Icon: Youtube, url: "#", color: "hover:text-red-600" },
    { Icon: Linkedin, url: "#", color: "hover:text-blue-700" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-2 py-4">



        {/* Articles Layout */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--colour-fsP2)]"></div>
            <p className="mt-4 text-gray-600 font-serif">Loading articles...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 border-4 border-black bg-white">
            <h2 className="text-3xl font-bold text-black mb-4 font-serif">Error</h2>
            <p className="text-gray-600 font-serif">{error}</p>
          </div>
        ) : filteredArticles.length > 0 ? (
          <>
            {featuredArticle && <FeaturedArticle article={featuredArticle} />}
            {/* Featured Content Section */}
            <div className='flex flex-row gap-3  max-w-[1400px] mx-auto'>
              {/* Featured Articles Grid */}
              <div className="w-2/3 bg-white rounded-2xl shadow-lg overflow-hidden  transform  transition-all duration-300 border border-gray-100">

                <div className="grid grid-cols-2 gap-2 p-2">
                  {regularArticles.map((article) => (
                    <div key={article.id} className="group cursor-pointer">
                      <div className="relative overflow-hidden rounded-xl bg-gray-50  transition-all duration-300">
                        <div className="aspect-w-16 aspect-h-9">
                          <Topbanner article={article} />
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advertisement Panel */}
              <div className="w-1/3 rounded-2xl shadow-lg overflow-hidden group bg-cover bg-no-repeat   transform -translate-y-1 transition-all duration-300"
                style={{
                  backgroundImage: `url(${imglist.urlimg2})`,

                }}
              >

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="absolute bottom-0 left-0 right-0 bg-white/70 p-4  transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <Button className="inline-block cursor-pointer px-3 py-1 bg-white/90 rounded-full text-xs font-semibold text-[var(--colour-fsP2)] mb-1">
                      shop Now
                    </Button>
                    <div className='p-2 rounded'>
                      <h2 className="text-2xl font-bold font-serif ">Exclusive Offer!</h2>
                      <p className="text-sm ">
                        Discover our latest collection with unbeatable discounts. Shop now and elevate your style!
                      </p>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            <div className="my-24 justify-center flex flex-col items-center align-middle">
              <h4 className="text-[var(--colour-fsP2)] font-semibold text-xl mb-4 text-center lg:text-left">Let&apos;s Connect Us</h4>
              <div className="flex gap-3 justify-center lg:justify-start">
                {socialIcons.map(({ Icon, url, color }, index) => (
                  <a
                    key={index}
                    href={url}
                    className={`w-11 h-11 bg-white rounded-full flex items-center justify-center text-gray-600 ${color} transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 hover:scale-105`}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Featured Articles Section */}
            <FeaturedPage articles={regularArticleswithimg} />

            <div>
              <div className="relative">
                <h2 className="text-xl font-bold text-gray-900 font-serif heading-title relative inline-block  px-4 mb-2">
                  Mobile Articles
                </h2>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-5 gap-6  mx-auto my-8'>
                <div className='col-span-2  border border-gray-100 rounded-lg p-2 overflow-hidden shadow-sm'>
                  {regularArticleswithimgHroizental && <ArticleCardImg article={featuredArticle} />}
                </div>

                <div className='col-span-3 border border-gray-100 rounded-lg px-2 my-auto overflow-hidden shadow-sm'>
                  {
                    regularArticleswithimg.slice(0, 4).map((article) => (
                      <div key={article.id} className="w-full">
                        <ArticlecardImgHorizontal article={article} />
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>

               <FeaturedPage articles={regularArticleswithimg} />

            <div>
              <div className="relative">
                <h2 className="text-xl font-bold text-gray-900 font-serif heading-title relative inline-block  px-4 mb-2">
                  News Articles
                </h2>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-5 gap-6  mx-auto my-8'>
            

                <div className='col-span-3 border border-gray-100 rounded-lg px-2 my-auto overflow-hidden shadow-sm'>
                  {
                    regularArticleswithimg.slice(0, 4).map((article) => (
                      <div key={article.id} className="w-full">
                        <ArticlecardImgHorizontal article={article} />
                      </div>
                    ))
                  }
                </div>

                    <div className='col-span-2  border border-gray-100 rounded-lg p-2 overflow-hidden shadow-sm'>
                  {regularArticleswithimgHroizental && <ArticleCardImg article={featuredArticle} />}
                </div>
              </div>
            </div>




   <FeaturedPage articles={regularArticleswithimg} />




            {totalPages > 1 && (
              <div className="mt-8 pt-6 border-t-2 border-gray-300">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(prev => Math.max(prev - 1, 1));
                        }}
                        className={`border border-gray-300 transition-colors ${currentPage === totalPages ? 'pointer-events-none opacity-50' : 'text-[var(--colour-fsP1)] hover:text-[var(--colour-fsP2)]'}`}
                      >
                        ← Previous
                      </PaginationPrevious>
                    </PaginationItem>
                    {generatePaginationItems()}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(prev => Math.min(prev + 1, totalPages));
                        }}
                        className={`border border-gray-300 transition-colors ${currentPage === totalPages ? 'pointer-events-none opacity-50' : 'text-[var(--colour-fsP1)] hover:text-[var(--colour-fsP2)]'}`}
                      >
                        Next →
                      </PaginationNext>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-gradient-to-b from-gray-50 to-white min-h-[300px] flex flex-col items-center justify-center rounded-lg ">
            {/* Icon */}
            <div className="mb-4">
              <Search className="text-5xl text-gray-400" aria-hidden="true" />
            </div>
            {/* Title */}
            <h2 className="text-3xl font-bold text-[var(--colour-fsP2)] mb-3 font-serif tracking-tight">
              No Articles Found
            </h2>
            {/* Description */}
            <p className="text-gray-500 text-lg font-serif max-w-md mx-auto">
              It looks like we couldn’t find any articles. Try adjusting your search or filter criteria to explore more content.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;