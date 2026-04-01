'use client';
import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Pricing() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const plans = [
    {
      name: 'Solo',
      price: '$49',
      period: '/mo',
      limit: '5 listings/month · 5 photos',
      priceId: 'price_1THPLLCxBEAWBS3AFBI3ViKW',
      features: ['All 7 content types', 'Photo analysis', 'Brand tone setting', 'Copy & export'],
      featured: false,
    },
    {
      name: 'Pro',
      price: '$99',
      period: '/mo',
      limit: '20 listings/month · 15 photos',
      priceId: 'price_1THPLjCxBEAWBS3Afz30NbnS',
      features: ['Everything in Solo', 'Full 15-photo analysis', 'Custom brand voice', 'Regenerate variants', 'Priority support'],
      featured: true,
    },
    {
      name: 'Team',
      price: '$249',
      period: '/mo',
      limit: 'Unlimited listings · 15 photos',
      priceId: 'price_1THPLuCxBEAWBS3AKEh16Ecn',
      features: ['Everything in Pro', '10 agent seats', 'Shared brand kit', 'Usage analytics', 'Dedicated onboarding'],
      featured: false,
    },
  ];

  async function subscribe(priceId: string, planName: string) {
    if (!user) {
      router.push('/sign-up');
      return;
    }
    setLoading(planName);
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceId,
        email: user.primaryEmailAddress?.emailAddress,
      }),
    });
    const { url } = await res.json();
    window.location.href = url;
  }

  return (
    <div style={{ fontFamily: 'sans-serif', background: '#F8F4EE', minHeight: '100vh' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', height: '58px', background: 'white', borderBottom: '1px solid #DDD6C8' }}>
        <a href="/" style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: '700', textDecoration: 'none', color: '#141210' }}>
          Listing<span style={{ color: '#C49535' }}>OS</span>
        </a>
        <a href="/dashboard" style={{ fontSize: '13px', color: '#141210', textDecoration: 'none', padding: '7px 16px', border: '1px solid #DDD6C8', borderRadius: '8px' }}>Dashboard</a>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#A07A20', marginBottom: '10px' }}>Pricing</div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '44px', fontWeight: '700', marginBottom: '14px' }}>Start free. Pay when it saves you time.</h1>
        <p style={{ fontSize: '16px', color: '#7A7066', marginBottom: '50px' }}>No contracts. Cancel anytime.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', textAlign: 'left' }}>
          {plans.map(p => (
            <div key={p.name} style={{ background: 'white', border: p.featured ? '2px solid #C49535' : '1px solid #DDD6C8', borderRadius: '18px', padding: '28px 24px', position: 'relative' }}>
              {p.featured && (
                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#C49535', color: 'white', fontSize: '11px', fontWeight: '600', padding: '3px 14px', borderRadius: '20px', whiteSpace: 'nowrap' }}>Most popular</div>
              )}
              <div style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.07em', textTransform: 'uppercase', color: '#7A7066', marginBottom: '8px' }}>{p.name}</div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: '44px', fontWeight: '700', lineHeight: '1', marginBottom: '6px' }}>
                {p.price}<span style={{ fontSize: '14px', fontWeight: '400', color: '#7A7066' }}>{p.period}</span>
              </div>
              <div style={{ fontSize: '13px', color: '#7A7066', marginBottom: '20px' }}>{p.limit}</div>
              {p.features.map(f => (
                <div key={f} style={{ fontSize: '13px', color: '#2E2A25', padding: '4px 0', display: 'flex', gap: '8px' }}>
                  <span style={{ color: '#1E6645', fontWeight: '600' }}>✓</span>{f}
                </div>
              ))}
              <button
                onClick={() => subscribe(p.priceId, p.name)}
                disabled={loading === p.name}
                style={{ display: 'block', width: '100%', marginTop: '20px', padding: '12px', borderRadius: '10px', textAlign: 'center', fontSize: '15px', fontWeight: '500', cursor: loading === p.name ? 'not-allowed' : 'pointer', background: p.featured ? '#C49535' : 'transparent', color: p.featured ? 'white' : '#141210', border: p.featured ? '1.5px solid #C49535' : '1.5px solid #141210' }}>
                {loading === p.name ? 'Loading...' : 'Get started'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}