'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Sparkles, TrendingUp } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BottomNav } from '../components/BottomNav';
import { RESTAURANTS, MenuItem } from '../data/mockData';

export default function HomePage() {
  const router = useRouter();
  const { addToCart, user } = useCart();

  // Curate a strong recommended list from all restaurants
  const recommended: { item: MenuItem; restaurantId: string; restaurantName: string }[] = [
    ...RESTAURANTS.flatMap(r =>
      r.menu.map(item => ({ item, restaurantId: r.id, restaurantName: r.name }))
    )
  ].slice(0, 12);

  return (
    <>
      <div className="app-content animate-fade-in" style={{ paddingBottom: '110px' }}>
        {/* Hero Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #E85A1D 0%, #B83D0D 100%)',
          borderRadius: '24px',
          padding: '24px 20px',
          color: 'white',
          marginBottom: '24px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {/* Dot pattern overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }} />

          <div style={{ maxWidth: '500px', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Sparkles size={14} />
              <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '3px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: '800' }}>
                NSUK Campus Delivery
              </span>
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: '900', lineHeight: '1.2', marginBottom: '8px', letterSpacing: '-0.02em' }}>
              Hungry on Campus,<br />{user.name.split(' ')[0]}? 🍛
            </h1>
            <p style={{ fontSize: '13px', opacity: 0.9, marginBottom: '18px', lineHeight: '1.4' }}>
              Order Jollof Rice, Suya, Shawarma & Groceries delivered to your hostel in under 30 mins.
            </p>
            <button
              onClick={() => router.push('/restaurants')}
              style={{
                backgroundColor: '#1E1E22',
                color: 'white',
                border: 'none',
                padding: '12px 22px',
                borderRadius: '16px',
                fontSize: '14px',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
              }}
            >
              Order Now →
            </button>
          </div>

          <div style={{ fontSize: '56px', zIndex: 1, lineHeight: 1, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}>
            🍛🌯
          </div>
        </div>

        {/* Featured Offers */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '0 4px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-main)' }}>Featured Offers</h2>
            <Link href="/restaurants" style={{ color: 'var(--primary-orange)', fontWeight: '800', fontSize: '13px', textDecoration: 'none' }}>
              View all stores →
            </Link>
          </div>

          <div className="horizontal-scroll">
            {/* Offer 1 */}
            <Link href="/restaurant/mama-cass-bukka" style={{ display: 'block', textDecoration: 'none' }}>
              <div style={{
                background: '#1C1C1E',
                color: 'white',
                borderRadius: '20px',
                padding: '18px',
                display: 'flex',
                alignItems: 'center',
                width: '260px',
                gap: '14px',
                boxShadow: 'var(--shadow-md)',
                flexShrink: 0
              }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '50%',
                  backgroundColor: '#E85A1D',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '26px', flexShrink: 0
                }}>🍛</div>
                <div>
                  <p style={{ fontSize: '11px', opacity: 0.7, marginBottom: '2px', fontWeight: '600' }}>Mama Cass Bukka</p>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'white' }}>₦500 OFF</h3>
                  <p style={{ fontSize: '11px', opacity: 0.6, marginTop: '2px' }}>On Jollof Rice orders</p>
                </div>
              </div>
            </Link>

            {/* Offer 2 */}
            <Link href="/restaurant/mars-cafe" style={{ display: 'block', textDecoration: 'none' }}>
              <div style={{
                background: 'linear-gradient(135deg, #E85A1D 0%, #B83D0D 100%)',
                color: 'white',
                borderRadius: '20px',
                padding: '18px',
                display: 'flex',
                alignItems: 'center',
                width: '260px',
                gap: '14px',
                boxShadow: 'var(--shadow-md)',
                flexShrink: 0
              }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '26px', flexShrink: 0
                }}>🌯</div>
                <div>
                  <p style={{ fontSize: '11px', opacity: 0.9, marginBottom: '2px', fontWeight: '600' }}>Mars Cafe</p>
                  <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Free Delivery</h3>
                  <p style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>On orders above ₦3,000</p>
                </div>
              </div>
            </Link>

            {/* Offer 3 */}
            <Link href="/restaurant/4u-supermarket" style={{ display: 'block', textDecoration: 'none' }}>
              <div style={{
                background: 'linear-gradient(135deg, #FEE89E 0%, #FDD56A 100%)',
                borderRadius: '20px',
                padding: '18px',
                display: 'flex',
                alignItems: 'center',
                width: '260px',
                gap: '14px',
                boxShadow: 'var(--shadow-md)',
                flexShrink: 0
              }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '50%',
                  border: '2.5px solid #E85A1D',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: '900', fontSize: '20px', color: '#E85A1D',
                  fontFamily: 'Georgia, serif', fontStyle: 'italic', flexShrink: 0
                }}>4U</div>
                <div>
                  <p style={{ fontSize: '11px', color: '#7A6000', marginBottom: '2px', fontWeight: '600' }}>4U Supermarket</p>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#3D2F00' }}>10% OFF</h3>
                  <p style={{ fontSize: '11px', color: '#7A6000', marginTop: '2px' }}>On all groceries today</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recommended Food & Groceries Header */}
        <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={20} style={{ color: 'var(--primary-orange)' }} />
            <h2 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-main)' }}>
              Recommended Food & Groceries
            </h2>
          </div>
        </div>

        {/* Recommended Grid */}
        <div className="grid-responsive" style={{ paddingBottom: '30px' }}>
          {recommended.map(({ item, restaurantId, restaurantName }) => (
            <div
              key={item.id}
              className="animate-fade-in"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: '20px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                minHeight: '230px'
              }}
              onClick={() => router.push(`/product/${item.id}`)}
            >
              {/* Emoji Food Image */}
              <div style={{
                height: '90px',
                borderRadius: '14px',
                marginBottom: '10px',
                backgroundColor: 'var(--light-blue-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '44px',
                flexShrink: 0
              }}>
                {item.emoji || '🍽️'}
              </div>

              {/* Store tag */}
              <span style={{
                fontSize: '9.5px',
                fontWeight: '800',
                color: 'var(--primary-orange)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '3px'
              }}>
                {restaurantName}
              </span>

              <h4 style={{
                fontSize: '13.5px',
                fontWeight: '800',
                marginBottom: '4px',
                color: 'var(--text-main)',
                lineHeight: '1.25',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {item.name}
              </h4>

              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px', fontWeight: '500' }}>
                {item.unit ? `per ${item.unit}` : 'per portion'}
              </p>

              {/* Price + Add Button Row */}
              <div style={{
                marginTop: 'auto',
                backgroundColor: 'var(--bg-primary)',
                borderRadius: '16px',
                padding: '6px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid var(--border-color)'
              }}>
                <span style={{ fontSize: '14.5px', fontWeight: '900', color: 'var(--primary-orange)' }}>
                  ₦{item.price.toLocaleString()}
                </span>

                <button
                  onClick={e => {
                    e.stopPropagation();
                    addToCart(item, restaurantId);
                  }}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-orange)',
                    color: 'white',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </>
  );
}
