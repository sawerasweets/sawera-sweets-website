import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Menu, Building2, LogOut, Bell, Shield, ChevronDown } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import NotificationBell from '../customer/NotificationBell';

export default function AdminLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user, logout, isAdmin, isStaff } = useAuth();
  const { branches, activeBranchId, setActiveBranchId } = useStore();
  const navigate = useNavigate();

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

        {/* Dynamic Nested Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
