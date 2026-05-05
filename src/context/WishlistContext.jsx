import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getWishlist as apiGetWishlist, toggleWishlist as apiToggleWishlist } from '../services/wishlistService';
import { isAuthenticated } from '../services/authService';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = useCallback(async () => {
    if (isAuthenticated()) {
      try {
        const backendWishlist = await apiGetWishlist();
        const formatted = backendWishlist.map(p => ({ ...p, id: p._id || p.id }));
        setWishlist(formatted);
      } catch (e) {
        console.error('Error fetching wishlist:', e);
      }
    } else {
      const saved = localStorage.getItem('wishlist');
      if (saved) {
        try {
          setWishlist(JSON.parse(saved));
        } catch (e) {
          console.error('Error parsing wishlist:', e);
          setWishlist([]);
        }
      }
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
    
    const handleAuthChange = () => {
      if (!isAuthenticated()) {
        setWishlist([]);
        localStorage.removeItem('wishlist');
      } else {
        fetchWishlist();
      }
    };
    
    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, [fetchWishlist]);

  // Save to localStorage when wishlist changes (only if unauthenticated)
  useEffect(() => {
    if (!isAuthenticated()) {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist]);

  const toggleWishlist = async (product) => {
    const productId = product._id || product.id;
    
    if (isAuthenticated()) {
      try {
        const backendWishlist = await apiToggleWishlist(productId);
        const formatted = backendWishlist.map(p => ({ ...p, id: p._id || p.id }));
        setWishlist(formatted);
      } catch (e) {
        console.error('Error toggling wishlist on backend:', e);
      }
    } else {
      setWishlist(prev => {
        const exists = prev.some(p => (p._id || p.id) === productId);
        if (exists) {
          return prev.filter(p => (p._id || p.id) !== productId);
        } else {
          return [...prev, { ...product, id: productId }];
        }
      });
    }
  };

  const isWishlisted = (id) => {
    return wishlist.some(p => (p._id || p.id) === id);
  };

  return (
    <WishlistContext.Provider value={{ 
      wishlist, 
      toggleWishlist, 
      isWishlisted,
      addToWishlist: toggleWishlist,
      isInWishlist: isWishlisted 
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);