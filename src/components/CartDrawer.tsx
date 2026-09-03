import React from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, X, Trash2, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';

interface CartDrawerProps {
  navigate: (path: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ navigate }) => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartSubtotal, cartCount } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Your Cart</h2>
                <p className="text-xs text-slate-500">{cartCount} item{cartCount === 1 ? '' : 's'} selected</p>
              </div>
            </div>
            <button
              id="btn-close-cart-drawer"
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1">Your cart is empty</h3>
                <p className="text-xs text-slate-500 mb-6 max-w-xs">
                  Looks like you haven't added any stationery, bags, toys or sports items to your cart yet.
                </p>
                <button
                  id="btn-drawer-start-shopping"
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/shop');
                  }}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-xs"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  id={`cart-drawer-item-${item.product.id}`}
                  className="flex gap-4 p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-18 h-18 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-sm font-semibold text-slate-900 truncate" title={item.product.name}>
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-xs font-semibold text-indigo-600">
                        PKR {item.product.price.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30"
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-slate-900">
                        PKR {(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">PKR {cartSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600 text-xs">
                  <span>Estimated Delivery (Karachi)</span>
                  <span className="text-emerald-700 font-medium">Free / COD</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-extrabold text-slate-900">
                  <span>Total</span>
                  <span className="font-['Outfit',sans-serif] text-indigo-700">
                    PKR {cartSubtotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-emerald-50 text-emerald-800 p-2.5 rounded-lg border border-emerald-200">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Cash on Delivery / Pay at Store - No advance payment needed</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  id="btn-view-full-cart"
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/cart');
                  }}
                  className="w-full py-3 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 rounded-xl text-sm font-semibold transition-colors"
                >
                  View Full Cart
                </button>
                <button
                  id="btn-drawer-checkout"
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/checkout');
                  }}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-200 transition-all"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
