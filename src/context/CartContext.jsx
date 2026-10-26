import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('sawera_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load cart from storage', e);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('sawera_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sawera_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist to storage', e);
    }
  }, [wishlist]);

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      const updated = exists ? prev.filter(id => id !== productId) : [productId, ...prev];
      showToast(exists ? 'Removed from Wishlist' : 'Added to Wishlist');
      return updated;
    });
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  const addCustomBoxToCart = (boxData) => {
    const cartItemId = `custom-box-${Date.now()}`;
    const boxItem = {
      cartItemId,
      id: cartItemId,
      isCustomBox: true,
      name: `Custom Mithai Box (${boxData.boxOption.name})`,
      urduName: `کسٹم مٹھائی بکس (${boxData.boxOption.urduName})`,
      category: 'sweets',
      price: boxData.totalPrice,
      originalPrice: boxData.totalPrice,
      unit: `${boxData.totalGrams}g Assortment`,
      image: boxData.boxOption.image || '/images/hero/all-sweets.jpg',
      quantity: 1,
      boxDetails: {
        boxId: boxData.boxOption.id,
        boxName: boxData.boxOption.name,
        boxUrduName: boxData.boxOption.urduName,
        capacityGrams: boxData.boxOption.capacityGrams,
        packagingFee: boxData.packagingFee,
        totalGrams: boxData.totalGrams,
        items: boxData.items.map(it => ({
          productId: it.product.id,
          name: it.product.name,
          urduName: it.product.urduName,
          grams: it.grams,
          price: it.price,
          image: it.product.image
        })),
        ribbon: boxData.ribbon || null,
        giftMessage: boxData.giftMessage || '',
        recipientName: boxData.recipientName || ''
      }
    };

    setCart(prevCart => [boxItem, ...prevCart]);
    showToast(`Added Custom Box "${boxData.boxOption.name}" to cart!`);
    setIsCartOpen(true);
    return cartItemId;
  };

  useEffect(() => {
    try {
      localStorage.setItem('sawera_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to storage', e);
    }
  }, [cart]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const addToCart = (product, quantity = 1, selectedVariation = null) => {
    const itemPrice = selectedVariation?.discountPrice ?? selectedVariation?.price ?? product.discountPrice ?? product.price;
    const variationLabel = selectedVariation?.label || product.unit || 'Standard';
    const cartItemId = `${product.id}-${variationLabel}`;

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            cartItemId,
            id: product.id,
            name: product.name,
            urduName: product.urduName,
            category: product.category,
            price: itemPrice,
            originalPrice: selectedVariation?.price || product.price,
            unit: variationLabel,
            image: product.image,
            quantity: quantity
          }
        ];
      }
    });

    showToast(`Added "${product.name}" (${variationLabel}) to cart!`);
  };

  const updateQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const removeFromCart = (cartItemId) => {
    setCart(prevCart => prevCart.filter(item => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        addCustomBoxToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        toastMessage,
        wishlist,
        toggleWishlist,
        isInWishlist
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
