import React, { useState } from 'react';
import { Settings, Save, AlertTriangle, RotateCcw, CheckCircle2, ShieldAlert, Lock, KeyRound } from 'lucide-react';
import db from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../../services/supabase';

export default function AdminSettingsPage() {
  const { user, updateProfile } = useAuth();
  const [settings, setSettings] = useState(() => db.getSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Admin Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState(null);

  const handleSave = (e) => {
    e.preventDefault();
    db.updateSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (!newPassword || newPassword.length < 5) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 5 characters long.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New password and Confirm password do not match.' });
      return;
    }

    const users = db.get('users');
    const adminUser = users.find(u => u.email === (user?.email || 'admin@sawerasweets.pk')) || users.find(u => u.role === 'super_admin');
    
    if (adminUser && currentPassword && adminUser.password !== currentPassword) {
      setPasswordMsg({ type: 'error', text: 'Current password is incorrect.' });
      return;
    }

    const updatedUsers = users.map(u => (u.id === (adminUser?.id || 'usr-admin') || u.role === 'super_admin') ? { ...u, password: newPassword } : u);
    db.set('users', updatedUsers);
    updateProfile({ password: newPassword });

    if (isSupabaseConfigured && supabase) {
      supabase.from('sawera_settings').upsert({
        id: 'admin_security',
        data: { adminEmail: adminUser?.email || 'admin@sawerasweets.pk', password: newPassword, updatedAt: new Date().toISOString() }
      }).then(() => {});
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordMsg({ type: 'success', text: 'Admin password changed successfully! Remember your new password for your next login.' });
  };

  return (
    <div className="space-y-6 max-w-4xl text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-gray-900">System Configurations &amp; Store Settings</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage delivery fee distance tiers, Easypaisa/MCB payment info, and integrations.</p>
        </div>

        {savedSuccess && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved!</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* General Store Identity */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-gray-900 pb-2 border-b">Store Identity &amp; Rules</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Official Business Name</label>
              <input
                type="text"
                disabled
                value={settings.storeName}
                className="w-full p-2 border rounded-xl bg-gray-50 font-bold text-[#07643D] outline-none"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">Strict spelling enforced: "Sawera Sweets &amp; Bakers"</span>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Business Name (Urdu)</label>
              <input
                type="text"
                value={settings.storeNameUrdu}
                onChange={(e) => setSettings({ ...settings, storeNameUrdu: e.target.value })}
                className="w-full p-2 border rounded-xl outline-none urdu-text"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Minimum Order (Rs)</label>
              <input
                type="number"
                value={settings.minOrderAmount}
                onChange={(e) => setSettings({ ...settings, minOrderAmount: Number(e.target.value) })}
                className="w-full p-2 border rounded-xl outline-none font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Free Delivery Min (Rs)</label>
              <input
                type="number"
                value={settings.freeDeliveryThreshold}
                onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })}
                className="w-full p-2 border rounded-xl outline-none font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Tax / GST Rate (%)</label>
              <input
                type="number"
                value={settings.taxRate}
                onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })}
                className="w-full p-2 border rounded-xl outline-none font-mono"
              />
            </div>
          </div>

          {/* Maintenance Mode */}
          <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-amber-950">Store Maintenance Mode</span>
                <p className="text-[11px] text-amber-800">
                  When enabled, regular customers see a maintenance message, while admins retain access.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                className={`px-3 py-1.5 rounded-full font-bold text-xs uppercase ${
                  settings.maintenanceMode ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {settings.maintenanceMode ? 'ENABLED (STORE OFFLINE)' : 'DISABLED (STORE LIVE)'}
              </button>
            </div>
            {settings.maintenanceMode && (
              <div>
                <label className="block font-bold text-amber-950 mb-1">Customer Maintenance Message</label>
                <input
                  type="text"
                  value={settings.maintenanceMessage}
                  onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
                  className="w-full p-2 border rounded-xl bg-white outline-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* City & Out-of-City Online Delivery Configuration */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Online Delivery Fee Settings</h2>
              <p className="text-[11px] text-gray-500">
                Configure delivery rates for Inside Jhang City and Out-of-City courier shipping.
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#07643D]">
              Shop Pickup Disabled
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-2">
              <label className="block font-bold text-[#07643D] text-xs">
                Apna City (Inside Jhang City) Delivery Fee (Rs)
              </label>
              <input
                type="number"
                value={settings.deliveryOptions?.inCityFee ?? settings.defaultDeliveryFee ?? 100}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setSettings({
                    ...settings,
                    defaultDeliveryFee: val,
                    deliveryOptions: {
                      ...(settings.deliveryOptions || {}),
                      inCityFee: val
                    }
                  });
                }}
                className="w-full p-2 border rounded-xl bg-white outline-none font-mono text-sm"
              />
              <p className="text-[10px] text-gray-500">
                Applied for local riders delivering inside Jhang.
              </p>
            </div>

            <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100 space-y-2">
              <label className="block font-bold text-amber-900 text-xs">
                Out City (Outside Jhang / Other Cities) Courier Fee (Rs)
              </label>
              <input
                type="number"
                value={settings.deliveryOptions?.outCityFee ?? 250}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setSettings({
                    ...settings,
                    deliveryOptions: {
                      ...(settings.deliveryOptions || {}),
                      outCityFee: val
                    }
                  });
                }}
                className="w-full p-2 border rounded-xl bg-white outline-none font-mono text-sm"
              />
              <p className="text-[10px] text-gray-500">
                Applied for parcel courier to other cities.
              </p>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 flex items-center justify-between">
            <span>Free Delivery on orders above:</span>
            <span className="font-bold text-[#07643D] font-mono">
              Rs. {settings.freeDeliveryThreshold?.toLocaleString() || '3,000'}
            </span>
          </div>
        </div>

        {/* Payment Gateway Configurations */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-gray-900 pb-2 border-b">Payment Methods Setup</h2>

          {/* Easypaisa */}
          <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-3">
            <span className="font-bold text-[#07643D] text-xs">Easypaisa Mobile Account Details</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Easypaisa Number</label>
                <input
                  type="text"
                  value={settings.payments?.easypaisa?.number || '0348 1702710'}
                  onChange={(e) => {
                    setSettings({
                      ...settings,
                      payments: {
                        ...settings.payments,
                        easypaisa: { ...settings.payments.easypaisa, number: e.target.value }
                      }
                    });
                  }}
                  className="w-full p-2 border rounded-xl bg-white outline-none font-mono font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Account Title</label>
                <input
                  type="text"
                  value={settings.payments?.easypaisa?.accountTitle || 'Muhammad Akash'}
                  onChange={(e) => {
                    setSettings({
                      ...settings,
                      payments: {
                        ...settings.payments,
                        easypaisa: { ...settings.payments.easypaisa, accountTitle: e.target.value }
                      }
                    });
                  }}
                  className="w-full p-2 border rounded-xl bg-white outline-none font-bold"
                />
              </div>
            </div>
          </div>

          {/* MCB Bank */}
          <div className="p-4 bg-[#FDFBF7] rounded-2xl border border-amber-200 space-y-3">
            <span className="font-bold text-amber-900 text-xs">Direct MCB Bank Transfer Setup</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={settings.payments?.bank?.bankName || 'MCB Bank Limited'}
                  onChange={(e) => {
                    setSettings({
                      ...settings,
                      payments: {
                        ...settings.payments,
                        bank: { ...settings.payments.bank, bankName: e.target.value }
                      }
                    });
                  }}
                  className="w-full p-2 border rounded-xl bg-white outline-none font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Account Title</label>
                <input
                  type="text"
                  value={settings.payments?.bank?.accountTitle || 'Sawera Sweets and Bakers'}
                  onChange={(e) => {
                    setSettings({
                      ...settings,
                      payments: {
                        ...settings.payments,
                        bank: { ...settings.payments.bank, accountTitle: e.target.value }
                      }
                    });
                  }}
                  className="w-full p-2 border rounded-xl bg-white outline-none font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Account Number</label>
                <input
                  type="text"
                  value={settings.payments?.bank?.accountNumber || ''}
                  placeholder="Enter real MCB Account Number"
                  onChange={(e) => {
                    setSettings({
                      ...settings,
                      payments: {
                        ...settings.payments,
                        bank: { ...settings.payments.bank, accountNumber: e.target.value }
                      }
                    });
                  }}
                  className="w-full p-2 border rounded-xl bg-white outline-none font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">IBAN Number</label>
                <input
                  type="text"
                  value={settings.payments?.bank?.iban || ''}
                  placeholder="PKXX MUCB XXXX XXXX XXXX"
                  onChange={(e) => {
                    setSettings({
                      ...settings,
                      payments: {
                        ...settings.payments,
                        bank: { ...settings.payments.bank, iban: e.target.value }
                      }
                    });
                  }}
                  className="w-full p-2 border rounded-xl bg-white outline-none font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp & Email Integration Screens */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-gray-900 pb-2 border-b">Integrations Setup (WhatsApp Business &amp; SMTP)</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">WhatsApp Business API Key</label>
              <input
                type="password"
                value={settings.integrations?.whatsapp?.apiKey || ''}
                placeholder="Enter API token when connecting Meta API"
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    integrations: {
                      ...settings.integrations,
                      whatsapp: { ...settings.integrations?.whatsapp, apiKey: e.target.value }
                    }
                  });
                }}
                className="w-full p-2 border rounded-xl outline-none"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">Live WhatsApp: 0347 1702710</span>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">SMTP Server Host</label>
              <input
                type="text"
                value={settings.integrations?.smtp?.host || ''}
                placeholder="e.g. smtp.gmail.com"
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    integrations: {
                      ...settings.integrations,
                      smtp: { ...settings.integrations?.smtp, host: e.target.value }
                    }
                  });
                }}
                className="w-full p-2 border rounded-xl outline-none"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">Sender: sawerasweets.pk@gmail.com</span>
            </div>
          </div>
        </div>

        {/* Admin Account Security & Password Change Card */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Lock className="w-4 h-4 text-[#07643D]" />
            <h2 className="text-sm font-bold text-gray-900">Admin Account Security &amp; Password Change</h2>
          </div>

          <p className="text-[11px] text-gray-500">
            Update your admin password for <strong>{user?.email || 'admin@sawerasweets.pk'}</strong>. The new password will sync to the cloud database.
          </p>

          {passwordMsg && (
            <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              passwordMsg.type === 'success' 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {passwordMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />}
              <span>{passwordMsg.text}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-2 border rounded-xl bg-white outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 border rounded-xl bg-white outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border rounded-xl bg-white outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handlePasswordChange}
              className="px-5 py-2.5 rounded-xl bg-[#07643D] text-white hover:bg-[#043E26] font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Update Admin Password</span>
            </button>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
          <div className="text-[11px] text-gray-400">
            Cloud Sync: All products, orders &amp; settings are permanently backed up to Supabase.
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#07643D] text-white hover:bg-[#043E26] font-bold text-xs shadow-md transition-colors"
          >
            <Save className="w-4 h-4 text-[#D4AF37]" />
            <span>Save All Store Settings</span>
          </button>
        </div>

      </form>
    </div>
  );
}
