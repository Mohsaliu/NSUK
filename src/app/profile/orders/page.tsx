'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, CheckCircle2, RotateCcw } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { BottomNav } from '../../../components/BottomNav';

export default function OrdersPage() {
  const router = useRouter();
  const { orderHistory, addToCart } = useCart();
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('past');

  const activeOrders = orderHistory.filter((ord) => ord.status !== 'arrived');
  const pastOrders = orderHistory.filter((ord) => ord.status === 'arrived');

  const displayedOrders = activeTab === 'active' ? activeOrders : pastOrders;

  const handleReorder = (order: typeof orderHistory[0]) => {
    order.items.forEach(({ product, restaurantId }) => {
      addToCart(product, restaurantId);
    });
    router.push('/cart');
  };

  return (
    <>
      <div className="app-content animate-fade-in" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)', minHeight: '100vh', paddingBottom: '100px' }}>
        {/* Header */}
        <div className="header-light" style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', padding: '16px 20px' }}>
          <button
            onClick={() => router.push('/profile')}
            className="btn-back"
            aria-label="Back to profile"
          >
            <ArrowLeft size={18} />
          </button>
          
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>
            Orders History
          </h2>
          
          <div style={{ width: '40px' }} />
        </div>

        {/* Tab Filters */}
        <div style={{ padding: '16px 20px 0 20px', display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setActiveTab('active')}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              backgroundColor: activeTab === 'active' ? 'var(--primary-orange)' : 'var(--bg-card)',
              color: activeTab === 'active' ? 'white' : 'var(--text-main)',
              fontWeight: '800',
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.2s ease'
            }}
          >
            Active ({activeOrders.length})
          </button>
          
          <button
            onClick={() => setActiveTab('past')}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              backgroundColor: activeTab === 'past' ? 'var(--primary-orange)' : 'var(--bg-card)',
              color: activeTab === 'past' ? 'white' : 'var(--text-main)',
              fontWeight: '800',
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.2s ease'
            }}
          >
            Past Orders ({pastOrders.length})
          </button>
        </div>

        {/* Orders list */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {displayedOrders.length === 0 ? (
            <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '15px', fontWeight: '600' }}>No {activeTab} orders found.</p>
            </div>
          ) : (
            displayedOrders.map((order) => (
              <div
                key={order.id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '24px',
                  padding: '20px',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px'
                }}
              >
                {/* Top Row: Store Name & Status Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>
                      {order.restaurantName}
                    </h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', fontWeight: '500' }}>
                      ID: {order.id} • {order.date}
                    </p>
                  </div>

                  <span style={{
                    backgroundColor: order.status === 'arrived' ? 'rgba(46,125,50,0.12)' : 'var(--primary-orange-light)',
                    color: order.status === 'arrived' ? '#2E7D32' : 'var(--primary-orange)',
                    fontSize: '12px',
                    fontWeight: '800',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {order.status === 'arrived' ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                    {order.status === 'arrived' ? 'Delivered' : order.eta}
                  </span>
                </div>

                {/* Items Summary */}
                <div style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '12px 0', fontSize: '13.5px', color: 'var(--text-main)' }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span>{item.product.name} x{item.quantity}</span>
                      <span style={{ fontWeight: '700' }}>₦{(item.product.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {/* Total & Reorder Button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', fontWeight: '700', textTransform: 'uppercase' }}>Total Paid</span>
                    <span style={{ fontSize: '17px', fontWeight: '900', color: 'var(--primary-orange)' }}>₦{order.total.toLocaleString()}</span>
                  </div>

                  {order.status === 'arrived' ? (
                    <button
                      onClick={() => handleReorder(order)}
                      style={{
                        backgroundColor: 'var(--primary-orange-light)',
                        color: 'var(--primary-orange)',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '10px 18px',
                        fontWeight: '800',
                        fontSize: '13.5px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <RotateCcw size={14} />
                      <span>Reorder</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => router.push('/order-confirmation')}
                      style={{
                        backgroundColor: 'var(--text-main)',
                        color: 'var(--bg-card)',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '10px 18px',
                        fontWeight: '800',
                        fontSize: '13.5px',
                        cursor: 'pointer'
                      }}
                    >
                      Track Order
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <BottomNav dark />
    </>
  );
}
