import React, { useState, useEffect } from 'react';
import { Product, Category } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { INITIAL_CATEGORIES } from '../data/business';
import {
  Search,
  SlidersHorizontal,
  X,
  Filter,
  PackageOpen,
  ArrowUpDown,
  Check,
} from 'lucide-react';

interface ShopPageProps {
  initialCategory?: string;
  initialSearch?: string;
  onViewProduct: (product: Product) => void;
  navigate: (path: string) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  initialCategory,
  initialSearch,
  onViewProduct,
  navigate,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch || '');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [showMobileFilter, setShowMobileFilter] = useState<boolean>(false);

  // Synchronize when props change
  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    if (initialSearch !== undefined) setSearchQuery(initialSearch);
  }, [initialSearch]);

  // Fetch categories on mount
  useEffect(() => {
    api.getCategories().then((data) => {
      if (data.categories) setCategories(data.categories);
    }).catch(console.error);
  }, []);

  // Fetch filtered products from backend API
  useEffect(() => {
    async function fetchCatalog() {
      try {
        setLoading(true);
        const data = await api.getProducts({
          category: selectedCategory,
          search: searchQuery,
          sort: sortBy,
          maxPrice: maxPrice,
          inStock: inStockOnly,
        });
        setProducts(data.products || []);
      } catch (err) {
        console.error('Failed to load shop products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCatalog();
  }, [selectedCategory, searchQuery, sortBy, maxPrice, inStockOnly]);

  const handleClearFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('featured');
    setInStockOnly(false);
    setMaxPrice(5000);
  };

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    searchQuery.trim() !== '' ||
    inStockOnly ||
    maxPrice < 5000;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white mb-8 shadow-md">
        <div className="max-w-2xl">
          <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
            Online Store Catalog
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-['Outfit',sans-serif] mt-1">
            {selectedCategory === 'All' ? 'All Products' : `${selectedCategory}`}
          </h1>
          <p className="text-sm text-slate-300 mt-2">
            Explore authentic school supplies, bags, educational toys, gifts, and sports equipment with reliable Cash on Delivery.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 sticky top-28">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                <span>Filters</span>
              </div>
              {hasActiveFilters && (
                <button
                  id="btn-reset-filters-desktop"
                  onClick={handleClearFilters}
                  className="text-xs font-semibold text-rose-600 hover:underline"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Categories Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Categories
              </label>
              <div className="space-y-1">
                <button
                  id="filter-cat-all"
                  onClick={() => setSelectedCategory('All')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                    selectedCategory === 'All'
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>All Categories</span>
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    id={`filter-cat-${cat.slug}`}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                      selectedCategory.toLowerCase() === cat.name.toLowerCase()
                        ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {cat.productCount !== undefined && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          selectedCategory.toLowerCase() === cat.name.toLowerCase()
                            ? 'bg-indigo-700 text-white'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {cat.productCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Max Price
                </label>
                <span className="text-sm font-bold text-indigo-700">
                  PKR {maxPrice.toLocaleString()}
                </span>
              </div>
              <input
                id="price-range-slider"
                type="range"
                min="200"
                max="5000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>PKR 200</span>
                <span>PKR 5,000</span>
              </div>
            </div>

            {/* Stock Availability Filter */}
            <div className="pt-4 border-t border-slate-100">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  id="filter-in-stock-checkbox"
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <span className="text-sm font-medium text-slate-700">
                  In Stock Only
                </span>
              </label>
            </div>
          </div>
        </aside>

        {/* Product Catalog Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Bar: Search, Mobile Filter Toggle, Sort Selector */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                id="shop-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name or details..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile Filter Button */}
              <button
                id="btn-mobile-filter-open"
                onClick={() => setShowMobileFilter(true)}
                className="lg:hidden px-3.5 py-2.5 bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold flex items-center gap-2"
              >
                <Filter className="w-4 h-4 text-indigo-600" />
                <span>Filters</span>
              </button>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 shrink-0">
                <ArrowUpDown className="w-4 h-4 text-slate-500" />
                <select
                  id="sort-select-dropdown"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-sm font-medium text-slate-800 focus:outline-none cursor-pointer pr-2"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-slate-400 font-medium">Active filters:</span>
              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold rounded-lg">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory('All')}>
                    <X className="w-3.5 h-3.5 hover:text-indigo-900" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold rounded-lg">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')}>
                    <X className="w-3.5 h-3.5 hover:text-amber-900" />
                  </button>
                </span>
              )}
              {inStockOnly && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg">
                  In Stock Only
                  <button onClick={() => setInStockOnly(false)}>
                    <X className="w-3.5 h-3.5 hover:text-emerald-900" />
                  </button>
                </span>
              )}
              {maxPrice < 5000 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg">
                  Under PKR {maxPrice.toLocaleString()}
                  <button onClick={() => setMaxPrice(5000)}>
                    <X className="w-3.5 h-3.5 hover:text-slate-900" />
                  </button>
                </span>
              )}
              <button
                id="btn-clear-all-filter-chips"
                onClick={handleClearFilters}
                className="text-xs font-bold text-rose-600 hover:underline ml-2"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Product Count Header */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing <strong className="text-slate-800">{products.length}</strong> product{products.length === 1 ? '' : 's'}
            </span>
          </div>

          {/* Products Grid or Empty State */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse space-y-4">
                  <div className="aspect-square bg-slate-200 rounded-xl" />
                  <div className="h-4 bg-slate-200 rounded-md w-3/4" />
                  <div className="h-4 bg-slate-200 rounded-md w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div id="no-products-found-state" className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <PackageOpen className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No products found</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                We couldn't find any products matching your current search or filter criteria. Try adjusting your filters or searching for another stationery or school item.
              </p>
              <button
                id="btn-reset-filters-empty-state"
                onClick={handleClearFilters}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewProduct={onViewProduct}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setShowMobileFilter(false)}
          />
          <div className="relative min-h-screen flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="relative bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900">Filter Products</h3>
                <button
                  onClick={() => setShowMobileFilter(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Categories */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold ${
                      selectedCategory === 'All'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold ${
                        selectedCategory.toLowerCase() === cat.name.toLowerCase()
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Price */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>Max Price:</span>
                  <span className="text-indigo-600">PKR {maxPrice.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="5000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg accent-indigo-600"
                />
              </div>

              {/* Mobile In Stock */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600"
                  />
                  <span className="text-sm font-medium text-slate-700">In Stock Only</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 flex gap-3">
                <button
                  onClick={() => {
                    handleClearFilters();
                    setShowMobileFilter(false);
                  }}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl text-sm"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowMobileFilter(false)}
                  className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl text-sm"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
