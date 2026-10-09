import React, { useState } from 'react';
import { HelpCircle, Mail, Plus, Trash2, CheckCircle2, X } from 'lucide-react';
import db from '../../services/db';

export default function AdminContentPage() {
  const [faqs, setFaqs] = useState(() => db.get('faqs'));
  const [messages, setMessages] = useState(() => db.get('contactMessages'));
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [faqQ, setFaqQ] = useState('');
  const [faqQUrdu, setFaqQUrdu] = useState('');
  const [faqA, setFaqA] = useState('');
  const [faqAUrdu, setFaqAUrdu] = useState('');

  const syncData = () => {
    setFaqs(db.get('faqs'));
    setMessages(db.get('contactMessages'));
  };

  const handleAddFaq = (e) => {
    e.preventDefault();
    const newFaq = {
      id: `faq-${Date.now()}`,
      question: faqQ,
      questionUrdu: faqQUrdu,
      answer: faqA,
      answerUrdu: faqAUrdu,
      category: 'general'
    };
    db.set('faqs', [...faqs, newFaq]);
    setIsFaqModalOpen(false);
    setFaqQ('');
    setFaqQUrdu('');
    setFaqA('');
    setFaqAUrdu('');
    syncData();
  };

  const handleDeleteFaq = (id) => {
    const filtered = faqs.filter(f => f.id !== id);
    db.set('faqs', filtered);
    syncData();
  };

  const handleDeleteMsg = (id) => {
    const filtered = messages.filter(m => m.id !== id);
    db.set('contactMessages', filtered);
    syncData();
  };

  return (
    <div className="space-y-6 text-xs">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold font-serif text-gray-900">FAQs &amp; Contact Inquiries Inbox</h1>
        <p className="text-xs text-gray-500 mt-0.5">Manage customer questions and review inquiries received from the Contact page.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FAQs Manager */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#07643D]" />
              <h2 className="text-sm font-bold text-gray-900">Manage Store FAQs ({faqs.length})</h2>
            </div>
            <button
              onClick={() => setIsFaqModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-[#07643D] text-white font-bold text-xs hover:bg-[#043E26]"
            >
              + Add FAQ
            </button>
          </div>

          <div className="space-y-3">
            {faqs.map((f) => (
              <div key={f.id} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="font-bold text-gray-900">{f.question}</p>
                  {f.questionUrdu && (
                    <p className="text-[11px] text-amber-800 font-semibold urdu-text">{f.questionUrdu}</p>
                  )}
                  <p className="text-gray-600 mt-1 leading-relaxed">{f.answer}</p>
                </div>
                <button
                  onClick={() => handleDeleteFaq(f.id)}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form Inquiries Inbox */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#07643D]" />
              <h2 className="text-sm font-bold text-gray-900">Inbound Contact Messages ({messages.length})</h2>
            </div>
          </div>

          <div className="space-y-3">
            {messages.length === 0 ? (
              <p className="text-gray-400 py-6 text-center">No inquiries in inbox.</p>
            ) : (
              messages.map((m) => (
                <div key={m.id} className="p-4 rounded-2xl bg-[#FDFBF7] border border-amber-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-gray-900">{m.name}</span>
                      <span className="text-gray-400 text-[10px] ml-2">{m.email} • {m.phone}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteMsg(m.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="font-semibold text-gray-800 text-xs">{m.subject}</p>
                  <p className="text-gray-600 bg-white p-2 rounded-lg border leading-relaxed">"{m.message}"</p>
                  <span className="text-[10px] text-gray-400 block">{new Date(m.date).toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add FAQ Modal */}
      {isFaqModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-3 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="font-bold text-sm text-gray-900">Add New FAQ</h3>
              <button onClick={() => setIsFaqModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddFaq} className="space-y-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Question (English)</label>
                <input
                  type="text"
                  required
                  value={faqQ}
                  onChange={(e) => setFaqQ(e.target.value)}
                  className="w-full p-2 border rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Question (Urdu)</label>
                <input
                  type="text"
                  value={faqQUrdu}
                  onChange={(e) => setFaqQUrdu(e.target.value)}
                  className="w-full p-2 border rounded-xl outline-none urdu-text"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Answer (English)</label>
                <textarea
                  required
                  rows={2}
                  value={faqA}
                  onChange={(e) => setFaqA(e.target.value)}
                  className="w-full p-2 border rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Answer (Urdu)</label>
                <textarea
                  rows={2}
                  value={faqAUrdu}
                  onChange={(e) => setFaqAUrdu(e.target.value)}
                  className="w-full p-2 border rounded-xl outline-none urdu-text"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsFaqModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#07643D] text-white rounded-xl font-bold hover:bg-[#043E26]"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
