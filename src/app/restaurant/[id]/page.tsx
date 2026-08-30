'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingBag, ArrowLeft, MapPin, Clock, Star, Sparkles, ChevronRight } from 'lucide-react';
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
      <div className="app-content animate-fade-in" style={{ backgroundColor: 'var(--bg-primary)', paddingBottom: '110px' }}>
        
        {/* Top Navigation Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px 16px',
          backgroundColor: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-color)',
          borderRadius: '18px',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
            <button
              onClick={() => router.push('/restaurants')}
              className="btn-back"
              aria-label="Back to stores"
            >
              <ArrowLeft size={18} />
            </button>
            <h2 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {restaurant.name}
            </h2>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            <span style={{
              fontSize: '10px',
              fontWeight: '800',
              color: 'var(--primary-orange)',
              backgroundColor: 'var(--primary-orange-light)',
              padding: '3px 8px',
              borderRadius: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.03em'
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
          borderRadius: '24px',
          padding: '24px 20px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '16px'
        }}>
          <div style={{ zIndex: 2, maxWidth: '70%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <Sparkles size={13} />
              <span style={{ backgroundColor: 'rgba(255,255,255,0.25)', padding: '2px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: '800' }}>
                Verified Store
              </span>
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: '900', lineHeight: '1.2', marginBottom: '6px', color: restaurant.id === '4u-supermarket' ? '#3D2F00' : 'white' }}>
              {restaurant.name}
            </h1>
            <p style={{ fontSize: '12px', opacity: 0.9, color: restaurant.id === '4u-supermarket' ? '#5C4700' : 'white', lineHeight: '1.3' }}>
              Fresh food & groceries delivered to your hostel or location
            </p>
          </div>

          <div style={{ fontSize: '48px', zIndex: 1, userSelect: 'none', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.15))' }}>
            {banner.emoji}
          </div>

          <div style={{
            position: 'absolute',
            bottom: '10px',
            right: '12px',
            backgroundColor: 'rgba(255,255,255,0.92)',
            color: '#1C1C1E',
            padding: '3px 10px',
            borderRadius: '14px',
            fontSize: '12px',
            fontWeight: '900',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Star size={13} fill="#E85A1D" color="#E85A1D" /> {restaurant.rating}
          </div>
        </div>

        {/* Delivery Information Panel */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '20px',
          padding: '16px',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border-color)',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', gap: '8px' }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.04em', fontSize: '10px', marginBottom: '2px' }}>
                DELIVERY TO
              </p>
              <div style={{ display: 'flex', alignItems: 'center', fontWeight: '700', color: 'var(--text-main)', fontSize: '12.5px' }}>
                <MapPin size={14} style={{ marginRight: '4px', color: 'var(--primary-orange)', flexShrink: 0 }} />
                <span>NSUK Campus & Katampe Ext.</span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <p style={{ color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.04em', fontSize: '10px', marginBottom: '2px' }}>
                DELIVERY TIME
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontWeight: '700', color: 'var(--text-main)', fontSize: '12.5px' }}>
                <Clock size={14} style={{ marginRight: '4px', color: 'var(--primary-orange)', flexShrink: 0 }} />
                <span>{restaurant.deliveryTime}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', marginTop: '14px', paddingTop: '10px', fontSize: '12px' }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '10px' }}>Opening Hours</p>
              <p style={{ fontWeight: '800', color: 'var(--primary-orange)', marginTop: '2px' }}>{restaurant.openingHours}</p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '10px' }}>Address</p>
              <p style={{ fontWeight: '600', color: 'var(--text-main)', marginTop: '2px', fontSize: '11.5px' }}>{restaurant.address}</p>
            </div>
          </div>
        </div>

        {/* Menu Categories List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Menu Categories
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
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
                  height: '110px',
                  borderRadius: '20px',
                  backgroundColor: gfx.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 20px',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ zIndex: 2, maxWidth: '70%' }}>
                  <h2 style={{
                    fontSize: '22px',
                    fontWeight: '900',
                    color: gfx.text,
                    letterSpacing: '-0.02em',
                    marginBottom: '2px',
                    lineHeight: '1.2'
                  }}>
                    {catName}
                  </h2>
                  <p style={{ fontSize: '12px', color: gfx.text, opacity: 0.85, fontWeight: '700', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <span>{itemCount} {itemCount === 1 ? 'item' : 'items'} available</span>
                    <ChevronRight size={13} />
                  </p>
                </div>
                
                {/* Food Emoji */}
                <div style={{
                  fontSize: '56px',
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
