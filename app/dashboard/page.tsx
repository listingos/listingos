'use client';
import { UserButton } from "@clerk/nextjs";
import { useState } from "react";

export default function Dashboard() {
  const [address, setAddress] = useState('');
  const [beds, setBeds] = useState('');
  const [baths, setBaths] = useState('');
  const [sqft, setSqft] = useState('');
  const [price, setPrice] = useState('');
  const [features, setFeatures] = useState('');
  const [openhouse, setOpenhouse] = useState('');
  const [tone, setTone] = useState('Warm');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('mls');
  const [generated, setGenerated] = useState(false);

  const tones = ['Luxury', 'Warm', 'Bold', 'Professional'];
  const tabs = [
    { key: 'mls', label: 'MLS', color: '#9B8FE0' },
    { key: 'facebook', label: 'Facebook', color: '#E07A5F' },
    { key: 'instagram', label: 'Instagram', color: '#E07A9B' },
    { key: 'google', label: 'Google Ads', color: '#5F8FE0' },
    { key: 'email', label: 'Email', color: '#5FC9A0' },
    { key: 'video', label: 'Video script', color: '#E0B35F' },
    { key: 'openhouse', label: 'Open house', color: '#E07A7A' },
    { key: 'neighborhood', label: 'Neighborhood', color: '#7AB87A' },
  ];

  function buildPrompt() {
    return `You are a top real estate copywriter. Generate all 7 content pieces for this listing. Use EXACTLY these section headers. No preamble.

PROPERTY: ${address} | ${beds}bd/${baths}ba | ${sqft} sqft | ${price} | Features: ${features} | Open house: ${openhouse || 'TBD'} | Tone: ${tone}

MLS_DESCRIPTION:
Compelling MLS copy, max 500 chars. Lead with lifestyle. No address. End with CTA.

FACEBOOK_AD:
HEADLINE: [under 40 chars]
BODY: [2-3 sentences, emotional]
CTA: [action]

INSTAGRAM_AD:
3-4 punchy lines. Then 8-10 hashtags.

GOOGLE_ADS:
HEADLINE 1: [max 30 chars]
HEADLINE 2: [max 30 chars]
HEADLINE 3: [max 30 chars]
DESC 1: [max 90 chars]
DESC 2: [max 90 chars]

EMAIL_BLAST:
SUBJECT: [compelling subject]
BODY: [3 paragraphs: hook, features, CTA]

VIDEO_SCRIPT:
75 seconds. Label scenes [ROOM NAME]. 1-2 sentences each. End with agent CTA.

OPEN_HOUSE:
SOCIAL: [3-line post]
EMAIL: [2-para announcement]

NEIGHBORHOOD:
3-4 sentences on lifestyle and why buyers love this area.`;
  }

  function parseOutput(text: string) {
    const headers: Record<string, string> = {
      mls: 'MLS_DESCRIPTION:',
      facebook: 'FACEBOOK_AD:',
      instagram: 'INSTAGRAM_AD:',
      google: 'GOOGLE_ADS:',
      email: 'EMAIL_BLAST:',
      video: 'VIDEO_SCRIPT:',
      openhouse: 'OPEN_HOUSE:',
      neighborhood: 'NEIGHBORHOOD:',
    };
    const order = ['mls','facebook','instagram','google','email','video','openhouse','neighborhood'];
    const result: Record<string, string> = {};
    for (let i = 0; i < order.length; i++) {
      const key = order[i];
      const header = headers[key];
      const nextKey = order[i + 1];
      const nextHeader = nextKey ? headers[nextKey] : null;
      const start = text.indexOf(header);
      if (start === -1) { result[key] = ''; continue; }
      const cs = start + header.length;
      const end = nextHeader ? text.indexOf(nextHeader, cs) : text.length;
      result[key] = text.slice(cs, end === -1 ? text.length : end).trim();
    }
    return result;
  }

  async function generate() {
    if (!address) { alert('Please enter a property address'); return; }
    setLoading(true);
    setGenerated(false);
    let fullText = '';

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: buildPrompt() }),
      });

      if (response.status === 403) {
        const err = await response.json();
        if (err.error === 'limit_reached') {
          alert(`You have used all ${err.limit} listings this month. Please upgrade your plan.`);
          setLoading(false);
          return;
        }
        if (err.error === 'no_subscription') {
          alert('Please subscribe to a plan to generate listings.');
          setLoading(false);
          return;
        }
      }

 const data = await response.json();
fullText = data.text;
    } catch(err) {
      alert('Something went wrong. Please try again.');
      setLoading(false);
      return;
    }
console.log('FULL TEXT:', fullText);
const parsed = parseOutput(fullText);
const cleaned: Record<string, string> = {};
Object.keys(parsed).forEach(key => {
  cleaned[key] = parsed[key].replace(/\*\*/g, '').trim();
});
setOutput(cleaned);
    setGenerated(true);
    setActiveTab('mls');
    setLoading(false);
  }

  function copyText(text: string) {
    navigator.clipboard.writeText(text);
    alert('Copied!');
  }

  return (
    <div style={{ fontFamily: 'sans-serif', background: '#F8F4EE', minHeight: '100vh' }}>

      {/* NAV */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', height: '58px', background: 'white', borderBottom: '1px solid #DDD6C8', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: '700' }}>
          Listing<span style={{ color: '#C49535' }}>OS</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
  <a href="/pricing" style={{ fontSize: '13px', color: '#141210', textDecoration: 'none', padding: '7px 16px', border: '1px solid #DDD6C8', borderRadius: '8px', background: 'white' }}>Upgrade plan</a>
  <UserButton />
</div>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', minHeight: 'calc(100vh - 58px)' }}>

        {/* LEFT PANEL */}
        <div style={{ background: 'white', borderRight: '1px solid #DDD6C8', padding: '24px', overflowY: 'auto' }}>
          <div style={{ fontSize: '16px', fontWeight: '600', fontFamily: 'Georgia, serif', marginBottom: '20px' }}>New listing</div>

          {/* ADDRESS */}
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', letterSpacing: '0.07em', textTransform: 'uppercase', color: '#7A7066', marginBottom: '5px' }}>Property address</label>
            <input value={address} onChange={e => setAddress(e.target.value)} placeholder="47 Lakeview Drive, Austin TX 78732" style={{ width: '100%', background: '#F8F4EE', border: '1px solid #DDD6C8', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', color: '#141210', outline: 'none' }} />
          </div>

          {/* BEDS BATHS SQFT */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', letterSpacing: '0.07em', textTransform: 'uppercase', color: '#7A7066', marginBottom: '5px' }}>Beds</label>
              <input value={beds} onChange={e => setBeds(e.target.value)} placeholder="4" style={{ width: '100%', background: '#F8F4EE', border: '1px solid #DDD6C8', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', color: '#141210', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', letterSpacing: '0.07em', textTransform: 'uppercase', color: '#7A7066', marginBottom: '5px' }}>Baths</label>
              <input value={baths} onChange={e => setBaths(e.target.value)} placeholder="3" style={{ width: '100%', background: '#F8F4EE', border: '1px solid #DDD6C8', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', color: '#141210', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', letterSpacing: '0.07em', textTransform: 'uppercase', color: '#7A7066', marginBottom: '5px' }}>Sqft</label>
              <input value={sqft} onChange={e => setSqft(e.target.value)} placeholder="2840" style={{ width: '100%', background: '#F8F4EE', border: '1px solid #DDD6C8', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', color: '#141210', outline: 'none' }} />
            </div>
          </div>

          {/* PRICE */}
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', letterSpacing: '0.07em', textTransform: 'uppercase', color: '#7A7066', marginBottom: '5px' }}>List price</label>
            <input value={price} onChange={e => setPrice(e.target.value)} placeholder="$875,000" style={{ width: '100%', background: '#F8F4EE', border: '1px solid #DDD6C8', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', color: '#141210', outline: 'none' }} />
          </div>

          {/* FEATURES */}
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', letterSpacing: '0.07em', textTransform: 'uppercase', color: '#7A7066', marginBottom: '5px' }}>Key features</label>
            <textarea value={features} onChange={e => setFeatures(e.target.value)} placeholder="Pool, lake views, chef's kitchen..." rows={3} style={{ width: '100%', background: '#F8F4EE', border: '1px solid #DDD6C8', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', color: '#141210', outline: 'none', resize: 'vertical' }} />
          </div>

          {/* OPEN HOUSE */}
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', letterSpacing: '0.07em', textTransform: 'uppercase', color: '#7A7066', marginBottom: '5px' }}>Open house (optional)</label>
            <input value={openhouse} onChange={e => setOpenhouse(e.target.value)} placeholder="Saturday, April 5 · 1–4 PM" style={{ width: '100%', background: '#F8F4EE', border: '1px solid #DDD6C8', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', color: '#141210', outline: 'none' }} />
          </div>

          {/* TONE */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', letterSpacing: '0.07em', textTransform: 'uppercase', color: '#7A7066', marginBottom: '8px' }}>Brand tone</label>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {tones.map(t => (
                <button key={t} onClick={() => setTone(t)} style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid', borderColor: tone === t ? '#141210' : '#DDD6C8', background: tone === t ? '#141210' : '#F8F4EE', color: tone === t ? 'white' : '#7A7066', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}>{t}</button>
              ))}
            </div>
          </div>

          {/* GENERATE BUTTON */}
          <button onClick={generate} disabled={loading} style={{ width: '100%', background: loading ? '#888' : '#141210', color: 'white', border: 'none', borderRadius: '10px', padding: '14px', fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Generating…' : 'Generate content kit →'}
          </button>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ padding: '24px', overflowY: 'auto' }}>
          {!generated ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#7A7066', textAlign: 'center', padding: '60px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏡</div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: '22px', color: '#2E2A25', marginBottom: '8px' }}>Your content kit appears here</div>
              <div style={{ fontSize: '14px', maxWidth: '280px', lineHeight: '1.6' }}>Fill in the listing details and click Generate. All 7 pieces ready in 60 seconds.</div>
            </div>
          ) : (
            <div>
              {/* TABS */}
              <div style={{ display: 'flex', borderBottom: '1px solid #DDD6C8', marginBottom: '20px', overflowX: 'auto' }}>
                {tabs.map(t => (
                  <div key={t.key} onClick={() => setActiveTab(t.key)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 14px', cursor: 'pointer', color: activeTab === t.key ? '#141210' : '#7A7066', borderBottom: activeTab === t.key ? '2px solid #C49535' : '2px solid transparent', marginBottom: '-1px', whiteSpace: 'nowrap', fontSize: '12px', fontWeight: '500' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: t.color, display: 'inline-block' }}></span>
                    {t.label}
                  </div>
                ))}
              </div>

              {/* CONTENT */}
              <div style={{ background: 'white', border: '1px solid #DDD6C8', borderRadius: '14px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.07em', textTransform: 'uppercase', color: '#7A7066' }}>
                    {tabs.find(t => t.key === activeTab)?.label}
                  </span>
                  <button onClick={() => copyText(output[activeTab] || '')} style={{ fontSize: '11px', padding: '5px 12px', borderRadius: '6px', border: '1px solid #DDD6C8', background: 'transparent', color: '#7A7066', cursor: 'pointer' }}>
                    Copy
                  </button>
                </div>
                <div style={{ fontSize: '14px', lineHeight: '1.8', color: '#2E2A25', whiteSpace: 'pre-wrap' }}>
                  {output[activeTab] || 'Generating...'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}