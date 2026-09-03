import React, { useEffect, useState } from 'react';
import { Product, Category } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { BUSINESS_INFO, INITIAL_CATEGORIES } from '../data/business';
import storeHighlightImg from '../assets/images/stationery_shelf_1788093499273.jpg';
import {
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface HomePageProps {
  navigate: (path: string) => void;
  onViewProduct: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate, onViewProduct }) => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        setLoading(true);
        const [prodData, catData] = await Promise.all([
          api.getProducts({ sort: 'featured' }),
          api.getCategories(),
        ]);
        setFeaturedProducts(prodData.products.slice(0, 8));
        if (catData.categories && catData.categories.length > 0) {
          setCategories(catData.categories);
        }
      } catch (err) {
        console.error('Failed to load homepage catalog:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/shop?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 text-white overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_50%)]" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-800/60 border border-indigo-700/60 text-indigo-200 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Gulshan-e-Iqbal, Karachi • Online & In-Store</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-['Outfit',sans-serif] leading-[1.1]">
                Everything You Need for{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-indigo-200">
                  School, Gifts & More
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Welcome to <strong className="text-white">BIN QASIM BOOKS & UNIFORMS</strong>. Browse authentic school stationery, durable student backpacks, educational toys, luxury gift accessories, and sports equipment.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  id="hero-shop-now-btn"
                  onClick={() => navigate('/shop')}
                  className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-base shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 group transition-all transform active:scale-95"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  id="hero-browse-categories-btn"
                  onClick={() => {
                    const el = document.getElementById('shop-by-category-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-8 py-4 bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 rounded-xl font-semibold text-base backdrop-blur-md flex items-center justify-center gap-2 transition-all"
                >
                  <Layers className="w-5 h-5 text-amber-400" />
                  <span>Browse Categories</span>
                </button>
              </div>

              {/* Quick Trust badges */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-left">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <div className="font-semibold text-white">Cash on Delivery</div>
                    <div className="text-slate-400">Pay when received</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-950 border border-amber-800 flex items-center justify-center text-amber-400 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <div className="font-semibold text-white">Genuine Quality</div>
                    <div className="text-slate-400">Trusted school supplies</div>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-400 shrink-0">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <div className="font-semibold text-white">WhatsApp Support</div>
                    <div className="text-slate-400">{BUSINESS_INFO.whatsapp}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual Image Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-700/60 bg-slate-800">
                <img
                  src={storeHighlightImg}
                  alt="Bin Qasim Stationery, Pens & School Supplies"
                  className="w-full h-[380px] sm:h-[450px] object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex flex-col justify-end p-6">
                  <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
                    Store Highlight
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    Quality Stationery, School Bags & Sports Supplies
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Serving students, parents, and schools with verified supplies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop By Category Section */}
      <section id="shop-by-category-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Departments
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit',sans-serif] mt-1">
              Shop by Category
            </h2>
          </div>
          <button
            id="btn-view-all-shop"
            onClick={() => navigate('/shop')}
            className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 5 Primary Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              id={`category-card-${category.slug}`}
              onClick={() => handleCategoryClick(category.name)}
              className="group cursor-pointer rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-indigo-300 transition-all duration-300 flex flex-col"
            >
              <div className="aspect-[4/3] overflow-hidden bg-slate-100 relative">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-slate-950/10 group-hover:bg-slate-950/0 transition-colors" />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors flex items-center justify-between">
                    <span>{category.name}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {category.description}
                  </p>
                </div>
                {category.productCount !== undefined && (
                  <span className="text-[11px] font-semibold text-indigo-600 mt-3 block">
                    {category.productCount} Product{category.productCount === 1 ? '' : 's'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Handpicked Essentials
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit',sans-serif] mt-1">
              Featured Products
            </h2>
          </div>
          <button
            id="btn-see-all-featured"
            onClick={() => navigate('/shop')}
            className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse space-y-4">
                <div className="aspect-square bg-slate-200 rounded-xl" />
                <div className="h-4 bg-slate-200 rounded-md w-3/4" />
                <div className="h-4 bg-slate-200 rounded-md w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewProduct={onViewProduct}
              />
            ))}
          </div>
        )}
      </section>

      {/* Store Location & Direct Contact Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
                Visit Our Physical Store
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-['Outfit',sans-serif]">
                BIN QASIM BOOKS & UNIFORMS
              </h2>
              <div className="flex items-start gap-3 text-slate-300 text-sm">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span>{BUSINESS_INFO.address}</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Need customized school book bundles, uniform requirements, or bulk stationery orders? Call or WhatsApp us directly for instant assistance.
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-3">
              <a
                id="cta-whatsapp-link"
                href={`https://wa.me/${BUSINESS_INFO.whatsappRaw}?text=${encodeURIComponent('Hello Bin Qasim Books & Uniforms, I would like to inquire about products.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat on WhatsApp ({BUSINESS_INFO.whatsapp})</span>
              </a>

              <a
                id="cta-phone-link"
                href={`tel:+${BUSINESS_INFO.phoneRaw}`}
                className="w-full py-3.5 px-6 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 flex items-center justify-center gap-2 transition-all"
              >
                <Phone className="w-5 h-5 text-amber-400" />
                <span>Call Store ({BUSINESS_INFO.phone})</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
