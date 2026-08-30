'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingBag, ArrowLeft, Plus, Flame, Crown } from 'lucide-react';
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

  const subFilters: ('Popular' | 'Premium')[] = ['Popular', 'Premium'];

  return (
    <>
      <div className="app-content animate-fade-in" style={{ backgroundColor: 'var(--bg-primary)', paddingBottom: '110px' }}>
        
        {/* Header */}
        <div className="header-light" style={{
          backgroundColor: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-color)',
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: '18px',
          marginBottom: '16px'
        }}>
          <button
            onClick={() => router.push(`/restaurant/${storeId}`)}
            className="btn-back"
            aria-label="Back to store"
          >
            <ArrowLeft size={18} />
          </button>
          
          <h2 style={{ fontSize: '17px', fontWeight: '800', flex: 1, textAlign: 'center', margin: '0 8px', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {categoryName}
          </h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
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

        {/* Sub-Filters Tabs — Popular & Premium */}
        <div style={{ display: 'flex', gap: '10px', padding: '0 4px 12px 4px' }}>
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
                  gap: '6px',
                  padding: '12px 14px',
                  borderRadius: '16px',
                  border: isSelected
                    ? isPopularTab ? '2px solid #E85A1D' : '2px solid #D4AF37'
                    : '1px solid var(--border-color)',
                  backgroundColor: isSelected
                    ? isPopularTab ? '#E85A1D' : '#1C1C1E'
                    : 'var(--bg-card)',
                  color: isSelected
                    ? isPopularTab ? 'white' : '#D4AF37'
                    : 'var(--text-muted)',
                  fontSize: '14px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.12)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {isPopularTab ? (
                  <Flame size={16} style={{ color: isSelected ? 'white' : '#E85A1D' }} />
                ) : (
                  <Crown size={16} style={{ color: '#D4AF37' }} />
                )}
                <span>{subFilter}</span>
              </button>
            );
          })}
        </div>

        {/* Subtitle banner explaining current tab view */}
        <div style={{ padding: '0 4px 14px 4px' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', lineHeight: '1.4' }}>
            {activeSubFilter === 'Popular'
              ? '🔥 Popular everyday student favorites & fast campus delivery'
              : '👑 Premium chef specialities, feast combos & deluxe portions'}
          </p>
        </div>

        {/* Products Grid — Responsive */}
        <div className="grid-responsive" style={{ paddingBottom: '30px' }}>
          {displayedItems.map((item) => {
            const isPremiumItem = activeSubFilter === 'Premium' || item.premium || item.price >= 5000;

            return (
              <div
                key={item.id}
                className="animate-fade-in"
                style={{
                  backgroundColor: isPremiumItem ? '#1C1C1E' : 'var(--bg-card)',
                  borderRadius: '20px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: isPremiumItem ? '0 6px 18px rgba(0,0,0,0.25)' : 'var(--shadow-sm)',
                  border: isPremiumItem ? '1.5px solid #D4AF37' : '1px solid var(--border-color)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.2s ease, boxShadow 0.2s ease'
                }}
                onClick={() => router.push(`/product/${item.id}`)}
              >
                {/* Badge Header: Popular vs Premium */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '4px' }}>
                  {isPremiumItem ? (
                    <span style={{
                      backgroundColor: '#D4AF37',
                      color: '#1C1C1E',
                      fontSize: '9.5px',
                      fontWeight: '900',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      letterSpacing: '0.03em',
                      textTransform: 'uppercase'
                    }}>
                      <Crown size={10} /> Premium
                    </span>
                  ) : (
                    <span style={{
                      backgroundColor: 'var(--primary-orange-light)',
                      color: 'var(--primary-orange)',
                      fontSize: '9.5px',
                      fontWeight: '800',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      letterSpacing: '0.03em',
                      textTransform: 'uppercase'
                    }}>
                      <Flame size={10} /> Popular
                    </span>
                  )}

                  {item.unit && (
                    <span style={{
                      fontSize: '10.5px',
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
                    height: '90px',
                    borderRadius: '14px',
                    backgroundColor: isPremiumItem ? 'rgba(255,255,255,0.06)' : 'var(--light-blue-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '44px',
                    marginBottom: '10px',
                    flexShrink: 0
                  }}
                >
                  {item.emoji || '🍛'}
                </div>

                {/* Title */}
                <h4 style={{ 
                  fontSize: '14px', 
                  fontWeight: '800', 
                  color: isPremiumItem ? '#FFFFFF' : 'var(--text-main)', 
                  marginBottom: '4px',
                  lineHeight: '1.25',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {item.name}
                </h4>

                {/* Order Description */}
                <p style={{
                  fontSize: '11.5px',
                  color: isPremiumItem ? '#C8B89A' : 'var(--text-muted)',
                  marginBottom: '10px',
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
                  borderRadius: '16px',
                  padding: '6px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '4px',
                  border: isPremiumItem ? '1px solid rgba(212,175,55,0.3)' : '1px solid var(--border-color)'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <span style={{ fontSize: '8.5px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: isPremiumItem ? '#D4AF37' : 'var(--text-muted)' }}>
                      PRICE
                    </span>
                    <span style={{
                      fontSize: '14.5px',
                      fontWeight: '900',
                      color: isPremiumItem ? '#E2C06E' : 'var(--primary-orange)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
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
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: isPremiumItem ? '#D4AF37' : 'var(--primary-orange)',
                      color: isPremiumItem ? '#1C1C1E' : 'white',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
                      flexShrink: 0
                    }}
                  >
                    <Plus size={16} />
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
