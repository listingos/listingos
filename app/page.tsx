'use client';
import { useState } from 'react';

export default function Home() {
  const [address, setAddress] = useState('47 Lakeview Drive, Austin TX 78732');
  const [beds, setBeds] = useState('4');
  const [baths, setBaths] = useState('3');
  const [sqft, setSqft] = useState('2840');
  const [price, setPrice] = useState('$875,000');
  const [features, setFeatures] = useState("Lake views, heated pool, chef's kitchen, 3-car garage");
  const [tone, setTone] = useState('Warm');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  const tones = ['Luxury', 'Warm', 'Bold', 'Professional'];

  async function generate() {
    if (!address) return;
    setLoading(true);
    setShowOutput(false);

    await new Promise(r => setTimeout(r, 2000));

    setOutput(`Wake up to lake views every morning in this stunning ${beds}-bed, ${baths}-bath retreat. The chef's kitchen flows to a deck overlooking the heated pool, while the primary suite delivers a true spa experience. Smart home throughout, 3-car garage, and a new roof — all at ${price}. Schedule your private showing today.`);
    setShowOutput(true);
    setLoading(false);
  }

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#F8F4EE', minHeight: '100vh', color: '#141210' }}>

      {/* NAV */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', height: '58px', background: 'white', borderBottom: '1px solid #DDD6C8', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: '700' }}>
          Listing<span style={{ color: '#C49535' }}>OS</span>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <a href="#pricing" style={{ fontSize: '13px', color: '#7A7066', textDecoration: 'none' }}>Pricing</a>
          <a href="/sign-in" style={{ fontSize: '13px', color: '#141210', textDecoration: 'none', padding: '7px 16px', border: '1px solid #DDD6C8', borderRadius: '8px' }}>Sign in</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding: '80px 24px 60px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', fontSize: '11px', fontWeight: '500', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#A07A20', background: '#FBF3E2', border: '1px solid rgba(196,149,53,.25)', padding: '5px 14px', borderRadius: '20px', marginBottom: '24px' }}>
          AI Content Engine · Real Estate
        </div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: '700', lineHeight: '1.1', letterSpacing: '-1px', marginBottom: '20px' }}>
          One listing.<br /><em style={{ color: '#C49535' }}>Every piece of content.</em><br />60 seconds.
        </h1>
        <p style={{ fontSize: '17px', color: '#7A7066', maxWidth: '480px', margin: '0 auto 40px', lineHeight: '1.7' }}>
          Enter your listing details below and get your MLS copy, Facebook ad, email blast, video script, and 4 more — free, no account needed.
        </p>

        {/* DEMO FORM */}
        <div style={{ maxWidth: '860px', margin: '0 auto', background: 'white', border: '1px solid #DDD6C8', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 32px rgba(0,0,0,.07)' }}>

          {/* STEP BAR */}
          <div style={{ display: 'flex', borderBottom: '1px solid #DDD6C8', background: '#F8F4EE' }}>
            {['1 · Listing details', '2 · Generate', '3 · Content kit'].map((s, i) => (
              <div key={i} style={{ flex: 1, padding: '10px 16px', fontSize: '12px', fontWeight: '500', color: i === 0 ? '#141210' : '#7A7066', borderRight: i < 2 ? '1px solid #DDD6C8' : 'none', background: i === 0 ? 'white' : 'transparent' }}>{s}</div>
            ))}
          </div>

          {/* FORM */}
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', letterSpacing: '0.07em', textTransform: 'uppercase', color: '#7A7066', marginBottom: '5px' }}>Property address</label>
                <input value={address} onChange={e => setAddress(e.target.value)} style={{ width: '100%', background: '#F8F4EE', border: '1px solid #DDD6C8', borderRadius: '8px', padding: '9px 12px', fontSize: '14px', color: '#141210', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', letterSpacing: '0.07em', textTransform: 'uppercase', color: '#7A7066', marginBottom: '5px' }}>Beds</label>
                <input value={beds} onChange={e => setBeds(e.target.value)} style={{ width: '100%', background: '#F8F4EE', border: '1px solid #DDD6C8', borderRadius: '8px', padding: '9px 12px', fontSize: '14px', color: '#141210', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', letterSpacing: '0.07em', textTransform: 'uppercase', color: '#7A7066', marginBottom: '5px' }}>Baths</label>
                <input value={baths} onChange={e => setBaths(e.target.value)} style={{ width: '100%', background: '#F8F4EE', border: '1px solid #DDD6C8', borderRadius: '8px', padding: '9px 12px', fontSize: '14px', color: '#141210', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', letterSpacing: '0.07em', textTransform: 'uppercase', color: '#7A7066', marginBottom: '5px' }}>Sqft</label>
                <input value={sqft} onChange={e => setSqft(e.target.value)} style={{ width: '100%', background: '#F8F4EE', border: '1px solid #DDD6C8', borderRadius: '8px', padding: '9px 12px', fontSize: '14px', color: '#141210', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', letterSpacing: '0.07em', textTransform: 'uppercase', color: '#7A7066', marginBottom: '5px' }}>Price</label>
                <input value={price} onChange={e => setPrice(e.target.value)} style={{ width: '100%', background: '#F8F4EE', border: '1px solid #DDD6C8', borderRadius: '8px', padding: '9px 12px', fontSize: '14px', color: '#141210', outline: 'none' }} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', letterSpacing: '0.07em', textTransform: 'uppercase', color: '#7A7066', marginBottom: '5px' }}>Key features</label>
                <input value={features} onChange={e => setFeatures(e.target.value)} style={{ width: '100%', background: '#F8F4EE', border: '1px solid #DDD6C8', borderRadius: '8px', padding: '9px 12px', fontSize: '14px', color: '#141210', outline: 'none' }} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', letterSpacing: '0.07em', textTransform: 'uppercase', color: '#7A7066', marginBottom: '8px' }}>Brand tone</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {tones.map(t => (
                    <button key={t} onClick={() => setTone(t)} style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid', borderColor: tone === t ? '#141210' : '#DDD6C8', background: tone === t ? '#141210' : '#F8F4EE', color: tone === t ? 'white' : '#7A7066', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}>{t}</button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid #DDD6C8' }}>
              <span style={{ fontSize: '12px', color: '#7A7066' }}>✦ Free — no account needed for your first kit</span>
              <button onClick={generate} disabled={loading} style={{ background: loading ? '#888' : '#141210', color: 'white', border: 'none', borderRadius: '10px', padding: '12px 28px', fontFamily: 'Georgia, serif', fontSize: '17px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Generating…' : 'Generate content kit →'}
              </button>
            </div>

            {/* OUTPUT */}
            {showOutput && (
              <div style={{ marginTop: '20px', borderTop: '1px solid #DDD6C8', paddingTop: '20px' }}>
                <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid #DDD6C8', marginBottom: '16px' }}>
                  {['MLS', 'Facebook', 'Instagram', 'Email', 'Video', 'Open house 🔒', 'Neighborhood 🔒'].map((t, i) => (
                    <div key={i} style={{ fontSize: '11px', fontWeight: '500', padding: '8px 12px', color: i === 0 ? '#141210' : '#7A7066', borderBottom: i === 0 ? '2px solid #C49535' : '2px solid transparent', marginBottom: '-1px', whiteSpace: 'nowrap', cursor: 'pointer' }}>{t}</div>
                  ))}
                </div>
                <div style={{ background: '#F8F4EE', borderRadius: '10px', padding: '16px', fontSize: '14px', lineHeight: '1.8', color: '#2E2A25', marginBottom: '14px' }}>
                  {output}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', color: '#7A7066' }}>Showing <strong style={{ color: '#141210' }}>1 of 3 free pieces</strong> · Sign up to unlock all 7</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => navigator.clipboard.writeText(output)} style={{ fontSize: '12px', padding: '7px 14px', borderRadius: '8px', border: '1px solid #DDD6C8', background: 'white', color: '#141210', cursor: 'pointer' }}>Copy</button>
                    <a href="/sign-up" style={{ fontSize: '12px', padding: '7px 16px', borderRadius: '8px', background: '#141210', color: 'white', textDecoration: 'none', fontWeight: '500' }}>Unlock all 7 free →</a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '60px 40px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#A07A20', marginBottom: '10px' }}>How it works</div>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', fontWeight: '700', marginBottom: '32px' }}>Four steps. Full content kit.</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {[
            { n: '01', t: 'Enter listing details', d: 'Address, specs, features. Takes 90 seconds.' },
            { n: '02', t: 'Set your brand voice', d: 'Luxury, warm, bold — set once, used everywhere.' },
            { n: '03', t: 'Generate in 60 seconds', d: 'All 7 pieces written simultaneously.' },
            { n: '04', t: 'Copy and publish', d: 'Paste into MLS, Facebook, Mailchimp.' },
          ].map(s => (
            <div key={s.n} style={{ background: 'white', border: '1px solid #DDD6C8', borderRadius: '12px', padding: '22px' }}>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: '40px', color: '#DDD6C8', marginBottom: '10px', lineHeight: '1' }}>{s.n}</div>
              <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '6px' }}>{s.t}</div>
              <div style={{ fontSize: '13px', color: '#7A7066', lineHeight: '1.6' }}>{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* OUTPUTS */}
      <section style={{ background: '#141210', padding: '60px 40px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C49535', marginBottom: '10px' }}>What you get</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', fontWeight: '700', color: 'white', marginBottom: '24px' }}>7 pieces per listing</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {[
              { d: '#9B8FE0', n: 'MLS description', s: 'SEO-ready, MLS-compliant' },
              { d: '#E07A5F', n: 'Facebook ad', s: 'Headline + body + CTA' },
              { d: '#E07A9B', n: 'Instagram caption', s: 'Copy + hashtags' },
              { d: '#5F8FE0', n: 'Google Ads', s: '3 headlines + 2 descriptions' },
              { d: '#5FC9A0', n: 'Email blast', s: 'Subject + full body' },
              { d: '#E0B35F', n: 'Video script', s: '75-sec scene-by-scene' },
              { d: '#E07A7A', n: 'Open house invite', s: 'Social + email versions' },
              { d: '#7AB87A', n: 'Neighborhood blurb', s: 'Lifestyle + walkability' },
            ].map(o => (
              <div key={o.n} style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: '10px', padding: '16px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: o.d, marginBottom: '8px' }}></div>
                <div style={{ fontSize: '13px', fontWeight: '500', color: 'white', marginBottom: '3px' }}>{o.n}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.45)' }}>{o.s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: '80px 40px', maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#A07A20', marginBottom: '10px' }}>Pricing</div>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', fontWeight: '700', marginBottom: '40px' }}>Start free. Pay when it saves you time.</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', textAlign: 'left' }}>
          {[
            { name: 'Solo', price: '$49', limit: '5 listings/month · 5 photos', features: ['All 7 content types', 'Photo analysis', 'Brand tone setting', 'Copy & export'], featured: false },
            { name: 'Pro', price: '$99', limit: '20 listings/month · 15 photos', features: ['Everything in Solo', 'Full 15-photo analysis', 'Custom brand voice', 'Regenerate variants', 'Priority support'], featured: true },
            { name: 'Team', price: '$249', limit: 'Unlimited listings · 15 photos', features: ['Everything in Pro', '10 agent seats', 'Shared brand kit', 'Usage analytics', 'Dedicated onboarding'], featured: false },
          ].map(p => (
            <div key={p.name} style={{ background: 'white', border: p.featured ? '2px solid #C49535' : '1px solid #DDD6C8', borderRadius: '18px', padding: '28px 24px', position: 'relative' }}>
              {p.featured && <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#C49535', color: 'white', fontSize: '11px', fontWeight: '600', padding: '3px 14px', borderRadius: '20px', whiteSpace: 'nowrap' }}>Most popular</div>}
              <div style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.07em', textTransform: 'uppercase', color: '#7A7066', marginBottom: '8px' }}>{p.name}</div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: '44px', fontWeight: '700', lineHeight: '1', marginBottom: '6px' }}>{p.price}<span style={{ fontSize: '14px', fontWeight: '400', color: '#7A7066' }}>/mo</span></div>
              <div style={{ fontSize: '13px', color: '#7A7066', marginBottom: '20px' }}>{p.limit}</div>
              {p.features.map(f => (
                <div key={f} style={{ fontSize: '13px', color: '#2E2A25', padding: '4px 0', display: 'flex', gap: '8px' }}>
                  <span style={{ color: '#1E6645', fontWeight: '600' }}>✓</span>{f}
                </div>
              ))}
              <a href="/sign-up" style={{ display: 'block', marginTop: '20px', padding: '12px', borderRadius: '10px', textAlign: 'center', fontSize: '15px', fontWeight: '500', textDecoration: 'none', background: p.featured ? '#C49535' : 'transparent', color: p.featured ? 'white' : '#141210', border: p.featured ? '1.5px solid #C49535' : '1.5px solid #141210' }}>
                Get started
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER CTA */}
      <section style={{ background: '#141210', padding: '80px 40px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '44px', fontWeight: '700', color: 'white', marginBottom: '14px', lineHeight: '1.2' }}>Stop spending 3 hours<br />writing listing content.</h2>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,.5)', marginBottom: '30px' }}>First kit is free. No credit card needed.</p>
        <a href="/sign-up" style={{ display: 'inline-block', background: '#C49535', color: '#141210', border: 'none', borderRadius: '11px', padding: '15px 36px', fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: '700', textDecoration: 'none' }}>
          Generate your first listing free →
        </a>
      </section>

      <footer style={{ padding: '24px 40px', borderTop: '1px solid #DDD6C8', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#7A7066', background: '#F8F4EE' }}>
        <span>© 2025 ListingOS</span>
        <span>Built for agents who would rather be closing.</span>
      </footer>

    </main>
  );
}