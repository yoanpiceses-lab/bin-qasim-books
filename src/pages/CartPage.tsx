import React from 'react';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';

interface CartPageProps {
  navigate: (path: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ navigate }) => {
  const { cart, removeFromCart, updateQuantity, clearCart, cartSubtotal, cartCount } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit',sans-serif] mb-2">
          Your Shopping Cart is Empty
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-8">
          You have no items in your cart. Explore our store for the best stationery, school bags, toys, gifts, and sports items.
        </p>
        <button
          id="btn-cart-empty-shop-now"
          onClick={() => navigate('/shop')}
          className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-200 transition-all"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
            Shopping Cart
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            You have <strong className="text-slate-800">{cartCount}</strong> item{cartCount === 1 ? '' : 's'} in your cart.
          </p>
        </div>
        <button
          id="btn-clear-cart-all"
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 self-start sm:self-auto"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear entire cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden divide-y divide-slate-100">
            {cart.map((item) => (
              <div
                key={item.product.id}
                id={`cart-item-${item.product.id}`}
                className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:bg-slate-50/50 transition-colors"
              >
                {/* Product Thumbnail & Details */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 space-y-1">
                    <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                      {item.product.category}
                    </span>
                    <h3
                      onClick={() => navigate(`/product/${item.product.id}`)}
                      className="font-bold text-slate-900 text-sm sm:text-base hover:text-indigo-600 cursor-pointer line-clamp-2"
                    >
                      {item.product.name}
                    </h3>
                    <div className="text-xs text-slate-500">
                      Unit Price: <span className="font-semibold text-slate-800">PKR {item.product.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Subtotal */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="flex items-center border border-slate-200 rounded-xl bg-white shadow-xs">
                    <button
                      id={`btn-cart-minus-${item.product.id}`}
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-2 text-slate-600 hover:text-slate-900 disabled:opacity-30"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs sm:text-sm font-bold text-slate-900 min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      id={`btn-cart-plus-${item.product.id}`}
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-2 text-slate-600 hover:text-slate-900 disabled:opacity-30"
                      disabled={item.quantity >= item.product.stock}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right min-w-[5rem]">
                    <div className="text-sm sm:text-base font-extrabold text-slate-900 font-['Outfit',sans-serif]">
                      PKR {(item.product.price * item.quantity).toLocaleString()}
                    </div>
                  </div>

                  <button
                    id={`btn-cart-remove-${item.product.id}`}
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              id="btn-cart-continue-shopping"
              onClick={() => navigate('/shop')}
              className="text-xs sm:text-sm font-bold text-indigo-600 hover:underline flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 sticky top-28">
            <h2 className="text-lg font-bold text-slate-900 pb-4 border-b border-slate-100">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal ({cartCount})</span>
                <span className="font-semibold text-slate-900">PKR {cartSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Charges</span>
                <span className="text-emerald-700 font-semibold">Free (Karachi COD)</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Payment Method</span>
                <span className="text-slate-800 font-medium">Cash on Delivery</span>
              </div>
              <div className="pt-4 border-t border-slate-200 flex justify-between text-lg font-extrabold text-slate-900">
                <span>Total Amount</span>
                <span className="font-['Outfit',sans-serif] text-indigo-700">
                  PKR {cartSubtotal.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              id="btn-proceed-to-checkout"
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white rounded-xl font-bold text-base shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2 font-semibold text-slate-800">
                <Truck className="w-4 h-4 text-indigo-600" />
                <span>Fast Dispatch & Home Delivery</span>
              </div>
              <p>
                Orders are promptly reviewed by Bin Qasim store team. You will pay in cash upon receiving your parcel.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
