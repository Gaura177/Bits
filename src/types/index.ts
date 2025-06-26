export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  isAdmin: boolean;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: 'laptops' | 'headphones' | 'accessories';
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  paymentMethod: 'card' | 'cod';
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  deliveryDate?: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  userName: string;
}