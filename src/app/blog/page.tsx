'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { Search, Calendar, User } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from '@/components/ui/pagination';
import RemoteServices from '../api/remoteservice';
import Image from 'next/image';
import { CompanyLogo } from '../CommonVue/Payment';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { formatDate, stripHtml } from '../CommonVue/datetime';
import { bloginfointerface } from '../types/Blogtypes';


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
  const regularArticles = filteredArticles.slice(1, 5);
  const regularArticleswithimg = filteredArticles.slice(6, 7);
  const regularArticleswithimgHroizental = filteredArticles.slice(7, 9);
  const regularArticleswithimgHroizentalrev = filteredArticles.slice(9, 10);
  const lastarticlesup = filteredArticles.slice(10, 14);
  const lastarticlesdown = filteredArticles.slice(14);

  const handleblogdetails = (slug: string) => {
    router.push(`/blog/blogDetails/${slug}`)
  }

  const FeaturedArticle = ({ article }) => (
    <article className="border-b-2 border-gray-300 pb-6 mb-4 cursor-pointer" onClick={() => handleblogdetails(article.slug)}>
      <div className="text-xs font-bold text-[var(--colour-fsP1)] uppercase tracking-wide">
        Mobile • BREAKING NEWS
      </div>
      <h1 className="text-2xl md:text-5xl font-bold text-[var(--colour-fsP2)] leading-tight mb-2 font-serif">
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
      <button className="text-blue-700 font-semibold hover:underline">
        Continue Reading →
      </button>
    </article>
  );

  const ArticleCard = ({ article }) => (
    <article className="border-b border-gray-300 pb-4 mb-4 cursor-pointer" onClick={() => handleblogdetails(article.slug)}>
      {/* <div className="text-xs font-bold text-blue-700 mb-1 uppercase tracking-wide">
        {article.category || 'General'}
      </div> */}
      <h3 className={`font-bold text-black/70 leading-tight mb-2 font-serif hover:text-[var(--colour-fsP2)] cursor-pointer text-lg md:text-xl`}>
        {article.title}
      </h3>
      <div className="flex items-center text-xs text-[var(--colour-fsP2)] mb-2">
        <span className="mr-3">{article.author || 'Unknown Author'}</span>
        <span className="mr-3">•</span>
        <span>{formatDate(article.created_at)}</span>
      </div>
      <p className={`text-gray-700 leading-relaxed font-serif text-base`}>
        {stripHtml(article.content).length > 200
          ? `${stripHtml(article.content).substring(0, 200)}...`
          : stripHtml(article.content)}
      </p>
    </article>
  );

  const ArticleCardImg = ({ article, classtitle }) => (
    <article className="border-gray-300  hover:scale-105 mb-4 cursor-pointer" onClick={() => handleblogdetails(article.slug)}>
      <div className=" relative overflow-hidden ">
        <Image
          src={CompanyLogo}
          alt={article.title}
          width={100}
          height={100}
          className="w-full object-contain h-40 md:h-56 "
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />

      </div>

      <h3 className={cn(
        "font-bold text-[var(--colour-fsP2)] leading-tight mb-1 font-serif hover:text-blue-700 cursor-pointer  transition-colors duration-200",
        classtitle
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
      <p className="text-gray-700 leading-relaxed font-serif text-base">
        {stripHtml(article.content).length > 300
          ? `${stripHtml(article.content).substring(0, 300)}...`
          : stripHtml(article.content)}
      </p>
    </article>
  );



  const ArticlecardImgHorizontal = ({ article, classparent }) => (
    <article className="border-gray-300 pb-4 mb-4 group cursor-pointer" onClick={() => handleblogdetails(article.slug)}>
      <div className={cn(
        "flex  gap-4",
        classparent
      )}>
        <div className="w-1/3 flex-shrink-0">
          <div className="relative overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300 h-full">
            <Image
              src={CompanyLogo}
              alt={article.title}
              width={100}
              height={100}
              className="w-full h-full object-contain min-h-[120px] md:min-h-[150px] group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>
        <div className="w-2/3 flex flex-col justify-between">

          <h3 className="font-bold text-[var(--colour-fsP2)] leading-tight mb-3 font-serif hover:text-blue-700 cursor-pointer text-lg md:text-xl transition-colors duration-200">
            {article.title}
          </h3>
          <p className="text-gray-700 leading-relaxed font-serif text-sm md:text-base mb-3 flex-grow">
            {stripHtml(article.content).length > 400
              ? `${stripHtml(article.content).substring(0, 400)}...`
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Navigation */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex rounded-full border border-gray-200 bg-gray-50/50 w-full md:w-96 overflow-hidden focus-within:ring-2 focus-within:ring-blue-300">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none"
              />
              <button className="bg-blue-600 text-white px-4 py-2 m-0.5 hover:bg-blue-700 transition-colors rounded-full flex items-center justify-center">
                <Search className="w-5 h-5" />
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

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
            <div className="flex flex-row gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-3/5">
                {regularArticles.map((article) => (
                  <div key={article.id} className="w-full">
                    <ArticleCard article={article} />
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-4 w-2/5">
                {regularArticleswithimg.map((article) => (
                  <div key={article.id} className="w-full">
                    <ArticleCardImg article={article} classtitle='text-xl md:text-2xl' />
                  </div>
                ))}
              </div>
            </div>

            <div>
              {
                regularArticleswithimgHroizental.map((article) => (
                  <div key={article.id} className="w-full">
                    <ArticlecardImgHorizontal article={article} classparent="flex-row" />
                  </div>
                ))
              }
              {
                regularArticleswithimgHroizentalrev.map((article) => (
                  <div key={article.id} className="w-full">
                    <ArticlecardImgHorizontal article={article} classparent="flex-row-reverse" />
                  </div>
                ))
              }
            </div>


            <hr className="border-t border-gray-300 mb-3 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {lastarticlesup.map((article) => (
                <div key={article.id} className="w-full">
                  <ArticleCardImg article={article} classtitle='text-lg md:text-xl' />
                </div>
              ))}
            </div>
            <hr className="border-t border-gray-300 mb-3 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {lastarticlesdown.map((article) => (
                <div key={article.id} className="w-full">
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>
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