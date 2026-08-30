'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft, Star, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { RESTAURANTS } from '@/data/mockData';

export default function ProductDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const itemId = params.id as string;
  
  const { cart, addToCart } = useCart();
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [addedToast, setAddedToast] = useState(false);

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  // Find the product and its parent restaurant
  let product = null;
  let restaurantId = '';
  
  for (const r of RESTAURANTS) {
    const found = r.menu.find((item) => item.id === itemId);
    if (found) {
      product = found;
      restaurantId = r.id;
      break;
    }
  }

  if (!product) {
    return (
      <div className="app-content" style={{ padding: '20px', textAlign: 'center' }}>
        <p>Product not found.</p>
        <Link href="/" style={{ color: 'var(--primary-orange)', fontWeight: '700' }}>
          Go Home
        </Link>
      </div>
    );
  }

  const toggleTab = (tab: string) => {
    setActiveTab(activeTab === tab ? null : tab);
  };

  const handleAddToCart = () => {
    addToCart(product!, restaurantId);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product!, restaurantId);
    router.push('/cart');
  };

  return (
    <div className="app-content animate-fade-in" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)', minHeight: '100vh', paddingBottom: '120px', position: 'relative' }}>
      {/* Light/Dark Header */}
      <div className="header-light" style={{ backgroundColor: 'transparent', borderBottom: 'none', padding: '16px 20px' }}>
        <button
          onClick={() => router.back()}
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-main)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <ArrowLeft size={18} />
        </button>
        
        <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>{product.category}</h2>
        
        <Link href="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', color: 'var(--text-main)' }}>
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)',
            color: 'var(--text-main)'
          }}>
            <ShoppingBag size={20} />
          </div>
          {totalCartItems > 0 && (
            <span className="badge-count" style={{ top: '-4px', right: '-4px' }}>
              {totalCartItems}
            </span>
          )}
        </Link>
      </div>

      {/* Hero Image Box */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px 0' }}>
        <div 
          style={{
            width: '180px',
            height: '180px',
            borderRadius: '32px',
            fontSize: '96px',
            backgroundColor: 'var(--bg-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--border-color)'
          }}
        >
          {product.emoji || '🍛'}
        </div>
      </div>

      {/* Main product details sheet */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderTopLeftRadius: '32px',
        borderTopRightRadius: '32px',
        borderTop: '1px solid var(--border-color)',
        padding: '28px 24px',
        boxShadow: 'var(--shadow-md)',
        flex: 1
      }}>
        {/* Title */}
        <h1 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-main)', lineHeight: '1.2', marginBottom: '12px' }}>
          {product.name}
        </h1>

        {/* Pricing & Discount Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <span style={{ fontSize: '22px', fontWeight: '900', color: 'var(--primary-orange)' }}>
            ₦{product.price.toLocaleString()}
          </span>
          {product.discount && (
            <span style={{
              backgroundColor: 'var(--primary-orange)',
              color: 'white',
              fontSize: '11px',
              fontWeight: '800',
              padding: '4px 10px',
              borderRadius: '12px',
              letterSpacing: '0.02em'
            }}>
              {product.discount}
            </span>
          )}
        </div>

        {/* Ratings block */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '24px' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={16}
              fill={star <= Math.floor(product.rating || 4.5) ? 'var(--primary-orange)' : 'none'}
              color={star <= Math.floor(product.rating || 4.5) ? 'var(--primary-orange)' : 'var(--border-color)'}
            />
          ))}
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginLeft: '6px', fontWeight: '600' }}>
            {product.reviewsCount || 110} Student Reviews
          </span>
        </div>

        {/* Details text */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>Details</h4>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5', fontWeight: '500' }}>
            {product.description}
          </p>
        </div>

        {/* Accordions */}
        <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--border-color)' }}>
          {/* Nutritional Facts */}
          <div style={{ borderBottom: '1px solid var(--border-color)' }}>
            <button
              onClick={() => toggleTab('nutritional')}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 0',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '800',
                fontSize: '15px',
                color: 'var(--text-main)'
              }}
            >
              <span>Nutritional Facts & Ingredients</span>
              {activeTab === 'nutritional' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {activeTab === 'nutritional' && (
              <div style={{ padding: '0 0 16px 0', fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: '1.5', fontWeight: '500' }}>
                Rich in proteins, vitamins, and energy nutrients to keep you active during NSUK campus lectures & study sessions. Freshly prepared to student hygiene standards.
              </div>
            )}
          </div>

          {/* Student Reviews */}
          <div style={{ borderBottom: '1px solid var(--border-color)' }}>
            <button
              onClick={() => toggleTab('reviews')}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 0',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '800',
                fontSize: '15px',
                color: 'var(--text-main)'
              }}
            >
              <span>Student Reviews</span>
              {activeTab === 'reviews' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {activeTab === 'reviews' && (
              <div style={{ padding: '0 0 16px 0', fontSize: '13px', color: 'var(--text-muted)' }}>
                <p style={{ fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>Amara K. (NSUK Student)</p>
                <p style={{ fontStyle: 'italic', marginBottom: '8px' }}>"Delicious, hot and delivered fast right to my hostel gate!"</p>
                <p style={{ fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>Tunde O.</p>
                <p style={{ fontStyle: 'italic' }}>"Best meal option during exam preparation weeks."</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Added Toast Notification */}
      {addedToast && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'var(--text-main)',
          color: 'var(--bg-card)',
          padding: '12px 24px',
          borderRadius: '20px',
          fontWeight: '800',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          zIndex: 200
        }}>
          <Check size={18} style={{ color: 'var(--primary-orange)' }} />
          <span>Added to Cart!</span>
        </div>
      )}

      {/* Sticky Bottom Actions */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'var(--bg-card)',
        borderTop: '1px solid var(--border-color)',
        padding: '16px 20px 28px 20px',
        display: 'flex',
        gap: '14px',
        boxShadow: '0 -4px 16px rgba(0,0,0,0.1)',
        zIndex: 50
      }}>
        <button 
          onClick={handleAddToCart}
          className="btn-secondary" 
          style={{ flex: 1, padding: '15px 0', borderRadius: '18px', fontSize: '15px', fontWeight: '800' }}
        >
          Add To Cart
        </button>
        <button 
          onClick={handleBuyNow}
          className="btn-primary" 
          style={{ flex: 1, padding: '15px 0', borderRadius: '18px', fontSize: '15px', fontWeight: '800', backgroundColor: 'var(--primary-orange)', boxShadow: '0 4px 14px rgba(232,90,29,0.3)' }}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
