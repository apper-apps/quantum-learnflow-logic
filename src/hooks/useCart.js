import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

// Cart storage key
const CART_STORAGE_KEY = 'learnflow_cart';

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Error loading cart from storage:', error);
    return [];
  }
};

// Save cart to localStorage
const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to storage:', error);
  }
};

export const useCart = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart on mount
  useEffect(() => {
    const loadCart = () => {
      setLoading(true);
      try {
        const savedCart = loadCartFromStorage();
        setItems(savedCart);
      } catch (error) {
        console.error('Error loading cart:', error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  // Save cart whenever items change
  useEffect(() => {
    if (!loading) {
      saveCartToStorage(items);
    }
  }, [items, loading]);

  // Add item to cart
  const addToCart = (course) => {
    if (!course || !course.Id) {
      toast.error('Invalid course data');
      return;
    }

    setItems(prevItems => {
      // Check if item already exists
      const existingItemIndex = prevItems.findIndex(item => item.Id === course.Id);
      
      if (existingItemIndex >= 0) {
        // Item exists, increase quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        toast.info('Course quantity updated in cart');
        return updatedItems;
      } else {
        // Add new item
        const newItem = {
          ...course,
          quantity: 1,
          addedAt: new Date().toISOString()
        };
        toast.success('Course added to cart');
        return [...prevItems, newItem];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (courseId) => {
    if (!courseId) {
      toast.error('Invalid course ID');
      return;
    }

    setItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.Id !== courseId);
      toast.success('Course removed from cart');
      return updatedItems;
    });
  };

  // Update item quantity
  const updateQuantity = (courseId, quantity) => {
    if (!courseId || quantity < 0) {
      toast.error('Invalid quantity');
      return;
    }

    if (quantity === 0) {
      removeFromCart(courseId);
      return;
    }

    setItems(prevItems => {
      const updatedItems = prevItems.map(item => 
        item.Id === courseId 
          ? { ...item, quantity } 
          : item
      );
      toast.info('Cart updated');
      return updatedItems;
    });
  };

  // Clear entire cart
  const clearCart = () => {
    setItems([]);
    toast.success('Cart cleared');
  };

  // Check if item is in cart
  const isInCart = (courseId) => {
    return items.some(item => item.Id === courseId);
  };

  // Get item quantity
  const getItemQuantity = (courseId) => {
    const item = items.find(item => item.Id === courseId);
    return item ? item.quantity : 0;
  };

  // Calculate totals
  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getSubtotal = () => {
    return getTotalPrice();
  };

  const getTax = (taxRate = 0.08) => {
    return getSubtotal() * taxRate;
  };

  const getGrandTotal = (taxRate = 0.08) => {
    return getSubtotal() + getTax(taxRate);
  };

  // Get cart summary
  const getCartSummary = () => {
    const subtotal = getSubtotal();
    const tax = getTax();
    const total = getGrandTotal();
    
    return {
      itemCount: getTotalItems(),
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      items: items.length
    };
  };

  // Validate cart items (check if courses still exist)
  const validateCart = async () => {
    // In a real app, this would check with the API
    // For now, we'll just remove any items with invalid data
    setItems(prevItems => {
      const validItems = prevItems.filter(item => 
        item.Id && 
        item.title && 
        item.price && 
        typeof item.price === 'number' &&
        item.price > 0
      );
      
      if (validItems.length !== prevItems.length) {
        toast.warning('Some invalid items were removed from cart');
      }
      
      return validItems;
    });
  };

  // Checkout preparation
  const prepareCheckout = () => {
    if (items.length === 0) {
      toast.error('Cart is empty');
      return null;
    }

    const summary = getCartSummary();
    const checkout = {
      items: items.map(item => ({
        courseId: item.Id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        instructor: item.instructor?.name || 'Unknown',
        category: item.category || 'Uncategorized'
      })),
      summary,
      timestamp: new Date().toISOString()
    };

    return checkout;
  };

  // Apply discount code (mock implementation)
  const applyDiscount = (code) => {
    const discountCodes = {
      'SAVE10': { type: 'percentage', value: 10, description: '10% off' },
      'WELCOME': { type: 'fixed', value: 25, description: '$25 off' },
      'STUDENT': { type: 'percentage', value: 15, description: '15% student discount' }
    };

    const discount = discountCodes[code.toUpperCase()];
    
    if (!discount) {
      toast.error('Invalid discount code');
      return null;
    }

    toast.success(`Discount applied: ${discount.description}`);
    return discount;
  };

  return {
    // State
    items,
    loading,
    
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    
    // Queries
    isInCart,
    getItemQuantity,
    getTotalItems,
    getTotalPrice,
    getSubtotal,
    getTax,
    getGrandTotal,
    getCartSummary,
    
    // Utils
    validateCart,
    prepareCheckout,
    applyDiscount
  };
};

export default useCart;