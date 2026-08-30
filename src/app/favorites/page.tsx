'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Heart, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { BottomNav } from '../../components/BottomNav';
import { RESTAURANTS, MenuItem } from '../../data/mockData';

export default function FavoritesPage() {
  const router = useRouter();
  const { favorites, toggleFavorite, addToCart } = useCart();

  const favoriteItems: { item: MenuItem; restaurantId: string; restaurantName: string }[] = [];

  RESTAURANTS.forEach(restaurant => {
    restaurant.menu.forEach(menuItem => {
      if (favorites.includes(menuItem.id)) {
        favoriteItems.push({
          item: menuItem,
          restaurantId: restaurant.id,
          restaurantName: restaurant.name
        });
      }
    });
  });

  return (
    <>
      <div className="app-content animate-fade-in" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)', minHeight: '100vh', paddingBottom: '100px' }}>
        {/* Header */}
        <div className="header-light" style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', padding: '16px 20px' }}>
          <button
            onClick={() => router.push('/')}
            className="btn-back"
            aria-label="Back to home"
          >
            <ArrowLeft size={18} />
          </button>
          
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>
            Favorites ({favoriteItems.length})
          </h2>
          
          <div style={{ width: '40px' }} />
        </div>

        {favoriteItems.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Heart size={64} style={{ color: 'var(--primary-orange)', fill: 'var(--primary-orange-light)', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
              No favorites yet
            </h3>
            <p style={{ fontSize: '14px', marginBottom: '24px' }}>
              Tap the heart icon on your favorite meals and stores to see them here.
            </p>
            <button
              onClick={() => router.push('/restaurants')}
              className="btn-primary"
              style={{ maxWidth: '200px', margin: '0 auto', borderRadius: '16px' }}
            >
              Browse Stores
            </button>
          </div>
        ) : (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {favoriteItems.map(({ item, restaurantId, restaurantName }) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '24px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer'
                }}
                onClick={() => router.push(`/product/${item.id}`)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    backgroundColor: 'var(--bg-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    flexShrink: 0
                  }}>
                    {item.emoji || '🍛'}
                  </div>

                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '2px' }}>
                      {item.name}
                    </h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: '500' }}>
                      {restaurantName}
                    </p>
                    <span style={{ fontSize: '14px', fontWeight: '900', color: 'var(--primary-orange)' }}>
                      ₦{item.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#FF3B30',
                      cursor: 'pointer',
                      padding: '6px'
                    }}
                  >
                    <Trash2 size={18} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(item, restaurantId);
                    }}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-orange)',
                      color: 'white',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(232,90,29,0.3)'
                    }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </>
  );
}
