import React, { useState, useEffect } from 'react';
import { X, User, MapPin, Phone, Mail, Package, Calendar, Clock, Plus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Order } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile, logout } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [showAddAddress, setShowAddAddress] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        pincode: user.address?.pincode || ''
      });

      // Load user orders
      try {
        const savedOrders = localStorage.getItem('orders');
        if (savedOrders) {
          const allOrders = JSON.parse(savedOrders);
          const myOrders = allOrders.filter((order: Order) => order.userId === user.id);
          setUserOrders(myOrders);
        }
      } catch (error) {
        console.error('Error loading orders:', error);
      }
    }
  }, [user, isOpen]);

  const handleSave = () => {
    if (user) {
      updateProfile({
        name: formData.name,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        }
      });
      setIsEditing(false);
      setShowAddAddress(false);
    }
  };

  const isProfileComplete = () => {
    return formData.name && formData.phone && formData.street && 
           formData.city && formData.state && formData.pincode;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  const getProgressWidth = (status: string) => {
    switch (status) {
      case 'pending': return 'w-1/4';
      case 'confirmed': return 'w-2/4';
      case 'shipped': return 'w-3/4';
      case 'delivered': return 'w-full';
      default: return 'w-0';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-blue-500';
      case 'shipped': return 'bg-purple-500';
      case 'delivered': return 'bg-green-500';
      default: return 'bg-red-500';
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Information */}
            <div>
              {/* Profile Status */}
              <div className="mb-6 p-4 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Profile Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isProfileComplete() 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {isProfileComplete() ? 'Complete' : 'Incomplete'}
                  </span>
                </div>
                {!isProfileComplete() && (
                  <p className="text-sm text-gray-600 mt-2">
                    Please complete your profile to proceed with orders.
                  </p>
                )}
              </div>

              {/* Account Info */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-orange-500" />
                  Account Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Mail className="h-4 w-4 inline mr-1" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing && !showAddAddress}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                        (isEditing || showAddAddress) ? 'focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-50'
                      }`}
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-orange-500" />
                  Contact Information
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing && !showAddAddress}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                      (isEditing || showAddAddress) ? 'focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-50'
                    }`}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-orange-500" />
                    Address Information
                  </h3>
                  {!isEditing && !showAddAddress && (
                    <button
                      onClick={() => setShowAddAddress(true)}
                      className="flex items-center text-orange-500 hover:text-orange-600 text-sm font-medium"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Address
                    </button>
                  )}
                </div>
                
                {(showAddAddress || formData.street) && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        disabled={!isEditing && !showAddAddress}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                          (isEditing || showAddAddress) ? 'focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-50'
                        }`}
                        placeholder="Enter your street address"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          disabled={!isEditing && !showAddAddress}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                            (isEditing || showAddAddress) ? 'focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-50'
                          }`}
                          placeholder="Enter your city"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          disabled={!isEditing && !showAddAddress}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                            (isEditing || showAddAddress) ? 'focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-50'
                          }`}
                          placeholder="Enter your state"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          PIN Code
                        </label>
                        <input
                          type="text"
                          value={formData.pincode}
                          onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                          disabled={!isEditing && !showAddAddress}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                            (isEditing || showAddAddress) ? 'focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-50'
                          }`}
                          placeholder="Enter PIN code"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                {(isEditing || showAddAddress) ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setShowAddAddress(false);
                      }}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        onClose();
                      }}
                      className="px-6 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Order History */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2 text-orange-500" />
                Order History ({userOrders.length})
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {userOrders.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No orders found</p>
                ) : (
                  userOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">Order #{order.id}</h4>
                          <p className="text-sm text-gray-600 flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                          </p>
                          {order.deliveryDate && (
                            <p className="text-sm text-green-600 flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              Delivery: {new Date(order.deliveryDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      
                      {/* Order Progress Bar */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                          <span>Pending</span>
                          <span>Confirmed</span>
                          <span>Shipped</span>
                          <span>Delivered</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${getProgressWidth(order.status)} ${getProgressColor(order.status)}`}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="mb-2">
                        <h5 className="font-medium text-sm mb-1">Items:</h5>
                        {order.items.map((item) => (
                          <p key={item.product.id} className="text-sm text-gray-600">
                            {item.product.name} × {item.quantity}
                          </p>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total: ₹{order.total}</span>
                        <span className="text-sm text-gray-500">
                          {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card Payment'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;