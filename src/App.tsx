import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { NotificationToast } from './components/NotificationToast';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { WishlistPage } from './pages/WishlistPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { Product } from './types';

export const App: React.FC = () => {
  // Current route state parsed from window.location
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');
  const [searchParams, setSearchParams] = useState<URLSearchParams>(
    () => new URLSearchParams(window.location.search)
  );

  // Sync route on popstate (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      setSearchParams(new URLSearchParams(window.location.search));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Client-side navigate function
  const navigate = (pathWithQuery: string) => {
    const [path, query] = pathWithQuery.split('?');
    const newPath = path || '/';
    const newQuery = query ? `?${query}` : '';

    window.history.pushState({}, '', `${newPath}${newQuery}`);
    setCurrentPath(newPath);
    setSearchParams(new URLSearchParams(newQuery));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewProduct = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  // Route matching logic
  const renderRoute = () => {
    // 1. Home
    if (currentPath === '/' || currentPath === '') {
      return <HomePage navigate={navigate} onViewProduct={handleViewProduct} />;
    }

    // 2. Shop
    if (currentPath === '/shop') {
      const categoryParam = searchParams.get('category') || undefined;
      const searchParam = searchParams.get('search') || undefined;
      return (
        <ShopPage
          initialCategory={categoryParam}
          initialSearch={searchParam}
          onViewProduct={handleViewProduct}
          navigate={navigate}
        />
      );
    }

    // 3. Product Detail: /product/:id
    if (currentPath.startsWith('/product/')) {
      const productId = currentPath.replace('/product/', '');
      return (
        <ProductDetailPage
          productId={productId}
          navigate={navigate}
          onViewProduct={handleViewProduct}
        />
      );
    }

    // 4. Cart
    if (currentPath === '/cart') {
      return <CartPage navigate={navigate} />;
    }

    // 5. Checkout
    if (currentPath === '/checkout') {
      return <CheckoutPage navigate={navigate} />;
    }

    // 6. Order Confirmation: /order-confirmation/:orderId
    if (currentPath.startsWith('/order-confirmation/')) {
      const orderId = currentPath.replace('/order-confirmation/', '');
      return <OrderConfirmationPage orderId={orderId} navigate={navigate} />;
    }

    // 7. Wishlist
    if (currentPath === '/wishlist') {
      return <WishlistPage navigate={navigate} onViewProduct={handleViewProduct} />;
    }

    // 8. About
    if (currentPath === '/about') {
      return <AboutPage navigate={navigate} />;
    }

    // 9. Contact
    if (currentPath === '/contact') {
      return <ContactPage />;
    }

    // 10. Admin Login
    if (currentPath === '/admin/login' || currentPath === '/admin') {
      return <AdminLoginPage navigate={navigate} />;
    }

    // 11. Admin Dashboard
    if (currentPath === '/admin/dashboard') {
      return <AdminDashboard navigate={navigate} />;
    }

    // Fallback 404
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Page Not Found</h1>
        <p className="text-sm text-slate-500 mb-6">
          The requested page could not be located.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-xs"
        >
          Return Home
        </button>
      </div>
    );
  };

  const isAdminRoute = currentPath.startsWith('/admin/dashboard');

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
          {/* Public Header is displayed on all customer-facing routes */}
          {!isAdminRoute && (
            <Header currentPath={currentPath} navigate={navigate} />
          )}

          {/* Main View Area */}
          <main className="flex-1">
            {renderRoute()}
          </main>

          {/* Slide-over cart drawer */}
          <CartDrawer navigate={navigate} />

          {/* Toast Notification Container */}
          <NotificationToast />

          {/* Public Footer */}
          {!isAdminRoute && <Footer navigate={navigate} />}
        </div>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
