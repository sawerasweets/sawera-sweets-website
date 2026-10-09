import React, { createContext, useContext, useState, useEffect } from 'react';
import db from '../services/db';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState(() => db.getProducts());
  const [categories, setCategories] = useState(() => db.get('categories'));
  const [branches, setBranches] = useState(() => db.getBranches());
  const [settings, setSettings] = useState(() => db.getSettings());
  const [activeBranchId, setActiveBranchId] = useState('shop-1');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Reactively subscribe to db changes
  useEffect(() => {
    const syncWithDb = () => {
      setProducts(db.getProducts());
      setCategories(db.get('categories'));
      setBranches(db.getBranches());
      setSettings(db.getSettings());
    };

    const unsubscribe = db.subscribe(syncWithDb);
    return unsubscribe;
  }, []);

  const activeBranch = branches.find(b => b.id === activeBranchId) || branches[0];

  return (
    <StoreContext.Provider
      value={{
        categories,
        products,
        branches,
        settings,
        activeBranch,
        activeBranchId,
        setActiveBranchId,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
