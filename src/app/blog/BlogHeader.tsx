import { Badge } from "@/components/ui/badge";
import { Clock, User, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { stripHtml } from "../CommonVue/datetime";


const FeaturedBlogCard = ({ 
article
}) => {
  // const gradientClass = gradient === "primary" ? "bg-hero-gradient" : "bg-secondary-gradient";
  
  return (
    <div className={`relative rounded-2xl overflow-hidden h-96 group cursor-pointer transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1`}>
      <div className={`absolute inset-0  opacity-90`} />
      <img 
        src={article.image ||'https://fatafatsewa.com/storage/media/9772/conversions/Samung-Banner-thumb.jpg'} 
        alt={article.title}
        className="absolute inset-0 w-full h-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
      />
      
      <div className="relative z-10 h-full flex flex-col justify-between p-8 text-white">
        <div>
          {/* <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30">
            {category}
          </Badge> */}
          
          <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight line-clamp-3">
            {article.title}
          </h2>
          
            <p className={`text-gray-700 leading-relaxed font-serif text-base`}>
                {stripHtml(article.content).length > 200
                  ? `${stripHtml(article.content).substring(0, 200)}...`
                  : stripHtml(article.content)}
              </p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-white/80">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{article.readTime}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-white" />
              <span>{article.rating}</span>
            </div>
          </div>
          
          <Button variant="ghost" className="text-white hover:bg-white/20 p-2">
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedBlogCard;