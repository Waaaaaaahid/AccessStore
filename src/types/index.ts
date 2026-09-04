export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  original_price: number | null;
  discount_percentage: number;
  category_id: string;
  image_url: string;
  images: string[];
  rating: number;
  review_count: number;
  stock: number;
  is_featured: boolean;
  is_new: boolean;
  variants: string[];
  sizes: string[];
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  variant?: string;
}

export interface Order {
  id: string;
  order_id: string;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  apartment: string | null;
  city: string;
  state: string;
  pincode: string;
  total_amount: number;
  subtotal: number;
  discount: number;
  coupon_code: string | null;
  payment_status: string;
  order_status: string;
  payment_method: string | null;
  estimated_delivery: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
  size: string | null;
  variant: string | null;
}

export interface Payment {
  id: string;
  order_id: string;
  payment_method: string;
  amount: number;
  status: string;
  transaction_id: string | null;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  min_order: number;
  max_uses: number | null;
  used_count: number;
  active: boolean;
  expires_at: string | null;
}

export interface Review {
  id: string;
  product_id: string;
  name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface SupportPayment {
  id: string;
  name: string | null;
  email: string | null;
  amount: number;
  payment_method: string;
  message: string | null;
  status: string;
  created_at: string;
}

export interface SiteSettings {
  [key: string]: string;
}
