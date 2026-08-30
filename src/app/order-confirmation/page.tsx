'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, MapPin, MessageSquare, Phone, CheckCircle, Package } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function OrderConfirmationPage() {
  const router = useRouter();
  const { activeOrder, advanceOrderStatus } = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const orderId = activeOrder?.id || '#765433';
  const eta = activeOrder?.eta || '25 Min';
  const deliveryAddress = activeOrder?.deliveryAddress || '36 green way, Katampe Extension';
  const status = activeOrder?.status || 'delivering';

  const handleAdvanceStatus = () => {
    if (activeOrder) {
      advanceOrderStatus();
    }
  };

  const statusLabels = {
    received: 'Order Received',
    preparing: 'Preparing Meal',
    courier_at_store: 'Rider at Restaurant',
    delivering: 'Out for Delivery',
    arrived: 'Delivered',
  };

  return (
    <div className="app-content animate-fade-in" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)', minHeight: '100vh', paddingBottom: '120px', position: 'relative' }}>
      {/* Light/Dark Header */}
      <div className="header-light" style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', padding: '16px 20px' }}>
        <button
          onClick={() => router.push('/')}
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
          Track Order
        </h2>
        
        <div style={{ width: '40px' }} />
      </div>

      {/* SVG Map Section */}
      <div style={{
        height: '300px',
        width: '100%',
        backgroundColor: 'var(--bg-card)',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
          <rect x="0" y="0" width="100%" height="100%" fill="var(--bg-primary)" />
          
          {/* Map blocks */}
          <rect x="10" y="10" width="80" height="60" rx="8" fill="var(--bg-card)" opacity="0.8" />
          <rect x="100" y="10" width="180" height="60" rx="8" fill="var(--bg-card)" opacity="0.8" />
          <rect x="290" y="10" width="130" height="60" rx="8" fill="var(--bg-card)" opacity="0.8" />
          
          <rect x="10" y="80" width="80" height="40" rx="8" fill="var(--bg-card)" opacity="0.8" />
          <rect x="100" y="80" width="180" height="40" rx="8" fill="var(--bg-card)" opacity="0.8" />
          <rect x="290" y="80" width="130" height="40" rx="8" fill="var(--bg-card)" opacity="0.8" />
          
          <rect x="10" y="130" width="140" height="60" rx="8" fill="var(--primary-orange)" opacity="0.2" />
          <rect x="160" y="130" width="260" height="60" rx="8" fill="var(--bg-card)" opacity="0.8" />
          
          {/* Roads */}
          <line x1="90" y1="0" x2="90" y2="300" stroke="var(--border-color)" strokeWidth="20" />
          <line x1="280" y1="0" x2="280" y2="300" stroke="var(--border-color)" strokeWidth="20" />
          <line x1="0" y1="200" x2="440" y2="200" stroke="var(--border-color)" strokeWidth="20" />
          
          {/* Route path */}
          <path 
            d="M 280 200 L 350 200 L 350 130 L 160 130" 
            fill="none" 
            stroke="var(--primary-orange)" 
            strokeWidth="5" 
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ strokeDasharray: '6 6' }}
          />

          <circle cx="280" cy="200" r="8" fill="var(--primary-orange)" />

          {/* Destination Pin */}
          <g transform="translate(160, 130)">
            <circle cx="0" cy="-20" r="14" fill="var(--primary-orange)" />
            <circle cx="0" cy="-20" r="6" fill="white" />
          </g>
        </svg>

        {/* Rider Card */}
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          right: '16px',
          backgroundColor: 'var(--bg-card)',
          borderRadius: '20px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border-color)',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-orange-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              border: '2px solid var(--primary-orange)'
            }}>
              🚴
            </div>
            <div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Delivery Rider</p>
              <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px' }}>
                Rakibul Hassan
              </h4>
            </div>
          </div>

          <button
            onClick={() => alert('Opening chat with rider...')}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-orange)',
              color: 'white',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(232,90,29,0.3)'
            }}
          >
            <MessageSquare size={18} />
          </button>
        </div>
      </div>

      {/* Delivery Info Details */}
      <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '20px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-orange-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary-orange)'
          }}>
            <Clock size={20} />
          </div>
          <div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
              Estimated Delivery Time
            </p>
            <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px' }}>
              {eta}
            </h4>
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '20px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-orange-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary-orange)'
          }}>
            <MapPin size={20} />
          </div>
          <div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
              Delivery Destination
            </p>
            <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)', marginTop: '2px' }}>
              {deliveryAddress}
            </h4>
          </div>
        </div>

        {/* Demo status controls */}
        {activeOrder && (
          <div style={{ 
            backgroundColor: 'var(--primary-orange-light)', 
            padding: '16px', 
            borderRadius: '20px',
            border: '1.5px dashed var(--primary-orange)',
            marginTop: '8px'
          }}>
            <p style={{ fontSize: '12px', color: 'var(--primary-orange)', fontWeight: '800', marginBottom: '4px' }}>
              🔴 DEMO STATUS CONTROL
            </p>
            <p style={{ fontSize: '13.5px', color: 'var(--text-main)', marginBottom: '12px', fontWeight: '600' }}>
              Status: <strong>{statusLabels[status]}</strong>
            </p>
            <button
              onClick={handleAdvanceStatus}
              disabled={status === 'arrived'}
              className="btn-primary"
              style={{
                fontSize: '13px',
                padding: '10px 16px',
                borderRadius: '12px',
                width: 'auto',
                boxShadow: 'none',
                backgroundColor: 'var(--primary-orange)',
                opacity: status === 'arrived' ? 0.5 : 1
              }}
            >
              {status === 'arrived' ? 'Delivered Successfully ✓' : 'Advance Order Status →'}
            </button>
          </div>
        )}
      </div>

      {/* Order Details Bottom Drawer */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'var(--bg-card)',
        borderTopLeftRadius: '28px',
        borderTopRightRadius: '28px',
        borderTop: '1px solid var(--border-color)',
        padding: '16px 20px 24px 20px',
        boxShadow: '0 -8px 24px rgba(0,0,0,0.15)',
        zIndex: 50
      }}>
        {/* Handle */}
        <div 
          onClick={() => setDrawerOpen(!drawerOpen)}
          style={{
            width: '44px',
            height: '4px',
            backgroundColor: 'var(--primary-orange)',
            borderRadius: '2px',
            margin: '0 auto 16px auto',
            cursor: 'pointer'
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>
              Order Summary
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', fontWeight: '600' }}>
              ID: {orderId}
            </p>
          </div>
          
          <Link href="/profile/orders" style={{
            color: 'var(--primary-orange)',
            fontWeight: '800',
            fontSize: '14px',
            textDecoration: 'none'
          }}>
            View All Orders
          </Link>
        </div>

        {/* Expandable Order Details content */}
        {drawerOpen && (
          <div style={{ marginTop: '16px', maxHeight: '160px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {activeOrder && activeOrder.items.map((item) => (
              <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', color: 'var(--text-main)' }}>
                <span>{item.product.name} x{item.quantity}</span>
                <span style={{ fontWeight: '800' }}>₦{(item.product.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            {!activeOrder && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', color: 'var(--text-main)' }}>
                <span>Smoky Party Jollof Rice x2</span>
                <span style={{ fontWeight: '800' }}>₦7,000</span>
              </div>
            )}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '15px', color: 'var(--text-main)' }}>
              <span>Total Paid</span>
              <span style={{ color: 'var(--primary-orange)' }}>₦{activeOrder?.total.toLocaleString() || '7,300'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
