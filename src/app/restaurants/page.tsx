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

  const filters = ['All', 'Main Dish', 'Fast Foods', 'Drinks'];

  const filteredRestaurants = RESTAURANTS.filter(r => {
    const matchesSearch = searchQuery
      ? r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.address.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    if (!matchesSearch) return false;

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
    'mama-cass-bukka': <span style={{ fontSize: '36px' }}>🍛</span>,
    '4u-supermarket': (
      <div style={{
        width: '56px', height: '42px', borderRadius: '50%',
        border: '2.5px solid #E85A1D',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#E85A1D', fontWeight: '900', fontSize: '18px',
        fontFamily: 'Georgia, serif', fontStyle: 'italic'
      }}>4U</div>
    ),
    'mars-cafe': (
      <div style={{ textAlign: 'center', fontFamily: 'serif', fontWeight: '900', fontSize: '15px', lineHeight: 1.1, color: '#000' }}>
        mar&apos;s<br />cafe
      </div>
    ),
    'chicken-republic': <span style={{ fontSize: '36px' }}>🍗</span>,
    'keffi-suya-spot':  <span style={{ fontSize: '36px' }}>🥩</span>,
    'chillz-lounge':   <span style={{ fontSize: '36px' }}>🍹</span>,
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
    <div className="app-content animate-fade-in" style={{ backgroundColor: 'var(--bg-primary)', paddingBottom: '110px' }}>
      {/* Orange Header Banner */}
      <div className="header-orange header-orange-text" style={{ padding: '24px 20px', marginBottom: '20px', borderRadius: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '600', opacity: 0.9 }}>Hey, {user.name.split(' ')[0]}</h2>
        <h1 style={{ fontSize: '28px', fontWeight: '900', marginTop: '2px', letterSpacing: '-0.02em' }}>Shop By Store</h1>
        <p style={{ fontSize: '12.5px', opacity: 0.85, marginTop: '4px' }}>
          {filteredRestaurants.length} campus-friendly stores available
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="horizontal-scroll" style={{ padding: '0 0 16px 0', gap: '10px' }}>
        {filters.map(f => (
          <button
            key={f}
            className={`category-pill ${activeFilter === f ? 'active' : ''}`}
            onClick={() => setActiveFilter(f)}
            style={{ fontWeight: '800', borderRadius: '20px', padding: '10px 20px', fontSize: '13.5px' }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Store Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '30px' }}>
        {filteredRestaurants.map(store => (
          <Link
            href={`/restaurant/${store.id}`}
            key={store.id}
            style={{
              display: 'flex',
              gap: '14px',
              textDecoration: 'none',
              alignItems: 'center',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '20px',
              padding: '14px',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--border-color)',
              transition: 'transform 0.2s ease, boxShadow 0.2s ease'
            }}
          >
            {/* Logo Box */}
            <div style={{
              width: '84px', height: '84px',
              borderRadius: '16px',
              backgroundColor: storeBgs[store.id] || '#F6F7F9',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, boxShadow: 'var(--shadow-sm)'
            }}>
              {storeLogos[store.id]}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {store.name}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', lineHeight: '1.3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {store.address}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px', fontWeight: '800', color: 'var(--text-main)' }}>
                  <Star size={13} fill="var(--primary-orange)" style={{ color: 'var(--primary-orange)' }} />
                  {store.rating}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
                  <Clock size={13} />
                  {store.deliveryTime}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
                  <Bike size={13} />
                  ₦{store.deliveryFee.toLocaleString()}
                </span>
              </div>

              <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{
                  fontSize: '10px', fontWeight: '800',
                  color: 'var(--primary-orange)',
                  backgroundColor: 'var(--primary-orange-light)',
                  padding: '2px 8px', borderRadius: '6px',
                  textTransform: 'uppercase'
                }}>
                  {store.type}
                </span>
                <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: '600' }}>
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
