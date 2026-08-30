'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { BottomNav } from '../../components/BottomNav';
import { CATEGORIES } from '../../data/mockData';

export default function CategoriesPage() {
  const router = useRouter();
  const { user } = useCart();

  return (
    <>
      <div className="app-content animate-fade-in" style={{ backgroundColor: 'var(--bg-primary)' }}>
        {/* Grey Header Banner */}
        <div
          className="header-orange"
          style={{ backgroundColor: '#6E7378', padding: '32px 32px 28px', marginBottom: '24px', borderRadius: '28px' }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: '600', opacity: 0.9 }}>Hey, {user.name.split(' ')[0]}</h2>
          <h1 style={{ fontSize: '34px', fontWeight: '900', marginTop: '4px', letterSpacing: '-0.02em' }}>
            Shop By Category
          </h1>
          <p style={{ fontSize: '13px', opacity: 0.8, marginTop: '6px' }}>
            {CATEGORIES.length} categories of Nigerian campus food & grocery
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid-2" style={{ gap: '20px', paddingBottom: '40px' }}>
          {CATEGORIES.map(cat => (
            <div
              key={cat.id}
              onClick={() => router.push(`/restaurant/mama-cass-bukka/category/${encodeURIComponent(cat.name)}`)}
              style={{
                height: '150px',
                borderRadius: '24px',
                backgroundColor: cat.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 32px',
                cursor: 'pointer',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid rgba(0,0,0,0.04)',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-3px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
            >
              <div>
                <h2 style={{
                  fontSize: '26px',
                  fontWeight: '900',
                  color: cat.textColor,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1
                }}>
                  {cat.name}
                </h2>
                <p style={{ fontSize: '12px', color: cat.textColor, opacity: 0.7, marginTop: '4px', fontWeight: '600' }}>
                  Tap to browse
                </p>
              </div>

              <div style={{ fontSize: '64px', transform: 'rotate(-5deg)', userSelect: 'none' }}>
                {cat.image}
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav dark />
    </>
  );
}
