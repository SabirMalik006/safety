import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../services/api';
import { isAuthenticated } from '../services/authService';
import { getCart as apiGetCart, addToCart as apiAddToCart, updateCartItem as apiUpdateCartItem, removeFromCart as apiRemoveFromCart, clearCart as apiClearCart } from '../services/cartService';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  // ✅ Safe fallback if context is not available
  if (!context) {
    return { 
      cartItems: [], 
      addToCart: () => {}, 
      removeFromCart: () => {}, 
      updateQuantity: () => {}, 
      getCartTotal: () => 0, 
      getCartCount: () => 0, 
      clearCart: () => {},
      placeOrder: async () => {},
      loading: false 
    };
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (isAuthenticated()) {
      try {
        const response = await apiGetCart();
        const cartData = response?.data?.items ? response.data : response?.data?.data;

        if (cartData && cartData.items) {
          const formattedItems = cartData.items.map(item => ({
            itemId: item._id,
            productId: item.product?._id || item.product,
            name: item.name,
            price: item.price,
            image:
              (typeof item.image === 'string' && item.image.startsWith('http') ? item.image : '') ||
              item.product?.images?.[0]?.url ||
              item.product?.images?.[0] ||
              '/images/placeholder.jpg',
            quantity: item.quantity,
            color: item.selectedColor,
            stock: item.product?.inStock || 100,
            slug: item.product?.slug || ''
          }));
          setCartItems(formattedItems);
        }
      } catch (e) {
        console.error('Error fetching cart from backend:', e);
      }
    } else {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart);
          setCartItems(Array.isArray(parsed) ? parsed : []);
        } catch (e) {
          setCartItems([]);
        }
      }
    }
  }, []);

  useEffect(() => {
    fetchCart();
    
    const handleAuthChange = () => {
      if (!isAuthenticated()) {
        setCartItems([]);
        localStorage.removeItem('cart');
      } else {
        fetchCart();
      }
    };
    
    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, [fetchCart]);

  useEffect(() => {
    if (!isAuthenticated()) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = async (product, quantity = 1, selectedColor = null, selectedSize = null) => {
    const productId = product._id || product.id;
    
    if (isAuthenticated()) {
      try {
        await apiAddToCart(productId, quantity, selectedColor || '');
        await fetchCart();
      } catch (e) {
        console.error('Error adding to backend cart:', e);
      }
    } else {
      setCartItems(prevItems => {
        const existingIndex = prevItems.findIndex(
          item => item.productId === productId && 
                  item.color === selectedColor && 
                  item.size === selectedSize
        );

        if (existingIndex > -1) {
          const updated = [...prevItems];
          updated[existingIndex].quantity += quantity;
          return updated;
        }

        return [...prevItems, {
          productId: productId,
          name: product.name,
          price: product.price,
          image: product.images?.[0]?.url || product.image || '/images/placeholder.jpg',
          quantity: quantity,
          color: selectedColor,
          size: selectedSize,
          stock: product.stock || 100,
          slug: product.slug
        }];
      });
    }
  };

  const removeFromCart = async (index) => {
    const item = cartItems[index];
    if (!item) return;

    if (isAuthenticated() && item.itemId) {
      try {
        await apiRemoveFromCart(item.itemId);
        await fetchCart();
      } catch (e) {
        console.error('Error removing from backend cart:', e);
      }
    } else {
      setCartItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateQuantity = async (index, newQuantity) => {
    const item = cartItems[index];
    if (!item) return;

    if (newQuantity < 1) {
      return removeFromCart(index);
    }
    
    if (isAuthenticated() && item.itemId) {
      try {
        await apiUpdateCartItem(item.itemId, newQuantity);
        await fetchCart();
      } catch (e) {
        console.error('Error updating backend cart:', e);
      }
    } else {
      setCartItems(prev => prev.map((it, i) => 
        i === index ? { ...it, quantity: newQuantity } : it
      ));
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + (item.quantity || 1), 0);
  };

  const clearCart = async () => {
    if (isAuthenticated()) {
      try {
        await apiClearCart();
        setCartItems([]);
      } catch (e) {
        console.error('Error clearing backend cart:', e);
      }
    } else {
      setCartItems([]);
      localStorage.removeItem('cart');
    }
  };

  const placeOrder = async (orderData) => {
    setLoading(true);
    try {
      const response = await api.post('/orders', {
        orderItems: cartItems.map(item => ({
          product: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          color: item.color,
          size: item.size
        })),
        ...orderData
      });
      clearCart();
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      getCartTotal,
      getCartCount,
      clearCart,
      placeOrder,
      loading
    }}>
      {children}
    </CartContext.Provider>
  );
};
