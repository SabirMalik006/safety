import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart(prev => {
      const key = `${product.id}-${product.selectedColor}`;
      const existing = prev.find(i => `${i.id}-${i.selectedColor}` === key);
      if (existing) {
        return prev.map(i =>
          `${i.id}-${i.selectedColor}` === key
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id, color) => {
    setCart(prev => prev.filter(i => !(i.id === id && i.selectedColor === color)));
  };

  const updateQuantity = (id, color, quantity) => {
    if (quantity < 1) {
      removeFromCart(id, color);
      return;
    }
    setCart(prev =>
      prev.map(i =>
        i.id === id && i.selectedColor === color ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
