import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';
import { BUSINESS_INFO } from '../data/business';
import {
  ShoppingBag,
  Heart,
  Plus,
  Minus,
  MessageCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  ChevronRight,
  ArrowLeft,
  Check,
} from 'lucide-react';

interface ProductDetailPageProps {
  productId: string;
  navigate: (path: string) => void;
  onViewProduct: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId,
  navigate,
  onViewProduct,
}) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>('');

  const { addToCart, isInWishlist, toggleWishlist, setIsCartOpen } = useCart();

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const data = await api.getProduct(productId);
        setProduct(data.product);
        setSelectedImage(data.product.image);
        setRelatedProducts(data.related || []);
        setQuantity(1);
      } catch (err) {
        console.error('Failed to fetch product details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [productId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-slate-200 rounded-3xl" />
          <div className="space-y-6">
            <div className="h-8 bg-slate-200 rounded-lg w-3/4" />
            <div className="h-6 bg-slate-200 rounded-lg w-1/4" />
            <div className="h-24 bg-slate-200 rounded-xl" />
            <div className="h-12 bg-slate-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Product Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">
          The product you are looking for may have been removed or is temporarily unavailable.
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0 || !product.isAvailable;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = () => {
    const success = addToCart(product, quantity);
    if (success) {
      setIsCartOpen(true);
    }
  };

  const whatsappInquiryUrl = `https://wa.me/${BUSINESS_INFO.whatsappRaw}?text=${encodeURIComponent(
    `Hello Bin Qasim Books & Uniforms, I want to inquire about "${product.name}" (Price: PKR ${product.price}). Is it available?`
  )}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 flex-wrap">
        <button onClick={() => navigate('/')} className="hover:text-indigo-600">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button onClick={() => navigate('/shop')} className="hover:text-indigo-600">
          Shop
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button
          onClick={() => navigate(`/shop?category=${encodeURIComponent(product.category)}`)}
          className="hover:text-indigo-600 font-medium"
        >
          {product.category}
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Product Hero Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left: Product Images */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 relative group shadow-sm">
            <img
              src={selectedImage || product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80';
              }}
            />

            {/* Availability Badge */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              <span className="px-3 py-1 bg-white/95 backdrop-blur-md rounded-xl text-xs font-bold text-slate-800 uppercase tracking-wider shadow-xs">
                {product.category}
              </span>
              {isOutOfStock ? (
                <span className="px-3 py-1 bg-rose-600 rounded-xl text-xs font-bold text-white uppercase tracking-wider shadow-xs">
                  Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="px-3 py-1 bg-amber-500 rounded-xl text-xs font-bold text-slate-950 uppercase tracking-wider shadow-xs">
                  Only {product.stock} Left!
                </span>
              ) : (
                <span className="px-3 py-1 bg-emerald-600 rounded-xl text-xs font-bold text-white uppercase tracking-wider shadow-xs flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  In Stock ({product.stock} units)
                </span>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              id="btn-detail-wishlist"
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all shadow-md ${
                isWishlisted
                  ? 'bg-rose-50 text-rose-600 shadow-rose-200 scale-110'
                  : 'bg-white/90 text-slate-700 hover:text-rose-600 hover:bg-white'
              }`}
              title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>

          {/* Additional Images Thumbnails (if any) */}
          {product.additionalImages && product.additionalImages.length > 0 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedImage(product.image)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                  selectedImage === product.image ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-slate-200'
                }`}
              >
                <img src={product.image} alt="Thumbnail 0" className="w-full h-full object-cover" />
              </button>
              {product.additionalImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === img ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-slate-200'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
              {product.category}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-['Outfit',sans-serif] leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Pricing */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
                Price
              </span>
              <div className="text-3xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
                PKR {product.price.toLocaleString()}
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
                Availability
              </span>
              <span
                className={`text-sm font-bold ${
                  isOutOfStock ? 'text-rose-600' : isLowStock ? 'text-amber-600' : 'text-emerald-600'
                }`}
              >
                {isOutOfStock ? 'Out of Stock' : `${product.stock} in stock`}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Product Description
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Purchase Controls */}
          {!isOutOfStock && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Quantity:
                </label>
                <div className="flex items-center border border-slate-300 rounded-xl bg-white shadow-xs">
                  <button
                    id="btn-qty-minus"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="p-3 text-slate-600 hover:text-slate-900 disabled:opacity-30"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-bold text-slate-900 min-w-[2.5rem] text-center">
                    {quantity}
                  </span>
                  <button
                    id="btn-qty-plus"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    className="p-3 text-slate-600 hover:text-slate-900 disabled:opacity-30"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-slate-400">
                  (Max {product.stock} units)
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              id="btn-add-to-cart-detail"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className={`flex-1 py-4 px-6 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-md transition-all ${
                isOutOfStock
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 active:scale-98'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span>{isOutOfStock ? 'Sold Out' : `Add to Cart • PKR ${(product.price * quantity).toLocaleString()}`}</span>
            </button>

            <a
              id="btn-whatsapp-inquire"
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-200 transition-all shrink-0"
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp Us</span>
            </a>
          </div>

          {/* Service Guarantees */}
          <div className="border-t border-slate-200 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Cash on Delivery across Karachi & nationwide</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Authentic quality guaranteed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products from same category */}
      {relatedProducts.length > 0 && (
        <section className="pt-10 border-t border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                More in {product.category}
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 font-['Outfit',sans-serif] mt-1">
                Related Products
              </h2>
            </div>
            <button
              onClick={() => navigate(`/shop?category=${encodeURIComponent(product.category)}`)}
              className="text-xs sm:text-sm font-bold text-indigo-600 hover:underline"
            >
              View All {product.category} →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} onViewProduct={onViewProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
