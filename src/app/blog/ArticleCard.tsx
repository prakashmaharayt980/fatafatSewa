const ArticleCard = ({ article }) => {


    return (
      <article className="border-b border-gray-300 pb-4 mb-4">
        <div className="text-xs font-bold text-blue-700 mb-1 uppercase tracking-wide">
          {article.category}
        </div>
        <h3 className={`font-bold text-[var(--colour-fsP1)]  leading-tight mb-2 font-serif hover:text-blue-700 cursor-pointer text-lg md:text-xl`}>
          {article.title}
        </h3>
        <div className="flex items-center text-xs text-[var(--colour-fsP2)]  mb-2">
          <span className="mr-3">{article.author}</span>
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
  };


  export default ArticleCard