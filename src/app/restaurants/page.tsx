'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { BottomNav } from '../../components/BottomNav';
import { useCart } from '../../context/CartContext';
import { RESTAURANTS } from '../../data/mockData';
import { Star, Clock, Bike } from 'lucide-react';

function RestaurantsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useCart();
  const [activeFilter, setActiveFilter] = useState('All');
  const searchQuery = searchParams.get('search') || '';

  // Filter tabs: All, Main Dish, Fast Foods, Drinks (removed Nigerian, Grocery, Cafe)
  const filters = ['All', 'Main Dish', 'Fast Foods', 'Drinks'];

  const filteredRestaurants = RESTAURANTS.filter(r => {
    // Search query matching
    const matchesSearch = searchQuery
      ? r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.address.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    if (!matchesSearch) return false;

    // Filter tab matching
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Main Dish') {
      return r.type.toLowerCase().includes('main') || r.id === 'mama-cass-bukka' || r.id === 'keffi-suya-spot' || r.id === '4u-supermarket';
    }
    if (activeFilter === 'Fast Foods') {
      return r.type.toLowerCase().includes('fast') || r.id === 'mars-cafe' || r.id === 'chicken-republic';
    }
    if (activeFilter === 'Drinks') {
      return r.type.toLowerCase().includes('drink') || r.id === 'chillz-lounge';
    }

    return true;
  });

  const storeLogos: Record<string, React.ReactNode> = {
    'mama-cass-bukka': <span style={{ fontSize: '42px' }}>🍛</span>,
    '4u-supermarket': (
      <div style={{
        width: '70px', height: '50px', borderRadius: '50%',
        border: '3px solid #E85A1D',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#E85A1D', fontWeight: '900', fontSize: '22px',
        fontFamily: 'Georgia, serif', fontStyle: 'italic'
      }}>4U</div>
    ),
    'mars-cafe': (
      <div style={{ textAlign: 'center', fontFamily: 'serif', fontWeight: '900', fontSize: '18px', lineHeight: 1.1, color: '#000' }}>
        mar&apos;s<br />cafe
      </div>
    ),
    'chicken-republic': <span style={{ fontSize: '42px' }}>🍗</span>,
    'keffi-suya-spot':  <span style={{ fontSize: '42px' }}>🥩</span>,
    'chillz-lounge':   <span style={{ fontSize: '42px' }}>🍹</span>,
  };

  const storeBgs: Record<string, string> = {
    'mama-cass-bukka': '#FCECEB',
    '4u-supermarket': '#FEE89E',
    'mars-cafe': '#9CD6E2',
    'chicken-republic': '#FDECEA',
    'keffi-suya-spot': '#EBF7F2',
    'chillz-lounge': '#F3ECFC'
  };

  return (
    <div className="app-content animate-fade-in" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Orange Header Banner */}
      <div className="header-orange header-orange-text" style={{ padding: '32px 32px 28px', marginBottom: '24px', borderRadius: '28px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', opacity: 0.9 }}>Hey, {user.name.split(' ')[0]}</h2>
        <h1 style={{ fontSize: '34px', fontWeight: '900', marginTop: '4px', letterSpacing: '-0.02em' }}>Shop By Store</h1>
        <p style={{ fontSize: '13px', opacity: 0.8, marginTop: '6px' }}>
          {filteredRestaurants.length} campus-friendly stores available
        </p>
      </div>

      {/* Filter Tabs — ONLY All, Main Dish, Fast Foods, Drinks */}
      <div className="horizontal-scroll" style={{ padding: '0 0 20px 0', gap: '12px' }}>
        {filters.map(f => (
          <button
            key={f}
            className={`category-pill ${activeFilter === f ? 'active' : ''}`}
            onClick={() => setActiveFilter(f)}
            style={{ fontWeight: '700', borderRadius: '24px', padding: '12px 24px', fontSize: '14px' }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Store Cards Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
        {filteredRestaurants.map(store => (
          <Link
            href={`/restaurant/${store.id}`}
            key={store.id}
            style={{
              display: 'flex',
              gap: '20px',
              textDecoration: 'none',
              alignItems: 'center',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '24px',
              padding: '20px',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--border-color)',
              transition: 'transform 0.2s ease, boxShadow 0.2s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
          >
            {/* Logo Box */}
            <div style={{
              width: '110px', height: '110px',
              borderRadius: '20px',
              backgroundColor: storeBgs[store.id] || '#F6F7F9',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, boxShadow: 'var(--shadow-sm)'
            }}>
              {storeLogos[store.id]}
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>
                {store.name}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px', lineHeight: '1.3' }}>
                {store.address}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '800', color: 'var(--text-main)' }}>
                  <Star size={14} fill="var(--primary-orange)" style={{ color: 'var(--primary-orange)' }} />
                  {store.rating}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
                  <Clock size={14} />
                  {store.deliveryTime}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
                  <Bike size={14} />
                  ₦{store.deliveryFee.toLocaleString()} delivery
                </span>
              </div>

              <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontSize: '11px', fontWeight: '800',
                  color: 'var(--primary-orange)',
                  backgroundColor: 'var(--primary-orange-light)',
                  padding: '3px 10px', borderRadius: '8px',
                  textTransform: 'uppercase'
                }}>
                  {store.type}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>
                  • {store.openingHours}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <BottomNav />
    </div>
  );
}

export default function RestaurantsPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', height: '50vh', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading stores...</p>
      </div>
    }>
      <RestaurantsContent />
    </Suspense>
  );
}
