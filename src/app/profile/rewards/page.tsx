'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Award, Gift, Check } from 'lucide-react';
import { BottomNav } from '../../../components/BottomNav';

export default function RewardsPage() {
  const router = useRouter();
  const [points, setPoints] = useState(2450);
  const [claimedRewards, setClaimedRewards] = useState<string[]>([]);

  const rewards = [
    { id: 'r1', title: '₦500 Off Delivery', cost: 500, desc: 'Valid for all campus food orders above ₦1,500' },
    { id: 'r2', title: 'Free Green Tea Pack', cost: 800, desc: 'Redeem at Mars Cafe during lecture hours' },
    { id: 'r3', title: '₦1,000 Grocery Pack Voucher', cost: 1500, desc: 'Valid at 4u Supermarket campus branch' }
  ];

  const handleClaim = (id: string, cost: number) => {
    if (points >= cost) {
      setPoints(points - cost);
      setClaimedRewards([...claimedRewards, id]);
      alert('Reward claimed successfully! Added to your Promo Codes.');
    } else {
      alert('Insufficient reward points.');
    }
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
            Rewards
          </h2>
          
          <div style={{ width: '40px' }} />
        </div>

        {/* Loyalty Points Banner */}
        <div style={{ padding: '20px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #1C1C1E 0%, #3A3A3C 100%)',
            borderRadius: '24px',
            padding: '24px',
            color: 'white',
            boxShadow: 'var(--shadow-md)',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '12px', opacity: 0.7, fontWeight: '600' }}>Campus Rewards Balance</p>
                <h3 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--primary-orange)', marginTop: '4px' }}>
                  {points.toLocaleString()} <span style={{ fontSize: '14px', color: 'white' }}>pts</span>
                </h3>
              </div>
              
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: 'rgba(232, 90, 29, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-orange)'
              }}>
                <Award size={28} />
              </div>
            </div>
            
            <p style={{ fontSize: '12px', opacity: 0.6, marginTop: '16px' }}>
              Earn 10 points for every ₦100 spent on Droply orders.
            </p>
          </div>
        </div>

        {/* Available Vouchers */}
        <div style={{ padding: '0 20px 20px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>
            Available Rewards
          </h3>

          {rewards.map((r) => {
            const isClaimed = claimedRewards.includes(r.id);
            return (
              <div
                key={r.id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '24px',
                  padding: '20px',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ flex: 1, paddingRight: '12px' }}>
                  <h4 style={{ fontSize: '15.5px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>
                    {r.title}
                  </h4>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '8px', lineHeight: '1.3', fontWeight: '500' }}>
                    {r.desc}
                  </p>
                  <span style={{ fontSize: '13px', fontWeight: '900', color: 'var(--primary-orange)' }}>
                    {r.cost} pts
                  </span>
                </div>

                <button
                  onClick={() => !isClaimed && handleClaim(r.id, r.cost)}
                  disabled={isClaimed}
                  style={{
                    backgroundColor: isClaimed ? 'rgba(46,125,50,0.15)' : 'var(--primary-orange)',
                    color: isClaimed ? '#2E7D32' : 'white',
                    border: 'none',
                    borderRadius: '14px',
                    padding: '10px 18px',
                    fontWeight: '800',
                    fontSize: '13px',
                    cursor: isClaimed ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    flexShrink: 0
                  }}
                >
                  {isClaimed ? <Check size={14} /> : <Gift size={14} />}
                  <span>{isClaimed ? 'Claimed' : 'Claim'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <BottomNav dark />
    </>
  );
}
