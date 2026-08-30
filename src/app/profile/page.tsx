'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Wallet, 
  Award, 
  Tag, 
  Bell, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  Briefcase,
  Star,
  ShoppingBag
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { BottomNav } from '../../components/BottomNav';

export default function ProfilePage() {
  const router = useRouter();
  const { user, promoCodeApplied } = useCart();

  const menuItems = [
    { id: 'orders', label: 'Order History', icon: <ShoppingBag size={22} />, path: '/profile/orders' },
    { id: 'account', label: 'Account', icon: <User size={22} />, path: null },
    { id: 'wallet', label: 'Wallet', icon: <Wallet size={22} />, badge: `₦${user.walletBalance.toLocaleString()}`, path: null },
    { id: 'rewards', label: 'Rewards', icon: <Award size={22} />, path: '/profile/rewards' },
    { id: 'promo', label: 'Promo Codes', icon: <Tag size={22} />, badge: promoCodeApplied || 'NSUKFRESH', path: null },
    { id: 'notifications', label: 'Notification', icon: <Bell size={22} />, path: '/profile/notifications' },
    { id: 'faq', label: 'FAQ', icon: <HelpCircle size={22} />, path: '/profile/faq' },
    { id: 'logout', label: 'Log out', icon: <LogOut size={22} />, danger: true, path: null }
  ];

  const handleMenuClick = (item: typeof menuItems[0]) => {
    if (item.path) {
      router.push(item.path);
    } else if (item.id === 'logout') {
      if (confirm('Are you sure you want to log out?')) {
        alert('Logged out successfully.');
      }
    } else if (item.id === 'promo') {
      alert('Active Promo Code: NSUKFRESH (Save ₦150 on your orders!)');
    } else if (item.id === 'wallet') {
      alert(`Wallet Balance: ₦${user.walletBalance.toLocaleString()}`);
    } else {
      alert(`Account Settings: ${user.name} (${user.username}@nsuk.edu.ng)`);
    }
  };

  return (
    <>
      <div className="app-content animate-fade-in" style={{ backgroundColor: 'var(--bg-primary)', paddingBottom: '110px' }}>
        {/* Profile Header Block */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '28px 20px 24px 20px',
          color: 'var(--text-main)',
          textAlign: 'center',
          backgroundColor: 'var(--bg-card)',
          borderRadius: '24px',
          marginBottom: '16px',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border-color)'
        }}>
          {/* Avatar with Orange Border */}
          <div style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            border: '3px solid var(--primary-orange)',
            padding: '3px',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--bg-primary)',
            fontSize: '42px',
            boxShadow: '0 6px 20px rgba(232, 90, 29, 0.2)'
          }}>
            👨‍🎓
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
            {user.name}
          </h2>

          {/* Sub Badges */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
            <div 
              onClick={() => router.push('/profile/orders')}
              style={{
                backgroundColor: 'var(--primary-orange)',
                color: 'white',
                fontSize: '12px',
                fontWeight: '700',
                padding: '5px 12px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer'
              }}
            >
              <Briefcase size={13} />
              <span>{user.ordersCount}</span>
            </div>

            <div style={{
              backgroundColor: 'var(--primary-orange)',
              color: 'white',
              fontSize: '12px',
              fontWeight: '700',
              padding: '5px 12px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              <Star size={13} fill="white" />
              <span>{user.rating}</span>
            </div>
          </div>
        </div>

        {/* Profile Options List */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '24px',
          padding: '24px 20px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border-color)'
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '16px' }}>
            Profile Options
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {menuItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleMenuClick(item)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 0',
                  borderBottom: item.id === 'logout' ? 'none' : '1px solid var(--border-color)',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: item.danger ? '#FF3B30' : 'var(--text-main)' }}>
                  {item.icon}
                  <span style={{ fontSize: '15px', fontWeight: '600' }}>{item.label}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {item.badge && (
                    <span style={{
                      backgroundColor: 'var(--primary-orange-light)',
                      color: 'var(--primary-orange)',
                      fontSize: '12px',
                      fontWeight: '800',
                      padding: '3px 8px',
                      borderRadius: '8px'
                    }}>
                      {item.badge}
                    </span>
                  )}
                  {!item.danger && <ChevronRight size={18} style={{ color: 'var(--primary-orange)' }} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
