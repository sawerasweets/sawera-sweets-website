import React, { createContext, useContext, useState, useEffect } from 'react';
import db from '../services/db';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem('sawera_notifications');
      return stored ? JSON.parse(stored) : [
        {
          id: "notif-1",
          targetRole: "all",
          title: "Welcome to Sawera Sweets & Bakers!",
          titleUrdu: "سویرا سویٹس اینڈ بیکرز میں خوش آمدید!",
          message: "Experience authentic 30+ years heritage sweets and fresh bakery products.",
          type: "info",
          read: false,
          createdAt: new Date().toISOString()
        },
        {
          id: "notif-2",
          targetRole: "admin",
          title: "Stock Alert",
          titleUrdu: "اسٹاک الرٹ",
          message: "Shop 1 staff requested stock approval for Gulab Jamun.",
          type: "warning",
          read: false,
          createdAt: new Date(Date.now() - 3600000).toISOString()
        }
      ];
    } catch (e) {
      return [];
    }
  });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('sawera_sound_enabled') !== 'false';
  });

  useEffect(() => {
    localStorage.setItem('sawera_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('sawera_sound_enabled', String(soundEnabled));
  }, [soundEnabled]);

  const playNotificationSound = () => {
    if (!soundEnabled) return;
    try {
      // Gentle web audio beep
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 note
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      // AudioContext unavailable or blocked by browser policy
    }
  };

  const sendNotification = (notificationData) => {
    const newNotif = {
      ...notificationData,
      id: `notif-${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
    playNotificationSound();
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = (targetRole = null) => {
    setNotifications(prev => prev.map(n => {
      if (!targetRole || n.targetRole === targetRole || n.targetRole === 'all') {
        return { ...n, read: true };
      }
      return n;
    }));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        soundEnabled,
        toggleSound,
        sendNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
