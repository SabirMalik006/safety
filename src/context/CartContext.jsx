import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { isAuthenticated } from '../services/authService';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1, selectedColor = null, selectedSize = null) => {
    setCartItems(prevItems => {
      const existingIndex = prevItems.findIndex(
        item => item.productId === product._id && 
                item.color === selectedColor && 
                item.size === selectedSize
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [...prevItems, {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.url || '/images/placeholder.jpg',
        quantity,
        color: selectedColor,
        size: selectedSize,
        stock: product.stock
      }];
    });
  };

  const removeFromCart = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(index);
      return;
    }
    setCartItems(prev => prev.map((item, i) => 
      i === index ? { ...item, quantity: newQuantity } : item
    ));
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const clearCart = () => {
    setCartItems([]);
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