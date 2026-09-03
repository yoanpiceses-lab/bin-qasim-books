import React, { useState, useEffect } from 'react';
import { Product, Order, Category, OrderStatus } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { BUSINESS_INFO, INITIAL_CATEGORIES } from '../../data/business';
import {
  Package,
  ShoppingBag,
  Layers,
  Settings,
  Plus,
  Trash2,
  Edit2,
  LogOut,
  RefreshCw,
  Search,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  Eye,
  AlertTriangle,
  Phone,
  MapPin,
  X,
  DollarSign,
  TrendingUp,
  UploadCloud,
  Lock,
  UserCheck,
  Key,
  ShieldCheck,
} from 'lucide-react';

interface AdminDashboardProps {
  navigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigate }) => {
  const { isAuthenticated, adminUser, logout, updateCurrentAdminUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'categories' | 'settings'>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Profile Form State
  const [usernameInput, setUsernameInput] = useState(adminUser?.username || 'admin');
  const [adminNameInput, setAdminNameInput] = useState(adminUser?.name || 'Bin Qasim Store Manager');
  const [adminEmailInput, setAdminEmailInput] = useState(adminUser?.email || 'admin@binqasim.pk');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Synchronize profile fields when adminUser loads/updates
  useEffect(() => {
    if (adminUser) {
      setUsernameInput(adminUser.username || '');
      setAdminNameInput(adminUser.name || '');
      setAdminEmailInput(adminUser.email || '');
    }
  }, [adminUser]);

  // Search & Filter States
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');

  // Product Modal (Add / Edit)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'Stationery',
    stock: 10,
    image: '',
    isAvailable: true,
  });

  // Category Modal
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
    image: '',
  });

  // Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Redirect if unauthenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  // Load Admin Data
  const loadData = async () => {
    try {
      setLoading(true);
      const [prodRes, orderRes, catRes] = await Promise.all([
        api.getProducts({}),
        api.adminGetOrders(),
        api.getCategories(),
      ]);
      setProducts(prodRes.products || []);
      setOrders(orderRes.orders || []);
      setCategories(catRes.categories || INITIAL_CATEGORIES);
    } catch (err: any) {
      console.error('Failed to load admin dashboard data:', err);
      setStatusMessage({ type: 'error', text: err.message || 'Error loading dashboard data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Auto-dismiss status message after 4s
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  // Product Management Handlers
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductFormData({
      name: '',
      description: '',
      price: 500,
      category: categories[0]?.name || 'Stationery',
      stock: 20,
      image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductFormData({
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      stock: p.stock,
      image: p.image,
      isAvailable: p.isAvailable,
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        // Update product
        const res = await api.adminUpdateProduct(editingProduct.id, productFormData);
        if (res.product) {
          setStatusMessage({ type: 'success', text: `Product "${productFormData.name}" updated successfully!` });
          setIsProductModalOpen(false);
          loadData();
        }
      } else {
        // Create new product
        const res = await api.adminAddProduct(productFormData);
        if (res.product) {
          setStatusMessage({ type: 'success', text: `New product "${productFormData.name}" added successfully!` });
          setIsProductModalOpen(false);
          loadData();
        }
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to save product.' });
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const res = await api.adminDeleteProduct(id);
      if (res.message) {
        setStatusMessage({ type: 'success', text: `Product "${name}" deleted.` });
        loadData();
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to delete product.' });
    }
  };

  const handleToggleProductAvailability = async (product: Product) => {
    try {
      const updated = !product.isAvailable;
      await api.adminUpdateProduct(product.id, { isAvailable: updated });
      setStatusMessage({
        type: 'success',
        text: `Product "${product.name}" marked as ${updated ? 'Available' : 'Unavailable'}.`,
      });
      loadData();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to update status.' });
    }
  };

  // Order Management Handlers
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await api.adminUpdateOrderStatus(orderId, newStatus);
      if (res.order) {
        setStatusMessage({ type: 'success', text: `Order #${res.order.orderNumber} status updated to "${newStatus}".` });
        loadData();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to update order status.' });
    }
  };

// Category Management Handlers
const handleSaveCategory = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    if (editingCategory) {
      // Update existing category
      const res = await api.adminUpdateCategory(editingCategory.id, {
        name: categoryFormData.name,
        description: categoryFormData.description,
        image: categoryFormData.image,
      });

      if (res.category) {
        setStatusMessage({
          type: 'success',
          text: `Category "${categoryFormData.name}" updated!`,
        });

        setIsCategoryModalOpen(false);
        setEditingCategory(null);
        setCategoryFormData({
          name: '',
          description: '',
          image: '',
        });

        loadData();
      }
    } else {
      // Create new category
      const res = await api.adminAddCategory({
        name: categoryFormData.name,
        description: categoryFormData.description,
        image:
          categoryFormData.image ||
          'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80',
      });

      if (res.category) {
        setStatusMessage({
          type: 'success',
          text: `Category "${categoryFormData.name}" created!`,
        });

        setIsCategoryModalOpen(false);
        setCategoryFormData({
          name: '',
          description: '',
          image: '',
        });

        loadData();
      }
    }
  } catch (err: any) {
    setStatusMessage({
      type: 'error',
      text: err.message || 'Failed to save category.',
    });
  }
};

const handleEditCategory = (category: Category) => {
  setEditingCategory(category);

  setCategoryFormData({
    name: category.name,
    description: category.description || '',
    image: category.image || '',
  });

  setIsCategoryModalOpen(true);
};

const handleDeleteCategory = async (category: Category) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete "${category.name}"?`
  );

  if (!confirmed) {
    return;
  }

  try {
    const res = await api.adminDeleteCategory(category.id);

    setStatusMessage({
      type: 'success',
      text: res.message || `Category "${category.name}" deleted!`,
    });

    loadData();
  } catch (err: any) {
    setStatusMessage({
      type: 'error',
      text: err.message || 'Failed to delete category.',
    });
  }
};

  // Admin Profile & Credentials Handlers
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) {
      setStatusMessage({ type: 'error', text: 'Username cannot be blank.' });
      return;
    }

    try {
      setIsSavingProfile(true);
      const res = await api.updateProfile({
        username: usernameInput.trim(),
        name: adminNameInput.trim(),
        email: adminEmailInput.trim(),
      });

      if (res.success) {
        updateCurrentAdminUser(res.user, res.token);
        setStatusMessage({
          type: 'success',
          text: `Admin credentials updated! New login username is "${res.user.username}".`,
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to update admin profile.',
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setStatusMessage({ type: 'error', text: 'Please enter your current password.' });
      return;
    }
    if (newPassword.length < 6) {
      setStatusMessage({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatusMessage({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    try {
      setIsChangingPassword(true);
      const res = await api.changePassword({ currentPassword, newPassword });
      if (res.message) {
        setStatusMessage({
          type: 'success',
          text: 'Password updated successfully! Please keep your new password safe.',
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to update password. Please check your current password.',
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Calculations for Overview Dashboard
  const totalRevenue = orders.reduce((sum, o) => (o.status !== 'Cancelled' ? sum + o.total : sum), 0);
  const totalOrdersCount = orders.length;
  const newOrdersCount = orders.filter((o) => o.status === 'New').length;
  const lowStockCount = products.filter((p) => p.stock <= 5).length;

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const term = (productSearch || '').trim().toLowerCase();
    const matchesSearch =
      !term ||
      String(p.name || '').toLowerCase().includes(term) ||
      String(p.description || '').toLowerCase().includes(term) ||
      String(p.category || '').toLowerCase().includes(term);
    const matchesCategory =
      productCategoryFilter === 'All' ||
      String(p.category || '').toLowerCase() === productCategoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const term = (orderSearch || '').trim().toLowerCase();
    const orderNumStr = String(o.orderNumber ?? o.id ?? '').toLowerCase();
    const customerNameStr = String(o.customerName || '').toLowerCase();
    const customerPhoneStr = String(o.customerPhone || '').toLowerCase();
    const cityStr = String(o.city || '').toLowerCase();

    const matchesSearch =
      !term ||
      orderNumStr.includes(term) ||
      customerNameStr.includes(term) ||
      customerPhoneStr.includes(term) ||
      cityStr.includes(term);

    const matchesStatus = orderStatusFilter === 'All' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Admin Navigation Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm">
              BQ
            </div>
            <div>
              <div className="text-sm font-black tracking-tight font-['Outfit',sans-serif]">
                BIN QASIM STORE ADMIN
              </div>
              <div className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">
                Management Portal
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Public Store</span>
            </button>
            <button
              id="btn-admin-logout"
              onClick={() => {
                logout();
                navigate('/admin/login');
              }}
              className="text-xs text-rose-300 hover:text-white bg-rose-950/80 hover:bg-rose-900 border border-rose-800/60 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Admin Body Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full space-y-6">
        {/* Status Toast Message */}
        {statusMessage && (
          <div
            className={`p-4 rounded-xl text-sm font-semibold flex items-center justify-between shadow-md transition-all ${
              statusMessage.type === 'success'
                ? 'bg-emerald-600 text-white'
                : 'bg-rose-600 text-white'
            }`}
          >
            <span>{statusMessage.text}</span>
            <button onClick={() => setStatusMessage(null)}>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tab Navigation Controls */}
        <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs flex flex-wrap gap-1">
          <button
            id="tab-btn-overview"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'overview'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            id="tab-btn-orders"
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'orders'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders</span>
            {newOrdersCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
                {newOrdersCount} New
              </span>
            )}
          </button>

          <button
            id="tab-btn-products"
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'products'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products Catalog ({products.length})</span>
          </button>

          <button
            id="tab-btn-categories"
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'categories'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Categories</span>
          </button>

          <button
            id="tab-btn-settings"
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'settings'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Store Settings</span>
          </button>
        </div>

        {/* ---------------- 1. OVERVIEW TAB ---------------- */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 4 Primary Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <span>Total Revenue</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
                  PKR {totalRevenue.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500">From all completed orders</div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <span>Total Orders</span>
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
                  {totalOrdersCount}
                </div>
                <div className="text-xs text-indigo-600 font-semibold">{newOrdersCount} pending review</div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <span>Active Products</span>
                  <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
                  {products.length}
                </div>
                <div className="text-xs text-slate-500">Across {categories.length} categories</div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <span>Low Stock Alert</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
                  {lowStockCount}
                </div>
                <div className="text-xs text-amber-600 font-semibold">Items with ≤ 5 units</div>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Recent Orders</h3>
                  <p className="text-xs text-slate-500">Latest customer orders from Karachi & Pakistan</p>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">
                  No orders placed yet. Orders will appear here in real time.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {orders.slice(0, 5).map((ord) => (
                    <div
                      key={ord.id}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm"
                    >
                      <div>
                        <div className="font-bold text-slate-900">
                          Order #{ord.orderNumber} • {ord.customerName}
                        </div>
                        <div className="text-slate-500 text-xs mt-0.5">
                          {(ord.items || []).length} items • {ord.city} • {new Date(ord.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-900">
                          PKR {ord.total.toLocaleString()}
                        </span>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            ord.status === 'New'
                              ? 'bg-amber-100 text-amber-800'
                              : ord.status === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.status === 'Cancelled'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-indigo-100 text-indigo-800'
                          }`}
                        >
                          {ord.status}
                        </span>
                        <button
                          onClick={async () => {
  try {
    const { order } = await api.getAdminOrder(ord.id);
    setSelectedOrder(order);
  } catch (error) {
    console.error('Failed to load order details:', error);
  }
}}
                          className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                          title="View order details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------------- 2. PRODUCTS TAB ---------------- */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="flex flex-1 gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search products by title or description..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>

                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium focus:outline-none"
                >
                  <option value="All">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadData}
                  className="p-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
                  title="Refresh products list"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  id="btn-admin-add-product"
                  onClick={handleOpenAddProduct}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm flex items-center gap-1.5 shadow-md shadow-indigo-200 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3.5 px-4">Product</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Price (PKR)</th>
                      <th className="py-3.5 px-4">Stock</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200"
                            />
                            <div className="min-w-0 max-w-xs">
                              <div className="font-bold text-slate-900 truncate" title={p.name}>
                                {p.name}
                              </div>
                              <div className="text-xs text-slate-400 line-clamp-1">
                                {p.description}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold text-xs">
                            {p.category}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-bold text-slate-900 font-['Outfit',sans-serif]">
                          PKR {p.price.toLocaleString()}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`font-bold ${
                              p.stock === 0
                                ? 'text-rose-600'
                                : p.stock <= 5
                                ? 'text-amber-600'
                                : 'text-slate-800'
                            }`}
                          >
                            {p.stock} units
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleToggleProductAvailability(p)}
                            className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
                              p.isAvailable
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                            }`}
                          >
                            {p.isAvailable ? 'Active' : 'Disabled'}
                          </button>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              id={`btn-edit-product-${p.id}`}
                              onClick={() => handleOpenEditProduct(p)}
                              className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Edit product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              id={`btn-delete-product-${p.id}`}
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- 3. ORDERS TAB ---------------- */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Orders Filter Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="flex flex-1 gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search by Order #, Customer Name, Phone..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <button
                onClick={loadData}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3.5 px-4">Order Number</th>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Items / Total</th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-4 font-extrabold text-slate-900 font-mono">
                          #{ord.orderNumber}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{ord.customerName}</div>
                          <div className="text-slate-500 text-xs">{ord.customerPhone}</div>
                          <div className="text-slate-400 text-xs">{ord.city}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 font-['Outfit',sans-serif]">
                            PKR {ord.total.toLocaleString()}
                          </div>
                          <div className="text-slate-500 text-xs">
  {Array.isArray(ord.items) ? ord.items.length : 0} items (COD)
</div>
                        </td>

                        <td className="py-3.5 px-4 text-slate-600 text-xs">
                          {new Date(ord.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>

                        <td className="py-3.5 px-4">
                          <select
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border-0 cursor-pointer focus:outline-none ${
                              ord.status === 'New'
                                ? 'bg-amber-100 text-amber-900'
                                : ord.status === 'Processing'
                                ? 'bg-blue-100 text-blue-900'
                                : ord.status === 'Shipped'
                                ? 'bg-indigo-100 text-indigo-900'
                                : ord.status === 'Delivered'
                                ? 'bg-emerald-100 text-emerald-900'
                                : 'bg-rose-100 text-rose-900'
                            }`}
                          >
                            <option value="New">New</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            
                            onClick={async () => {
                              try {
                                const { order } = await api.getAdminOrder(ord.id);
                                setSelectedOrder(order);
                              } catch (error) {
                                console.error('Failed to load order details:', error);
                              }
                            }}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-bold text-slate-700 transition-colors inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Details</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- 4. CATEGORIES TAB ---------------- */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Product Categories</h3>
                <p className="text-xs text-slate-500">Core store departments</p>
              </div>
              <button
                onClick={() => {
  setEditingCategory(null);
  setCategoryFormData({
    name: '',
    description: '',
    image: '',
  });
  setIsCategoryModalOpen(true);
}}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm flex items-center gap-1.5 shadow-md shadow-indigo-200 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((c) => {  
                const count = products.filter((p) => (p.category || '').toLowerCase() === (c.name || '').toLowerCase()).length;
                return (
                  <div key={c.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col">
                    <div className="h-32 bg-slate-100 overflow-hidden">
                      <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-slate-900 text-base">{c.name}</h4>
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full">
                            {count} Items
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{c.description}</p>
                      </div>
                      <div className="flex gap-2 pt-3">
  <button
    type="button"
    onClick={() => handleEditCategory(c)}
    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors"
  >
    Edit
  </button>

  <button
    type="button"
    onClick={() => handleDeleteCategory(c)}
    className="flex-1 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-lg text-xs transition-colors"
  >
    Delete
  </button>
</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------------- 5. STORE SETTINGS TAB ---------------- */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Store Profile & Information</h3>
                <p className="text-xs text-slate-500 mt-0.5">Verified store contact and location details</p>
              </div>

              {/* Business Info Overview */}
              <div className="space-y-4 text-sm">
                <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                  Store Contact Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-400 block">Store Name</span>
                    <span className="font-bold text-slate-800">{BUSINESS_INFO.name}</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-400 block">Phone</span>
                    <span className="font-bold text-slate-800">{BUSINESS_INFO.phone}</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-400 block">WhatsApp</span>
                    <span className="font-bold text-slate-800">{BUSINESS_INFO.whatsapp}</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-400 block">Store Email</span>
                    <span className="font-bold text-slate-800">{BUSINESS_INFO.email}</span>
                  </div>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-400 block">Store Location</span>
                  <span className="font-semibold text-slate-800 text-xs sm:text-sm">{BUSINESS_INFO.address}</span>
                </div>
              </div>
            </div>

            {/* Admin Profile & Password Management Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 1. Change Admin Username & Profile Details */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
                <div className="flex items-center gap-2.5 text-slate-900">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Admin Account Profile</h3>
                    <p className="text-xs text-slate-500">Change your login username and display details</p>
                  </div>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-4 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Login Username <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="input-admin-username"
                      type="text"
                      required
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      placeholder="e.g. admin or manager"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">Used to sign in to the Admin Portal.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Display Name
                    </label>
                    <input
                      id="input-admin-name"
                      type="text"
                      value={adminNameInput}
                      onChange={(e) => setAdminNameInput(e.target.value)}
                      placeholder="e.g. Bin Qasim Store Manager"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Admin Email
                    </label>
                    <input
                      id="input-admin-email"
                      type="email"
                      value={adminEmailInput}
                      onChange={(e) => setAdminEmailInput(e.target.value)}
                      placeholder="admin@binqasim.pk"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    />
                  </div>

                  <button
                    id="btn-save-admin-profile"
                    type="submit"
                    disabled={isSavingProfile}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isSavingProfile ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                  </button>
                </form>
              </div>

              {/* 2. Change Admin Password */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
                <div className="flex items-center gap-2.5 text-slate-900">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Change Admin Password</h3>
                    <p className="text-xs text-slate-500">Update your secret password for secure access</p>
                  </div>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-4 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Current Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="input-current-password"
                        type="password"
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      New Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="input-new-password"
                        type="password"
                        required
                        minLength={6}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Minimum 6 characters"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Confirm New Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="input-confirm-password"
                        type="password"
                        required
                        minLength={6}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-type new password"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <button
                    id="btn-update-password"
                    type="submit"
                    disabled={isChangingPassword}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
                  >
                    <Key className="w-4 h-4" />
                    <span>{isChangingPassword ? 'Updating Password...' : 'Update Password'}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ---------------- MODAL: ADD / EDIT PRODUCT ---------------- */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={productFormData.name}
                  onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                  placeholder="e.g. Oxford Mathematical Geometry Box"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={productFormData.category}
                    onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Price (PKR) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={productFormData.price}
                    onChange={(e) => setProductFormData({ ...productFormData, price: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Stock Quantity <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={productFormData.stock}
                    onChange={(e) => setProductFormData({ ...productFormData, stock: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select
                    value={productFormData.isAvailable ? 'true' : 'false'}
                    onChange={(e) => setProductFormData({ ...productFormData, isAvailable: e.target.value === 'true' })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  >
                    <option value="true">Available (Active)</option>
                    <option value="false">Hidden / Inactive</option>
                  </select>
                </div>
              </div>

            <div>
  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
    Product Image
  </label>

  <div className="space-y-3">
    <input
      type="file"
      accept="image/*"
      onChange={async (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
          setStatusMessage({
            type: 'error',
            text: 'Image must be smaller than 5MB.',
          });
          return;
        }

        try {
          setStatusMessage({
            type: 'success',
            text: 'Uploading image...',
          });

          const formData = new FormData();
          formData.append('image', file);

 const result = await api.adminUploadImage(file);

          setProductFormData({
            ...productFormData,
            image: result.imageUrl,
          });

          setStatusMessage({
            type: 'success',
            text: 'Image uploaded successfully!',
          });
        } catch (err: any) {
          setStatusMessage({
            type: 'error',
            text: err.message || 'Failed to upload image.',
          });
        }
      }}
      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
    />

    {productFormData.image && (
      <div className="rounded-xl border border-slate-200 overflow-hidden">
        <img
          src={productFormData.image}
          alt="Product preview"
          className="w-full h-48 object-cover"
        />
      </div>
    )}
  </div>
</div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={productFormData.description}
                  onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                  placeholder="Full specifications, dimensions, materials..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white resize-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-md transition-all cursor-pointer"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- MODAL: ADD CATEGORY ---------------- */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
  {editingCategory ? 'Edit Category' : 'Add Category'}
</h3>
              <button onClick={() => setIsCategoryModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={categoryFormData.name}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                  placeholder="e.g. Art & Craft"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={categoryFormData.description}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                  placeholder="e.g. Paint sets, brushes, clay"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={categoryFormData.image}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl text-sm shadow-md"
                >
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- MODAL: VIEW ORDER DETAILS ---------------- */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  Order Details
                </span>
                <h3 className="text-xl font-black text-slate-900 font-['Outfit',sans-serif]">
                  ORDER #{selectedOrder.orderNumber}
                </h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl text-xs sm:text-sm">
              <div>
                <span className="text-xs font-bold text-slate-400 block uppercase">Customer</span>
                <div className="font-bold text-slate-900">{selectedOrder.customerName}</div>
                <div className="text-slate-600">{selectedOrder.customerPhone}</div>
                {selectedOrder.customerEmail && <div className="text-slate-500">{selectedOrder.customerEmail}</div>}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 block uppercase">Delivery Info</span>
                <div className="text-slate-800">{selectedOrder.deliveryAddress}, {selectedOrder.city}</div>
                <div className="text-emerald-700 font-semibold mt-1">Payment: {selectedOrder.paymentMethod}</div>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Ordered Items
              </span>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs sm:text-sm">
                {(selectedOrder.items || []).map((it, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{it.name}</div>
                      <div className="text-slate-500">PKR {it.price.toLocaleString()} × {it.quantity}</div>
                    </div>
                    <div className="font-bold text-slate-900 font-['Outfit',sans-serif]">
                      PKR {(it.price * it.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-sm">
              <span className="text-slate-600 font-medium">Total Amount:</span>
              <span className="text-xl font-extrabold text-indigo-700 font-['Outfit',sans-serif]">
                PKR {selectedOrder.total.toLocaleString()}
              </span>
            </div>

            {/* Quick Status Updater */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Update Status:</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value as OrderStatus)}
                  className="px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-bold focus:outline-none"
                >
                  <option value="New">New</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
