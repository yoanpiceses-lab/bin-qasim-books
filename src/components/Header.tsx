import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { BUSINESS_INFO, INITIAL_CATEGORIES } from '../data/business';
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  Phone,
  MessageCircle,
  ChevronDown,
  BookOpen,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  currentPath: string;
  navigate: (path: string) => void;
  searchQuery?: string;
  onSearch?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, navigate, searchQuery = '', onSearch }) => {
  const { cartCount, wishlist, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(localSearch);
    }
    if (currentPath !== '/shop') {
      navigate(`/shop?search=${encodeURIComponent(localSearch)}`);
    }
    setIsMobileMenuOpen(false);
  };

  const handleCategoryClick = (categoryName: string) => {
    setIsCategoryDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate(`/shop?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
      {/* Top Notification / Contact Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Cash on Delivery Available Across Karachi & Pakistan
            </span>
            <span className="hidden md:inline text-slate-500">•</span>
            <span className="hidden md:inline text-slate-300">
              Gulshan-e-Iqbal, Karachi Store
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a
              id="header-phone-link"
              href={`tel:+${BUSINESS_INFO.phoneRaw}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span>{BUSINESS_INFO.phone}</span>
            </a>
            <a
              id="header-whatsapp-link"
              href={`https://wa.me/${BUSINESS_INFO.whatsappRaw}?text=${encodeURIComponent('Hello Bin Qasim Books & Uniforms, I have an inquiry.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <MessageCircle className="w-3 h-3 text-emerald-400" />
              <span>WhatsApp: {BUSINESS_INFO.whatsapp}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Store Name */}
          <div
            id="brand-logo"
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-700 via-blue-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform duration-200">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 font-['Outfit',sans-serif] leading-tight">
                BIN QASIM
              </div>
              <div className="text-[11px] sm:text-xs font-semibold text-indigo-700 tracking-wider uppercase">
                Books & Uniforms
              </div>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden lg:flex flex-1 max-w-md mx-6"
            id="desktop-search-form"
          >
            <div className="relative w-full">
              <input
                id="desktop-search-input"
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search stationery, school bags, toys, gifts, sports..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100/90 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              {localSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalSearch('');
                    if (onSearch) onSearch('');
                  }}
                  className="absolute right-3 top-3 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              id="nav-home"
              onClick={() => navigate('/')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPath === '/'
                  ? 'text-indigo-700 bg-indigo-50 font-semibold'
                  : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              Home
            </button>

            <button
              id="nav-shop"
              onClick={() => navigate('/shop')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPath === '/shop'
                  ? 'text-indigo-700 bg-indigo-50 font-semibold'
                  : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              Shop
            </button>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                id="nav-categories-dropdown"
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                onBlur={() => setTimeout(() => setIsCategoryDropdownOpen(false), 200)}
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
              >
                <span>Categories</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCategoryDropdownOpen && (
                <div
                  id="categories-dropdown-menu"
                  className="absolute left-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Main Departments
                  </div>
                  {INITIAL_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      id={`nav-cat-${cat.slug}`}
                      onClick={() => handleCategoryClick(cat.name)}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center justify-between transition-colors"
                    >
                      <span>{cat.name}</span>
                    </button>
                  ))}
                  <div className="border-t border-slate-100 my-1"></div>
                  <button
                    id="nav-all-categories"
                    onClick={() => {
                      setIsCategoryDropdownOpen(false);
                      navigate('/shop');
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-50"
                  >
                    View All Products →
                  </button>
                </div>
              )}
            </div>

            <button
              id="nav-about"
              onClick={() => navigate('/about')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPath === '/about'
                  ? 'text-indigo-700 bg-indigo-50 font-semibold'
                  : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              About
            </button>

            <button
              id="nav-contact"
              onClick={() => navigate('/contact')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPath === '/contact'
                  ? 'text-indigo-700 bg-indigo-50 font-semibold'
                  : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Action Icons (Wishlist & Cart & Mobile Toggle) */}
          <div className="flex items-center gap-2">
            {/* Wishlist Button */}
            <button
              id="header-wishlist-button"
              onClick={() => navigate('/wishlist')}
              className="relative p-2.5 text-slate-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              title="View Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white animate-in zoom-in">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              id="header-cart-button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2.5 rounded-xl shadow-xs transition-all duration-200"
              title="View Cart"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-semibold">Cart</span>
              {cartCount > 0 && (
                <span className="bg-amber-400 text-slate-950 text-xs font-extrabold px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              id="header-mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (under header) */}
        <div className="lg:hidden pb-3">
          <form onSubmit={handleSearchSubmit} id="mobile-search-form">
            <div className="relative w-full">
              <input
                id="mobile-search-input"
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search products in Bin Qasim store..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div id="mobile-menu-drawer" className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          <div className="space-y-1">
            <button
              id="mobile-nav-home"
              onClick={() => {
                navigate('/');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-100"
            >
              Home
            </button>
            <button
              id="mobile-nav-shop"
              onClick={() => {
                navigate('/shop');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-100"
            >
              Shop All Products
            </button>

            <div className="py-2 pl-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Categories
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {INITIAL_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    id={`mobile-cat-${cat.slug}`}
                    onClick={() => handleCategoryClick(cat.name)}
                    className="text-left px-3 py-1.5 text-sm rounded-md bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              id="mobile-nav-wishlist"
              onClick={() => {
                navigate('/wishlist');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-100 flex items-center justify-between"
            >
              <span>My Wishlist</span>
              {wishlist.length > 0 && (
                <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  {wishlist.length} items
                </span>
              )}
            </button>

            <button
              id="mobile-nav-cart"
              onClick={() => {
                navigate('/cart');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-100 flex items-center justify-between"
            >
              <span>Shopping Cart</span>
              <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {cartCount} items
              </span>
            </button>

            <button
              id="mobile-nav-about"
              onClick={() => {
                navigate('/about');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-100"
            >
              About Us
            </button>

            <button
              id="mobile-nav-contact"
              onClick={() => {
                navigate('/contact');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-100"
            >
              Contact Us
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <a
              id="mobile-call-btn"
              href={`tel:+${BUSINESS_INFO.phoneRaw}`}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-100 text-slate-800 font-semibold rounded-xl text-sm"
            >
              <Phone className="w-4 h-4 text-amber-500" />
              Call {BUSINESS_INFO.phone}
            </a>
            <a
              id="mobile-whatsapp-btn"
              href={`https://wa.me/${BUSINESS_INFO.whatsappRaw}?text=${encodeURIComponent('Hello Bin Qasim Books & Uniforms, I have an inquiry.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp {BUSINESS_INFO.whatsapp}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
