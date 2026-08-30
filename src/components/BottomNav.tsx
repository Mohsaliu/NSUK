'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, ShoppingBag, User, Sun, Moon } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface BottomNavProps {
  dark?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = () => {
  const pathname = usePathname();
  const { cart, theme, toggleTheme } = useCart();
  
  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="bottom-nav">
      <Link href="/" className={`nav-item ${isActive('/') ? 'active' : ''}`} aria-label="Home">
        <Home size={22} />
      </Link>
      
      <Link href="/categories" className={`nav-item ${isActive('/categories') ? 'active' : ''}`} aria-label="Categories">
        <Grid size={22} />
      </Link>
      
      {/* Center Cart Button */}
      <Link 
        href="/cart" 
        className="nav-item nav-item-cart-center" 
        aria-label="Cart"
      >
        <ShoppingBag size={24} style={{ color: 'white' }} />
        {totalCartItems > 0 && (
          <span className="badge-count" style={{
            backgroundColor: 'var(--white)',
            color: 'var(--primary-orange)'
          }}>
            {totalCartItems}
          </span>
        )}
      </Link>

      <button
        onClick={toggleTheme}
        className="nav-item"
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        aria-label="Toggle Theme"
      >
        {theme === 'light' ? <Moon size={22} /> : <Sun size={22} style={{ color: '#FFD700' }} />}
      </button>
      
      <Link href="/profile" className={`nav-item ${isActive('/profile') ? 'active' : ''}`} aria-label="Profile">
        <User size={22} />
      </Link>
    </div>
  );
};
