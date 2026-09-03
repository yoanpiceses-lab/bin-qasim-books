import React, { useState } from 'react';
import { BUSINESS_INFO } from '../data/business';
import {
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Share2,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;

    // Build WhatsApp message for instant direct connection as well
    const text = `Hello Bin Qasim Books & Uniforms,\nName: ${name}\nPhone: ${phone}\nMessage: ${message}`;
    const waUrl = `https://wa.me/${BUSINESS_INFO.whatsappRaw}?text=${encodeURIComponent(text)}`;

    setIsSubmitted(true);
    // Also trigger whatsapp window
    window.open(waUrl, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
          Contact & Store Location
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Have a question about book bundles, uniforms, stationery, or order status? We are always here to help you online or at our Karachi store.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <h2 className="text-xl font-bold text-slate-900 font-['Outfit',sans-serif] pb-3 border-b border-slate-100">
              Business Information
            </h2>

            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Store Address
                </div>
                <p className="text-sm font-semibold text-slate-900 leading-snug">
                  {BUSINESS_INFO.name}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {BUSINESS_INFO.address}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                <Phone className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Phone Call
                </div>
                <a
                  href={`tel:+${BUSINESS_INFO.phoneRaw}`}
                  className="text-sm font-bold text-slate-900 hover:text-indigo-600 block transition-colors"
                >
                  {BUSINESS_INFO.phone}
                </a>
                <span className="text-xs text-slate-500">Available during store business hours</span>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  WhatsApp Support
                </div>
                <a
                  href={`https://wa.me/${BUSINESS_INFO.whatsappRaw}?text=${encodeURIComponent('Hello Bin Qasim Books & Uniforms, I would like to inquire about products.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold text-emerald-700 hover:text-emerald-800 block transition-colors"
                >
                  {BUSINESS_INFO.whatsapp}
                </a>
                <span className="text-xs text-slate-500">Fast response for inquiries & quotes</span>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Email
                </div>
                <a
                  href={`mailto:${BUSINESS_INFO.email}`}
                  className="text-sm font-bold text-slate-900 hover:text-indigo-600 block transition-colors"
                >
                  {BUSINESS_INFO.email}
                </a>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Follow Us Online
              </div>
              <div className="flex gap-3">
                <a
                  href={BUSINESS_INFO.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-indigo-600 hover:text-white border border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Facebook</span>
                </a>
                <a
                  href={BUSINESS_INFO.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-rose-600 hover:text-white border border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Instagram</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quick Direct Contact Form & WhatsApp CTA */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-['Outfit',sans-serif]">
                Send Us a Message
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Fill in your message below and we will connect with you right away.
              </p>
            </div>

            {isSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-bold text-emerald-900">Message Sent!</h3>
                <p className="text-xs text-emerald-800 max-w-sm mx-auto">
                  Thank you for reaching out. We have opened WhatsApp to connect directly, or you can call us anytime at {BUSINESS_INFO.phone}.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-2 text-xs font-bold text-emerald-700 hover:underline"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Your Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Tariq Mehmood"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0333-XXXXXXX"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Message / Product Inquiry <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what books, uniforms, stationery, or toys you are looking for..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-200 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message via WhatsApp</span>
                </button>
              </form>
            )}
          </div>

          {/* Quick Location Map Banner */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base">Visit Our Shop</h3>
                <p className="text-xs text-slate-400">Shazco Centre, Gulshan-e-Iqbal Block 4, Karachi</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Google Maps Plus Code: <strong className="text-amber-300">W4J2+R84</strong>. Easily located near main Gulshan-e-Iqbal market hub.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
