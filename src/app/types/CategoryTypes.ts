export interface CategorySlug {
  category: {
    slug: string;
    parent_tree: string | null;
    descriptions:string;
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