"use client";
import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Agregar al carrito
  const addToCart = (product) => {
    setCart([...cart, product]);
    setIsCartOpen(true); // Abrir drawer automáticamente
  };

  // Quitar del carrito
  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  // Calcular total
  const cartTotal = cart.reduce((sum, item) => sum + Number(item.price), 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      isCartOpen, 
      setIsCartOpen, 
      addToCart, 
      removeFromCart, 
      cartTotal 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);