import React, { useState } from 'react';
import { Search, Calendar, User, Clock, Tag, ChevronLeft, ChevronRight } from 'lucide-react';

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 12;

  // Sample blog data - replace with your actual data
  const blogArticles = [
    {
      id: 1,
      title: "The Future of Web Development: Trends to Watch in 2024",
      content: "Web development continues to evolve rapidly, with new frameworks, tools, and methodologies emerging constantly. In this comprehensive guide, we explore the most significant trends that are shaping the industry and what developers should focus on to stay competitive.",
      author: "John Smith",
      created_at: "2024-01-15",
      category: "Technology",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop",
      tags: ["Web Development", "Technology", "Trends"]
    },
    {
      id: 2,
      title: "Sustainable Business Practices: A Guide for Modern Companies",
      content: "As environmental consciousness grows, businesses are increasingly adopting sustainable practices. This article explores practical strategies companies can implement to reduce their environmental impact while maintaining profitability and growth.",
      author: "Sarah Johnson",
      created_at: "2024-01-12",
      category: "Business",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=250&fit=crop",
      tags: ["Sustainability", "Business", "Environment"]
    },
    {
      id: 3,
      title: "The Psychology of User Experience Design",
      content: "Understanding human psychology is crucial for creating effective user experiences. This deep dive explores cognitive principles, behavioral patterns, and design psychology that can significantly improve user engagement and satisfaction.",
      author: "Mike Chen",
      created_at: "2024-01-10",
      category: "Design",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
      tags: ["UX Design", "Psychology", "User Research"]
    },
    {
      id: 4,
      title: "Artificial Intelligence in Healthcare: Current Applications",
      content: "AI is revolutionizing healthcare through improved diagnostics, personalized treatment plans, and operational efficiency. We examine current applications and future possibilities of AI in medical practice.",
      author: "Dr. Emily Rodriguez",
      created_at: "2024-01-08",
      category: "Healthcare",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
      tags: ["AI", "Healthcare", "Innovation"]
    },
    {
      id: 5,
      title: "Digital Marketing Strategies for Small Businesses",
      content: "Small businesses face unique challenges in digital marketing. This comprehensive guide provides actionable strategies and cost-effective solutions to help small businesses compete in the digital marketplace.",
      author: "Lisa Anderson",
      created_at: "2024-01-05",
      category: "Marketing",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
      tags: ["Digital Marketing", "Small Business", "Strategy"]
    },
    {
      id: 6,
      title: "Cybersecurity Best Practices for Remote Work",
      content: "With remote work becoming the norm, cybersecurity has never been more critical. Learn essential security measures and best practices to protect your organization's data and systems.",
      author: "David Kim",
      created_at: "2024-01-03",
      category: "Technology",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=400&h=250&fit=crop",
      tags: ["Cybersecurity", "Remote Work", "Security"]
    }
  ];

  const categories = ["All", "Technology", "Business", "Design", "Healthcare", "Marketing"];

  const stripHtml = (html) => {
    if (!html) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const images = tempDiv.querySelectorAll('img');
    images.forEach(img => img.remove());
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredArticles = blogArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const currentArticles = filteredArticles.slice(startIndex, startIndex + articlesPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Blog</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover insights, trends, and expert perspectives on technology, business, and innovation
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
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
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {currentArticles.length} of {filteredArticles.length} articles
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {currentArticles.map((article) => (
            <article
              key={article.id}
              className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-[1.02] overflow-hidden cursor-pointer"
            >
              {/* Article Image */}
              <div className="relative">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-44 object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                    {article.category}
                  </span>
                </div>
              </div>

              {/* Article Content */}
              <div className="p-4">
                {/* Title */}
                <h2 className="font-serif text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
                  {article.title}
                </h2>

                {/* Meta Information */}
                <div className="flex items-center justify-between mb-3 text-xs">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3 text-blue-600" />
                    <span className="text-blue-600 font-medium uppercase tracking-wide">
                      {article.author}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-gray-500" />
                    <span className="text-gray-500">
                      {formatDate(article.created_at)}
                    </span>
                  </div>
                </div>

                {/* Content Preview */}
                <p className="text-gray-700 text-sm leading-relaxed line-clamp-3 font-light mb-3">
                  {article.content.length > 120
                    ? `${article.content.substring(0, 120)}...`
                    : article.content}
                </p>

                {/* Read Time */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{article.readTime}</span>
                  </div>
                  <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
                    Read More →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* No Articles Message */}
        {currentArticles.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-600 mb-2">No Articles Found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;