import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const PLAN_CONFIG: Record<string, { listings_limit: number; photo_limit: number }> = {
  solo:  { listings_limit: 5,  photo_limit: 5  },
  pro:   { listings_limit: 20, photo_limit: 15 },
  team:  { listings_limit: -1, photo_limit: 15 },
};

const PRICE_TO_PLAN: Record<string, string> = {
  'price_1THPLLCxBEAWBS3AFBI3ViKW': 'solo',
  'price_1THPLjCxBEAWBS3Afz30NbnS': 'pro',
  'price_1THPLuCxBEAWBS3AKEh16Ecn': 'team',
};

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const body = await req.text();
  const sig  = req.headers.get('stripe-signature')!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body, sig, process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook error:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const full = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items'],
    });

    const priceId = full.line_items?.data[0]?.price?.id!;
    const plan = PRICE_TO_PLAN[priceId] ?? 'solo';
    const cfg = PLAN_CONFIG[plan];

    await supabase.from('users').upsert({
      clerk_user_id: session.client_reference_id ?? session.customer_email,
      email: session.customer_email,
      stripe_customer_id: session.customer as string,
      plan,
      listings_limit: cfg.listings_limit,
      photo_limit: cfg.photo_limit,
      usage_count: 0,
    }, { onConflict: 'email' });
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription;
    await supabase.from('users')
      .update({ plan: 'free', listings_limit: 0, photo_limit: 0 })
      .eq('stripe_customer_id', sub.customer as string);
  }

  return Response.json({ ok: true });
}