'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingBag, ArrowLeft, Search, Plus, Sparkles, Flame, Crown } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { BottomNav } from '@/components/BottomNav';
import { RESTAURANTS, MenuItem } from '@/data/mockData';

export default function CategoryProductsPage() {
  const router = useRouter();
  const params = useParams();
  
  const storeId = params.id as string;
  const rawCategoryName = params.categoryName as string;
  const categoryName = decodeURIComponent(rawCategoryName);
  
  const { cart, addToCart } = useCart();
  const [activeSubFilter, setActiveSubFilter] = useState<'Popular' | 'Premium'>('Popular');

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  const restaurant = RESTAURANTS.find((r) => r.id === storeId);

  if (!restaurant) {
    return (
      <div className="app-content" style={{ padding: '20px', textAlign: 'center' }}>
        <p>Store not found.</p>
        <Link href="/restaurants" style={{ color: 'var(--primary-orange)', fontWeight: '700' }}>
          Back to stores
        </Link>
      </div>
    );
  }

  // Get all items in this category
  const allCategoryItems = restaurant.menu.filter(
    (item) => item.category.toLowerCase() === categoryName.toLowerCase()
  );

  // Filter items based on Popular vs Premium
  const popularItems = allCategoryItems.filter(item => item.popular || !item.premium || item.price < 5000);
  const premiumItems = allCategoryItems.filter(item => item.premium || item.price >= 4500);

  // Determine displayed items
  let displayedItems: MenuItem[] = [];
  if (activeSubFilter === 'Popular') {
    displayedItems = popularItems.length > 0 ? popularItems : allCategoryItems;
  } else {
    displayedItems = premiumItems.length > 0 ? premiumItems : allCategoryItems;
  }

  // Only Popular & Premium sub-filters
  const subFilters: ('Popular' | 'Premium')[] = ['Popular', 'Premium'];

  return (
    <>
      <div className="app-content animate-fade-in" style={{ backgroundColor: 'var(--bg-primary)', paddingBottom: '60px' }}>
        
        {/* Header */}
        <div className="header-light" style={{
          backgroundColor: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-color)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <button
            onClick={() => router.push(`/restaurant/${storeId}`)}
            className="btn-back"
            aria-label="Back to store"
          >
            <ArrowLeft size={18} />
          </button>
          
          <h2 style={{ fontSize: '18px', fontWeight: '800', flex: 1, textAlign: 'center', margin: '0 10px', color: 'var(--text-main)' }}>
            {categoryName}
          </h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', color: 'var(--text-main)' }}>
              <ShoppingBag size={22} />
              {totalCartItems > 0 && (
                <span className="badge-count" style={{ top: '-6px', right: '-8px' }}>
                  {totalCartItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Sub-Filters Tabs — ONLY Popular & Premium */}
        <div style={{ display: 'flex', gap: '12px', padding: '20px 20px 10px 20px' }}>
          {subFilters.map((subFilter) => {
            const isSelected = activeSubFilter === subFilter;
            const isPopularTab = subFilter === 'Popular';

            return (
              <button
                key={subFilter}
                onClick={() => setActiveSubFilter(subFilter)}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '14px 20px',
                  borderRadius: '20px',
                  border: isSelected
                    ? isPopularTab ? '2px solid #E85A1D' : '2px solid #D4AF37'
                    : '1px solid var(--border-color)',
                  backgroundColor: isSelected
                    ? isPopularTab ? '#E85A1D' : '#1C1C1E'
                    : 'var(--bg-card)',
                  color: isSelected
                    ? isPopularTab ? 'white' : '#D4AF37'
                    : 'var(--text-muted)',
                  fontSize: '15px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 4px 14px rgba(0,0,0,0.15)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {isPopularTab ? (
                  <Flame size={18} style={{ color: isSelected ? 'white' : '#E85A1D' }} />
                ) : (
                  <Crown size={18} style={{ color: '#D4AF37' }} />
                )}
                <span>{subFilter}</span>
              </button>
            );
          })}
        </div>

        {/* Subtitle banner explaining current tab view */}
        <div style={{ padding: '0 20px 16px 20px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
            {activeSubFilter === 'Popular'
              ? '🔥 Popular everyday student favorites & fast campus delivery'
              : '👑 Premium chef specialities, feast combos & deluxe portions'}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid-responsive" style={{ padding: '0 20px 40px 20px' }}>
          {displayedItems.map((item) => {
            const isPremiumItem = activeSubFilter === 'Premium' || item.premium || item.price >= 5000;

            return (
              <div
                key={item.id}
                className="animate-fade-in"
                style={{
                  backgroundColor: isPremiumItem ? '#1C1C1E' : 'var(--bg-card)',
                  borderRadius: '24px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: isPremiumItem ? '0 6px 20px rgba(0,0,0,0.25)' : 'var(--shadow-sm)',
                  border: isPremiumItem ? '1.5px solid #D4AF37' : '1px solid var(--border-color)',
                  minHeight: '260px',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.2s ease, boxShadow 0.2s ease'
                }}
                onClick={() => router.push(`/product/${item.id}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = isPremiumItem ? '0 10px 28px rgba(212,175,55,0.25)' : 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = isPremiumItem ? '0 6px 20px rgba(0,0,0,0.25)' : 'var(--shadow-sm)';
                }}
              >
                {/* Badge Header: Popular vs Premium */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  {isPremiumItem ? (
                    <span style={{
                      backgroundColor: 'linear-gradient(135deg, #D4AF37, #AA7C11)',
                      background: '#D4AF37',
                      color: '#1C1C1E',
                      fontSize: '10px',
                      fontWeight: '900',
                      padding: '3px 10px',
                      borderRadius: '12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase'
                    }}>
                      <Crown size={11} /> Premium Deluxe
                    </span>
                  ) : (
                    <span style={{
                      backgroundColor: 'var(--primary-orange-light)',
                      color: 'var(--primary-orange)',
                      fontSize: '10px',
                      fontWeight: '800',
                      padding: '3px 10px',
                      borderRadius: '12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase'
                    }}>
                      <Flame size={11} /> Popular Choice
                    </span>
                  )}

                  {item.unit && (
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      color: isPremiumItem ? '#C8B89A' : 'var(--text-muted)'
                    }}>
                      {item.unit}
                    </span>
                  )}
                </div>

                {/* Image Box */}
                <div
                  style={{
                    height: '110px',
                    borderRadius: '16px',
                    backgroundColor: isPremiumItem ? 'rgba(255,255,255,0.06)' : 'var(--light-blue-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '52px',
                    marginBottom: '12px',
                    flexShrink: 0
                  }}
                >
                  {item.emoji || '🍛'}
                </div>

                {/* Title */}
                <h4 style={{ 
                  fontSize: '15px', 
                  fontWeight: '800', 
                  color: isPremiumItem ? '#FFFFFF' : 'var(--text-main)', 
                  marginBottom: '4px',
                  lineHeight: '1.3',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {item.name}
                </h4>

                {/* Order Description / Portion tag */}
                <p style={{
                  fontSize: '12px',
                  color: isPremiumItem ? '#C8B89A' : 'var(--text-muted)',
                  marginBottom: '12px',
                  lineHeight: '1.3',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {item.description}
                </p>

                {/* Pricing & Add Button Row */}
                <div style={{
                  marginTop: 'auto',
                  backgroundColor: isPremiumItem ? 'rgba(255,255,255,0.05)' : 'var(--bg-primary)',
                  borderRadius: '20px',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: isPremiumItem ? '1px solid rgba(212,175,55,0.3)' : '1px solid var(--border-color)'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: isPremiumItem ? '#D4AF37' : 'var(--text-muted)' }}>
                      {isPremiumItem ? 'PREMIUM PRICE' : 'PRICE'}
                    </span>
                    <span style={{
                      fontSize: '16px',
                      fontWeight: '900',
                      color: isPremiumItem ? '#E2C06E' : 'var(--primary-orange)'
                    }}>
                      ₦{item.price.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(item, storeId);
                    }}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: isPremiumItem ? '#D4AF37' : 'var(--primary-orange)',
                      color: isPremiumItem ? '#1C1C1E' : 'white',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      flexShrink: 0,
                      transition: 'transform 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <BottomNav />
    </>
  );
}
