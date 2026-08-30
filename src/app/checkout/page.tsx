'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Plus, MapPin } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { addresses, selectAddress, cart } = useCart();

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app-content animate-fade-in" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)', minHeight: '100vh', paddingBottom: '120px', position: 'relative' }}>
      {/* Light/Dark Header */}
      <div className="header-light" style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', padding: '16px 20px' }}>
        <button
          onClick={() => router.push('/cart')}
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

      <div style={{ padding: '24px 20px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-main)', marginBottom: '20px' }}>
          Delivery Address
        </h3>

        {/* Addresses list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
          {addresses.map((addr) => (
            <div
              key={addr.id}
              onClick={() => selectAddress(addr.id)}
              style={{
                border: addr.selected ? '2px solid var(--primary-orange)' : '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-card)',
                borderRadius: '24px',
                padding: '20px',
                position: 'relative',
                cursor: 'pointer',
                boxShadow: addr.selected ? '0 4px 16px rgba(232,90,29,0.15)' : 'var(--shadow-sm)',
                transition: 'all 0.2s ease'
              }}
            >
              {/* Checkmark indicator */}
              {addr.selected && (
                <div style={{
                  position: 'absolute',
                  right: '20px',
                  top: '20px',
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-orange)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <Check size={16} strokeWidth={3} />
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <MapPin size={16} style={{ color: 'var(--primary-orange)' }} />
                <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                  {addr.label}
                </h4>
              </div>
              
              <p style={{ 
                fontSize: '13.5px', 
                color: 'var(--text-muted)', 
                lineHeight: '1.4', 
                maxWidth: '80%',
                fontWeight: '500',
                marginTop: '4px'
              }}>
                {addr.address}
              </p>

              {/* Edit button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  alert(`Edit address: ${addr.label}`);
                }}
                style={{
                  position: 'absolute',
                  right: '20px',
                  bottom: '20px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary-orange)',
                  fontWeight: '800',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Edit
              </button>
            </div>
          ))}

          {/* Add New Address button */}
          <button
            onClick={() => alert('Add new address')}
            style={{
              width: '100%',
              height: '70px',
              border: '1.5px dashed var(--border-color)',
              borderRadius: '24px',
              backgroundColor: 'var(--bg-card)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              color: 'var(--text-main)',
              fontWeight: '700',
              fontSize: '15px',
              cursor: 'pointer'
            }}
          >
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              border: '1.5px solid var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Plus size={16} />
            </div>
            <span>Add New Address</span>
          </button>
        </div>
      </div>

      {/* Checkout Actions bottom section */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'var(--bg-card)',
        borderTop: '1px solid var(--border-color)',
        padding: '16px 20px 28px 20px',
        zIndex: 50,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.1)'
      }}>
        <button
          onClick={() => router.push('/checkout/payment')}
          className="btn-primary"
          style={{
            borderRadius: '18px',
            padding: '16px',
            backgroundColor: 'var(--primary-orange)',
            fontWeight: '800',
            fontSize: '16px',
            boxShadow: '0 4px 14px rgba(232,90,29,0.3)'
          }}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}
