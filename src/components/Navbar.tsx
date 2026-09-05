'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search, ShoppingBag, MapPin, ChevronDown,
  Home, Grid, Store, Sun, Moon, Menu, X, User
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { cart, user, theme, toggleTheme } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    if (searchQuery.trim()) {
      router.push(`/restaurants?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/restaurants');
    }
  };

  const navLinks = [
    { label: 'Home',       path: '/',           icon: <Home size={18} /> },
    { label: 'Stores',     path: '/restaurants', icon: <Store size={18} /> },
    { label: 'Categories', path: '/categories',  icon: <Grid size={18} /> },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <header className="desktop-navbar">
      <div className="navbar-inner">

        {/* ── LEFT: Hamburger (mobile) + Logo + Location ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

          {/* Hamburger — only visible on mobile via CSS */}
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button
              className="hamburger-btn"
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Mobile Dropdown */}
            {menuOpen && (
              <div className="mobile-dropdown">
                {/* Search inside dropdown */}
                <form onSubmit={handleSearch} style={{ marginBottom: '8px' }}>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      placeholder="Search food, stores..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px 10px 38px',
                        borderRadius: '16px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-primary)',
                        color: 'var(--text-main)',
                        fontSize: '14px',
                        outline: 'none',
                        fontFamily: 'inherit'
                      }}
                    />
                    <Search
                      size={16}
                      style={{
                        position: 'absolute', left: '12px', top: '50%',
                        transform: 'translateY(-50%)', color: 'var(--text-muted)'
                      }}
                    />
                  </div>
                </form>

                {/* Divider */}
                <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '4px 0 8px' }} />

                {/* Nav Links */}
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 14px',
                      borderRadius: '14px',
                      textDecoration: 'none',
                      fontSize: '15px',
                      fontWeight: isActive(link.path) ? '800' : '600',
                      color: isActive(link.path) ? 'var(--primary-orange)' : 'var(--text-main)',
                      backgroundColor: isActive(link.path) ? 'var(--primary-orange-light)' : 'transparent',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <span style={{ color: isActive(link.path) ? 'var(--primary-orange)' : 'var(--text-muted)' }}>
                      {link.icon}
                    </span>
                    {link.label}
                  </Link>
                ))}

                {/* Divider */}
                <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '8px 0' }} />

                {/* Theme toggle inside dropdown */}
                <button
                  onClick={() => { toggleTheme(); setMenuOpen(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    width: '100%', padding: '12px 14px', borderRadius: '14px',
                    border: 'none', backgroundColor: 'transparent',
                    color: 'var(--text-main)', fontSize: '15px', fontWeight: '600',
                    cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left'
                  }}
                >
                  {theme === 'light'
                    ? <><Moon size={18} style={{ color: 'var(--text-muted)' }} /> Switch to Dark Mode</>
                    : <><Sun size={18} style={{ color: '#FFD700' }} /> Switch to Light Mode</>
                  }
                </button>
              </div>
            )}
          </div>

          {/* Logo */}
          <Link href="/" className="navbar-logo-link" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <Image
              src={theme === 'dark' ? '/droply-logo-dark.png' : '/droply-logo.png'}
              alt="Droply Logo"
              width={140}
              height={36}
              className="navbar-logo"
              style={{ objectFit: 'contain' }}
              priority
            />
          </Link>

          {/* Location pill — hide on small screens */}
          <div className="location-pill">
            <MapPin size={16} style={{ color: 'var(--primary-orange)' }} />
            <span>Katampe Extension, FCT</span>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
          </div>
        </div>

        {/* ── CENTER: Search bar (desktop only) ── */}
        <form onSubmit={handleSearch} className="navbar-search-form">
          <div className="search-bar-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search food, groceries or campus stores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="search-icon" size={18} />
          </div>
        </form>

        {/* ── RIGHT: Desktop nav links + icons ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>

          {/* Desktop nav links — hidden on mobile */}
          <nav className="desktop-nav-links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  textDecoration: 'none', fontSize: '14px',
                  fontWeight: isActive(link.path) ? '800' : '600',
                  color: isActive(link.path) ? 'var(--primary-orange)' : 'var(--text-main)',
                  transition: 'color 0.2s ease'
                }}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} style={{ color: '#FFD700' }} />}
          </button>

          {/* Cart icon */}
          <Link
            href="/cart"
            style={{
              position: 'relative', display: 'flex', alignItems: 'center',
              justifyContent: 'center', width: '42px', height: '42px',
              borderRadius: '50%', backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)', color: 'var(--text-main)',
              textDecoration: 'none'
            }}
          >
            <ShoppingBag size={20} />
            {totalCartItems > 0 && (
              <span className="badge-count">{totalCartItems}</span>
            )}
          </Link>

          {/* Profile pill — desktop only */}
          <Link
            href="/profile"
            className="profile-pill"
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              textDecoration: 'none', backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)', color: 'var(--text-main)',
              padding: '6px 14px 6px 8px', borderRadius: '24px'
            }}
          >
            <div style={{
              width: '30px', height: '30px', borderRadius: '50%',
              backgroundColor: 'var(--primary-orange)', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px'
            }}>👨‍🎓</div>
            <span style={{ fontSize: '13px', fontWeight: '700' }}>
              {user.name.split(' ')[0]}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};
