import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Plus, Clock, CheckCircle2, Send, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import db from '../../services/db';

export default function CustomerTicketsPage() {
  const { user } = useAuth();
  const { isUrdu } = useLanguage();
  const [showNewModal, setShowNewModal] = useState(false);
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState('medium');
  const [message, setMessage] = useState('');
  const [activeTicket, setActiveTicket] = useState(null);
  const [replyText, setReplyText] = useState('');

  const tickets = db.get('tickets').filter(t => t.customerEmail === user?.email);

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    const allTickets = db.get('tickets');
    const newTicket = {
      id: `tkt-${Math.floor(100 + Math.random() * 900)}`,
      customerName: user?.name || 'Customer',
      customerEmail: user?.email || 'customer@sawerasweets.pk',
      subject: subject.trim(),
      priority,
      status: 'open',
      messages: [
        {
          sender: user?.name || 'Customer',
          senderRole: 'customer',
          text: message.trim(),
          time: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString()
    };

    db.set('tickets', [newTicket, ...allTickets]);
    db.logActivity('Support Ticket Created', `New ticket "${newTicket.subject}" created by ${user?.name}.`);
    setShowNewModal(false);
    setSubject('');
    setMessage('');
    setActiveTicket(newTicket);
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;

    const allTickets = db.get('tickets');
    const newMsg = {
      sender: user?.name || 'Customer',
      senderRole: 'customer',
      text: replyText.trim(),
      time: new Date().toISOString()
    };

    const updatedTickets = allTickets.map(t => {
      if (t.id === activeTicket.id) {
        return {
          ...t,
          status: 'in_progress',
          messages: [...t.messages, newMsg]
        };
      }
      return t;
    });

    db.set('tickets', updatedTickets);
    setActiveTicket(prev => ({
      ...prev,
      messages: [...prev.messages, newMsg]
    }));
    setReplyText('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-xs text-gray-500 mb-1 flex items-center gap-1.5">
            <Link to="/account" className="hover:text-[#07643D]">My Account</Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold">Support Tickets</span>
          </div>
          <h1 className="text-2xl font-bold font-serif text-gray-900">Customer Support Desk</h1>
          <p className="text-xs text-gray-500 mt-0.5">Submit inquiries for bulk orders, custom celebration packaging, or order help.</p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#07643D] text-white hover:bg-[#043E26] text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Open New Ticket</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ticket List Column */}
        <div className="md:col-span-1 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-3.5 bg-gray-50 border-b border-gray-200 font-bold text-xs text-gray-700">
            My Tickets ({tickets.length})
          </div>
          <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
            {tickets.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-500">
                No tickets submitted yet.
              </div>
            ) : (
              tickets.map((tkt) => (
                <button
                  key={tkt.id}
                  onClick={() => setActiveTicket(tkt)}
                  className={`w-full p-3.5 text-left text-xs transition-colors flex flex-col gap-1 ${
                    activeTicket?.id === tkt.id ? 'bg-emerald-50 border-r-4 border-[#07643D]' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-gray-800">{tkt.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      tkt.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                      tkt.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {tkt.status}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-900 line-clamp-1">{tkt.subject}</p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {new Date(tkt.createdAt).toLocaleDateString()}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Conversation View Column */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col h-[500px]">
          {activeTicket ? (
            <>
              {/* Conversation Header */}
              <div className="p-4 border-b border-gray-200 bg-[#FDFBF7] flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-[#07643D] text-xs">{activeTicket.id}</span>
                  <h3 className="font-bold text-gray-900 text-sm mt-0.5">{activeTicket.subject}</h3>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  activeTicket.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {activeTicket.status}
                </span>
              </div>

              {/* Messages Thread */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-gray-50/50">
                {activeTicket.messages?.map((msg, idx) => {
                  const isCustomer = msg.senderRole === 'customer';
                  return (
                    <div key={idx} className={`flex ${isCustomer ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl p-3 shadow-sm ${
                        isCustomer
                          ? 'bg-[#07643D] text-white rounded-br-none'
                          : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                      }`}>
                        <div className="flex items-center justify-between gap-4 mb-1 text-[10px]">
                          <span className={`font-bold ${isCustomer ? 'text-[#F4D375]' : 'text-[#07643D]'}`}>
                            {msg.sender}
                          </span>
                          <span className={isCustomer ? 'text-emerald-200' : 'text-gray-400'}>
                            {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Input */}
              <form onSubmit={handleSendReply} className="p-3 border-t border-gray-200 bg-white flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type a response to this ticket..."
                  className="flex-1 px-3 py-2 border rounded-xl text-xs outline-none focus:border-[#07643D]"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="px-4 py-2 bg-[#07643D] text-white rounded-xl hover:bg-[#043E26] font-semibold text-xs flex items-center gap-1.5 disabled:opacity-40"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-xs text-gray-500">
              <MessageSquare className="w-10 h-10 text-gray-300 mb-2" />
              <p>Select a ticket on the left to read conversation messages or click "Open New Ticket".</p>
            </div>
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 text-xs animate-in zoom-in-95">
            <h3 className="text-base font-bold text-gray-900 mb-4">Open Support Ticket</h3>
            <form onSubmit={handleCreateTicket} className="space-y-3.5">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Wedding Gift Box Packing Inquiry"
                  className="w-full p-2.5 rounded-lg border border-gray-300 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-gray-300 outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High (Urgent Event)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your inquiry in detail..."
                  className="w-full p-2.5 rounded-lg border border-gray-300 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 border rounded-lg text-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#07643D] text-white rounded-lg font-semibold hover:bg-[#043E26]"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
