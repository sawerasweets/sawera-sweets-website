import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Boxes, 
  Receipt, 
  Building2, 
  Users, 
  UserCheck, 
  Bike, 
  Star, 
  HelpCircle, 
  MessageSquare, 
  Headphones, 
  BarChart3, 
  Image, 
  FileText, 
  Activity, 
  Settings, 
  ExternalLink,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminSidebar({ isMobileOpen, onCloseMobile }) {
  const { hasPermission, isAdmin } = useAuth();

  const links = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/admin/categories', label: 'Categories Management', icon: Layers, perm: 'view_products' },
    { to: '/admin/products', label: 'Products & Catalog', icon: ShoppingBag, perm: 'view_products' },
    { to: '/admin/inventory', label: 'Inventory & Approvals', icon: Boxes, perm: 'manage_stock' },
    { to: '/admin/orders', label: 'Orders & Fulfillment', icon: Receipt, perm: 'view_orders' },
    { to: '/admin/branches', label: 'Store Information', icon: Building2, adminOnly: true },
    { to: '/admin/customers', label: 'Customers & Loyalty', icon: Users, perm: 'view_customers' },
    { to: '/admin/staff', label: 'Staff & Roles', icon: UserCheck, adminOnly: true },
    { to: '/admin/riders', label: 'Delivery Riders', icon: Bike, adminOnly: true },
    { to: '/admin/reviews', label: 'Reviews Moderation', icon: Star, perm: 'manage_reviews' },
    { to: '/admin/questions', label: 'Product Q&A', icon: HelpCircle, perm: 'manage_reviews' },
    { to: '/admin/tickets', label: 'Support Tickets', icon: Headphones },
    { to: '/admin/chat', label: 'Live Chat Console', icon: MessageSquare },
    { to: '/admin/analytics', label: 'Sales & Financials', icon: BarChart3, adminOnly: true },
    { to: '/admin/banners', label: 'Homepage Banners', icon: Image, adminOnly: true },
    { to: '/admin/content', label: 'FAQs & Messages', icon: FileText },
    { to: '/admin/logs', label: 'System Audit Log', icon: Activity, adminOnly: true },
    { to: '/admin/settings', label: 'Store Settings', icon: Settings, adminOnly: true }
  ];

  const visibleLinks = links.filter(link => {
    if (link.adminOnly && !isAdmin) return false;
    if (link.perm && !hasPermission(link.perm)) return false;
    return true;
  });

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-[#043E26] text-white z-50 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col border-r border-emerald-900 shadow-xl`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-emerald-900/60 bg-[#022818] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-[#D4AF37] flex-shrink-0">
              <img 
                src="/images/logo/logo.jpg" 
                alt="Sawera Logo" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/src/assets/logo.jpg";
                }}
              />
            </div>
            <div>
              <h2 className="text-xs font-bold font-serif leading-tight">Sawera Sweets &amp; Bakers</h2>
              <span className="text-[10px] text-[#F4D375] font-semibold">Admin Workspace</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-xs">
          {visibleLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-all ${
                    isActive
                      ? 'bg-[#07643D] text-white font-bold shadow-sm border border-emerald-600'
                      : 'text-emerald-100 hover:bg-emerald-900/60 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* View Storefront Link */}
        <div className="p-3 border-t border-emerald-900/60 bg-[#022818]">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-900/50 hover:bg-emerald-800 text-emerald-200 text-xs font-semibold transition-colors"
          >
            <span>Live Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </aside>
    </>
  );
}
