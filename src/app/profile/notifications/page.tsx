'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { BottomNav } from '../../../components/BottomNav';

export default function NotificationsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    push: true,
    orderUpdates: true,
    promos: true,
    sms: false
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const notificationItems = [
    { key: 'push', title: 'Push Notifications', desc: 'Receive real-time push alerts on your phone' },
    { key: 'orderUpdates', title: 'Order Tracking Updates', desc: 'Get notified when your meal is prepared or out for delivery' },
    { key: 'promos', title: 'Promotions & Discounts', desc: 'Special discount codes and campus store offers' },
    { key: 'sms', title: 'SMS Text Alerts', desc: 'Receive text message notifications on delivery status' }
  ];

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
            Notification Settings
          </h2>
          
          <div style={{ width: '40px' }} />
        </div>

        {/* Notifications toggles list */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {notificationItems.map((item) => {
            const isEnabled = settings[item.key as keyof typeof settings];
            return (
              <div
                key={item.key}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '24px',
                  padding: '20px',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ flex: 1, paddingRight: '16px' }}>
                  <h4 style={{ fontSize: '15.5px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.4', fontWeight: '500' }}>
                    {item.desc}
                  </p>
                </div>

                {/* Toggle switch button */}
                <div
                  onClick={() => toggle(item.key as keyof typeof settings)}
                  style={{
                    width: '50px',
                    height: '28px',
                    backgroundColor: isEnabled ? 'var(--primary-orange)' : 'var(--border-color)',
                    borderRadius: '14px',
                    padding: '2px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    flexShrink: 0
                  }}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    transform: isEnabled ? 'translateX(22px)' : 'translateX(0)',
                    transition: 'transform 0.2s ease'
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <BottomNav dark />
    </>
  );
}
