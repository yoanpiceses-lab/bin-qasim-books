import React from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { Heart, ShoppingBag, Check, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onViewProduct?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewProduct }) => {
  const { addToCart, isInWishlist, toggleWishlist } = useCart();
  const isWishlisted = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0 || !product.isAvailable;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div
      id={`product-card-${product.id}`}
      className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-lg hover:border-indigo-200 transition-all duration-300 flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-100 cursor-pointer" onClick={() => onViewProduct?.(product)}>
        <img
          src={product.image || 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80'}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Stock status overlay badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg tracking-wide uppercase shadow-xs backdrop-blur-md bg-white/95 text-slate-700">
            {product.category}
          </span>
          {isOutOfStock ? (
            <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg tracking-wide uppercase bg-rose-600 text-white shadow-xs">
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg tracking-wide uppercase bg-amber-500 text-slate-950 shadow-xs">
              Only {product.stock} Left!
            </span>
          ) : null}
        </div>

        {/* Wishlist Button */}
        <button
          id={`btn-wishlist-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-xs z-10 ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 shadow-md scale-110'
              : 'bg-white/90 text-slate-600 hover:text-rose-600 hover:bg-white'
          }`}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-label="Toggle Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Quick View Hover Overlay */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            id={`btn-quick-view-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onViewProduct?.(product);
            }}
            className="px-4 py-2 bg-white/95 hover:bg-white text-slate-900 text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3
            id={`product-title-${product.id}`}
            onClick={() => onViewProduct?.(product)}
            className="font-semibold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 hover:text-indigo-600 cursor-pointer transition-colors"
            title={product.name}
          >
            {product.name}
          </h3>

          <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
              Price
            </span>
            <div className="text-base sm:text-lg font-extrabold text-slate-900 font-['Outfit',sans-serif]">
              PKR {product.price.toLocaleString()}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            id={`btn-add-cart-${product.id}`}
            disabled={isOutOfStock}
            onClick={() => addToCart(product, 1)}
            className={`px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-xs ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white shadow-indigo-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
