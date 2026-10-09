import React, { useState } from 'react';
import { X, HelpCircle, CheckCircle2 } from 'lucide-react';
import db from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function AskQuestionModal({ product, isOpen, onClose }) {
  const { user } = useAuth();
  const { isUrdu } = useLanguage();
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !product) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsSubmitting(true);
    const questions = db.get('questions');
    const newQ = {
      id: `q-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      customerName: user?.name || 'Customer Inquiry',
      question: question.trim(),
      answer: null,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    db.set('questions', [newQ, ...questions]);
    db.logActivity('Product Question Asked', `New question on ${product.name}: "${question.slice(0, 40)}..."`);
    setIsSubmitting(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="bg-[#07643D] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="text-sm font-bold">{isUrdu ? 'پروڈکٹ کے بارے میں سوال پوچھیں' : 'Ask a Question about Product'}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#07643D] mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-gray-900">
              {isUrdu ? 'آپ کا سوال موصول ہو چکا ہے!' : 'Question Submitted!'}
            </h4>
            <p className="text-xs text-gray-500">Our shop team will review and reply shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            <div>
              <p className="font-bold text-gray-800 text-sm">{product.name}</p>
              <p className="text-gray-500 text-[11px] mt-0.5">
                Ask about ingredients, desi ghee purity, packaging, or availability.
              </p>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                {isUrdu ? 'آپ کا سوال' : 'Your Question'}
              </label>
              <textarea
                required
                rows={3}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={isUrdu ? 'مثال کے طور پر: کیا یہ خالص دیسی گھی میں تیار ہوتا ہے؟' : 'e.g. Is this made with pure desi ghee or suitable for celebration gift packing?'}
                className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-[#07643D] outline-none text-xs"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-lg bg-[#07643D] text-white hover:bg-[#043E26] font-semibold transition-colors shadow-sm"
              >
                {isSubmitting ? 'Submitting...' : 'Post Question'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
