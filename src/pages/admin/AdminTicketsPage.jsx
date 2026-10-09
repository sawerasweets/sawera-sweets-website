import React, { useState } from 'react';
import { Headphones, Send, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import db from '../../services/db';
import { useAuth } from '../../context/AuthContext';

export default function AdminTicketsPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState(() => db.get('tickets'));
  const [activeTicket, setActiveTicket] = useState(tickets[0] || null);
  const [replyText, setReplyText] = useState('');

  const syncTickets = () => {
    const fresh = db.get('tickets');
    setTickets(fresh);
    if (activeTicket) {
      setActiveTicket(fresh.find(t => t.id === activeTicket.id) || fresh[0]);
    }
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;

    const newMsg = {
      sender: user?.name || 'Store Admin',
      senderRole: 'admin',
      text: replyText.trim(),
      time: new Date().toISOString()
    };

    const updated = tickets.map(t => {
      if (t.id === activeTicket.id) {
        return {
          ...t,
          status: 'in_progress',
          messages: [...t.messages, newMsg]
        };
      }
      return t;
    });

    db.set('tickets', updated);
    db.logActivity('Support Ticket Replied', `Admin replied to ticket ${activeTicket.id}.`);
    setReplyText('');
    syncTickets();
  };

  const handleUpdateStatus = (id, newStatus) => {
    const updated = tickets.map(t => t.id === id ? { ...t, status: newStatus } : t);
    db.set('tickets', updated);
    syncTickets();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold font-serif text-gray-900">Customer Support Ticket Desk</h1>
        <p className="text-xs text-gray-500 mt-0.5">Resolve inquiries, bulk wedding event orders, and special requests.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        {/* Tickets List */}
        <div className="md:col-span-1 bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm h-[540px] flex flex-col">
          <div className="p-4 bg-gray-50 border-b border-gray-200 font-bold text-gray-800">
            Tickets ({tickets.length})
          </div>

          <div className="divide-y divide-gray-100 flex-1 overflow-y-auto">
            {tickets.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTicket(t)}
                className={`w-full p-4 text-left transition-colors flex flex-col gap-1 ${
                  activeTicket?.id === t.id ? 'bg-emerald-50 border-r-4 border-[#07643D]' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-gray-900">{t.id}</span>
                  <span className={`px-2 py-0.2 rounded-full font-bold text-[9px] uppercase ${
                    t.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                    t.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {t.status}
                  </span>
                </div>
                <p className="font-bold text-gray-800 line-clamp-1">{t.subject}</p>
                <p className="text-[11px] text-gray-500">{t.customerName}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Conversation Thread */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col h-[540px] overflow-hidden">
          {activeTicket ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-gray-100 bg-[#FDFBF7] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#07643D]">{activeTicket.id}</span>
                    <h3 className="font-bold text-gray-900 text-sm">{activeTicket.subject}</h3>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Customer: <span className="font-semibold text-gray-700">{activeTicket.customerName}</span> ({activeTicket.customerEmail})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={activeTicket.status}
                    onChange={(e) => handleUpdateStatus(activeTicket.id, e.target.value)}
                    className="p-1 border rounded-lg bg-white font-bold text-[11px] outline-none"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/40">
                {activeTicket.messages?.map((msg, i) => {
                  const isAdmin = msg.senderRole === 'admin';
                  return (
                    <div key={i} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl p-3 shadow-sm ${
                        isAdmin
                          ? 'bg-[#07643D] text-white rounded-br-none'
                          : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                      }`}>
                        <div className="flex items-center justify-between gap-4 mb-1 text-[10px]">
                          <span className={`font-bold ${isAdmin ? 'text-[#F4D375]' : 'text-[#07643D]'}`}>
                            {msg.sender}
                          </span>
                          <span className={isAdmin ? 'text-emerald-200' : 'text-gray-400'}>
                            {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="p-3 border-t bg-white flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type an official response..."
                  className="flex-1 px-3 py-2 border rounded-xl outline-none focus:border-[#07643D]"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="px-5 py-2 bg-[#07643D] text-white rounded-xl font-bold hover:bg-[#043E26] disabled:opacity-40 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reply</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-gray-400">
              Select a ticket to begin.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
