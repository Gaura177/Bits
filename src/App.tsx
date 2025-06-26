import React, { useState, useEffect } from 'react';
import { Star, TrendingUp, Shield, Headphones as HeadphonesIcon, Award, ArrowRight } from 'lucide-react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import AuthModal from './components/AuthModal';
import CartModal from './components/CartModal';
import ProfileModal from './components/ProfileModal';
import CheckoutModal from './components/CheckoutModal';
import AdminPanel from './components/AdminPanel';
import { useAuth, AuthProvider } from './hooks/useAuth';
import { useCart } from './hooks/useCart';
import { products } from './data/products';
import { Product, Order } from './types';

function AppContent() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<Order | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [displayProducts, setDisplayProducts] = useState(products);

  const auth = useAuth();
  const cart = useCart();

  // Load admin products on mount and when admin panel closes
  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (!showAdminPanel) {
      loadProducts();
    }
  }, [showAdminPanel]);

  const loadProducts = () => {
    const savedProducts = localStorage.getItem('adminProducts');
    if (savedProducts) {
      try {
        const parsedProducts = JSON.parse(savedProducts);
        setDisplayProducts(parsedProducts);
      } catch (error) {
        console.error('Error loading products:', error);
        setDisplayProducts(products);
      }
    } else {
      setDisplayProducts(products);
    }
  };

  const filteredProducts = selectedCategory === 'all' 
    ? displayProducts 
    : displayProducts.filter(product => product.category === selectedCategory);

  const handleAddToCart = (product: Product) => {
    if (!auth.user) {
      setAuthMode('login');
      setShowAuthModal(true);
      return;
    }
    cart.addToCart(product);
  };

  const handleBuyNow = (product: Product) => {
    if (!auth.user) {
      setAuthMode('login');
      setShowAuthModal(true);
      return;
    }
    cart.addToCart(product);
    setShowCartModal(true);
  };

  const handleCheckout = () => {
    setShowCartModal(false);
    setShowCheckoutModal(true);
  };

  const handleOrderComplete = (order: Order) => {
    setOrderSuccess(order);
    setTimeout(() => setOrderSuccess(null), 5000);
  };

  const handleProfileClick = () => {
    if (auth.user?.isAdmin) {
      setShowAdminPanel(true);
    } else {
      setShowProfileModal(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // Force re-render to show user state
    setTimeout(() => {
      window.dispatchEvent(new Event('storage'));
    }, 100);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // Smooth scroll to products section
    setTimeout(() => {
      const productsSection = document.getElementById('products-section');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleLoginClick = () => {
    setAuthMode('signup');
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onCategoryChange={handleCategoryChange}
        onLoginClick={handleLoginClick}
        onCartClick={() => setShowCartModal(true)}
        onProfileClick={handleProfileClick}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                Premium Electronics
                <br />
                For Everyone
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Discover the latest laptops, headphones, and accessories from top brands. 
                Quality guaranteed with fast shipping and excellent customer service.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => handleCategoryChange('all')}
                  className="bg-white text-orange-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center"
                >
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <button
                  onClick={() => handleCategoryChange('laptops')}
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-orange-600 transition-colors"
                >
                  Explore Categories
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-white rounded-full opacity-10 transform rotate-6"></div>
              <img
                src="https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Premium Laptop"
                className="relative z-10 rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find exactly what you're looking for in our carefully curated categories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Laptops */}
            <div className="bg-orange-50 rounded-2xl p-8 hover:shadow-lg transition-shadow cursor-pointer"
                 onClick={() => handleCategoryChange('laptops')}>
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm5.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L10.586 9 8.293 6.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Laptops</h3>
              <p className="text-gray-600 mb-6">High-performance laptops for work and gaming</p>
              <div className="text-orange-600 font-medium flex items-center">
                Browse Laptops
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </div>

            {/* Headphones */}
            <div className="bg-blue-50 rounded-2xl p-8 hover:shadow-lg transition-shadow cursor-pointer"
                 onClick={() => handleCategoryChange('headphones')}>
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-6">
                <HeadphonesIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Headphones</h3>
              <p className="text-gray-600 mb-6">Premium audio equipment for music lovers</p>
              <div className="text-blue-600 font-medium flex items-center">
                Browse Headphones
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </div>

            {/* Accessories */}
            <div className="bg-green-50 rounded-2xl p-8 hover:shadow-lg transition-shadow cursor-pointer"
                 onClick={() => handleCategoryChange('accessories')}>
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Accessories</h3>
              <p className="text-gray-600 mb-6">Essential accessories to enhance your setup</p>
              <div className="text-green-600 font-medium flex items-center">
                Browse Accessories
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="products-section" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
              <p className="text-gray-600">Hand-picked products just for you</p>
            </div>
            <button
              onClick={() => handleCategoryChange('all')}
              className="text-orange-600 hover:text-orange-700 font-medium flex items-center"
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.slice(0, 8).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose BitsHub */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose BitsHub?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the best shopping experience with quality products and exceptional service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Quality</h3>
              <p className="text-gray-600">Only authentic products from trusted brands</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Shipping</h3>
              <p className="text-gray-600">Quick delivery to your doorstep</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">Always here to help you</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Best Prices</h3>
              <p className="text-gray-600">Competitive pricing guaranteed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">B</span>
                </div>
                <span className="text-2xl font-bold">BitsHub</span>
              </div>
              <p className="text-gray-400 mb-4">
                Your trusted partner for quality electronics, laptops, accessories, and more. 
                We provide premium products with excellent customer service.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => handleCategoryChange('all')} className="hover:text-white">Home</button></li>
                <li><button onClick={() => handleCategoryChange('laptops')} className="hover:text-white">Laptops</button></li>
                <li><button onClick={() => handleCategoryChange('accessories')} className="hover:text-white">Accessories</button></li>
                <li><button onClick={() => handleCategoryChange('headphones')} className="hover:text-white">Headphones</button></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Returns & Refunds</li>
                <li>Shipping Info</li>
                <li>Warranty</li>
                <li>Contact Us</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="space-y-2 text-gray-400">
                <p>📍 HP-24 & HP-69, Bilaspur, Himachal Pradesh – 174001</p>
                <p>📞 +91 8219373551</p>
                <p>✉️ support@bitshub.com</p>
                <div className="mt-4">
                  <p className="text-orange-400 font-medium">Customer Support Hours</p>
                  <p>Monday - Friday: 9AM - 8PM</p>
                  <p>Saturday - Sunday: 10AM - 6PM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BitsHub. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Order Success Notification */}
      {orderSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50">
          <h4 className="font-semibold">Order Placed Successfully!</h4>
          <p className="text-sm">Order #{orderSuccess.id}</p>
          <p className="text-sm">Total: ₹{orderSuccess.total}</p>
        </div>
      )}

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={handleAuthSuccess}
        initialMode={authMode}
      />

      <CartModal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
        onCheckout={handleCheckout}
      />

      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />

      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        onOrderComplete={handleOrderComplete}
      />

      <AdminPanel
        isOpen={showAdminPanel}
        onClose={() => setShowAdminPanel(false)}
        onProductsUpdate={loadProducts}
      />
    </div>
  );
}

function App() {
  const authContext = useAuth();

  return (
    <AuthProvider value={authContext}>
      <AppContent />
    </AuthProvider>
  );
}

export default App;