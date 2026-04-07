 'use client';
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { MenuItem, SizeOption } from '@/lib/menu';

export interface CartItem {
  id: string; menuId: string; name: string; emoji: string; cat: string;
  price: number; qty: number; size?: string; sizeLabel?: string;
}
interface CartState { items: CartItem[]; isOpen: boolean; }
type CartAction =
  | { type: 'ADD'; item: CartItem } | { type: 'REMOVE'; id: string }
  | { type: 'SET_QTY'; id: string; qty: number } | { type: 'CLEAR' }
  | { type: 'TOGGLE_DRAWER' } | { type: 'OPEN_DRAWER' } | { type: 'CLOSE_DRAWER' };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const idx = state.items.findIndex(i => i.id === action.item.id);
      if (idx >= 0) {
        const items = [...state.items];
        items[idx] = { ...items[idx], qty: items[idx].qty + 1 };
        return { ...state, items };
      }
      return { ...state, items: [...state.items, action.item] };
    }
    case 'REMOVE': return { ...state, items: state.items.filter(i => i.id !== action.id) };
    case 'SET_QTY':
      if (action.qty <= 0) return { ...state, items: state.items.filter(i => i.id !== action.id) };
      return { ...state, items: state.items.map(i => i.id === action.id ? { ...i, qty: action.qty } : i) };
    case 'CLEAR': return { ...state, items: [] };
    case 'TOGGLE_DRAWER': return { ...state, isOpen: !state.isOpen };
    case 'OPEN_DRAWER': return { ...state, isOpen: true };
    case 'CLOSE_DRAWER': return { ...state, isOpen: false };
    default: return state;
  }
}

interface CartContextType {
  items: CartItem[]; isOpen: boolean; totalItems: number; subtotal: number;
  addItem: (menuItem: MenuItem, size?: SizeOption) => void;
  removeItem: (id: string) => void; setQty: (id: string, qty: number) => void;
  clear: () => void; toggleDrawer: () => void; openDrawer: () => void; closeDrawer: () => void;
}
const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });
  const addItem = useCallback((menuItem: MenuItem, size?: SizeOption) => {
    const cartId = size ? `${menuItem.id}-${size.key}` : menuItem.id;
    dispatch({ type: 'ADD', item: { id: cartId, menuId: menuItem.id, name: menuItem.name, emoji: menuItem.emoji, cat: menuItem.cat, price: size ? size.price : menuItem.price, qty: 1, size: size?.key, sizeLabel: size ? `${size.label} ${size.oz}` : undefined } });
    dispatch({ type: 'OPEN_DRAWER' });
  }, []);
  const removeItem = useCallback((id: string) => dispatch({ type: 'REMOVE', id }), []);
  const setQty = useCallback((id: string, qty: number) => dispatch({ type: 'SET_QTY', id, qty }), []);
  const clear = useCallback(() => dispatch({ type: 'CLEAR' }), []);
  const toggleDrawer = useCallback(() => dispatch({ type: 'TOGGLE_DRAWER' }), []);
  const openDrawer = useCallback(() => dispatch({ type: 'OPEN_DRAWER' }), []);
  const closeDrawer = useCallback(() => dispatch({ type: 'CLOSE_DRAWER' }), []);
  const totalItems = state.items.reduce((s, i) => s + i.qty, 0);
  const subtotal = state.items.reduce((s, i) => s + i.price * i.qty, 0);
  return (
    <CartContext.Provider value={{ items: state.items, isOpen: state.isOpen, totalItems, subtotal, addItem, removeItem, setQty, clear, toggleDrawer, openDrawer, closeDrawer }}>
      {children}
    </CartContext.Provider>
  );
}
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}