import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Menu, Building2, LogOut, Bell, Shield, ChevronDown, Volume2, Sparkles, X, ShoppingBag } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import NotificationBell from '../customer/NotificationBell';
import db from '../../services/db';

export default function AdminLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [newOrderAlert, setNewOrderAlert] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const previousOrdersCountRef = useRef(null);
  const { user, logout, isAdmin, isStaff } = useAuth();
  const { branches, activeBranchId, setActiveBranchId } = useStore();
  const navigate = useNavigate();

  // Synthesized Shop Chime for Instant New Order Alert
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Tone 1: High crisp bell note (E5 - 659Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.35, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.6);

      // Tone 2: Harmonious celebratory note (A5 - 880Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(880, now + 0.2);
      gain2.gain.setValueAtTime(0.4, now + 0.2);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.2);
      osc2.stop(now + 1.2);
    } catch (e) {
      // AudioContext policy handled on user interaction
    }
  };

  // Real-time Cloud & Local Order Detector
  useEffect(() => {
    if (!user || (!isAdmin && !isStaff)) return;

    // Request desktop browser notifications
    if ('Notification' in window && Notification.permission === 'default') {
      try {
        Notification.requestPermission();
      } catch (e) {}
    }

    const checkOrders = () => {
      const orders = db.getOrders();
      if (previousOrdersCountRef.current !== null && orders.length > previousOrdersCountRef.current) {
        const latest = orders[0];
        if (latest) {
          playChime();
          setNewOrderAlert(latest);

          // Native OS Desktop Notification
          if ('Notification' in window && Notification.permission === 'granted') {
            try {
              new Notification(`🍰 Naya Order Aya! #${latest.id}`, {
                body: `Rs. ${latest.total?.toLocaleString()} from ${latest.customer?.name || 'Customer'} (${latest.customer?.phone || ''})`,
                icon: '/images/logo/logo.jpg'
              });
            } catch (e) {}
          }
        }
      }
      previousOrdersCountRef.current = orders.length;
    };

    checkOrders();
    const unsubscribe = db.subscribe(checkOrders);

    // Fast 8-second cloud sync poll to catch orders placed on customer mobiles
    const interval = setInterval(() => {
      db.syncOrdersFromSupabase().then(() => checkOrders()).catch(() => {});
    }, 8000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [user, isAdmin, isStaff, soundEnabled]);

  // Redirect if not admin or staff
  if (!user || (!isAdmin && !isStaff)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-red-200 text-center space-y-3 shadow-lg">
          <Shield className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-lg font-bold text-gray-900">Admin Authentication Required</h2>
          <p className="text-xs text-gray-500">
            Please log in with an authorized Owner/Admin or Staff account to enter the management panel.
          </p>
          <Link
            to="/login"
            className="inline-block mt-3 px-5 py-2.5 bg-[#07643D] text-white rounded-xl text-xs font-bold hover:bg-[#043E26] shadow"
          >
            Go to Admin Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col text-gray-800">
      {/* Sidebar */}
      <AdminSidebar
        isMobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Admin Top Navbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-2.5 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Store Information Badge */}
            <div className="flex items-center gap-2 text-xs">
              <Building2 className="w-4 h-4 text-[#07643D]" />
              <span className="font-semibold text-gray-600 hidden sm:inline">Store:</span>
              <span className="bg-emerald-50 text-[#07643D] border border-emerald-200/80 rounded-lg px-2.5 py-1 text-xs font-bold">
                Sawera Sweets &amp; Bakers (Main Store - Jhang)
              </span>
            </div>
          </div>

          {/* Right Admin Controls */}
          <div className="flex items-center gap-3">
            {/* Sound Alarm Toggle */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) playChime();
              }}
              title={soundEnabled ? 'Order Alarm Active (Click to mute)' : 'Order Alarm Muted (Click to enable)'}
              className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${
                soundEnabled 
                  ? 'bg-emerald-50 text-[#07643D] border-emerald-200' 
                  : 'bg-gray-100 text-gray-400 border-gray-200'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{soundEnabled ? 'Alarm On' : 'Muted'}</span>
            </button>

            <NotificationBell />

            <div className="hidden sm:flex flex-col text-right text-xs">
              <span className="font-bold text-gray-900">{user.name}</span>
              <span className="text-[10px] text-[#07643D] font-bold uppercase tracking-wider">
                {user.role === 'owner_admin' ? 'Master Admin' : 'Shop Staff'}
              </span>
            </div>

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              title="Logout"
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Live Top New Order Alert Banner */}
        {newOrderAlert && (
          <div className="bg-gradient-to-r from-emerald-600 via-[#07643D] to-teal-800 text-white px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg border-b border-emerald-500 animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-white text-[#07643D] flex items-center justify-center font-bold text-lg shadow-sm shrink-0 animate-bounce">
                🔔
              </span>
              <div>
                <p className="font-bold text-xs sm:text-sm flex items-center gap-2">
                  <span>Naya Order Aya Hai!</span>
                  <span className="font-mono bg-white/20 px-2 py-0.5 rounded text-[11px] font-bold">
                    #{newOrderAlert.id}
                  </span>
                  <span className="bg-[#D4AF37] text-gray-950 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    Rs. {newOrderAlert.total?.toLocaleString()}
                  </span>
                </p>
                <p className="text-[11px] text-emerald-100 mt-0.5">
                  Customer: <strong>{newOrderAlert.customer?.name}</strong> ({newOrderAlert.customer?.phone}) • {newOrderAlert.items?.length || 1} items
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                to="/admin/orders"
                onClick={() => setNewOrderAlert(null)}
                className="px-3.5 py-1.5 rounded-xl bg-white text-[#07643D] font-bold text-xs hover:bg-emerald-50 shadow transition-colors flex items-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>View Order</span>
              </Link>
              <button
                onClick={() => setNewOrderAlert(null)}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Nested Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
