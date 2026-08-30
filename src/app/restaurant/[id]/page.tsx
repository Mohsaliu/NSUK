'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingBag, ArrowLeft, ChevronDown, MapPin, Clock, Star, Sparkles, ChevronRight } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { BottomNav } from '../../../components/BottomNav';
import { RESTAURANTS } from '../../../data/mockData';

export default function RestaurantDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const storeId = params.id as string;
  const { cart } = useCart();

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  const restaurant = RESTAURANTS.find((r) => r.id === storeId);

  if (!restaurant) {
    return (
      <div className="app-content animate-fade-in" style={{ padding: '20px', textAlign: 'center' }}>
        <p>Store not found.</p>
        <Link href="/restaurants" style={{ color: 'var(--primary-orange)', fontWeight: '700', marginTop: '12px', display: 'block' }}>
          Back to stores
        </Link>
      </div>
    );
  }

  // Get distinct categories from restaurant's menu items
  const menuCategories = Array.from(
    new Set(restaurant.menu.map((item) => item.category))
  );

  const categoryGfx: { [key: string]: { emoji: string; bg: string; text: string } } = {
    'Rice & Meals':          { emoji: '🍛', bg: '#FFF3E0', text: '#E85A1D' },
    'Swallow & Soups':        { emoji: '🍲', bg: '#FCECEB', text: '#1C1C1E' },
    'Grills & Protein':       { emoji: '🥩', bg: '#EBF7F2', text: '#1C1C1E' },
    'Chips & Fries':          { emoji: '🍟', bg: '#FDECEA', text: '#E85A1D' },
    'Special Chops':          { emoji: '🍢', bg: '#FFF8E7', text: '#1C1C1E' },
    'Groceries & Provisions': { emoji: '🛒', bg: '#E2F0F9', text: '#E85A1D' },
    'Burgers & Shawarma':     { emoji: '🌯', bg: '#F9F1E2', text: '#1C1C1E' },
    'Drinks & Beverages':     { emoji: '🥤', bg: '#F3ECFC', text: '#1C1C1E' },
  };

  const storeBanners: { [key: string]: { emoji: string; bg: string } } = {
    'mama-cass-bukka': { emoji: '🍛🍲🥩', bg: 'linear-gradient(135deg, #E85A1D 0%, #B83D0D 100%)' },
    '4u-supermarket': { emoji: '🛒🌾🥛', bg: 'linear-gradient(135deg, #FEE89E 0%, #FDD56A 100%)' },
    'mars-cafe': { emoji: '🌯🍔🥤', bg: 'linear-gradient(135deg, #9CD6E2 0%, #6EB4C4 100%)' },
  };

  const banner = storeBanners[restaurant.id] || { emoji: '🍱🍛🥤', bg: 'linear-gradient(135deg, #E85A1D 0%, #B83D0D 100%)' };

  return (
    <>
      <div className="app-content animate-fade-in" style={{ backgroundColor: 'var(--bg-primary)', paddingBottom: '60px' }}>
        
        {/* Top Navigation Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          backgroundColor: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => router.push('/restaurants')}
              className="btn-back"
              aria-label="Back to stores"
            >
              <ArrowLeft size={18} />
            </button>
            <h2 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-main)' }}>{restaurant.name}</h2>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: '800',
              color: 'var(--primary-orange)',
              backgroundColor: 'var(--primary-orange-light)',
              padding: '4px 10px',
              borderRadius: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              {restaurant.type}
            </span>
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

        {/* Cover Food Banner */}
        <div style={{
          background: banner.bg,
          borderRadius: '28px',
          margin: '20px 20px 0 20px',
          padding: '32px 28px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ zIndex: 2, maxWidth: '65%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Sparkles size={14} />
              <span style={{ backgroundColor: 'rgba(255,255,255,0.25)', padding: '3px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: '800' }}>
                Verified Store
              </span>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: '900', lineHeight: '1.2', marginBottom: '8px', color: restaurant.id === '4u-supermarket' ? '#3D2F00' : 'white' }}>
              {restaurant.name}
            </h1>
            <p style={{ fontSize: '13px', opacity: 0.9, color: restaurant.id === '4u-supermarket' ? '#5C4700' : 'white' }}>
              Fresh food & groceries delivered to your hostel or location
            </p>
          </div>

          <div style={{ fontSize: '64px', zIndex: 1, userSelect: 'none', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.15))' }}>
            {banner.emoji}
          </div>

          <div style={{
            position: 'absolute',
            bottom: '12px',
            right: '16px',
            backgroundColor: 'rgba(255,255,255,0.92)',
            color: '#1C1C1E',
            padding: '4px 12px',
            borderRadius: '16px',
            fontSize: '13px',
            fontWeight: '900',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Star size={14} fill="#E85A1D" color="#E85A1D" /> {restaurant.rating}
          </div>
        </div>

        {/* Delivery Information Panel */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '24px',
          padding: '20px',
          margin: '16px 20px 0 20px',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '4px' }}>
                DELIVERY TO
              </p>
              <div style={{ display: 'flex', alignItems: 'center', fontWeight: '700', color: 'var(--text-main)' }}>
                <MapPin size={14} style={{ marginRight: '4px', color: 'var(--primary-orange)' }} />
                <span>NSUK Campus & Katampe Ext.</span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <p style={{ color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '4px' }}>
                DELIVERY TIME
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontWeight: '700', color: 'var(--text-main)' }}>
                <Clock size={14} style={{ marginRight: '4px', color: 'var(--primary-orange)' }} />
                <span>{restaurant.deliveryTime}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', marginTop: '16px', paddingTop: '12px', fontSize: '13px' }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Opening Hours</p>
              <p style={{ fontWeight: '800', color: 'var(--primary-orange)', marginTop: '2px' }}>{restaurant.openingHours}</p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Address</p>
              <p style={{ fontWeight: '600', color: 'var(--text-main)', marginTop: '2px' }}>{restaurant.address}</p>
            </div>
          </div>
        </div>

        {/* Menu Categories List */}
        <div style={{ margin: '28px 20px 0 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Menu Categories
            </h3>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
              {menuCategories.length} categories
            </span>
          </div>

          {menuCategories.map((catName) => {
            const gfx = categoryGfx[catName] || { emoji: '🍱', bg: '#FFF3E0', text: '#E85A1D' };
            const itemCount = restaurant.menu.filter(i => i.category === catName).length;

            return (
              <div
                key={catName}
                onClick={() => router.push(`/restaurant/${storeId}/category/${encodeURIComponent(catName)}`)}
                style={{
                  height: '130px',
                  borderRadius: '24px',
                  backgroundColor: gfx.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 28px',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <div style={{ zIndex: 2 }}>
                  <h2 style={{
                    fontSize: '28px',
                    fontWeight: '900',
                    color: gfx.text,
                    letterSpacing: '-0.02em',
                    marginBottom: '4px'
                  }}>
                    {catName}
                  </h2>
                  <p style={{ fontSize: '13px', color: gfx.text, opacity: 0.8, fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>{itemCount} {itemCount === 1 ? 'item' : 'items'} available</span>
                    <ChevronRight size={14} />
                  </p>
                </div>
                
                {/* Food Emoji */}
                <div style={{
                  fontSize: '70px',
                  userSelect: 'none',
                  zIndex: 1,
                  transform: 'rotate(-5deg)',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
                }}>
                  {gfx.emoji}
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
