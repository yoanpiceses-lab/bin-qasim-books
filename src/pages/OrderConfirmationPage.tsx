import React, { useEffect, useState } from 'react';
import { Order } from '../types';
import { api } from '../services/api';
import { BUSINESS_INFO } from '../data/business';
import {
  CheckCircle2,
  Package,
  Printer,
  ShoppingBag,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';

interface OrderConfirmationPageProps {
  orderId: string;
  navigate: (path: string) => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  orderId,
  navigate,
}) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        setLoading(true);
        const data = await api.getOrder(orderId);
        setOrder(data.order);
      } catch (err) {
        console.error('Failed to load order details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center animate-pulse">
        <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto mb-4" />
        <div className="h-6 bg-slate-200 rounded w-1/3 mx-auto mb-2" />
        <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Order Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">
          Could not find the requested order. It may have expired or the order number is incorrect.
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const whatsappInquiryUrl = `https://wa.me/${BUSINESS_INFO.whatsappRaw}?text=${encodeURIComponent(
    `Hello Bin Qasim Books & Uniforms, I just placed Order #${order.orderNumber}. My name is ${order.customerName}.`
  )}`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8 print:p-0 print:m-0 print:max-w-none">
      {/* Top Success Banner */}
      <div className="text-center space-y-3 print:hidden">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5" />
          Order Successfully Placed!
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
          Thank You, {order.customerName}!
        </h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Your order has been recorded in our system. Our team at Bin Qasim Books & Uniforms is preparing your items for delivery.
        </p>
      </div>

      {/* Main Order Receipt Card */}
      <div
        id="order-receipt-card"
        className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-8 space-y-6 print:border-none print:shadow-none print:p-0"
      >
        {/* Receipt Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              BIN QASIM BOOKS & UNIFORMS
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit',sans-serif]">
              ORDER #{order.orderNumber}
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {new Date(order.createdAt).toLocaleString('en-US', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Order Status
            </span>
            <span className="px-3.5 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-full uppercase tracking-wider">
              {order.status}
            </span>
          </div>
        </div>

        {/* Customer & Delivery Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 rounded-2xl p-5 border border-slate-100 text-xs sm:text-sm">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Customer Details
            </span>
            <div className="font-bold text-slate-900">{order.customerName}</div>
            <div className="text-slate-600 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{order.customerPhone}</span>
            </div>
            {order.customerEmail && (
              <div className="text-slate-600 flex items-center gap-1.5 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{order.customerEmail}</span>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Delivery Destination
            </span>
            <div className="text-slate-700 flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>{order.deliveryAddress}, {order.city}</span>
            </div>
            <div className="font-semibold text-emerald-700 pt-1">
              Payment: {order.paymentMethod}
            </div>
            {order.orderNotes && (
              <div className="text-xs text-slate-500 italic">
                Note: "{order.orderNotes}"
              </div>
            )}
          </div>
        </div>

        {/* Ordered Items Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Items Ordered
          </h3>
          <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
            {order.items.map((item, idx) => (
              <div key={idx} className="p-3.5 flex items-center justify-between gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-3 min-w-0">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                    />
                  )}
                  <div className="truncate">
                    <div className="font-semibold text-slate-900 truncate">{item.name}</div>
                    <div className="text-slate-500 text-xs">
                      PKR {item.price.toLocaleString()} × {item.quantity}
                    </div>
                  </div>
                </div>
                <div className="font-bold text-slate-900 shrink-0 font-['Outfit',sans-serif]">
                  PKR {(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals Breakdown */}
        <div className="pt-4 border-t border-slate-200 space-y-2 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-900">PKR {order.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Delivery Fee</span>
            <span className="text-emerald-700 font-semibold">
              {order.deliveryFee === 0 ? 'Free Delivery' : `PKR ${order.deliveryFee.toLocaleString()}`}
            </span>
          </div>
          <div className="pt-3 border-t border-slate-200 flex justify-between text-lg font-extrabold text-slate-900">
            <span>Total Payable</span>
            <span className="text-indigo-700 font-['Outfit',sans-serif]">
              PKR {order.total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons for Customer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <button
          id="btn-print-order"
          onClick={handlePrint}
          className="w-full sm:w-auto px-6 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
        >
          <Printer className="w-4 h-4 text-slate-600" />
          <span>Print Receipt</span>
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <a
            id="btn-confirm-whatsapp"
            href={whatsappInquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-xs transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Confirm on WhatsApp</span>
          </a>

          <button
            id="btn-confirm-continue-shop"
            onClick={() => navigate('/shop')}
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-xs transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
        </div>
      </div>
    </div>
  );
};
