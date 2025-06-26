import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'MacBook Pro 16" M3 Max',
    price: 2499,
    originalPrice: 2799,
    discount: 11,
    category: 'laptops',
    image: 'https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 4.8,
    reviews: 0,
    inStock: true,
    description: 'Powerful MacBook Pro with M3 Max chip for professional workflows'
  },
  {
    id: '2',
    name: 'Dell XPS 13 Plus',
    price: 1299,
    originalPrice: 1499,
    discount: 13,
    category: 'laptops',
    image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=500',
    rating: 4.5,
    reviews: 0,
    inStock: true,
    description: 'Ultra-thin laptop with premium design and performance'
  },
  {
    id: '3',
    name: 'Gaming Laptop ASUS ROG',
    price: 1899,
    category: 'laptops',
    image: 'https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 4.7,
    reviews: 0,
    inStock: true,
    description: 'High-performance gaming laptop with RGB lighting'
  },
  {
    id: '4',
    name: 'Sony WH-1000XM5',
    price: 399,
    originalPrice: 449,
    discount: 11,
    category: 'headphones',
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 4.6,
    reviews: 0,
    inStock: true,
    description: 'Premium wireless noise-canceling headphones'
  },
  {
    id: '5',
    name: 'AirPods Pro 2nd Gen',
    price: 249,
    category: 'headphones',
    image: 'https://images.pexels.com/photos/8867482/pexels-photo-8867482.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 4.4,
    reviews: 0,
    inStock: true,
    description: 'Advanced wireless earbuds with active noise cancellation'
  },
  {
    id: '6',
    name: 'Wireless Mouse Pro',
    price: 79,
    originalPrice: 99,
    discount: 20,
    category: 'accessories',
    image: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 4.2,
    reviews: 0,
    inStock: true,
    description: 'Ergonomic wireless mouse with precision tracking'
  },
  {
    id: '7',
    name: 'Mechanical Keyboard RGB',
    price: 159,
    category: 'accessories',
    image: 'https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 4.5,
    reviews: 0,
    inStock: true,
    description: 'Premium mechanical keyboard with RGB backlighting'
  },
  {
    id: '8',
    name: 'USB-C Hub 7-in-1',
    price: 49,
    category: 'accessories',
    image: 'https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&w=500',
    rating: 4.3,
    reviews: 0,
    inStock: true,
    description: 'Versatile USB-C hub with multiple ports and fast charging'
  }
];