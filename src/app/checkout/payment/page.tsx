'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { useCart } from '../../../context/CartContext';

export default function PaymentPage() {
  const router = useRouter();
  const { cart, currentRestaurant, promoDiscount, createOrder } = useCart();

  // Form states initialized to user defaults
  const [cardHolder, setCardHolder] = useState('Leonard Soempit');
  const [cardNumber, setCardNumber] = useState('0987 0986 5543 09809');
  const [expDate, setExpDate] = useState('10/23');
  const [cvc, setCvc] = useState('3465');

  // Dynamic invoice calculations based on cart or fallback values
  const isCartEmpty = cart.length === 0;
  
  const subtotal = !isCartEmpty 
    ? cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    : 3500.96;

  const deliveryFee = !isCartEmpty && currentRestaurant 
    ? currentRestaurant.deliveryFee 
    : 2000.00;

  const total = Math.max(0, subtotal + deliveryFee - promoDiscount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardHolder || !cardNumber || !expDate || !cvc) {
      alert('Please fill all card details');
      return;
    }
    createOrder({ cardHolder, cardNumber, expDate, cvc });
    router.push('/order-confirmation');
  };

  return (
    <div className="app-content animate-fade-in" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)', minHeight: '100vh', paddingBottom: '220px', position: 'relative' }}>
      {/* Light/Dark Theme Header */}
      <div className="header-light" style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', padding: '16px 20px' }}>
        <button
          onClick={() => router.push('/checkout')}
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
          Add Card & Payment
        </h2>
        
        <div style={{ width: '40px' }} />
      </div>

      {/* Card Input Form */}
      <form onSubmit={handleSubmit} style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '24px',
          padding: '24px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <CreditCard size={20} style={{ color: 'var(--primary-orange)' }} />
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              Credit / Debit Card
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{
                fontSize: '11px',
                fontWeight: '700',
                color: 'var(--text-muted)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '8px'
              }}>
                Card Holder Name
              </label>
              <input
                type="text"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '14px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-main)',
                  fontSize: '15px',
                  fontWeight: '600',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div>
              <label style={{
                fontSize: '11px',
                fontWeight: '700',
                color: 'var(--text-muted)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '8px'
              }}>
                Card Number
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '14px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-main)',
                  fontSize: '15px',
                  fontWeight: '600',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '8px'
                }}>
                  Exp Date
                </label>
                <input
                  type="text"
                  value={expDate}
                  onChange={(e) => setExpDate(e.target.value)}
                  placeholder="MM/YY"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '14px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-main)',
                    fontSize: '15px',
                    fontWeight: '600',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <label style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '8px'
                }}>
                  CVC
                </label>
                <input
                  type="password"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  placeholder="123"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '14px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-main)',
                    fontSize: '15px',
                    fontWeight: '600',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Summary Bottom Sheet */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'var(--bg-card)',
          borderTopLeftRadius: '28px',
          borderTopRightRadius: '28px',
          padding: '24px 20px 28px 20px',
          boxShadow: '0 -8px 30px rgba(0,0,0,0.15)',
          borderTop: '1px solid var(--border-color)',
          zIndex: 100
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)' }}>
              <span>Subtotal</span>
              <span style={{ color: 'var(--text-main)', fontWeight: '800' }}>₦{subtotal.toLocaleString()}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)' }}>
              <span>Delivery</span>
              <span style={{ color: 'var(--text-main)', fontWeight: '800' }}>₦{deliveryFee.toLocaleString()}</span>
            </div>

            {promoDiscount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '600', color: 'var(--primary-orange)' }}>
                <span>Discount</span>
                <span style={{ fontWeight: '800' }}>-₦{promoDiscount.toLocaleString()}</span>
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
              <span>Total</span>
              <span style={{ fontSize: '20px', fontWeight: '900', color: 'var(--primary-orange)' }}>₦{total.toLocaleString()}</span>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{
              backgroundColor: 'var(--primary-orange)',
              borderRadius: '18px',
              padding: '16px',
              fontWeight: '800',
              fontSize: '16px',
              boxShadow: '0 4px 14px rgba(232,90,29,0.3)'
            }}
          >
            Make Payment
          </button>
        </div>
      </form>
    </div>
  );
}
