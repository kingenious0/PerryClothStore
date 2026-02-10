export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category_id: string;
  stock: number;
  variants?: {
    [key: string]: string[];
  };
  created_at?: string;
};

export type Category = {
  id: string;
  name: string;
  created_at?: string;
};

export type Order = {
  id: string;
  customer_name: string;
  customer_email: string;
  items: { product_id: string; quantity: number; size?: string; color?: string }[];
  total: number;
  status: 'Pending' | 'Shipped' | 'Delivered';
  created_at: string;
};

export type CartItem = {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
};
