import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Paperclip, Shield, Ban, CheckCircle, Download, UserX } from 'lucide-react';
import db from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import { exportToCSV } from '../../services/exportUtils';

export default function AdminChatPage() {
  const { user } = useAuth();
  const [chats, setChats] = useState(() => db.get('chats'));
  const [activeChat, setActiveChat] = useState(chats[0] || null);
  const [replyText, setReplyText] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [isStoreOnline, setIsStoreOnline] = useState(true);
  const fileInputRef = useRef(null);

  const syncChats = () => {
    const fresh = db.get('chats');
    setChats(fresh);
    if (activeChat) {
      setActiveChat(fresh.find(c => c.id === activeChat.id) || fresh[0]);
    }
  };

  useEffect(() => {
    const unsubscribe = db.subscribe(syncChats);
    return unsubscribe;
  }, [activeChat?.id]);

  const handleSendOperatorReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() && !attachment) return;
    if (!activeChat) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'admin',
      senderName: user?.name || 'Support Operator',
      text: replyText.trim(),
      attachmentUrl: attachment,
      timestamp: new Date().toISOString()
    };

    const updated = chats.map(c => {
      if (c.id === activeChat.id) {
        return {
          ...c,
          unreadAdmin: false,
          unreadCustomer: true,
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    });

    db.set('chats', updated);
    db.logActivity('Chat Replied', `Operator replied in chat ${activeChat.id}.`);
    setReplyText('');
    setAttachment(null);
    syncChats();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachment(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleBlock = (chatId, currentStatus) => {
    const newStatus = currentStatus === 'blocked' ? 'active' : 'blocked';
    const updated = chats.map(c => c.id === chatId ? { ...c, status: newStatus } : c);
    db.set('chats', updated);
    syncChats();
  };

  const handleExportChat = () => {
    if (!activeChat?.messages) return;
    const exportData = activeChat.messages.map(m => ({
      Timestamp: new Date(m.timestamp).toLocaleString(),
      Sender: m.sender,
      Message: m.text,
      HasAttachment: m.attachmentUrl ? 'Yes' : 'No'
    }));
    exportToCSV(exportData, `chat-transcript-${activeChat.id}.csv`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-gray-900">Live Customer Chat Console</h1>
          <p className="text-xs text-gray-500 mt-0.5">Real-time store visitor assistance and customer inquiries.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsStoreOnline(!isStoreOnline)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              isStoreOnline
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isStoreOnline ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
            <span>{isStoreOnline ? 'Operator Online (5:30 AM - Midnight)' : 'Operator Offline'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        {/* Chats List */}
        <div className="md:col-span-1 bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm h-[560px] flex flex-col">
          <div className="p-4 bg-gray-50 border-b border-gray-200 font-bold text-gray-800 flex justify-between items-center">
            <span>Conversations ({chats.length})</span>
            <span className="text-[10px] text-gray-500">Live Sync</span>
          </div>

          <div className="divide-y divide-gray-100 flex-1 overflow-y-auto">
            {chats.map((c) => {
              const lastMsg = c.messages?.[c.messages.length - 1];
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveChat(c)}
                  className={`w-full p-4 text-left transition-colors flex flex-col gap-1 ${
                    activeChat?.id === c.id ? 'bg-emerald-50 border-r-4 border-[#07643D]' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">{c.customerName}</span>
                    <span className={`px-2 py-0.2 rounded-full text-[9px] font-bold uppercase ${
                      c.status === 'blocked' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 line-clamp-1">{lastMsg?.text || 'No messages'}</p>
                  <span className="text-[9px] text-gray-400 mt-1">
                    {lastMsg ? new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Chat Conversation */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col h-[560px] overflow-hidden">
          {activeChat ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-gray-100 bg-[#FDFBF7] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 text-sm">{activeChat.customerName}</h3>
                    <span className="font-mono text-[11px] text-gray-400">({activeChat.customerEmail})</span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-0.5">Phone: {activeChat.customerPhone}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportChat}
                    className="p-1.5 rounded-lg border hover:bg-gray-50 text-gray-600"
                    title="Export transcript to CSV"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleToggleBlock(activeChat.id, activeChat.status)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      activeChat.status === 'blocked'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    {activeChat.status === 'blocked' ? 'Unblock Customer' : 'Block Customer'}
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/40">
                {activeChat.messages?.map((msg) => {
                  const isOperator = msg.sender === 'admin';
                  const isSystem = msg.sender === 'system';

                  if (isSystem) {
                    return (
                      <div key={msg.id} className="text-center my-2">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] px-3 py-1 rounded-full font-medium shadow-sm">
                          {msg.text}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div key={msg.id} className={`flex ${isOperator ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-2xl p-3 shadow-sm ${
                        isOperator
                          ? 'bg-[#07643D] text-white rounded-br-none'
                          : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                      }`}>
                        <div className="flex items-center justify-between gap-4 mb-1 text-[10px]">
                          <span className={isOperator ? 'text-[#F4D375] font-bold' : 'text-gray-600 font-bold'}>
                            {isOperator ? 'Sawera Operator' : activeChat.customerName}
                          </span>
                          <span className={isOperator ? 'text-emerald-200' : 'text-gray-400'}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        {msg.attachmentUrl && (
                          <div className="mt-2 rounded-xl overflow-hidden border max-h-48">
                            <img src={msg.attachmentUrl} alt="Attachment" className="max-h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Attachment Preview */}
              {attachment && (
                <div className="px-4 py-2 bg-amber-50 border-t border-amber-200 flex items-center justify-between text-xs">
                  <span>Attachment selected</span>
                  <button onClick={() => setAttachment(null)} className="text-red-600 font-bold">
                    Remove
                  </button>
                </div>
              )}

              {/* Reply Form */}
              <form onSubmit={handleSendOperatorReply} className="p-3 border-t bg-white flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-400 hover:text-[#07643D] rounded-full hover:bg-gray-100"
                  title="Attach screenshot/photo"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type an official reply to customer..."
                  className="flex-1 px-3 py-2 border rounded-xl outline-none focus:border-[#07643D]"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim() && !attachment}
                  className="px-5 py-2 bg-[#07643D] text-white rounded-xl font-bold hover:bg-[#043E26] disabled:opacity-40 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-gray-400">
              Select a conversation to reply.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
