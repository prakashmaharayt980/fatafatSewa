 export  interface bloginfointerface {
  data: Array<{
    author: string;
    content: string;
    created_at: string;
    id: number;
    slug: string;
    title: string;
    updated_at: string;
    image?: string;
    category?: string;
    readTime?: string;
  }>;
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
 }