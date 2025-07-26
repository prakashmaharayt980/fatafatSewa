import React from 'react';

const OurArticles = () => {
  const articles = [
    {
      id: 1,
      title: "Lorem Ipsum dolor sit",
      content: "Lorem Ipsum dolor sit amet, consectetur adipiscing elit. Quisque mauris elit, suscipit et amet vulputate non, auctor nec mi. From placerat eu dolor quis pulvinar. Nunc in arcu libero. From ultrices dui et pharetra lacinia. dolor lao ultricies ipsum, eget suscipit nunc justo vel mi, integer ut lorem vulputate, imperdiet ante vitae, varius metus."
    },
    {
      id: 2,
      title: "Lorem Ipsum dolor sit",
      content: "Lorem Ipsum dolor sit amet, consectetur adipiscing elit. Quisque mauris elit, suscipit et amet vulputate non, auctor nec mi. From placerat eu dolor quis pulvinar. Nunc in arcu libero. From ultrices dui et pharetra lacinia. dolor lao ultricies ipsum, eget suscipit nunc justo vel mi, integer ut lorem vulputate, imperdiet ante vitae, varius metus."
    },
    {
      id: 3,
      title: "Lorem Ipsum dolor sit",
      content: "Lorem Ipsum dolor sit amet, consectetur adipiscing elit. Quisque mauris elit, suscipit et amet vulputate non, auctor nec mi. From placerat eu dolor quis pulvinar. Nunc in arcu libero. From ultrices dui et pharetra lacinia. dolor lao ultricies ipsum, eget suscipit nunc justo vel mi, integer ut lorem vulputate, imperdiet ante vitae, varius metus."
    },
    {
      id: 4,
      title: "Lorem Ipsum dolor sit",
      content: "Lorem Ipsum dolor sit amet, consectetur adipiscing elit. Quisque mauris elit, suscipit et amet vulputate non, auctor nec mi. From placerat eu dolor quis pulvinar. Nunc in arcu libero. From ultrices dui et pharetra lacinia. dolor lao ultricies ipsum, eget suscipit nunc justo vel mi, integer ut lorem vulputate, imperdiet ante vitae, varius metus."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-center mb-6">
          <div className="flex-1 h-1 bg-blue-500"></div>
          <h2 className="px-6 text-2xl font-bold text-gray-900">Our Articles</h2>
          <div className="flex-1 h-1 bg-blue-500"></div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12">
        {articles.map((article, index) => (
          <div 
            key={article.id} 
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group overflow-hidden border border-gray-100"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Phone Image */}
            <div className="mb-6 relative overflow-hidden">
              <div className="bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 rounded-t-xl p-6 h-40 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex gap-2 relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                  {/* Enhanced Phone mockups with realistic design */}
                  <div className="relative">
                    <div className="w-7 h-12 bg-gradient-to-b from-gray-600 to-gray-800 rounded-lg shadow-md border border-gray-700"></div>
                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-3 h-5 bg-gray-900 rounded-sm"></div>
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-700 rounded-full"></div>
                  </div>
                  <div className="relative">
                    <div className="w-7 h-12 bg-gradient-to-b from-gray-900 to-black rounded-lg shadow-md"></div>
                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-3 h-5 bg-gray-800 rounded-sm"></div>
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-600 rounded-full"></div>
                  </div>
                  <div className="relative">
                    <div className="w-7 h-12 bg-gradient-to-b from-gray-300 to-gray-500 rounded-lg shadow-md border border-gray-400"></div>
                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-3 h-5 bg-gray-600 rounded-sm"></div>
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                  <div className="relative">
                    <div className="w-7 h-12 bg-gradient-to-b from-yellow-400 to-yellow-700 rounded-lg shadow-md border border-yellow-600"></div>
                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-3 h-5 bg-yellow-800 rounded-sm"></div>
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-600 rounded-full"></div>
                  </div>
                  <div className="relative">
                    <div className="w-7 h-12 bg-gradient-to-b from-gray-200 to-gray-400 rounded-lg shadow-md border border-gray-300"></div>
                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-3 h-5 bg-gray-500 rounded-sm"></div>
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-300 rounded-full"></div>
                  </div>
                  <div className="relative">
                    <div className="w-7 h-12 bg-gradient-to-b from-gray-800 to-black rounded-lg shadow-md"></div>
                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-3 h-5 bg-gray-900 rounded-sm"></div>
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-700 rounded-full"></div>
                  </div>
                </div>
                
                {/* Floating elements for visual enhancement */}
                <div className="absolute top-4 right-4 w-3 h-3 bg-blue-400 rounded-full opacity-60 animate-pulse"></div>
                <div className="absolute bottom-4 left-4 w-2 h-2 bg-purple-400 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>

            {/* Article Content */}
            <div className="px-6 pb-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300 line-height-tight">
                {article.title}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4 line-clamp-4 group-hover:text-gray-700 transition-colors duration-300">
                {article.content}
              </p>
              
              {/* Read More Button */}
              <div className="flex items-center justify-between">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                  Read More
                  <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                </button>
                <div className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Hover overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"></div>
          </div>
        ))}
      </div>

      {/* Enhanced Pagination Dots */}
      <div className="flex justify-center gap-3 mb-12">
        <button className="w-3 h-3 bg-blue-500 rounded-full shadow-md hover:bg-blue-600 transition-all duration-300 hover:scale-125"></button>
        <button className="w-3 h-3 bg-gray-300 rounded-full hover:bg-gray-400 transition-all duration-300 hover:scale-110"></button>
        <button className="w-3 h-3 bg-gray-300 rounded-full hover:bg-gray-400 transition-all duration-300 hover:scale-110"></button>
        <button className="w-3 h-3 bg-gray-300 rounded-full hover:bg-gray-400 transition-all duration-300 hover:scale-110"></button>
        <button className="w-3 h-3 bg-gray-300 rounded-full hover:bg-gray-400 transition-all duration-300 hover:scale-110"></button>
      </div>

      {/* Enhanced Bottom Article Section */}
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6 sm:p-8 lg:p-10 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
              Lorem Ipsum
            </h3>
          </div>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 text-justify">
              Lorem Ipsum dolor sit amet, consectetur adipiscing elit. Quisque mauris elit, suscipit et amet vulputate non, auctor nec mi. From placerat eu dolor quis pulvinar. Nunc in arcu libero. From ultrices dui et pharetra lacinia. dolor lao ultricies ipsum, eget suscipit nunc justo vel mi, integer ut lorem vulputate, imperdiet ante vitae, varius metus. Ut magna urna, gravida nec tortor quis, ultricies pulvinar lacus. Aenean vel elit, ornare vel metus at, porttitor sagittis ante.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:scale-105 group">
              Read More
              <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
            </button>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Published
              </span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurArticles;