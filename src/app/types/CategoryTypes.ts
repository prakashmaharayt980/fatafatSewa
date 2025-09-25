export interface CategorySlug {
  category: {
    slug: string;
    parent_tree: string | null;
    description:string;
    title:string;
    image:{
      default:string;
      name:string;
      
    };
    productCounts:number;

  };
  products: {
    data: Array<{
      slug: string;
      highlights: string;
      emi_enabled: number;
      image: string;
      discounted_price: number;
      price: string;
      average_rating: number;
      name: string;
      

    }>;
  };
}

export interface ProductTrending {
  image: string;
  slug: string;
  price: string;
  originalPrice: string;
  discounted_price: number;
  name: string;
  reviews: string[];
  emi_enabled?: number;
  average_rating: number;
  highlights: string;
}