'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Minus, Trash2, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartPage() {
  const router = useRouter();
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    currentRestaurant,
    promoDiscount,
    applyPromo,
    promoCodeApplied
  } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState(false);
  const [promoSuccess, setPromoSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = currentRestaurant ? currentRestaurant.deliveryFee : 0;
  const total = Math.max(0, subtotal + deliveryFee - promoDiscount);
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(false);
    setPromoSuccess(false);
    if (promoCode.trim()) {
      const success = applyPromo(promoCode);
      if (success) {
        setPromoSuccess(true);
        setPromoCode('');
      } else {
        setPromoError(true);
      }
    }
  };

  return (
    <div className="app-content animate-fade-in" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)', minHeight: '100vh', paddingBottom: '240px', position: 'relative' }}>
      {/* Light/Dark Header */}
      <div className="header-light" style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', padding: '16px 20px' }}>
        <button
          onClick={() => router.back()}
          style={{
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-main)',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={18} />
        </button>
        
        <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>
          Shopping Cart ({totalItemsCount})
        </h2>
        
        <div style={{ width: '40px' }} />
      </div>

      {cart.length === 0 ? (
        <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <span style={{ fontSize: '64px', display: 'block', marginBottom: '16px' }}>🛒</span>
          <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>Your cart is empty</h3>
          <p style={{ fontSize: '14px', marginBottom: '24px' }}>Add delicious food or snacks from campus stores.</p>
          <button 
            onClick={() => router.push('/restaurants')}
            className="btn-primary" 
            style={{ maxWidth: '220px', margin: '0 auto', borderRadius: '16px' }}
          >
            Find Food
          </button>
        </div>
      ) : (
        <>
          {/* Cart Items List */}
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cart.map((item) => (
              <div 
                key={item.product.id}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '20px',
                  padding: '16px',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {/* Item Details */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '16px',
                    backgroundColor: 'var(--bg-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    flexShrink: 0
                  }}>
                    {item.product.emoji || '🍛'}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>
                      {item.product.name}
                    </h4>
                    <p style={{ fontSize: '14px', fontWeight: '800', color: 'var(--primary-orange)' }}>
                      ₦{item.product.price.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {isEditing && (
                    <button 
                      onClick={() => removeFromCart(item.product.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#FF3B30',
                        cursor: 'pointer',
                        marginRight: '4px'
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => updateQuantity(item.product.id, -1)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'var(--text-main)'
                    }}
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ fontSize: '15px', fontWeight: '800', width: '20px', textAlign: 'center', color: 'var(--text-main)' }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product.id, 1)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'var(--text-main)'
                    }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))}

            {/* Toggle Edit mode */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary-orange)',
                  fontWeight: '800',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                {isEditing ? 'Done Editing' : 'Edit Cart'}
              </button>
            </div>
          </div>

          {/* Promo Code Entry */}
          <div style={{ padding: '0 20px', marginTop: '8px' }}>
            <form onSubmit={handlePromoSubmit} style={{ display: 'flex', gap: '10px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="text"
                  placeholder="Enter Promo Code (e.g. NSUKFRESH)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 38px',
                    borderRadius: '14px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-main)',
                    fontSize: '13.5px',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
                <Tag size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
              <button
                type="submit"
                style={{
                  backgroundColor: 'var(--text-main)',
                  color: 'var(--bg-card)',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '0 18px',
                  fontSize: '14px',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                Apply
              </button>
            </form>
            
            {promoSuccess && (
              <p style={{ fontSize: '12.5px', color: '#34C759', fontWeight: '800', marginTop: '6px' }}>
                🎉 Promo Applied! Saved ₦{promoDiscount.toLocaleString()}
              </p>
            )}
            {promoCodeApplied && !promoSuccess && (
              <p style={{ fontSize: '12.5px', color: '#34C759', fontWeight: '800', marginTop: '6px' }}>
                ✓ Code {promoCodeApplied} active (Saved ₦{promoDiscount.toLocaleString()})
              </p>
            )}
            {promoError && (
              <p style={{ fontSize: '12.5px', color: '#FF3B30', fontWeight: '800', marginTop: '6px' }}>
                ⚠️ Invalid promo code. Try "NSUKFRESH".
              </p>
            )}
          </div>

          {/* Checkout Summary Bottom Panel */}
          <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'var(--bg-card)',
            borderTopLeftRadius: '28px',
            borderTopRightRadius: '28px',
            padding: '24px 20px 28px 20px',
            boxShadow: '0 -8px 30px rgba(0,0,0,0.12)',
            borderTop: '1px solid var(--border-color)',
            zIndex: 100
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)' }}>
                <span>Subtotal</span>
                <span style={{ color: 'var(--text-main)', fontWeight: '800' }}>₦{subtotal.toLocaleString()}</span>
              </div>
              
              {promoDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '600', color: 'var(--primary-orange)' }}>
                  <span>Promo Discount</span>
                  <span style={{ fontWeight: '800' }}>-₦{promoDiscount.toLocaleString()}</span>
                </div>
              )}
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)' }}>
                <span>Delivery</span>
                <span style={{ color: 'var(--text-main)', fontWeight: '800' }}>₦{deliveryFee.toLocaleString()}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                <span>Total</span>
                <span style={{ fontSize: '20px', fontWeight: '900', color: 'var(--primary-orange)' }}>₦{total.toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={() => router.push('/checkout')}
              className="btn-primary"
              style={{
                backgroundColor: 'var(--primary-orange)',
                color: 'white',
                boxShadow: '0 4px 14px rgba(232,90,29,0.3)',
                borderRadius: '18px',
                padding: '16px',
                fontWeight: '800',
                fontSize: '16px'
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
