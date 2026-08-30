'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { BottomNav } from '../../../components/BottomNav';

export default function FAQPage() {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How fast is campus hostel delivery?',
      a: 'Most food and grocery deliveries arrive within 15 to 30 minutes depending on the location of the campus store.'
    },
    {
      q: 'What payment methods are supported on Droply?',
      a: 'You can pay using debit/credit cards, in-app wallet balance, or cash on delivery at your hostel block.'
    },
    {
      q: 'How do I contact my delivery rider?',
      a: 'Once an order is placed, go to the Track Order screen where you can chat or call your rider directly.'
    },
    {
      q: 'Can I cancel an order after placing it?',
      a: 'Orders can be cancelled free of charge within 2 minutes of placing before the restaurant starts preparing your meal.'
    }
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
            Frequently Asked Questions
          </h2>
          
          <div style={{ width: '40px' }} />
        </div>

        {/* FAQ List */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '24px',
                  padding: '20px',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer'
                }}
                onClick={() => setOpenIndex(isOpen ? null : idx)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '15.5px', fontWeight: '800', color: 'var(--text-main)', flex: 1, paddingRight: '12px' }}>
                    {faq.q}
                  </h4>
                  {isOpen ? <ChevronUp size={18} style={{ color: 'var(--primary-orange)' }} /> : <ChevronDown size={18} style={{ color: 'var(--text-muted)' }} />}
                </div>

                {isOpen && (
                  <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginTop: '12px', lineHeight: '1.5', borderTop: '1px solid var(--border-color)', paddingTop: '12px', fontWeight: '500' }}>
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <BottomNav dark />
    </>
  );
}
