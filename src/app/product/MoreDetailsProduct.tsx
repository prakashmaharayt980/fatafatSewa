import React, {  useMemo, useRef, useState } from 'react';
import { FileText, Star, Truck, MessageCircle, SendIcon, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductDetails } from './[id]/page';
import parse, { domToReact, HTMLReactParserOptions, Element, DOMNode } from 'html-react-parser';

import DOMPurify from 'dompurify';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
interface BrowserStyleTabsProps {
    productDesciption: ProductDetails['description'];
    keyFeatures: ProductDetails['attributes']['product_attributes'];
    ReviewsData: ProductDetails['reviews']
}


// First, let's define better types for the table elements
type TableElement = Element & {
    children: DOMNode[];
    attribs?: {
        class?: string;
        'data-list'?: string;
    };
};

type TableCellData = {
    data?: string;
    type?: string;
    children?: DOMNode[];
};


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

export default function BrowserStyleTabs({ productDesciption, keyFeatures, ReviewsData }: BrowserStyleTabsProps) {
    const [Rating, setRating] = useState<ratingInterface>({
        rating: 0,
        hoverRating: 0,
        newRating: 0,
        newReview: '',
        isSubmittingReview: false,
        commentOpen: false

    });
    const reviewTextareaRef = useRef<HTMLTextAreaElement | null>(null);

    const parsedContent = useMemo(() => {

        if (!productDesciption.trim()) {
            return <p className="text-gray-500 text-base italic">No content available.</p>;
        }

        const options: HTMLReactParserOptions = {
            replace: (domNode: DOMNode) => {
                if (domNode.type !== 'tag') return undefined;

                const element = domNode as TableElement;

                if (element.attribs?.class === 'quill-better-table-wrapper') {
                    const firstChild = element.children[0] as TableElement;
                    if (!firstChild || firstChild.type !== 'tag') return <></>;

                    const table = firstChild.children as TableElement[];
                    const thead = (table[0] as TableElement)?.children || [];
                    const tbody = (table[1] as TableElement)?.children || [];

                    return (
                        <div className="overflow-x-auto my-6">
                            <table className="w-full border-collapse border border-gray-200">
                                <thead>
                                    <tr className="bg-gray-50">
                                        {thead
                                            .filter((th): th is TableElement => (th as TableElement).type === 'tag')
                                            .map((th: TableElement, index) => (
                                                <th
                                                    key={index}
                                                    className="border border-gray-200 p-4 text-left font-semibold text-gray-800 text-sm uppercase tracking-wider"
                                                    scope="col"
                                                >
                                                    {(th.children[0] as TableCellData)?.data
                                                        ? parse(DOMPurify.sanitize((th.children[0] as TableCellData).data || ''))
                                                        : domToReact(th.children, options) || 'N/A'}
                                                </th>
                                            ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {tbody
                                        .filter((tr): tr is TableElement => (tr as TableElement).type === 'tag')
                                        .map((tr: TableElement, rowIndex) => (
                                            <tr key={rowIndex} className="hover:bg-gray-100 transition-colors">
                                                {tr.children
                                                    .filter((td): td is TableElement => (td as TableElement).type === 'tag')
                                                    .map((td: TableElement, colIndex) => (
                                                        <td key={colIndex} className="border border-gray-200 p-4 text-gray-700 text-base">
                                                            {(td.children[0] as TableCellData)?.data
                                                                ? parse(DOMPurify.sanitize((td.children[0] as TableCellData).data || ''))
                                                                : domToReact(td.children, options) || 'N/A'}
                                                        </td>
                                                    ))}
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    );
                }

                // Handle <h2> tags
                if (element.name === 'h2') {
                    return (
                        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4 tracking-tight">
                            {domToReact(element.children, options) || 'Untitled Section'}
                        </h2>
                    );
                }

                // Handle <ul> tags
                if (element.name === 'ul') {
                    return (
                        <ul className="list-disc pl-8 space-y-3 my-6">
                            {domToReact(element.children, options)}
                        </ul>
                    );
                }

                // Handle <li> tags
                if (element.attribs?.['data-list'] === 'bullet') {
                    return (
                        <li className="text-gray-700 text-base leading-relaxed">
                            {domToReact(element.children, options)}
                        </li>
                    );
                }

                return undefined;
            },
        };

        // Sanitize and parse the HTML content
        return parse(DOMPurify.sanitize(productDesciption), options);
    }, [productDesciption]);


    const handleSubmit = (e ) => {
        e.preventDefault();
        if (!Rating.newReview.trim() || Rating.newRating === 0) {
            return;
        }
        setRating({ ...Rating, isSubmittingReview: true });

        // Simulate a network request



    }

    const reviews: Review[] = [
        { author: 'John D.', rating: 5, text: 'Excellent quality and fast shipping. Highly recommended!' },
        { author: 'Sarah M.', rating: 4, text: 'Great product, exactly as described. Would buy again.' },
    ];




    return (
        <div className="">
            <div className=" border-b border-gray-200 rounded-b-2xl bg-white p-2">
                <Tabs defaultValue="description" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 gap-2 bg-gray-50 mb-3">
                        <TabsTrigger
                            value="description"
                            className="flex items-center justify-center gap-2 px-4 py-2 text-gray-700 font-medium text-base rounded-lg hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800 transition-colors duration-200"
                            aria-label="View Description"
                        >
                            <FileText className="w-4 h-4 text-current" />
                            Description
                        </TabsTrigger>
                        <TabsTrigger
                            value="reviews"
                            className="flex items-center justify-center gap-2 px-4 py-2 text-gray-700 font-medium text-base rounded-lg hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800 transition-colors duration-200"
                            aria-label="View Reviews"
                        >
                            <Star className="w-4 h-4 text-current" />
                            Reviews
                        </TabsTrigger>
                        <TabsTrigger
                            value="KeyFeatures"
                            className="flex items-center justify-center gap-2 px-4 py-2 text-gray-700 font-medium text-base rounded-lg hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800 transition-colors duration-200"
                            aria-label="View Key Features"
                        >
                            <Truck className="w-4 h-4 text-current" />
                            Key Features
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="description">
                        {productDesciption && parsedContent}

                    </TabsContent>

                    <TabsContent value="reviews">


                        <div className="space-y-6 p-6 bg-white rounded-xl shadow-md border border-gray-200">
                            {/* Header */}


                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-semibold text-gray-900 tracking-tight">Customer Reviews</h3>
                                {
                                    !Rating.commentOpen && (
                                        <button
                                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                            aria-label="Open Review Feed"
                                            onClick={() => setRating({ ...Rating, commentOpen: !Rating.commentOpen })}
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                            <span className="text-sm font-medium">Open Review Feed</span>
                                        </button>
                                    )
                                }
                            </div>
                            {/* Review Submission Form */}
                            {
                                Rating.commentOpen && (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="flex items-center space-x-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    className={`text-2xl focus:outline-none ${star <= (Rating.newRating || Rating.hoverRating) ? 'text-yellow-400 fill-yellow-500' : 'text-gray-300'
                                                        }`}
                                                    onClick={() => setRating({ ...Rating, newRating: star })}
                                                    onMouseEnter={() => setRating({ ...Rating, hoverRating: star })}
                                                    onMouseLeave={() => setRating({ ...Rating, hoverRating: 0 })}
                                                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                                                    aria-pressed={star === (Rating.newRating || Rating.hoverRating)}
                                                >
                                                    <Star
                                                        size={20}
                                                        className={star <= (Rating.newRating || Rating.hoverRating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
                                                    />
                                                </button>
                                            ))}


                                        </div>
                                        <div className="flex space-x-3">


                                            <Textarea
                                                ref={reviewTextareaRef}
                                                id="review-text"
                                                placeholder="Share your experience with this product..."
                                                value={Rating.newReview}
                                                onChange={(e) => setRating({ ...Rating, newReview: e.target.value })}

                                                className="flex-1 min-h-[120px] p-3  rounded-lg text-gray-700  focus:border-none focus:outline-none focus:border-transparent "
                                                disabled={Rating.isSubmittingReview}
                                                aria-label="Review comment"
                                            />

                                            <div className="flex space-y-3 flex-col">
                                                <Button
                                                    type="submit"
                                                    disabled={!Rating.newReview.trim() || Rating.newRating === 0}
                                                    aria-busy={Rating.isSubmittingReview}
                                                    className='flex items-center justify-center px-4 py-2 text-blue-800  rounded-lg  hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
                                                >
                                                    <SendIcon className="w-4 h-4 mr-2" />
                                                    {Rating.isSubmittingReview ? "Submitting..." : "Submit Review"}
                                                </Button>
                                                <Button
                                                    type="submit"

                                                    aria-busy={Rating.isSubmittingReview}
                                                    onClick={() => setRating({ ...Rating, commentOpen: !Rating.commentOpen })}
                                                    className='flex items-center justify-center px-4 py-2  text-red-700 hover:bg-gray-300 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Close   Review
                                                </Button>
                                            </div>
                                        </div>
                                    </form>
                                )
                            }

                            {/* Existing Reviews */}
                            <div className="space-y-4">
                                {reviews.length > 0 ? (
                                    reviews.map((review, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <div className="flex text-yellow-400 text-lg">
                                                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                                </div>
                                                <span className="text-sm text-gray-600">by {review.author}</span>
                                            </div>
                                            <p className="text-gray-700 text-base leading-relaxed">{review.text}</p>




                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-base italic">No reviews yet. Be the first to share your thoughts!</p>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="KeyFeatures">
                        <div className="space-y-6 bg-white p-6 rounded-lg  border-none ">
                            <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                                Key Features
                            </h3>
                            <ul className="list-disc pl-6 space-y-3">
                                {Object.entries(keyFeatures).map(([key, value], index) => (
                                    <li
                                        key={index}
                                        className="text-gray-700 text-base leading-relaxed"
                                    >
                                        <span className="font-semibold">{key}: </span>
                                        <span>{value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}