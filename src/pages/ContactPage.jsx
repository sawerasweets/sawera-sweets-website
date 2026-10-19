import React, { useState } from 'react';
import { Phone, MapPin, Clock, MessageSquare, Send, CheckCircle2, Mail } from 'lucide-react';
import db from '../services/db';
import { useLanguage } from '../context/LanguageContext';

export default function ContactPage() {
  const { isUrdu } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const messages = db.get('contactMessages');
    const newMsg = {
      id: `msg-${Date.now()}`,
      name: formData.name,
      email: formData.email || 'customer@example.com',
      phone: formData.phone,
      subject: formData.subject || 'Website Inquiry',
      message: formData.message,
      date: new Date().toISOString(),
      status: 'unread'
    };
    db.set('contactMessages', [newMsg, ...messages]);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">
            {isUrdu ? 'رابطہ کریں' : 'Get In Touch'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-[#07643D]">
            Sawera Sweets &amp; Bakers
          </h1>
          <p className="urdu-text text-lg text-[#A5841D] font-bold">
            سویرا سویٹس اینڈ بیکرز - ہر خوشی کیساتھ
          </p>
          <p className="text-xs text-gray-500 max-w-lg mx-auto">
            {isUrdu
              ? 'کسی بھی سوال یا آرڈر سے متعلق براہ راست رابطہ کریں۔'
              : 'Have a question about bulk wedding orders, fresh mithai boxes, or daily deliveries? Reach out to us directly.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Store Info Cards */}
          <div className="space-y-4">
            
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-[#07643D]">
                <MapPin className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="text-sm font-bold">Shop 1 (Main Head Office Store)</h3>
              </div>
              <p className="text-xs font-semibold text-gray-800 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                Gojra Road, Opposite DHQ Hospital, Jhang
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-[#07643D]">
                <Clock className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="text-sm font-bold">Operating Hours</h3>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <p><span className="font-semibold text-gray-800">Every Day:</span> 5:30 AM to 12:00 AM (Midnight)</p>
                <p className="text-[#07643D] font-semibold">Open 7 days a week for fresh preparation</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-[#07643D]">
                <Phone className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="text-sm font-bold">Direct Call &amp; WhatsApp</h3>
              </div>
              <div className="text-xs space-y-1.5">
                <p>
                  Orders / Call: <a href="tel:03227434080" className="font-mono text-gray-800 font-bold hover:underline">0322 7434080</a>
                </p>
                <p>
                  WhatsApp: <a href="https://wa.me/923227434080" target="_blank" rel="noreferrer" className="font-mono text-[#07643D] font-bold hover:underline">0322 7434080</a>
                </p>
                <p>
                  Email: <a href="mailto:sawerasweets.pk@gmail.com" className="font-mono text-gray-700 hover:underline">sawerasweets.pk@gmail.com</a>
                </p>
              </div>
            </div>

          </div>

          {/* Inquiry Form */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
            <h3 className="text-base font-bold font-serif text-gray-900 mb-4">
              Send an Inquiry or Order Message
            </h3>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 text-center space-y-2 border border-emerald-200">
                <CheckCircle2 className="w-8 h-8 text-[#07643D] mx-auto" />
                <h4 className="text-sm font-bold text-[#07643D]">Message Received!</h4>
                <p className="text-xs text-emerald-800">
                  Thank you for reaching out to Sawera Sweets &amp; Bakers. Our shop management will contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter full name"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-[#07643D] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Contact Phone *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="03XX XXXXXXX"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-[#07643D] outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@example.com"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-[#07643D] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Wedding Gift Boxes / Bakery Order"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-[#07643D] outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Message / Requirements *</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your inquiry..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-[#07643D] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#07643D] hover:bg-[#043E26] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Send className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Send Message to Store</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
