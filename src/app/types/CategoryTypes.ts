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


export interface CategoryTypes {
    categories: Array<{
    id: number;
    title: string;
    slug: string;
    parent_id: number | null;
    parent_tree: string | null;
    children: CategoryTypes['categories'];
    image: {
      name: string;
      default: string;
      original: string;
      preview: string;
      thumbnail: string;
      is_default: boolean;
    }

    created_at?: string;
    updated_at?: string;
  }>;
}

// ProductDetails interface based on API response
export interface ProductDetails {
  id: number;
  name: string;
  slug: string;
  price: number;
  pre_order: number;
  pre_order_price: number | null;
  quantity: number;
  discounted_price: number;
  emi_enabled: number;
  brand: {
    id: number;
    name: string;
    slug: string;
    status: string;
    brand_image: {
      full: string;
      thumb: string;
    };
  };
  image: string;
  reviews: [];
  highlights: string;
  attributes: Record<string, string>;
  average_rating: number;
  categories: Array<{
    id: number;
    title: string;
    slug: string;
    image: {
      full: string;
      thumb: string;
      preview: string;
    };
  }>;
  variants: Array<{
    id: number;
    product_id: number;
    quantity: number;
    price: number;
    attributes: {
      Color: string;
      image?: string; // Optional image per variant
    };
    created_at: string;
    updated_at: string;
    storage?:string;
  }>;
  discountcampaign: {
    id: number;
    product_id: number;
    discount_type: number;
    discount_value: number;
    campaign_id: number;
    created_at: string;
    updated_at: string;
    campaign: {
      id: number;
      title: string;
      slug: string;
      start_date: string;
      end_date: string;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
      is_active: boolean;
    };
  } | null;
}