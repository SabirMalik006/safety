import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('wishlist');
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading wishlist:', e);
      }
    }
  }, []);

  // Save to localStorage when wishlist changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const productId = product._id || product.id;
      const exists = prev.some(p => (p._id || p.id) === productId);
      
      if (exists) {
        return prev.filter(p => (p._id || p.id) !== productId);
      } else {
        // Ensure product has id field for compatibility
        return [...prev, { ...product, id: product._id || product.id }];
      }
    });
  };

  const isWishlisted = (id) => {
    return wishlist.some(p => (p._id || p.id) === id);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);