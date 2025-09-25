import React, { useState, useRef } from 'react';
import { Star, MessageCircle, Send, ChevronDown, ChevronUp, UserCircle, User, Battery, Wifi, Bluetooth } from 'lucide-react';
import { ProductDetails } from './page';
import ParsedContent from '../ParsedContent';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import IconRenderer from '@/app/CommonVue/CustomIconImg';



const demoReviews = [
  { author: 'John D.', rating: 5, text: 'Excellent quality and fast shipping. The product exceeded my expectations and I would definitely recommend it to others.' },
  { author: 'Sarah M.', rating: 4, text: 'Great product, exactly as described. The build quality is solid and it works perfectly for my needs.' },
  { author: 'Mike R.', rating: 5, text: 'Outstanding value for money. This has become an essential part of my daily routine.' },
];

interface MoreDetailsProductProps {
  productDesciption: ProductDetails['highlights'];
  keyFeatures?: Record<string, string>;
  ReviewsData?: any[];
}

interface Review {
  author: string;
  rating: number;
  text: string;
}

interface RatingInterface {
  rating: number;
  hoverRating: number;
  newRating: number;
  newReview: string;
  isSubmittingReview: boolean;
  commentOpen: boolean;
}

export default function MoreDetailsProduct({
  productDesciption,
  keyFeatures ,
  ReviewsData = demoReviews,
}: MoreDetailsProductProps) {
  const [Rating, setRating] = useState<RatingInterface>({
    rating: 0,
    hoverRating: 0,
    newRating: 0,
    newReview: '',
    isSubmittingReview: false,
    commentOpen: false,
  });
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showFullFeatures, setShowFullFeatures] = useState(false);
  const reviewTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!Rating.newReview.trim() || Rating.newRating === 0) return;
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

  const reviews: Review[] = ReviewsData;






  return (
    <div className="w-full max-w-7xl border-y-2 border-[var(--colour-fsP2)] mx-auto py-4 bg-white  my-1">
      {/* Description and Key Features Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-2 ">
        {/* Product Description */}
        <div className="lg:col-span-2  p-2 ">
          <h2 className="text-xl font-semibold text-gray-900 mb-4  ">Product Description</h2>
          <div
            className={`text-gray-700 text-sm leading-relaxed transition-all duration-300 ${showFullDescription ? 'max-h-none' : 'max-h-48 overflow-hidden'
              }`}
          >
            <ParsedContent description={productDesciption} />
          </div>
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="flex items-center gap-2 mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            {showFullDescription ? (
              <>
                Show Less <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Show More <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Key Features */}
        <div className="lg:col-span-2  p-2" >
          <h3 className="text-xl font-semibold text-gray-900 mb-1">Full Specifications</h3>
          <div
            className={`overflow-hidden transition-all duration-300 ${showFullFeatures ? 'max-h-none' : 'max-h-48 overflow-hidden'
              }`}
          >
           {Object.entries(keyFeatures).map(([key, value], index) => (
                <div
                  key={index}
                  className="px-4 py-3 flex items-start gap-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-36">
                    <IconRenderer iconKey={key} size={20} color="#1967b3" />
                    <h4 className="font-medium text-sm text-gray-900">{key}</h4>
                  </div>
                  <p className="text-gray-600 text-sm flex-1">{value}</p>
                </div>
              ))}
          </div>
          <button
            onClick={() => setShowFullFeatures(!showFullFeatures)}
            className="flex items-center gap-2 mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            {showFullFeatures ? (
              <>
                Show Less <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Show More <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Write a Review Button */}


        {/* Reviews List */}
        <div className="space-y-4">
          <div>
            <div className='flex flex-row justify-between'>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h3>
              {!Rating.commentOpen &&
                <div>
                  <button
                    onClick={() => setRating({ ...Rating, commentOpen: !Rating.commentOpen })}
                    className="inline-flex items-center gap-2 px-6 py-2 bg-[var(--colour-fsP2)] text-white text-sm font-medium rounded-lg hover:bg-[var(--colour-fsP1)]  transition-colors duration-200"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Write a Review
                  </button>
                </div>}
            </div>

            {/* Review Form (Conditionally Rendered) */}
            {Rating.commentOpen && (
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl px-4 py-2  transition-shadow duration-300"
              >
                {/* <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3> */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="p-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-sm"
                        onClick={() => setRating({ ...Rating, newRating: star })}
                        onMouseEnter={() => setRating({ ...Rating, hoverRating: star })}
                        onMouseLeave={() => setRating({ ...Rating, hoverRating: 0 })}
                      >
                        <Star
                          size={18}
                          className={`transition-colors duration-150 ${star <= (Rating.newRating || Rating.hoverRating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300 hover:text-gray-400'
                            }`}
                        />
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <Textarea
                      ref={reviewTextareaRef}
                      id="review-text"
                      placeholder="Tell us about your experience with this product..."
                      value={Rating.newReview}
                      onChange={(e) => setRating({ ...Rating, newReview: e.target.value })}
                      className="w-full resize-none border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 min-h-[100px] max-h-[300px] focus:ring-1 focus:ring-indigo-50 focus:border-transparent"
                      rows={4}
                      style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        whiteSpace: 'pre-wrap',
                      }}
                    />
                  </div>

                  <div className="flex flex-row justify-end gap-3">
                    <Button
                      type="submit"
                      // disabled={!Rating.newReview.trim() || Rating.newRating === 0 || Rating.isSubmittingReview}
                      className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-green-800 text-white text-sm font-medium rounded-lg hover:bg-[var(--colour-fsP1)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <Send className="w-4 h-4" />
                      Submit Review
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setRating({ ...Rating, commentOpen: false, newRating: 0, newReview: '' })}
                      className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </div>


          {demoReviews.length > 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden space-x-3  px-4 py-2  transition-all duration-300">
              {
                demoReviews.map((review, index) => (
                  <div
                    key={index}
                    className='mb-3  border-b border-gray-300'
                  >
                    <div className="flex items-center justify-between ">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src='/svgfile/menperson.svg' />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex text-yellow-400">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                size={18}
                                className={i < review.rating ? 'fill-current text-yellow-400' : 'text-gray-200'}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium text-gray-600">{review.author}</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">{new Date().toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{review.text}</p>
                  </div>
                ))
              }

            </div>

          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
              <Star className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500 text-sm">No reviews yet. Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}