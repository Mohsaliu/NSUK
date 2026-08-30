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
      <div className="app-content animate-fade-in" style={{ backgroundColor: 'var(--bg-primary)', paddingBottom: '110px' }}>
        {/* Grey Header Banner */}
        <div
          className="header-orange"
          style={{ backgroundColor: '#5A6065', padding: '24px 20px', marginBottom: '20px', borderRadius: '24px' }}
        >
          <h2 style={{ fontSize: '16px', fontWeight: '600', opacity: 0.9 }}>Hey, {user.name.split(' ')[0]}</h2>
          <h1 style={{ fontSize: '28px', fontWeight: '900', marginTop: '2px', letterSpacing: '-0.02em' }}>
            Shop By Category
          </h1>
          <p style={{ fontSize: '12.5px', opacity: 0.85, marginTop: '4px' }}>
            {CATEGORIES.length} categories of Nigerian campus food & grocery
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid-2" style={{ gap: '14px', paddingBottom: '30px' }}>
          {CATEGORIES.map(cat => (
            <div
              key={cat.id}
              onClick={() => router.push(`/restaurant/mama-cass-bukka/category/${encodeURIComponent(cat.name)}`)}
              style={{
                height: '120px',
                borderRadius: '20px',
                backgroundColor: cat.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 20px',
                cursor: 'pointer',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid rgba(0,0,0,0.04)',
                transition: 'transform 0.2s ease'
              }}
            >
              <div>
                <h2 style={{
                  fontSize: '22px',
                  fontWeight: '900',
                  color: cat.textColor,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15
                }}>
                  {cat.name}
                </h2>
                <p style={{ fontSize: '12px', color: cat.textColor, opacity: 0.75, marginTop: '4px', fontWeight: '700' }}>
                  Tap to browse →
                </p>
              </div>

              <div style={{ fontSize: '52px', transform: 'rotate(-5deg)', userSelect: 'none', flexShrink: 0 }}>
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
