import React from 'react';
import { BUSINESS_INFO, INITIAL_CATEGORIES } from '../data/business';
import {
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  Lock,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Truck,
  CreditCard,
} from 'lucide-react';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const handleCategoryClick = (categoryName: string) => {
    navigate(`/shop?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Value Proposition Strip */}
      <div className="border-b border-slate-800/80 bg-slate-950/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-800/50 flex items-center justify-center text-indigo-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-white text-sm sm:text-base">Karachi & Pakistan Delivery</div>
              <div className="text-xs text-slate-400">Fast home delivery with Cash on Delivery option.</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-800/50 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-white text-sm sm:text-base">Authentic Supplies</div>
              <div className="text-xs text-slate-400">Genuine stationery, certified school bags & reliable sports gear.</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-800/50 flex items-center justify-center text-amber-400 shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-white text-sm sm:text-base">Pay at Store or on Delivery</div>
              <div className="text-xs text-slate-400">Easy Cash on Delivery with no advance credit card needed.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & About */}
          <div className="space-y-4">
            <div
              id="footer-logo"
              onClick={() => navigate('/')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-bold text-white font-['Outfit',sans-serif]">
                  BIN QASIM
                </div>
                <div className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
                  Books & Uniforms
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              Your one-stop neighborhood and online destination for school stationery, textbooks, backpacks, educational toys, creative gifts, and sports goods in Karachi.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                id="footer-facebook"
                href={BUSINESS_INFO.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-indigo-600 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
                title="Follow us on Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              <a
                id="footer-instagram"
                href={BUSINESS_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-rose-600 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
                title="Follow us on Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              <a
                id="footer-whatsapp"
                href={`https://wa.me/${BUSINESS_INFO.whatsappRaw}?text=${encodeURIComponent('Hello Bin Qasim Books & Uniforms, I am messaging from your website.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
                title="Message on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Categories
            </h3>
            <ul className="space-y-2.5 text-sm">
              {INITIAL_CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <button
                    id={`footer-cat-${cat.slug}`}
                    onClick={() => handleCategoryClick(cat.name)}
                    className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group text-slate-400"
                  >
                    <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-amber-400 transition-colors" />
                    <span>{cat.name}</span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  id="footer-cat-all"
                  onClick={() => navigate('/shop')}
                  className="hover:text-indigo-400 text-indigo-400 text-xs font-semibold pt-1 flex items-center gap-1"
                >
                  View All Products & Deals →
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button
                  id="footer-link-home"
                  onClick={() => navigate('/')}
                  className="hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  id="footer-link-shop"
                  onClick={() => navigate('/shop')}
                  className="hover:text-white transition-colors"
                >
                  Shop Catalog
                </button>
              </li>
              <li>
                <button
                  id="footer-link-wishlist"
                  onClick={() => navigate('/wishlist')}
                  className="hover:text-white transition-colors"
                >
                  My Wishlist
                </button>
              </li>
              <li>
                <button
                  id="footer-link-cart"
                  onClick={() => navigate('/cart')}
                  className="hover:text-white transition-colors"
                >
                  Shopping Cart
                </button>
              </li>
              <li>
                <button
                  id="footer-link-about"
                  onClick={() => navigate('/about')}
                  className="hover:text-white transition-colors"
                >
                  About Our Store
                </button>
              </li>
              <li>
                <button
                  id="footer-link-contact"
                  onClick={() => navigate('/contact')}
                  className="hover:text-white transition-colors"
                >
                  Contact & Store Location
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Store Contact
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-1" />
                <span className="text-xs sm:text-sm text-slate-300 leading-snug">
                  {BUSINESS_INFO.address}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a
                  id="footer-phone-link"
                  href={`tel:+${BUSINESS_INFO.phoneRaw}`}
                  className="hover:text-white text-xs sm:text-sm"
                >
                  {BUSINESS_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  id="footer-whatsapp-link"
                  href={`https://wa.me/${BUSINESS_INFO.whatsappRaw}?text=${encodeURIComponent('Hello Bin Qasim Books & Uniforms, I would like to make an inquiry.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white text-xs sm:text-sm"
                >
                  {BUSINESS_INFO.whatsapp}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <a
                  id="footer-email-link"
                  href={`mailto:${BUSINESS_INFO.email}`}
                  className="hover:text-white text-xs sm:text-sm truncate"
                >
                  {BUSINESS_INFO.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Admin Link */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} BIN QASIM BOOKS & UNIFORMS. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-slate-400">Gulshan-e-Iqbal, Karachi, Pakistan</span>
            <button
              id="footer-admin-link"
              onClick={() => navigate('/admin/login')}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-indigo-400 transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>Store Admin</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
