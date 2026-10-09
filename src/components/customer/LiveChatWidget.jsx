import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Paperclip, CheckCircle2, User, Shield } from 'lucide-react';
import db from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function LiveChatWidget() {
  const { user } = useAuth();
  const { isUrdu } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Load or initialize chat session for this user/visitor
  useEffect(() => {
    const syncChat = () => {
      const chats = db.get('chats');
      const email = user?.email || 'guest_visitor@sawerasweets.pk';
      let current = chats.find(c => c.customerEmail === email && c.status !== 'blocked');
      
      if (!current && isOpen) {
        // Initialize new chat thread
        current = {
          id: `chat-${Date.now()}`,
          customerName: user?.name || 'Store Guest',
          customerEmail: email,
          customerPhone: user?.phone || 'Not provided',
          status: 'active',
          unreadAdmin: true,
          unreadCustomer: false,
          messages: [
            {
              id: 'msg-init',
              sender: 'system',
              text: 'Assalam o Alaikum! Welcome to Sawera Sweets & Bakers. How can we serve you today?',
              textUrdu: 'السلام علیکم! سویرا سویٹس اینڈ بیکرز میں خوش آمدید۔ ہم آپ کی کیا خدمت کر سکتے ہیں؟',
              timestamp: new Date().toISOString()
            }
          ]
        };
        db.set('chats', [current, ...chats]);
      }
      setActiveChat(current);
    };

    syncChat();
    const unsubscribe = db.subscribe(syncChat);
    return unsubscribe;
  }, [user, isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeChat?.messages, isOpen]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() && !attachment) return;

    const chats = db.get('chats');
    const email = user?.email || 'guest_visitor@sawerasweets.pk';
    let chat = chats.find(c => c.customerEmail === email && c.status !== 'blocked');

    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: 'customer',
      customerName: user?.name || 'Guest Customer',
      text: inputText.trim(),
      attachmentUrl: attachment,
      timestamp: new Date().toISOString()
    };

    let updatedChats;
    if (chat) {
      updatedChats = chats.map(c => {
        if (c.id === chat.id) {
          return {
            ...c,
            status: 'active',
            unreadAdmin: true,
            messages: [...c.messages, newMessage]
          };
        }
        return c;
      });
    } else {
      const newChat = {
        id: `chat-${Date.now()}`,
        customerName: user?.name || 'Store Guest',
        customerEmail: email,
        customerPhone: user?.phone || 'Not provided',
        status: 'active',
        unreadAdmin: true,
        unreadCustomer: false,
        messages: [
          {
            id: 'msg-init',
            sender: 'system',
            text: 'Assalam o Alaikum! Welcome to Sawera Sweets & Bakers. How can we serve you today?',
            timestamp: new Date().toISOString()
          },
          newMessage
        ]
      };
      updatedChats = [newChat, ...chats];
    }

    db.set('chats', updatedChats);
    setInputText('');
    setAttachment(null);
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

  return (
    <>
      {/* Floating Chat Launcher Button (Positioned safely above mobile nav) */}
      <div className="fixed bottom-20 md:bottom-6 right-5 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open Live Chat"
            className="flex items-center gap-2 px-4 py-3 rounded-full bg-[#07643D] text-white hover:bg-[#043E26] shadow-xl transition-all duration-300 hover:scale-105 border-2 border-[#D4AF37] group"
          >
            <MessageSquare className="w-5 h-5 text-[#D4AF37] animate-pulse" />
            <span className="text-xs font-bold tracking-wide hidden sm:inline">
              {isUrdu ? 'لائیو چیٹ' : 'Live Chat'}
            </span>
          </button>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 w-[92vw] sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden h-[480px] animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-[#07643D] text-white p-3.5 flex items-center justify-between border-b border-[#043E26]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-[#D4AF37]">
                <img 
                  src="/images/logo/logo.jpg" 
                  alt="Sawera" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/src/assets/logo.jpg";
                  }}
                />
              </div>
              <div>
                <h3 className="text-xs font-bold leading-tight">Sawera Sweets &amp; Bakers</h3>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Shop 1 Online (5:30 AM - Midnight)</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2.5 bg-[#FDFBF7] text-xs">
            {activeChat?.messages?.map((msg) => {
              const isMe = msg.sender === 'customer';
              const isSystem = msg.sender === 'system';

              if (isSystem) {
                return (
                  <div key={msg.id} className="text-center my-2">
                    <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] px-3 py-1 rounded-full font-medium shadow-sm">
                      {isUrdu && msg.textUrdu ? msg.textUrdu : msg.text}
                    </span>
                  </div>
                );
              }

              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl p-2.5 shadow-sm text-xs ${
                      isMe
                        ? 'bg-[#07643D] text-white rounded-br-none'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                    }`}
                  >
                    {!isMe && (
                      <div className="text-[10px] font-bold text-[#D4AF37] mb-0.5 flex items-center gap-1">
                        <Shield className="w-3 h-3 text-[#D4AF37]" />
                        <span>Support Staff</span>
                      </div>
                    )}
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    {msg.attachmentUrl && (
                      <div className="mt-1.5 rounded-lg overflow-hidden border border-white/20">
                        <img src={msg.attachmentUrl} alt="Attached receipt/photo" className="max-h-36 w-full object-cover" />
                      </div>
                    )}
                    <span className={`block text-[9px] mt-1 text-right ${isMe ? 'text-emerald-200' : 'text-gray-400'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Attachment Preview */}
          {attachment && (
            <div className="px-3 py-1.5 bg-amber-50 border-t border-amber-100 flex items-center justify-between text-[11px] text-amber-900">
              <span className="truncate">Image attached</span>
              <button onClick={() => setAttachment(null)} className="text-amber-800 font-bold hover:text-red-600">
                Remove
              </button>
            </div>
          )}

          {/* Footer Input */}
          <form onSubmit={handleSendMessage} className="p-2.5 bg-white border-t border-gray-200 flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,.pdf"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Attach screenshot or receipt"
              className="p-2 text-gray-400 hover:text-[#07643D] rounded-full hover:bg-gray-100 transition-colors"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isUrdu ? 'اپنا پیغام یہاں لکھیں...' : 'Type your message...'}
              className="flex-1 py-1.5 px-3 rounded-full border border-gray-300 text-xs focus:border-[#07643D] outline-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim() && !attachment}
              className="p-2 bg-[#07643D] text-white rounded-full hover:bg-[#043E26] disabled:opacity-40 transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
