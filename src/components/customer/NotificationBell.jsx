import React, { useState, useRef, useEffect } from 'react';
import { Bell, Volume2, VolumeX, Check, Trash2 } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { useLanguage } from '../../context/LanguageContext';

export default function NotificationBell() {
  const { 
    notifications, 
    unreadCount, 
    soundEnabled, 
    toggleSound, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();
  const { isUrdu } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        className="relative p-2 rounded-full hover:bg-gray-100 text-gray-700 hover:text-[#07643D] transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute 0 top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className={`absolute top-full mt-2 ${isUrdu ? 'left-0' : 'right-0'} w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden animate-in fade-in zoom-in-95`}>
          {/* Header */}
          <div className="p-3 bg-[#07643D] text-white flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-bold">
              <Bell className="w-4 h-4 text-[#D4AF37]" />
              <span>{isUrdu ? 'اطلاعات و پیغامات' : 'Notifications'}</span>
              {unreadCount > 0 && (
                <span className="bg-[#D4AF37] text-[#07643D] px-1.5 py-0.2 rounded-full font-bold text-[10px]">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleSound}
                title={soundEnabled ? 'Mute audio alerts' : 'Enable audio alerts'}
                className="p-1 hover:bg-white/10 rounded transition-colors text-emerald-100"
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-red-300" />}
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsRead()}
                  className="px-2 py-0.5 hover:bg-white/10 rounded transition-colors text-[11px] underline text-emerald-100"
                >
                  {isUrdu ? 'سب پڑھ لیں' : 'Mark all read'}
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-500">
                {isUrdu ? 'کوئی نیا پیغام موجود نہیں۔' : 'No notifications yet.'}
              </div>
            ) : (
              notifications.slice(0, 15).map((n) => (
                <div
                  key={n.id}
                  className={`p-3 text-xs transition-colors flex items-start gap-2.5 ${
                    n.read ? 'bg-white opacity-80' : 'bg-emerald-50/50'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.read ? 'bg-transparent' : 'bg-[#07643D]'}`} />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 flex items-center justify-between">
                      <span>{isUrdu && n.titleUrdu ? n.titleUrdu : n.title}</span>
                      <span className="text-[10px] text-gray-400 font-normal">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-0.5 leading-relaxed">{n.message}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {!n.read && (
                      <button
                        onClick={() => markAsRead(n.id)}
                        title="Mark as read"
                        className="p-1 text-gray-400 hover:text-emerald-700"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(n.id)}
                      title="Delete"
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
