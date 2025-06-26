import React, { useState } from 'react';
import { Star, ShoppingCart, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onBuyNow }) => {
  const [showAddedBubble, setShowAddedBubble] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    setShowAddedBubble(true);
    
    // Add to cart
    onAddToCart(product);
    
    // Keep bubble visible for 2 seconds
    setTimeout(() => {
      setShowAddedBubble(false);
      setIsAdding(false);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative">
      {/* Discount Badge */}
      {product.discount && (
        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium z-10">
          -{product.discount}%
        </div>
      )}

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-medium text-gray-900">
              {product.rating}
            </span>
          </div>
          <span className="ml-2 text-sm text-gray-500">
            ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center mb-4">
          <span className="text-2xl font-bold text-gray-900">
            ₹{product.price}
          </span>
          {product.originalPrice && (
            <span className="ml-2 text-lg text-gray-500 line-through">
              ₹{product.originalPrice}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="mb-4">
          <span className={`text-sm font-medium ${
            product.inStock ? 'text-green-600' : 'text-red-600'
          }`}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <div className="relative">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock || isAdding}
              className="w-full flex items-center justify-center px-4 py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </button>
            
            {/* Center Screen Bubble */}
            {showAddedBubble && (
              <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center animate-bounce">
                <Check className="h-5 w-5 mr-2" />
                Added to Cart!
              </div>
            )}
          </div>
          
          <button
            onClick={() => onBuyNow(product)}
            disabled={!product.inStock}
            className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;