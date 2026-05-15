import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (rawProduct, qty = 1) => {
    setCartItems((prevItems) => {
      // Calculate price with discount if applicable
      const hasDiscount = rawProduct.discount > 0;
      const finalPrice = hasDiscount 
        ? Number((rawProduct.price * (1 - rawProduct.discount / 100)).toFixed(2))
        : Number(rawProduct.price);
      
      const product = { ...rawProduct, price: finalPrice };
      
      const existItem = prevItems.find((x) => x._id === product._id);
      if (existItem) {
        // Calculate new quantity
        const newQty = existItem.qty + qty;
        
        // Check if new quantity exceeds stock
        if (newQty > product.countInStock) {
          alert(`Only ${product.countInStock} items available in stock.`);
          return prevItems; // Don't update if stock exceeded
        }

        return prevItems.map((x) =>
          x._id === existItem._id ? { ...existItem, qty: newQty } : x
        );
      } else {
        // For new items, check if qty exceeds stock (though usually qty is 1)
        if (qty > product.countInStock) {
          alert(`Only ${product.countInStock} items available in stock.`);
          return prevItems;
        }
        return [...prevItems, { ...product, qty }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((x) => x._id !== id));
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};
