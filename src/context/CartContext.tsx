'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, Restaurant, DeliveryAddress, DELIVERY_ADDRESSES, MOCK_USER, RESTAURANTS } from '../data/mockData';

export interface CartItem {
  product: MenuItem;
  quantity: number;
  restaurantId: string;
}

export interface ActiveOrder {
  id: string;
  date: string;
  status: 'received' | 'preparing' | 'courier_at_store' | 'delivering' | 'arrived';
  eta: string;
  deliveryMan: {
    name: string;
    avatar: string;
    rating: string;
  };
  deliveryAddress: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  restaurantName: string;
}

interface CartContextType {
  cart: CartItem[];
  currentRestaurant: Restaurant | null;
  addToCart: (item: MenuItem, restaurantId: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, change: number) => void;
  clearCart: () => void;
  addresses: DeliveryAddress[];
  selectAddress: (id: string) => void;
  activeAddress: DeliveryAddress | undefined;
  activeOrder: ActiveOrder | null;
  createOrder: (cardDetails?: any) => void;
  advanceOrderStatus: () => void;
  user: typeof MOCK_USER;
  promoDiscount: number;
  applyPromo: (code: string) => boolean;
  promoCodeApplied: string;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  orderHistory: ActiveOrder[];
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const INITIAL_ORDER_HISTORY: ActiveOrder[] = [
  {
    id: '#765433',
    date: 'Aug 24, 2026',
    status: 'arrived',
    eta: 'Delivered',
    deliveryMan: {
      name: "Rakibul Hassan",
      avatar: "/figma_images/Droply/Profile.jpg",
      rating: "4.9",
    },
    deliveryAddress: '36 green way, Katampe Extension',
    items: [
      {
        product: RESTAURANTS[0].menu[0],
        quantity: 2,
        restaurantId: 'burger-king'
      },
      {
        product: RESTAURANTS[0].menu[1],
        quantity: 1,
        restaurantId: 'burger-king'
      }
    ],
    subtotal: 394.40,
    deliveryFee: 200.00,
    total: 594.40,
    restaurantName: 'Burger King'
  }
];

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentRestaurantId, setCurrentRestaurantId] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<DeliveryAddress[]>(DELIVERY_ADDRESSES);
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(null);
  const [promoCodeApplied, setPromoCodeApplied] = useState<string>('');
  const [promoDiscount, setPromoDiscount] = useState<number>(0);
  const [favorites, setFavorites] = useState<string[]>(['mc-lemon', 'prod-orange']);
  const [orderHistory, setOrderHistory] = useState<ActiveOrder[]>(INITIAL_ORDER_HISTORY);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Load saved theme on initial client mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('droply_theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('droply_theme', nextTheme);
  };

  useEffect(() => {
    if (!activeOrder || activeOrder.status === 'arrived') return;

    const interval = setInterval(() => {
      advanceOrderStatus();
    }, 15000);

    return () => clearInterval(interval);
  }, [activeOrder]);

  const addToCart = (product: MenuItem, restaurantId: string) => {
    setCart((prevCart) => {
      if (currentRestaurantId && currentRestaurantId !== restaurantId) {
        setCurrentRestaurantId(restaurantId);
        return [{ product, quantity: 1, restaurantId }];
      }

      if (!currentRestaurantId) {
        setCurrentRestaurantId(restaurantId);
      }

      const existingIndex = prevCart.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += 1;
        return newCart;
      } else {
        return [...prevCart, { product, quantity: 1, restaurantId }];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.product.id !== itemId);
      if (newCart.length === 0) {
        setCurrentRestaurantId(null);
      }
      return newCart;
    });
  };

  const updateQuantity = (itemId: string, change: number) => {
    setCart((prevCart) => {
      const newCart = prevCart
        .map((item) => {
          if (item.product.id === itemId) {
            const nextQty = item.quantity + change;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);

      if (newCart.length === 0) {
        setCurrentRestaurantId(null);
      }
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    setCurrentRestaurantId(null);
    setPromoCodeApplied('');
    setPromoDiscount(0);
  };

  const selectAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({ ...addr, selected: addr.id === id }))
    );
  };

  const activeAddress = addresses.find((addr) => addr.selected);

  const applyPromo = (code: string): boolean => {
    const cleanCode = code.toUpperCase();
    if (cleanCode === 'NSUKFRESH' || cleanCode === 'DROPLY50') {
      setPromoCodeApplied(cleanCode);
      setPromoDiscount(150.00);
      return true;
    }
    return false;
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isFavorite = (id: string) => favorites.includes(id);

  const currentRestaurant = currentRestaurantId
    ? RESTAURANTS.find((r: Restaurant) => r.id === currentRestaurantId) || null
    : null;

  const createOrder = (cardDetails?: any) => {
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const deliveryFee = currentRestaurant?.deliveryFee || 150;
    const total = Math.max(0, subtotal + deliveryFee - promoDiscount);

    const newOrder: ActiveOrder = {
      id: `#${Math.floor(100000 + Math.random() * 900000)}`,
      date: 'Today',
      status: 'received',
      eta: '25 Min',
      deliveryMan: {
        name: "Rakibul Hassan",
        avatar: "/figma_images/Droply/Profile.jpg",
        rating: "4.9",
      },
      deliveryAddress: activeAddress?.address || "36 green way, Katampe Extension",
      items: [...cart],
      subtotal,
      deliveryFee,
      total,
      restaurantName: currentRestaurant?.name || 'Droply Store'
    };

    setActiveOrder(newOrder);
    setOrderHistory((prev) => [newOrder, ...prev]);
    clearCart();
  };

  const advanceOrderStatus = () => {
    setActiveOrder((prev) => {
      if (!prev) return null;
      const statusCycle: ActiveOrder['status'][] = [
        'received',
        'preparing',
        'courier_at_store',
        'delivering',
        'arrived',
      ];
      const currentIndex = statusCycle.indexOf(prev.status);
      const nextIndex = Math.min(currentIndex + 1, statusCycle.length - 1);
      const nextStatus = statusCycle[nextIndex];
      
      let nextEta = prev.eta;
      if (nextStatus === 'preparing') nextEta = '20 Min';
      if (nextStatus === 'courier_at_store') nextEta = '15 Min';
      if (nextStatus === 'delivering') nextEta = '10 Min';
      if (nextStatus === 'arrived') nextEta = 'Arrived';

      const updated = {
        ...prev,
        status: nextStatus,
        eta: nextEta,
      };

      setOrderHistory((history) =>
        history.map((ord) => (ord.id === prev.id ? updated : ord))
      );

      return updated;
    });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        currentRestaurant,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        addresses,
        selectAddress,
        activeAddress,
        activeOrder,
        createOrder,
        advanceOrderStatus,
        user: MOCK_USER,
        promoDiscount,
        applyPromo,
        promoCodeApplied,
        favorites,
        toggleFavorite,
        isFavorite,
        orderHistory,
        theme,
        toggleTheme
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
