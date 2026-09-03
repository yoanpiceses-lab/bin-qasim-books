export type ProductCategory = 'Stationery' | 'School Bags' | 'Toys' | 'Gifts' | 'Sports' | string;

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: ProductCategory;
  stock: number;
  image: string;
  additionalImages?: string[];
  isAvailable: boolean;
  featured?: boolean;
  brand?: string;
  sku?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount?: number;
}

export type OrderStatus = 'New' | 'Confirmed' | 'Processing' | 'Ready' | 'Completed' | 'Cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category?: string;
}

export interface Order {
  id: string;
  orderNumber: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  city: string;
  orderNotes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  status: OrderStatus;
  emailNotificationSent: boolean;
  emailNotificationLog?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  name: string;
  role: 'admin';
}

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  newOrders: number;
  pendingOrders: number;
  completedOrders: number;
  outOfStockProducts: number;
  totalRevenue: number;
  recentOrders: Order[];
}

export interface BusinessInfo {
  name: string;
  address: string;
  phone: string;
  phoneRaw: string;
  whatsapp: string;
  whatsappRaw: string;
  email: string;
  facebook: string;
  instagram: string;
  currency: string;
}
