import React, { createContext, useContext, useState, useEffect } from 'react';
import db from '../services/db';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('sawera_current_user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  // Sync with DB updates
  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      if (user?.id) {
        const users = db.get('users');
        const fresh = users.find(u => u.id === user.id);
        if (fresh) {
          setUser(fresh);
          localStorage.setItem('sawera_current_user', JSON.stringify(fresh));
        }
      }
    });
    return unsubscribe;
  }, [user?.id]);

  const login = (email, password) => {
    setLoading(true);
    const users = db.get('users');
    const matched = users.find(
      u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
    );

    if (!matched) {
      setLoading(false);
      return { success: false, message: 'Invalid email or password.' };
    }

    if (!matched.isActive) {
      setLoading(false);
      return { success: false, message: 'This account has been deactivated. Please contact support.' };
    }

    // Check staff account expiry if applicable
    if (matched.role === 'staff' && matched.expiresAt) {
      const expiry = new Date(matched.expiresAt);
      if (new Date() > expiry) {
        setLoading(false);
        return { success: false, message: 'Your staff account access has expired. Please contact the administrator.' };
      }
    }

    setUser(matched);
    localStorage.setItem('sawera_current_user', JSON.stringify(matched));
    setLoading(false);
    return { success: true, user: matched };
  };

  const register = ({ name, email, phone, password }) => {
    setLoading(true);
    const users = db.get('users');
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (existing) {
      setLoading(false);
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name,
      email: email.toLowerCase().trim(),
      phone,
      password,
      role: 'customer',
      loyaltyPoints: 50, // Welcome signup bonus
      addresses: [],
      isActive: true,
      createdAt: new Date().toISOString()
    };

    db.set('users', [...users, newUser]);
    setUser(newUser);
    localStorage.setItem('sawera_current_user', JSON.stringify(newUser));
    db.logActivity('Customer Registered', `New customer ${newUser.name} signed up.`);
    setLoading(false);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sawera_current_user');
  };

  const updateProfile = (updates) => {
    if (!user) return false;
    const users = db.get('users');
    const updatedUsers = users.map(u => u.id === user.id ? { ...u, ...updates } : u);
    db.set('users', updatedUsers);
    const updatedSelf = { ...user, ...updates };
    setUser(updatedSelf);
    localStorage.setItem('sawera_current_user', JSON.stringify(updatedSelf));
    return true;
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.role === 'owner_admin') return true;
    if (user.role === 'staff') {
      if (user.permissions?.includes('all')) return true;
      return Boolean(user.permissions?.includes(permission));
    }
    return false;
  };

  const verifyOtp = (code) => {
    // Demo verification code is 1234 or any 4 digit number
    if (code && code.trim().length === 4) {
      return { success: true, message: 'Phone verified successfully.' };
    }
    return { success: false, message: 'Invalid verification code. Please enter 4 digits.' };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        hasPermission,
        verifyOtp,
        isAdmin: user?.role === 'owner_admin',
        isStaff: user?.role === 'staff',
        isRider: user?.role === 'rider',
        isCustomer: user?.role === 'customer'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
