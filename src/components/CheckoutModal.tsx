import React, { useState, useRef } from 'react';
import { X, CreditCard, Truck, MapPin, User, Phone } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderComplete: (order: Order) => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onOrderComplete }) => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user, updateProfile } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');
  const [loading, setLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const addressFormRef = useRef<HTMLDivElement>(null);
  
  const [addressData, setAddressData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || ''
  });

  const codFee = 5;
  const total = getCartTotal() + (paymentMethod === 'cod' ? codFee : 0);

  const isProfileComplete = () => {
    return addressData.name && addressData.phone && addressData.street && 
           addressData.city && addressData.state && addressData.pincode;
  };

  const handleSaveAddress = () => {
    if (user) {
      updateProfile({
        name: addressData.name,
        phone: addressData.phone,
        address: {
          street: addressData.street,
          city: addressData.city,
          state: addressData.state,
          pincode: addressData.pincode
        }
      });
      setShowAddressForm(false);
    }
  };

  const scrollToTop = () => {
    const modal = document.querySelector('.checkout-modal');
    if (modal) {
      modal.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePlaceOrder = async () => {
    if (!user || !isProfileComplete()) {
      setShowAddressForm(true);
      // Scroll to top where address form will appear
      setTimeout(() => {
        scrollToTop();
      }, 100);
      return;
    }

    setLoading(true);

    try {
      const order: Order = {
        id: Date.now().toString(),
        userId: user.id,
        items: cartItems,
        total,
        paymentMethod,
        status: 'pending',
        createdAt: new Date(),
        address: {
          street: addressData.street,
          city: addressData.city,
          state: addressData.state,
          pincode: addressData.pincode
        }
      };

      // Save order to localStorage
      const savedOrders = localStorage.getItem('orders');
      const orders = savedOrders ? JSON.parse(savedOrders) : [];
      orders.push(order);
      localStorage.setItem('orders', JSON.stringify(orders));

      clearCart();
      onOrderComplete(order);
      onClose();
    } catch (error) {
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto checkout-modal">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Address Form Modal */}
          {showAddressForm && (
            <div ref={addressFormRef} className="mb-6 p-4 border-2 border-orange-200 rounded-lg bg-orange-50">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-orange-500" />
                Complete Your Address
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <User className="h-4 w-4 inline mr-1" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={addressData.name}
                      onChange={(e) => setAddressData({ ...addressData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Phone className="h-4 w-4 inline mr-1" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={addressData.phone}
                      onChange={(e) => setAddressData({ ...addressData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressData.street}
                    onChange={(e) => setAddressData({ ...addressData, street: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter your street address"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={addressData.city}
                      onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter your city"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={addressData.state}
                      onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter your state"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={addressData.pincode}
                      onChange={(e) => setAddressData({ ...addressData, pincode: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter PIN code"
                    />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={handleSaveAddress}
                    disabled={!isProfileComplete()}
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                  >
                    Save Address
                  </button>
                  <button
                    onClick={() => setShowAddressForm(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex justify-between">
                  <span>{item.product.name} × {item.quantity}</span>
                  <span>₹{item.product.price * item.quantity}</span>
                </div>
              ))}
              <div className="border-t pt-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{getCartTotal()}</span>
                </div>
                {paymentMethod === 'cod' && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Cash on Delivery Fee</span>
                    <span>₹{codFee}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          {isProfileComplete() && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Delivery Address</h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">{addressData.name}</p>
                <p>{addressData.phone}</p>
                <p>{addressData.street}</p>
                <p>{addressData.city}, {addressData.state} - {addressData.pincode}</p>
              </div>
              <button
                onClick={() => setShowAddressForm(true)}
                className="mt-2 text-orange-500 hover:text-orange-600 text-sm font-medium"
              >
                Edit Address
              </button>
            </div>
          )}

          {/* Payment Method */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
            <div className="space-y-3">
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'card' | 'cod')}
                  className="mr-3"
                />
                <CreditCard className="h-5 w-5 mr-3 text-blue-500" />
                <div>
                  <p className="font-medium">Credit/Debit Card</p>
                  <p className="text-sm text-gray-600">Pay securely with your card</p>
                </div>
              </label>
              
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'card' | 'cod')}
                  className="mr-3"
                />
                <Truck className="h-5 w-5 mr-3 text-green-500" />
                <div>
                  <p className="font-medium">Cash on Delivery</p>
                  <p className="text-sm text-gray-600">Pay when you receive (₹5 extra)</p>
                </div>
              </label>
            </div>
          </div>

          {/* Order Terms */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Order Terms</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Orders can be cancelled within 24 hours</li>
              <li>• Free shipping on orders above ₹500</li>
              <li>• 7-day return policy available</li>
            </ul>
          </div>

          {/* Place Order Button */}
          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Placing Order...' : `Place Order - ₹${total}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;