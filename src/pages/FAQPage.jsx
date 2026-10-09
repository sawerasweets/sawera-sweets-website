import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Search, MessageSquare } from 'lucide-react';
import db from '../services/db';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

export default function FAQPage() {
  const { isUrdu } = useLanguage();
  const [faqs] = useState(() => db.get('faqs'));
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState(faqs[0]?.id || null);

  const filteredFaqs = faqs.filter(f => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] bg-[#07643D]/10 px-3 py-1 rounded-full">
          {isUrdu ? 'عام سوالات' : 'Customer Help & Questions'}
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#07643D] mt-2">
          {isUrdu ? 'اکثر پوچھے جانے والے سوالات' : 'Frequently Asked Questions'}
        </h1>
        <p className="text-xs text-gray-500 mt-2">
          Find answers about desi ghee ingredients, nationwide delivery, and payment options.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md mx-auto mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={isUrdu ? 'کوئی بھی سوال تلاش کریں...' : 'Search answers by keywords...'}
          className="w-full pl-9 pr-4 py-2.5 rounded-full border border-gray-300 text-xs focus:border-[#07643D] outline-none shadow-sm"
        />
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div key={faq.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-gray-900 hover:bg-gray-50"
              >
                <span>{isUrdu && faq.questionUrdu ? faq.questionUrdu : faq.question}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180 text-[#07643D]' : ''}`} />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3 bg-[#FDFBF7]/50">
                  <p>{isUrdu && faq.answerUrdu ? faq.answerUrdu : faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still need help callout */}
      <div className="mt-12 bg-emerald-50 rounded-3xl p-6 text-center border border-emerald-100 space-y-3">
        <h3 className="text-sm font-bold text-gray-900">Still have questions for our sweet masters?</h3>
        <p className="text-xs text-gray-600">Our customer team on Gojra Road, Jhang is available 7 days a week.</p>
        <div className="flex items-center justify-center gap-3 pt-1">
          <Link
            to="/contact"
            className="px-4 py-2 rounded-xl bg-[#07643D] text-white font-bold text-xs hover:bg-[#043E26]"
          >
            Contact Store
          </Link>
        </div>
      </div>
    </div>
  );
}
