import React, { useState, useRef } from 'react';
import { FileText, Star, Truck, MessageCircle, Send, X } from 'lucide-react';
import { ProductDetails } from './page';



const Textarea = ({ className = '', ...props }) => {
  return (
    <textarea
      className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};

const ParsedContent = ({ description }) => (
  <div className="prose prose-sm max-w-none">
    {Array.isArray(description) ? (
      <ul className="space-y-2">
        {description.map((item, index) => (
          <li key={index} className="text-gray-700 leading-relaxed">{item}</li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-700 leading-relaxed">{description}</p>
    )}
  </div>
);



const mockKeyFeatures = {
  "Material": "Premium Grade Steel",
  "Dimensions": "12 x 8 x 4 inches",
  "Weight": "2.5 lbs",
  "Warranty": "2 years manufacturer warranty",
  "Color Options": "Black, Silver, Blue",
  "Compatibility": "Universal fit"
};

const mockReviews = [
  { author: 'John D.', rating: 5, text: 'Excellent quality and fast shipping. The product exceeded my expectations and I would definitely recommend it to others.' },
  { author: 'Sarah M.', rating: 4, text: 'Great product, exactly as described. The build quality is solid and it works perfectly for my needs.' },
  { author: 'Mike R.', rating: 5, text: 'Outstanding value for money. This has become an essential part of my daily routine.' }
];

interface MoreDetailsProductProps {
  productDesciption?: ProductDetails['highlights'];
  keyFeatures?: Record<string, string>;
  ReviewsData?: any[];
}

interface Review {
  author: string;
  rating: number;
  text: string;
}

interface ratingInterface {
  rating: number;
  hoverRating: number;
  newRating: number;
  newReview: string;
  isSubmittingReview: boolean;
  commentOpen: boolean;
}

export default function MoreDetailsProduct({ 
  productDesciption , 
  keyFeatures = mockKeyFeatures, 
  ReviewsData = mockReviews 
}: MoreDetailsProductProps) {
  const [activeTab, setActiveTab] = useState('description');
  const [Rating, setRating] = useState<ratingInterface>({
    rating: 0,
    hoverRating: 0,
    newRating: 0,
    newReview: '',
    isSubmittingReview: false,
    commentOpen: false,
  });
  const reviewTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!Rating.newReview.trim() || Rating.newRating === 0) {
      return;
    }
    setRating({ ...Rating, isSubmittingReview: true });
    
    // Simulate submission
    setTimeout(() => {
      setRating({
        rating: 0,
        hoverRating: 0,
        newRating: 0,
        newReview: '',
        isSubmittingReview: false,
        commentOpen: false,
      });
    }, 1500);
  };

  const reviews: Review[] = mockReviews;

  const tabs = [
    { id: 'description', label: 'Description', icon: <FileText className="w-4 h-4" /> },
    { id: 'reviews', label: 'Reviews', icon: <Star className="w-4 h-4" /> },
    { id: 'KeyFeatures', label: 'Key Features', icon: <Truck className="w-4 h-4" /> },
  ];

  return (
    <div className="w-full max-w-8xl mx-auto">
      {/* Professional Tab Navigation */}
     <div className="flex justify-center  mb-3">
          <div className="flex space-x-3 w-full bg-white rounded-full p-2 shadow-lg border border-slate-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-6 py-2 rounded-full transition-all duration-300 text-sm font-medium capitalize ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                aria-label={`View ${tab.label}`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

      {/* Tab Content */}
      <div className="tab-content px-6">
        {activeTab === 'description' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Product Description</h2>
            <ParsedContent description={productDesciption} />
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">Customer Reviews</h2>
              {!Rating.commentOpen && (
                <button
                  onClick={() => setRating({ ...Rating, commentOpen: true })}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                >
                  <MessageCircle className="w-4 h-4" />
                  Write Review
                </button>
              )}
            </div>

            {/* Review Form */}
            {Rating.commentOpen && (
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Share Your Experience</h3>
                  <button
                    onClick={() => setRating({ ...Rating, commentOpen: false })}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {/* Star Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                          onClick={() => setRating({ ...Rating, newRating: star })}
                          onMouseEnter={() => setRating({ ...Rating, hoverRating: star })}
                          onMouseLeave={() => setRating({ ...Rating, hoverRating: 0 })}
                        >
                          <Star
                            size={20}
                            className={`transition-colors ${
                              star <= (Rating.newRating || Rating.hoverRating)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300 hover:text-gray-400'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Review Text */}
                  <div>
                    <label htmlFor="review-text" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Review
                    </label>
                    <Textarea
                      ref={reviewTextareaRef}
                      id="review-text"
                      placeholder="Tell us about your experience with this product..."
                      value={Rating.newReview}
                      onChange={(e) => setRating({ ...Rating, newReview: e.target.value })}
                      className="w-full"
                      rows={4}
                      disabled={Rating.isSubmittingReview}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      onClick={()=>handleSubmit}
                      disabled={!Rating.newReview.trim() || Rating.newRating === 0 || Rating.isSubmittingReview}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <Send className="w-4 h-4" />
                      {Rating.isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRating({ ...Rating, commentOpen: false, newRating: 0, newReview: '' })}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow duration-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex text-yellow-400">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < review.rating ? 'fill-current' : 'text-gray-200'}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-600">by {review.author}</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.text}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Star className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No reviews yet. Be the first to share your thoughts!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'KeyFeatures' && (
          <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Key Features</h3>
                            <ul className="list-disc pl-6 space-y-4 text-gray-700 text-base">
                                {Object.entries(keyFeatures).map(([key, value], index) => (
                                    <li key={index} className="leading-relaxed">
                                        <span className="font-semibold">{key}: </span>
                                        <span>{value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
        )}
      </div>
    </div>
  );
}
