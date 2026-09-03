import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import {
  ShieldCheck,
  Truck,
  ArrowLeft,
  Lock,
  AlertCircle,
  CheckCircle2,
  Phone,
  User,
  Mail,
  MapPin,
  FileText,
  Building,
} from 'lucide-react';

interface CheckoutPageProps {
  navigate: (path: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ navigate }) => {
  const { cart, cartSubtotal, cartCount, clearCart } = useCart();

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [city, setCity] = useState('Karachi');
  const [orderNotes, setOrderNotes] = useState('');

  // Processing state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">No items to checkout</h2>
        <p className="text-sm text-slate-500 mb-6">
          Your cart is currently empty. Please add products before checking out.
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 9) {
      setErrorMessage('Please enter a valid contact phone number (e.g. 0333-1234567).');
      return;
    }
    if (!deliveryAddress.trim()) {
      setErrorMessage('Please enter your delivery street address.');
      return;
    }
    if (!city.trim()) {
      setErrorMessage('Please specify your city.');
      return;
    }

    try {
      setIsSubmitting(true);

      const itemsPayload = cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));

      const res = await api.createOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        deliveryAddress: deliveryAddress.trim(),
        city: city.trim(),
        orderNotes: orderNotes.trim() || undefined,
        items: itemsPayload,
      });

      if (res.success && res.order) {
        clearCart();
        navigate(`/order-confirmation/${res.order.id}`);
      } else {
        throw new Error(res.message || 'Failed to place order');
      }
    } catch (err: any) {
      console.error('Order submission error:', err);
      setErrorMessage(err.message || 'Failed to process order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
            Checkout
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete your order with Cash on Delivery / Pay at Store.
          </p>
        </div>
        <button
          onClick={() => navigate('/cart')}
          className="text-xs sm:text-sm font-semibold text-indigo-600 hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cart</span>
        </button>
      </div>

      {errorMessage && (
        <div id="checkout-error-banner" className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-start gap-3 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Error placing order: </strong>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Customer & Delivery Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Details Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
              <User className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">
                1. Customer Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Ahmed Khan"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Phone Number (WhatsApp) <span className="text-rose-500">*</span>
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="0333-XXXXXXX"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address (Optional)
              </label>
              <input
                id="checkout-email"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="customer@example.com"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                We'll send order updates and invoice details if provided.
              </span>
            </div>
          </div>

          {/* Delivery Address Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
              <MapPin className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">
                2. Delivery Destination
              </h2>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Complete Delivery Address <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="checkout-address"
                required
                rows={3}
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="House / Flat #, Street, Block, Area landmark..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  City <span className="text-rose-500">*</span>
                </label>
                <select
                  id="checkout-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                >
                  <option value="Karachi">Karachi (Gulshan, Clifton, PECHS, Nazimabad, etc.)</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Rawalpindi">Rawalpindi</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Peshawar">Peshawar</option>
                  <option value="Quetta">Quetta</option>
                  <option value="Faisalabad">Faisalabad</option>
                  <option value="Other">Other City in Pakistan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Order Instructions (Optional)
                </label>
                <input
                  id="checkout-notes"
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="e.g. Call before delivery, gift wrap"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">
                3. Payment Method
              </h2>
            </div>

            <div className="p-4 rounded-xl border-2 border-indigo-600 bg-indigo-50/50 flex items-start gap-3">
              <input
                type="radio"
                name="paymentMethod"
                id="pm-cod"
                checked
                readOnly
                className="mt-1 w-4 h-4 text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <label htmlFor="pm-cod" className="text-sm font-bold text-slate-900 block cursor-pointer">
                  Cash on Delivery / Pay at Store
                </label>
                <p className="text-xs text-slate-600 mt-0.5">
                  Pay with physical cash when the courier delivers your package or when you pick it up from our store in Shazco Centre, Gulshan-e-Iqbal.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Items Summary & Submit Button */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 sticky top-28">
            <h2 className="text-lg font-bold text-slate-900 pb-4 border-b border-slate-100">
              Order Summary ({cartCount} Items)
            </h2>

            {/* Items mini-list */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                    />
                    <div className="truncate">
                      <div className="font-semibold text-slate-900 truncate">{item.product.name}</div>
                      <div className="text-slate-500">Qty: {item.quantity} × PKR {item.product.price.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="font-bold text-slate-900 shrink-0">
                    PKR {(item.product.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2.5 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">PKR {cartSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery</span>
                <span className="text-emerald-700 font-medium">Free (Cash on Delivery)</span>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between text-lg font-extrabold text-slate-900">
                <span>Total Due</span>
                <span className="font-['Outfit',sans-serif] text-indigo-700">
                  PKR {cartSubtotal.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              id="btn-place-order-submit"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white rounded-xl font-bold text-base shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <span>Placing Order...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Place Order (PKR {cartSubtotal.toLocaleString()})</span>
                </>
              )}
            </button>

            <div className="text-center text-xs text-slate-400">
              An instant notification email will be dispatched to store administration upon order placement.
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
