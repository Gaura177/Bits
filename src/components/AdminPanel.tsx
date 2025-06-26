import React, { useState, useEffect } from 'react';
import { X, Plus, Edit, Trash2, Check, Users, Package, ShoppingBag, Eye, LogOut, Upload, Calendar, Clock, Truck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Product, Order, User } from '../types';
import { products as initialProducts } from '../data/products';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onProductsUpdate?: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, onProductsUpdate }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'users'>('products');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = () => {
    try {
      // Load orders
      const savedOrders = localStorage.getItem('orders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }

      // Load users
      const savedUsers = localStorage.getItem('users');
      if (savedUsers) {
        setUsers(JSON.parse(savedUsers));
      }

      // Load products
      const savedProducts = localStorage.getItem('adminProducts');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      } else {
        setProducts(initialProducts);
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        const updatedOrder = { ...order, status: newStatus };
        
        // If setting delivery date
        if (deliveryDate && newStatus === 'shipped') {
          updatedOrder.deliveryDate = deliveryDate;
          
          // Send notification to user (simulate)
          alert(`Order #${orderId} has been shipped! Delivery date set to ${new Date(deliveryDate).toLocaleDateString()}`);
        }
        
        return updatedOrder;
      }
      return order;
    });
    
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    
    // Show success notification
    if (newStatus === 'delivered') {
      alert(`Order #${orderId} has been marked as delivered!`);
    } else if (newStatus === 'confirmed') {
      alert(`Order #${orderId} has been confirmed!`);
    }
  };

  const handleSaveProduct = (productData: Partial<Product>) => {
    let updatedProducts;
    
    if (editingProduct) {
      updatedProducts = products.map(p =>
        p.id === editingProduct.id ? { ...editingProduct, ...productData } : p
      );
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: productData.name || '',
        price: productData.price || 0,
        originalPrice: productData.originalPrice,
        discount: productData.discount,
        category: productData.category || 'accessories',
        image: productData.image || '',
        rating: 4.0,
        reviews: 0,
        inStock: true,
        description: productData.description || ''
      };
      updatedProducts = [...products, newProduct];
    }
    
    setProducts(updatedProducts);
    localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
    setEditingProduct(null);
    setShowAddProduct(false);
    
    // Notify parent component to refresh products
    if (onProductsUpdate) {
      onProductsUpdate();
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = products.filter(p => p.id !== productId);
      setProducts(updatedProducts);
      localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
      
      // Notify parent component to refresh products
      if (onProductsUpdate) {
        onProductsUpdate();
      }
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
    window.location.reload();
  };

  const getOrdersByDate = (date: string) => {
    if (!date) return [];
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
      return orderDate === date;
    });
  };

  const handleSetDeliveryDate = (orderId: string) => {
    if (!deliveryDate) {
      alert('Please select a delivery date');
      return;
    }
    
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return { ...order, status: 'shipped' as Order['status'], deliveryDate };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    
    // Notify user about delivery date
    alert(`Delivery date set for Order #${orderId}: ${new Date(deliveryDate).toLocaleDateString()}\nUser will be notified about the delivery date.`);
    setDeliveryDate('');
  };

  if (!isOpen || !user?.isAdmin) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'products'
                ? 'border-b-2 border-orange-500 text-orange-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Package className="h-5 w-5 inline mr-2" />
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'orders'
                ? 'border-b-2 border-orange-500 text-orange-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShoppingBag className="h-5 w-5 inline mr-2" />
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'users'
                ? 'border-b-2 border-orange-500 text-orange-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="h-5 w-5 inline mr-2" />
            Users ({users.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Manage Products</h3>
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                    <h4 className="font-medium mb-1 text-sm">{product.name}</h4>
                    <p className="text-gray-600 text-sm mb-2">₹{product.price}</p>
                    <p className="text-xs text-gray-500 mb-2">{product.category}</p>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="flex-1 bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs hover:bg-blue-200"
                      >
                        <Edit className="h-3 w-3 inline mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex-1 bg-red-100 text-red-600 px-2 py-1 rounded text-xs hover:bg-red-200"
                      >
                        <Trash2 className="h-3 w-3 inline mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Manage Orders</h3>
                
                {/* Date Filter */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  {selectedDate && (
                    <div className="text-sm text-gray-600">
                      Orders on {new Date(selectedDate).toLocaleDateString()}: {getOrdersByDate(selectedDate).length}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {(selectedDate ? getOrdersByDate(selectedDate) : orders).length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    {selectedDate ? 'No orders found for selected date' : 'No orders found'}
                  </p>
                ) : (
                  (selectedDate ? getOrdersByDate(selectedDate) : orders).map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-medium">Order #{order.id}</h4>
                          <p className="text-sm text-gray-600 flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                          </p>
                          <p className="text-sm text-gray-600">User ID: {order.userId}</p>
                          {order.deliveryDate && (
                            <p className="text-sm text-green-600 flex items-center">
                              <Truck className="h-4 w-4 mr-1" />
                              Delivery: {new Date(order.deliveryDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                            className={`px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                              order.status === 'pending' ? 'bg-yellow-50 text-yellow-800' :
                              order.status === 'confirmed' ? 'bg-blue-50 text-blue-800' :
                              order.status === 'shipped' ? 'bg-purple-50 text-purple-800' :
                              order.status === 'delivered' ? 'bg-green-50 text-green-800' :
                              'bg-red-50 text-red-800'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      {/* Delivery Date Setting */}
                      {order.status === 'confirmed' && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                          <h5 className="font-medium text-blue-900 mb-2">Set Delivery Date</h5>
                          <div className="flex items-center space-x-2">
                            <input
                              type="date"
                              value={deliveryDate}
                              onChange={(e) => setDeliveryDate(e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded text-sm"
                              min={new Date().toISOString().split('T')[0]}
                            />
                            <button
                              onClick={() => handleSetDeliveryDate(order.id)}
                              className="bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600 flex items-center"
                            >
                              <Truck className="h-4 w-4 mr-1" />
                              Set & Ship
                            </button>
                          </div>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h5 className="font-medium mb-2">Items:</h5>
                          {order.items.map((item) => (
                            <p key={item.product.id} className="text-sm text-gray-600">
                              {item.product.name} × {item.quantity} = ₹{item.product.price * item.quantity}
                            </p>
                          ))}
                        </div>
                        <div>
                          <h5 className="font-medium mb-2">Delivery Address:</h5>
                          <p className="text-sm text-gray-600">
                            {order.address.street}<br />
                            {order.address.city}, {order.address.state}<br />
                            {order.address.pincode}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-medium">Total: ₹{order.total}</span>
                        <span className="text-sm text-gray-500">
                          Payment: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card'}
                        </span>
                      </div>

                      {/* Status Progress Bar */}
                      <div>
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                          <span>Pending</span>
                          <span>Confirmed</span>
                          <span>Shipped</span>
                          <span>Delivered</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              order.status === 'pending' ? 'w-1/4 bg-yellow-500' :
                              order.status === 'confirmed' ? 'w-2/4 bg-blue-500' :
                              order.status === 'shipped' ? 'w-3/4 bg-purple-500' :
                              order.status === 'delivered' ? 'w-full bg-green-500' :
                              'w-0 bg-red-500'
                            }`}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h3 className="text-lg font-semibold mb-6">User Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map((userData) => (
                  <div key={userData.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{userData.name}</h4>
                      <button
                        onClick={() => setSelectedUser(userData)}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{userData.email}</p>
                    <p className="text-sm text-gray-600 mb-1">{userData.phone || 'No phone'}</p>
                    <p className="text-sm text-gray-600 mb-3">
                      {userData.address ? 
                        `${userData.address.city}, ${userData.address.state}` : 
                        'No address'
                      }
                    </p>
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-1 rounded text-xs ${
                        userData.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {userData.isAdmin ? 'Admin' : 'User'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(userData.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Product Form Modal */}
        {(showAddProduct || editingProduct) && (
          <ProductForm
            product={editingProduct}
            onSave={handleSaveProduct}
            onCancel={() => {
              setShowAddProduct(false);
              setEditingProduct(null);
            }}
          />
        )}

        {/* User Detail Modal */}
        {selectedUser && (
          <UserDetailModal
            user={selectedUser}
            orders={orders.filter(order => order.userId === selectedUser.id)}
            onClose={() => setSelectedUser(null)}
          />
        )}
      </div>
    </div>
  );
};

// Product Form Component with Image Upload
interface ProductFormProps {
  product: Product | null;
  onSave: (product: Partial<Product>) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || 0,
    originalPrice: product?.originalPrice || 0,
    discount: product?.discount || 0,
    category: product?.category || 'accessories' as const,
    image: product?.image || '',
    description: product?.description || ''
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData({ ...formData, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {product ? 'Edit Product' : 'Add New Product'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Product Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter product name"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Original Price</label>
                <input
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="0"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="laptops">Laptops</option>
                <option value="headphones">Headphones</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Product Image</label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <p className="text-xs text-gray-500">Upload an image file (JPG, PNG, etc.)</p>
                {formData.image && (
                  <div className="mt-2">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter product description"
              />
            </div>
            
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600"
              >
                {product ? 'Update' : 'Add'} Product
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// User Detail Modal Component
interface UserDetailModalProps {
  user: User;
  orders: Order[];
  onClose: () => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({ user, orders, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">User Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="space-y-6">
            {/* User Info */}
            <div>
              <h4 className="font-medium mb-3">Personal Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <p className="font-medium">{user.name}</p>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <span className="text-gray-600">Phone:</span>
                  <p className="font-medium">{user.phone || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Role:</span>
                  <p className="font-medium">{user.isAdmin ? 'Admin' : 'User'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Joined:</span>
                  <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Address */}
            {user.address && (
              <div>
                <h4 className="font-medium mb-3">Address</h4>
                <div className="text-sm bg-gray-50 p-3 rounded">
                  <p>{user.address.street}</p>
                  <p>{user.address.city}, {user.address.state}</p>
                  <p>{user.address.pincode}</p>
                </div>
              </div>
            )}

            {/* Orders */}
            <div>
              <h4 className="font-medium mb-3">Order History ({orders.length})</h4>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {orders.length === 0 ? (
                  <p className="text-gray-500 text-sm">No orders found</p>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="border rounded p-3 text-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">Order #{order.id}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()} • ₹{order.total}
                      </p>
                      <p className="text-gray-600">
                        {order.items.length} item(s) • {order.paymentMethod === 'cod' ? 'COD' : 'Card'}
                      </p>
                      {order.deliveryDate && (
                        <p className="text-green-600">
                          Delivery: {new Date(order.deliveryDate).toLocaleDateString()}
                        </p>
                      )}
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

export default AdminPanel;