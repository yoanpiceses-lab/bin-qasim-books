import React from 'react';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';

interface WishlistPageProps {
  navigate: (path: string) => void;
  onViewProduct: (product: Product) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ navigate, onViewProduct }) => {
  const { wishlist, clearWishlist } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Heart className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit',sans-serif] mb-2">
          Your Wishlist is Empty
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-8">
          Save your favorite stationery, school bags, toys, or sports gear by tapping the heart icon on any product.
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-200 transition-all"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
            My Saved Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {wishlist.length} item{wishlist.length === 1 ? '' : 's'} saved for later
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={clearWishlist}
            className="text-xs font-semibold text-rose-600 hover:underline"
          >
            Clear Wishlist
          </button>
          <button
            onClick={() => navigate('/shop')}
            className="text-xs sm:text-sm font-bold text-indigo-600 hover:underline flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <ProductCard key={product.id} product={product} onViewProduct={onViewProduct} />
        ))}
      </div>
    </div>
  );
};
