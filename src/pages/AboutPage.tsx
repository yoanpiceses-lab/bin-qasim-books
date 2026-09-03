import React from 'react';
import { BUSINESS_INFO, INITIAL_CATEGORIES } from '../data/business';
import {
  BookOpen,
  ShoppingBag,
  Sparkles,
  Truck,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Phone,
  MessageCircle,
} from 'lucide-react';

interface AboutPageProps {
  navigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      {/* Hero Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-200">
          <BookOpen className="w-3.5 h-3.5" />
          About Bin Qasim Books & Uniforms
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
          Your Trusted Partner for School & Daily Supplies
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Located at Shazco Centre in Gulshan-e-Iqbal, Karachi, <strong>BIN QASIM BOOKS & UNIFORMS</strong> provides students, parents, and schools with quality stationery, backpacks, educational toys, creative gifts, and sports equipment.
        </p>
      </div>

      {/* Main Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-['Outfit',sans-serif]">
            Comprehensive School Supplies
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            From syllabus exercise books, notebooks, and writing instruments to mathematical sets and art materials, we stock everything required for all grade levels and academic boards.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-['Outfit',sans-serif]">
            Durable & Ergonomic Bags
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            We offer backpacks with spinal support, rolling trolley bags for young learners, and insulated lunch bags designed to withstand daily school life in Pakistan.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-['Outfit',sans-serif]">
            Toys, Gifts & Sports
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Encourage creativity and physical fitness with STEM learning toys, board games, executive gift sets, cricket bats, badminton equipment, and match footballs.
          </p>
        </div>
      </div>

      {/* Departments list */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-8">
        <div className="max-w-2xl">
          <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
            Our Offerings
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-['Outfit',sans-serif] mt-1">
            Explore What We Provide
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-slate-300 text-sm">
          {INITIAL_CATEGORIES.map((cat) => (
            <div key={cat.id} className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-2">
              <div className="font-bold text-white text-base flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{cat.name}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {cat.description}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            Available online with Cash on Delivery or for in-person shopping at our Karachi store.
          </div>
          <button
            onClick={() => navigate('/shop')}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition-all"
          >
            Visit Online Store
          </button>
        </div>
      </div>

      {/* Physical Store Contact Card */}
      <div className="border border-slate-200 rounded-3xl p-8 bg-white shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-slate-900 font-['Outfit',sans-serif]">
              Karachi Store Location
            </h3>
            <p className="text-sm text-slate-600 flex items-start gap-2">
              <MapPin className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <span>{BUSINESS_INFO.address}</span>
            </p>
            <p className="text-xs text-slate-500">
              Conveniently located in Gulshan-e-Iqbal, easily accessible for parents and students across Karachi.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`https://wa.me/${BUSINESS_INFO.whatsappRaw}?text=${encodeURIComponent('Hello Bin Qasim Books & Uniforms, I would like to get more information.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-xs transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Inquiry</span>
            </a>
            <a
              href={`tel:+${BUSINESS_INFO.phoneRaw}`}
              className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
            >
              <Phone className="w-4 h-4 text-amber-500" />
              <span>Call Store</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
