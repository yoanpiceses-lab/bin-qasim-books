import { Product, Category, Order, OrderStatus, DashboardStats, AdminUser } from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('binqasim_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Robust JSON request helper that safely handles HTML error pages (e.g. 502/404),
 * non-JSON responses, network blips, and API error formats without throwing raw SyntaxErrors.
 */
async function safeFetchJson<T = any>(url: string, options?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, options);
  } catch (netErr: any) {
    throw new Error('Network error: Unable to reach server. Please check your connection.');
  }

  const contentType = res.headers.get('content-type') || '';
  let data: any = null;

  if (contentType.includes('application/json')) {
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  } else {
    // If response is HTML or plain text (e.g. 404, 502 gateway error, <!DOCTYPE html>...)
    const text = await res.text().catch(() => '');
    try {
      data = JSON.parse(text);
    } catch {
      // Non-JSON response
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Invalid username or password.');
        } else if (res.status === 403) {
          throw new Error('Access denied. Administrator privileges required.');
        } else if (res.status === 404) {
          throw new Error(`Requested resource was not found (404).`);
        } else {
          throw new Error(`Server returned error (${res.status}: ${res.statusText || 'Unavailable'}).`);
        }
      }
      throw new Error('Server returned an unexpected non-JSON response.');
    }
  }

  if (!res.ok) {
    const errorMsg = data?.error || data?.message || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

export const api = {
  // Public Products
  async getProducts(params?: {
    category?: string;
    search?: string;
    sort?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
  }): Promise<{ products: Product[]; count: number }> {
    const searchParams = new URLSearchParams();
    if (params?.category && params.category !== 'All') searchParams.set('category', params.category);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.sort) searchParams.set('sort', params.sort);
    if (params?.minPrice !== undefined) searchParams.set('minPrice', params.minPrice.toString());
    if (params?.maxPrice !== undefined) searchParams.set('maxPrice', params.maxPrice.toString());
    if (params?.inStock) searchParams.set('inStock', 'true');

    return safeFetchJson<{ products: Product[]; count: number }>(
      `${API_BASE}/products?${searchParams.toString()}`
    );
  },

  async getProduct(id: string): Promise<{ product: Product; related: Product[] }> {
    return safeFetchJson<{ product: Product; related: Product[] }>(`${API_BASE}/products/${id}`);
  },

  // Public Categories
  async getCategories(): Promise<{ categories: Category[] }> {
    return safeFetchJson<{ categories: Category[] }>(`${API_BASE}/categories`);
  },

  // Public Orders
  async createOrder(orderData: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    deliveryAddress: string;
    city: string;
    orderNotes?: string;
    items: Array<{ productId: string; quantity: number }>;
  }): Promise<{ success: boolean; message: string; order: Order }> {
    return safeFetchJson<{ success: boolean; message: string; order: Order }>(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
  },

  async getOrder(id: string): Promise<{ order: Order }> {
    return safeFetchJson<{ order: Order }>(`${API_BASE}/orders/${id}`);
  },

  async getAdminOrder(id: string): Promise<{ order: Order }> {
  return safeFetchJson<{ order: Order }>(
    `${API_BASE}/admin/orders/${id}`,
    {
      headers: getAuthHeader(),
    }
  );
},

  // Admin Auth
async adminLogin(credentials: { username: string; password: string }): Promise<{
  token: string;
  refreshToken: string;
  user: AdminUser;
}> {
    const payload = {
      username: typeof credentials?.username === 'string' ? credentials.username.trim() : '',
      password: typeof credentials?.password === 'string' ? credentials.password : '',
    };

return safeFetchJson<{
  token: string;
  refreshToken: string;
  user: AdminUser;
}>(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  },

  async getAdminMe(): Promise<{ user: AdminUser }> {
    return safeFetchJson<{ user: AdminUser }>(`${API_BASE}/admin/me`, {
      headers: { ...getAuthHeader() },
    });
  },

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<{ message: string }> {
    return safeFetchJson<{ message: string }>(`${API_BASE}/admin/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
  },

  async updateProfile(data: { username: string; name?: string; email?: string }): Promise<{ success: boolean; message: string; user: AdminUser; token: string }> {
    return safeFetchJson<{ success: boolean; message: string; user: AdminUser; token: string }>(`${API_BASE}/admin/update-profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
  },

  // Admin Dashboard
  async getDashboardStats(): Promise<{ stats: DashboardStats }> {
    return safeFetchJson<{ stats: DashboardStats }>(`${API_BASE}/admin/dashboard`, {
      headers: { ...getAuthHeader() },
    });
  },

  // Admin Products
  async adminAddProduct(productData: Partial<Product>): Promise<{ product: Product }> {
    return safeFetchJson<{ product: Product }>(`${API_BASE}/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(productData),
    });
  },

  async adminUpdateProduct(id: string, productData: Partial<Product>): Promise<{ product: Product }> {
    return safeFetchJson<{ product: Product }>(`${API_BASE}/admin/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(productData),
    });
  },

  async adminDeleteProduct(id: string): Promise<{ message: string }> {
    return safeFetchJson<{ message: string }>(`${API_BASE}/admin/products/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
  },

  async uploadImage(file: File): Promise<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', file);

    return safeFetchJson<{ imageUrl: string }>(`${API_BASE}/admin/upload-image`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
      body: formData,
    });
  },

  // Admin Image Upload
async adminUploadImage(file: File): Promise<{ imageUrl: string; filename: string }> {
  const formData = new FormData();
  formData.append('image', file);

  return safeFetchJson<{ imageUrl: string; filename: string }>(
    `${API_BASE}/admin/upload-image`,
    {
      method: 'POST',
      headers: {
        ...getAuthHeader(),
      },
      body: formData,
    }
  );
},

  // Admin Categories
  async adminAddCategory(categoryData: { name: string; description?: string; image?: string }): Promise<{ category: Category }> {
    return safeFetchJson<{ category: Category }>(`${API_BASE}/admin/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(categoryData),
    });
  },

  async adminUpdateCategory(id: string, categoryData: { name: string; description?: string; image?: string }): Promise<{ category: Category }> {
    return safeFetchJson<{ category: Category }>(`${API_BASE}/admin/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(categoryData),
    });
  },

  async adminDeleteCategory(id: string, force = false): Promise<{ message: string }> {
    return safeFetchJson<{ message: string }>(`${API_BASE}/admin/categories/${id}?force=${force}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
  },

  // Admin Orders
  async adminGetOrders(params?: { status?: string; search?: string }): Promise<{ orders: Order[]; count: number }> {
    const searchParams = new URLSearchParams();
    if (params?.status && params.status !== 'All') searchParams.set('status', params.status);
    if (params?.search) searchParams.set('search', params.search);

    return safeFetchJson<{ orders: Order[]; count: number }>(
      `${API_BASE}/admin/orders?${searchParams.toString()}`,
      { headers: { ...getAuthHeader() } }
    );
  },

  async adminUpdateOrderStatus(id: string, status: OrderStatus, restockOnCancel = true): Promise<{ order: Order }> {
    return safeFetchJson<{ order: Order }>(`${API_BASE}/admin/orders/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ status, restockOnCancel }),
    });
  },

  // Admin Email Diagnostics & Test Trigger
  async adminTestEmail(): Promise<{ success: boolean; recipient: string; smtpConfigured: boolean; result: any }> {
    return safeFetchJson<{ success: boolean; recipient: string; smtpConfigured: boolean; result: any }>(
      `${API_BASE}/admin/test-email`,
      {
        method: 'POST',
        headers: { ...getAuthHeader() },
      }
    );
  },

  async adminGetEmailStatus(): Promise<{
    recipient: string;
    smtpHost: string;
    smtpPort: string;
    smtpUser: string;
    isConfigured: boolean;
  }> {
    return safeFetchJson<{
      recipient: string;
      smtpHost: string;
      smtpPort: string;
      smtpUser: string;
      isConfigured: boolean;
    }>(`${API_BASE}/admin/email-status`, {
      headers: { ...getAuthHeader() },
    });
  },
};
